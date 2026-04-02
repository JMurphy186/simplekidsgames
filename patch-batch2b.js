#!/usr/bin/env node
// patch-batch2b.js — Add Batch 2 Rare fish (Butterflyfish, Needlefish, Sauger, Hawkfish, Royal Tang)
const fs = require('fs');

const GAME_FILE = 'games/catch-and-reel/index.html';

// ── Raw SVGs from mockup ──────────────────────────────────────────────────────
const RAW_SVGS = {
  'Butterflyfish': `<svg width="160" height="100" viewBox="0 0 160 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="r5_body" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#e0e4e8"/>
      <stop offset="55%" stop-color="#d8dce0"/>
      <stop offset="65%" stop-color="#ffdd44"/>
      <stop offset="100%" stop-color="#ffcc00"/>
    </linearGradient>
    <clipPath id="r5_clip"><ellipse cx="72" cy="50" rx="30" ry="28"/></clipPath>
  </defs>
  <path d="M56,26 Q62,10 72,8 Q82,10 90,22 Q94,28 96,33" fill="#ffcc00" opacity="0.8"/>
  <path d="M58,74 Q68,84 80,78 Q86,74 90,68" fill="#ffcc00" opacity="0.75"/>
  <path d="M100,50 Q114,36 120,30 Q116,44 117,50 Q116,56 120,70 Q114,64 100,50Z" fill="#ffcc00" opacity="0.9"/>
  <path d="M54,70 Q48,78 42,74 Q48,72 54,70Z" fill="#e0e4e866"/>
  <ellipse cx="72" cy="50" rx="30" ry="28" fill="url(#r5_body)"/>
  <g clip-path="url(#r5_clip)">
    <rect x="46" y="22" width="8" height="56" fill="#1a1a2a" opacity="0.7"/>
  </g>
  <g clip-path="url(#r5_clip)" opacity="0.2">
    <line x1="56" y1="24" x2="56" y2="76" stroke="#1a1a4a" stroke-width="0.8"/>
    <line x1="60" y1="24" x2="60" y2="76" stroke="#1a1a4a" stroke-width="0.8"/>
    <line x1="64" y1="24" x2="64" y2="76" stroke="#1a1a4a" stroke-width="0.8"/>
    <line x1="68" y1="24" x2="68" y2="76" stroke="#1a1a4a" stroke-width="0.8"/>
    <line x1="72" y1="24" x2="72" y2="76" stroke="#1a1a4a" stroke-width="0.8"/>
    <line x1="76" y1="24" x2="76" y2="76" stroke="#1a1a4a" stroke-width="0.8"/>
  </g>
  <path d="M42,50 Q40,49 39,50 Q40,51 42,51" fill="#d8dce0" stroke="#a0a8b022" stroke-width="0.5"/>
  <circle cx="50" cy="44" r="4" fill="white"/>
  <circle cx="49" cy="43" r="2.5" fill="#1a1a1a"/>
  <circle cx="48" cy="42" r="1" fill="white"/>
  <path d="M56,56 Q48,62 46,58 Q50,56 56,56Z" fill="#d8dce066"/>
</svg>`,

  'Needlefish': `<svg width="160" height="100" viewBox="0 0 160 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="r6_body" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#4a8868"/><stop offset="40%" stop-color="#88b8a0"/><stop offset="100%" stop-color="#c8d8d0"/>
    </linearGradient>
    <clipPath id="r6_clip"><path d="M8,50 Q8,44 30,42 Q60,38 110,42 Q140,46 140,50 Q140,54 110,58 Q60,62 30,58 Q8,56 8,50Z"/></clipPath>
  </defs>
  <path d="M116,44 Q120,36 124,42" fill="#4a8868" opacity="0.75"/>
  <path d="M116,56 Q120,64 124,58" fill="#4a8868" opacity="0.7"/>
  <path d="M138,50 Q148,40 152,36 Q148,46 149,50 Q148,54 152,64 Q148,60 138,50Z" fill="#4a8868" opacity="0.8"/>
  <path d="M8,50 Q8,44 30,42 Q60,38 110,42 Q140,46 140,50 Q140,54 110,58 Q60,62 30,58 Q8,56 8,50Z" fill="url(#r6_body)"/>
  <g clip-path="url(#r6_clip)"><line x1="14" y1="50" x2="134" y2="49" stroke="#44aa88" stroke-width="1.5" opacity="0.3"/></g>
  <path d="M8,49 L-8,48 L-6,50" fill="#88b8a0" stroke="#4a886844" stroke-width="0.5"/>
  <path d="M8,51 L-8,52 L-6,50" fill="#c8d8d0" stroke="#4a886844" stroke-width="0.5"/>
  <g opacity="0.5"><line x1="-4" y1="49.5" x2="-2" y2="49.5" stroke="white" stroke-width="0.5"/><line x1="0" y1="49.5" x2="2" y2="49.5" stroke="white" stroke-width="0.5"/><line x1="4" y1="49.5" x2="6" y2="49.5" stroke="white" stroke-width="0.5"/></g>
  <circle cx="16" cy="47" r="3.5" fill="#ddeecc"/><circle cx="15" cy="46" r="2.2" fill="#1a2a1a"/><circle cx="14.5" cy="45.5" r="0.8" fill="white"/>
  <path d="M28,54 Q24,58 22,56 Q24,54 28,54Z" fill="#88b8a066"/>
</svg>`,

  'Sauger': `<svg width="160" height="100" viewBox="0 0 160 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="r7_body" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#7a6a40"/><stop offset="50%" stop-color="#9a8a58"/><stop offset="100%" stop-color="#c0b080"/>
    </linearGradient>
    <clipPath id="r7_clip"><path d="M24,50 Q24,36 54,32 Q84,28 114,36 Q136,44 136,50 Q136,56 114,64 Q84,72 54,68 Q24,64 24,50Z"/></clipPath>
  </defs>
  <path d="M48,34 L50,20 L54,32 L56,18 L60,30 L62,16 L66,28 L68,20 L72,32 L74,24 L78,34" fill="#7a6a40" opacity="0.8"/>
  <path d="M48,34 Q64,36 78,34" fill="#9a8a58"/>
  <circle cx="54" cy="24" r="1.5" fill="#2a2010" opacity="0.5"/><circle cx="62" cy="22" r="1.5" fill="#2a2010" opacity="0.5"/><circle cx="68" cy="26" r="1.5" fill="#2a2010" opacity="0.5"/>
  <path d="M96,36 Q102,28 110,34" fill="#7a6a40" opacity="0.7"/>
  <path d="M94,64 Q100,74 108,66" fill="#7a6a40" opacity="0.65"/>
  <path d="M132,50 Q144,34 150,28 Q146,44 147,50 Q146,56 150,72 Q144,66 132,50Z" fill="#7a6a40" opacity="0.85"/>
  <path d="M52,64 Q46,74 42,68 Q46,66 52,64Z" fill="#7a6a4066"/>
  <path d="M24,50 Q24,36 54,32 Q84,28 114,36 Q136,44 136,50 Q136,56 114,64 Q84,72 54,68 Q24,64 24,50Z" fill="url(#r7_body)"/>
  <g clip-path="url(#r7_clip)" opacity="0.3"><ellipse cx="50" cy="40" rx="8" ry="12" fill="#3a2a10"/><ellipse cx="70" cy="38" rx="8" ry="14" fill="#3a2a10"/><ellipse cx="90" cy="40" rx="8" ry="12" fill="#3a2a10"/><ellipse cx="110" cy="42" rx="6" ry="10" fill="#3a2a10"/></g>
  <g clip-path="url(#r7_clip)"><line x1="34" y1="48" x2="128" y2="46" stroke="#b0a070" stroke-width="0.8" opacity="0.3"/></g>
  <circle cx="34" cy="44" r="5" fill="#c8d8e0"/><circle cx="33" cy="43" r="3.2" fill="#1a2020"/><circle cx="32" cy="42" r="1.5" fill="#88aacc" opacity="0.5"/><circle cx="31.5" cy="41.5" r="0.8" fill="white"/>
  <path d="M24,51 Q22,53 24,55" fill="none" stroke="#5a4a3044" stroke-width="1.2"/>
  <path d="M42,56 Q34,64 30,60 Q36,58 42,56Z" fill="#9a8a5888"/>
</svg>`,

  'Hawkfish': `<svg width="160" height="100" viewBox="0 0 160 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="r8_body" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#dd3322"/><stop offset="50%" stop-color="#cc2818"/><stop offset="100%" stop-color="#e8c0b0"/>
    </linearGradient>
    <clipPath id="r8_clip"><path d="M30,50 Q30,36 58,32 Q86,28 112,36 Q130,44 130,50 Q130,56 112,64 Q86,72 58,68 Q30,64 30,50Z"/></clipPath>
  </defs>
  <g stroke="#cc2818" stroke-width="1.2" stroke-linecap="round" opacity="0.8">
    <line x1="62" y1="34" x2="58" y2="14"/><line x1="68" y1="32" x2="66" y2="12"/>
    <line x1="74" y1="32" x2="74" y2="14"/><line x1="80" y1="32" x2="82" y2="16"/>
    <line x1="86" y1="34" x2="90" y2="18"/><line x1="92" y1="36" x2="96" y2="22"/>
  </g>
  <g fill="#ff8866" opacity="0.5">
    <circle cx="58" cy="13" r="2"/><circle cx="66" cy="11" r="2"/><circle cx="74" cy="13" r="1.5"/>
    <circle cx="82" cy="15" r="1.5"/><circle cx="90" cy="17" r="1.5"/>
  </g>
  <path d="M100,36 Q106,28 114,34" fill="#cc2818" opacity="0.65"/>
  <path d="M96,64 Q102,74 110,66" fill="#cc2818" opacity="0.6"/>
  <path d="M126,50 Q138,36 142,32 Q138,44 139,50 Q138,56 142,68 Q138,64 126,50Z" fill="#883040" opacity="0.75"/>
  <path d="M54,64 Q48,74 44,68 Q48,66 54,64Z" fill="#cc281866"/>
  <path d="M30,50 Q30,36 58,32 Q86,28 112,36 Q130,44 130,50 Q130,56 112,64 Q86,72 58,68 Q30,64 30,50Z" fill="url(#r8_body)"/>
  <g clip-path="url(#r8_clip)" opacity="0.35">
    <line x1="48" y1="28" x2="48" y2="72" stroke="#cc2818" stroke-width="1.5"/>
    <line x1="60" y1="26" x2="60" y2="74" stroke="#cc2818" stroke-width="1.5"/>
    <line x1="72" y1="26" x2="72" y2="74" stroke="#cc2818" stroke-width="1.5"/>
    <line x1="84" y1="26" x2="84" y2="74" stroke="#cc2818" stroke-width="1.5"/>
    <line x1="96" y1="28" x2="96" y2="72" stroke="#cc2818" stroke-width="1.5"/>
    <line x1="108" y1="32" x2="108" y2="68" stroke="#cc2818" stroke-width="1.5"/>
    <line x1="36" y1="38" x2="124" y2="38" stroke="#cc2818" stroke-width="1.2"/>
    <line x1="34" y1="50" x2="126" y2="50" stroke="#cc2818" stroke-width="1.2"/>
    <line x1="36" y1="62" x2="124" y2="62" stroke="#cc2818" stroke-width="1.2"/>
  </g>
  <g clip-path="url(#r8_clip)" opacity="0.15">
    <rect x="50" y="40" width="8" height="8" fill="#f0d0c0" rx="2"/>
    <rect x="62" y="40" width="8" height="8" fill="#f0d0c0" rx="2"/>
    <rect x="74" y="40" width="8" height="8" fill="#f0d0c0" rx="2"/>
    <rect x="86" y="40" width="8" height="8" fill="#f0d0c0" rx="2"/>
    <rect x="50" y="52" width="8" height="8" fill="#f0d0c0" rx="2"/>
    <rect x="62" y="52" width="8" height="8" fill="#f0d0c0" rx="2"/>
    <rect x="74" y="52" width="8" height="8" fill="#f0d0c0" rx="2"/>
    <rect x="86" y="52" width="8" height="8" fill="#f0d0c0" rx="2"/>
  </g>
  <path d="M30,50 Q20,48 12,48 Q14,50 12,52 Q20,52 30,50" fill="#e0a898" stroke="#cc281822" stroke-width="0.5"/>
  <circle cx="38" cy="44" r="5" fill="#2244cc"/>
  <circle cx="37" cy="43" r="3" fill="#0a0a4a"/>
  <circle cx="36" cy="42" r="1.2" fill="#88aaff" opacity="0.7"/>
  <circle cx="35.5" cy="41.5" r="0.6" fill="white"/>
  <path d="M48,56 Q40,64 36,60 Q42,58 48,56Z" fill="#cc281866"/>
</svg>`,

  'Royal Tang': `<svg width="160" height="100" viewBox="0 0 160 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="r9_body" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#2266ee"/><stop offset="50%" stop-color="#1a55cc"/><stop offset="100%" stop-color="#1144aa"/>
    </linearGradient>
    <radialGradient id="r9_glow" cx="0.5" cy="0.5" r="0.6"><stop offset="0%" stop-color="#4488ff22"/><stop offset="100%" stop-color="#4488ff00"/></radialGradient>
    <clipPath id="r9_clip"><ellipse cx="72" cy="50" rx="34" ry="28"/></clipPath>
  </defs>
  <path d="M44,34 Q48,28 54,18 Q66,8 80,10 Q94,14 100,28 Q102,33 102,37" fill="#1144aa" opacity="0.8"/>
  <path d="M44,34 Q48,28 54,18 Q66,8 80,10 Q94,14 100,28 Q102,33 102,37" fill="none" stroke="#0a0a2a" stroke-width="1.5" opacity="0.5"/>
  <path d="M46,68 Q50,72 56,80 Q68,86 82,84 Q94,80 100,70 Q102,66 102,63" fill="#1144aa" opacity="0.75"/>
  <path d="M104,50 Q118,32 124,26 Q120,42 121,50 Q120,58 124,74 Q118,68 104,50Z" fill="#ffcc00" opacity="0.9"/>
  <path d="M54,72 Q48,78 42,72 Q48,70 54,72Z" fill="#1144aa66"/>
  <ellipse cx="72" cy="50" rx="44" ry="36" fill="url(#r9_glow)"/>
  <ellipse cx="72" cy="50" rx="34" ry="28" fill="url(#r9_body)"/>
  <g clip-path="url(#r9_clip)">
    <path d="M44,40 Q50,30 70,28 Q90,26 100,36 Q106,44 104,52 Q100,64 90,68 Q80,72 68,68 Q58,64 52,56 Q48,50 44,46Z" fill="#0a0a2a" opacity="0.5"/>
  </g>
  <path d="M96,48 L102,46 L98,50 L102,54 L96,52" fill="#ffcc00" opacity="0.8"/>
  <circle cx="48" cy="44" r="5" fill="#ffee44"/><circle cx="47" cy="43" r="3" fill="#0a0a2a"/><circle cx="46" cy="42" r="1.2" fill="white"/>
  <path d="M39,52 Q37,50 39,48" fill="none" stroke="#0a0a4466" stroke-width="1.2" stroke-linecap="round"/>
  <path d="M54,56 Q46,62 44,58 Q48,56 54,56Z" fill="#1a55cc66"/>
</svg>`,
};

// Prefix mappings: mockup prefix → fish-specific prefix
const PREFIX_MAP = {
  'Butterflyfish': { old: 'r5_', new: 'bf_' },
  'Needlefish':    { old: 'r6_', new: 'nf_' },
  'Sauger':        { old: 'r7_', new: 'sg_' },
  'Hawkfish':      { old: 'r8_', new: 'hf_' },
  'Royal Tang':    { old: 'r9_', new: 'rt_' },
};

// Fish config for FISH array
const FISH_CONFIG = [
  { name: 'Butterflyfish', emoji: '\uD83D\uDC1F', rarity: 'RARE', wMin: 0.3,  wMax: 1.5,  lMin: 4,  lMax: 8  },
  { name: 'Needlefish',    emoji: '\uD83D\uDC1F', rarity: 'RARE', wMin: 1.0,  wMax: 8.0,  lMin: 12, lMax: 36 },
  { name: 'Sauger',        emoji: '\uD83D\uDC1F', rarity: 'RARE', wMin: 1.0,  wMax: 5.0,  lMin: 10, lMax: 20 },
  { name: 'Hawkfish',      emoji: '\uD83D\uDC1F', rarity: 'RARE', wMin: 0.5,  wMax: 2.0,  lMin: 4,  lMax: 10 },
  { name: 'Royal Tang',    emoji: '\uD83D\uDC1F', rarity: 'RARE', wMin: 0.5,  wMax: 2.5,  lMin: 5,  lMax: 10 },
];

function uniquifyIds(svgStr, oldPrefix, newPrefix) {
  let result = svgStr;
  const esc = oldPrefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  result = result.replace(new RegExp(`id="${esc}`, 'g'), `id="${newPrefix}`);
  result = result.replace(new RegExp(`url\\(#${esc}`, 'g'), `url(#${newPrefix}`);
  return result;
}

function toBase64DataURI(svgStr) {
  return `data:image/svg+xml;base64,${Buffer.from(svgStr).toString('base64')}`;
}

// ── Encode SVGs ───────────────────────────────────────────────────────────────
console.log('=== Encoding Batch 2B fish SVGs ===\n');
const encodedSVGs = {};
for (const [name, rawSvg] of Object.entries(RAW_SVGS)) {
  const { old: oldPfx, new: newPfx } = PREFIX_MAP[name];
  const uniquified = uniquifyIds(rawSvg, oldPfx, newPfx);
  encodedSVGs[name] = toBase64DataURI(uniquified);
  console.log(`✓ ${name} (prefix: ${newPfx})`);
}

// ── Generate insertion strings ────────────────────────────────────────────────
function generateFishEntries() {
  const lines = ['  // New Rare (Batch 2B)'];
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

// 1. Insert FISH array entries — after the last Batch 2A entry (Yellow Tang)
const yellowTangMarker = `{ name:'Yellow Tang'`;
const ytPos = g.indexOf(yellowTangMarker);
if (ytPos === -1) { console.error('❌ Cannot find Yellow Tang entry'); process.exit(1); }
const ytLineEnd = g.indexOf('\n', ytPos);
if (ytLineEnd === -1) { console.error('❌ Cannot find end of Yellow Tang line'); process.exit(1); }
g = g.slice(0, ytLineEnd + 1) + generateFishEntries() + '\n' + g.slice(ytLineEnd + 1);
console.log('✓ Inserted FISH array entries after Yellow Tang');

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
