// patch-batch4-a.js — Batch 4A: Shimmer fix + 2 Legendaries + location filter
'use strict';
const fs = require('fs');
const path = require('path');

const GAME_FILE = path.join(__dirname, 'games', 'catch-and-reel', 'index.html');
const MOCKUP = path.join(__dirname, 'fish-expansion-batch4-v2.html');

// Extract SVGs from mockup
const mockup = fs.readFileSync(MOCKUP, 'utf8');
const svgBlocks = [...mockup.matchAll(/<svg[\s\S]*?<\/svg>/g)].map(m => m[0]);
if (svgBlocks.length < 5) { console.error('Expected 5 SVGs, got', svgBlocks.length); process.exit(1); }

// Helper: fix dimensions and base64 encode
function encodeSVG(raw) {
  // Replace 320x200 with 160x100
  let fixed = raw.replace(/width="320"/, 'width="160"').replace(/height="200"/, 'height="100"');
  return 'data:image/svg+xml;base64,' + Buffer.from(fixed).toString('base64');
}

// SVG 1 = lx0_ Dock Cat, SVG 2 = lx1_ Sunbeam Dolphin
const b64_dockCat       = encodeSVG(svgBlocks[0]);
const b64_sunbeamDolphin= encodeSVG(svgBlocks[1]);

console.log('Dock Cat SVG length:', svgBlocks[0].length, '→ b64:', b64_dockCat.length);
console.log('Sunbeam Dolphin SVG length:', svgBlocks[1].length, '→ b64:', b64_sunbeamDolphin.length);

// Verify prefix IDs
if (!svgBlocks[0].includes('lx0_')) { console.error('SVG 1 missing lx0_ prefix!'); process.exit(1); }
if (!svgBlocks[1].includes('lx1_')) { console.error('SVG 2 missing lx1_ prefix!'); process.exit(1); }
console.log('✓ Prefix IDs verified');

// Read game file
let raw = fs.readFileSync(GAME_FILE, 'utf8');
const hadCRLF = raw.includes('\r\n');
if (hadCRLF) raw = raw.replace(/\r\n/g, '\n');

console.log('Game file length:', raw.length);

// ============================================================
// PATCH 1: Fix shimmer trophy room subheader text
// ============================================================
const SHIMMER_OLD = `' + PAINTINGS.length + ' paintings discovered  •  0.75% shimmer per cast';`;
const SHIMMER_NEW = `' + PAINTINGS.length + ' paintings discovered';`;

if (!raw.includes(SHIMMER_OLD)) { console.error('ERROR: shimmer text anchor not found!'); process.exit(1); }
raw = raw.replace(SHIMMER_OLD, SHIMMER_NEW);
console.log('✓ Patch 1: Shimmer text fixed');

// ============================================================
// PATCH 2: Add SVGs to FISH_SVGS (after last existing entry)
// Last entry ends with =" + trailing comma + blank line + };
// ============================================================
const SVGS_CLOSE = '",\n\n};\n';
if (!raw.includes(SVGS_CLOSE)) { console.error('ERROR: FISH_SVGS closing anchor not found!'); process.exit(1); }

const NEW_SVGS =
  `"Dock Cat":        "${b64_dockCat}",\n` +
  `  "Sunbeam Dolphin": "${b64_sunbeamDolphin}",\n`;

// Insert before closing
raw = raw.replace(SVGS_CLOSE, `  ${NEW_SVGS}\n};\n`);
console.log('✓ Patch 2: SVGs added to FISH_SVGS');

// ============================================================
// PATCH 3: Add FISH array entries (before closing ];)
// ============================================================
const FISH_CLOSE = '\n\n];\n';
const FISH_CLOSE_IDX = raw.lastIndexOf(FISH_CLOSE);
if (FISH_CLOSE_IDX < 0) { console.error('ERROR: FISH array closing not found!'); process.exit(1); }

const NEW_FISH_ENTRIES =
`\n  // --- BATCH 4: LOCATION EXCLUSIVES ---
  { name:'Dock Cat',        emoji:'\uD83D\uDC31', rarity:'LEGENDARY', wMin:8.0,   wMax:25.0,  lMin:50,  lMax:100, location:'Wooden Dock' },
  { name:'Sunbeam Dolphin', emoji:'\uD83D\uDC2C', rarity:'LEGENDARY', wMin:80.0,  wMax:250.0, lMin:150, lMax:300, location:'Sunny Pier'  },\n`;

raw = raw.substring(0, FISH_CLOSE_IDX) + NEW_FISH_ENTRIES + raw.substring(FISH_CLOSE_IDX);
console.log('✓ Patch 3: FISH entries added');

// ============================================================
// PATCH 4: Location filter in pickFish()
// ============================================================
const POOL_OLD = `  const pool = FISH.filter(f => f.rarity === chosenRarity);`;
const POOL_NEW = `  const pool = FISH.filter(f => f.rarity === chosenRarity && (!f.location || f.location === loc.name));`;

if (!raw.includes(POOL_OLD)) { console.error('ERROR: pickFish pool line not found!'); process.exit(1); }
raw = raw.replace(POOL_OLD, POOL_NEW);
console.log('✓ Patch 4: Location filter added to pickFish()');

// ============================================================
// Write output
// ============================================================
if (hadCRLF) raw = raw.replace(/\n/g, '\r\n');
fs.writeFileSync(GAME_FILE, raw, 'utf8');
console.log('\n✅ Batch 4A patches applied!');
console.log('New file size:', fs.statSync(GAME_FILE).size, 'bytes');
