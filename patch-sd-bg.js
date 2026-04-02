const fs = require('fs');

// ── Read data files ───────────────────────────────────────────────────────────
const menuData = fs.readFileSync('C:/Users/jmurp/OneDrive/Desktop/TruckDriver/space_dodge-MenuBG-Data.js', 'utf8');
const worldData = fs.readFileSync('C:/Users/jmurp/OneDrive/Desktop/TruckDriver/SpaceDodge-WorldBG-Data.js', 'utf8');

let html = fs.readFileSync('C:/Users/jmurp/OneDrive/Desktop/TruckDriver/games/space-dodge/index.html', 'utf8');

// ── 1. Build insert block: menu BG + world BGs + WORLD_BG_MAP ─────────────────
const worldBgMap = `
// World index to background image key
const WORLD_BG_MAP = ['deep_space', 'nebula', 'asteroid_belt', 'ice_field', 'supernova'];
`;

const insertBlock = '\n' + menuData.trim() + '\n\n' + worldData.trim() + worldBgMap;

// Insert just after the WORLDS constant closing ];
const anchor = '];';
// Find the specific WORLDS array closing — it's after the 5 world entries
// Use a reliable unique anchor: the line after WORLDS
const worldsAnchor = "{ name: 'SUPERNOVA',      bg: '#2e0a0a', starColor: [255,205,210], accent: '#FF8A65', baseSpeed: 2.8, spawnStart: 38, spawnMin: 15, speedInc: 0.001,  spawnDec: 0.016, threshold: 550 },\n];";
if (!html.includes(worldsAnchor)) { console.error('ERROR: WORLDS anchor not found'); process.exit(1); }
html = html.replace(worldsAnchor, worldsAnchor + insertBlock);
console.log('1. Image data inserted after WORLDS constant.');

// ── 2. Patch drawTitle() — replace solid fill + drawStars with painted BG ─────
const oldTitle = `  ctx.fillStyle = '#0a0a2e';
  ctx.fillRect(0, 0, W, H);
  drawStars();`;

const newTitle = `  // Painted menu background
  if (MENU_BG_IMG && MENU_BG_IMG.complete && MENU_BG_IMG.naturalWidth > 0) {
    ctx.drawImage(MENU_BG_IMG, 0, 0, W, H);
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.fillRect(0, 0, W, H);
  } else {
    ctx.fillStyle = '#0a0a2e';
    ctx.fillRect(0, 0, W, H);
  }
  drawStars();`;

if (!html.includes(oldTitle)) { console.error('ERROR: drawTitle background not found'); process.exit(1); }
html = html.replace(oldTitle, newTitle);
console.log('2. drawTitle patched.');

// ── 3. Patch drawWorldBackground() — inject painted BG before gradient ─────────
const oldWorldBg = `function drawWorldBackground() {
  const idx = getWorldIdx();
  const w = WORLDS[idx];

  // Base gradient
  drawWorldGradient(idx);

  // World-specific decorations
  if (idx === 0) drawDeepSpaceDecor();
  else if (idx === 1) drawNebulaDecor();
  else if (idx === 2) drawAsteroidBeltDecor();
  else if (idx === 3) drawIceFieldDecor();
  else if (idx === 4) drawSupernovaDecor();

  // Stars (already tinted per world)
  drawStars();
}`;

const newWorldBg = `function drawWorldBackground() {
  const idx = getWorldIdx();
  const w = WORLDS[idx];
  const bgKey = WORLD_BG_MAP[idx];

  // Painted world background — gradient as fallback while loading
  if (bgKey && WORLD_BG_IMGS[bgKey] && WORLD_BG_IMGS[bgKey].complete && WORLD_BG_IMGS[bgKey].naturalWidth > 0) {
    ctx.drawImage(WORLD_BG_IMGS[bgKey], 0, 0, W, H);
  } else {
    // Fallback gradient
    drawWorldGradient(idx);
  }

  // World-specific decorations (render on top of painted background)
  if (idx === 0) drawDeepSpaceDecor();
  else if (idx === 1) drawNebulaDecor();
  else if (idx === 2) drawAsteroidBeltDecor();
  else if (idx === 3) drawIceFieldDecor();
  else if (idx === 4) drawSupernovaDecor();

  // Stars (already tinted per world)
  drawStars();
}`;

if (!html.includes(oldWorldBg)) { console.error('ERROR: drawWorldBackground not found'); process.exit(1); }
html = html.replace(oldWorldBg, newWorldBg);
console.log('3. drawWorldBackground patched.');

// ── 4. Write file ─────────────────────────────────────────────────────────────
fs.writeFileSync('C:/Users/jmurp/OneDrive/Desktop/TruckDriver/games/space-dodge/index.html', html, 'utf8');
const sizeMB = (html.length / 1024 / 1024).toFixed(2);
console.log('4. File written. Size:', sizeMB, 'MB');

// ── 5. Verify ─────────────────────────────────────────────────────────────────
console.log('MENU_BG_IMG defined:', html.includes('const MENU_BG_IMG = new Image()'));
console.log('WORLD_BG_IMGS defined:', html.includes('const WORLD_BG_IMGS = {}'));
console.log('WORLD_BG_MAP defined:', html.includes('const WORLD_BG_MAP = ['));
console.log('drawTitle patched:', html.includes("MENU_BG_IMG && MENU_BG_IMG.complete"));
console.log('drawWorldBackground patched:', html.includes('WORLD_BG_IMGS[bgKey]'));
const worldKeys = ['deep_space','nebula','asteroid_belt','ice_field','supernova'];
for (const k of worldKeys) {
  console.log(' ', k + ':', (html.match(new RegExp(k, 'g')) || []).length, 'refs');
}
