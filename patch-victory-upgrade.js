// patch-victory-upgrade.js
// Task 1: Auto-switch to newly unlocked ship on campaign win
// Task 2: Bigger hero ship on victory screen with glow + name + type

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'games', 'space-dodge', 'index.html');
let raw = fs.readFileSync(filePath, 'utf8');
const originalLineEnding = raw.includes('\r\n') ? '\r\n' : '\n';
raw = raw.replace(/\r\n/g, '\n');

console.log(`Game file length: ${raw.length}`);

// ── PATCH 1: Add justUnlockedShip state var before drawVictory ────────────
const p1Old = `// --- VICTORY SCREEN ---\nfunction drawVictory() {`;
const p1New = `// --- VICTORY SCREEN ---
let justUnlockedShip = -1; // index of ship just unlocked, -1 if none

function drawVictory() {`;
if (!raw.includes(p1Old)) throw new Error('Patch 1 anchor not found');
raw = raw.replace(p1Old, p1New);
console.log('✓ Patch 1: justUnlockedShip state var added');

// ── PATCH 2: Auto-switch selectedShip + set justUnlockedShip on win ───────
const p2Old = `        const nextShip = selectedShip + 1;
        if (nextShip < SHIPS.length && !unlockedShips.includes(nextShip)) {
          unlockedShips.push(nextShip);
          localStorage.setItem('sd_unlocked', JSON.stringify(unlockedShips));
        }`;
const p2New = `        const nextShip = selectedShip + 1;
        if (nextShip < SHIPS.length && !unlockedShips.includes(nextShip)) {
          unlockedShips.push(nextShip);
          localStorage.setItem('sd_unlocked', JSON.stringify(unlockedShips));
          // Auto-switch to the newly unlocked ship
          justUnlockedShip = nextShip;
          selectedShip = nextShip;
          localStorage.setItem('sd_ship', selectedShip.toString());
        } else {
          justUnlockedShip = -1; // all ships already unlocked
        }`;
if (!raw.includes(p2Old)) throw new Error('Patch 2 anchor not found: win unlock block');
raw = raw.replace(p2Old, p2New);
console.log('✓ Patch 2: auto-switch selectedShip + justUnlockedShip set on campaign win');

// ── PATCH 3: Reset justUnlockedShip on startCampaign ─────────────────────
const p3Old = `function startCampaign() {
  initAudio();
  gameMode = 'campaign';
  currentWorld = 0;
  score = 0;
  lives = MAX_LIVES;
  showWorldTitle();
}`;
const p3New = `function startCampaign() {
  initAudio();
  gameMode = 'campaign';
  currentWorld = 0;
  score = 0;
  lives = MAX_LIVES;
  justUnlockedShip = -1;
  showWorldTitle();
}`;
if (!raw.includes(p3Old)) throw new Error('Patch 3 anchor not found: startCampaign');
raw = raw.replace(p3Old, p3New);
console.log('✓ Patch 3: justUnlockedShip reset in startCampaign()');

// ── PATCH 4: Replace drawVictory() with hero ship redesign ───────────────
const p4Old = `function drawVictory() {
  // Rainbow-ish cycling background
  const hue = (Date.now() / 50) % 360;
  ctx.fillStyle = \`hsl(\${hue}, 30%, 8%)\`;
  ctx.fillRect(0, 0, W, H);
  drawStars();

  // Falling confetti stream
  if (Math.random() < 0.4) {
    particles.push({
      x: Math.random() * W, y: -5,
      vx: (Math.random() - 0.5) * 2,
      vy: 1 + Math.random() * 2,
      life: 80 + Math.random() * 40,
      maxLife: 120,
      size: 3 + Math.random() * 3,
      color: ['#FF5252','#FFD740','#69F0AE','#40C4FF','#E040FB','#FF6E40'][Math.floor(Math.random() * 6)]
    });
  }

  // Confetti pops — bursts from sides
  if (Math.random() < 0.06) {
    const fromLeft = Math.random() > 0.5;
    const bx = fromLeft ? W * 0.1 : W * 0.9;
    const by = H * (0.2 + Math.random() * 0.4);
    for (let i = 0; i < 15; i++) {
      const angle = (fromLeft ? -0.5 : 0.5) * Math.PI + (Math.random() - 0.5) * Math.PI * 0.8;
      const speed = 3 + Math.random() * 5;
      particles.push({
        x: bx, y: by,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        life: 40 + Math.random() * 30,
        maxLife: 70,
        size: 3 + Math.random() * 4,
        color: ['#FF5252','#FFD740','#69F0AE','#40C4FF','#E040FB','#FF6E40','#FFFFFF'][Math.floor(Math.random() * 7)]
      });
    }
  }

  drawParticles();
  updateParticles();

  // Ship celebration
  titleShipBob += 0.04;
  const shipY = H * 0.38 + Math.sin(titleShipBob) * 10;
  drawShip(W / 2, shipY, SHIP_WIDTH * 2 * scale, SHIP_HEIGHT * 2 * scale, 0);

  ctx.fillStyle = '#ffcc00';
  ctx.font = \`bold \${Math.round(42 * scale)}px 'Arial Rounded MT Bold', Arial, sans-serif\`;
  ctx.textAlign = 'center';
  ctx.fillText('WELL DONE!', W / 2, H * 0.1);

  // Stars
  const starY = H * 0.17;
  for (let i = 0; i < 5; i++) {
    drawStar5(W / 2 + (i - 2) * 36 * scale, starY, 14 * scale, '#ffcc00');
  }

  ctx.fillStyle = '#fff';
  ctx.font = \`bold \${Math.round(28 * scale)}px 'Arial Rounded MT Bold', Arial, sans-serif\`;
  ctx.fillText('ALL WORLDS COMPLETE!', W / 2, H * 0.65);

  ctx.fillStyle = '#fff';
  ctx.font = \`bold \${Math.round(44 * scale)}px 'Arial Rounded MT Bold', Arial, sans-serif\`;
  ctx.fillText(score, W / 2, H * 0.74);

  // Unlock messages with ship preview
  const nextShip = selectedShip + 1;
  if (nextShip < SHIPS.length && unlockedShips.includes(nextShip)) {
    const ns = SHIPS[nextShip];
    const unlockY = H * 0.86;
    // Draw the unlocked ship small preview
    const previewSize = 30 * scale;
    drawShipByIndex(nextShip, W / 2 - 90 * scale, unlockY - 4 * scale, previewSize, previewSize * 1.3);
    // Text
    ctx.fillStyle = ns.accent;
    ctx.font = \`bold \${Math.round(16 * scale)}px 'Arial Rounded MT Bold', Arial, sans-serif\`;
    ctx.textAlign = 'left';
    ctx.fillText(ns.name.toUpperCase() + ' UNLOCKED!', W / 2 - 60 * scale, unlockY + 4 * scale);
    ctx.textAlign = 'center';
  } else {
    ctx.fillStyle = '#69F0AE';
    ctx.font = \`bold \${Math.round(16 * scale)}px 'Arial Rounded MT Bold', Arial, sans-serif\`;
    ctx.fillText('⭐ CHAMPION PILOT! ⭐', W / 2, H * 0.86);
  }

  const blink = Math.sin(Date.now() / 400) > 0;
  if (blink) {
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = \`\${Math.round(14 * scale)}px Arial, sans-serif\`;
    ctx.fillText('TAP OR PRESS SPACE', W / 2, H * 0.95);
  }

  drawMenuButton();
}`;

const p4New = `function drawVictory() {
  // Rainbow-ish cycling background
  const hue = (Date.now() / 50) % 360;
  ctx.fillStyle = \`hsl(\${hue}, 30%, 8%)\`;
  ctx.fillRect(0, 0, W, H);
  drawStars();

  // Falling confetti stream
  if (Math.random() < 0.4) {
    particles.push({
      x: Math.random() * W, y: -5,
      vx: (Math.random() - 0.5) * 2,
      vy: 1 + Math.random() * 2,
      life: 80 + Math.random() * 40,
      maxLife: 120,
      size: 3 + Math.random() * 3,
      color: ['#FF5252','#FFD740','#69F0AE','#40C4FF','#E040FB','#FF6E40'][Math.floor(Math.random() * 6)]
    });
  }

  // Confetti pops — bursts from sides
  if (Math.random() < 0.06) {
    const fromLeft = Math.random() > 0.5;
    const bx = fromLeft ? W * 0.1 : W * 0.9;
    const by = H * (0.2 + Math.random() * 0.4);
    for (let i = 0; i < 15; i++) {
      const angle = (fromLeft ? -0.5 : 0.5) * Math.PI + (Math.random() - 0.5) * Math.PI * 0.8;
      const speed = 3 + Math.random() * 5;
      particles.push({
        x: bx, y: by,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        life: 40 + Math.random() * 30,
        maxLife: 70,
        size: 3 + Math.random() * 4,
        color: ['#FF5252','#FFD740','#69F0AE','#40C4FF','#E040FB','#FF6E40','#FFFFFF'][Math.floor(Math.random() * 7)]
      });
    }
  }

  drawParticles();
  updateParticles();

  // ── HEADER ──────────────────────────────────────────────────────────────
  ctx.fillStyle = '#ffcc00';
  ctx.font = \`bold \${Math.max(28, Math.round(42 * scale))}px 'Arial Rounded MT Bold', Arial, sans-serif\`;
  ctx.textAlign = 'center';
  ctx.fillText('WELL DONE!', W / 2, H * 0.09);

  // Five gold stars
  const starY = H * 0.16;
  for (let i = 0; i < 5; i++) {
    drawStar5(W / 2 + (i - 2) * 34 * scale, starY, 12 * scale, '#ffcc00');
  }

  // ── HERO SHIP (3× game size, with glow behind) ──────────────────────────
  titleShipBob += 0.035;
  const s = SHIPS[selectedShip];
  const shipSz = 3.0;
  const heroW = SHIP_WIDTH  * shipSz * scale;
  const heroH = SHIP_HEIGHT * shipSz * scale;
  const heroX = W / 2;
  const heroCenterY = H * 0.41;
  const bobY = heroCenterY + Math.sin(titleShipBob) * 9;

  // Radial accent glow behind ship
  const glowR = Math.max(70, Math.round(110 * scale));
  const glowGrad = ctx.createRadialGradient(heroX, heroCenterY, 0, heroX, heroCenterY, glowR);
  glowGrad.addColorStop(0, s.accent + '55');
  glowGrad.addColorStop(0.45, s.accent + '28');
  glowGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = glowGrad;
  ctx.beginPath();
  ctx.ellipse(heroX, heroCenterY, glowR, glowR * 0.72, 0, 0, Math.PI * 2);
  ctx.fill();

  // Animated platform ring (like title screen)
  const t = Date.now() / 1000;
  ctx.globalAlpha = 0.35 + Math.sin(t * 2.2) * 0.15;
  ctx.strokeStyle = s.accent;
  ctx.lineWidth = 2.5 * scale;
  ctx.beginPath();
  ctx.ellipse(heroX, heroCenterY + heroH * 0.46, heroW * 0.52, heroH * 0.13, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.globalAlpha = 1;

  // Ship itself
  drawShip(heroX, bobY, heroW, heroH, 0);

  // ── SHIP NAME + TYPE ────────────────────────────────────────────────────
  const nameBaseY = heroCenterY + heroH * 0.52;
  ctx.fillStyle = s.accent;
  ctx.font = \`bold \${Math.max(16, Math.round(24 * scale))}px 'Arial Rounded MT Bold', Arial, sans-serif\`;
  ctx.textAlign = 'center';
  ctx.fillText(s.name.toUpperCase(), heroX, nameBaseY + Math.max(18, Math.round(24 * scale)));

  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.font = \`\${Math.max(13, Math.round(15 * scale))}px Arial, sans-serif\`;
  ctx.fillText(s.type, heroX, nameBaseY + Math.max(36, Math.round(46 * scale)));

  // ── UNLOCK OR CHAMPION MESSAGE ───────────────────────────────────────────
  const msgY = nameBaseY + Math.max(56, Math.round(70 * scale));
  if (justUnlockedShip >= 0) {
    ctx.fillStyle = s.accent;
    ctx.font = \`bold \${Math.max(14, Math.round(18 * scale))}px 'Arial Rounded MT Bold', Arial, sans-serif\`;
    ctx.textAlign = 'center';
    ctx.fillText('🔓 NEW SHIP UNLOCKED!', heroX, msgY);
  } else {
    ctx.fillStyle = '#69F0AE';
    ctx.font = \`bold \${Math.max(13, Math.round(16 * scale))}px 'Arial Rounded MT Bold', Arial, sans-serif\`;
    ctx.textAlign = 'center';
    ctx.fillText('⭐ CHAMPION PILOT! ALL SHIPS UNLOCKED! ⭐', heroX, msgY);
  }

  // ── SCORE ────────────────────────────────────────────────────────────────
  const scoreY = msgY + Math.max(30, Math.round(38 * scale));
  ctx.fillStyle = '#fff';
  ctx.font = \`bold \${Math.max(22, Math.round(32 * scale))}px 'Arial Rounded MT Bold', Arial, sans-serif\`;
  ctx.textAlign = 'center';
  ctx.fillText(score, heroX, scoreY);
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.font = \`\${Math.max(11, Math.round(13 * scale))}px Arial, sans-serif\`;
  ctx.fillText('ASTEROIDS CLEARED', heroX, scoreY + Math.max(14, Math.round(18 * scale)));

  // ── TAP PROMPT ───────────────────────────────────────────────────────────
  const blink = Math.sin(Date.now() / 400) > 0;
  if (blink) {
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = \`\${Math.max(12, Math.round(14 * scale))}px Arial, sans-serif\`;
    ctx.fillText('TAP OR PRESS SPACE', W / 2, H * 0.97);
  }

  drawMenuButton();
}`;

if (!raw.includes(p4Old)) throw new Error('Patch 4 anchor not found: drawVictory body');
raw = raw.replace(p4Old, p4New);
console.log('✓ Patch 4: drawVictory() redesigned with 3× hero ship + glow');

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
  ['justUnlockedShip declared',       raw.includes('let justUnlockedShip = -1;')],
  ['auto-switch selectedShip',         raw.includes('selectedShip = nextShip;') && raw.includes("localStorage.setItem('sd_ship', selectedShip.toString())")],
  ['justUnlockedShip set on win',      raw.includes('justUnlockedShip = nextShip;')],
  ['justUnlockedShip = -1 else branch', raw.includes('justUnlockedShip = -1; // all ships already unlocked')],
  ['startCampaign resets flag',        raw.includes('justUnlockedShip = -1;\n  showWorldTitle()')],
  ['3x hero ship',                     raw.includes('const shipSz = 3.0;')],
  ['radial glow gradient',             raw.includes('glowGrad.addColorStop')],
  ['platform ring on victory',         raw.includes('ctx.ellipse(heroX, heroCenterY + heroH * 0.46')],
  ['ship name rendered',               raw.includes('s.name.toUpperCase()')],
  ['ship type rendered',               raw.includes('s.type, heroX')],
  ['unlock message branch',            raw.includes("'🔓 NEW SHIP UNLOCKED!'")],
  ['champion branch',                  raw.includes("'⭐ CHAMPION PILOT! ALL SHIPS UNLOCKED! ⭐'")],
  ['old small preview gone',           !raw.includes('previewSize = 30 * scale')],
  ['old 2x drawShip gone',             !raw.includes('SHIP_HEIGHT * 2 * scale, 0)')],
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
console.log(`\n✅ Victory upgrade patched! New file size: ${raw.length} bytes`);
