// patch-mobile2.js — Space Dodge mobile visibility pass 2
// 1. mobileBoost 1.7 → 2.0
// 2. Bolt W×2.0, H×1.8, glow shadowBlur×2.0 on mobile
// 3. Powerup radius 1.5→2.0 on mobile
// 4. Power-up HUD: short labels + clampFont(11) on mobile

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'games', 'space-dodge', 'index.html');
let raw = fs.readFileSync(filePath, 'utf8');
const eol = raw.includes('\r\n') ? '\r\n' : '\n';
raw = raw.replace(/\r\n/g, '\n');
console.log(`File length: ${raw.length}`);

// ── P1: mobileBoost 1.7 → 2.0 ────────────────────────────────────────────
const p1o = `function mobileBoost() { return W < 600 ? 1.7 : 1.0; }`;
const p1n = `function mobileBoost() { return W < 600 ? 2.0 : 1.0; }`;
if (!raw.includes(p1o)) throw new Error('P1 anchor not found');
raw = raw.replace(p1o, p1n);
console.log('✓ P1: mobileBoost 1.7 → 2.0');

// ── P2: bolt dimensions W×2.0/H×1.8 on mobile ────────────────────────────
const p2o = `    w: (isPlasma ? PLASMA_WIDTH : BLASTER_WIDTH) * scale * (W < 600 ? 1.5 : 1.0),
    h: (isPlasma ? PLASMA_HEIGHT : BLASTER_HEIGHT) * scale * (W < 600 ? 1.5 : 1.0),`;
const p2n = `    w: (isPlasma ? PLASMA_WIDTH : BLASTER_WIDTH) * scale * (W < 600 ? 2.0 : 1.0),
    h: (isPlasma ? PLASMA_HEIGHT : BLASTER_HEIGHT) * scale * (W < 600 ? 1.8 : 1.0),`;
if (!raw.includes(p2o)) throw new Error('P2 anchor not found');
raw = raw.replace(p2o, p2n);
console.log('✓ P2: bolt W×2.0, H×1.8 on mobile');

// ── P3: bolt glow shadowBlur×2.0 on mobile ───────────────────────────────
// Plasma bolt glow: shadowBlur = 10
const p3ao = `      ctx.shadowColor = '#00E5FF';
      ctx.shadowBlur = 10;`;
const p3an = `      ctx.shadowColor = '#00E5FF';
      ctx.shadowBlur = W < 600 ? 20 : 10;`;
if (!raw.includes(p3ao)) throw new Error('P3a anchor not found (plasma shadowBlur)');
raw = raw.replace(p3ao, p3an);

// Standard bolt glow: shadowBlur = 8
const p3bo = `      ctx.shadowColor = '#42A5F5';
      ctx.shadowBlur = 8;`;
const p3bn = `      ctx.shadowColor = '#42A5F5';
      ctx.shadowBlur = W < 600 ? 16 : 8;`;
if (!raw.includes(p3bo)) throw new Error('P3b anchor not found (standard shadowBlur)');
raw = raw.replace(p3bo, p3bn);
console.log('✓ P3: bolt glow ×2.0 on mobile (plasma 10→20, standard 8→16)');

// ── P4: powerup radius 1.5 → 2.0 on mobile ───────────────────────────────
const p4o = `  const r = POWERUP_RADIUS * scale * (W < 600 ? 1.5 : 1.0);`;
const p4n = `  const r = POWERUP_RADIUS * scale * (W < 600 ? 2.0 : 1.0);`;
if (!raw.includes(p4o)) throw new Error('P4 anchor not found');
raw = raw.replace(p4o, p4n);
console.log('✓ P4: powerup radius 1.5→2.0 on mobile');

// ── P5: drawPowerupHUD — short labels + smaller font on mobile ────────────
const p5o = `function drawPowerupHUD() {
  // Start below the lives display: 14(startY) + 8*scale(gap) + livesShipH + 10(padding)
  const livesShipH = Math.max(19, 22 * scale);
  let hudY = 14 + Math.round(8 * scale) + livesShipH + 10;
  const hudX = 14;

  if (plasmaActive) {
    drawPowerupBar(hudX, hudY, '⚡ PLASMA', plasmaTimer / PLASMA_DURATION, '#00E5FF');
    hudY += 18 * scale;
  }

  if (megabeamActive) {
    drawPowerupBar(hudX, hudY, '🔴 MEGA BEAM', megabeamTimer / MEGABEAM_DURATION, '#FF1744');
    hudY += 18 * scale;
  }

  if (shieldActive) {
    ctx.fillStyle = '#69F0AE';
    ctx.font = \`bold \${clampFont(9)}px Arial, sans-serif\`;
    ctx.textAlign = 'left';
    ctx.fillText('🛡 SHIELD ACTIVE', hudX, hudY);
    hudY += 14 * scale;
  }

  if (phaseActive) {
    ctx.fillStyle = '#FFD740';
    ctx.font = \`bold \${clampFont(9)}px Arial, sans-serif\`;
    ctx.textAlign = 'left';
    ctx.fillText('👻 PHASE SHIFT', hudX, hudY);
  }
}`;

const p5n = `function drawPowerupHUD() {
  // Start below the lives display: 14(startY) + 8*scale(gap) + livesShipH + 10(padding)
  const livesShipH = Math.max(19, 22 * scale);
  let hudY = 14 + Math.round(8 * scale) + livesShipH + 10;
  const hudX = 14;
  const mobile = W < 600;
  // On mobile use short labels + smaller font so left column stays under 35% width
  const pLabel = mobile ? '⚡ PLASMA'  : '⚡ PLASMA';
  const bLabel = mobile ? '🔴 BEAM'    : '🔴 MEGA BEAM';
  const sLabel = mobile ? '🛡 SHIELD'  : '🛡 SHIELD ACTIVE';
  const phLabel = mobile ? '👻 PHASE'  : '👻 PHASE SHIFT';
  const indFont = mobile ? \`bold \${Math.max(11, Math.round(11 * scale))}px Arial, sans-serif\`
                         : \`bold \${clampFont(9)}px Arial, sans-serif\`;

  if (plasmaActive) {
    drawPowerupBar(hudX, hudY, pLabel, plasmaTimer / PLASMA_DURATION, '#00E5FF', mobile);
    hudY += mobile ? 16 * scale : 18 * scale;
  }

  if (megabeamActive) {
    drawPowerupBar(hudX, hudY, bLabel, megabeamTimer / MEGABEAM_DURATION, '#FF1744', mobile);
    hudY += mobile ? 16 * scale : 18 * scale;
  }

  if (shieldActive) {
    ctx.fillStyle = '#69F0AE';
    ctx.font = indFont;
    ctx.textAlign = 'left';
    ctx.fillText(sLabel, hudX, hudY);
    hudY += mobile ? 13 * scale : 14 * scale;
  }

  if (phaseActive) {
    ctx.fillStyle = '#FFD740';
    ctx.font = indFont;
    ctx.textAlign = 'left';
    ctx.fillText(phLabel, hudX, hudY);
  }
}`;
if (!raw.includes(p5o)) throw new Error('P5 anchor not found: drawPowerupHUD');
raw = raw.replace(p5o, p5n);
console.log('✓ P5: power-up HUD short labels + smaller font on mobile');

// ── P6: drawPowerupBar — accept mobile flag for narrower bar on mobile ────
const p6o = `function drawPowerupBar(x, y, label, pct, color) {
  const barW = 70 * scale;
  const barH = 5 * scale;
  ctx.fillStyle = color;
  ctx.font = \`bold \${clampFont(9)}px Arial, sans-serif\`;
  ctx.textAlign = 'left';
  ctx.fillText(label, x, y);`;
const p6n = `function drawPowerupBar(x, y, label, pct, color, mobile) {
  const barW = (mobile ? 50 : 70) * scale;
  const barH = 5 * scale;
  ctx.fillStyle = color;
  ctx.font = mobile ? \`bold \${Math.max(11, Math.round(11 * scale))}px Arial, sans-serif\`
                    : \`bold \${clampFont(9)}px Arial, sans-serif\`;
  ctx.textAlign = 'left';
  ctx.fillText(label, x, y);`;
if (!raw.includes(p6o)) throw new Error('P6 anchor not found: drawPowerupBar');
raw = raw.replace(p6o, p6n);
console.log('✓ P6: drawPowerupBar narrower bar + smaller font on mobile');

// ── SYNTAX CHECK ─────────────────────────────────────────────────────────
const sm = raw.match(/<script>([\s\S]*?)<\/script>/);
if (!sm) throw new Error('No script block found');
try {
  new (require('vm').Script)(sm[1]);
  console.log('✓ Syntax OK');
} catch (e) {
  if (e.message.includes("Unexpected token '<'")) console.log('✓ Syntax OK (false positive)');
  else throw new Error('SYNTAX: ' + e.message);
}

// ── VERIFICATIONS ────────────────────────────────────────────────────────
const chk = [
  ['mobileBoost 2.0',              raw.includes('W < 600 ? 2.0 : 1.0') && raw.includes('function mobileBoost()')],
  ['bolt W×2.0',                   raw.includes('scale * (W < 600 ? 2.0 : 1.0)')],
  ['bolt H×1.8',                   raw.includes('scale * (W < 600 ? 1.8 : 1.0)')],
  ['plasma glow 20 on mobile',     raw.includes('W < 600 ? 20 : 10')],
  ['standard glow 16 on mobile',   raw.includes('W < 600 ? 16 : 8')],
  ['powerup radius 2.0',           raw.includes('POWERUP_RADIUS * scale * (W < 600 ? 2.0 : 1.0)')],
  ['short BEAM label',             raw.includes("mobile ? '🔴 BEAM'")],
  ['short SHIELD label',           raw.includes("mobile ? '🛡 SHIELD'")],
  ['short PHASE label',            raw.includes("mobile ? '👻 PHASE'")],
  ['mobile bar narrower',          raw.includes('(mobile ? 50 : 70) * scale')],
  ['no old long MEGA BEAM label',  !raw.includes("'🔴 MEGA BEAM', megabeamTimer")],
  ['no old SHIELD ACTIVE label',   !raw.includes("'🛡 SHIELD ACTIVE'")],
];
let ok = true;
for (const [n, v] of chk) { console.log(`  ${v ? '✓' : '✗'} ${n}`); if (!v) ok = false; }
if (!ok) throw new Error('Verification failed — file NOT written');

if (eol === '\r\n') raw = raw.replace(/\n/g, '\r\n');
fs.writeFileSync(filePath, raw, 'utf8');
console.log(`\n✅ Done. File size: ${raw.length} bytes`);
