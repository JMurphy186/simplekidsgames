// patch-powerup-icons.js — Port mockup icons, 2x Mega Beam scale, slower ship
'use strict';
const fs = require('fs');
const path = require('path');

const GAME_FILE = path.join(__dirname, 'games', 'space-dodge', 'index.html');
let raw = fs.readFileSync(GAME_FILE, 'utf8');
const hadCRLF = raw.includes('\r\n');
if (hadCRLF) raw = raw.replace(/\r\n/g, '\n');
console.log('Game file length:', raw.length);

// ============================================================
// PATCH 1: Replace entire icon section in drawPowerups()
// From container drawing → through end of phase icon block
// ============================================================

const ICONS_OLD = `    // Outer ambient glow
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
    }`;

const ICONS_NEW = `    // ── CONTAINER (mockup drawContainer ported) ──────────────
    // Outer glow
    ctx.globalAlpha = 0.25;
    const outerGlow = ctx.createRadialGradient(0, 0, p.r * 0.5, 0, 0, p.r * 1.6);
    outerGlow.addColorStop(0, p.color);
    outerGlow.addColorStop(1, 'transparent');
    ctx.fillStyle = outerGlow;
    ctx.beginPath();
    ctx.arc(0, 0, p.r * 1.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    // Dark inner circle — radial gradient
    const innerGrad = ctx.createRadialGradient(-p.r * 0.2, -p.r * 0.2, 0, 0, 0, p.r);
    innerGrad.addColorStop(0, '#1e1e3a');
    innerGrad.addColorStop(1, '#0c0c1e');
    ctx.fillStyle = innerGrad;
    ctx.beginPath();
    ctx.arc(0, 0, p.r, 0, Math.PI * 2);
    ctx.fill();
    // Border ring
    ctx.strokeStyle = p.color;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(0, 0, p.r, 0, Math.PI * 2);
    ctx.stroke();
    // Subtle inner ring
    ctx.strokeStyle = p.color;
    ctx.lineWidth = 0.5;
    ctx.globalAlpha = 0.3;
    ctx.beginPath();
    ctx.arc(0, 0, p.r * 0.85, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;

    // ── ICONS (exact mockup port, cx/cy → 0/0) ────────────────
    if (p.type === 'plasma') {
      const r = p.r;
      // Electric arcs behind bolt
      ctx.strokeStyle = '#00E5FF';
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.4;
      ctx.beginPath();
      ctx.moveTo(-r*0.5, -r*0.3);
      ctx.quadraticCurveTo(-r*0.1, -r*0.5, r*0.15, -r*0.15);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(r*0.5, r*0.3);
      ctx.quadraticCurveTo(r*0.1, r*0.5, -r*0.15, r*0.15);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-r*0.4, r*0.2);
      ctx.quadraticCurveTo(-r*0.55, -r*0.1, -r*0.2, -r*0.4);
      ctx.stroke();
      ctx.globalAlpha = 1;
      // Lightning bolt — gradient
      const s = r * 0.55;
      const boltGrad = ctx.createLinearGradient(0, -s, 0, s);
      boltGrad.addColorStop(0, '#FFFFFF');
      boltGrad.addColorStop(0.3, '#80DEEA');
      boltGrad.addColorStop(0.7, '#00E5FF');
      boltGrad.addColorStop(1, '#00B8D4');
      ctx.fillStyle = boltGrad;
      ctx.beginPath();
      ctx.moveTo(s * 0.35, -s);
      ctx.lineTo(-s * 0.15, -s * 0.05);
      ctx.lineTo(s * 0.12, -s * 0.05);
      ctx.lineTo(-s * 0.35, s);
      ctx.lineTo(s * 0.15, s * 0.05);
      ctx.lineTo(-s * 0.12, s * 0.05);
      ctx.closePath();
      ctx.fill();
      // Bright core glow
      const coreGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 0.4);
      coreGlow.addColorStop(0, 'rgba(255,255,255,0.3)');
      coreGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = coreGlow;
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.4, 0, Math.PI * 2);
      ctx.fill();
      // Tiny spark dots
      ctx.fillStyle = '#FFFFFF';
      ctx.globalAlpha = 0.7;
      [[-r*0.35,-r*0.45],[r*0.4,r*0.35],[r*0.35,-r*0.2],[-r*0.3,r*0.5]].forEach(([x,y]) => {
        ctx.beginPath(); ctx.arc(x, y, 1.2, 0, Math.PI * 2); ctx.fill();
      });
      ctx.globalAlpha = 1;

    } else if (p.type === 'shield') {
      const r = p.r;
      const s = r * 0.58;
      // Shield shape — metallic gradient
      const shieldGrad = ctx.createLinearGradient(-s, -s, s, s);
      shieldGrad.addColorStop(0,    '#B9F6CA');
      shieldGrad.addColorStop(0.25, '#69F0AE');
      shieldGrad.addColorStop(0.5,  '#00E676');
      shieldGrad.addColorStop(0.75, '#69F0AE');
      shieldGrad.addColorStop(1,    '#00C853');
      ctx.fillStyle = shieldGrad;
      ctx.beginPath();
      ctx.moveTo(0, -s);
      ctx.lineTo(s * 0.85, -s * 0.5);
      ctx.lineTo(s * 0.85, s * 0.15);
      ctx.quadraticCurveTo(s * 0.7, s * 0.8, 0, s * 1.05);
      ctx.quadraticCurveTo(-s * 0.7, s * 0.8, -s * 0.85, s * 0.15);
      ctx.lineTo(-s * 0.85, -s * 0.5);
      ctx.closePath();
      ctx.fill();
      // Highlight streak (metallic shine)
      ctx.globalAlpha = 0.35;
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.moveTo(-s * 0.3, -s * 0.9);
      ctx.lineTo(-s * 0.5, -s * 0.3);
      ctx.lineTo(-s * 0.2, s * 0.2);
      ctx.lineTo(0, -s * 0.5);
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 1;
      // Inner border (dark inset)
      ctx.strokeStyle = '#004D40';
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = 0.5;
      ctx.beginPath();
      ctx.moveTo(0, -s * 0.7);
      ctx.lineTo(s * 0.55, -s * 0.3);
      ctx.lineTo(s * 0.55, s * 0.1);
      ctx.quadraticCurveTo(s * 0.45, s * 0.55, 0, s * 0.72);
      ctx.quadraticCurveTo(-s * 0.45, s * 0.55, -s * 0.55, s * 0.1);
      ctx.lineTo(-s * 0.55, -s * 0.3);
      ctx.closePath();
      ctx.stroke();
      ctx.globalAlpha = 1;
      // Energy plus symbol
      ctx.strokeStyle = '#004D40';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(0, -s * 0.25); ctx.lineTo(0, s * 0.25);
      ctx.moveTo(-s * 0.25, 0); ctx.lineTo(s * 0.25, 0);
      ctx.stroke();
      // Outer energy ring pulse
      ctx.strokeStyle = '#69F0AE';
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.2;
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.95, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.globalAlpha = 1;

    } else if (p.type === 'megabeam') {
      const r = p.r;
      // Beam column (behind ship)
      const beamGrad = ctx.createLinearGradient(-r*0.15, 0, r*0.15, 0);
      beamGrad.addColorStop(0,    'transparent');
      beamGrad.addColorStop(0.2,  'rgba(255,23,68,0.25)');
      beamGrad.addColorStop(0.35, 'rgba(255,23,68,0.50)');
      beamGrad.addColorStop(0.5,  'rgba(255,23,68,0.80)');
      beamGrad.addColorStop(0.65, 'rgba(255,23,68,0.50)');
      beamGrad.addColorStop(0.8,  'rgba(255,23,68,0.25)');
      beamGrad.addColorStop(1,    'transparent');
      ctx.fillStyle = beamGrad;
      ctx.fillRect(-r*0.4, -r*0.85, r*0.8, r*0.7);
      // Beam core — bright white center
      const coreGrad = ctx.createLinearGradient(-r*0.05, 0, r*0.05, 0);
      coreGrad.addColorStop(0,   'transparent');
      coreGrad.addColorStop(0.3, 'rgba(255,255,255,0.50)');
      coreGrad.addColorStop(0.5, 'rgba(255,255,255,0.80)');
      coreGrad.addColorStop(0.7, 'rgba(255,255,255,0.50)');
      coreGrad.addColorStop(1,   'transparent');
      ctx.fillStyle = coreGrad;
      ctx.fillRect(-r*0.12, -r*0.85, r*0.24, r*0.7);
      // Radiating rings from beam origin
      ctx.strokeStyle = '#FF1744';
      ctx.lineWidth = 1;
      for (let i = 0; i < 3; i++) {
        const ringR = r * (0.3 + i * 0.12);
        ctx.globalAlpha = 0.3 - i * 0.08;
        ctx.beginPath();
        ctx.arc(0, r*0.15, ringR, Math.PI * 1.1, Math.PI * 1.9);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      // Mini ship silhouette (center-bottom)
      const ss = r * 0.35;
      const sy = r * 0.2;
      const shipGrad = ctx.createLinearGradient(-ss, sy, ss, sy);
      shipGrad.addColorStop(0,   '#FF8A80');
      shipGrad.addColorStop(0.5, '#FFFFFF');
      shipGrad.addColorStop(1,   '#FF8A80');
      ctx.fillStyle = shipGrad;
      ctx.beginPath();
      ctx.moveTo(0,         sy - ss * 1.2);
      ctx.lineTo(ss * 0.6,  sy + ss * 0.4);
      ctx.lineTo(0,         sy + ss * 0.2);
      ctx.lineTo(-ss * 0.6, sy + ss * 0.4);
      ctx.closePath();
      ctx.fill();
      // Wings
      ctx.fillStyle = '#FF1744';
      ctx.beginPath();
      ctx.moveTo(-ss * 0.4,  sy - ss * 0.1);
      ctx.lineTo(-ss * 1.0,  sy + ss * 0.5);
      ctx.lineTo(-ss * 0.3,  sy + ss * 0.3);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(ss * 0.4,  sy - ss * 0.1);
      ctx.lineTo(ss * 1.0,  sy + ss * 0.5);
      ctx.lineTo(ss * 0.3,  sy + ss * 0.3);
      ctx.closePath();
      ctx.fill();
      // Size-up arrows flanking ship
      ctx.strokeStyle = '#FF8A80';
      ctx.lineWidth = 1.5;
      ctx.lineCap = 'round';
      ctx.globalAlpha = 0.6;
      ctx.beginPath();
      ctx.moveTo(-r*0.55, sy - r*0.1); ctx.lineTo(-r*0.7, sy); ctx.lineTo(-r*0.55, sy + r*0.1);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(r*0.55, sy - r*0.1); ctx.lineTo(r*0.7, sy); ctx.lineTo(r*0.55, sy + r*0.1);
      ctx.stroke();
      ctx.globalAlpha = 1;

    } else if (p.type === 'phase') {
      const r = p.r;
      const ss = r * 0.4;
      const sy = -r * 0.05;
      // Ship shadow/echo (offset, very faint)
      ctx.globalAlpha = 0.12;
      ctx.fillStyle = '#FFD740';
      ctx.beginPath();
      ctx.moveTo(3,             sy - ss * 1.3);
      ctx.lineTo(3 + ss * 0.7, sy + ss * 0.5);
      ctx.lineTo(3,             sy + ss * 0.3);
      ctx.lineTo(3 - ss * 0.7, sy + ss * 0.5);
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 1;
      // Main ghost ship
      const ghostGrad = ctx.createLinearGradient(0, sy - ss*1.3, 0, sy + ss*0.5);
      ghostGrad.addColorStop(0,   '#FFFDE7');
      ghostGrad.addColorStop(0.4, '#FFD740');
      ghostGrad.addColorStop(1,   '#FFA000');
      ctx.globalAlpha = 0.55;
      ctx.fillStyle = ghostGrad;
      ctx.beginPath();
      ctx.moveTo(0,        sy - ss * 1.3);
      ctx.lineTo(ss * 0.7, sy + ss * 0.5);
      ctx.lineTo(0,        sy + ss * 0.3);
      ctx.lineTo(-ss * 0.7, sy + ss * 0.5);
      ctx.closePath();
      ctx.fill();
      // Wings
      ctx.beginPath();
      ctx.moveTo(-ss * 0.5,  sy);
      ctx.lineTo(-ss * 1.2,  sy + ss * 0.6);
      ctx.lineTo(-ss * 0.4,  sy + ss * 0.4);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(ss * 0.5, sy);
      ctx.lineTo(ss * 1.2, sy + ss * 0.6);
      ctx.lineTo(ss * 0.4, sy + ss * 0.4);
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 1;
      // Holographic scan lines
      ctx.strokeStyle = '#FFD740';
      ctx.lineWidth = 0.5;
      for (let i = 0; i < 8; i++) {
        const ly = sy - ss * 1.2 + i * (ss * 2.2 / 8);
        ctx.globalAlpha = 0.15 + (i % 2) * 0.1;
        ctx.beginPath();
        ctx.moveTo(-r * 0.5, ly); ctx.lineTo(r * 0.5, ly);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      // Glitch bars
      ctx.fillStyle = '#FFD740';
      ctx.globalAlpha = 0.25;
      ctx.fillRect(-r*0.4, sy - ss*0.3, r*0.3, 2);
      ctx.fillRect(r*0.1,  sy + ss*0.1, r*0.35, 2);
      ctx.globalAlpha = 1;
      // Corner sparkle diamonds
      ctx.fillStyle = '#FFFDE7';
      ctx.globalAlpha = 0.6;
      [[- r*0.55, -r*0.55],[r*0.55,-r*0.45],[-r*0.5,r*0.5],[r*0.45,r*0.55]].forEach(([dx, dy]) => {
        const ds = 2;
        ctx.beginPath();
        ctx.moveTo(dx, dy - ds); ctx.lineTo(dx + ds*0.6, dy);
        ctx.lineTo(dx, dy + ds); ctx.lineTo(dx - ds*0.6, dy);
        ctx.closePath();
        ctx.fill();
      });
      ctx.globalAlpha = 1;
    }`;

if (!raw.includes(ICONS_OLD)) { console.error('ERROR: icons section anchor not found!'); process.exit(1); }
raw = raw.replace(ICONS_OLD, ICONS_NEW);
console.log('✓ Patch 1: All 4 icon sections replaced with mockup code');

// ============================================================
// PATCH 2: MEGABEAM_SCALE 1.5 → 2.0
// ============================================================
const SCALE_OLD = `const MEGABEAM_SCALE = 1.5;`;
const SCALE_NEW = `const MEGABEAM_SCALE = 2.0;`;
if (!raw.includes(SCALE_OLD)) { console.error('ERROR: MEGABEAM_SCALE anchor not found'); process.exit(1); }
raw = raw.replace(SCALE_OLD, SCALE_NEW);
console.log('✓ Patch 2: MEGABEAM_SCALE 1.5 → 2.0');

// ============================================================
// PATCH 3: Ship speed 6 → 4.5
// ============================================================
const SPEED_OLD = `ship = { x: W / 2, y: H * 0.8, w: SHIP_WIDTH * scale, h: SHIP_HEIGHT * scale, speed: 6 };`;
const SPEED_NEW = `ship = { x: W / 2, y: H * 0.8, w: SHIP_WIDTH * scale, h: SHIP_HEIGHT * scale, speed: 4.5 };`;
if (!raw.includes(SPEED_OLD)) { console.error('ERROR: ship speed anchor not found'); process.exit(1); }
raw = raw.replace(SPEED_OLD, SPEED_NEW);
console.log('✓ Patch 3: ship.speed 6 → 4.5 (~25% reduction)');

// ============================================================
// Syntax check
// ============================================================
const scriptStart = raw.indexOf('<script>');
const scriptEnd   = raw.lastIndexOf('</script>');
try {
  new (require('vm').Script)(raw.substring(scriptStart + 8, scriptEnd));
  console.log('✓ Script syntax OK');
} catch(e) {
  console.error('SCRIPT ERROR:', e.message);
  process.exit(1);
}

// ============================================================
// Verify
// ============================================================
if (!raw.includes('MEGABEAM_SCALE = 2.0')) { console.error('VERIFY FAIL: MEGABEAM_SCALE not 2.0'); process.exit(1); }
if (!raw.includes('speed: 4.5'))            { console.error('VERIFY FAIL: ship speed not 4.5');      process.exit(1); }
if (!raw.includes('B9F6CA'))                { console.error('VERIFY FAIL: shield gradient missing');  process.exit(1); }
if (!raw.includes('FFFDE7'))                { console.error('VERIFY FAIL: phase gradient missing');   process.exit(1); }
if (!raw.includes('80DEEA'))                { console.error('VERIFY FAIL: plasma gradient missing');  process.exit(1); }
console.log('✓ All verifications passed');

// ============================================================
// Write
// ============================================================
if (hadCRLF) raw = raw.replace(/\n/g, '\r\n');
fs.writeFileSync(GAME_FILE, raw, 'utf8');
console.log('\n✅ Power-up icons + Mega Beam scale + ship speed patched!');
console.log('New file size:', fs.statSync(GAME_FILE).size, 'bytes');
