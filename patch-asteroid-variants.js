// patch-asteroid-variants.js
// Adds 4 asteroid SVG variants (Pebble A/B, Rock, Boulder) to space-dodge/index.html

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'games', 'space-dodge', 'index.html');

console.log('Reading', filePath);
let html = fs.readFileSync(filePath, 'utf8');

// ============================================================
// STEP 1: Build the 4 SVG data URIs
// ============================================================

const svgs = {
  pebbleA: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <defs>
    <radialGradient id="pa_body" cx="35%" cy="30%" r="65%">
      <stop offset="0%" stop-color="#BCAAA4"/>
      <stop offset="40%" stop-color="#8D6E63"/>
      <stop offset="80%" stop-color="#5D4037"/>
      <stop offset="100%" stop-color="#3E2723"/>
    </radialGradient>
  </defs>
  <path d="M100,28 C130,20 165,38 175,65 C185,92 178,130 158,150 C138,170 108,178 80,168 C52,158 30,135 28,108 C26,82 42,52 65,38 C75,32 88,30 100,28 Z" fill="url(#pa_body)"/>
  <path d="M65,38 C82,28 112,22 135,32" stroke="#D7CCC8" stroke-width="4" fill="none" opacity="0.35" stroke-linecap="round"/>
  <path d="M85,90 C100,110 120,115 140,108" stroke="#4E342E" stroke-width="2.5" fill="none" opacity="0.4" stroke-linecap="round"/>
  <circle cx="118" cy="75" r="8" fill="#4E342E" opacity="0.3"/>
</svg>`,

  pebbleB: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <defs>
    <radialGradient id="pb_body" cx="32%" cy="28%" r="68%">
      <stop offset="0%" stop-color="#A1887F"/>
      <stop offset="35%" stop-color="#795548"/>
      <stop offset="75%" stop-color="#4E342E"/>
      <stop offset="100%" stop-color="#2E1610"/>
    </radialGradient>
  </defs>
  <polygon points="90,22 128,18 162,38 178,72 170,115 150,155 112,172 72,165 40,142 28,100 35,62 58,35" fill="url(#pb_body)"/>
  <path d="M58,35 C76,24 110,19 140,30" stroke="#D7CCC8" stroke-width="3.5" fill="none" opacity="0.3" stroke-linecap="round"/>
  <path d="M95,65 L112,95 L130,118" stroke="#3E2723" stroke-width="2" fill="none" opacity="0.5" stroke-linecap="round"/>
  <circle cx="78" cy="88" r="6" fill="#3E2723" opacity="0.25"/>
  <circle cx="140" cy="80" r="5" fill="#3E2723" opacity="0.35"/>
</svg>`,

  rock: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <defs>
    <radialGradient id="mr_body" cx="35%" cy="28%" r="65%">
      <stop offset="0%" stop-color="#BCAAA4"/>
      <stop offset="30%" stop-color="#8D6E63"/>
      <stop offset="65%" stop-color="#5D4037"/>
      <stop offset="100%" stop-color="#2E1610"/>
    </radialGradient>
    <radialGradient id="mr_crater1" cx="40%" cy="35%" r="60%">
      <stop offset="0%" stop-color="#1B0E0A"/>
      <stop offset="60%" stop-color="#3E2723"/>
      <stop offset="100%" stop-color="#5D4037"/>
    </radialGradient>
    <radialGradient id="mr_crater2" cx="45%" cy="40%" r="55%">
      <stop offset="0%" stop-color="#1B0E0A"/>
      <stop offset="55%" stop-color="#4E342E"/>
      <stop offset="100%" stop-color="#6D4C41"/>
    </radialGradient>
  </defs>
  <polygon points="100,20 130,15 158,28 178,52 182,82 175,112 162,140 138,162 108,172 78,168 52,152 30,128 22,98 28,68 45,42 70,25" fill="url(#mr_body)"/>
  <path d="M45,42 C62,28 88,18 122,18" stroke="#D7CCC8" stroke-width="5" fill="none" opacity="0.35" stroke-linecap="round"/>
  <path d="M28,68 C36,52 44,43 56,36" stroke="#D7CCC8" stroke-width="3" fill="none" opacity="0.25" stroke-linecap="round"/>
  <ellipse cx="82" cy="80" rx="22" ry="18" fill="url(#mr_crater1)" opacity="0.85"/>
  <path d="M62,90 Q82,98 102,90" stroke="#8D6E63" stroke-width="1.5" fill="none" opacity="0.3"/>
  <ellipse cx="138" cy="110" rx="16" ry="13" fill="url(#mr_crater2)" opacity="0.8"/>
  <path d="M124,118 Q138,124 152,118" stroke="#8D6E63" stroke-width="1.5" fill="none" opacity="0.3"/>
  <path d="M108,55 Q118,90 112,128" stroke="#3E2723" stroke-width="2.5" fill="none" opacity="0.45" stroke-linecap="round"/>
  <path d="M60,115 L88,135 L95,155" stroke="#3E2723" stroke-width="2" fill="none" opacity="0.35" stroke-linecap="round"/>
  <circle cx="155" cy="65" r="5" fill="#3E2723" opacity="0.3"/>
  <circle cx="62" cy="58" r="4" fill="#3E2723" opacity="0.4"/>
  <circle cx="145" cy="148" r="6" fill="#3E2723" opacity="0.35"/>
</svg>`,

  boulder: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <defs>
    <radialGradient id="lb_body" cx="32%" cy="25%" r="70%">
      <stop offset="0%" stop-color="#D7CCC8"/>
      <stop offset="20%" stop-color="#A1887F"/>
      <stop offset="50%" stop-color="#6D4C41"/>
      <stop offset="80%" stop-color="#4E342E"/>
      <stop offset="100%" stop-color="#1B0E0A"/>
    </radialGradient>
    <radialGradient id="lb_c1" cx="40%" cy="35%" r="60%">
      <stop offset="0%" stop-color="#0A0504"/>
      <stop offset="50%" stop-color="#2E1610"/>
      <stop offset="100%" stop-color="#5D4037"/>
    </radialGradient>
    <radialGradient id="lb_c2" cx="45%" cy="38%" r="55%">
      <stop offset="0%" stop-color="#0A0504"/>
      <stop offset="55%" stop-color="#3E2723"/>
      <stop offset="100%" stop-color="#6D4C41"/>
    </radialGradient>
    <radialGradient id="lb_c3" cx="42%" cy="40%" r="58%">
      <stop offset="0%" stop-color="#1B0E0A"/>
      <stop offset="60%" stop-color="#4E342E"/>
      <stop offset="100%" stop-color="#795548"/>
    </radialGradient>
  </defs>
  <polygon points="100,14 132,10 160,22 182,45 188,75 185,108 175,138 155,160 128,175 98,178 68,170 42,152 22,125 15,95 20,64 38,40 65,22" fill="url(#lb_body)"/>
  <path d="M38,40 C55,25 80,15 115,13" stroke="#D7CCC8" stroke-width="6" fill="none" opacity="0.35" stroke-linecap="round"/>
  <path d="M15,95 C16,75 24,56 40,42" stroke="#D7CCC8" stroke-width="4" fill="none" opacity="0.3" stroke-linecap="round"/>
  <path d="M155,160 C168,148 178,132 182,112" stroke="#8D6E63" stroke-width="3" fill="none" opacity="0.25" stroke-linecap="round"/>
  <ellipse cx="78" cy="72" rx="28" ry="24" fill="url(#lb_c1)" opacity="0.9"/>
  <ellipse cx="82" cy="76" rx="18" ry="14" fill="#0A0504" opacity="0.5"/>
  <path d="M52,82 Q78,92 104,82" stroke="#8D6E63" stroke-width="1.5" fill="none" opacity="0.3"/>
  <circle cx="142" cy="95" r="20" fill="url(#lb_c2)" opacity="0.85"/>
  <circle cx="144" cy="97" r="11" fill="#0A0504" opacity="0.5"/>
  <path d="M124,105 Q142,112 160,105" stroke="#8D6E63" stroke-width="1.5" fill="none" opacity="0.28"/>
  <ellipse cx="95" cy="148" rx="14" ry="11" fill="url(#lb_c3)" opacity="0.8"/>
  <path d="M82,154 Q95,159 108,154" stroke="#795548" stroke-width="1.5" fill="none" opacity="0.3"/>
  <path d="M110,45 Q125,72 118,100 Q112,128 125,155" stroke="#2E1610" stroke-width="3" fill="none" opacity="0.5" stroke-linecap="round"/>
  <path d="M118,100 Q135,108 150,102" stroke="#2E1610" stroke-width="2" fill="none" opacity="0.4" stroke-linecap="round"/>
  <path d="M48,110 Q62,128 58,148 L68,170" stroke="#1B0E0A" stroke-width="2" fill="none" opacity="0.4" stroke-linecap="round"/>
  <circle cx="162" cy="55" r="5" fill="#2E1610" opacity="0.4"/>
  <circle cx="50" cy="58" r="4" fill="#2E1610" opacity="0.35"/>
  <circle cx="158" cy="148" r="6" fill="#2E1610" opacity="0.4"/>
  <circle cx="35" cy="128" r="3" fill="#2E1610" opacity="0.3"/>
  <circle cx="170" cy="115" r="4" fill="#2E1610" opacity="0.35"/>
  <circle cx="62" cy="48" r="2" fill="#D7CCC8" opacity="0.3"/>
  <circle cx="168" cy="80" r="1.5" fill="#BCAAA4" opacity="0.28"/>
  <circle cx="132" cy="150" r="2" fill="#D7CCC8" opacity="0.25"/>
</svg>`
};

function toDataURI(svgStr) {
  return 'data:image/svg+xml;base64,' + Buffer.from(svgStr).toString('base64');
}

const PA_B64 = toDataURI(svgs.pebbleA);
const PB_B64 = toDataURI(svgs.pebbleB);
const MR_B64 = toDataURI(svgs.rock);
const LB_B64 = toDataURI(svgs.boulder);

// ============================================================
// STEP 2: Replace ASTEROID_SVG_B64 constant + image loading code
// ============================================================

const OLD_ASTEROID_ASSET = `// --- SVG ASTEROID ASSET ---
const ASTEROID_SVG_B64 = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjAwIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9InJvY2tHcmFkIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI0ExODg3RiIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjUwJSIgc3RvcC1jb2xvcj0iIzc5NTU0OCIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMzRTI3MjMiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8cmFkaWFsR3JhZGllbnQgaWQ9ImNyYXRlckdyYWQiIGN4PSIzMCUiIGN5PSIzMCUiIHI9IjcwJSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiM1RDQwMzciIHN0b3Atb3BhY2l0eT0iMC44Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzIxMjEyMSIgc3RvcC1vcGFjaXR5PSIwLjkiLz4KICAgIDwvcmFkaWFsR3JhZGllbnQ+CiAgPC9kZWZzPgogIDxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEwMCwgMTAwKSI+CiAgICA8cGF0aCBkPSJNIDAgLTg1IEMgNDAgLTkwIDc1IC02MCA4NSAtMjAgQyA5NSAxNSA4MCA2MCA1MCA4MCBDIDE1IDEwMCAtNDAgODUgLTcwIDU1IEMgLTEwMCAyMCAtOTUgLTQwIC02MCAtNzAgQyAtMzAgLTkwIC0xMCAtODAgMCAtODUgWiIgZmlsbD0idXJsKCNyb2NrR3JhZCkiLz4KICAgIDxwYXRoIGQ9Ik0gMCAtODUgQyA0MCAtOTAgNzUgLTYwIDg1IC0yMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjRDdDQ0M4IiBzdHJva2Utd2lkdGg9IjYiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgb3BhY2l0eT0iMC40Ii8+CiAgICA8cGF0aCBkPSJNIC02MCAtNzAgQyAtMzAgLTkwIC0xMCAtODAgMCAtODUiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0Q3Q0NDOCIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtbGluZWNhcD0icm91bmQiIG9wYWNpdHk9IjAuMyIvPgogICAgPHBhdGggZD0iTSAtNTAgMCBRIC0yMCAtMTAgMCAyMCBUIDQwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9IiM0RTM0MkUiIHN0cm9rZS13aWR0aD0iMyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBvcGFjaXR5PSIwLjYiLz4KICAgIDxwYXRoIGQ9Ik0gMzAgLTQwIFEgNDAgLTEwIDIwIDEwIiBmaWxsPSJub25lIiBzdHJva2U9IiM0RTM0MkUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBvcGFjaXR5PSIwLjUiLz4KICAgIDxwYXRoIGQ9Ik0gLTIwIC01MCBRIDAgLTMwIC0xMCAtMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzNFMjcyMyIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtbGluZWNhcD0icm91bmQiIG9wYWNpdHk9IjAuNCIvPgogICAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNDUsIC0xNSkiPgogICAgICA8ZWxsaXBzZSBjeD0iMCIgY3k9IjAiIHJ4PSIyMiIgcnk9IjE4IiBmaWxsPSJ1cmwoI2NyYXRlckdyYWQpIiB0cmFuc2Zvcm09InJvdGF0ZSgtMjApIi8+CiAgICAgIDxwYXRoIGQ9Ik0gLTE1IDEwIFEgMCAyMCAxNSA1IiBmaWxsPSJub25lIiBzdHJva2U9IiNCQ0FBQTQiIHN0cm9rZS13aWR0aD0iMiIgb3BhY2l0eT0iMC41Ii8+CiAgICA8L2c+CiAgICA8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMzUsIDQ1KSI+CiAgICAgIDxjaXJjbGUgY3g9IjAiIGN5PSIwIiByPSIxNiIgZmlsbD0idXJsKCNjcmF0ZXJHcmFkKSIvPgogICAgICA8cGF0aCBkPSJNIC0xMCAxMCBRIDAgMTggMTAgNSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjQkNBQUE0IiBzdHJva2Utd2lkdGg9IjEuNSIgb3BhY2l0eT0iMC40Ii8+CiAgICA8L2c+CiAgICA8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNDAsIC0zNSkiPgogICAgICA8ZWxsaXBzZSBjeD0iMCIgY3k9IjAiIHJ4PSIxMCIgcnk9IjE0IiBmaWxsPSJ1cmwoI2NyYXRlckdyYWQpIiB0cmFuc2Zvcm09InJvdGF0ZSgzMCkiLz4KICAgIDwvZz4KICAgIDxjaXJjbGUgY3g9IjEwIiBjeT0iNTAiIHI9IjQiIGZpbGw9IiMzRTI3MjMiIG9wYWNpdHk9IjAuOCIvPgogICAgPGNpcmNsZSBjeD0iLTEwIiBjeT0iLTYwIiByPSI1IiBmaWxsPSIjM0UyNzIzIiBvcGFjaXR5PSIwLjciLz4KICAgIDxjaXJjbGUgY3g9IjIwIiBjeT0iLTQ1IiByPSIzIiBmaWxsPSIjM0UyNzIzIiBvcGFjaXR5PSIwLjkiLz4KICAgIDxjaXJjbGUgY3g9Ii02MCIgY3k9IjEwIiByPSIzIiBmaWxsPSIjMjEyMTIxIiBvcGFjaXR5PSIwLjYiLz4KICA8L2c+Cjwvc3ZnPgo=';
const asteroidImg = new Image();
asteroidImg.src = ASTEROID_SVG_B64;
let asteroidImgReady = false;
asteroidImg.onload = () => { asteroidImgReady = true; };`;

if (!html.includes(OLD_ASTEROID_ASSET)) {
  console.error('ERROR: Could not find ASTEROID_SVG_B64 block. Aborting.');
  process.exit(1);
}

const NEW_ASTEROID_ASSET = `// --- SVG ASTEROID ASSETS (4 variants) ---
// 0: Pebble A — smooth rounded, small
// 1: Pebble B — elongated angular, small-medium
// 2: Rock     — jagged, medium (also used for title decor)
// 3: Boulder  — massive jagged, large
const ASTEROID_SVGS = [
  '${PA_B64}',
  '${PB_B64}',
  '${MR_B64}',
  '${LB_B64}'
];
const asteroidImgs = ASTEROID_SVGS.map(src => { const img = new Image(); img.src = src; return img; });
let asteroidsLoaded = 0;
asteroidImgs.forEach(img => { img.onload = () => { asteroidsLoaded++; }; });
function allAsteroidsReady() { return asteroidsLoaded > 0; }`;

html = html.replace(OLD_ASTEROID_ASSET, NEW_ASTEROID_ASSET);
console.log('Replaced ASTEROID_SVG_B64 block');

// ============================================================
// STEP 3: Add variant to spawnAsteroid
// ============================================================

const OLD_SPAWN = `function spawnAsteroid() {
  const r = 18 + Math.random() * 28;
  asteroids.push({
    x: r + Math.random() * (W - r * 2),
    y: -r * 2,
    r: r,
    speed: currentSpeed * (0.7 + Math.random() * 0.6),
    rot: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 0.04
  });
}`;

if (!html.includes(OLD_SPAWN)) {
  console.error('ERROR: Could not find spawnAsteroid function. Aborting.');
  process.exit(1);
}

const NEW_SPAWN = `function spawnAsteroid() {
  const r = 18 + Math.random() * 28;
  // Assign variant by radius tier:
  // small (r < 25): Pebble A or B (0/1), medium (r < 35): Rock (2), large: Boulder (3)
  let variant;
  if (r < 25) variant = Math.random() < 0.5 ? 0 : 1;
  else if (r < 35) variant = 2;
  else variant = 3;
  asteroids.push({
    x: r + Math.random() * (W - r * 2),
    y: -r * 2,
    r: r,
    speed: currentSpeed * (0.7 + Math.random() * 0.6),
    rot: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 0.04,
    variant: variant
  });
}`;

html = html.replace(OLD_SPAWN, NEW_SPAWN);
console.log('Updated spawnAsteroid with variant');

// ============================================================
// STEP 4: Update drawAsteroid to use asteroidImgs[a.variant]
// ============================================================

const OLD_DRAW_ASTEROID = `  if (asteroidImgReady) {
    // SVG viewBox 200x200, asteroid shape spans ~170px diameter
    // Scale so game radius matches visual radius
    const drawSize = a.r * 2.35;
    ctx.drawImage(asteroidImg, -drawSize / 2, -drawSize / 2, drawSize, drawSize);
  } else {`;

if (!html.includes(OLD_DRAW_ASTEROID)) {
  console.error('ERROR: Could not find drawAsteroid ctx.drawImage block. Aborting.');
  process.exit(1);
}

const NEW_DRAW_ASTEROID = `  if (allAsteroidsReady()) {
    // SVG viewBox 200x200, asteroid shape spans ~170px diameter
    // Scale so game radius matches visual radius
    const drawSize = a.r * 2.35;
    const img = asteroidImgs[a.variant || 0];
    ctx.drawImage(img, -drawSize / 2, -drawSize / 2, drawSize, drawSize);
  } else {`;

html = html.replace(OLD_DRAW_ASTEROID, NEW_DRAW_ASTEROID);
console.log('Updated drawAsteroid to use variant image');

// ============================================================
// STEP 5: Update drawTitle decorative asteroids to use Rock (index 2)
// ============================================================

const OLD_TITLE_ASTEROID = `    if (asteroidImgReady) {
      ctx.drawImage(asteroidImg, -aSize / 2, -aSize / 2, aSize, aSize);
    } else {`;

if (!html.includes(OLD_TITLE_ASTEROID)) {
  console.error('ERROR: Could not find drawTitle asteroid block. Aborting.');
  process.exit(1);
}

const NEW_TITLE_ASTEROID = `    if (allAsteroidsReady()) {
      ctx.drawImage(asteroidImgs[2], -aSize / 2, -aSize / 2, aSize, aSize);
    } else {`;

html = html.replace(OLD_TITLE_ASTEROID, NEW_TITLE_ASTEROID);
console.log('Updated drawTitle decorative asteroids to use Rock variant');

// ============================================================
// STEP 6: Replace any remaining asteroidImgReady references
// ============================================================

const remainingCount = (html.match(/asteroidImgReady/g) || []).length;
if (remainingCount > 0) {
  html = html.replace(/asteroidImgReady/g, 'asteroidsLoaded > 0');
  console.log(`Replaced ${remainingCount} remaining asteroidImgReady reference(s)`);
}

// Also replace any stray asteroidImg (not inside asteroidImgs) references
const strayAsteroidImg = (html.match(/\basteroidImg\b(?!s)/g) || []).length;
if (strayAsteroidImg > 0) {
  html = html.replace(/\basteroidImg\b(?!s)/g, 'asteroidImgs[0]');
  console.log(`Replaced ${strayAsteroidImg} stray asteroidImg reference(s)`);
}

// ============================================================
// STEP 7: Write output
// ============================================================

fs.writeFileSync(filePath, html, 'utf8');
console.log('Written successfully:', filePath);
