// patch-batch4-b.js — Batch 4B: 3 Exotic location-exclusive fish
'use strict';
const fs = require('fs');
const path = require('path');

const GAME_FILE = path.join(__dirname, 'games', 'catch-and-reel', 'index.html');
const MOCKUP = path.join(__dirname, 'fish-expansion-batch4-v2.html');

// Extract SVGs from mockup
const mockup = fs.readFileSync(MOCKUP, 'utf8');
const svgBlocks = [...mockup.matchAll(/<svg[\s\S]*?<\/svg>/g)].map(m => m[0]);
if (svgBlocks.length < 5) { console.error('Expected 5 SVGs, got', svgBlocks.length); process.exit(1); }

function encodeSVG(raw) {
  let fixed = raw.replace(/width="320"/, 'width="160"').replace(/height="200"/, 'height="100"');
  return 'data:image/svg+xml;base64,' + Buffer.from(fixed).toString('base64');
}

// SVG 3 = ex0_ Reef Guardian, SVG 4 = ex1_ Storm Leviathan, SVG 5 = ex2_ Magma Serpent
const b64_reefGuardian    = encodeSVG(svgBlocks[2]);
const b64_stormLeviathan  = encodeSVG(svgBlocks[3]);
const b64_magmaSerpent    = encodeSVG(svgBlocks[4]);

console.log('Reef Guardian b64 length:', b64_reefGuardian.length);
console.log('Storm Leviathan b64 length:', b64_stormLeviathan.length);
console.log('Magma Serpent b64 length:', b64_magmaSerpent.length);

// Verify prefix IDs via decode
function verifyPrefix(b64, prefix) {
  const decoded = Buffer.from(b64.replace('data:image/svg+xml;base64,',''), 'base64').toString('utf8');
  return decoded.includes(prefix);
}
if (!verifyPrefix(b64_reefGuardian,   'ex0_')) { console.error('Missing ex0_'); process.exit(1); }
if (!verifyPrefix(b64_stormLeviathan, 'ex1_')) { console.error('Missing ex1_'); process.exit(1); }
if (!verifyPrefix(b64_magmaSerpent,   'ex2_')) { console.error('Missing ex2_'); process.exit(1); }
console.log('✓ Prefix IDs verified');

// Verify 160x100 dimensions
function verifyDims(b64) {
  const decoded = Buffer.from(b64.replace('data:image/svg+xml;base64,',''), 'base64').toString('utf8');
  return decoded.includes('width="160"') && decoded.includes('height="100"');
}
if (!verifyDims(b64_reefGuardian))   { console.error('Wrong dims: Reef Guardian');    process.exit(1); }
if (!verifyDims(b64_stormLeviathan)) { console.error('Wrong dims: Storm Leviathan');  process.exit(1); }
if (!verifyDims(b64_magmaSerpent))   { console.error('Wrong dims: Magma Serpent');    process.exit(1); }
console.log('✓ Dimensions verified (160x100)');

// Read game file
let raw = fs.readFileSync(GAME_FILE, 'utf8');
const hadCRLF = raw.includes('\r\n');
if (hadCRLF) raw = raw.replace(/\r\n/g, '\n');
console.log('Game file length:', raw.length);

// ============================================================
// PATCH 1: Add SVGs to FISH_SVGS (before closing };)
// ============================================================
const SVGS_CLOSE = '"Sunbeam Dolphin": "' + b64_sunbeamDolphin_check(raw) + '",\n\n};\n';

// Actually find a reliable anchor — last entry before };
// Use the Sunbeam Dolphin key since we added it in Batch A
function findSvgsClose(r) {
  const closeIdx = r.lastIndexOf('\n\n};\n');
  // Confirm it's inside FISH_SVGS block
  const svgsStart = r.indexOf('const FISH_SVGS = {');
  if (closeIdx > svgsStart) return closeIdx;
  return -1;
}

// Simpler approach: find the closing \n\n};\n that follows FISH_SVGS
const svgsStart = raw.indexOf('const FISH_SVGS = {');
const svgsSearchFrom = svgsStart + 10;
// Find next \n};\n after FISH_SVGS
let svgsCloseIdx = raw.indexOf('\n\n};\n', svgsSearchFrom);
if (svgsCloseIdx < 0) { console.error('ERROR: FISH_SVGS closing not found!'); process.exit(1); }

const NEW_SVGS =
  `  "Reef Guardian":    "${b64_reefGuardian}",\n` +
  `  "Storm Leviathan":  "${b64_stormLeviathan}",\n` +
  `  "Magma Serpent":    "${b64_magmaSerpent}",\n`;

raw = raw.substring(0, svgsCloseIdx) + '\n' + NEW_SVGS + '\n};\n' + raw.substring(svgsCloseIdx + 5);
console.log('✓ Patch 1: SVGs added to FISH_SVGS');

// ============================================================
// PATCH 2: Add FISH array entries (before closing ];)
// ============================================================
const FISH_CLOSE_IDX = raw.lastIndexOf('\n\n];\n');
if (FISH_CLOSE_IDX < 0) { console.error('ERROR: FISH array closing not found!'); process.exit(1); }

const NEW_FISH_ENTRIES =
`\n  { name:'Reef Guardian',   emoji:'\uD83E\uDD81', rarity:'EXOTIC', wMin:5.0,   wMax:20.0,  lMin:30,  lMax:80,  location:'Coral Reef'   },
  { name:'Storm Leviathan', emoji:'\u26A1',       rarity:'EXOTIC', wMin:200.0, wMax:800.0, lMin:300, lMax:600, location:'Deep Sea'     },
  { name:'Magma Serpent',   emoji:'\uD83C\uDF0B', rarity:'EXOTIC', wMin:50.0,  wMax:200.0, lMin:100, lMax:300, location:'Volcano Cove' },\n`;

raw = raw.substring(0, FISH_CLOSE_IDX) + NEW_FISH_ENTRIES + raw.substring(FISH_CLOSE_IDX);
console.log('✓ Patch 2: FISH entries added');

// ============================================================
// Write output
// ============================================================
if (hadCRLF) raw = raw.replace(/\n/g, '\r\n');
fs.writeFileSync(GAME_FILE, raw, 'utf8');
console.log('\n✅ Batch 4B patches applied!');
console.log('New file size:', fs.statSync(GAME_FILE).size, 'bytes');

function b64_sunbeamDolphin_check(r) { return ''; } // unused helper placeholder
