// patch-title-redesign.js — Title screen redesign: bigger, mobile-first
'use strict';
const fs = require('fs');
const path = require('path');

const GAME_FILE = path.join(__dirname, 'games', 'space-dodge', 'index.html');
let raw = fs.readFileSync(GAME_FILE, 'utf8');
const hadCRLF = raw.includes('\r\n');
if (hadCRLF) raw = raw.replace(/\r\n/g, '\n');
console.log('Game file length:', raw.length);

// ============================================================
// PATCH 1: Add showTrophyOverlay state after titleShipBob
// ============================================================
const TSB_OLD = `let titleShipBob = 0;`;
const TSB_NEW = `let titleShipBob = 0;
let showTrophyOverlay = false;`;
if (!raw.includes(TSB_OLD)) { console.error('ERROR: titleShipBob anchor not found'); process.exit(1); }
raw = raw.replace(TSB_OLD, TSB_NEW);
console.log('✓ Patch 1: showTrophyOverlay state added');

// ============================================================
// PATCH 2: Add trophies + trophyClose to titleBtns
// ============================================================
const TB_OLD = `let titleBtns = { campaign: {}, prevShip: {}, nextShip: {} };`;
const TB_NEW = `let titleBtns = { campaign: {}, prevShip: {}, nextShip: {}, trophies: {}, trophyClose: {} };`;
if (!raw.includes(TB_OLD)) { console.error('ERROR: titleBtns anchor not found'); process.exit(1); }
raw = raw.replace(TB_OLD, TB_NEW);
console.log('✓ Patch 2: titleBtns updated');

// ============================================================
// PATCH 3: Replace entire drawTitle() function
// ============================================================
const DT_FUNC_START = '\nfunction drawTitle() {';
const DT_FUNC_END = '\n\n// --- MENU BUTTON ---';
const dtStart = raw.indexOf(DT_FUNC_START);
const dtEnd = raw.indexOf(DT_FUNC_END);
if (dtStart < 0 || dtEnd < 0) { console.error('ERROR: drawTitle anchors not found'); process.exit(1); }

const newDrawTitle = `
function drawTitle() {
  muteBtn = {}; // mute moved to pause menu — not on title screen

  ctx.fillStyle = '#0a0a2e';
  ctx.fillRect(0, 0, W, H);
  drawStars();

  titleShipBob += 0.03;
  const t = Date.now() / 1000;

  // ── TOP BAR ──────────────────────────────────────────────
  const barH = Math.max(44, Math.round(52 * scale));
  const barY = 10;

  // MENU button (left)
  const menuW = Math.max(110, Math.round(120 * scale));
  const menuX = 10;
  ctx.fillStyle = 'rgba(15,15,35,0.88)';
  ctx.strokeStyle = 'rgba(255,255,255,0.28)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(menuX, barY, menuW, barH, 8);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.font = \`bold \${Math.max(13, Math.round(14 * scale))}px 'Arial Rounded MT Bold', Arial, sans-serif\`;
  ctx.textAlign = 'center';
  ctx.fillText('🏠 MENU', menuX + menuW / 2, barY + barH / 2 + 5);
  menuBtn = { x: menuX, y: barY, w: menuW, h: barH };

  // TROPHIES button (right)
  const trphW = Math.max(150, Math.round(165 * scale));
  const trphX = W - trphW - 10;
  ctx.fillStyle = 'rgba(15,15,35,0.88)';
  ctx.strokeStyle = 'rgba(255,202,40,0.55)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(trphX, barY, trphW, barH, 8);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#FFCA28';
  ctx.font = \`bold \${Math.max(13, Math.round(14 * scale))}px 'Arial Rounded MT Bold', Arial, sans-serif\`;
  ctx.fillText('🏆 TROPHIES', trphX + trphW / 2, barY + barH / 2 + 5);
  titleBtns.trophies = { x: trphX, y: barY, w: trphW, h: barH };

  // ── TITLE ─────────────────────────────────────────────────
  const titleLetters = [
    { ch: 'S', color: '#42A5F5' }, { ch: 'P', color: '#64B5F6' },
    { ch: 'A', color: '#90CAF9' }, { ch: 'C', color: '#BBDEFB' },
    { ch: 'E', color: '#E3F2FD' }, { ch: ' ', color: 'none'    },
    { ch: 'D', color: '#FFFFFF' }, { ch: 'O', color: '#E3F2FD' },
    { ch: 'D', color: '#BBDEFB' }, { ch: 'G', color: '#90CAF9' },
    { ch: 'E', color: '#64B5F6' },
  ];
  const titleFontSize = Math.max(32, Math.round(52 * scale));
  ctx.font = \`bold \${titleFontSize}px 'Arial Rounded MT Bold', Arial, sans-serif\`;
  ctx.textAlign = 'center';
  let totalTitleW = 0;
  const letterWidths = [];
  for (const l of titleLetters) {
    const lw = l.ch === ' ' ? titleFontSize * 0.38 : ctx.measureText(l.ch).width;
    letterWidths.push(lw);
    totalTitleW += lw;
  }
  const titleBaseY = barY + barH + 14 + titleFontSize;
  let tlx = W / 2 - totalTitleW / 2;
  for (let i = 0; i < titleLetters.length; i++) {
    const l = titleLetters[i];
    if (l.ch === ' ') { tlx += letterWidths[i]; continue; }
    const waveY = Math.sin(t * 2.5 + i * 0.55) * 6;
    const scaleBoost = 1 + Math.sin(t * 2.5 + i * 0.55) * 0.03;
    ctx.save();
    ctx.translate(tlx + letterWidths[i] / 2, titleBaseY + waveY);
    ctx.scale(scaleBoost, scaleBoost);
    ctx.shadowColor = '#42A5F5';
    ctx.shadowBlur = 14 + Math.sin(t * 3 + i) * 5;
    ctx.fillStyle = l.color;
    ctx.fillText(l.ch, 0, 0);
    ctx.shadowBlur = 0;
    ctx.restore();
    tlx += letterWidths[i];
  }

  // Subtitle
  const subtitleFontSize = Math.max(14, Math.round(20 * scale));
  ctx.fillStyle = '#64B5F6';
  ctx.font = \`bold \${subtitleFontSize}px 'Arial Rounded MT Bold', Arial, sans-serif\`;
  ctx.textAlign = 'center';
  ctx.fillText('Dodge and blast the asteroids!', W / 2, titleBaseY + Math.round(titleFontSize * 0.55) + 6);

  // ── SHIP SHOWCASE ─────────────────────────────────────────
  const showcaseY = H * 0.52;
  const spotX = W / 2;

  // Light cone
  const coneGrad = ctx.createRadialGradient(spotX, showcaseY + 55 * scale, 0, spotX, showcaseY + 55 * scale, 160 * scale);
  coneGrad.addColorStop(0, getShip().accent + '30');
  coneGrad.addColorStop(0.5, getShip().accent + '10');
  coneGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = coneGrad;
  ctx.beginPath();
  ctx.ellipse(spotX, showcaseY + 55 * scale, 160 * scale, 75 * scale, 0, 0, Math.PI * 2);
  ctx.fill();

  // Glowing platform ring
  ctx.strokeStyle = getShip().accent;
  ctx.lineWidth = 2.5 * scale;
  ctx.globalAlpha = 0.4 + Math.sin(t * 2) * 0.15;
  ctx.beginPath();
  ctx.ellipse(spotX, showcaseY + 66 * scale, 100 * scale, 16 * scale, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.globalAlpha = 1;

  // Ship (4x bigger than gameplay, big showcase)
  const shipSz = 4.0;
  const bobY = showcaseY + Math.sin(titleShipBob) * 8;
  const unlocked = unlockedShips.includes(selectedShip);
  if (unlocked) {
    drawShip(spotX, bobY, SHIP_WIDTH * shipSz * scale, SHIP_HEIGHT * shipSz * scale, 0);
  } else {
    // Locked silhouette + ?
    ctx.fillStyle = 'rgba(255,255,255,0.07)';
    ctx.beginPath();
    ctx.moveTo(spotX, bobY - 52 * scale);
    ctx.bezierCurveTo(spotX + 32 * scale, bobY - 52 * scale, spotX + 38 * scale, bobY, spotX + 32 * scale, bobY + 40 * scale);
    ctx.lineTo(spotX - 32 * scale, bobY + 40 * scale);
    ctx.bezierCurveTo(spotX - 38 * scale, bobY, spotX - 32 * scale, bobY - 52 * scale, spotX, bobY - 52 * scale);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.22)';
    ctx.font = \`bold \${Math.max(44, Math.round(56 * scale))}px Arial, sans-serif\`;
    ctx.textAlign = 'center';
    ctx.fillText('?', spotX, bobY + 14 * scale);
  }

  // ── SHIP PICKER ARROWS ────────────────────────────────────
  const arrowSz = Math.max(28, Math.round(38 * scale));
  const arrowSpread = Math.max(130, Math.round(165 * scale));

  // Left arrow
  ctx.fillStyle = 'rgba(255,255,255,0.16)';
  ctx.beginPath();
  ctx.arc(spotX - arrowSpread, bobY, arrowSz, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.82)';
  ctx.font = \`bold \${Math.max(28, Math.round(36 * scale))}px Arial, sans-serif\`;
  ctx.textAlign = 'center';
  ctx.fillText('‹', spotX - arrowSpread, bobY + Math.round(10 * scale));
  titleBtns.prevShip = { x: spotX - arrowSpread - arrowSz, y: bobY - arrowSz, w: arrowSz * 2, h: arrowSz * 2 };

  // Right arrow
  ctx.fillStyle = 'rgba(255,255,255,0.16)';
  ctx.beginPath();
  ctx.arc(spotX + arrowSpread, bobY, arrowSz, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.82)';
  ctx.fillText('›', spotX + arrowSpread, bobY + Math.round(10 * scale));
  titleBtns.nextShip = { x: spotX + arrowSpread - arrowSz, y: bobY - arrowSz, w: arrowSz * 2, h: arrowSz * 2 };

  // ── SHIP NAME + TYPE ──────────────────────────────────────
  const nameY = showcaseY + Math.max(92, Math.round(105 * scale));
  const s = getShip();
  if (unlocked) {
    ctx.fillStyle = s.accent;
    ctx.font = \`bold \${Math.max(18, Math.round(26 * scale))}px 'Arial Rounded MT Bold', Arial, sans-serif\`;
    ctx.textAlign = 'center';
    ctx.fillText(s.name, spotX, nameY);
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    ctx.font = \`\${Math.max(13, Math.round(16 * scale))}px Arial, sans-serif\`;
    ctx.fillText(s.type, spotX, nameY + Math.max(18, Math.round(22 * scale)));
  } else {
    ctx.fillStyle = 'rgba(255,255,255,0.32)';
    ctx.font = \`bold \${Math.max(18, Math.round(22 * scale))}px Arial, sans-serif\`;
    ctx.textAlign = 'center';
    ctx.fillText('🔒 LOCKED', spotX, nameY);
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.font = \`\${Math.max(13, Math.round(14 * scale))}px Arial, sans-serif\`;
    if (selectedShip > 0) ctx.fillText('Beat campaign with ' + SHIPS[selectedShip - 1].name, spotX, nameY + Math.max(18, Math.round(22 * scale)));
  }

  // ── PAGE DOTS ─────────────────────────────────────────────
  const dotY = nameY + Math.max(30, Math.round(38 * scale));
  const dotR = Math.max(5, Math.round(6 * scale));
  const dotGap = Math.max(20, Math.round(22 * scale));
  for (let i = 0; i < SHIPS.length; i++) {
    ctx.fillStyle = i === selectedShip
      ? getShip().accent
      : ('rgba(255,255,255,' + (unlockedShips.includes(i) ? '0.3' : '0.1') + ')');
    ctx.beginPath();
    ctx.arc(spotX + (i - 2) * dotGap, dotY, dotR, 0, Math.PI * 2);
    ctx.fill();
  }

  // ── PLAY BUTTON ───────────────────────────────────────────
  const playW = Math.max(220, Math.round(250 * scale));
  const playH = Math.max(52, Math.round(56 * scale));
  const playX = W / 2 - playW / 2;
  const playY = H - playH - Math.max(30, Math.round(36 * scale));
  ctx.fillStyle = '#2E7D32';
  ctx.shadowColor = '#4CAF50';
  ctx.shadowBlur = 14;
  ctx.beginPath();
  ctx.roundRect(playX, playY, playW, playH, 10);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#fff';
  ctx.font = \`bold \${Math.max(16, Math.round(18 * scale))}px 'Arial Rounded MT Bold', Arial, sans-serif\`;
  ctx.textAlign = 'center';
  ctx.fillText('🚀 PLAY', W / 2, playY + playH / 2 + 6);
  titleBtns.campaign = { x: playX, y: playY, w: playW, h: playH };

  // ── BEST SCORE ────────────────────────────────────────────
  if (bestScore > 0) {
    ctx.fillStyle = 'rgba(255,255,255,0.45)';
    ctx.font = \`\${Math.max(13, Math.round(14 * scale))}px Arial, sans-serif\`;
    ctx.textAlign = 'center';
    ctx.fillText('BEST: ' + bestScore, W / 2, playY - 8);
  }

  // ── TROPHY OVERLAY (on top of everything) ─────────────────
  if (showTrophyOverlay) drawTrophyOverlay();
}`;

raw = raw.substring(0, dtStart) + newDrawTitle + raw.substring(dtEnd);
console.log('✓ Patch 3: drawTitle() replaced');

// ============================================================
// PATCH 4: Add drawTrophyOverlay() after drawMenuButton()
// ============================================================
const MENU_BTN_END = '\nlet menuBtn = {};\nlet pickerBackBtn = {};';
if (!raw.includes(MENU_BTN_END)) { console.error('ERROR: menuBtn anchor not found'); process.exit(1); }

const TROPHY_OVERLAY_FN = `\nlet menuBtn = {};\nlet pickerBackBtn = {};

// --- TROPHY OVERLAY ---
function drawTrophyOverlay() {
  // Dark scrim
  ctx.fillStyle = 'rgba(0,0,12,0.92)';
  ctx.fillRect(0, 0, W, H);

  // Header
  ctx.fillStyle = '#FFCA28';
  ctx.font = \`bold \${Math.max(22, Math.round(30 * scale))}px 'Arial Rounded MT Bold', Arial, sans-serif\`;
  ctx.textAlign = 'center';
  ctx.fillText('🏆 TROPHIES', W / 2, H * 0.18);

  // "COMING SOON!" — rainbow wave letters
  const csLetters = 'COMING SOON!'.split('');
  const csColors  = ['#FF5252','#FF9800','#FFCA28','#69F0AE','#40C4FF','#EA80FC',
                     '#FF5252','#FF9800','#FFCA28','#69F0AE','#40C4FF','#EA80FC'];
  const csFontSize = Math.max(28, Math.round(38 * scale));
  ctx.font = \`bold \${csFontSize}px 'Arial Rounded MT Bold', Arial, sans-serif\`;
  let csTotal = 0;
  const csWidths = [];
  for (const ch of csLetters) {
    const lw = ch === ' ' ? csFontSize * 0.35 : ctx.measureText(ch).width;
    csWidths.push(lw);
    csTotal += lw;
  }
  const csBaseY = H * 0.42;
  const t = Date.now() / 1000;
  let cslx = W / 2 - csTotal / 2;
  for (let i = 0; i < csLetters.length; i++) {
    const ch = csLetters[i];
    if (ch === ' ') { cslx += csWidths[i]; continue; }
    const wy = Math.sin(t * 2.5 + i * 0.6) * 6;
    ctx.save();
    ctx.translate(cslx + csWidths[i] / 2, csBaseY + wy);
    ctx.shadowColor = csColors[i % csColors.length];
    ctx.shadowBlur = 14;
    ctx.fillStyle = csColors[i % csColors.length];
    ctx.textAlign = 'center';
    ctx.fillText(ch, 0, 0);
    ctx.shadowBlur = 0;
    ctx.restore();
    cslx += csWidths[i];
  }

  // Subtitle
  ctx.shadowBlur = 0;
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.font = \`\${Math.max(13, Math.round(16 * scale))}px Arial, sans-serif\`;
  ctx.textAlign = 'center';
  ctx.fillText('Track your stats, unlocks, and achievements!', W / 2, H * 0.57);

  // X close button (top-right, clear of notch)
  const closeW = Math.max(50, Math.round(56 * scale));
  const closeH = Math.max(50, Math.round(56 * scale));
  const closeX = W - closeW - 12;
  const closeY = 12;
  ctx.fillStyle = 'rgba(255,255,255,0.12)';
  ctx.strokeStyle = 'rgba(255,255,255,0.32)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(closeX, closeY, closeW, closeH, 8);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.font = \`bold \${Math.max(18, Math.round(22 * scale))}px Arial, sans-serif\`;
  ctx.textAlign = 'center';
  ctx.fillText('✕', closeX + closeW / 2, closeY + closeH / 2 + 7);
  titleBtns.trophyClose = { x: closeX, y: closeY, w: closeW, h: closeH };
}`;

raw = raw.replace(MENU_BTN_END, TROPHY_OVERLAY_FN);
console.log('✓ Patch 4: drawTrophyOverlay() added');

// ============================================================
// PATCH 5: Replace handleTitleClick() — add trophy + overlay dismiss
// ============================================================
const HTC_OLD = `function handleTitleClick(tx, ty) {
  initAudio();
  if (!musicPlaying && !muted) startMusic(); // ambient music on title
  // Ship picker arrows
  if (hitTest(tx, ty, titleBtns.prevShip)) {
    selectedShip = (selectedShip - 1 + SHIPS.length) % SHIPS.length;
    localStorage.setItem('sd_ship', selectedShip.toString());
    playSound('beep');
    return true;
  }
  if (hitTest(tx, ty, titleBtns.nextShip)) {
    selectedShip = (selectedShip + 1) % SHIPS.length;
    localStorage.setItem('sd_ship', selectedShip.toString());
    playSound('beep');
    return true;
  }
  if (hitTest(tx, ty, titleBtns.campaign)) {
    if (!unlockedShips.includes(selectedShip)) return false; // can't play locked ship
    startCampaign(); return true;
  }
  return false;
}`;

const HTC_NEW = `function handleTitleClick(tx, ty) {
  initAudio();
  if (!musicPlaying && !muted) startMusic(); // ambient music on title
  // Trophy overlay — any tap dismisses (X button or background)
  if (showTrophyOverlay) {
    showTrophyOverlay = false;
    return true;
  }
  // Trophies button
  if (hitTest(tx, ty, titleBtns.trophies)) {
    showTrophyOverlay = true;
    return true;
  }
  // Ship picker arrows
  if (hitTest(tx, ty, titleBtns.prevShip)) {
    selectedShip = (selectedShip - 1 + SHIPS.length) % SHIPS.length;
    localStorage.setItem('sd_ship', selectedShip.toString());
    playSound('beep');
    return true;
  }
  if (hitTest(tx, ty, titleBtns.nextShip)) {
    selectedShip = (selectedShip + 1) % SHIPS.length;
    localStorage.setItem('sd_ship', selectedShip.toString());
    playSound('beep');
    return true;
  }
  if (hitTest(tx, ty, titleBtns.campaign)) {
    if (!unlockedShips.includes(selectedShip)) return false; // can't play locked ship
    startCampaign(); return true;
  }
  return false;
}`;

if (!raw.includes(HTC_OLD)) { console.error('ERROR: handleTitleClick anchor not found'); process.exit(1); }
raw = raw.replace(HTC_OLD, HTC_NEW);
console.log('✓ Patch 5: handleTitleClick() updated');

// ============================================================
// PATCH 6: Remove floating asteroids from title (they overlap with bigger ship)
// Keep the logic but move asteroid Y to avoid ship area
// (Optional — skip for now, test visually first)
// ============================================================

// ============================================================
// Syntax check
// ============================================================
const scriptStart = raw.indexOf('<script>');
const scriptEnd   = raw.lastIndexOf('</script>');
const script = raw.substring(scriptStart + 8, scriptEnd);
try {
  new (require('vm').Script)(script);
  console.log('✓ Script syntax OK');
} catch(e) {
  console.error('SCRIPT ERROR:', e.message);
  process.exit(1);
}

// ============================================================
// Verify
// ============================================================
if (!raw.includes('showTrophyOverlay')) { console.error('ERROR: showTrophyOverlay missing'); process.exit(1); }
if (!raw.includes('drawTrophyOverlay')) { console.error('ERROR: drawTrophyOverlay missing'); process.exit(1); }
if (!raw.includes('titleBtns.trophies')) { console.error('ERROR: trophies btn missing'); process.exit(1); }
if (!raw.includes('COMING SOON!')) { console.error('ERROR: trophy overlay content missing'); process.exit(1); }
console.log('✓ All verifications passed');

// ============================================================
// Write
// ============================================================
if (hadCRLF) raw = raw.replace(/\n/g, '\r\n');
fs.writeFileSync(GAME_FILE, raw, 'utf8');
console.log('\n✅ Title screen redesign applied!');
console.log('New file size:', fs.statSync(GAME_FILE).size, 'bytes');
