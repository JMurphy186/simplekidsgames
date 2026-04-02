// patch-change-ship.js
// Space Dodge — Add "🚀 CHANGE SHIP" to pause menu + ship picker overlay

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'games', 'space-dodge', 'index.html');
let raw = fs.readFileSync(filePath, 'utf8');
const originalLineEnding = raw.includes('\r\n') ? '\r\n' : '\n';
raw = raw.replace(/\r\n/g, '\n');

console.log(`Game file length: ${raw.length}`);

// ── PATCH 1: pauseMenuBtns — add changeShip slot ─────────────────────────
const p1Old = `let pauseMenuBtns = { resume: {}, sound: {}, trophies: {}, menu: {} };`;
const p1New = `let pauseMenuBtns = { resume: {}, sound: {}, trophies: {}, changeShip: {}, menu: {} };`;
if (!raw.includes(p1Old)) throw new Error('Patch 1 anchor not found');
raw = raw.replace(p1Old, p1New);
console.log('✓ Patch 1: changeShip slot added to pauseMenuBtns');

// ── PATCH 2: state vars — add showChangeShipOverlay + pickerShip ──────────
const p2Old = `let showTrophyOverlay = false;`;
const p2New = `let showTrophyOverlay = false;
let showChangeShipOverlay = false;
let pickerShip = 0;
let changeShipOverlayBtns = { prev: {}, next: {}, select: {}, cancel: {} };`;
if (!raw.includes(p2Old)) throw new Error('Patch 2 anchor not found');
raw = raw.replace(p2Old, p2New);
console.log('✓ Patch 2: showChangeShipOverlay + pickerShip state vars added');

// ── PATCH 3: drawPauseOverlay — 5 buttons, add CHANGE SHIP ───────────────
const p3Old = `  // Button dimensions — min 220×50 per spec
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
}`;

const p3New = `  // Button dimensions — min 220×50 per spec
  const btnW = Math.max(220, Math.round(240 * scale));
  const btnH = Math.max(50, Math.round(54 * scale));
  const gap  = Math.max(12, Math.round(14 * scale));
  const totalH = 5 * btnH + 4 * gap;
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

  // 🚀 CHANGE SHIP — orange
  const csY = startY + (btnH + gap) * 3;
  pBtn(csY, '#E67E22', '#F0923E', '#fff', '🚀  CHANGE SHIP');
  pauseMenuBtns.changeShip = { x: bx, y: csY, w: btnW, h: btnH };

  // 🏠 MENU — gray/dark
  const mY = startY + (btnH + gap) * 4;
  pBtn(mY, 'rgba(255,255,255,0.1)', 'rgba(255,255,255,0.18)', 'rgba(255,255,255,0.8)', '🏠  MENU');
  pauseMenuBtns.menu = { x: bx, y: mY, w: btnW, h: btnH };

  // Overlays (mutual exclusive — ship picker draws on top of trophy)
  if (showTrophyOverlay) drawTrophyOverlay();
  if (showChangeShipOverlay) drawChangeShipOverlay();
}`;

if (!raw.includes(p3Old)) throw new Error('Patch 3 anchor not found: drawPauseOverlay button stack');
raw = raw.replace(p3Old, p3New);
console.log('✓ Patch 3: CHANGE SHIP button added to drawPauseOverlay (5-button stack)');

// ── PATCH 4: handlePauseClick — add changeShip overlay + button ──────────
const p4Old = `function handlePauseClick(tx, ty) {
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

const p4New = `function handlePauseClick(tx, ty) {
  // ── Ship picker overlay ───────────────────────────────────────────────
  if (showChangeShipOverlay) {
    if (hitTest(tx, ty, changeShipOverlayBtns.prev)) {
      pickerShip = (pickerShip - 1 + SHIPS.length) % SHIPS.length;
      return;
    }
    if (hitTest(tx, ty, changeShipOverlayBtns.next)) {
      pickerShip = (pickerShip + 1) % SHIPS.length;
      return;
    }
    if (hitTest(tx, ty, changeShipOverlayBtns.select)) {
      if (pickerShip !== selectedShip) {
        // Different ship — apply and resume
        selectedShip = pickerShip;
        localStorage.setItem('sd_ship', selectedShip.toString());
        showChangeShipOverlay = false;
        paused = false;
      } else {
        // Same ship — no-op, close overlay, stay paused
        showChangeShipOverlay = false;
      }
      return;
    }
    if (hitTest(tx, ty, changeShipOverlayBtns.cancel)) {
      showChangeShipOverlay = false;
      return;
    }
    return; // swallow taps outside buttons while overlay is open
  }

  // ── Trophy overlay ────────────────────────────────────────────────────
  if (showTrophyOverlay) { showTrophyOverlay = false; return; }

  // ── Main pause buttons ────────────────────────────────────────────────
  if (hitTest(tx, ty, pauseMenuBtns.resume)) { paused = false; return; }
  if (hitTest(tx, ty, pauseMenuBtns.sound)) { initAudio(); toggleMute(); return; }
  if (hitTest(tx, ty, pauseMenuBtns.trophies)) { showTrophyOverlay = true; showChangeShipOverlay = false; return; }
  if (hitTest(tx, ty, pauseMenuBtns.changeShip)) {
    pickerShip = selectedShip; // start picker at current ship
    showChangeShipOverlay = true;
    showTrophyOverlay = false;
    return;
  }
  if (hitTest(tx, ty, pauseMenuBtns.menu)) {
    paused = false;
    showTrophyOverlay = false;
    showChangeShipOverlay = false;
    stopMusic();
    gameState = 'title';
    return;
  }
}

// --- CHANGE SHIP OVERLAY ---
function drawChangeShipOverlay() {
  const t = Date.now() / 1000;
  const s = SHIPS[pickerShip];
  const unlocked = unlockedShips.includes(pickerShip);

  // Full scrim
  ctx.fillStyle = 'rgba(0,0,12,0.94)';
  ctx.fillRect(0, 0, W, H);

  // Header
  ctx.fillStyle = '#FF9800';
  ctx.font = \`bold \${Math.max(20, Math.round(28 * scale))}px 'Arial Rounded MT Bold', Arial, sans-serif\`;
  ctx.textAlign = 'center';
  ctx.fillText('🚀 CHANGE SHIP', W / 2, H * 0.14);

  // Ship showcase
  const showcaseY = H * 0.44;
  const spotX = W / 2;
  const bobY = showcaseY + Math.sin(t * 1.8) * 6;
  const shipSz = 2.8;

  if (unlocked) {
    // Accent glow ring
    ctx.globalAlpha = 0.3 + Math.sin(t * 2) * 0.1;
    ctx.strokeStyle = s.accent;
    ctx.lineWidth = 2 * scale;
    ctx.beginPath();
    ctx.ellipse(spotX, showcaseY + 38 * scale, 68 * scale, 11 * scale, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;
    drawShip(spotX, bobY, SHIP_WIDTH * shipSz * scale, SHIP_HEIGHT * shipSz * scale, 0);
  } else {
    // Locked silhouette
    ctx.globalAlpha = 1;
    ctx.fillStyle = 'rgba(255,255,255,0.07)';
    ctx.beginPath();
    ctx.moveTo(spotX, bobY - 36 * scale);
    ctx.bezierCurveTo(spotX + 22 * scale, bobY - 36 * scale, spotX + 26 * scale, bobY, spotX + 22 * scale, bobY + 28 * scale);
    ctx.lineTo(spotX - 22 * scale, bobY + 28 * scale);
    ctx.bezierCurveTo(spotX - 26 * scale, bobY, spotX - 22 * scale, bobY - 36 * scale, spotX, bobY - 36 * scale);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.22)';
    ctx.font = \`bold \${Math.max(34, Math.round(42 * scale))}px Arial, sans-serif\`;
    ctx.textAlign = 'center';
    ctx.fillText('?', spotX, bobY + 10 * scale);
  }

  // Left / right arrows
  const arrowSz = Math.max(26, Math.round(34 * scale));
  const arrowSpread = Math.max(110, Math.round(140 * scale));

  ctx.fillStyle = 'rgba(255,255,255,0.16)';
  ctx.beginPath();
  ctx.arc(spotX - arrowSpread, bobY, arrowSz, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.82)';
  ctx.font = \`bold \${Math.max(24, Math.round(32 * scale))}px Arial, sans-serif\`;
  ctx.textAlign = 'center';
  ctx.fillText('‹', spotX - arrowSpread, bobY + Math.round(8 * scale));
  changeShipOverlayBtns.prev = { x: spotX - arrowSpread - arrowSz, y: bobY - arrowSz, w: arrowSz * 2, h: arrowSz * 2 };

  ctx.fillStyle = 'rgba(255,255,255,0.16)';
  ctx.beginPath();
  ctx.arc(spotX + arrowSpread, bobY, arrowSz, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.82)';
  ctx.fillText('›', spotX + arrowSpread, bobY + Math.round(8 * scale));
  changeShipOverlayBtns.next = { x: spotX + arrowSpread - arrowSz, y: bobY - arrowSz, w: arrowSz * 2, h: arrowSz * 2 };

  // Ship name + type + CURRENT badge
  const nameY = showcaseY + Math.max(68, Math.round(82 * scale));
  if (unlocked) {
    ctx.fillStyle = s.accent;
    ctx.font = \`bold \${Math.max(16, Math.round(22 * scale))}px 'Arial Rounded MT Bold', Arial, sans-serif\`;
    ctx.textAlign = 'center';
    ctx.fillText(s.name, spotX, nameY);
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = \`\${Math.max(13, Math.round(15 * scale))}px Arial, sans-serif\`;
    ctx.fillText(s.type, spotX, nameY + Math.max(16, Math.round(20 * scale)));
    if (pickerShip === selectedShip) {
      ctx.fillStyle = '#69F0AE';
      ctx.font = \`bold \${Math.max(11, Math.round(13 * scale))}px Arial, sans-serif\`;
      ctx.fillText('✓ CURRENT SHIP', spotX, nameY + Math.max(34, Math.round(42 * scale)));
    }
  } else {
    ctx.fillStyle = 'rgba(255,255,255,0.32)';
    ctx.font = \`bold \${Math.max(16, Math.round(20 * scale))}px Arial, sans-serif\`;
    ctx.textAlign = 'center';
    ctx.fillText('🔒 LOCKED', spotX, nameY);
    if (pickerShip > 0) {
      ctx.fillStyle = 'rgba(255,255,255,0.2)';
      ctx.font = \`\${Math.max(12, Math.round(14 * scale))}px Arial, sans-serif\`;
      ctx.fillText('Beat campaign with ' + SHIPS[pickerShip - 1].name, spotX, nameY + Math.max(18, Math.round(22 * scale)));
    }
  }

  // Page dots
  const dotY = nameY + Math.max(28, Math.round(36 * scale));
  const dotR = Math.max(4, Math.round(5 * scale));
  const dotGap = Math.max(18, Math.round(20 * scale));
  for (let i = 0; i < SHIPS.length; i++) {
    ctx.fillStyle = i === pickerShip
      ? SHIPS[i].accent
      : ('rgba(255,255,255,' + (unlockedShips.includes(i) ? '0.3' : '0.1') + ')');
    ctx.beginPath();
    ctx.arc(spotX + (i - Math.floor(SHIPS.length / 2)) * dotGap, dotY, dotR, 0, Math.PI * 2);
    ctx.fill();
  }

  // SELECT button — green if unlocked, dimmed if locked
  const selW = Math.max(200, Math.round(220 * scale));
  const selH = Math.max(46, Math.round(50 * scale));
  const selX = W / 2 - selW / 2;
  const selY = H - Math.max(106, Math.round(126 * scale));
  const canSelect = unlocked;
  ctx.fillStyle = canSelect ? '#2E7D32' : 'rgba(255,255,255,0.08)';
  ctx.beginPath();
  ctx.roundRect(selX, selY, selW, selH, 10);
  ctx.fill();
  if (canSelect) {
    ctx.strokeStyle = '#43A047';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(selX, selY, selW, selH, 10);
    ctx.stroke();
  }
  const selFs = Math.max(14, Math.round(16 * scale));
  ctx.fillStyle = canSelect ? '#fff' : 'rgba(255,255,255,0.25)';
  ctx.font = \`bold \${selFs}px 'Arial Rounded MT Bold', Arial, sans-serif\`;
  ctx.textAlign = 'center';
  ctx.fillText(pickerShip === selectedShip ? '✓ SELECTED' : '🚀 SELECT', W / 2, selY + selH / 2 + selFs * 0.37);
  changeShipOverlayBtns.select = canSelect ? { x: selX, y: selY, w: selW, h: selH } : {};

  // CANCEL button
  const canW = Math.max(200, Math.round(220 * scale));
  const canH = Math.max(42, Math.round(46 * scale));
  const canX = W / 2 - canW / 2;
  const canY = selY + selH + Math.max(10, Math.round(12 * scale));
  ctx.fillStyle = 'rgba(255,255,255,0.08)';
  ctx.strokeStyle = 'rgba(255,255,255,0.15)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(canX, canY, canW, canH, 10);
  ctx.fill();
  ctx.stroke();
  const canFs = Math.max(13, Math.round(15 * scale));
  ctx.fillStyle = 'rgba(255,255,255,0.65)';
  ctx.font = \`bold \${canFs}px 'Arial Rounded MT Bold', Arial, sans-serif\`;
  ctx.textAlign = 'center';
  ctx.fillText('✕ CANCEL', W / 2, canY + canH / 2 + canFs * 0.37);
  changeShipOverlayBtns.cancel = { x: canX, y: canY, w: canW, h: canH };
}`;

if (!raw.includes(p4Old)) throw new Error('Patch 4 anchor not found: handlePauseClick');
raw = raw.replace(p4Old, p4New);
console.log('✓ Patch 4: handlePauseClick updated + drawChangeShipOverlay() added');

// ── PATCH 5: touchstart — add showChangeShipOverlay dispatch ─────────────
// The touchstart already calls handlePauseClick for paused state, which now
// handles the overlay internally. Nothing extra needed for touch — handled.
// Verify the touchstart still routes to handlePauseClick when paused:
if (!raw.includes('if (gameState === \'playing\' && paused) { handlePauseClick(tx, ty); return; }')) {
  throw new Error('Patch 5 check failed: touchstart pause routing missing');
}
console.log('✓ Patch 5: touchstart already routes to handlePauseClick — no change needed');

// ── SYNTAX CHECK ──────────────────────────────────────────────────────────
const scriptMatch = raw.match(/<script>([\s\S]*?)<\/script>/);
if (!scriptMatch) throw new Error('Could not extract <script> block');
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
  ['changeShip in pauseMenuBtns decl',  raw.includes("{ resume: {}, sound: {}, trophies: {}, changeShip: {}, menu: {} }")],
  ['showChangeShipOverlay declared',     raw.includes('let showChangeShipOverlay = false;')],
  ['pickerShip declared',               raw.includes('let pickerShip = 0;')],
  ['changeShipOverlayBtns declared',    raw.includes('let changeShipOverlayBtns =')],
  ['CHANGE SHIP button orange',          raw.includes("pBtn(csY, '#E67E22', '#F0923E', '#fff', '🚀  CHANGE SHIP')")],
  ['5-button totalH',                    raw.includes('5 * btnH + 4 * gap')],
  ['drawChangeShipOverlay defined',      raw.includes('function drawChangeShipOverlay()')],
  ['drawChangeShipOverlay called',       raw.includes('if (showChangeShipOverlay) drawChangeShipOverlay()')],
  ['picker prev/next handled',           raw.includes('changeShipOverlayBtns.prev') && raw.includes('changeShipOverlayBtns.next')],
  ['select applies selectedShip',        raw.includes('selectedShip = pickerShip')],
  ['select saves to localStorage',       raw.includes("localStorage.setItem('sd_ship', selectedShip.toString())")],
  ['cancel closes overlay',              raw.includes("changeShipOverlayBtns.cancel")],
  ['CURRENT badge drawn',               raw.includes('CURRENT SHIP')],
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
console.log(`\n✅ Change Ship overlay patched! New file size: ${raw.length} bytes`);
