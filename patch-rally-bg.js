const fs = require('fs');

// ── Read source files ─────────────────────────────────────────────────────────
const bgData = fs.readFileSync('C:/Users/jmurp/OneDrive/Desktop/TruckDriver/MonsterRally-BG-Images-Data.js', 'utf8');
let html = fs.readFileSync('C:/Users/jmurp/OneDrive/Desktop/TruckDriver/games/monster-rally/index.html', 'utf8');

// ── 1. Build the constants block to insert ────────────────────────────────────
// Trim the data file and append the LEVEL_BG_MAP
const levelBgMap = `\n// Level-to-background image mapping (envIndex + 1 = level number 1-8)
const LEVEL_BG_MAP = {
  1: 'desert_night',
  2: 'sunset_city',
  3: 'neon_arena',
  4: 'stormy_highway',
  5: 'moon_surface',
  6: 'jungle_ruins',
  7: 'lava_world',
  8: 'rainbow_road'
};\n`;

const insertBlock = '\n' + bgData.trim() + levelBgMap;

// ── 2. Insert after `let campaignSequence = [];` ──────────────────────────────
const anchor = 'let campaignSequence = [];';
if (!html.includes(anchor)) { console.error('ERROR: anchor not found'); process.exit(1); }
html = html.replace(anchor, anchor + insertBlock);
console.log('1. BG image data + LEVEL_BG_MAP inserted.');

// ── 3. Modify drawEnvironmentBg to use painted backgrounds ────────────────────
// Find the opening line of drawEnvironmentBg and add image check before gradient
const oldEnvBgStart = `function drawEnvironmentBg(env) {
  // Sky gradient
  const skyGrad = ctx.createLinearGradient(0, 0, 0, GROUND_Y);`;

const newEnvBgStart = `function drawEnvironmentBg(env) {
  // Painted background — use pre-rendered image if available, else fallback to gradient
  const _bgKey = LEVEL_BG_MAP[currentEnvIndex + 1];
  if (_bgKey && LEVEL_BG_IMGS[_bgKey] && LEVEL_BG_IMGS[_bgKey].complete && LEVEL_BG_IMGS[_bgKey].naturalWidth > 0) {
    ctx.drawImage(LEVEL_BG_IMGS[_bgKey], 0, 0, W, H);
    return;
  }
  // Fallback gradient (while image loads or for unknown envs)
  // Sky gradient
  const skyGrad = ctx.createLinearGradient(0, 0, 0, GROUND_Y);`;

if (!html.includes(oldEnvBgStart)) { console.error('ERROR: drawEnvironmentBg start not found'); process.exit(1); }
html = html.replace(oldEnvBgStart, newEnvBgStart);
console.log('2. drawEnvironmentBg patched with image check.');

// ── 4. Patch drawTitleScreen to use menu_arena background ─────────────────────
const oldTitle = `function drawTitleScreen() {
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.fillRect(0, 0, W, H);`;

const newTitle = `function drawTitleScreen() {
  // Painted menu background
  if (LEVEL_BG_IMGS['menu_arena'] && LEVEL_BG_IMGS['menu_arena'].complete && LEVEL_BG_IMGS['menu_arena'].naturalWidth > 0) {
    ctx.drawImage(LEVEL_BG_IMGS['menu_arena'], 0, 0, W, H);
  } else {
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(0, 0, W, H);
  }
  // Dark overlay so title text stays readable
  ctx.fillStyle = 'rgba(0,0,0,0.45)';
  ctx.fillRect(0, 0, W, H);`;

if (!html.includes(oldTitle)) { console.error('ERROR: drawTitleScreen start not found'); process.exit(1); }
html = html.replace(oldTitle, newTitle);
console.log('3. drawTitleScreen patched.');

// ── 5. Patch drawPickerScreen to use menu_arena background ────────────────────
const oldPicker = `function drawPickerScreen() {
  ctx.fillStyle = 'rgba(0,0,0,0.75)';
  ctx.fillRect(0, 0, W, H);`;

const newPicker = `function drawPickerScreen() {
  // Painted menu background
  if (LEVEL_BG_IMGS['menu_arena'] && LEVEL_BG_IMGS['menu_arena'].complete && LEVEL_BG_IMGS['menu_arena'].naturalWidth > 0) {
    ctx.drawImage(LEVEL_BG_IMGS['menu_arena'], 0, 0, W, H);
  } else {
    ctx.fillStyle = 'rgba(0,0,0,0.75)';
    ctx.fillRect(0, 0, W, H);
  }
  // Dark overlay so picker UI stays readable
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.fillRect(0, 0, W, H);`;

if (!html.includes(oldPicker)) { console.error('ERROR: drawPickerScreen start not found'); process.exit(1); }
html = html.replace(oldPicker, newPicker);
console.log('4. drawPickerScreen patched.');

// ── 6. Patch drawModeSelectScreen to use menu_arena background ────────────────
const oldMode = `function drawModeSelectScreen() {
  ctx.fillStyle = 'rgba(0,0,0,0.85)';
  ctx.fillRect(0, 0, W, H);`;

const newMode = `function drawModeSelectScreen() {
  // Painted menu background
  if (LEVEL_BG_IMGS['menu_arena'] && LEVEL_BG_IMGS['menu_arena'].complete && LEVEL_BG_IMGS['menu_arena'].naturalWidth > 0) {
    ctx.drawImage(LEVEL_BG_IMGS['menu_arena'], 0, 0, W, H);
  } else {
    ctx.fillStyle = 'rgba(0,0,0,0.85)';
    ctx.fillRect(0, 0, W, H);
  }
  // Dark overlay so mode select UI stays readable
  ctx.fillStyle = 'rgba(0,0,0,0.7)';
  ctx.fillRect(0, 0, W, H);`;

if (!html.includes(oldMode)) { console.error('ERROR: drawModeSelectScreen start not found'); process.exit(1); }
html = html.replace(oldMode, newMode);
console.log('5. drawModeSelectScreen patched.');

// ── 7. Write game file ────────────────────────────────────────────────────────
fs.writeFileSync('C:/Users/jmurp/OneDrive/Desktop/TruckDriver/games/monster-rally/index.html', html, 'utf8');
const finalSize = (html.length / 1024 / 1024).toFixed(2);
console.log(`6. File written. Final size: ${finalSize} MB`);

// ── 8. Verify key counts ──────────────────────────────────────────────────────
const keys = ['desert_night','sunset_city','neon_arena','stormy_highway','moon_surface','jungle_ruins','lava_world','rainbow_road','menu_arena'];
for (const k of keys) {
  const count = (html.match(new RegExp(k, 'g')) || []).length;
  console.log(`   ${k}: ${count} refs`);
}
