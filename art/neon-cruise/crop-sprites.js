/**
 * SKG-100 Commit 5.1 — Vehicle sprite crop + chroma-key pipeline (v3).
 *
 * Reads art/neon-cruise/vehicles-main-sheet-v3.png (pure rear view, solid
 * magenta #FF00FF background, NO ground shadows, near-black tinted glass),
 * crops 3 bounding boxes from the Phase A.2 picker manifest (re-run against
 * v3), applies a two-pass magenta chroma-key (hard cut + 1px alpha feather),
 * resizes to 500px wide (retina-safe for in-game display), base64-encodes
 * each sprite, and writes:
 *   art/neon-cruise/sprites-v3.json         — runtime base64 data URIs
 *
 * Kept in repo as reference for future vehicle additions / re-runs.
 *
 * NOTE (history): Commit 5 v2 sprites carried dark-magenta painted ground
 * shadows that survived the hard chroma-key. An iterative adjacency-gated
 * pass 2 was attempted but hit a geometry wall (feather pixels broke the
 * adjacency chain to shadow islands). Resolved by re-running Gemini with
 * an explicit "no ground shadow" instruction — v3 source art is clean and
 * doesn't need pass 2. The iterative cleanup logic was removed in 5.1.
 *
 * Usage (from repo root):
 *   npm install --no-save sharp    # if not already installed locally
 *   node art/neon-cruise/crop-sprites.js
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SOURCE = path.join(__dirname, 'vehicles-main-sheet-v3.png');
const OUTPUT = path.join(__dirname, 'sprites-v3.json');

// Manifest — exported from picker (Phase A.2 patched for v3) against v3 sheet.
const MANIFEST = {
  sourceWidth: 3616,
  sourceHeight: 1184,
  sprites: {
    'road-runner': { x: 203,  y: 136, w: 871, h: 818 },
    'sunset-fury': { x: 1361, y: 325, w: 900, h: 629 },
    'lil-kart':    { x: 2587, y: 334, w: 848, h: 620 },
  },
};

const PADDING = 4;           // bounding box expand, clamped to sheet bounds
const TARGET_WIDTH = 500;    // retina-safe display size (game renders at ~160-300px)
const FEATHER_ALPHA = 180;   // 1px edge alpha for soft key (of 255)

// ── Chroma-key predicates ───────────────────────────────────────────
// Magenta #FF00FF background. Two bands so anti-aliased edge pixels also cut.
function isHardMagenta(r, g, b) {
  return r > 220 && g < 40 && b > 220;
}
function isNearMagenta(r, g, b) {
  return r > 200 && g < 60 && b > 200;
}

// ── Two-pass chroma-key ─────────────────────────────────────────────
// Pass 1: hard cut — alpha 0 on any magenta-ish pixel, 255 otherwise.
// Pass 2: 1px edge feather — any opaque pixel adjacent to a transparent
//         one gets alpha = FEATHER_ALPHA. Softens hard edge exactly 1px.
function chromaKey(buf, width, height, channels) {
  if (channels !== 4) throw new Error('Expected RGBA buffer');
  const total = width * height;

  // Pass 1: hard cut (read original RGB only; alpha gets rewritten)
  const alpha = new Uint8Array(total);
  for (let i = 0; i < total; i++) {
    const r = buf[i * 4];
    const g = buf[i * 4 + 1];
    const b = buf[i * 4 + 2];
    if (isHardMagenta(r, g, b) || isNearMagenta(r, g, b)) {
      alpha[i] = 0;
    } else {
      alpha[i] = 255;
    }
  }

  // Pass 2: 1px alpha feather — check 4-connected neighbors
  const feathered = new Uint8Array(total);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = y * width + x;
      if (alpha[i] !== 255) {
        feathered[i] = alpha[i];
        continue;
      }
      let hasTransparentNeighbor = false;
      if (x > 0          && alpha[i - 1]      === 0) hasTransparentNeighbor = true;
      else if (x < width - 1  && alpha[i + 1]      === 0) hasTransparentNeighbor = true;
      else if (y > 0          && alpha[i - width]  === 0) hasTransparentNeighbor = true;
      else if (y < height - 1 && alpha[i + width]  === 0) hasTransparentNeighbor = true;
      feathered[i] = hasTransparentNeighbor ? FEATHER_ALPHA : 255;
    }
  }

  // Write back into buffer alpha channel
  for (let i = 0; i < total; i++) {
    buf[i * 4 + 3] = feathered[i];
  }
  return buf;
}

// ── Main ────────────────────────────────────────────────────────────
async function main() {
  if (!fs.existsSync(SOURCE)) {
    console.error('STOP: source sheet not found at ' + SOURCE);
    process.exit(1);
  }

  const meta = await sharp(SOURCE).metadata();
  console.log('Source: ' + meta.width + 'x' + meta.height);
  if (meta.width !== MANIFEST.sourceWidth || meta.height !== MANIFEST.sourceHeight) {
    console.error(
      'STOP: source dims (' + meta.width + 'x' + meta.height +
      ') do not match manifest (' + MANIFEST.sourceWidth + 'x' + MANIFEST.sourceHeight + ')'
    );
    process.exit(1);
  }

  const results = {};
  const metrics = {};
  let totalB64 = 0;

  for (const [id, box] of Object.entries(MANIFEST.sprites)) {
    // 4px padding, clamped
    const x = Math.max(0, box.x - PADDING);
    const y = Math.max(0, box.y - PADDING);
    const right  = Math.min(meta.width,  box.x + box.w + PADDING);
    const bottom = Math.min(meta.height, box.y + box.h + PADDING);
    const w = right - x;
    const h = bottom - y;

    console.log('\n' + id + ': crop(' + x + ', ' + y + ', ' + w + ', ' + h + ')');

    // Extract to raw RGBA buffer so we can chroma-key in JS
    const { data: rawBuf, info } = await sharp(SOURCE)
      .extract({ left: x, top: y, width: w, height: h })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    // Apply two-pass chroma-key in place
    chromaKey(rawBuf, info.width, info.height, info.channels);

    // Audit metrics on the pre-resize buffer — most accurate reading of
    // the chroma-key's output before interpolation blurs alpha.
    const pxCount = info.width * info.height;
    let mTrans = 0, mOpaque = 0, mFeather = 0, mMagentaRes = 0;
    for (let i = 0; i < pxCount; i++) {
      const r = rawBuf[i * 4];
      const g = rawBuf[i * 4 + 1];
      const b = rawBuf[i * 4 + 2];
      const a = rawBuf[i * 4 + 3];
      if (a === 0) mTrans++;
      else if (a === 255) mOpaque++;
      else mFeather++;
      if (a > 100 && r > 200 && g < 80 && b > 200) mMagentaRes++;
    }

    // Encode back to PNG, resize to 500px wide (alpha preserved)
    const pngBuf = await sharp(rawBuf, {
      raw: { width: info.width, height: info.height, channels: info.channels }
    })
      .resize({ width: TARGET_WIDTH, fit: 'inside' })
      .png({ compressionLevel: 9 })
      .toBuffer();

    const resizedMeta = await sharp(pngBuf).metadata();
    const b64 = pngBuf.toString('base64');
    const dataUri = 'data:image/png;base64,' + b64;

    console.log('  Resized: ' + resizedMeta.width + 'x' + resizedMeta.height);
    console.log('  PNG: ' + pngBuf.length + ' bytes (' + (pngBuf.length / 1024).toFixed(1) + ' KB)');
    console.log('  Base64: ' + b64.length + ' chars (' + (b64.length / 1024).toFixed(1) + ' KB)');
    console.log('  Alpha: ' + (mTrans/pxCount*100).toFixed(1) + '% transparent, ' +
                (mOpaque/pxCount*100).toFixed(1) + '% opaque, ' +
                (mFeather/pxCount*100).toFixed(2) + '% feather');
    console.log('  Magenta residue: ' + mMagentaRes + ' px');

    results[id] = dataUri;
    metrics[id] = {
      cropDims: resizedMeta.width + 'x' + resizedMeta.height,
      pngBytes: pngBuf.length,
      base64Chars: b64.length,
      transparentPct: +(mTrans/pxCount*100).toFixed(2),
      opaquePct:     +(mOpaque/pxCount*100).toFixed(2),
      featherPct:    +(mFeather/pxCount*100).toFixed(3),
      magentaResidue: mMagentaRes,
    };
    totalB64 += b64.length;
  }

  // Write JSON output with metrics metadata
  const output = {
    source: path.basename(SOURCE),
    generated: new Date().toISOString(),
    metrics,
    sprites: results,
  };
  fs.writeFileSync(OUTPUT, JSON.stringify(output, null, 2) + '\n', 'utf8');
  const outSize = fs.statSync(OUTPUT).size;

  console.log('\n========================================');
  console.log('Output: ' + OUTPUT);
  console.log('File size: ' + (outSize / 1024 / 1024).toFixed(2) + ' MB');
  console.log('Total base64: ' + (totalB64 / 1024 / 1024).toFixed(2) + ' MB');

  if (totalB64 > 2.5 * 1024 * 1024) {
    console.warn('\nWARNING: total base64 exceeds 2.5 MB ceiling. Flag before injecting.');
  }
  console.log('========================================');
}

main().catch(err => { console.error(err); process.exit(1); });
