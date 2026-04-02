#!/usr/bin/env node
// patch-fish.js — Extract fish SVGs from mockup, encode, and patch game file
const fs = require('fs');

const MOCKUP = fs.readFileSync('fish-expansion-batch1-v6-review.html', 'utf8');
const GAME_FILE = 'games/catch-and-reel/index.html';

// Fish config: name, prefix, rarity, stats
const FISH_CONFIG = [
  // COMMON
  { name:'Goldfish',     prefix:'gf_', rarity:'COMMON',   wMin:0.1, wMax:0.8,  lMin:3,  lMax:8  },
  { name:'Sunfish',      prefix:'sf_', rarity:'COMMON',   wMin:1.0, wMax:5.0,  lMin:6,  lMax:14 },
  { name:'Shad',         prefix:'sd_', rarity:'COMMON',   wMin:0.5, wMax:3.0,  lMin:6,  lMax:16 },
  { name:'Smelt',        prefix:'sm_', rarity:'COMMON',   wMin:0.1, wMax:0.5,  lMin:3,  lMax:7  },
  { name:'Crappie',      prefix:'cr_', rarity:'COMMON',   wMin:0.3, wMax:2.0,  lMin:5,  lMax:12 },
  { name:'Goby',         prefix:'gb_', rarity:'COMMON',   wMin:0.05,wMax:0.3,  lMin:2,  lMax:5  },
  { name:'Bream',        prefix:'br_', rarity:'COMMON',   wMin:0.5, wMax:3.0,  lMin:5,  lMax:14 },
  { name:'Minnow',       prefix:'mn_', rarity:'COMMON',   wMin:0.05,wMax:0.2,  lMin:2,  lMax:4  },
  { name:'Blue Chromis', prefix:'bc_', rarity:'COMMON',   wMin:0.1, wMax:0.5,  lMin:3,  lMax:6  },
  { name:'Damselfish',   prefix:'df_', rarity:'COMMON',   wMin:0.1, wMax:0.4,  lMin:3,  lMax:5  },
  // UNCOMMON
  { name:'Cichlid',      prefix:'ci_', rarity:'UNCOMMON', wMin:0.5, wMax:3.0,  lMin:4,  lMax:10 },
  { name:'Gourami',      prefix:'go_', rarity:'UNCOMMON', wMin:0.3, wMax:2.0,  lMin:4,  lMax:10 },
  { name:'Cod',          prefix:'co_', rarity:'UNCOMMON', wMin:2.0, wMax:12.0, lMin:10, lMax:28 },
  { name:'Crawfish',     prefix:'cw_', rarity:'UNCOMMON', wMin:0.2, wMax:1.0,  lMin:3,  lMax:7  },
  { name:'Clownfish',    prefix:'cf_', rarity:'UNCOMMON', wMin:0.1, wMax:0.5,  lMin:3,  lMax:5  },
  { name:'Pufferfish',   prefix:'pf_', rarity:'UNCOMMON', wMin:1.0, wMax:6.0,  lMin:6,  lMax:14 },
  { name:'Hermit Crab',  prefix:'hc_', rarity:'UNCOMMON', wMin:0.2, wMax:1.5,  lMin:2,  lMax:6  },
  { name:'Zebrafish',    prefix:'zf_', rarity:'UNCOMMON', wMin:0.3, wMax:1.5,  lMin:4,  lMax:8  },
  { name:'Pilotfish',    prefix:'pl_', rarity:'UNCOMMON', wMin:1.0, wMax:5.0,  lMin:8,  lMax:18 },
  { name:'Cardinalfish', prefix:'cd_', rarity:'UNCOMMON', wMin:0.1, wMax:0.4,  lMin:3,  lMax:5  },
  { name:'Anemonefish',  prefix:'af_', rarity:'UNCOMMON', wMin:0.1, wMax:0.5,  lMin:3,  lMax:5  },
];

// Extract the first (160x100) SVG from each fish card in the mockup
function extractSVGs(html) {
  const results = {};
  const fishNames = [
    'Goldfish', 'Sunfish', 'Shad', 'Smelt', 'Crappie', 'Goby', 'Bream',
    'Minnow', 'Blue Chromis', 'Damselfish', 'Cichlid', 'Gourami', 'Cod',
    'Crawfish', 'Clownfish', 'Pufferfish', 'Hermit Crab', 'Zebrafish',
    'Pilotfish', 'Cardinalfish', 'Anemonefish'
  ];

  for (const name of fishNames) {
    const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const cardPattern = new RegExp(
      `<div class="fish-name">${escaped}[\\s\\S]*?<svg width="160"[\\s\\S]*?</svg>`,
      'i'
    );
    const match = html.match(cardPattern);
    if (!match) {
      console.error(`❌ Could not find SVG for: ${name}`);
      continue;
    }
    const svgStart = match[0].indexOf('<svg width="160"');
    let svgStr = match[0].slice(svgStart);
    const svgEnd = svgStr.indexOf('</svg>') + 6;
    svgStr = svgStr.slice(0, svgEnd);
    results[name] = svgStr;
    console.log(`✓ Extracted: ${name} (${svgStr.length} chars)`);
  }
  return results;
}

function findIds(svgStr) {
  const ids = new Set();
  for (const m of svgStr.matchAll(/id="([^"]+)"/g)) ids.add(m[1]);
  return ids;
}

function uniquifyIds(svgStr, prefix) {
  const ids = [...findIds(svgStr)].sort((a, b) => b.length - a.length);
  let result = svgStr;
  for (const id of ids) {
    const esc = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    result = result.replace(new RegExp(`id="${esc}"`, 'g'), `id="${prefix}${id}"`);
    result = result.replace(new RegExp(`url\\(#${esc}\\)`, 'g'), `url(#${prefix}${id})`);
    result = result.replace(new RegExp(`xlink:href="#${esc}"`, 'g'), `xlink:href="#${prefix}${id}"`);
  }
  return result;
}

function prepareSVG(svgStr) {
  return svgStr.replace(/<svg([^>]*)>/, (match, attrs) => {
    attrs = attrs.replace(/\s+width="[^"]*"/g, '');
    attrs = attrs.replace(/\s+height="[^"]*"/g, '');
    if (!attrs.includes('xmlns=')) attrs += ' xmlns="http://www.w3.org/2000/svg"';
    if (!attrs.includes('viewBox')) attrs += ' viewBox="0 0 160 100"';
    return `<svg${attrs}>`;
  });
}

function toBase64DataURI(svgStr) {
  return `data:image/svg+xml;base64,${Buffer.from(svgStr).toString('base64')}`;
}

// ── Extract & encode ──────────────────────────────────────────────────────────
console.log('=== Extracting fish SVGs from mockup ===\n');
const rawSVGs = extractSVGs(MOCKUP);
const encodedSVGs = {};

for (const config of FISH_CONFIG) {
  const raw = rawSVGs[config.name];
  if (!raw) { console.error(`❌ Missing SVG for ${config.name}`); continue; }
  const uniquified = uniquifyIds(raw, config.prefix);
  const prepared = prepareSVG(uniquified);
  encodedSVGs[config.name] = toBase64DataURI(prepared);
  console.log(`✓ ${config.name}: ${findIds(raw).size} IDs → prefix ${config.prefix}`);
}

// ── Generate insertion strings ────────────────────────────────────────────────
function generateFishEntries() {
  const lines = ['  // New Common (Batch 1)'];
  for (const f of FISH_CONFIG.filter(x => x.rarity === 'COMMON')) {
    lines.push(`  { name:'${f.name}', emoji:'\\uD83D\\uDC1F', rarity:'COMMON',   wMin:${f.wMin}, wMax:${f.wMax}, lMin:${f.lMin}, lMax:${f.lMax} },`);
  }
  lines.push('  // New Uncommon (Batch 1)');
  for (const f of FISH_CONFIG.filter(x => x.rarity === 'UNCOMMON')) {
    lines.push(`  { name:'${f.name}', emoji:'\\uD83D\\uDC1F', rarity:'UNCOMMON', wMin:${f.wMin}, wMax:${f.wMax}, lMin:${f.lMin}, lMax:${f.lMax} },`);
  }
  return lines.join('\n');
}

function generateSVGEntries() {
  return FISH_CONFIG
    .filter(c => encodedSVGs[c.name])
    .map(c => `  "${c.name}": "${encodedSVGs[c.name]}",`)
    .join('\n');
}

// ── Patch game file ───────────────────────────────────────────────────────────
console.log('\n=== Patching game file ===\n');

let game = fs.readFileSync(GAME_FILE, 'utf8');
const nl = game.includes('\r\n') ? '\r\n' : '\n';
console.log(`Line endings: ${nl === '\r\n' ? 'CRLF' : 'LF'}`);

// Normalize to LF for all string operations
let g = game.replace(/\r\n/g, '\n');

// 1. Insert FISH array entries before ];
const fishClose = `  { name:"Poseidon's Trident"`;
const fishClosePos = g.indexOf(fishClose);
if (fishClosePos === -1) { console.error('❌ Cannot find Poseidon entry'); process.exit(1); }
const arrayEnd = g.indexOf('\n];', fishClosePos);
if (arrayEnd === -1) { console.error('❌ Cannot find ]; after Poseidon'); process.exit(1); }
g = g.slice(0, arrayEnd) + '\n' + generateFishEntries() + '\n' + g.slice(arrayEnd);
console.log('✓ Inserted FISH array entries');

// 2. Insert FISH_SVGS entries before };\n\n// Preload fish images
const svgClose = '\n};\n\n// Preload fish images';
const svgClosePos = g.indexOf(svgClose);
if (svgClosePos === -1) { console.error('❌ Cannot find FISH_SVGS closing'); process.exit(1); }
g = g.slice(0, svgClosePos) + '\n' + generateSVGEntries() + '\n' + g.slice(svgClosePos);
console.log('✓ Inserted FISH_SVGS entries');

// Restore original line endings
if (nl === '\r\n') g = g.replace(/\n/g, '\r\n');

fs.writeFileSync(GAME_FILE, g, 'utf8');
console.log(`\n✅ Done! New file size: ${(fs.statSync(GAME_FILE).size / 1024 / 1024).toFixed(2)}MB`);
