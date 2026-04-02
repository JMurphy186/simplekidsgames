const fs = require('fs');
let html = fs.readFileSync('C:/Users/jmurp/OneDrive/Desktop/TruckDriver/games/monster-rally/index.html', 'utf8');

// ── 1. Add Google Fonts @import inside <style> block ─────────────────────────
html = html.replace(
  '<style>\n  * { margin: 0;',
  "<style>\n  @import url('https://fonts.googleapis.com/css2?family=Luckiest+Guy&family=Baloo+2:wght@700&display=swap');\n  * { margin: 0;"
);
console.log('1. Google Fonts @import added:', html.includes('Luckiest+Guy'));

// ── 2. Semi-transparent road/ground overlay ───────────────────────────────────
const oldGround = `function drawEnvironmentGround(env) {
  // Ground
  ctx.fillStyle = env.ground;
  ctx.fillRect(0, GROUND_Y + 8, W, H - GROUND_Y);

  // Ground texture
  ctx.fillStyle = env.groundAccent;
  for (let x = 0; x < W; x += 20) {
    ctx.fillRect(x, GROUND_Y + 10, 12, 3);
    ctx.fillRect(x + 7, GROUND_Y + 20, 8, 2);
  }

  // Moon craters
  if (env.features === 'moon') {
    ctx.fillStyle = '#777';
    const craters = [80, 220, 400, 580, 720];
    for (const cx of craters) {
      ctx.beginPath(); ctx.ellipse(cx, GROUND_Y + 20, 18, 5, 0, 0, Math.PI * 2); ctx.fill();
    }
  }

  // Lava ground glow
  if (env.features === 'lava') {
    ctx.fillStyle = 'rgba(255,100,0,0.15)';
    ctx.fillRect(0, GROUND_Y + 8, W, 6);
  }

  // Road surface
  ctx.fillStyle = env.road;
  ctx.fillRect(0, GROUND_Y + 4, W, 6);
}`;

const newGround = `function drawEnvironmentGround(env) {
  // Ground zone — semi-transparent so Phase 2 painted backgrounds show through
  ctx.globalAlpha = 0.7;
  ctx.fillStyle = env.ground;
  ctx.fillRect(0, GROUND_Y + 8, W, H - GROUND_Y);
  ctx.globalAlpha = 1;

  // Ground texture
  ctx.fillStyle = env.groundAccent;
  for (let x = 0; x < W; x += 20) {
    ctx.fillRect(x, GROUND_Y + 10, 12, 3);
    ctx.fillRect(x + 7, GROUND_Y + 20, 8, 2);
  }

  // Moon craters
  if (env.features === 'moon') {
    ctx.fillStyle = '#777';
    const craters = [80, 220, 400, 580, 720];
    for (const cx of craters) {
      ctx.beginPath(); ctx.ellipse(cx, GROUND_Y + 20, 18, 5, 0, 0, Math.PI * 2); ctx.fill();
    }
  }

  // Lava ground glow
  if (env.features === 'lava') {
    ctx.fillStyle = 'rgba(255,100,0,0.15)';
    ctx.fillRect(0, GROUND_Y + 8, W, 6);
  }

  // Road surface — slightly lighter, semi-transparent
  ctx.globalAlpha = 0.8;
  ctx.fillStyle = env.road;
  ctx.fillRect(0, GROUND_Y + 4, W, 6);
  ctx.globalAlpha = 1;

  // Center dashed line
  ctx.setLineDash([W * 0.03, W * 0.02]);
  ctx.strokeStyle = 'rgba(255,255,255,0.15)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, GROUND_Y + 7);
  ctx.lineTo(W, GROUND_Y + 7);
  ctx.stroke();
  ctx.setLineDash([]);
}`;

if (!html.includes(oldGround)) { console.error('ERROR: Could not find drawEnvironmentGround'); process.exit(1); }
html = html.replace(oldGround, newGround);
console.log('2. Semi-transparent road/ground done.');

// ── 3. Springy star bob with per-star index offset ────────────────────────────
const oldDrawStar = `function drawStar(s) {
  const bob = Math.sin(s.bobPhase) * 5;
  const sx = s.x, sy = s.y + bob;

  ctx.save();
  ctx.translate(sx, sy);
  drawStarCoin(12);
  ctx.restore();
}`;

const newDrawStar = `function drawStar(s, starIndex) {
  const bobOffset = Math.sin((Date.now() / 1000) * 2 + (starIndex || 0) * 1.2) * (H * 0.01);
  const sx = s.x, sy = s.y + bobOffset;

  ctx.save();
  ctx.translate(sx, sy);
  drawStarCoin(12);
  ctx.restore();
}`;

if (!html.includes(oldDrawStar)) { console.error('ERROR: Could not find drawStar'); process.exit(1); }
html = html.replace(oldDrawStar, newDrawStar);
console.log('3. Springy star bob updated.');

// Update star draw loop to pass index
html = html.replace(
  'for (const s of stars) { if (!s.collected) drawStar(s); }',
  'stars.forEach((s, i) => { if (!s.collected) drawStar(s, i); });'
);
console.log('   Star draw loop updated to pass index.');

// ── 4. Redesign drawPlayerHUD (add showScore param, update fonts) ─────────────
const oldPlayerHUD = `function drawPlayerHUD(p, side) {
  const isLeft = side === 'left';
  const x = isLeft ? 20 : W - 170;
  const truckColors = TRUCK_ROSTER[p.truckIdx];

  // Player label in 2P mode
  if (numPlayers === 2) {
    ctx.fillStyle = truckColors.body;
    ctx.font = 'bold 12px Arial'; ctx.textAlign = isLeft ? 'left' : 'right';
    ctx.fillText(isLeft ? 'P1' : 'P2', isLeft ? x : x + 150, 18);
  }

  // Score with coin icon
  ctx.textAlign = isLeft ? 'left' : 'right';
  const scoreX = isLeft ? x : x + 150;
  const coinX = isLeft ? scoreX + 10 : scoreX - 10;
  ctx.save(); ctx.translate(coinX, 30); drawStarCoin(9); ctx.restore();
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 24px "Arial Black", Impact, sans-serif';
  ctx.strokeStyle = '#000'; ctx.lineWidth = 4;
  const textX = isLeft ? scoreX + 24 : scoreX - 24;
  ctx.strokeText(p.score, textX, 38);
  ctx.fillText(p.score, textX, 38);

  // Combo
  if (p.combo > 1) {
    const ca = Math.min(1, p.comboTimer / 30);
    ctx.globalAlpha = ca;
    ctx.fillStyle = '#ff6600';
    ctx.font = 'bold 18px "Arial Black", Impact, sans-serif';
    ctx.strokeStyle = '#000'; ctx.lineWidth = 3;
    const ct = p.combo + 'x COMBO!';
    ctx.strokeText(ct, scoreX, 60);
    ctx.fillText(ct, scoreX, 60);
    ctx.globalAlpha = 1;
  }

  // Power-up timer bars (stackable — show all active)
  const puList = [];
  if (p.turboActive) puList.push({ effect: 'turbo', timer: p.turboTimer, dur: 240, color: '#ff4400', name: 'TURBO' });
  if (p.megaActive) puList.push({ effect: 'mega', timer: p.megaTimer, dur: 300, color: '#ff8800', name: 'MEGA' });
  if (p.magnetActive) puList.push({ effect: 'magnet', timer: p.magnetTimer, dur: 480, color: '#4488ff', name: 'MAGNET' });
  if (p.superJumpActive) puList.push({ effect: 'superjump', timer: p.superJumpTimer, dur: 480, color: '#8855ff', name: 'JUMP' });
  for (let pi = 0; pi < puList.length; pi++) {
    const pu = puList[pi];
    const rowY = 69 + pi * 16;
    const iconR = 8;
    const iconX = isLeft ? x + iconR : x + 150 - iconR;
    const barX = isLeft ? x + iconR * 2 + 4 : x + 50;
    const barW = 60;
    const pct = Math.max(0, pu.timer / pu.dur);
    ctx.save(); ctx.translate(iconX, rowY + 5);
    drawPowerUpIcon(pu.effect, iconR);
    ctx.restore();
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.beginPath(); ctx.roundRect(barX, rowY, barW, 10, 5); ctx.fill();
    ctx.fillStyle = pu.color;
    ctx.beginPath(); ctx.roundRect(barX, rowY, barW * pct, 10, 5); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.font = '7px Arial'; ctx.textAlign = 'center';
    ctx.fillText(pu.name, barX + barW / 2, rowY + 8);
  }

  ctx.textAlign = 'left';
}`;

const newPlayerHUD = `function drawPlayerHUD(p, side, showScore) {
  if (showScore === undefined) showScore = true;
  const isLeft = side === 'left';
  const x = isLeft ? 20 : W - 170;
  const truckColors = TRUCK_ROSTER[p.truckIdx];

  // Player label in 2P mode
  if (numPlayers === 2) {
    ctx.fillStyle = truckColors.body;
    ctx.font = "700 12px 'Baloo 2', sans-serif"; ctx.textAlign = isLeft ? 'left' : 'right';
    ctx.fillText(isLeft ? 'P1' : 'P2', isLeft ? x : x + 150, 18);
  }

  // Score with coin icon (2P always shows, 1P only if showScore === true)
  if (showScore) {
    ctx.textAlign = isLeft ? 'left' : 'right';
    const scoreX = isLeft ? x : x + 150;
    const coinX = isLeft ? scoreX + 10 : scoreX - 10;
    ctx.save(); ctx.translate(coinX, 30); drawStarCoin(9); ctx.restore();
    ctx.fillStyle = '#fff';
    ctx.font = "800 24px 'Luckiest Guy', cursive";
    ctx.strokeStyle = '#000'; ctx.lineWidth = 4;
    const textX = isLeft ? scoreX + 24 : scoreX - 24;
    ctx.strokeText(p.score, textX, 38);
    ctx.fillText(p.score, textX, 38);
  }

  // Combo
  if (p.combo > 1) {
    const ca = Math.min(1, p.comboTimer / 30);
    ctx.globalAlpha = ca;
    ctx.fillStyle = '#ff6600';
    ctx.font = "800 18px 'Luckiest Guy', cursive";
    ctx.strokeStyle = '#000'; ctx.lineWidth = 3;
    const scoreX = isLeft ? x : x + 150;
    const ct = p.combo + 'x COMBO!';
    ctx.textAlign = isLeft ? 'left' : 'right';
    ctx.strokeText(ct, scoreX, 60);
    ctx.fillText(ct, scoreX, 60);
    ctx.globalAlpha = 1;
  }

  // Power-up timer bars (stackable — show all active)
  const puList = [];
  if (p.turboActive) puList.push({ effect: 'turbo', timer: p.turboTimer, dur: 240, color: '#ff4400', name: 'TURBO' });
  if (p.megaActive) puList.push({ effect: 'mega', timer: p.megaTimer, dur: 300, color: '#ff8800', name: 'MEGA' });
  if (p.magnetActive) puList.push({ effect: 'magnet', timer: p.magnetTimer, dur: 480, color: '#4488ff', name: 'MAGNET' });
  if (p.superJumpActive) puList.push({ effect: 'superjump', timer: p.superJumpTimer, dur: 480, color: '#8855ff', name: 'JUMP' });
  for (let pi = 0; pi < puList.length; pi++) {
    const pu = puList[pi];
    const rowY = 69 + pi * 16;
    const iconR = 8;
    const iconX = isLeft ? x + iconR : x + 150 - iconR;
    const barX = isLeft ? x + iconR * 2 + 4 : x + 50;
    const barW = 60;
    const pct = Math.max(0, pu.timer / pu.dur);
    ctx.save(); ctx.translate(iconX, rowY + 5);
    drawPowerUpIcon(pu.effect, iconR);
    ctx.restore();
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.beginPath(); ctx.roundRect(barX, rowY, barW, 10, 5); ctx.fill();
    ctx.fillStyle = pu.color;
    ctx.beginPath(); ctx.roundRect(barX, rowY, barW * pct, 10, 5); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.font = "700 7px 'Baloo 2', sans-serif"; ctx.textAlign = 'center';
    ctx.fillText(pu.name, barX + barW / 2, rowY + 8);
  }

  ctx.textAlign = 'left';
}`;

if (!html.includes(oldPlayerHUD)) { console.error('ERROR: Could not find drawPlayerHUD'); process.exit(1); }
html = html.replace(oldPlayerHUD, newPlayerHUD);
console.log('4. drawPlayerHUD redesigned.');

// ── 5. Redesign drawHUD with new top-left + top-right layout ─────────────────
const oldHUD = `function drawHUD() {
  if (numPlayers === 1) {
    drawPlayerHUD(player1, 'left');
  } else {
    drawPlayerHUD(player1, 'left');
    drawPlayerHUD(player2, 'right');
    // Touch zone hint (first 5 seconds = ~300 frames)
    const maxScore = Math.max(player1.score, player2.score);
    if (maxScore < 15) {
      ctx.globalAlpha = 0.4;
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 1; ctx.setLineDash([5, 5]);
      ctx.beginPath(); ctx.moveTo(W / 2, 0); ctx.lineTo(W / 2, H); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#fff'; ctx.font = '16px Arial'; ctx.textAlign = 'center';
      ctx.fillText('P1 TAP', W / 4, H / 2);
      ctx.fillText('P2 TAP', W * 3 / 4, H / 2);
      ctx.globalAlpha = 1;
    }
  }

  // Round timer for frenzy
  if (roundTimer > 0) {
    const secs = Math.ceil(roundTimer / 60);
    const urgent = secs <= 5;
    ctx.textAlign = 'center';
    ctx.fillStyle = urgent ? '#ff4400' : '#fff';
    ctx.font = 'bold ' + (urgent ? '32' : '26') + 'px "Arial Black", Impact, sans-serif';
    ctx.strokeStyle = '#000'; ctx.lineWidth = 4;
    const timerY = urgent ? 52 + Math.sin(Date.now() * 0.01) * 3 : 50;
    ctx.strokeText(secs + 's', W / 2, timerY);
    ctx.fillText(secs + 's', W / 2, timerY);
    // Mode label
    ctx.fillStyle = '#ffcc00'; ctx.font = 'bold 11px Arial';
    ctx.fillText('CRUSH FRENZY', W / 2, 18);
    ctx.textAlign = 'left';
  }

  // Speed indicator (center-top, below level indicator in campaign)
  if (gameMode === 'rally' || gameMode === 'endless') {
  const speedBarY = (gameMode === 'rally') ? 26 : 8; // offset down in campaign to avoid level text
  const lvlRef = (gameMode === 'rally') ? (campaignSequence[campaignLevel] || campaignSequence[0]) : null;
  const spdBase = lvlRef ? lvlRef.baseSpeed : 1.9;
  const spdMax = lvlRef ? lvlRef.maxSpeed : maxSpeed;
  const speedPct = Math.max(0, (gameSpeed - spdBase) / (spdMax - spdBase));
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.beginPath(); ctx.roundRect(W / 2 - 45, speedBarY, 90, 14, 7); ctx.fill();
  const speedColor = campaignMaxSpeedReached ? '#ffd700' : speedPct > 0.7 ? '#ff4400' : speedPct > 0.4 ? '#ff8800' : '#22cc66';
  ctx.fillStyle = speedColor;
  ctx.beginPath(); ctx.roundRect(W / 2 - 43, speedBarY + 2, Math.max(4, 86 * Math.min(1, speedPct)), 10, 5); ctx.fill();
  ctx.fillStyle = '#fff'; ctx.font = '8px Arial'; ctx.textAlign = 'center';
  ctx.fillText('SPEED', W / 2, speedBarY + 10); ctx.textAlign = 'left';
  } // end speed indicator

  // Mute button
  const muteX = W - 20, muteY = 15;
  ctx.fillStyle = 'rgba(0,0,0,0.4)';
  ctx.beginPath(); ctx.arc(muteX, muteY, 12, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#fff'; ctx.font = '12px Arial'; ctx.textAlign = 'center';
  ctx.fillText(audioMuted ? '🔇' : '🔊', muteX, muteY + 4); ctx.textAlign = 'left';

  // HONK button
  const honkX = W - 70, honkY = H - 40;
  const honkPulse = 0.9 + Math.sin(Date.now() * 0.005) * 0.1;
  ctx.save(); ctx.translate(honkX, honkY); ctx.scale(honkPulse, honkPulse);
  ctx.fillStyle = 'rgba(255,100,0,0.7)';
  ctx.beginPath(); ctx.roundRect(-35, -18, 70, 36, 18); ctx.fill();
  ctx.fillStyle = '#fff'; ctx.font = 'bold 14px "Arial Black", Impact, sans-serif';
  ctx.textAlign = 'center'; ctx.fillText('HONK!', 0, 5); ctx.textAlign = 'left';
  ctx.restore();

  // Environment announcement
  if (envAnnouncementTimer > 0) {
    const ea = Math.min(1, envAnnouncementTimer / 30);
    ctx.globalAlpha = ea;
    ctx.fillStyle = '#fff'; ctx.font = 'bold 30px "Arial Black", Impact, sans-serif';
    ctx.textAlign = 'center'; ctx.strokeStyle = '#000'; ctx.lineWidth = 5;
    ctx.strokeText(envAnnouncementText + '!', W / 2, H / 2 - 60);
    ctx.fillText(envAnnouncementText + '!', W / 2, H / 2 - 60);
    ctx.globalAlpha = 1; ctx.textAlign = 'left';
  }

  // Controls hint (single player, low score)
  if (numPlayers === 1 && player1 && player1.score < 30) {
    ctx.globalAlpha = 0.5; ctx.fillStyle = '#fff'; ctx.font = '13px Arial'; ctx.textAlign = 'center';
    ctx.fillText('TAP or SPACE to JUMP!  •  H = HORN  •  M = MUTE', W / 2, H - 15);
    ctx.textAlign = 'left'; ctx.globalAlpha = 1;
  }
}`;

const newHUD = `function drawHUD() {
  // ── Top-left: Level name + speed bar (rally/endless only) ─────────────────
  if (gameMode === 'rally' || gameMode === 'endless') {
    const lvlRef = (gameMode === 'rally' && campaignSequence[campaignLevel]) ? campaignSequence[campaignLevel] : null;
    const lvlName = lvlRef ? lvlRef.name : (ENVIRONMENTS[currentEnvIndex] ? ENVIRONMENTS[currentEnvIndex].name : '');
    const lvlNum  = (gameMode === 'rally' && lvlRef) ? (campaignLevel + 1) : 0;
    const accentColor = lvlRef ? lvlRef.nameColor : '#ffffff';
    const hudX    = W * 0.03;
    const lvlY    = H * 0.06;
    const barX    = hudX;
    const barY    = H * 0.09;
    const barMaxW = W * 0.2;
    const barH    = H * 0.02;

    // Level name
    ctx.textAlign = 'left';
    ctx.shadowColor = 'rgba(0,0,0,0.8)'; ctx.shadowBlur = 6;
    ctx.fillStyle = '#ffffff';
    ctx.font = \`800 \${Math.max(13, Math.round(W * 0.018))}px 'Luckiest Guy', cursive\`;
    const lvlLabel = lvlNum ? \`LVL \${lvlNum}: \${lvlName}\` : lvlName;
    ctx.fillText(lvlLabel, hudX, lvlY);
    ctx.shadowBlur = 0;

    // Speed bar
    const spdBase = lvlRef ? lvlRef.baseSpeed : 1.9;
    const spdMax  = lvlRef ? lvlRef.maxSpeed  : maxSpeed;
    const speedPct = Math.max(0, Math.min(1, (gameSpeed - spdBase) / (spdMax - spdBase)));
    const breathe  = Math.sin(Date.now() / 500) * barMaxW * 0.02;
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.beginPath(); ctx.roundRect(barX, barY, barMaxW, barH, 3); ctx.fill();
    ctx.fillStyle = accentColor;
    ctx.beginPath(); ctx.roundRect(barX, barY, Math.max(4, barMaxW * speedPct + breathe), barH, 3); ctx.fill();

    // SPEED label
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.font = \`700 \${Math.max(9, Math.round(W * 0.011))}px 'Baloo 2', sans-serif\`;
    ctx.textAlign = 'left';
    ctx.fillText('SPEED', barX, barY + barH + 10);
  }

  // ── Top-right: ★ Score (1P only) ─────────────────────────────────────────
  if (numPlayers === 1 && player1) {
    ctx.textAlign = 'right';
    ctx.shadowColor = 'rgba(0,0,0,0.8)'; ctx.shadowBlur = 6;
    ctx.fillStyle = '#FFD740';
    ctx.font = \`800 \${Math.max(13, Math.round(W * 0.018))}px 'Luckiest Guy', cursive\`;
    ctx.fillText('\\u2605 ' + player1.score.toLocaleString(), W * 0.97, H * 0.06);
    ctx.shadowBlur = 0;
    ctx.textAlign = 'left';
  }

  // ── Player HUDs (score in 2P, combo + power-up bars always) ──────────────
  if (numPlayers === 1) {
    drawPlayerHUD(player1, 'left', false); // score drawn above; just combo + pu bars
  } else {
    drawPlayerHUD(player1, 'left');
    drawPlayerHUD(player2, 'right');
    // Touch zone hint (first few seconds)
    const maxScore = Math.max(player1.score, player2.score);
    if (maxScore < 15) {
      ctx.globalAlpha = 0.4;
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 1; ctx.setLineDash([5, 5]);
      ctx.beginPath(); ctx.moveTo(W / 2, 0); ctx.lineTo(W / 2, H); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#fff'; ctx.font = "700 16px 'Baloo 2', sans-serif"; ctx.textAlign = 'center';
      ctx.fillText('P1 TAP', W / 4, H / 2);
      ctx.fillText('P2 TAP', W * 3 / 4, H / 2);
      ctx.globalAlpha = 1;
    }
  }

  // Round timer for frenzy
  if (roundTimer > 0) {
    const secs = Math.ceil(roundTimer / 60);
    const urgent = secs <= 5;
    ctx.textAlign = 'center';
    ctx.fillStyle = urgent ? '#ff4400' : '#fff';
    ctx.font = (urgent ? '800 32px' : '800 26px') + " 'Luckiest Guy', cursive";
    ctx.strokeStyle = '#000'; ctx.lineWidth = 4;
    const timerY = urgent ? 52 + Math.sin(Date.now() * 0.01) * 3 : 50;
    ctx.strokeText(secs + 's', W / 2, timerY);
    ctx.fillText(secs + 's', W / 2, timerY);
    ctx.fillStyle = '#ffcc00'; ctx.font = "700 11px 'Baloo 2', sans-serif";
    ctx.fillText('CRUSH FRENZY', W / 2, 18);
    ctx.textAlign = 'left';
  }

  // Mute button
  const muteX = W - 20, muteY = 15;
  ctx.fillStyle = 'rgba(0,0,0,0.4)';
  ctx.beginPath(); ctx.arc(muteX, muteY, 12, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#fff'; ctx.font = "12px 'Baloo 2', sans-serif"; ctx.textAlign = 'center';
  ctx.fillText(audioMuted ? '🔇' : '🔊', muteX, muteY + 4); ctx.textAlign = 'left';

  // HONK button
  const honkX = W - 70, honkY = H - 40;
  const honkPulse = 0.9 + Math.sin(Date.now() * 0.005) * 0.1;
  ctx.save(); ctx.translate(honkX, honkY); ctx.scale(honkPulse, honkPulse);
  ctx.fillStyle = 'rgba(255,100,0,0.7)';
  ctx.beginPath(); ctx.roundRect(-35, -18, 70, 36, 18); ctx.fill();
  ctx.fillStyle = '#fff'; ctx.font = "800 14px 'Luckiest Guy', cursive";
  ctx.textAlign = 'center'; ctx.fillText('HONK!', 0, 5); ctx.textAlign = 'left';
  ctx.restore();

  // Environment announcement
  if (envAnnouncementTimer > 0) {
    const ea = Math.min(1, envAnnouncementTimer / 30);
    ctx.globalAlpha = ea;
    ctx.fillStyle = '#fff'; ctx.font = "800 30px 'Luckiest Guy', cursive";
    ctx.textAlign = 'center'; ctx.strokeStyle = '#000'; ctx.lineWidth = 5;
    ctx.strokeText(envAnnouncementText + '!', W / 2, H / 2 - 60);
    ctx.fillText(envAnnouncementText + '!', W / 2, H / 2 - 60);
    ctx.globalAlpha = 1; ctx.textAlign = 'left';
  }

  // Controls hint (single player, low score)
  if (numPlayers === 1 && player1 && player1.score < 30) {
    ctx.globalAlpha = 0.5; ctx.fillStyle = '#fff'; ctx.font = "700 13px 'Baloo 2', sans-serif"; ctx.textAlign = 'center';
    ctx.fillText('TAP or SPACE to JUMP!  •  H = HORN  •  M = MUTE', W / 2, H - 15);
    ctx.textAlign = 'left'; ctx.globalAlpha = 1;
  }
}`;

if (!html.includes(oldHUD)) { console.error('ERROR: Could not find drawHUD'); process.exit(1); }
html = html.replace(oldHUD, newHUD);
console.log('5. drawHUD redesigned.');

// ── 6. Font swap throughout menus / title / UI screens ───────────────────────
// Rule: "Arial Black" / Impact heading fonts → Luckiest Guy
// Rule: plain Arial bold/regular → Baloo 2

// Replace font-family portion only (preserve size and weight numbers)
const fontSwaps = [
  // "Arial Black", Impact, sans-serif  →  'Luckiest Guy', cursive
  [/"Arial Black", Impact, sans-serif/g, "'Luckiest Guy', cursive"],
  // bold NNpx "Arial Black" (without trailing font list — already caught above mostly)
  [/"Arial Black"/g, "'Luckiest Guy', cursive"],
  // bold NNpx Arial  →  NNpx 'Baloo 2', sans-serif (keep bold → 700)
  // "bold Npx Arial" patterns
  [/\bbold\s+(\d+(?:\.\d+)?px)\s+Arial\b/g, "700 $1 'Baloo 2', sans-serif"],
  // "bold italic Npx Arial"
  [/\bbold italic\s+(\d+(?:\.\d+)?px)\s+Arial\b/g, "italic 700 $1 'Baloo 2', sans-serif"],
  // plain "Npx Arial"
  [/\b(\d+(?:\.\d+)?px)\s+Arial\b/g, "$1 'Baloo 2', sans-serif"],
  // Impact, sans-serif alone
  [/\bImpact, sans-serif\b/g, "'Luckiest Guy', cursive"],
  // any remaining bare "Arial" font-family reference in ctx.font strings
  // "Npx Arial, sans-serif"
  [/\b(\d+(?:\.\d+)?px)\s+Arial, sans-serif\b/g, "$1 'Baloo 2', sans-serif"],
];

let swapCount = 0;
for (const [pattern, replacement] of fontSwaps) {
  const before = html.length;
  html = html.replace(pattern, replacement);
  const changed = (html.match(pattern) || []).length === 0;
  // Count replacements via counting occurrences in original vs new
  swapCount++;
}
console.log('6. Font swap passes applied:', swapCount);

// ── 7. Write file ─────────────────────────────────────────────────────────────
fs.writeFileSync('C:/Users/jmurp/OneDrive/Desktop/TruckDriver/games/monster-rally/index.html', html, 'utf8');
console.log('File written.');
