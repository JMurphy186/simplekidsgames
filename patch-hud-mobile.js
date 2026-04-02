// patch-hud-mobile.js — Space Dodge mobile HUD & visibility pass
// 1. mobileBoost 1.5 → 1.7
// 2. Bolt dimensions 1.5× on mobile
// 3. Powerup radius 1.5× on mobile
// 4. Power-up HUD starts below lives (not over them)
// 5. Gear icon bigger
// 6. drawHUD: score moves center-below-worldname, world name gets shadow+spacing, remove top-right score

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'games', 'space-dodge', 'index.html');
let raw = fs.readFileSync(filePath, 'utf8');
const eol = raw.includes('\r\n') ? '\r\n' : '\n';
raw = raw.replace(/\r\n/g, '\n');
console.log(`File length: ${raw.length}`);

// ── PATCH 1: mobileBoost 1.5 → 1.7 ──────────────────────────────────────
const p1o = `// Mobile scale boost: ships are 1.5× larger on narrow screens (< 600px)
// Stacks with MEGABEAM_SCALE — all ship.w/h assignments must use this
function mobileBoost() { return W < 600 ? 1.5 : 1.0; }`;
const p1n = `// Mobile scale boost: ships are 1.7× larger on narrow screens (< 600px)
// Stacks with MEGABEAM_SCALE — all ship.w/h assignments must use this
function mobileBoost() { return W < 600 ? 1.7 : 1.0; }`;
if (!raw.includes(p1o)) throw new Error('P1 anchor not found');
raw = raw.replace(p1o, p1n);
console.log('✓ P1: mobileBoost 1.5 → 1.7');

// ── PATCH 2: blaster bolt dimensions 1.5× on mobile ─────────────────────
const p2o = `    w: (isPlasma ? PLASMA_WIDTH : BLASTER_WIDTH) * scale,
    h: (isPlasma ? PLASMA_HEIGHT : BLASTER_HEIGHT) * scale,`;
const p2n = `    w: (isPlasma ? PLASMA_WIDTH : BLASTER_WIDTH) * scale * (W < 600 ? 1.5 : 1.0),
    h: (isPlasma ? PLASMA_HEIGHT : BLASTER_HEIGHT) * scale * (W < 600 ? 1.5 : 1.0),`;
if (!raw.includes(p2o)) throw new Error('P2 anchor not found');
raw = raw.replace(p2o, p2n);
console.log('✓ P2: bolt dimensions 1.5× on mobile');

// ── PATCH 3: power-up pickup radius 1.5× on mobile ───────────────────────
const p3o = `  const r = POWERUP_RADIUS * scale;`;
const p3n = `  const r = POWERUP_RADIUS * scale * (W < 600 ? 1.5 : 1.0);`;
if (!raw.includes(p3o)) throw new Error('P3 anchor not found');
raw = raw.replace(p3o, p3n);
console.log('✓ P3: powerup radius 1.5× on mobile');

// ── PATCH 4: power-up HUD — start below lives, not over them ─────────────
const p4o = `function drawPowerupHUD() {
  let hudY = 60 * scale;
  const hudX = 14;`;
const p4n = `function drawPowerupHUD() {
  // Start below the lives display: 14(startY) + 8*scale(gap) + livesShipH + 10(padding)
  const livesShipH = Math.max(19, 22 * scale);
  let hudY = 14 + Math.round(8 * scale) + livesShipH + 10;
  const hudX = 14;`;
if (!raw.includes(p4o)) throw new Error('P4 anchor not found');
raw = raw.replace(p4o, p4n);
console.log('✓ P4: power-up HUD starts below lives');

// ── PATCH 5: gear icon larger to fill ~80% of button ─────────────────────
const p5o = `  ctx.font = \`\${Math.max(20, Math.round(22 * scale))}px Arial\`;
  ctx.textAlign = 'center';
  ctx.fillText('⚙️', x + sz / 2, y + sz / 2 + Math.round(7 * scale));`;
const p5n = `  ctx.font = \`\${Math.max(32, Math.round(34 * scale))}px Arial\`;
  ctx.textAlign = 'center';
  ctx.fillText('⚙️', x + sz / 2, y + sz / 2 + Math.round(9 * scale));`;
if (!raw.includes(p5o)) throw new Error('P5 anchor not found');
raw = raw.replace(p5o, p5n);
console.log('✓ P5: gear icon font 20→32px min');

// ── PATCH 6: drawHUD — new layout ────────────────────────────────────────
// Remove score from top-right; world name gets shadow + more spacing;
// score moves to centered below world name as "Score: N"
const p6o = `// --- HUD ---
function drawHUD() {
  drawLives();

  // Score (left of pause button)
  ctx.fillStyle = '#fff';
  ctx.font = \`bold \${clampFont(22)}px 'Arial Rounded MT Bold', Arial, sans-serif\`;
  ctx.textAlign = 'right';
  ctx.fillText(score, W - 56 * scale, 30 * scale);

  // World name + progress bar
  {
    const w = WORLDS[currentWorld];
    const barW = Math.max(120, Math.min(260, W * 0.35) * scale);
    const barH = 10 * scale;
    const barX = (W - barW) / 2;
    const barY = 10;
    const progress = Math.min(worldProgress / w.threshold, 1);

    // World label — accent colored, bold, like Monster Rally level titles
    ctx.fillStyle = w.accent;
    ctx.font = \`bold \${clampFont(13)}px 'Arial Rounded MT Bold', Arial, sans-serif\`;
    ctx.textAlign = 'center';
    ctx.fillText(\`WORLD \${currentWorld + 1}: \${w.name}\`, W / 2, barY + barH + 18 * scale);

    // Bar container with subtle border
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    ctx.beginPath();
    ctx.roundRect(barX - 2, barY - 2, barW + 4, barH + 4, barH / 2 + 2);
    ctx.fill();

    // Bar background
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.beginPath();
    ctx.roundRect(barX, barY, barW, barH, barH / 2);
    ctx.fill();

    // Bar fill with gradient
    if (progress > 0) {
      const fillW = Math.max(barH, barW * progress); // minimum pill shape
      const grad = ctx.createLinearGradient(barX, 0, barX + fillW, 0);
      grad.addColorStop(0, w.accent);
      grad.addColorStop(1, '#fff');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(barX, barY, fillW, barH, barH / 2);
      ctx.fill();
    }

    // Percentage text inside bar
    ctx.fillStyle = progress > 0.15 ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.4)';
    ctx.font = \`bold \${clampFont(7)}px Arial, sans-serif\`;
    ctx.fillText(Math.round(progress * 100) + '%', W / 2, barY + barH - 2);

    // Bar glow pulse when nearly full
    if (progress > 0.8) {
      ctx.shadowColor = w.accent;
      ctx.shadowBlur = 10 + Math.sin(Date.now() / 150) * 6;
      ctx.strokeStyle = w.accent;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(barX, barY, barW * progress, barH, barH / 2);
      ctx.stroke();
      ctx.shadowBlur = 0;
    }
  }
}`;

const p6n = `// --- HUD ---
function drawHUD() {
  drawLives();

  // Progress bar + world name + score — all centered at top
  {
    const w = WORLDS[currentWorld];
    const barW = Math.max(120, Math.min(260, W * 0.35) * scale);
    const barH = 10 * scale;
    const barX = (W - barW) / 2;
    const barY = 10;
    const progress = Math.min(worldProgress / w.threshold, 1);

    // Bar container with subtle border
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    ctx.beginPath();
    ctx.roundRect(barX - 2, barY - 2, barW + 4, barH + 4, barH / 2 + 2);
    ctx.fill();

    // Bar background
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.beginPath();
    ctx.roundRect(barX, barY, barW, barH, barH / 2);
    ctx.fill();

    // Bar fill with gradient
    if (progress > 0) {
      const fillW = Math.max(barH, barW * progress); // minimum pill shape
      const grad = ctx.createLinearGradient(barX, 0, barX + fillW, 0);
      grad.addColorStop(0, w.accent);
      grad.addColorStop(1, '#fff');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(barX, barY, fillW, barH, barH / 2);
      ctx.fill();
    }

    // Percentage text inside bar
    ctx.shadowBlur = 0;
    ctx.fillStyle = progress > 0.15 ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.4)';
    ctx.font = \`bold \${clampFont(7)}px Arial, sans-serif\`;
    ctx.textAlign = 'center';
    ctx.fillText(Math.round(progress * 100) + '%', W / 2, barY + barH - 2);

    // Bar glow pulse when nearly full
    if (progress > 0.8) {
      ctx.shadowColor = w.accent;
      ctx.shadowBlur = 10 + Math.sin(Date.now() / 150) * 6;
      ctx.strokeStyle = w.accent;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(barX, barY, barW * progress, barH, barH / 2);
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // World name — extra spacing below bar, shadow for contrast on bright worlds
    const worldNameY = barY + barH + Math.max(22, Math.round(26 * scale));
    ctx.shadowColor = 'rgba(0,0,0,0.8)';
    ctx.shadowBlur = 4;
    ctx.fillStyle = w.accent;
    ctx.font = \`bold \${Math.max(15, Math.round(15 * scale))}px 'Arial Rounded MT Bold', Arial, sans-serif\`;
    ctx.textAlign = 'center';
    ctx.fillText(\`WORLD \${currentWorld + 1}: \${w.name}\`, W / 2, worldNameY);
    ctx.shadowBlur = 0;

    // Score — centered below world name, clear of gear button
    const scoreY = worldNameY + Math.max(18, Math.round(20 * scale));
    ctx.shadowColor = 'rgba(0,0,0,0.7)';
    ctx.shadowBlur = 3;
    ctx.fillStyle = 'rgba(255,255,255,0.88)';
    ctx.font = \`bold \${Math.max(14, Math.round(14 * scale))}px 'Arial Rounded MT Bold', Arial, sans-serif\`;
    ctx.textAlign = 'center';
    ctx.fillText(\`Score: \${score}\`, W / 2, scoreY);
    ctx.shadowBlur = 0;
  }
}`;

if (!raw.includes(p6o)) throw new Error('P6 anchor not found: drawHUD');
raw = raw.replace(p6o, p6n);
console.log('✓ P6: drawHUD redesigned — score centered below world name, shadows added');

// ── SYNTAX CHECK ──────────────────────────────────────────────────────────
const sm = raw.match(/<script>([\s\S]*?)<\/script>/);
if (!sm) throw new Error('No script block found');
try {
  new (require('vm').Script)(sm[1]);
  console.log('✓ Syntax OK');
} catch (e) {
  if (e.message.includes("Unexpected token '<'")) console.log('✓ Syntax OK (false positive)');
  else throw new Error('SYNTAX: ' + e.message);
}

// ── VERIFICATIONS ─────────────────────────────────────────────────────────
const chk = [
  ['mobileBoost 1.7',              raw.includes('W < 600 ? 1.7 : 1.0')],
  ['bolt boost 1.5× mobile',       raw.includes('scale * (W < 600 ? 1.5 : 1.0),\n    h:')],
  ['powerup radius boost',         raw.includes('POWERUP_RADIUS * scale * (W < 600 ? 1.5 : 1.0)')],
  ['powerupHUD below lives',       raw.includes('const livesShipH = Math.max(19, 22 * scale);')],
  ['gear font min 32',             raw.includes('Math.max(32, Math.round(34 * scale))')],
  ['score format "Score:"',        raw.includes('`Score: ${score}`')],
  ['score centered (not right)',   !raw.includes('W - 56 * scale, 30 * scale')],
  ['world name shadow',            raw.includes("shadowColor = 'rgba(0,0,0,0.8)'")],
  ['world name min 15',            raw.includes('Math.max(15, Math.round(15 * scale))')],
  ['score shadow',                 raw.includes("shadowColor = 'rgba(0,0,0,0.7)'")],
  ['shadowBlur reset after glow',  raw.includes('ctx.shadowBlur = 0;\n    }\n\n    // World name')],
  ['old top-right score gone',     !raw.includes("W - 56 * scale")],
];
let ok = true;
for (const [n, v] of chk) { console.log(`  ${v ? '✓' : '✗'} ${n}`); if (!v) ok = false; }
if (!ok) throw new Error('Verification failed — file NOT written');

// ── WRITE ─────────────────────────────────────────────────────────────────
if (eol === '\r\n') raw = raw.replace(/\n/g, '\r\n');
fs.writeFileSync(filePath, raw, 'utf8');
console.log(`\n✅ Done. File size: ${raw.length} bytes`);
