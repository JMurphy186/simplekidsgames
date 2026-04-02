#!/usr/bin/env node
// patch-batch2-ur-b.js — Add Ultra Rare Batch B (Seahorse, Halfmoon Tuna, Thornback Ray, Octopus)
const fs = require('fs');

const GAME_FILE = 'games/catch-and-reel/index.html';

const RAW_SVGS = {
  'Seahorse': `<svg width="160" height="100" viewBox="0 0 160 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="ur4_body" x1="0.3" y1="0" x2="0.7" y2="1">
      <stop offset="0%" stop-color="#c89040"/><stop offset="40%" stop-color="#b07830"/><stop offset="100%" stop-color="#8a6020"/>
    </linearGradient>
  </defs>
  <path d="M76,4 L73,0 L76,3 L79,-1 L82,2 L85,0 L82,5 L78,6Z" fill="#a07028" opacity="0.85"/>
  <g stroke="#a07028" stroke-width="1.2" stroke-linecap="round" fill="none" opacity="0.6">
    <path d="M74,3 Q68,-2 64,-4"/><path d="M64,-4 Q62,-6 60,-4"/>
    <path d="M76,1 Q72,-4 68,-6"/><path d="M80,3 Q84,-2 88,-3"/><path d="M85,2 Q90,-2 92,0"/>
  </g>
  <g fill="#8a6020" opacity="0.65">
    <circle cx="88" cy="16" r="2"/><circle cx="90" cy="24" r="2"/><circle cx="92" cy="32" r="2"/>
    <circle cx="92" cy="40" r="2"/><circle cx="90" cy="48" r="2"/><circle cx="88" cy="56" r="1.8"/><circle cx="84" cy="64" r="1.5"/>
  </g>
  <g fill="#8a6020" opacity="0.45">
    <circle cx="64" cy="18" r="1.5"/><circle cx="62" cy="24" r="1.5"/><circle cx="66" cy="30" r="1.5"/>
    <circle cx="70" cy="38" r="1.5"/><circle cx="72" cy="46" r="1.5"/><circle cx="72" cy="54" r="1.5"/><circle cx="72" cy="62" r="1.3"/>
  </g>
  <path d="M76,8 Q82,8 86,12 Q90,20 92,30 Q94,40 92,48 Q90,54 88,60 Q86,66 82,72 L74,72 Q74,66 74,60 Q74,52 72,46 Q70,40 68,34 Q66,28 66,22 Q66,16 70,10 Q72,8 76,8Z" fill="url(#ur4_body)"/>
  <ellipse cx="72" cy="10" rx="10" ry="7" fill="#b07830" transform="rotate(-15,72,10)"/>
  <circle cx="68" cy="12" r="1" fill="#805018" opacity="0.25"/>
  <path d="M62,12 Q56,14 50,14 Q48,14 48,12 Q48,10 50,10 Q56,10 62,10Z" fill="#b07830"/>
  <line x1="54" y1="10" x2="54" y2="14" stroke="#8a6020" stroke-width="0.6" opacity="0.4"/>
  <line x1="58" y1="10" x2="58" y2="14" stroke="#8a6020" stroke-width="0.6" opacity="0.4"/>
  <circle cx="48" cy="12" r="1.2" fill="#805018"/>
  <circle cx="72" cy="8" r="3.5" fill="#ddcc88"/><circle cx="71" cy="7" r="2.2" fill="#2a1a00"/><circle cx="70.5" cy="6.5" r="0.8" fill="white"/>
  <path d="M86,16 Q92,12 94,16 Q92,20 86,20" fill="#c89040" opacity="0.4"/>
  <g stroke="#805018" stroke-width="0.9" opacity="0.5">
    <line x1="68" y1="22" x2="86" y2="20"/><line x1="66" y1="28" x2="90" y2="28"/>
    <line x1="68" y1="34" x2="92" y2="34"/><line x1="70" y1="40" x2="92" y2="40"/>
    <line x1="72" y1="46" x2="90" y2="46"/><line x1="72" y1="52" x2="88" y2="52"/>
    <line x1="72" y1="58" x2="86" y2="58"/><line x1="72" y1="64" x2="84" y2="64"/>
  </g>
  <path d="M90,38 Q96,34 98,40 Q96,44 90,44" fill="#c89040" opacity="0.45"/>
  <g fill="#805018" opacity="0.2"><circle cx="80" cy="28" r="0.8"/><circle cx="84" cy="36" r="0.7"/><circle cx="82" cy="44" r="0.8"/><circle cx="80" cy="52" r="0.7"/></g>
  <path d="M68,24 Q66,34 68,44 Q70,54 72,62" fill="none" stroke="#d8b060" stroke-width="3" opacity="0.12"/>
  <path d="M78,72 Q74,78 68,84 Q62,90 60,94 Q58,98 62,98 Q66,96 72,92 Q78,86 82,80 Q84,76 82,74" fill="none" stroke="#8a6020" stroke-width="5" stroke-linecap="round"/>
  <g fill="#8a6020" opacity="0.5"><circle cx="74" cy="76" r="1.2"/><circle cx="68" cy="82" r="1.2"/><circle cx="64" cy="90" r="1"/><circle cx="62" cy="96" r="0.8"/></g>
</svg>`,

  'Halfmoon Tuna': `<svg width="160" height="100" viewBox="0 0 160 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="ur5_body" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#1a3a6a"/><stop offset="40%" stop-color="#3a6a9a"/><stop offset="55%" stop-color="#a0b8c8"/><stop offset="100%" stop-color="#d8e0e8"/></linearGradient>
    <radialGradient id="ur5_metal" cx="0.4" cy="0.35" r="0.4"><stop offset="0%" stop-color="#88bbdd22"/><stop offset="100%" stop-color="#88bbdd00"/></radialGradient>
    <clipPath id="ur5_clip"><path d="M20,50 Q20,34 50,28 Q80,22 114,32 Q140,42 140,50 Q140,58 114,68 Q80,78 50,72 Q20,66 20,50Z"/></clipPath>
  </defs>
  <path d="M52,32 Q54,20 58,28 Q60,18 64,26 Q66,22 70,30" fill="#1a3a6a" opacity="0.75"/>
  <path d="M104,36 Q108,28 112,34" fill="#1a3a6a" opacity="0.6"/>
  <g fill="#ffcc00" opacity="0.8"><ellipse cx="118" cy="38" rx="3" ry="2" transform="rotate(-20,118,38)"/><ellipse cx="124" cy="40" rx="2.5" ry="1.5" transform="rotate(-15,124,40)"/><ellipse cx="129" cy="42" rx="2" ry="1.5" transform="rotate(-10,129,42)"/><ellipse cx="118" cy="62" rx="3" ry="2" transform="rotate(20,118,62)"/><ellipse cx="124" cy="60" rx="2.5" ry="1.5" transform="rotate(15,124,60)"/><ellipse cx="129" cy="58" rx="2" ry="1.5" transform="rotate(10,129,58)"/></g>
  <path d="M104,64 Q108,72 112,66" fill="#1a3a6a" opacity="0.6"/>
  <path d="M52,64 Q48,72 44,68 Q48,66 52,64Z" fill="#3a6a9a66"/>
  <path d="M136,50 Q146,30 154,18 Q148,38 150,48" fill="#1a3a6a" opacity="0.85"/>
  <path d="M136,50 Q146,70 154,82 Q148,62 150,52" fill="#1a3a6a" opacity="0.85"/>
  <rect x="132" y="47" width="8" height="6" rx="2" fill="#5a8aaa"/>
  <path d="M20,50 Q20,34 50,28 Q80,22 114,32 Q140,42 140,50 Q140,58 114,68 Q80,78 50,72 Q20,66 20,50Z" fill="url(#ur5_body)"/>
  <path d="M20,50 Q20,34 50,28 Q80,22 114,32 Q140,42 140,50 Q140,58 114,68 Q80,78 50,72 Q20,66 20,50Z" fill="url(#ur5_metal)"/>
  <g clip-path="url(#ur5_clip)"><line x1="30" y1="48" x2="134" y2="46" stroke="#6a9abb" stroke-width="1" opacity="0.3"/></g>
  <circle cx="30" cy="46" r="5" fill="#d8e8f0"/><circle cx="29" cy="45" r="3.2" fill="#1a2a4a"/><circle cx="28" cy="44" r="1.2" fill="white"/>
  <path d="M20,50 Q18,52 20,54" fill="none" stroke="#2a4a6a44" stroke-width="1.2"/>
  <path d="M40,56 Q32,64 28,60 Q34,58 40,56Z" fill="#3a6a9a88"/>
</svg>`,

  'Thornback Ray': `<svg width="160" height="100" viewBox="0 0 160 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="ur6_body" cx="0.4" cy="0.45" r="0.55">
      <stop offset="0%" stop-color="#c8aa80"/><stop offset="50%" stop-color="#aa8a60"/><stop offset="100%" stop-color="#887050"/>
    </radialGradient>
    <clipPath id="ur6_clip"><ellipse cx="58" cy="50" rx="44" ry="36"/></clipPath>
  </defs>
  <path d="M100,50 Q112,50 122,48 Q128,46 132,46" fill="none" stroke="#887050" stroke-width="4" stroke-linecap="round"/>
  <path d="M130,46 Q136,38 140,40 Q138,44 136,46 Q138,48 140,52 Q136,54 130,46Z" fill="#887050" opacity="0.7"/>
  <ellipse cx="58" cy="50" rx="44" ry="36" fill="url(#ur6_body)"/>
  <g clip-path="url(#ur6_clip)" opacity="0.2">
    <circle cx="38" cy="35" r="8" fill="#bbaa88"/><circle cx="62" cy="30" r="6" fill="#ccbb98"/>
    <circle cx="82" cy="40" r="7" fill="#bbaa88"/><circle cx="45" cy="55" r="6" fill="#ccbb98"/>
    <circle cx="68" cy="58" r="8" fill="#bbaa88"/><circle cx="42" cy="70" r="5" fill="#ccbb98"/>
    <circle cx="78" cy="65" r="6" fill="#bbaa88"/>
  </g>
  <g fill="#665540" opacity="0.8">
    <polygon points="58,18 56,24 60,24"/><circle cx="58" cy="24" r="2"/>
    <polygon points="58,28 56,34 60,34"/><circle cx="58" cy="34" r="2"/>
    <polygon points="58,38 56,44 60,44"/><circle cx="58" cy="44" r="2"/>
    <polygon points="58,48 56,54 60,54"/><circle cx="58" cy="54" r="2"/>
  </g>
  <g fill="#665540" opacity="0.5">
    <circle cx="38" cy="36" r="1.5"/><circle cx="28" cy="44" r="1.5"/><circle cx="22" cy="52" r="1.5"/>
    <circle cx="78" cy="36" r="1.5"/><circle cx="88" cy="44" r="1.5"/><circle cx="92" cy="52" r="1.5"/>
  </g>
  <circle cx="46" cy="38" r="3.5" fill="#ccbb88"/><circle cx="45" cy="37" r="2.2" fill="#2a2a10"/><circle cx="44.5" cy="36.5" r="0.8" fill="white" opacity="0.5"/>
  <circle cx="70" cy="38" r="3.5" fill="#ccbb88"/><circle cx="69" cy="37" r="2.2" fill="#2a2a10"/><circle cx="68.5" cy="36.5" r="0.8" fill="white" opacity="0.5"/>
</svg>`,

  'Octopus': `<svg width="160" height="100" viewBox="0 0 160 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="ur7_body" cx="0.45" cy="0.4" r="0.55"><stop offset="0%" stop-color="#cc4466"/><stop offset="50%" stop-color="#aa3355"/><stop offset="100%" stop-color="#882244"/></radialGradient>
    <clipPath id="ur7_clip"><ellipse cx="100" cy="34" rx="28" ry="22"/></clipPath>
  </defs>
  <path d="M84,50 Q70,60 56,72 Q48,78 44,84 Q42,86 44,86 Q48,84 52,78" fill="none" stroke="#993355" stroke-width="4" stroke-linecap="round" opacity="0.6"/>
  <path d="M88,52 Q78,66 68,80 Q62,88 58,92 Q56,94 58,94 Q62,92 66,84" fill="none" stroke="#993355" stroke-width="3.5" stroke-linecap="round" opacity="0.6"/>
  <path d="M78,48 Q58,52 40,58 Q28,62 18,68 Q14,70 16,70 Q22,68 30,62" fill="none" stroke="#aa3355" stroke-width="5" stroke-linecap="round"/>
  <path d="M80,52 Q62,58 44,66 Q32,72 22,80 Q18,82 20,82 Q26,80 34,74" fill="none" stroke="#aa3355" stroke-width="4.5" stroke-linecap="round"/>
  <path d="M82,54 Q66,62 50,74 Q40,82 32,90 Q28,94 30,94 Q36,90 42,82" fill="none" stroke="#aa3355" stroke-width="4" stroke-linecap="round"/>
  <path d="M86,54 Q74,68 64,82 Q56,92 52,96 Q50,98 52,98 Q56,94 62,86" fill="none" stroke="#993355" stroke-width="3.5" stroke-linecap="round"/>
  <path d="M92,54 Q86,72 80,86 Q76,94 74,96 Q74,98 76,96 Q80,90 84,80" fill="none" stroke="#882244" stroke-width="3" stroke-linecap="round" opacity="0.7"/>
  <path d="M96,52 Q96,70 94,84 Q92,92 92,96 Q92,98 94,96 Q96,90 96,78" fill="none" stroke="#882244" stroke-width="3" stroke-linecap="round" opacity="0.7"/>
  <g fill="#dd88aa" opacity="0.5"><circle cx="56" cy="54" r="2"/><circle cx="46" cy="58" r="1.8"/><circle cx="36" cy="62" r="1.5"/><circle cx="26" cy="66" r="1.3"/><circle cx="58" cy="62" r="2"/><circle cx="48" cy="68" r="1.8"/><circle cx="38" cy="74" r="1.5"/><circle cx="62" cy="68" r="1.8"/><circle cx="52" cy="76" r="1.5"/></g>
  <ellipse cx="100" cy="34" rx="28" ry="22" fill="url(#ur7_body)"/>
  <g clip-path="url(#ur7_clip)" opacity="0.2"><circle cx="90" cy="28" r="5" fill="#661133"/><circle cx="105" cy="24" r="4" fill="#661133"/><circle cx="115" cy="32" r="5" fill="#661133"/><circle cx="95" cy="40" r="4" fill="#661133"/><circle cx="110" cy="42" r="3" fill="#661133"/></g>
  <g clip-path="url(#ur7_clip)" opacity="0.08"><ellipse cx="95" cy="30" rx="16" ry="10" fill="#44ddcc"/><ellipse cx="108" cy="38" rx="12" ry="8" fill="#dd44cc"/></g>
  <circle cx="84" cy="34" r="7" fill="#ffeecc"/><circle cx="83" cy="33" r="5" fill="#1a0a0a"/>
  <rect x="79" y="32" width="8" height="2.5" rx="1" fill="#3a2a1a"/>
  <circle cx="81" cy="31.5" r="1.2" fill="white" opacity="0.5"/>
  <ellipse cx="88" cy="50" rx="4" ry="3" fill="#993355" opacity="0.6"/>
</svg>`,
};

const PREFIX_MAP = {
  'Seahorse':      { old: 'ur4_', new: 'sh_' },
  'Halfmoon Tuna': { old: 'ur5_', new: 'ht_' },
  'Thornback Ray': { old: 'ur6_', new: 'tr_' },
  'Octopus':       { old: 'ur7_', new: 'oc_' },
};

const FISH_CONFIG = [
  { name: 'Seahorse',      emoji: '\uD83D\uDC1F', rarity: 'ULTRA_RARE', wMin: 0.01, wMax: 0.1,  lMin: 2,  lMax: 6  },
  { name: 'Halfmoon Tuna', emoji: '\uD83D\uDC1F', rarity: 'ULTRA_RARE', wMin: 15.0, wMax: 80.0, lMin: 24, lMax: 60 },
  { name: 'Thornback Ray', emoji: '\uD83D\uDC1F', rarity: 'ULTRA_RARE', wMin: 5.0,  wMax: 25.0, lMin: 14, lMax: 36 },
  { name: 'Octopus',       emoji: '\uD83D\uDC1F', rarity: 'ULTRA_RARE', wMin: 3.0,  wMax: 20.0, lMin: 12, lMax: 36 },
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

console.log('=== Encoding Ultra Rare Batch B SVGs ===\n');
const encodedSVGs = {};
for (const [name, rawSvg] of Object.entries(RAW_SVGS)) {
  const { old: oldPfx, new: newPfx } = PREFIX_MAP[name];
  const uniquified = uniquifyIds(rawSvg, oldPfx, newPfx);
  encodedSVGs[name] = toBase64DataURI(uniquified);
  console.log(`✓ ${name} (prefix: ${newPfx})`);
}

function generateFishEntries() {
  const lines = ['  // New Ultra Rare (Batch 2B)'];
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

// Insert FISH array entries after last Batch A Ultra Rare (Sawfish)
const anchorMarker = `{ name:'Sawfish'`;
const anchorPos = g.indexOf(anchorMarker);
if (anchorPos === -1) { console.error('❌ Cannot find Sawfish entry'); process.exit(1); }
const anchorLineEnd = g.indexOf('\n', anchorPos);
if (anchorLineEnd === -1) { console.error('❌ Cannot find end of Sawfish line'); process.exit(1); }
g = g.slice(0, anchorLineEnd + 1) + generateFishEntries() + '\n' + g.slice(anchorLineEnd + 1);
console.log('✓ Inserted FISH array entries after Sawfish');

// Insert FISH_SVGS entries before closing
const svgClose = '\n};\n\n// Preload fish images';
const svgClosePos = g.indexOf(svgClose);
if (svgClosePos === -1) { console.error('❌ Cannot find FISH_SVGS closing'); process.exit(1); }
g = g.slice(0, svgClosePos) + '\n' + generateSVGEntries() + '\n' + g.slice(svgClosePos);
console.log('✓ Inserted FISH_SVGS entries');

if (nl === '\r\n') g = g.replace(/\n/g, '\r\n');
fs.writeFileSync(GAME_FILE, g, 'utf8');
console.log(`\n✅ Done! New file size: ${(fs.statSync(GAME_FILE).size / 1024 / 1024).toFixed(2)}MB`);
