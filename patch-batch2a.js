#!/usr/bin/env node
// patch-batch2a.js — Add Batch 2 Rare fish (Barracuda, Lionfish, Triggerfish, Parrotfish, Yellow Tang)
const fs = require('fs');

const GAME_FILE = 'games/catch-and-reel/index.html';

// ── Raw SVGs from mockup (already have width/height from mockup file) ─────────
// IDs use mockup prefix r0_..r4_, we'll replace with fish-specific prefixes
const RAW_SVGS = {
  'Barracuda': `<svg width="160" height="100" viewBox="0 0 160 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="r0_body" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#708090"/><stop offset="40%" stop-color="#a0b0c0"/><stop offset="100%" stop-color="#d0d8e0"/>
    </linearGradient>
    <clipPath id="r0_clip"><path d="M18,50 Q18,40 44,36 Q74,32 114,38 Q142,44 142,50 Q142,56 114,62 Q74,68 44,64 Q18,60 18,50Z"/></clipPath>
  </defs>
  <path d="M56,38 Q60,28 64,36" fill="#607080" opacity="0.8"/>
  <path d="M114,40 Q118,32 122,38" fill="#607080" opacity="0.8"/>
  <path d="M114,60 Q118,68 122,62" fill="#607080" opacity="0.7"/>
  <path d="M56,62 Q52,70 48,66 Q52,64 56,62Z" fill="#60708066"/>
  <path d="M138,50 Q150,34 156,26 Q152,42 153,50 Q152,58 156,74 Q150,66 138,50Z" fill="#607080" opacity="0.85"/>
  <path d="M18,50 Q18,40 44,36 Q74,32 114,38 Q142,44 142,50 Q142,56 114,62 Q74,68 44,64 Q18,60 18,50Z" fill="url(#r0_body)"/>
  <g clip-path="url(#r0_clip)" opacity="0.25">
    <path d="M54,32 L60,50 L54,68" fill="none" stroke="#2a3a4a" stroke-width="3"/>
    <path d="M70,32 L76,50 L70,68" fill="none" stroke="#2a3a4a" stroke-width="3"/>
    <path d="M86,34 L92,50 L86,66" fill="none" stroke="#2a3a4a" stroke-width="2.5"/>
    <path d="M100,36 L106,50 L100,64" fill="none" stroke="#2a3a4a" stroke-width="2"/>
    <path d="M112,38 L118,50 L112,62" fill="none" stroke="#2a3a4a" stroke-width="1.5"/>
  </g>
  <g clip-path="url(#r0_clip)"><line x1="28" y1="49" x2="136" y2="48" stroke="#b8c8d8" stroke-width="0.8" opacity="0.3"/></g>
  <path d="M18,48 Q14,47 12,48 L12,50" fill="#a0b0c0" stroke="#60708044" stroke-width="0.5"/>
  <path d="M18,52 Q14,53 12,52 L12,50" fill="#c8d0d8" stroke="#60708044" stroke-width="0.5"/>
  <g opacity="0.8">
    <line x1="13" y1="48.5" x2="13" y2="49.5" stroke="white" stroke-width="0.8"/>
    <line x1="14.5" y1="48.5" x2="14.5" y2="49.5" stroke="white" stroke-width="0.8"/>
    <line x1="16" y1="48.5" x2="16" y2="49.5" stroke="white" stroke-width="0.8"/>
    <line x1="13.5" y1="50.5" x2="13.5" y2="51.5" stroke="white" stroke-width="0.8"/>
    <line x1="15" y1="50.5" x2="15" y2="51.5" stroke="white" stroke-width="0.8"/>
    <line x1="16.5" y1="50.5" x2="16.5" y2="51.5" stroke="white" stroke-width="0.8"/>
  </g>
  <circle cx="26" cy="46" r="4.5" fill="#ffee88"/>
  <circle cx="25" cy="45" r="2.8" fill="#1a1a1a"/>
  <circle cx="24" cy="44" r="1" fill="white"/>
  <path d="M38,54 Q32,62 28,58 Q34,56 38,54Z" fill="#a0b0c088"/>
</svg>`,

  'Lionfish': `<svg width="160" height="100" viewBox="0 0 160 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="r1_body" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#6a3a20"/><stop offset="50%" stop-color="#5a2a18"/><stop offset="100%" stop-color="#4a2010"/>
    </linearGradient>
    <clipPath id="r1_clip"><ellipse cx="70" cy="52" rx="28" ry="20"/></clipPath>
  </defs>
  <g opacity="0.85">
    <line x1="46" y1="34" x2="38" y2="4" stroke="#5a2a18" stroke-width="1.5" stroke-dasharray="4,3"/>
    <line x1="52" y1="32" x2="46" y2="2" stroke="#5a2a18" stroke-width="1.5" stroke-dasharray="4,3"/>
    <line x1="58" y1="32" x2="54" y2="4" stroke="#5a2a18" stroke-width="1.5" stroke-dasharray="4,3"/>
    <line x1="64" y1="32" x2="62" y2="2" stroke="#5a2a18" stroke-width="1.5" stroke-dasharray="4,3"/>
    <line x1="70" y1="32" x2="70" y2="4" stroke="#5a2a18" stroke-width="1.5" stroke-dasharray="4,3"/>
    <line x1="76" y1="32" x2="78" y2="6" stroke="#5a2a18" stroke-width="1.5" stroke-dasharray="4,3"/>
    <line x1="82" y1="34" x2="86" y2="8" stroke="#5a2a18" stroke-width="1.5" stroke-dasharray="4,3"/>
    <line x1="86" y1="36" x2="92" y2="12" stroke="#5a2a18" stroke-width="1.5" stroke-dasharray="4,3"/>
  </g>
  <path d="M52,56 Q28,60 14,76 Q20,58 26,50 Q32,44 40,42" fill="#8a6a50" opacity="0.45"/>
  <path d="M52,56 Q32,54 16,64 Q24,52 32,48 Q40,44 48,44" fill="#8a6a5033"/>
  <g opacity="0.35">
    <circle cx="28" cy="60" r="1.5" fill="#1a1a0a"/>
    <circle cx="24" cy="66" r="1.2" fill="#1a1a0a"/>
    <circle cx="32" cy="56" r="1.3" fill="#1a1a0a"/>
    <circle cx="20" cy="62" r="1" fill="#1a1a0a"/>
    <circle cx="36" cy="52" r="1" fill="#1a1a0a"/>
    <circle cx="26" cy="54" r="1.2" fill="#1a1a0a"/>
  </g>
  <line x1="62" y1="72" x2="56" y2="90" stroke="#5a2a18" stroke-width="1.2" stroke-dasharray="3,2" opacity="0.7"/>
  <line x1="68" y1="72" x2="64" y2="92" stroke="#5a2a18" stroke-width="1.2" stroke-dasharray="3,2" opacity="0.7"/>
  <line x1="74" y1="72" x2="74" y2="88" stroke="#5a2a18" stroke-width="1.2" stroke-dasharray="3,2" opacity="0.7"/>
  <path d="M96,52 Q112,38 118,32 Q114,46 115,52 Q114,58 118,72 Q112,66 96,52Z" fill="#8a6a50" opacity="0.6"/>
  <circle cx="108" cy="42" r="1" fill="#1a1a0a" opacity="0.3"/>
  <circle cx="112" cy="48" r="1.2" fill="#1a1a0a" opacity="0.3"/>
  <circle cx="106" cy="56" r="1" fill="#1a1a0a" opacity="0.3"/>
  <circle cx="110" cy="62" r="1.2" fill="#1a1a0a" opacity="0.3"/>
  <ellipse cx="70" cy="52" rx="28" ry="20" fill="url(#r1_body)"/>
  <g clip-path="url(#r1_clip)" opacity="0.5">
    <rect x="46" y="32" width="3.5" height="40" fill="#e8d0b0" rx="1"/>
    <rect x="53" y="32" width="3.5" height="40" fill="#e8d0b0" rx="1"/>
    <rect x="60" y="32" width="3.5" height="40" fill="#e8d0b0" rx="1"/>
    <rect x="67" y="32" width="3.5" height="40" fill="#e8d0b0" rx="1"/>
    <rect x="74" y="32" width="3.5" height="40" fill="#e8d0b0" rx="1"/>
    <rect x="81" y="32" width="3.5" height="40" fill="#e8d0b0" rx="1"/>
    <rect x="88" y="32" width="3.5" height="40" fill="#e8d0b0" rx="1"/>
  </g>
  <circle cx="52" cy="48" r="4.5" fill="#ddcc88"/>
  <circle cx="51" cy="47" r="2.8" fill="#1a0a0a"/>
  <circle cx="50" cy="46" r="1" fill="white"/>
  <path d="M43,54 Q41,56 43,57" fill="none" stroke="#4a201044" stroke-width="1"/>
</svg>`,

  'Triggerfish': `<svg width="160" height="100" viewBox="0 0 160 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="r2_body" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#2255aa"/><stop offset="50%" stop-color="#1a4488"/><stop offset="100%" stop-color="#1a3366"/>
    </linearGradient>
    <clipPath id="r2_clip"><ellipse cx="72" cy="50" rx="34" ry="30"/></clipPath>
  </defs>
  <path d="M62,22 L64,6 L66,20" fill="#1a4488" opacity="0.9"/>
  <path d="M66,20 Q72,14 78,22" fill="#1a4488" opacity="0.7"/>
  <path d="M78,22 Q86,18 94,24 Q98,28 100,32" fill="#1a4488" opacity="0.7"/>
  <path d="M66,78 Q76,84 86,78 Q92,74 96,70" fill="#1a4488" opacity="0.65"/>
  <path d="M104,50 Q118,36 124,30 Q120,44 121,50 Q120,56 124,70 Q118,64 104,50Z" fill="#1a4488" opacity="0.85"/>
  <ellipse cx="72" cy="50" rx="34" ry="30" fill="url(#r2_body)"/>
  <g clip-path="url(#r2_clip)">
    <path d="M38,40 Q44,32 54,36 Q60,42 56,54 Q50,62 40,58 Q36,52 38,44Z" fill="#eebb22" opacity="0.55"/>
    <line x1="48" y1="36" x2="98" y2="34" stroke="#44aaff" stroke-width="1.2" opacity="0.3"/>
    <line x1="48" y1="44" x2="100" y2="42" stroke="#44aaff" stroke-width="0.8" opacity="0.25"/>
  </g>
  <circle cx="50" cy="44" r="5.5" fill="white"/>
  <circle cx="50" cy="44" r="4" fill="#1a3366"/>
  <circle cx="49" cy="43" r="2" fill="#1a1a1a"/>
  <circle cx="48" cy="42" r="0.8" fill="white"/>
  <path d="M39,56 Q37,54 39,52" fill="none" stroke="#0a1a4488" stroke-width="1.8" stroke-linecap="round"/>
  <path d="M56,56 Q48,64 44,60 Q50,58 56,56Z" fill="#1a448866"/>
</svg>`,

  'Parrotfish': `<svg width="160" height="100" viewBox="0 0 160 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="r3_body" x1="0" y1="0" x2="1" y2="0.5">
      <stop offset="0%" stop-color="#44bbaa"/><stop offset="30%" stop-color="#66aa88"/><stop offset="60%" stop-color="#cc8866"/><stop offset="100%" stop-color="#aa6644"/>
    </linearGradient>
    <clipPath id="r3_clip"><ellipse cx="74" cy="50" rx="36" ry="26"/></clipPath>
  </defs>
  <path d="M46,34 Q52,18 66,14 Q80,12 94,20 Q100,28 104,36" fill="#44aa88" opacity="0.75"/>
  <path d="M62,72 Q72,80 84,74" fill="#aa6644" opacity="0.7"/>
  <path d="M108,50 Q120,36 126,30 Q122,44 124,50 Q122,56 126,70 Q120,64 108,50Z" fill="#66aa88" opacity="0.85"/>
  <path d="M56,70 Q50,80 44,74 Q50,72 56,70Z" fill="#66aa8866"/>
  <ellipse cx="74" cy="50" rx="36" ry="26" fill="url(#r3_body)"/>
  <g clip-path="url(#r3_clip)" opacity="0.18">
    <circle cx="52" cy="40" r="7" fill="none" stroke="#88ddcc" stroke-width="0.8"/>
    <circle cx="66" cy="38" r="7" fill="none" stroke="#88ddcc" stroke-width="0.8"/>
    <circle cx="80" cy="40" r="7" fill="none" stroke="#88ddcc" stroke-width="0.8"/>
    <circle cx="94" cy="42" r="7" fill="none" stroke="#88ddcc" stroke-width="0.8"/>
    <circle cx="52" cy="54" r="7" fill="none" stroke="#cc9988" stroke-width="0.7"/>
    <circle cx="66" cy="52" r="7" fill="none" stroke="#cc9988" stroke-width="0.7"/>
    <circle cx="80" cy="54" r="7" fill="none" stroke="#cc9988" stroke-width="0.7"/>
    <circle cx="94" cy="56" r="7" fill="none" stroke="#cc9988" stroke-width="0.7"/>
  </g>
  <path d="M39,46 L30,44 Q28,46 30,48 L39,48" fill="#22aa88" stroke="#18886644" stroke-width="0.8"/>
  <path d="M39,52 L30,52 Q28,54 30,56 L39,54" fill="#22aa88" stroke="#18886644" stroke-width="0.8"/>
  <line x1="30" y1="49" x2="38" y2="50" stroke="#0a4a3a" stroke-width="1" opacity="0.5"/>
  <circle cx="48" cy="44" r="4.5" fill="#ffaa44"/>
  <circle cx="47" cy="43" r="2.8" fill="#1a2a1a"/>
  <circle cx="46" cy="42" r="1" fill="white"/>
  <path d="M56,56 Q48,64 44,60 Q50,58 56,56Z" fill="#44aa8866"/>
</svg>`,

  'Yellow Tang': `<svg width="160" height="100" viewBox="0 0 160 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="r4_body" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ffdd22"/><stop offset="50%" stop-color="#ffcc00"/><stop offset="100%" stop-color="#ddaa00"/>
    </linearGradient>
    <radialGradient id="r4_shine" cx="0.4" cy="0.3" r="0.45"><stop offset="0%" stop-color="#ffee8833"/><stop offset="100%" stop-color="#ffee8800"/></radialGradient>
  </defs>
  <path d="M46,33 Q50,28 56,18 Q66,10 80,12 Q92,16 98,28 Q100,32 100,36" fill="#ddaa00" opacity="0.8"/>
  <path d="M48,70 Q52,74 58,82 Q70,88 82,86 Q92,80 98,72 Q100,68 100,65" fill="#ddaa00" opacity="0.75"/>
  <path d="M102,50 Q116,34 122,28 Q118,44 119,50 Q118,56 122,72 Q116,66 102,50Z" fill="#ddaa00" opacity="0.85"/>
  <path d="M54,72 Q48,78 44,74 Q48,72 54,72Z" fill="#ddaa0066"/>
  <ellipse cx="72" cy="50" rx="32" ry="30" fill="url(#r4_body)"/>
  <ellipse cx="72" cy="50" rx="32" ry="30" fill="url(#r4_shine)"/>
  <path d="M98,48 L104,46 L100,50 L104,54 L98,52" fill="white" opacity="0.7"/>
  <circle cx="50" cy="44" r="4.5" fill="white"/><circle cx="49" cy="43" r="2.8" fill="#1a1a00"/><circle cx="48" cy="42" r="1" fill="white"/>
  <path d="M41,52 Q39,50 41,48" fill="none" stroke="#aa880044" stroke-width="1.2" stroke-linecap="round"/>
  <path d="M56,56 Q48,62 46,58 Q50,56 56,56Z" fill="#ffcc0066"/>
</svg>`,
};

// Prefix mappings: mockup prefix → fish-specific prefix
const PREFIX_MAP = {
  'Barracuda':   { old: 'r0_', new: 'ba_' },
  'Lionfish':    { old: 'r1_', new: 'lf_' },
  'Triggerfish': { old: 'r2_', new: 'tf_' },
  'Parrotfish':  { old: 'r3_', new: 'pf2_' },
  'Yellow Tang': { old: 'r4_', new: 'yt_' },
};

// Fish config for FISH array
const FISH_CONFIG = [
  { name: 'Barracuda',   emoji: '\uD83D\uDC1F', rarity: 'RARE', wMin: 5.0,  wMax: 30.0, lMin: 18, lMax: 48 },
  { name: 'Lionfish',    emoji: '\uD83D\uDC1F', rarity: 'RARE', wMin: 1.0,  wMax: 3.0,  lMin: 8,  lMax: 15 },
  { name: 'Triggerfish', emoji: '\uD83D\uDC1F', rarity: 'RARE', wMin: 2.0,  wMax: 8.0,  lMin: 8,  lMax: 20 },
  { name: 'Parrotfish',  emoji: '\uD83D\uDC1F', rarity: 'RARE', wMin: 3.0,  wMax: 15.0, lMin: 10, lMax: 24 },
  { name: 'Yellow Tang', emoji: '\uD83D\uDC1F', rarity: 'RARE', wMin: 0.5,  wMax: 2.0,  lMin: 4,  lMax: 8  },
];

function uniquifyIds(svgStr, oldPrefix, newPrefix) {
  let result = svgStr;
  // Escape old prefix for regex (underscore is literal but _ is fine)
  const esc = oldPrefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  result = result.replace(new RegExp(`id="${esc}`, 'g'), `id="${newPrefix}`);
  result = result.replace(new RegExp(`url\\(#${esc}`, 'g'), `url(#${newPrefix}`);
  return result;
}

function toBase64DataURI(svgStr) {
  return `data:image/svg+xml;base64,${Buffer.from(svgStr).toString('base64')}`;
}

// ── Encode SVGs ───────────────────────────────────────────────────────────────
console.log('=== Encoding Batch 2A fish SVGs ===\n');
const encodedSVGs = {};
for (const [name, rawSvg] of Object.entries(RAW_SVGS)) {
  const { old: oldPfx, new: newPfx } = PREFIX_MAP[name];
  const uniquified = uniquifyIds(rawSvg, oldPfx, newPfx);
  encodedSVGs[name] = toBase64DataURI(uniquified);
  console.log(`✓ ${name} (prefix: ${newPfx})`);
}

// ── Generate insertion strings ────────────────────────────────────────────────
function generateFishEntries() {
  const lines = ['  // New Rare (Batch 2A)'];
  for (const f of FISH_CONFIG) {
    lines.push(`  { name:'${f.name}', emoji:'${f.emoji}', rarity:'RARE', wMin:${f.wMin}, wMax:${f.wMax}, lMin:${f.lMin}, lMax:${f.lMax} },`);
  }
  return lines.join('\n');
}

function generateSVGEntries() {
  return FISH_CONFIG
    .filter(f => encodedSVGs[f.name])
    .map(f => `  "${f.name}": "${encodedSVGs[f.name]}",`)
    .join('\n');
}

// ── Patch game file ───────────────────────────────────────────────────────────
console.log('\n=== Patching game file ===\n');

let game = fs.readFileSync(GAME_FILE, 'utf8');
const nl = game.includes('\r\n') ? '\r\n' : '\n';
console.log(`Line endings: ${nl === '\r\n' ? 'CRLF' : 'LF'}`);

// Normalize to LF
let g = game.replace(/\r\n/g, '\n');

// 1. Insert FISH array entries — after the last existing Rare fish (Red Snapper)
const redSnapperMarker = `{ name:'Red Snapper'`;
const snapPos = g.indexOf(redSnapperMarker);
if (snapPos === -1) { console.error('❌ Cannot find Red Snapper entry'); process.exit(1); }
// Find the end of the Red Snapper line
const snapLineEnd = g.indexOf('\n', snapPos);
if (snapLineEnd === -1) { console.error('❌ Cannot find end of Red Snapper line'); process.exit(1); }
g = g.slice(0, snapLineEnd + 1) + generateFishEntries() + '\n' + g.slice(snapLineEnd + 1);
console.log('✓ Inserted FISH array entries after Red Snapper');

// 2. Insert FISH_SVGS entries before the closing };\n\n// Preload fish images
const svgClose = '\n};\n\n// Preload fish images';
const svgClosePos = g.indexOf(svgClose);
if (svgClosePos === -1) { console.error('❌ Cannot find FISH_SVGS closing'); process.exit(1); }
g = g.slice(0, svgClosePos) + '\n' + generateSVGEntries() + '\n' + g.slice(svgClosePos);
console.log('✓ Inserted FISH_SVGS entries');

// Restore line endings
if (nl === '\r\n') g = g.replace(/\n/g, '\r\n');

fs.writeFileSync(GAME_FILE, g, 'utf8');
console.log(`\n✅ Done! New file size: ${(fs.statSync(GAME_FILE).size / 1024 / 1024).toFixed(2)}MB`);
