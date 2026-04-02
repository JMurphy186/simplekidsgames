#!/usr/bin/env node
// patch-batch2-ur-a.js — Add Ultra Rare Batch A (Angelfish, Cuttlefish, Stingray, Sawfish)
const fs = require('fs');

const GAME_FILE = 'games/catch-and-reel/index.html';

const RAW_SVGS = {
  'Angelfish': `<svg width="160" height="100" viewBox="0 0 160 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="ur0_body" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1144cc"/>
      <stop offset="50%" stop-color="#1a55dd"/>
      <stop offset="100%" stop-color="#1144cc"/>
    </linearGradient>
    <clipPath id="ur0_clip"><ellipse cx="72" cy="50" rx="36" ry="28"/></clipPath>
  </defs>
  <path d="M44,32 Q50,22 60,14 Q74,10 88,16 Q98,28 104,37" fill="#1144cc" opacity="0.8"/>
  <path d="M44,32 Q50,22 60,14 Q74,10 88,16 Q98,28 104,37" fill="none" stroke="#2266ee" stroke-width="1" opacity="0.6"/>
  <path d="M50,74 Q58,80 68,82 Q82,80 94,74 Q100,68 104,62" fill="#1a1a2a" opacity="0.75"/>
  <path d="M50,74 Q58,80 68,82 Q82,80 94,74 Q100,68 104,62" fill="none" stroke="#2266ee" stroke-width="1" opacity="0.5"/>
  <path d="M106,50 Q118,34 124,28 Q120,44 121,50 Q120,56 124,72 Q118,66 106,50Z" fill="#ffcc00" opacity="0.9"/>
  <path d="M54,72 Q48,80 42,76 Q48,74 54,72Z" fill="#1a1a2a66"/>
  <ellipse cx="72" cy="50" rx="36" ry="28" fill="url(#ur0_body)"/>
  <g clip-path="url(#ur0_clip)">
    <rect x="36" y="24" width="72" height="3" fill="#ffcc00" opacity="0.8"/>
    <rect x="36" y="30" width="72" height="3" fill="#ffcc00" opacity="0.8"/>
    <rect x="36" y="36" width="72" height="3" fill="#ffcc00" opacity="0.8"/>
    <rect x="36" y="42" width="72" height="3" fill="#ffcc00" opacity="0.8"/>
    <rect x="36" y="48" width="72" height="3" fill="#ffcc00" opacity="0.8"/>
    <rect x="36" y="54" width="72" height="3" fill="#ffcc00" opacity="0.8"/>
    <rect x="36" y="60" width="72" height="3" fill="#ffcc00" opacity="0.8"/>
    <rect x="36" y="66" width="72" height="3" fill="#ffcc00" opacity="0.8"/>
    <rect x="36" y="72" width="72" height="3" fill="#ffcc00" opacity="0.8"/>
  </g>
  <g clip-path="url(#ur0_clip)">
    <path d="M36,34 Q42,30 48,34 Q52,40 52,50 Q52,60 48,66 Q42,70 36,66" fill="#0a0a2a" opacity="0.8"/>
  </g>
  <g clip-path="url(#ur0_clip)">
    <path d="M48,34 Q52,40 52,50 Q52,60 48,66" fill="none" stroke="#2288ff" stroke-width="2.5" opacity="0.7"/>
  </g>
  <path d="M38,48 Q34,46 32,48 Q34,50 32,52 Q34,54 38,52" fill="white" opacity="0.7"/>
  <circle cx="44" cy="46" r="4" fill="#ffcc44"/>
  <circle cx="43" cy="45" r="2.5" fill="#0a0a2a"/>
  <circle cx="42" cy="44" r="1" fill="white"/>
  <path d="M56,56 Q48,62 46,58 Q50,56 56,56Z" fill="#ffcc0044"/>
</svg>`,

  'Cuttlefish': `<svg width="160" height="100" viewBox="0 0 160 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="ur1_body" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#8a5030"/><stop offset="30%" stop-color="#aa7050"/><stop offset="60%" stop-color="#cc9068"/><stop offset="100%" stop-color="#886848"/></linearGradient>
    <clipPath id="ur1_clip"><ellipse cx="80" cy="50" rx="40" ry="22"/></clipPath>
  </defs>
  <path d="M42,30 Q50,26 58,30 Q66,26 74,30 Q82,26 90,30 Q98,26 106,30 Q114,28 118,32" fill="#aa7050" opacity="0.5"/>
  <path d="M42,70 Q50,74 58,70 Q66,74 74,70 Q82,74 90,70 Q98,74 106,70 Q114,72 118,68" fill="#aa7050" opacity="0.5"/>
  <path d="M40,44 Q28,38 20,36 Q22,40 24,42" fill="none" stroke="#aa7050" stroke-width="2" stroke-linecap="round" opacity="0.7"/>
  <path d="M40,48 Q26,44 16,44 Q18,48 20,48" fill="none" stroke="#aa7050" stroke-width="2" stroke-linecap="round" opacity="0.7"/>
  <path d="M40,52 Q26,56 16,56 Q18,52 20,52" fill="none" stroke="#aa7050" stroke-width="2" stroke-linecap="round" opacity="0.7"/>
  <path d="M40,56 Q28,62 20,64 Q22,60 24,58" fill="none" stroke="#aa7050" stroke-width="2" stroke-linecap="round" opacity="0.7"/>
  <path d="M40,46 Q22,32 8,26" fill="none" stroke="#cc9068" stroke-width="1.8" stroke-linecap="round" opacity="0.8"/>
  <ellipse cx="7" cy="25" rx="4" ry="2.5" fill="#cc9068" opacity="0.7" transform="rotate(-20,7,25)"/>
  <path d="M40,54 Q22,68 8,74" fill="none" stroke="#cc9068" stroke-width="1.8" stroke-linecap="round" opacity="0.8"/>
  <ellipse cx="7" cy="75" rx="4" ry="2.5" fill="#cc9068" opacity="0.7" transform="rotate(20,7,75)"/>
  <ellipse cx="80" cy="50" rx="40" ry="22" fill="url(#ur1_body)"/>
  <g clip-path="url(#ur1_clip)" opacity="0.3"><circle cx="60" cy="42" r="6" fill="#664430"/><circle cx="75" cy="38" r="5" fill="#553320"/><circle cx="90" cy="44" r="7" fill="#664430"/><circle cx="105" cy="42" r="5" fill="#553320"/><circle cx="65" cy="56" r="5" fill="#553320"/><circle cx="82" cy="58" r="6" fill="#664430"/><circle cx="98" cy="56" r="5" fill="#553320"/></g>
  <g clip-path="url(#ur1_clip)" opacity="0.1"><ellipse cx="75" cy="46" rx="20" ry="8" fill="#44ccaa"/><ellipse cx="90" cy="52" rx="15" ry="6" fill="#cc44aa"/></g>
  <circle cx="50" cy="48" r="6" fill="#ccddaa"/><circle cx="50" cy="48" r="4" fill="#1a2a0a"/>
  <path d="M47,48 L48,46 L50,49 L52,46 L53,48" fill="none" stroke="#88aa44" stroke-width="1" stroke-linecap="round"/>
  <circle cx="48.5" cy="47" r="0.6" fill="white" opacity="0.5"/>
</svg>`,

  'Stingray': `<svg width="160" height="100" viewBox="0 0 160 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="ur2_body" cx="0.4" cy="0.45" r="0.55">
      <stop offset="0%" stop-color="#c8b898"/><stop offset="50%" stop-color="#a89878"/><stop offset="100%" stop-color="#887858"/>
    </radialGradient>
    <clipPath id="ur2_clip"><ellipse cx="62" cy="50" rx="48" ry="36"/></clipPath>
  </defs>
  <path d="M108,50 Q122,50 134,48 Q144,46 152,42" fill="none" stroke="#887858" stroke-width="2" stroke-linecap="round"/>
  <path d="M108,50 Q122,51 134,52" fill="none" stroke="#887858" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/>
  <path d="M146,44 L152,42 L148,40" fill="#665838" opacity="0.8"/>
  <ellipse cx="62" cy="50" rx="48" ry="36" fill="url(#ur2_body)"/>
  <ellipse cx="62" cy="50" rx="48" ry="36" fill="none" stroke="#c8b898" stroke-width="1" opacity="0.3"/>
  <g clip-path="url(#ur2_clip)" opacity="0.4">
    <circle cx="35" cy="35" r="2.5" fill="#44aacc"/><circle cx="48" cy="30" r="2" fill="#44aacc"/>
    <circle cx="62" cy="28" r="2.5" fill="#44aacc"/><circle cx="76" cy="32" r="2" fill="#44aacc"/>
    <circle cx="88" cy="38" r="2.5" fill="#44aacc"/><circle cx="28" cy="48" r="2" fill="#44aacc"/>
    <circle cx="42" cy="44" r="2.5" fill="#44aacc"/><circle cx="56" cy="40" r="2" fill="#44aacc"/>
    <circle cx="70" cy="42" r="2.5" fill="#44aacc"/><circle cx="84" cy="46" r="2" fill="#44aacc"/>
    <circle cx="35" cy="58" r="2" fill="#44aacc"/><circle cx="50" cy="56" r="2.5" fill="#44aacc"/>
    <circle cx="65" cy="54" r="2" fill="#44aacc"/><circle cx="78" cy="56" r="2.5" fill="#44aacc"/>
    <circle cx="40" cy="68" r="2" fill="#44aacc"/><circle cx="55" cy="66" r="2" fill="#44aacc"/>
    <circle cx="70" cy="64" r="2.5" fill="#44aacc"/><circle cx="82" cy="62" r="2" fill="#44aacc"/>
  </g>
  <g clip-path="url(#ur2_clip)"><ellipse cx="55" cy="52" rx="18" ry="12" fill="#d8c8a8" opacity="0.2"/></g>
  <circle cx="48" cy="38" r="3.5" fill="#aabb88"/><circle cx="47" cy="37" r="2.2" fill="#1a2a1a"/><circle cx="46.5" cy="36.5" r="0.8" fill="white" opacity="0.5"/>
  <circle cx="72" cy="38" r="3.5" fill="#aabb88"/><circle cx="71" cy="37" r="2.2" fill="#1a2a1a"/><circle cx="70.5" cy="36.5" r="0.8" fill="white" opacity="0.5"/>
  <g opacity="0.2"><line x1="48" y1="52" x2="54" y2="52" stroke="#665838" stroke-width="1"/><line x1="48" y1="55" x2="54" y2="55" stroke="#665838" stroke-width="1"/><line x1="48" y1="58" x2="54" y2="58" stroke="#665838" stroke-width="1"/><line x1="68" y1="52" x2="74" y2="52" stroke="#665838" stroke-width="1"/><line x1="68" y1="55" x2="74" y2="55" stroke="#665838" stroke-width="1"/><line x1="68" y1="58" x2="74" y2="58" stroke="#665838" stroke-width="1"/></g>
</svg>`,

  'Sawfish': `<svg width="160" height="100" viewBox="0 0 160 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="ur3_body" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#4a5a68"/><stop offset="50%" stop-color="#5a6a78"/><stop offset="100%" stop-color="#8a9aa8"/>
    </linearGradient>
  </defs>
  <rect x="-2" y="48" width="58" height="4" rx="1" fill="#5a6a78"/>
  <g fill="#4a5a68">
    <polygon points="6,48 8,44 10,48"/><polygon points="14,48 16,44 18,48"/><polygon points="22,48 24,44 26,48"/>
    <polygon points="30,48 32,44 34,48"/><polygon points="38,48 40,44 42,48"/><polygon points="46,48 48,44 50,48"/>
    <polygon points="6,52 8,56 10,52"/><polygon points="14,52 16,56 18,52"/><polygon points="22,52 24,56 26,52"/>
    <polygon points="30,52 32,56 34,52"/><polygon points="38,52 40,56 42,52"/><polygon points="46,52 48,56 50,52"/>
  </g>
  <path d="M92,38 Q96,18 102,36" fill="#4a5a68" opacity="0.85"/>
  <path d="M118,40 Q122,28 126,38" fill="#4a5a68" opacity="0.7"/>
  <path d="M72,56 Q64,70 56,76 Q62,66 66,58" fill="#5a6a78" opacity="0.55"/>
  <path d="M88,56 Q96,70 104,76 Q98,66 94,58" fill="#5a6a78" opacity="0.55"/>
  <path d="M132,50 Q140,32 148,20 Q144,40 145,48 Q144,52 148,68 Q142,60 132,50Z" fill="#4a5a68" opacity="0.85"/>
  <path d="M54,50 Q54,40 70,36 Q90,32 112,38 Q134,44 134,50 Q134,56 112,62 Q90,68 70,64 Q54,60 54,50Z" fill="url(#ur3_body)"/>
  <ellipse cx="58" cy="50" rx="10" ry="10" fill="#5a6a78"/>
  <circle cx="60" cy="44" r="3" fill="#ccdd88"/><circle cx="59" cy="43" r="1.8" fill="#2a3a2a"/><circle cx="58.5" cy="42.5" r="0.7" fill="white" opacity="0.5"/>
  <g opacity="0.3"><line x1="66" y1="44" x2="66" y2="50" stroke="#3a4a58" stroke-width="1"/><line x1="68" y1="44" x2="68" y2="50" stroke="#3a4a58" stroke-width="1"/><line x1="70" y1="44" x2="70" y2="50" stroke="#3a4a58" stroke-width="1"/></g>
</svg>`,
};

const PREFIX_MAP = {
  'Angelfish':  { old: 'ur0_', new: 'af2_' },
  'Cuttlefish': { old: 'ur1_', new: 'ct_'  },
  'Stingray':   { old: 'ur2_', new: 'sr_'  },
  'Sawfish':    { old: 'ur3_', new: 'sw_'  },
};

const FISH_CONFIG = [
  { name: 'Angelfish',  emoji: '\uD83D\uDC1F', rarity: 'ULTRA_RARE', wMin: 1.0,  wMax: 4.0,   lMin: 6,  lMax: 14 },
  { name: 'Cuttlefish', emoji: '\uD83D\uDC1F', rarity: 'ULTRA_RARE', wMin: 2.0,  wMax: 10.0,  lMin: 8,  lMax: 20 },
  { name: 'Stingray',   emoji: '\uD83D\uDC1F', rarity: 'ULTRA_RARE', wMin: 10.0, wMax: 50.0,  lMin: 18, lMax: 48 },
  { name: 'Sawfish',    emoji: '\uD83D\uDC1F', rarity: 'ULTRA_RARE', wMin: 20.0, wMax: 100.0, lMin: 36, lMax: 84 },
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

console.log('=== Encoding Ultra Rare Batch A SVGs ===\n');
const encodedSVGs = {};
for (const [name, rawSvg] of Object.entries(RAW_SVGS)) {
  const { old: oldPfx, new: newPfx } = PREFIX_MAP[name];
  const uniquified = uniquifyIds(rawSvg, oldPfx, newPfx);
  encodedSVGs[name] = toBase64DataURI(uniquified);
  console.log(`✓ ${name} (prefix: ${newPfx})`);
}

function generateFishEntries() {
  const lines = ['  // New Ultra Rare (Batch 2A)'];
  for (const f of FISH_CONFIG) {
    lines.push(`  { name:'${f.name}', emoji:'${f.emoji}', rarity:'ULTRA_RARE', wMin:${f.wMin}, wMax:${f.wMax}, lMin:${f.lMin}, lMax:${f.lMax} },`);
  }
  return lines.join('\n');
}

function generateSVGEntries() {
  return FISH_CONFIG
    .filter(f => encodedSVGs[f.name])
    .map(f => `  "${f.name}": "${encodedSVGs[f.name]}",`)
    .join('\n');
}

console.log('\n=== Patching game file ===\n');
let game = fs.readFileSync(GAME_FILE, 'utf8');
const nl = game.includes('\r\n') ? '\r\n' : '\n';
console.log(`Line endings: ${nl === '\r\n' ? 'CRLF' : 'LF'}`);
let g = game.replace(/\r\n/g, '\n');

// Insert FISH array entries after last existing Ultra Rare (Electric Eel)
const anchorMarker = `{ name:'Electric Eel'`;
const anchorPos = g.indexOf(anchorMarker);
if (anchorPos === -1) { console.error('❌ Cannot find Electric Eel entry'); process.exit(1); }
const anchorLineEnd = g.indexOf('\n', anchorPos);
if (anchorLineEnd === -1) { console.error('❌ Cannot find end of Electric Eel line'); process.exit(1); }
g = g.slice(0, anchorLineEnd + 1) + generateFishEntries() + '\n' + g.slice(anchorLineEnd + 1);
console.log('✓ Inserted FISH array entries after Electric Eel');

// Insert FISH_SVGS entries before closing
const svgClose = '\n};\n\n// Preload fish images';
const svgClosePos = g.indexOf(svgClose);
if (svgClosePos === -1) { console.error('❌ Cannot find FISH_SVGS closing'); process.exit(1); }
g = g.slice(0, svgClosePos) + '\n' + generateSVGEntries() + '\n' + g.slice(svgClosePos);
console.log('✓ Inserted FISH_SVGS entries');

if (nl === '\r\n') g = g.replace(/\n/g, '\r\n');
fs.writeFileSync(GAME_FILE, g, 'utf8');
console.log(`\n✅ Done! New file size: ${(fs.statSync(GAME_FILE).size / 1024 / 1024).toFixed(2)}MB`);
