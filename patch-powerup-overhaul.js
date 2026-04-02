const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'games', 'space-dodge', 'index.html');
let html = fs.readFileSync(filePath, 'utf8');

let patchCount = 0;

function replace(oldStr, newStr, label) {
  if (!html.includes(oldStr)) {
    console.error(`PATCH FAILED [${label}]: anchor not found`);
    process.exit(1);
  }
  html = html.replace(oldStr, newStr);
  patchCount++;
  console.log(`PATCH OK [${label}]`);
}

// ============================================================
// PART 1: Replace POWERUP_TYPES
// ============================================================
replace(
  `const POWERUP_TYPES = [
  { id: 'plasma', label: 'PLASMA', color: '#00E5FF', icon: 'bolt' },
  { id: 'shield', label: 'SHIELD', color: '#69F0AE', icon: 'shield' },
];`,
  `const POWERUP_TYPES = [
  { id: 'plasma', label: 'PLASMA', color: '#00E5FF' },
  { id: 'shield', label: 'SHIELD', color: '#69F0AE' },
  { id: 'megabeam', label: 'MEGA BEAM', color: '#FF1744' },
  { id: 'phase', label: 'PHASE SHIFT', color: '#FFD740' },
];`,
  'POWERUP_TYPES'
);

// ============================================================
// PART 2: Add new state variables after existing plasma/shield vars
// ============================================================
replace(
  `// Energy Shield
let shieldActive = false;`,
  `// Energy Shield
let shieldActive = false;

// Mega Beam
let megabeamActive = false;
let megabeamTimer = 0;
const MEGABEAM_DURATION = 360;
const MEGABEAM_SCALE = 1.5;
const MEGABEAM_WIDTH = 28;

// Phase Shift
let phaseActive = false;
let phaseTimer = 0;
const PHASE_DURATION = 300;`,
  'New state variables'
);

// ============================================================
// PART 3: Power-up activation — add megabeam and phase cases
// ============================================================
replace(
  `      if (p.type === 'plasma') {
        plasmaActive = true;
        plasmaTimer = PLASMA_DURATION;
      } else if (p.type === 'shield') {
        shieldActive = true;
      }`,
  `      if (p.type === 'plasma') {
        plasmaActive = true;
        plasmaTimer = PLASMA_DURATION;
      } else if (p.type === 'shield') {
        shieldActive = true;
      } else if (p.type === 'megabeam') {
        megabeamActive = true;
        megabeamTimer = MEGABEAM_DURATION;
        ship.w = SHIP_WIDTH * scale * MEGABEAM_SCALE;
        ship.h = SHIP_HEIGHT * scale * MEGABEAM_SCALE;
      } else if (p.type === 'phase') {
        phaseActive = true;
        phaseTimer = PHASE_DURATION;
      }`,
  'Power-up activation'
);

// ============================================================
// PART 4: Timer updates in updatePowerups() — add megabeam + phase
// ============================================================
replace(
  `  // Plasma timer
  if (plasmaActive) {
    plasmaTimer--;
    if (plasmaTimer <= 0) { plasmaActive = false; }
  }`,
  `  // Plasma timer
  if (plasmaActive) {
    plasmaTimer--;
    if (plasmaTimer <= 0) { plasmaActive = false; }
  }

  // Mega Beam timer
  if (megabeamActive) {
    megabeamTimer--;
    if (megabeamTimer <= 0) {
      megabeamActive = false;
      ship.w = SHIP_WIDTH * scale;
      ship.h = SHIP_HEIGHT * scale;
    }
  }

  // Phase Shift timer
  if (phaseActive) {
    phaseTimer--;
    if (phaseTimer <= 0) phaseActive = false;
  }`,
  'Timer updates'
);

// ============================================================
// PART 5: Mega Beam asteroid destruction — insert before collision loop
// ============================================================
replace(
  `  // Update asteroids
  for (let i = asteroids.length - 1; i >= 0; i--) {`,
  `  // Mega Beam — destroy asteroids in beam column
  if (megabeamActive) {
    const beamLeft = ship.x - MEGABEAM_WIDTH * scale / 2;
    const beamRight = ship.x + MEGABEAM_WIDTH * scale / 2;
    for (let j = asteroids.length - 1; j >= 0; j--) {
      const a = asteroids[j];
      if (a.x + a.r > beamLeft && a.x - a.r < beamRight && a.y < ship.y - ship.h / 2) {
        spawnExplosionParticles(a.x, a.y, a.r);
        playSound('explode');
        score++;
        levelScore++;
        levelBlasted++;
        if (gameMode === 'campaign') worldProgress += BLAST_PROGRESS;
        asteroids.splice(j, 1);
      }
    }
  }

  // Update asteroids
  for (let i = asteroids.length - 1; i >= 0; i--) {`,
  'Mega Beam destruction'
);

// ============================================================
// PART 6: Phase Shift — wrap collision check
// ============================================================
replace(
  `    // Collision
    if (invincibleTimer <= 0 && checkCollision(a)) {`,
  `    // Collision
    if (!phaseActive && invincibleTimer <= 0 && checkCollision(a)) {`,
  'Phase Shift collision skip'
);

// ============================================================
// PART 7: resetPlayState — add megabeam + phase reset
// ============================================================
replace(
  `  plasmaActive = false;
  plasmaTimer = 0;
  shieldActive = false;`,
  `  plasmaActive = false;
  plasmaTimer = 0;
  shieldActive = false;
  megabeamActive = false;
  megabeamTimer = 0;
  phaseActive = false;
  phaseTimer = 0;`,
  'resetPlayState'
);

// ============================================================
// PART 8: Replace drawPowerups() with richer icons for all 4 types
// ============================================================
replace(
  `function drawPowerups() {
  for (const p of powerups) {
    ctx.save();
    const bobY = Math.sin(p.bob) * 3;
    ctx.translate(p.x, p.y + bobY);

    // Outer glow circle
    ctx.globalAlpha = 0.2 + Math.sin(p.bob * 2) * 0.1;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(0, 0, p.r * 1.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    // Inner circle
    ctx.fillStyle = '#16162C';
    ctx.beginPath();
    ctx.arc(0, 0, p.r, 0, Math.PI * 2);
    ctx.fill();

    // Border
    ctx.strokeStyle = p.color;
    ctx.lineWidth = 2 * scale;
    ctx.beginPath();
    ctx.arc(0, 0, p.r, 0, Math.PI * 2);
    ctx.stroke();

    // Icon
    ctx.fillStyle = p.color;
    if (p.type === 'plasma') {
      // Lightning bolt
      const s = p.r * 0.5;
      ctx.beginPath();
      ctx.moveTo(s * 0.3, -s);
      ctx.lineTo(-s * 0.4, s * 0.1);
      ctx.lineTo(s * 0.05, s * 0.1);
      ctx.lineTo(-s * 0.3, s);
      ctx.lineTo(s * 0.4, -s * 0.1);
      ctx.lineTo(-s * 0.05, -s * 0.1);
      ctx.closePath();
      ctx.fill();
    } else if (p.type === 'shield') {
      // Proper shield shape
      const s = p.r * 0.55;
      ctx.beginPath();
      ctx.moveTo(0, -s);
      ctx.lineTo(s * 0.85, -s * 0.55);
      ctx.lineTo(s * 0.85, s * 0.15);
      ctx.quadraticCurveTo(s * 0.7, s * 0.8, 0, s * 1.1);
      ctx.quadraticCurveTo(-s * 0.7, s * 0.8, -s * 0.85, s * 0.15);
      ctx.lineTo(-s * 0.85, -s * 0.55);
      ctx.closePath();
      ctx.fill();
      // Inner border
      ctx.strokeStyle = '#16162C';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, -s * 0.7);
      ctx.lineTo(s * 0.55, -s * 0.35);
      ctx.lineTo(s * 0.55, s * 0.1);
      ctx.quadraticCurveTo(s * 0.45, s * 0.55, 0, s * 0.75);
      ctx.quadraticCurveTo(-s * 0.45, s * 0.55, -s * 0.55, s * 0.1);
      ctx.lineTo(-s * 0.55, -s * 0.35);
      ctx.closePath();
      ctx.stroke();
      // Checkmark
      ctx.strokeStyle = '#16162C';
      ctx.lineWidth = 2.5 * scale;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(-s * 0.25, s * 0.05);
      ctx.lineTo(-s * 0.05, s * 0.3);
      ctx.lineTo(s * 0.3, -s * 0.2);
      ctx.stroke();
    }

    ctx.restore();
  }
}`,
  `function drawPowerups() {
  for (const p of powerups) {
    ctx.save();
    const bobY = Math.sin(p.bob) * 3;
    ctx.translate(p.x, p.y + bobY);

    // Outer ambient glow
    ctx.globalAlpha = 0.22 + Math.sin(p.bob * 2) * 0.08;
    const outerGlow = ctx.createRadialGradient(0, 0, p.r * 0.5, 0, 0, p.r * 1.5);
    outerGlow.addColorStop(0, p.color);
    outerGlow.addColorStop(1, 'transparent');
    ctx.fillStyle = outerGlow;
    ctx.beginPath();
    ctx.arc(0, 0, p.r * 1.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    // Dark inner fill
    ctx.fillStyle = '#0D0D20';
    ctx.beginPath();
    ctx.arc(0, 0, p.r, 0, Math.PI * 2);
    ctx.fill();

    // Border ring
    ctx.strokeStyle = p.color;
    ctx.lineWidth = 2 * scale;
    ctx.beginPath();
    ctx.arc(0, 0, p.r, 0, Math.PI * 2);
    ctx.stroke();

    // Inner ring
    ctx.globalAlpha = 0.3;
    ctx.strokeStyle = p.color;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(0, 0, p.r * 0.75, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;

    // ---- Icons ----
    if (p.type === 'plasma') {
      // Gradient lightning bolt
      const s = p.r * 0.52;
      const boltGrad = ctx.createLinearGradient(0, -s, 0, s);
      boltGrad.addColorStop(0, '#FFFFFF');
      boltGrad.addColorStop(0.4, '#00E5FF');
      boltGrad.addColorStop(1, '#0077AA');
      ctx.fillStyle = boltGrad;
      ctx.beginPath();
      ctx.moveTo(s * 0.3, -s);
      ctx.lineTo(-s * 0.4, s * 0.05);
      ctx.lineTo(s * 0.05, s * 0.05);
      ctx.lineTo(-s * 0.3, s);
      ctx.lineTo(s * 0.4, -s * 0.05);
      ctx.lineTo(-s * 0.05, -s * 0.05);
      ctx.closePath();
      ctx.fill();
      // Electric arcs
      ctx.globalAlpha = 0.5;
      ctx.strokeStyle = '#00E5FF';
      ctx.lineWidth = 1;
      for (let arc = 0; arc < 3; arc++) {
        const ox = (arc - 1) * s * 0.5;
        ctx.beginPath();
        ctx.moveTo(ox - s * 0.3, -s * 0.9);
        ctx.quadraticCurveTo(ox + s * 0.4, -s * 0.3, ox - s * 0.2, s * 0.5);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      // Core glow dot
      const coreG = ctx.createRadialGradient(0, -s * 0.1, 0, 0, -s * 0.1, s * 0.25);
      coreG.addColorStop(0, 'rgba(255,255,255,0.9)');
      coreG.addColorStop(1, 'transparent');
      ctx.fillStyle = coreG;
      ctx.beginPath();
      ctx.arc(0, -s * 0.1, s * 0.25, 0, Math.PI * 2);
      ctx.fill();
      // Spark dots
      ctx.fillStyle = '#FFFFFF';
      const sparks = [[-s*0.6,-s*0.7],[s*0.65,-s*0.5],[-s*0.5,s*0.6],[s*0.55,s*0.3]];
      for (const [sx, sy] of sparks) {
        ctx.beginPath();
        ctx.arc(sx, sy, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

    } else if (p.type === 'shield') {
      // Metallic green gradient shield
      const s = p.r * 0.55;
      const shieldGrad = ctx.createLinearGradient(-s * 0.5, -s, s * 0.5, s);
      shieldGrad.addColorStop(0, '#A5F3C4');
      shieldGrad.addColorStop(0.5, '#69F0AE');
      shieldGrad.addColorStop(1, '#2E7D5A');
      ctx.fillStyle = shieldGrad;
      ctx.beginPath();
      ctx.moveTo(0, -s);
      ctx.lineTo(s * 0.85, -s * 0.55);
      ctx.lineTo(s * 0.85, s * 0.15);
      ctx.quadraticCurveTo(s * 0.7, s * 0.8, 0, s * 1.1);
      ctx.quadraticCurveTo(-s * 0.7, s * 0.8, -s * 0.85, s * 0.15);
      ctx.lineTo(-s * 0.85, -s * 0.55);
      ctx.closePath();
      ctx.fill();
      // White triangle highlight
      ctx.globalAlpha = 0.25;
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.moveTo(0, -s * 0.9);
      ctx.lineTo(s * 0.5, -s * 0.3);
      ctx.lineTo(-s * 0.2, -s * 0.3);
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 1;
      // Dark inner border
      ctx.strokeStyle = 'rgba(0,0,0,0.35)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, -s * 0.7);
      ctx.lineTo(s * 0.55, -s * 0.35);
      ctx.lineTo(s * 0.55, s * 0.1);
      ctx.quadraticCurveTo(s * 0.45, s * 0.55, 0, s * 0.75);
      ctx.quadraticCurveTo(-s * 0.45, s * 0.55, -s * 0.55, s * 0.1);
      ctx.lineTo(-s * 0.55, -s * 0.35);
      ctx.closePath();
      ctx.stroke();
      // Energy plus cross
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(0, -s * 0.25); ctx.lineTo(0, s * 0.25);
      ctx.moveTo(-s * 0.25, 0); ctx.lineTo(s * 0.25, 0);
      ctx.stroke();
      // Dashed outer ring
      ctx.globalAlpha = 0.35;
      ctx.strokeStyle = '#69F0AE';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.arc(0, 0, p.r * 0.88, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.globalAlpha = 1;

    } else if (p.type === 'megabeam') {
      // Red beam column (top to mid)
      const s = p.r * 0.55;
      const beamGrad = ctx.createLinearGradient(0, -s * 1.1, 0, 0);
      beamGrad.addColorStop(0, 'rgba(255,23,68,0)');
      beamGrad.addColorStop(0.5, 'rgba(255,23,68,0.8)');
      beamGrad.addColorStop(1, '#FF1744');
      ctx.fillStyle = beamGrad;
      ctx.fillRect(-s * 0.15, -s * 1.1, s * 0.3, s * 1.1);
      // Mini ship silhouette at bottom
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.moveTo(0, s * 0.15);
      ctx.lineTo(-s * 0.35, s * 0.7);
      ctx.lineTo(-s * 0.15, s * 0.55);
      ctx.lineTo(-s * 0.1, s * 0.7);
      ctx.lineTo(0, s * 0.5);
      ctx.lineTo(s * 0.1, s * 0.7);
      ctx.lineTo(s * 0.15, s * 0.55);
      ctx.lineTo(s * 0.35, s * 0.7);
      ctx.closePath();
      ctx.fill();
      // Red wings
      ctx.fillStyle = '#FF1744';
      ctx.beginPath();
      ctx.moveTo(-s * 0.1, s * 0.4);
      ctx.lineTo(-s * 0.5, s * 0.75);
      ctx.lineTo(-s * 0.15, s * 0.55);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(s * 0.1, s * 0.4);
      ctx.lineTo(s * 0.5, s * 0.75);
      ctx.lineTo(s * 0.15, s * 0.55);
      ctx.closePath();
      ctx.fill();
      // Radiating arc strokes
      ctx.globalAlpha = 0.5;
      ctx.strokeStyle = '#FF1744';
      ctx.lineWidth = 1;
      for (let arc = 0; arc < 3; arc++) {
        const spread = (arc + 1) * s * 0.2;
        ctx.beginPath();
        ctx.arc(0, -s * 0.3, spread, Math.PI * 1.1, Math.PI * 1.9);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      // Chevron arrows
      ctx.strokeStyle = '#FF6B81';
      ctx.lineWidth = 1.5;
      ctx.lineCap = 'round';
      for (let cv = 0; cv < 2; cv++) {
        const cy = -s * 0.6 - cv * s * 0.3;
        ctx.beginPath();
        ctx.moveTo(-s * 0.15, cy + s * 0.1);
        ctx.lineTo(0, cy);
        ctx.lineTo(s * 0.15, cy + s * 0.1);
        ctx.stroke();
      }

    } else if (p.type === 'phase') {
      // Ghost ship silhouette — gold gradient, semi-transparent
      const s = p.r * 0.5;
      const ghostGrad = ctx.createLinearGradient(0, -s, 0, s);
      ghostGrad.addColorStop(0, 'rgba(255,255,180,0.85)');
      ghostGrad.addColorStop(0.5, 'rgba(255,215,64,0.7)');
      ghostGrad.addColorStop(1, 'rgba(180,120,0,0.55)');
      ctx.globalAlpha = 0.55;
      ctx.fillStyle = ghostGrad;
      ctx.beginPath();
      ctx.moveTo(0, -s);
      ctx.bezierCurveTo(s * 0.35, -s, s * 0.9, -s * 0.4, s * 0.9, s * 0.45);
      ctx.lineTo(s * 0.5, s);
      ctx.lineTo(-s * 0.5, s);
      ctx.lineTo(-s * 0.9, s * 0.45);
      ctx.bezierCurveTo(-s * 0.9, -s * 0.4, -s * 0.35, -s, 0, -s);
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 1;
      // Faint shadow echo offset
      ctx.globalAlpha = 0.15;
      ctx.fillStyle = '#FFD740';
      ctx.beginPath();
      ctx.moveTo(s * 0.12, -s * 0.9);
      ctx.bezierCurveTo(s * 0.45, -s, s * 1.02, -s * 0.4, s * 1.02, s * 0.45);
      ctx.lineTo(s * 0.62, s);
      ctx.lineTo(-s * 0.38, s);
      ctx.lineTo(-s * 0.78, s * 0.45);
      ctx.bezierCurveTo(-s * 0.78, -s * 0.4, -s * 0.22, -s, s * 0.12, -s * 0.9);
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 1;
      // Horizontal scan lines
      ctx.globalAlpha = 0.35;
      ctx.strokeStyle = '#FFD740';
      ctx.lineWidth = 0.5;
      for (let line = 0; line < 8; line++) {
        const ly = -s + line * (s * 2 / 7);
        ctx.beginPath();
        ctx.moveTo(-s * 0.85, ly);
        ctx.lineTo(s * 0.85, ly);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      // Glitch bars
      ctx.globalAlpha = 0.5;
      ctx.fillStyle = '#FFD740';
      ctx.fillRect(-s * 0.6, -s * 0.15, s * 0.4, s * 0.08);
      ctx.fillRect(s * 0.1, s * 0.25, s * 0.5, s * 0.06);
      ctx.globalAlpha = 1;
      // Diamond sparkles
      ctx.fillStyle = '#FFFFFF';
      const diamonds = [[-s*0.7,-s*0.6],[s*0.75,-s*0.4],[-s*0.6,s*0.55],[s*0.65,s*0.7]];
      for (const [dx, dy] of diamonds) {
        const ds = 2.5;
        ctx.beginPath();
        ctx.moveTo(dx, dy - ds); ctx.lineTo(dx + ds, dy);
        ctx.lineTo(dx, dy + ds); ctx.lineTo(dx - ds, dy);
        ctx.closePath();
        ctx.fill();
      }
    }

    ctx.restore();
  }
}`,
  'drawPowerups replacement'
);

// ============================================================
// PART 9: Replace plasma bolt in drawBlasters()
// ============================================================
replace(
  `    if (b.plasma) {
      // Plasma beam — wider, cyan glow, energy rings
      ctx.shadowColor = '#00E5FF';
      ctx.shadowBlur = 12;
      // Outer aura
      ctx.fillStyle = 'rgba(0,176,255,0.3)';
      ctx.beginPath();
      ctx.roundRect(b.x - b.w * 0.8, b.y - b.h / 2, b.w * 1.6, b.h, b.w);
      ctx.fill();
      // Core
      const grad = ctx.createLinearGradient(b.x, b.y - b.h / 2, b.x, b.y + b.h / 2);
      grad.addColorStop(0, '#FFFFFF');
      grad.addColorStop(0.5, '#E0F7FA');
      grad.addColorStop(1, '#00E5FF');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(b.x - b.w / 2, b.y - b.h / 2, b.w, b.h, b.w / 2);
      ctx.fill();
      ctx.shadowBlur = 0;`,
  `    if (b.plasma) {
      // Wide radial glow envelope
      const envelopeG = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.w * 2.5);
      envelopeG.addColorStop(0, 'rgba(0,229,255,0.25)');
      envelopeG.addColorStop(1, 'transparent');
      ctx.fillStyle = envelopeG;
      ctx.beginPath();
      ctx.ellipse(b.x, b.y, b.w * 2.5, b.h * 0.9, 0, 0, Math.PI * 2);
      ctx.fill();
      // Electric side arcs
      ctx.globalAlpha = 0.5;
      ctx.strokeStyle = '#00E5FF';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(b.x - b.w * 1.2, b.y - b.h * 0.3);
      ctx.quadraticCurveTo(b.x - b.w * 0.5, b.y, b.x - b.w * 1.0, b.y + b.h * 0.3);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(b.x + b.w * 1.2, b.y - b.h * 0.3);
      ctx.quadraticCurveTo(b.x + b.w * 0.5, b.y, b.x + b.w * 1.0, b.y + b.h * 0.3);
      ctx.stroke();
      ctx.globalAlpha = 1;
      // Pointed oval core — bezier shape
      ctx.shadowColor = '#00E5FF';
      ctx.shadowBlur = 10;
      const coreGrad = ctx.createLinearGradient(b.x, b.y - b.h / 2, b.x, b.y + b.h / 2);
      coreGrad.addColorStop(0, '#FFFFFF');
      coreGrad.addColorStop(0.4, '#80F0FF');
      coreGrad.addColorStop(1, '#00E5FF');
      ctx.fillStyle = coreGrad;
      const hw = b.w / 2; const hh = b.h / 2;
      ctx.beginPath();
      ctx.moveTo(b.x, b.y - hh);
      ctx.bezierCurveTo(b.x + hw, b.y - hh * 0.5, b.x + hw, b.y + hh * 0.5, b.x, b.y + hh);
      ctx.bezierCurveTo(b.x - hw, b.y + hh * 0.5, b.x - hw, b.y - hh * 0.5, b.x, b.y - hh);
      ctx.fill();
      ctx.shadowBlur = 0;
      // White hot center line
      ctx.strokeStyle = 'rgba(255,255,255,0.85)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(b.x, b.y - hh * 0.7);
      ctx.lineTo(b.x, b.y + hh * 0.7);
      ctx.stroke();`,
  'Plasma bolt redesign'
);

// ============================================================
// PART 10: Replace drawShieldEffect() with hex mesh shield
// ============================================================
replace(
  `function drawShieldEffect() {
  if (!shieldActive) return;
  ctx.save();
  ctx.translate(ship.x, ship.y);
  const r = ship.w * 0.8;
  const pulse = Math.sin(frameCount * 0.1) * 0.15;
  // Bubble
  ctx.globalAlpha = 0.15 + pulse;
  ctx.fillStyle = '#69F0AE';
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fill();
  // Ring
  ctx.globalAlpha = 0.5 + pulse;
  ctx.strokeStyle = '#69F0AE';
  ctx.lineWidth = 2 * scale;
  ctx.setLineDash([8, 4]);
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.globalAlpha = 1;
  ctx.restore();
}`,
  `function drawShieldEffect() {
  if (!shieldActive) return;
  ctx.save();
  ctx.translate(ship.x, ship.y);
  const r = ship.w * 0.85;
  const pulse = Math.sin(frameCount * 0.12) * 0.1;

  // Outer ambient glow
  const ambientG = ctx.createRadialGradient(0, 0, r * 0.6, 0, 0, r * 1.4);
  ambientG.addColorStop(0, 'rgba(105,240,174,0.06)');
  ambientG.addColorStop(1, 'transparent');
  ctx.fillStyle = ambientG;
  ctx.beginPath();
  ctx.arc(0, 0, r * 1.4, 0, Math.PI * 2);
  ctx.fill();

  // Bubble fill — brightens at edges
  const bubbleG = ctx.createRadialGradient(0, 0, r * 0.2, 0, 0, r);
  bubbleG.addColorStop(0, 'rgba(105,240,174,0.02)');
  bubbleG.addColorStop(0.75, 'rgba(105,240,174,0.08)');
  bubbleG.addColorStop(1, 'rgba(105,240,174,0.20)');
  ctx.fillStyle = bubbleG;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fill();

  // Hex mesh pattern clipped to sphere
  ctx.save();
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.97, 0, Math.PI * 2);
  ctx.clip();
  ctx.globalAlpha = 0.10 + pulse * 0.5;
  ctx.strokeStyle = '#69F0AE';
  ctx.lineWidth = 0.8;
  const hexR = r * 0.28;
  const hexH = hexR * Math.sqrt(3);
  for (let row = -3; row <= 3; row++) {
    for (let col = -3; col <= 3; col++) {
      const hx = col * hexR * 1.5;
      const hy = row * hexH + (col % 2 === 0 ? 0 : hexH / 2);
      ctx.beginPath();
      for (let v = 0; v < 6; v++) {
        const ang = (Math.PI / 3) * v - Math.PI / 6;
        const vx = hx + hexR * Math.cos(ang);
        const vy = hy + hexR * Math.sin(ang);
        if (v === 0) ctx.moveTo(vx, vy); else ctx.lineTo(vx, vy);
      }
      ctx.closePath();
      ctx.stroke();
    }
  }
  ctx.restore();

  // Bright edge ring (pulsing)
  ctx.globalAlpha = 0.50 + pulse * 0.15;
  ctx.strokeStyle = '#69F0AE';
  ctx.lineWidth = 2.5 * scale;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.stroke();

  // 4 rotating energy crackle arcs
  ctx.globalAlpha = 0.45;
  ctx.strokeStyle = '#A5F3C4';
  ctx.lineWidth = 1.2;
  for (let arc = 0; arc < 4; arc++) {
    const baseAng = (frameCount * 0.035) + arc * Math.PI / 2;
    const ax = Math.cos(baseAng) * r;
    const ay = Math.sin(baseAng) * r;
    const mx = Math.cos(baseAng + 0.4) * r * 0.6;
    const my = Math.sin(baseAng + 0.4) * r * 0.6;
    const bx = Math.cos(baseAng + 0.8) * r;
    const by = Math.sin(baseAng + 0.8) * r;
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.quadraticCurveTo(mx, my, bx, by);
    ctx.stroke();
  }

  // Top specular highlight
  ctx.globalAlpha = 0.18;
  const specG = ctx.createRadialGradient(0, -r * 0.55, 0, 0, -r * 0.4, r * 0.45);
  specG.addColorStop(0, '#FFFFFF');
  specG.addColorStop(1, 'transparent');
  ctx.fillStyle = specG;
  ctx.beginPath();
  ctx.arc(0, -r * 0.4, r * 0.45, 0, Math.PI * 2);
  ctx.fill();

  ctx.globalAlpha = 1;
  ctx.restore();
}`,
  'drawShieldEffect redesign'
);

// ============================================================
// PART 11: Add drawMegaBeam() function — insert before drawShieldEffect
// ============================================================
replace(
  `function drawShieldEffect() {`,
  `function drawMegaBeam() {
  if (!megabeamActive) return;
  ctx.save();
  const bw = MEGABEAM_WIDTH * scale;
  const bx = ship.x;
  const topY = 0;
  const bottomY = ship.y - ship.h / 2;

  // Layer 1: Wide ambient red glow (4x beam width)
  const ambG = ctx.createLinearGradient(bx - bw * 2, 0, bx + bw * 2, 0);
  ambG.addColorStop(0, 'transparent');
  ambG.addColorStop(0.5, 'rgba(255,23,68,0.08)');
  ambG.addColorStop(1, 'transparent');
  ctx.fillStyle = ambG;
  ctx.fillRect(bx - bw * 2, topY, bw * 4, bottomY - topY);

  // Layer 2: Outer beam column
  const outerG = ctx.createLinearGradient(bx - bw / 2, 0, bx + bw / 2, 0);
  outerG.addColorStop(0, 'transparent');
  outerG.addColorStop(0.35, 'rgba(255,23,68,0.30)');
  outerG.addColorStop(0.5, 'rgba(255,23,68,0.30)');
  outerG.addColorStop(1, 'transparent');
  ctx.fillStyle = outerG;
  ctx.fillRect(bx - bw / 2, topY, bw, bottomY - topY);

  // Layer 3: White-hot inner core (35% of beam width)
  const coreW = bw * 0.35;
  const coreG = ctx.createLinearGradient(bx - coreW / 2, 0, bx + coreW / 2, 0);
  coreG.addColorStop(0, 'transparent');
  coreG.addColorStop(0.5, 'rgba(255,255,255,0.85)');
  coreG.addColorStop(1, 'transparent');
  ctx.fillStyle = coreG;
  ctx.fillRect(bx - coreW / 2, topY, coreW, bottomY - topY);

  // Layer 4: 5 energy rings traveling upward
  ctx.strokeStyle = 'rgba(255,100,120,0.6)';
  ctx.lineWidth = 1.5;
  for (let ring = 0; ring < 5; ring++) {
    const ringPhase = ((frameCount * 3 + ring * (360 / 5)) % 360) / 360;
    const ry = topY + ringPhase * (bottomY - topY);
    const rw = bw * (0.6 + Math.sin(ringPhase * Math.PI) * 0.4);
    ctx.globalAlpha = 0.4 * (1 - ringPhase);
    ctx.beginPath();
    ctx.ellipse(bx, ry, rw / 2, rw * 0.12, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  // Layer 5: Origin glow at ship nose
  const noseY = ship.y - ship.h / 2;
  const noseG = ctx.createRadialGradient(bx, noseY, 0, bx, noseY, bw * 1.2);
  noseG.addColorStop(0, 'rgba(255,255,255,0.9)');
  noseG.addColorStop(0.3, 'rgba(255,80,100,0.6)');
  noseG.addColorStop(1, 'transparent');
  ctx.fillStyle = noseG;
  ctx.beginPath();
  ctx.arc(bx, noseY, bw * 1.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawShieldEffect() {`,
  'Add drawMegaBeam'
);

// ============================================================
// PART 12: Add drawPhaseEffect() and modify drawShip() for phase flicker
// ============================================================
// Modify drawShip to add phase alpha at start (after wobble/invincible checks)
replace(
  `  // invincible flash
  if (invincibleTimer > 0 && Math.floor(invincibleTimer / 6) % 2 === 0) {
    ctx.globalAlpha = 0.4;
  }`,
  `  // phase shift flicker
  if (phaseActive) {
    ctx.globalAlpha = 0.4 + Math.sin(frameCount * 0.15) * 0.15;
  }
  // invincible flash
  if (invincibleTimer > 0 && Math.floor(invincibleTimer / 6) % 2 === 0) {
    ctx.globalAlpha = 0.4;
  }`,
  'Phase flicker in drawShip'
);

// Add drawPhaseEffect function (insert before clampFont)
replace(
  `function clampFont(size) {`,
  `function drawPhaseEffect() {
  if (!phaseActive) return;
  ctx.save();
  // Glitch echo: ship offset 4px right, 10% opacity
  ctx.globalAlpha = 0.1;
  ctx.drawImage(canvas, ship.x - ship.w / 2 + 4, ship.y - ship.h / 2,
    ship.w, ship.h, ship.x - ship.w / 2 + 4, ship.y - ship.h / 2, ship.w, ship.h);
  ctx.globalAlpha = 1;

  // Horizontal scan lines across ship area (scrolling downward)
  const sx = ship.x - ship.w * 0.6;
  const sw = ship.w * 1.2;
  const sy = ship.y - ship.h * 0.55;
  const sh = ship.h * 1.1;
  ctx.strokeStyle = 'rgba(255,215,64,0.18)';
  ctx.lineWidth = 0.5;
  const lineSpacing = 4;
  const lineOffset = (frameCount * 1.2) % lineSpacing;
  for (let ly = sy + lineOffset; ly < sy + sh; ly += lineSpacing) {
    ctx.beginPath();
    ctx.moveTo(sx, ly);
    ctx.lineTo(sx + sw, ly);
    ctx.stroke();
  }

  // 3 random golden diamond sparkles around ship
  ctx.fillStyle = '#FFD740';
  for (let sp = 0; sp < 3; sp++) {
    const spx = ship.x + (Math.random() - 0.5) * ship.w * 1.5;
    const spy = ship.y + (Math.random() - 0.5) * ship.h * 1.5;
    const ds = 2 + Math.random() * 2;
    ctx.globalAlpha = Math.random() * 0.5 + 0.2;
    ctx.beginPath();
    ctx.moveTo(spx, spy - ds); ctx.lineTo(spx + ds, spy);
    ctx.lineTo(spx, spy + ds); ctx.lineTo(spx - ds, spy);
    ctx.closePath();
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  ctx.restore();
}

function clampFont(size) {`,
  'Add drawPhaseEffect'
);

// ============================================================
// PART 13: Replace drawPowerupHUD() with bars for plasma+megabeam, text for shield+phase
// ============================================================
replace(
  `function drawPowerupHUD() {
  // Position below the lives ships (lives area ends around y=55*scale)
  let hudY = 58 * scale;
  const hudX = 14;
  ctx.textAlign = 'left';

  if (plasmaActive) {
    const pct = plasmaTimer / PLASMA_DURATION;
    const barW = 60 * scale;
    const barH = 5 * scale;
    ctx.fillStyle = '#00E5FF';
    ctx.font = \`bold \${clampFont(9)}px Arial, sans-serif\`;
    ctx.fillText('⚡ PLASMA', hudX, hudY);
    hudY += 10 * scale;
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    ctx.beginPath();
    ctx.roundRect(hudX, hudY, barW, barH, barH / 2);
    ctx.fill();
    ctx.fillStyle = '#00E5FF';
    ctx.beginPath();
    ctx.roundRect(hudX, hudY, barW * pct, barH, barH / 2);
    ctx.fill();
    hudY += 14 * scale;
  }

  if (shieldActive) {
    ctx.fillStyle = '#69F0AE';
    ctx.font = \`bold \${clampFont(9)}px Arial, sans-serif\`;
    ctx.fillText('🛡️ SHIELD ACTIVE', hudX, hudY);
  }
}`,
  `function drawPowerupBar(x, y, label, pct, color) {
  const barW = 70 * scale;
  const barH = 5 * scale;
  ctx.fillStyle = color;
  ctx.font = \`bold \${clampFont(9)}px Arial, sans-serif\`;
  ctx.textAlign = 'left';
  ctx.fillText(label, x, y);
  const by = y + 3 * scale;
  ctx.fillStyle = 'rgba(255,255,255,0.12)';
  ctx.beginPath();
  ctx.roundRect(x, by, barW, barH, barH / 2);
  ctx.fill();
  const grad = ctx.createLinearGradient(x, by, x + barW * pct, by);
  grad.addColorStop(0, color);
  grad.addColorStop(1, '#FFFFFF');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.roundRect(x, by, barW * Math.max(0.02, pct), barH, barH / 2);
  ctx.fill();
}

function drawPowerupHUD() {
  let hudY = 60 * scale;
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
}`,
  'drawPowerupHUD replacement'
);

// ============================================================
// PART 14: Fix draw() order — megabeam before ship, phaseEffect after ship
// ============================================================
replace(
  `  // Playing
  drawWorldBackground();
  for (const a of asteroids) drawAsteroid(a);
  drawPowerups();
  drawBlasters();
  drawShip(ship.x, ship.y, ship.w, ship.h, wobbleTimer);
  drawShieldEffect();
  drawParticles();
  drawHUD();
  drawPowerupHUD();
  drawPauseButton();`,
  `  // Playing
  drawWorldBackground();
  for (const a of asteroids) drawAsteroid(a);
  drawMegaBeam();
  drawShip(ship.x, ship.y, ship.w, ship.h, wobbleTimer);
  drawPhaseEffect();
  drawShieldEffect();
  drawBlasters();
  drawPowerups();
  drawParticles();
  drawHUD();
  drawPowerupHUD();
  drawPauseButton();`,
  'draw() order fix'
);

fs.writeFileSync(filePath, html, 'utf8');
console.log(`\nAll ${patchCount} patches applied successfully.`);
