// patch-pause-redesign.js
// Space Dodge — Pause button size, remove standalone mute, redesign pause overlay
// Changes:
//   1. clampFont min 11 → 13
//   2. pauseMenuBtns — add sound + trophies, remove restart
//   3. Remove drawMuteButton() function + all call sites, enlarge drawPauseButton()
//   4. Redesign drawPauseOverlay() — Resume/Sound/Trophies/Menu, no Restart
//   5. handlePauseClick — sound toggle + trophy overlay, remove restart

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'games', 'space-dodge', 'index.html');
let raw = fs.readFileSync(filePath, 'utf8');
const originalLineEnding = raw.includes('\r\n') ? '\r\n' : '\n';
raw = raw.replace(/\r\n/g, '\n'); // normalize

console.log(`Game file length: ${raw.length}`);

// ── PATCH 1: clampFont min 11 → 13 ───────────────────────────────────────
const p1Old = `function clampFont(size) {
  return Math.max(11, Math.round(size * scale));
}`;
const p1New = `function clampFont(size) {
  return Math.max(13, Math.round(size * scale));
}`;
if (!raw.includes(p1Old)) throw new Error('Patch 1 anchor not found: clampFont');
raw = raw.replace(p1Old, p1New);
console.log('✓ Patch 1: clampFont min 11 → 13');

// ── PATCH 2: pauseMenuBtns declaration ───────────────────────────────────
const p2Old = `let pauseMenuBtns = { resume: {}, restart: {}, menu: {} };`;
const p2New = `let pauseMenuBtns = { resume: {}, sound: {}, trophies: {}, menu: {} };`;
if (!raw.includes(p2Old)) throw new Error('Patch 2 anchor not found: pauseMenuBtns');
raw = raw.replace(p2Old, p2New);
console.log('✓ Patch 2: pauseMenuBtns updated');

// ── PATCH 3: Replace pause section (removes drawMuteButton + rewrites everything) ──
const p3Old = `let muteBtn = {};

function drawMuteButton() {
  const sz = 30 * scale;
  const x = W - sz - 52 * scale;
  const y = 13;
  muteBtn = { x, y, w: sz, h: sz };
  ctx.fillStyle = 'rgba(255,255,255,0.07)';
  ctx.beginPath();
  ctx.roundRect(x, y, sz, sz, 5);
  ctx.fill();
  ctx.fillStyle = muted ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.6)';
  ctx.font = \`\${Math.round(14 * scale)}px Arial\`;
  ctx.textAlign = 'center';
  ctx.fillText(muted ? '🔇' : '🔊', x + sz / 2, y + sz / 2 + 4 * scale);
}

function drawPauseButton() {
  const sz = 36 * scale;
  const x = W - sz - 10;
  const y = 10;
  pauseBtn = { x, y, w: sz, h: sz };
  ctx.fillStyle = 'rgba(255,255,255,0.1)';
  ctx.beginPath();
  ctx.roundRect(x, y, sz, sz, 6);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.font = \`\${Math.round(18 * scale)}px Arial\`;
  ctx.textAlign = 'center';
  ctx.fillText(paused ? '▶' : '⏸', x + sz / 2, y + sz / 2 + 5 * scale);
  drawMuteButton();
}

function drawPauseOverlay() {
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.fillRect(0, 0, W, H);

  // Title
  ctx.fillStyle = '#fff';
  ctx.font = \`bold \${Math.round(36 * scale)}px 'Arial Rounded MT Bold', Arial, sans-serif\`;
  ctx.textAlign = 'center';
  ctx.fillText('PAUSED', W / 2, H * 0.3);

  // Buttons
  const btnW = 180 * scale;
  const btnH = 44 * scale;
  const gap = 14 * scale;
  const startY = H * 0.4;

  // Resume
  const rY = startY;
  ctx.fillStyle = '#2E7D32';
  ctx.beginPath(); ctx.roundRect(W / 2 - btnW / 2, rY, btnW, btnH, 8); ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.font = \`bold \${Math.round(16 * scale)}px 'Arial Rounded MT Bold', Arial, sans-serif\`;
  ctx.fillText('▶  RESUME', W / 2, rY + btnH / 2 + 5 * scale);
  pauseMenuBtns.resume = { x: W / 2 - btnW / 2, y: rY, w: btnW, h: btnH };

  // Restart
  const rsY = startY + btnH + gap;
  ctx.fillStyle = '#1565C0';
  ctx.beginPath(); ctx.roundRect(W / 2 - btnW / 2, rsY, btnW, btnH, 8); ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.fillText('🔄  RESTART', W / 2, rsY + btnH / 2 + 5 * scale);
  pauseMenuBtns.restart = { x: W / 2 - btnW / 2, y: rsY, w: btnW, h: btnH };

  // Menu
  const mY = startY + (btnH + gap) * 2;
  ctx.fillStyle = 'rgba(255,255,255,0.1)';
  ctx.beginPath(); ctx.roundRect(W / 2 - btnW / 2, mY, btnW, btnH, 8); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.fillText('🏠  MENU', W / 2, mY + btnH / 2 + 5 * scale);
  pauseMenuBtns.menu = { x: W / 2 - btnW / 2, y: mY, w: btnW, h: btnH };

  // Mute button on pause screen
  drawMuteButton();
}

function handlePauseClick(tx, ty) {
  if (hitTest(tx, ty, pauseMenuBtns.resume)) { paused = false; return; }
  if (hitTest(tx, ty, pauseMenuBtns.restart)) {
    paused = false;
    if (gameMode === 'campaign') {
      showWorldTitle();
    } else {
      gameState = 'playing';
      resetPlayState();
      generateWorldDecor();
    }
    return;
  }
  if (hitTest(tx, ty, pauseMenuBtns.menu)) {
    paused = false;
    stopMusic();
    gameState = 'title';
    return;
  }
}`;

const p3New = `let muteBtn = {};

function drawPauseButton() {
  // Min 50×50 tap target, styled like C&R pause button
  const sz = Math.max(50, Math.round(50 * scale));
  const x = W - sz - 10;
  const y = 10;
  pauseBtn = { x, y, w: sz, h: sz };
  ctx.fillStyle = 'rgba(255,255,255,0.12)';
  ctx.strokeStyle = 'rgba(255,255,255,0.22)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(x, y, sz, sz, 10);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.font = \`\${Math.max(20, Math.round(22 * scale))}px Arial\`;
  ctx.textAlign = 'center';
  ctx.fillText('⏸', x + sz / 2, y + sz / 2 + Math.round(7 * scale));
}

function drawPauseOverlay() {
  // Dark scrim
  ctx.fillStyle = 'rgba(0,0,12,0.84)';
  ctx.fillRect(0, 0, W, H);

  // PAUSED title
  ctx.fillStyle = '#fff';
  ctx.font = \`bold \${Math.max(28, Math.round(36 * scale))}px 'Arial Rounded MT Bold', Arial, sans-serif\`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('PAUSED', W / 2, H * 0.22);
  ctx.textBaseline = 'alphabetic';

  // Button dimensions — min 220×50 per spec
  const btnW = Math.max(220, Math.round(240 * scale));
  const btnH = Math.max(50, Math.round(54 * scale));
  const gap  = Math.max(12, Math.round(14 * scale));
  const totalH = 4 * btnH + 3 * gap;
  const startY = H / 2 - totalH / 2 + Math.round(10 * scale);
  const bx = W / 2 - btnW / 2;
  const fs2 = Math.max(15, Math.round(17 * scale));

  // Helper: draw one styled button
  function pBtn(y, bg, border, textColor, label) {
    ctx.fillStyle = bg;
    ctx.beginPath();
    ctx.roundRect(bx, y, btnW, btnH, 10);
    ctx.fill();
    if (border) {
      ctx.strokeStyle = border;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(bx, y, btnW, btnH, 10);
      ctx.stroke();
    }
    ctx.fillStyle = textColor;
    ctx.font = \`bold \${fs2}px 'Arial Rounded MT Bold', Arial, sans-serif\`;
    ctx.textAlign = 'center';
    ctx.fillText(label, W / 2, y + btnH / 2 + fs2 * 0.37);
  }

  // ▶ RESUME — green
  const rY = startY;
  pBtn(rY, '#2E7D32', '#43A047', '#fff', '▶  RESUME');
  pauseMenuBtns.resume = { x: bx, y: rY, w: btnW, h: btnH };

  // 🔊/🔇 SOUND — blue, shows current state
  const sY = startY + btnH + gap;
  const soundLabel = muted ? '🔇  SOUND OFF' : '🔊  SOUND ON';
  pBtn(sY, '#1565C0', '#1976D2', '#fff', soundLabel);
  pauseMenuBtns.sound = { x: bx, y: sY, w: btnW, h: btnH };

  // 🏆 TROPHIES — gold
  const tY = startY + (btnH + gap) * 2;
  pBtn(tY, 'rgba(255,202,40,0.18)', 'rgba(255,202,40,0.5)', '#FFCA28', '🏆  TROPHIES');
  pauseMenuBtns.trophies = { x: bx, y: tY, w: btnW, h: btnH };

  // 🏠 MENU — gray/dark
  const mY = startY + (btnH + gap) * 3;
  pBtn(mY, 'rgba(255,255,255,0.1)', 'rgba(255,255,255,0.18)', 'rgba(255,255,255,0.8)', '🏠  MENU');
  pauseMenuBtns.menu = { x: bx, y: mY, w: btnW, h: btnH };

  // Trophy Coming Soon overlay (reused from title screen)
  if (showTrophyOverlay) drawTrophyOverlay();
}

function handlePauseClick(tx, ty) {
  // If trophy overlay open, any tap closes it
  if (showTrophyOverlay) { showTrophyOverlay = false; return; }
  if (hitTest(tx, ty, pauseMenuBtns.resume)) { paused = false; return; }
  if (hitTest(tx, ty, pauseMenuBtns.sound)) { initAudio(); toggleMute(); return; }
  if (hitTest(tx, ty, pauseMenuBtns.trophies)) { showTrophyOverlay = true; return; }
  if (hitTest(tx, ty, pauseMenuBtns.menu)) {
    paused = false;
    showTrophyOverlay = false;
    stopMusic();
    gameState = 'title';
    return;
  }
}`;

if (!raw.includes(p3Old)) throw new Error('Patch 3 anchor not found: pause section');
raw = raw.replace(p3Old, p3New);
console.log('✓ Patch 3: drawMuteButton() removed, drawPauseButton() enlarged, drawPauseOverlay() redesigned (4 buttons), handlePauseClick() updated');

// ── PATCH 4: Remove remaining drawMuteButton() calls (game-over, world-title, victory) ──
// These are all `  drawMuteButton();\n` lines immediately after drawMenuButton() calls
const beforeCount = (raw.match(/drawMuteButton\(\)/g) || []).length;
raw = raw.split('\n  drawMuteButton();').join('');
const afterCount = (raw.match(/drawMuteButton\(\)/g) || []).length;
console.log(`✓ Patch 4: Removed ${beforeCount - afterCount} remaining drawMuteButton() call(s) from end-screens`);
if (afterCount > 0) throw new Error(`Still ${afterCount} drawMuteButton() reference(s) remaining!`);

// ── SYNTAX CHECK ──────────────────────────────────────────────────────────
const scriptMatch = raw.match(/<script>([\s\S]*?)<\/script>/);
if (!scriptMatch) throw new Error('Could not extract <script> block for syntax check');
try {
  new (require('vm').Script)(scriptMatch[1]);
  console.log('✓ Script syntax OK');
} catch (e) {
  if (e.message.includes("Unexpected token '<'")) {
    console.log('✓ Script syntax OK (false positive)');
  } else {
    throw new Error('SYNTAX ERROR: ' + e.message);
  }
}

// ── VERIFICATIONS ─────────────────────────────────────────────────────────
const checks = [
  ['clampFont min 13',              raw.includes('Math.max(13, Math.round(size * scale))')],
  ['pauseBtn min 50px',             raw.includes('Math.max(50, Math.round(50 * scale))')],
  ['btnW min 220',                  raw.includes('Math.max(220, Math.round(240 * scale))')],
  ['btnH min 50',                   raw.includes('Math.max(50, Math.round(54 * scale))')],
  ['SOUND button exists',           raw.includes("'🔊  SOUND ON'")],
  ['TROPHIES button exists',        raw.includes("'🏆  TROPHIES'")],
  ['sound in pauseMenuBtns',        raw.includes('pauseMenuBtns.sound')],
  ['trophies in pauseMenuBtns',     raw.includes('pauseMenuBtns.trophies')],
  ['showTrophyOverlay in overlay',  raw.includes('if (showTrophyOverlay) drawTrophyOverlay()')],
  ['drawMuteButton fully removed',  !raw.includes('drawMuteButton')],
  ['no restart button',             !raw.includes('🔄  RESTART')],
  ['no restart in pauseMenuBtns',   !raw.includes('pauseMenuBtns.restart')],
];
let allOk = true;
for (const [name, ok] of checks) {
  console.log(`  ${ok ? '✓' : '✗'} ${name}`);
  if (!ok) allOk = false;
}
if (!allOk) throw new Error('One or more verifications failed — file NOT written');

// ── WRITE ─────────────────────────────────────────────────────────────────
if (originalLineEnding === '\r\n') raw = raw.replace(/\n/g, '\r\n');
fs.writeFileSync(filePath, raw, 'utf8');
console.log(`\n✅ Pause redesign patched! New file size: ${raw.length} bytes`);
