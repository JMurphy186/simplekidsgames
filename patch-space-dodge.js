// patch-space-dodge.js — Visual overhaul patch for games/space-dodge/index.html
// Tasks 1, 2, 3 in one script.

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'games/space-dodge/index.html');
let html = fs.readFileSync(filePath, 'utf8');

// ============================================================
// TASK 1 — Replace generateWorldDecor (nebula/asteroid/ice sections)
// ============================================================

const oldGenerateWorldDecor = `function generateWorldDecor() {
  worldDecor = [];
  const idx = getWorldIdx();

  if (idx === 0) {
    // Deep Space — distant galaxies
    for (let i = 0; i < 3; i++) {
      worldDecor.push({ type: 'galaxy', x: Math.random(), y: 0.15 + Math.random() * 0.5, rx: 30 + Math.random() * 40, ry: 8 + Math.random() * 12, rot: Math.random() * Math.PI, alpha: 0.04 + Math.random() * 0.06 });
    }
  } else if (idx === 1) {
    // Nebula — gas clouds
    for (let i = 0; i < 5; i++) {
      worldDecor.push({ type: 'cloud', x: Math.random(), y: Math.random(), rx: 80 + Math.random() * 120, ry: 40 + Math.random() * 60, color: Math.random() > 0.5 ? '#CE93D8' : '#F48FB1', alpha: 0.06 + Math.random() * 0.08, drift: (Math.random() - 0.5) * 0.15 });
    }
  } else if (idx === 2) {
    // Asteroid Belt — background rocks + dust
    for (let i = 0; i < 14; i++) {
      worldDecor.push({ type: 'bgrock', x: Math.random(), y: Math.random(), r: 6 + Math.random() * 20, alpha: 0.08 + Math.random() * 0.12, rot: Math.random() * Math.PI * 2, verts: 5 + Math.floor(Math.random() * 4) });
    }
    for (let i = 0; i < 30; i++) {
      worldDecor.push({ type: 'dust', x: Math.random(), y: Math.random(), r: 1 + Math.random() * 2, alpha: 0.1 + Math.random() * 0.15 });
    }
  } else if (idx === 3) {
    // Ice Field — crystal shards + aurora bands
    for (let i = 0; i < 10; i++) {
      worldDecor.push({ type: 'crystal', x: Math.random(), y: Math.random(), h: 15 + Math.random() * 35, w: 3 + Math.random() * 8, rot: -0.3 + Math.random() * 0.6, alpha: 0.06 + Math.random() * 0.1 });
    }
    for (let i = 0; i < 3; i++) {
      worldDecor.push({ type: 'aurora', y: 0.1 + Math.random() * 0.6, amplitude: 15 + Math.random() * 25, freq: 0.003 + Math.random() * 0.004, alpha: 0.06 + Math.random() * 0.06, color: Math.random() > 0.5 ? '#4FC3F7' : '#80DEEA', phase: Math.random() * Math.PI * 2 });
    }
  } else if (idx === 4) {
    // Supernova — shockwave rings are animated (no pre-gen needed), embers pre-gen
    for (let i = 0; i < 40; i++) {
      worldDecor.push({ type: 'ember', x: Math.random(), y: Math.random(), r: 1.5 + Math.random() * 3, speed: 0.2 + Math.random() * 0.6, color: Math.random() > 0.5 ? '#FF5722' : '#FFC107', alpha: 0.2 + Math.random() * 0.5 });
    }
  }
}`;

const newGenerateWorldDecor = `function generateWorldDecor() {
  worldDecor = [];
  const idx = getWorldIdx();

  if (idx === 0) {
    // Deep Space — distant galaxies
    for (let i = 0; i < 3; i++) {
      worldDecor.push({ type: 'galaxy', x: Math.random(), y: 0.15 + Math.random() * 0.5, rx: 30 + Math.random() * 40, ry: 8 + Math.random() * 12, rot: Math.random() * Math.PI, alpha: 0.04 + Math.random() * 0.06 });
    }
  } else if (idx === 1) {
    // Nebula — Pillars of Creation style
    const staggerX = [0.15, 0.50, 0.80];
    const speeds = [0.2, 0.35, 0.5];
    const pillarColors = [
      ['#6a1a8a', '#b06aff', '#2a0e4a'],
      ['#8a1060', '#ff80cc', '#3a0830'],
      ['#1a2a8a', '#80aaff', '#0a1040'],
    ];
    worldDecor.push({ type: 'nebula_data', pillars: staggerX.map((xf, i) => ({
      x: xf,
      topY: -(Math.random() * H),
      botY: H * (0.4 + Math.random() * 0.6),
      width: 60 + Math.random() * 80,
      colors: pillarColors[i],
      speed: speeds[i],
      phase: Math.random() * Math.PI * 2
    })),
    tendrils: [0,1,2].map(() => ({
      x0: Math.random() * W, y0: Math.random() * H * 0.5,
      cx: Math.random() * W, cy: Math.random() * H,
      x1: Math.random() * W, y1: H * (0.5 + Math.random() * 0.5),
      color: Math.random() > 0.5 ? '#b060ff' : '#ff80cc',
      phase: Math.random() * Math.PI * 2
    })),
    brightStars: [0,1,2,3,4].map(() => ({
      x: Math.random() * W, y: Math.random() * H,
      r: 1.5 + Math.random() * 2,
      color: ['#ffe0ff','#c0a0ff','#ffc0e0','#80c0ff','#ffffff'][Math.floor(Math.random()*5)],
      phase: Math.random() * Math.PI * 2
    })),
    cluster: { x: (0.2 + Math.random() * 0.6) * W, y: (0.1 + Math.random() * 0.4) * H }
    });
  } else if (idx === 2) {
    // Asteroid Belt — Dense Debris Field
    const mkVerts = (n) => Array.from({length: n}, (_, i) => {
      const a = (i / n) * Math.PI * 2;
      const r = 0.65 + Math.random() * 0.35;
      return { a, r };
    });
    const far = [0,1,2].map(() => ({
      x: Math.random() * W, y: Math.random() * H,
      r: 35 + Math.random() * 15, alpha: 0.07 + Math.random() * 0.05,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.003,
      speed: 0.08 + Math.random() * 0.08, layer: 0,
      vertices: mkVerts(7 + Math.floor(Math.random() * 3)),
      craterX: (Math.random() - 0.5) * 20, craterY: (Math.random() - 0.5) * 20, craterR: 8 + Math.random() * 8
    }));
    const mid = [0,1,2,3,4].map(() => ({
      x: Math.random() * W, y: Math.random() * H,
      r: 18 + Math.random() * 10, alpha: 0.09 + Math.random() * 0.06,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.006,
      speed: 0.18 + Math.random() * 0.15, layer: 1,
      vertices: mkVerts(7 + Math.floor(Math.random() * 3)),
      craterX: (Math.random() - 0.5) * 10, craterY: (Math.random() - 0.5) * 10, craterR: 4 + Math.random() * 5
    }));
    const near = Array.from({length: 12}, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: 4 + Math.random() * 6, alpha: 0.12 + Math.random() * 0.08,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.012,
      speed: 0.4 + Math.random() * 0.4, layer: 2,
      vertices: mkVerts(7 + Math.floor(Math.random() * 3)),
      craterX: 0, craterY: 0, craterR: 0
    }));
    const dustParticles = Array.from({length: 55}, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: 0.8 + Math.random() * 1.8,
      alpha: 0.08 + Math.random() * 0.10,
      speed: 0.25 + Math.random() * 0.4,
      color: Math.random() > 0.5 ? '#8D6E63' : '#a08060'
    }));
    const gasBands = [0,1,2,3].map(() => ({
      y: Math.random() * H, w: W * (0.4 + Math.random() * 0.6),
      alpha: 0.04 + Math.random() * 0.06, speed: 0.05 + Math.random() * 0.10
    }));
    const warmStars = [0,1,2].map(() => ({
      x: Math.random() * W, y: Math.random() * H * 0.5,
      r: 2 + Math.random() * 1.5, phase: Math.random() * Math.PI * 2
    }));
    worldDecor.push({ type: 'asteroid_data', rocks: [...far, ...mid, ...near], dustParticles, gasBands, warmStars, bandX: 0 });
  } else if (idx === 3) {
    // Ice Field — Frozen Expanse
    const edgePositions = [
      // left edge crystals
      {x: W*0.04, y: H*0.55}, {x: W*0.07, y: H*0.70}, {x: W*0.03, y: H*0.40},
      {x: W*0.10, y: H*0.85},
      // right edge crystals
      {x: W*0.93, y: H*0.50}, {x: W*0.96, y: H*0.65}, {x: W*0.90, y: H*0.78},
      {x: W*0.88, y: H*0.35}
    ];
    const largeCrystals = [0,1,2,3].map(i => ({
      x: edgePositions[i].x, y: edgePositions[i].y,
      h: 55 + Math.random() * 35, w: 14 + Math.random() * 10,
      rot: (i < 4 ? -0.1 : 0.1) + (Math.random() - 0.5) * 0.25,
      alpha: 0.10 + Math.random() * 0.08, hasHighlight: true, shimmerTimer: Math.floor(Math.random() * 180)
    }));
    const medCrystals = [0,1,2].map(i => ({
      x: edgePositions[i+4].x, y: edgePositions[i+4].y,
      h: 35 + Math.random() * 15, w: 10 + Math.random() * 6,
      rot: (Math.random() - 0.5) * 0.3,
      alpha: 0.09 + Math.random() * 0.07, hasHighlight: true, shimmerTimer: Math.floor(Math.random() * 180)
    }));
    const smallPositions = Array.from({length: 8}, () => {
      const edge = Math.random() > 0.5;
      return { x: edge ? Math.random() * W * 0.15 : W * 0.85 + Math.random() * W * 0.15, y: Math.random() * H };
    });
    const smallCrystals = smallPositions.map(p => ({
      x: p.x, y: p.y,
      h: 12 + Math.random() * 8, w: 4 + Math.random() * 4,
      rot: (Math.random() - 0.5) * 0.5,
      alpha: 0.07 + Math.random() * 0.06, hasHighlight: false, shimmerTimer: 0
    }));
    const auroraDefs = [
      { baseY: H * 0.18, amplitude: 28, freq: 0.006, phase: 0, colorCore: '#4FC3F7', colorGlow: '#1a6080' },
      { baseY: H * 0.32, amplitude: 18, freq: 0.009, phase: Math.PI * 0.6, colorCore: '#80DEEA', colorGlow: '#205060' },
      { baseY: H * 0.46, amplitude: 22, freq: 0.007, phase: Math.PI * 1.2, colorCore: '#69F0AE', colorGlow: '#1a5030' },
    ];
    const sparkles = Array.from({length: 14}, () => ({
      x: Math.random() * W, y: Math.random() * H,
      size: 1.5 + Math.random() * 2.5, phase: Math.random() * Math.PI * 2
    }));
    const moon = {
      x: W * 0.22, y: H * 0.12, r: 40,
      craters: [
        {x: -12, y: -8, r: 8}, {x: 10, y: 5, r: 6}, {x: -5, y: 15, r: 5}
      ]
    };
    worldDecor.push({ type: 'ice_data', crystals: [...largeCrystals, ...medCrystals, ...smallCrystals], auroraParams: auroraDefs, fogParams: {baseY: H*0.75}, sparkles, moon });
  } else if (idx === 4) {
    // Supernova — shockwave rings are animated (no pre-gen needed), embers pre-gen
    for (let i = 0; i < 40; i++) {
      worldDecor.push({ type: 'ember', x: Math.random(), y: Math.random(), r: 1.5 + Math.random() * 3, speed: 0.2 + Math.random() * 0.6, color: Math.random() > 0.5 ? '#FF5722' : '#FFC107', alpha: 0.2 + Math.random() * 0.5 });
    }
  }
}`;

if (!html.includes(oldGenerateWorldDecor)) {
  console.error('ERROR: Could not find generateWorldDecor to replace');
  process.exit(1);
}
html = html.replace(oldGenerateWorldDecor, newGenerateWorldDecor);
console.log('generateWorldDecor replaced OK');

// ============================================================
// Replace drawWorldGradient to use richer gradient stops
// ============================================================

const oldGradientFn = `function drawWorldGradient(idx) {
  const gradients = [
    ['#050510', '#0B0B1A', '#121225'],           // Deep Space
    ['#120820', '#1a0a2e', '#220e3a'],            // Nebula
    ['#1a1008', '#201510', '#2a1a0a'],            // Asteroid Belt
    ['#061520', '#0a1a2e', '#0c2035'],            // Ice Field
    ['#200808', '#2e0a0a', '#3a0c0c'],            // Supernova
  ];
  const stops = gradients[idx];
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, stops[0]);
  grad.addColorStop(0.5, stops[1]);
  grad.addColorStop(1, stops[2]);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);
}`;

const newGradientFn = `function drawWorldGradient(idx) {
  const gradients = [
    ['#050510', '#0B0B1A', '#121225', '#0B0B1A'],  // Deep Space
    ['#0a0520', '#1a0a3e', '#2a0e4a', '#1a0830'],  // Nebula — Pillars of Creation
    ['#0f0a04', '#1a1008', '#251810', '#1a1008'],  // Asteroid Belt — Dense Debris
    ['#040e18', '#081828', '#0a1e35', '#061520'],  // Ice Field — Frozen Expanse
    ['#200808', '#2e0a0a', '#3a0c0c', '#2e0a0a'],  // Supernova
  ];
  const stops = gradients[idx];
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0,    stops[0]);
  grad.addColorStop(0.33, stops[1]);
  grad.addColorStop(0.66, stops[2]);
  grad.addColorStop(1,    stops[3]);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);
}`;

if (!html.includes(oldGradientFn)) {
  console.error('ERROR: Could not find drawWorldGradient to replace');
  process.exit(1);
}
html = html.replace(oldGradientFn, newGradientFn);
console.log('drawWorldGradient replaced OK');

// ============================================================
// Replace drawNebulaDecor
// ============================================================

const oldNebulaDecor = `function drawNebulaDecor() {
  const t = frameCount * 0.01;
  for (const d of worldDecor) {
    if (d.type !== 'cloud') continue;
    ctx.save();
    const xOff = Math.sin(t + d.drift * 10) * 30;
    ctx.globalAlpha = d.alpha;
    const grad = ctx.createRadialGradient(d.x * W + xOff, d.y * H, 0, d.x * W + xOff, d.y * H, d.rx * scale);
    grad.addColorStop(0, d.color);
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(d.x * W + xOff, d.y * H, d.rx * scale, d.ry * scale, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.restore();
  }
}`;

const newNebulaDecor = `function drawNebulaDecor() {
  const nd = worldDecor.find(d => d.type === 'nebula_data');
  if (!nd) return;
  const fc = frameCount;

  // 1. Background glow patches
  const glowCenters = [{x:W*0.15,y:H*0.3,c:'#8030c0'},{x:W*0.55,y:H*0.6,c:'#c03080'},{x:W*0.82,y:H*0.25,c:'#3040c0'}];
  for (const g of glowCenters) {
    const gr = ctx.createRadialGradient(g.x, g.y, 0, g.x, g.y, H * 0.55);
    gr.addColorStop(0, g.c + '1e');
    gr.addColorStop(1, 'transparent');
    ctx.fillStyle = gr;
    ctx.fillRect(0, 0, W, H);
  }

  // 2. Gas pillars
  for (let i = 0; i < nd.pillars.length; i++) {
    const p = nd.pillars[i];
    // drift downward, reset when off screen
    p.topY += p.speed;
    p.botY += p.speed;
    if (p.topY > H + 50) { p.topY = -H - 50; p.botY = -50; }
    const sway = Math.sin(fc * 0.008 + p.phase) * 18;
    const px = p.x * W + sway;
    const pw = p.width * scale;
    const opacity = 0.10 + Math.sin(fc * 0.012 + p.phase) * 0.04;
    ctx.save();
    ctx.globalAlpha = opacity;
    const pg = ctx.createLinearGradient(px - pw/2, 0, px + pw/2, 0);
    pg.addColorStop(0, 'transparent');
    pg.addColorStop(0.3, p.colors[0]);
    pg.addColorStop(0.5, p.colors[1]);
    pg.addColorStop(0.7, p.colors[0]);
    pg.addColorStop(1, 'transparent');
    ctx.fillStyle = pg;
    ctx.beginPath();
    ctx.rect(px - pw/2, p.topY, pw, p.botY - p.topY);
    ctx.fill();
    ctx.restore();
  }

  // 3. Tendrils (curved gas filaments)
  for (const td of nd.tendrils) {
    const pulse = Math.sin(fc * 0.015 + td.phase) * 0.025;
    // Glow stroke
    ctx.save();
    ctx.globalAlpha = 0.03 + pulse * 0.5;
    ctx.strokeStyle = td.color;
    ctx.lineWidth = 28 * scale;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(td.x0, td.y0);
    ctx.quadraticCurveTo(td.cx, td.cy, td.x1, td.y1);
    ctx.stroke();
    // Core stroke
    ctx.globalAlpha = 0.07 + pulse;
    ctx.lineWidth = 10 * scale;
    ctx.stroke();
    ctx.restore();
  }

  // 4. Bright stars with glow halos
  for (const bs of nd.brightStars) {
    const glow = bs.r * (3 + Math.sin(fc * 0.04 + bs.phase) * 1.5);
    const sg = ctx.createRadialGradient(bs.x, bs.y, 0, bs.x, bs.y, glow);
    sg.addColorStop(0, bs.color);
    sg.addColorStop(0.3, bs.color + '80');
    sg.addColorStop(1, 'transparent');
    ctx.save();
    ctx.globalAlpha = 0.55 + Math.sin(fc * 0.04 + bs.phase) * 0.2;
    ctx.fillStyle = sg;
    ctx.beginPath();
    ctx.arc(bs.x, bs.y, glow, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.fillStyle = bs.color;
    ctx.beginPath();
    ctx.arc(bs.x, bs.y, bs.r * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // 5. Star cluster
  const cl = nd.cluster;
  ctx.save();
  for (let i = 0; i < 18; i++) {
    const ang = (i / 18) * Math.PI * 2 + fc * 0.001;
    const dist = 4 + (i % 5) * 6;
    const sx = cl.x + Math.cos(ang) * dist;
    const sy = cl.y + Math.sin(ang) * dist * 0.5;
    ctx.globalAlpha = 0.3 + (i % 3) * 0.12;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(sx, sy, 0.8 + (i % 3) * 0.5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}`;

if (!html.includes(oldNebulaDecor)) {
  console.error('ERROR: Could not find drawNebulaDecor to replace');
  process.exit(1);
}
html = html.replace(oldNebulaDecor, newNebulaDecor);
console.log('drawNebulaDecor replaced OK');

// ============================================================
// Replace drawAsteroidBeltDecor
// ============================================================

const oldAsteroidDecor = `function drawAsteroidBeltDecor() {
  for (const d of worldDecor) {
    if (d.type === 'bgrock') {
      ctx.save();
      ctx.translate(d.x * W, d.y * H);
      ctx.rotate(d.rot);
      ctx.globalAlpha = d.alpha;
      ctx.fillStyle = '#5D4037';
      ctx.beginPath();
      for (let i = 0; i < d.verts; i++) {
        const a = (i / d.verts) * Math.PI * 2;
        const r = d.r * scale * (0.7 + Math.sin(a * 3) * 0.3);
        const method = i === 0 ? 'moveTo' : 'lineTo';
        ctx[method](Math.cos(a) * r, Math.sin(a) * r);
      }
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.restore();
    } else if (d.type === 'dust') {
      ctx.globalAlpha = d.alpha;
      ctx.fillStyle = '#8D6E63';
      ctx.beginPath();
      ctx.arc(d.x * W, d.y * H, d.r * scale, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }
}`;

const newAsteroidDecor = `function drawAsteroidBeltDecor() {
  const ad = worldDecor.find(d => d.type === 'asteroid_data');
  if (!ad) return;

  // 1. Gas giant (bottom-right, partial circle)
  const giantX = W * 0.88, giantY = H * 1.05, giantR = H * 0.52;
  ctx.save();
  ctx.beginPath();
  ctx.arc(giantX, giantY, giantR, 0, Math.PI * 2);
  ctx.clip();
  const gg = ctx.createRadialGradient(giantX - giantR*0.25, giantY - giantR*0.3, giantR*0.1, giantX, giantY, giantR);
  gg.addColorStop(0, '#b87820');
  gg.addColorStop(0.45, '#8a5010');
  gg.addColorStop(0.7, '#6a3808');
  gg.addColorStop(1, '#3a1a04');
  ctx.fillStyle = gg;
  ctx.fillRect(giantX - giantR, giantY - giantR, giantR * 2, giantR * 2);
  // atmosphere bands scrolling
  ad.bandX = (ad.bandX - 0.15 + W) % W;
  const bandColors = ['rgba(200,150,60,0.06)','rgba(160,100,40,0.05)','rgba(220,180,80,0.06)','rgba(140,80,30,0.05)'];
  for (let bi = 0; bi < 4; bi++) {
    const bandY = giantY - giantR * 0.5 + bi * giantR * 0.22;
    ctx.fillStyle = bandColors[bi];
    ctx.fillRect(giantX - giantR + ad.bandX - W, bandY, W * 2, giantR * 0.12);
    ctx.fillRect(giantX - giantR + ad.bandX, bandY, W * 2, giantR * 0.12);
  }
  ctx.restore();
  // atmospheric glow ring
  const gRing = ctx.createRadialGradient(giantX, giantY, giantR * 0.92, giantX, giantY, giantR * 1.12);
  gRing.addColorStop(0, 'rgba(200,140,60,0.10)');
  gRing.addColorStop(1, 'transparent');
  ctx.fillStyle = gRing;
  ctx.beginPath();
  ctx.arc(giantX, giantY, giantR * 1.12, 0, Math.PI * 2);
  ctx.fill();

  // 2. Dust haze bands
  for (const b of ad.gasBands) {
    b.y += b.speed;
    if (b.y > H + 20) b.y = -20;
    ctx.globalAlpha = b.alpha;
    ctx.fillStyle = '#8D6E63';
    ctx.fillRect(W * 0.5 - b.w / 2, b.y, b.w, 18 * scale);
    ctx.globalAlpha = 1;
  }

  // 3. Draw rocks (far, then mid, then near by layer)
  for (let layer = 0; layer <= 2; layer++) {
    for (const rock of ad.rocks) {
      if (rock.layer !== layer) continue;
      rock.y += rock.speed;
      rock.rotation += rock.rotSpeed;
      if (rock.y > H + rock.r + 10) {
        rock.y = -(rock.r + 10);
        rock.x = Math.random() * W;
      }
      ctx.save();
      ctx.translate(rock.x, rock.y);
      ctx.rotate(rock.rotation);
      ctx.globalAlpha = rock.alpha;
      // Irregular polygon
      const rs = rock.r * scale;
      ctx.beginPath();
      for (let vi = 0; vi < rock.vertices.length; vi++) {
        const v = rock.vertices[vi];
        const vx = Math.cos(v.a) * rs * v.r;
        const vy = Math.sin(v.a) * rs * v.r;
        if (vi === 0) ctx.moveTo(vx, vy); else ctx.lineTo(vx, vy);
      }
      ctx.closePath();
      // Radial gradient fill — lit top-left side
      const rg = ctx.createRadialGradient(-rs*0.3, -rs*0.3, 0, 0, 0, rs);
      rg.addColorStop(0, '#a08060');
      rg.addColorStop(0.5, '#6a4828');
      rg.addColorStop(1, '#2a1808');
      ctx.fillStyle = rg;
      ctx.fill();
      // Highlight arc
      ctx.globalAlpha = rock.alpha * 0.5;
      ctx.strokeStyle = 'rgba(220,190,140,0.35)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(-rs * 0.25, -rs * 0.25, rs * 0.45, -Math.PI * 0.8, 0.1);
      ctx.stroke();
      // Small crater (only for far/mid)
      if (rock.craterR > 0) {
        const crg = ctx.createRadialGradient(rock.craterX, rock.craterY, 0, rock.craterX, rock.craterY, rock.craterR * scale);
        crg.addColorStop(0, 'rgba(20,10,5,0.6)');
        crg.addColorStop(1, 'rgba(60,35,15,0.1)');
        ctx.globalAlpha = rock.alpha * 0.8;
        ctx.fillStyle = crg;
        ctx.beginPath();
        ctx.arc(rock.craterX, rock.craterY, rock.craterR * scale, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  // 4. Dust particles drift down
  for (const dp of ad.dustParticles) {
    dp.y += dp.speed;
    if (dp.y > H + 5) { dp.y = -5; dp.x = Math.random() * W; }
    ctx.globalAlpha = dp.alpha;
    ctx.fillStyle = dp.color;
    ctx.beginPath();
    ctx.arc(dp.x, dp.y, dp.r * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  // 5. Warm bright stars with orange halos
  for (const ws of ad.warmStars) {
    const glow = (8 + Math.sin(frameCount * 0.05 + ws.phase) * 4) * scale;
    const wg = ctx.createRadialGradient(ws.x, ws.y, 0, ws.x, ws.y, glow);
    wg.addColorStop(0, '#ffcc80');
    wg.addColorStop(0.4, 'rgba(255,160,60,0.3)');
    wg.addColorStop(1, 'transparent');
    ctx.save();
    ctx.globalAlpha = 0.6 + Math.sin(frameCount * 0.05 + ws.phase) * 0.2;
    ctx.fillStyle = wg;
    ctx.beginPath();
    ctx.arc(ws.x, ws.y, glow, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#fff8e0';
    ctx.beginPath();
    ctx.arc(ws.x, ws.y, ws.r * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}`;

if (!html.includes(oldAsteroidDecor)) {
  console.error('ERROR: Could not find drawAsteroidBeltDecor to replace');
  process.exit(1);
}
html = html.replace(oldAsteroidDecor, newAsteroidDecor);
console.log('drawAsteroidBeltDecor replaced OK');

// ============================================================
// Replace drawIceFieldDecor
// ============================================================

const oldIceDecor = `function drawIceFieldDecor() {
  const t = frameCount * 0.02;

  // Crystal shards
  for (const d of worldDecor) {
    if (d.type === 'crystal') {
      ctx.save();
      ctx.translate(d.x * W, d.y * H);
      ctx.rotate(d.rot);
      ctx.globalAlpha = d.alpha;
      ctx.fillStyle = '#B3E5FC';
      ctx.beginPath();
      ctx.moveTo(0, -d.h * scale / 2);
      ctx.lineTo(d.w * scale / 2, d.h * scale / 2);
      ctx.lineTo(-d.w * scale / 2, d.h * scale / 2);
      ctx.closePath();
      ctx.fill();
      // Shine line
      ctx.strokeStyle = 'rgba(255,255,255,0.3)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, -d.h * scale / 2);
      ctx.lineTo(d.w * scale * 0.15, d.h * scale * 0.2);
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.restore();
    }
  }

  // Aurora bands
  for (const d of worldDecor) {
    if (d.type !== 'aurora') continue;
    ctx.save();
    ctx.globalAlpha = d.alpha + Math.sin(t + d.phase) * 0.02;
    ctx.strokeStyle = d.color;
    ctx.lineWidth = 8 * scale;
    ctx.lineCap = 'round';
    ctx.beginPath();
    for (let x = 0; x <= W; x += 10) {
      const y = d.y * H + Math.sin(x * d.freq + t + d.phase) * d.amplitude * scale;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.restore();
  }
}`;

const newIceDecor = `function drawIceFieldDecor() {
  const id = worldDecor.find(d => d.type === 'ice_data');
  if (!id) return;
  const fc = frameCount;

  // 1. Frozen moon (upper-left)
  const mn = id.moon;
  const moonGlow = ctx.createRadialGradient(mn.x, mn.y, 0, mn.x, mn.y, mn.r * 1.6 * scale);
  moonGlow.addColorStop(0, 'rgba(200,230,255,0.12)');
  moonGlow.addColorStop(1, 'transparent');
  ctx.fillStyle = moonGlow;
  ctx.beginPath();
  ctx.arc(mn.x, mn.y, mn.r * 1.6 * scale, 0, Math.PI * 2);
  ctx.fill();
  const moonBody = ctx.createRadialGradient(mn.x - mn.r*0.2*scale, mn.y - mn.r*0.2*scale, 0, mn.x, mn.y, mn.r*scale);
  moonBody.addColorStop(0, '#ddeeff');
  moonBody.addColorStop(0.6, '#b0c8e0');
  moonBody.addColorStop(1, '#7090b0');
  ctx.fillStyle = moonBody;
  ctx.beginPath();
  ctx.arc(mn.x, mn.y, mn.r * scale, 0, Math.PI * 2);
  ctx.fill();
  // Craters
  for (const cr of mn.craters) {
    const crg = ctx.createRadialGradient(mn.x+cr.x*scale, mn.y+cr.y*scale, 0, mn.x+cr.x*scale, mn.y+cr.y*scale, cr.r*scale);
    crg.addColorStop(0, 'rgba(40,60,90,0.55)');
    crg.addColorStop(1, 'rgba(80,110,150,0.08)');
    ctx.fillStyle = crg;
    ctx.beginPath();
    ctx.arc(mn.x+cr.x*scale, mn.y+cr.y*scale, cr.r*scale, 0, Math.PI*2);
    ctx.fill();
  }
  // Pulsing glow ring
  const moonRingA = 0.08 + Math.sin(fc * 0.01) * 0.03;
  ctx.save();
  ctx.globalAlpha = moonRingA;
  ctx.strokeStyle = '#a0c8f0';
  ctx.lineWidth = 4 * scale;
  ctx.beginPath();
  ctx.arc(mn.x, mn.y, mn.r * 1.15 * scale, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // 2. Aurora bands
  for (const au of id.auroraParams) {
    ctx.save();
    // Glow pass
    ctx.globalAlpha = 0.04 + Math.sin(fc * 0.015 + au.phase) * 0.015;
    ctx.strokeStyle = au.colorGlow;
    ctx.lineWidth = 40 * scale;
    ctx.lineCap = 'round';
    ctx.beginPath();
    for (let x = 0; x <= W; x += 8) {
      const y = au.baseY + Math.sin(x * au.freq + fc * 0.02 + au.phase) * au.amplitude
              + Math.sin(x * au.freq * 2.4 + au.phase * 0.5) * (au.amplitude * 0.4);
      if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
    // Core pass
    ctx.globalAlpha = 0.10 + Math.sin(fc * 0.015 + au.phase) * 0.03;
    ctx.strokeStyle = au.colorCore;
    ctx.lineWidth = 14 * scale;
    ctx.beginPath();
    for (let x = 0; x <= W; x += 8) {
      const y = au.baseY + Math.sin(x * au.freq + fc * 0.02 + au.phase) * au.amplitude
              + Math.sin(x * au.freq * 2.4 + au.phase * 0.5) * (au.amplitude * 0.4);
      if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
    // White highlight
    ctx.globalAlpha = 0.06;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();
  }

  // 3. Ice crystals (pentagonal elongated shapes)
  // Shimmer: occasionally flash one crystal
  if (id.crystals.length > 0) {
    const shIdx = Math.floor(fc / 60) % id.crystals.length;
    id.crystals[shIdx].shimmerTimer = Math.max(id.crystals[shIdx].shimmerTimer, 1);
  }
  for (const cr of id.crystals) {
    ctx.save();
    ctx.translate(cr.x, cr.y);
    ctx.rotate(cr.rot);
    const ch = cr.h * scale;
    const cw = cr.w * scale;
    const shimmer = cr.shimmerTimer > 0 ? 0.08 : 0;
    if (cr.shimmerTimer > 0) cr.shimmerTimer--;
    ctx.globalAlpha = cr.alpha + shimmer;
    // Gradient fill
    const cg = ctx.createLinearGradient(-cw/2, -ch/2, cw/2, ch/2);
    cg.addColorStop(0, '#e8f8ff');
    cg.addColorStop(0.4, '#90d8f8');
    cg.addColorStop(1, '#4890c0');
    ctx.fillStyle = cg;
    // Pentagonal elongated shape: sharp top, two angled sides, two bottom edges
    ctx.beginPath();
    ctx.moveTo(0, -ch/2);             // sharp top point
    ctx.lineTo(cw/2, -ch*0.1);       // upper right
    ctx.lineTo(cw*0.6, ch/2);        // lower right
    ctx.lineTo(-cw*0.6, ch/2);       // lower left
    ctx.lineTo(-cw/2, -ch*0.1);      // upper left
    ctx.closePath();
    ctx.fill();
    // Internal facet line
    if (cr.hasHighlight) {
      ctx.globalAlpha = cr.alpha * 0.6 + shimmer;
      ctx.strokeStyle = 'rgba(255,255,255,0.55)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, -ch/2);
      ctx.lineTo(cw * 0.12, ch * 0.25);
      ctx.stroke();
    }
    ctx.restore();
  }

  // 4. Ice fog at bottom
  const fogY = id.fogParams.baseY + Math.sin(fc * 0.005) * 10;
  const fg = ctx.createLinearGradient(0, fogY, 0, H);
  fg.addColorStop(0, 'transparent');
  fg.addColorStop(0.4, 'rgba(160,210,240,0.06)');
  fg.addColorStop(1, 'rgba(180,220,255,0.12)');
  ctx.fillStyle = fg;
  ctx.fillRect(0, fogY, W, H - fogY);

  // 5. Sparkles (4-pointed diamonds)
  for (const sp of id.sparkles) {
    const alpha = 0.3 + Math.sin(fc * 0.06 + sp.phase) * 0.3;
    if (alpha < 0.05) {
      sp.x = Math.random() * W;
      sp.y = Math.random() * H;
      sp.phase = Math.random() * Math.PI * 2;
      continue;
    }
    const ss = sp.size * scale;
    ctx.save();
    ctx.translate(sp.x, sp.y);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(0, -ss * 2);
    ctx.lineTo(ss * 0.4, 0);
    ctx.lineTo(0, ss * 2);
    ctx.lineTo(-ss * 0.4, 0);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-ss * 2, 0);
    ctx.lineTo(0, ss * 0.4);
    ctx.lineTo(ss * 2, 0);
    ctx.lineTo(0, -ss * 0.4);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}`;

if (!html.includes(oldIceDecor)) {
  console.error('ERROR: Could not find drawIceFieldDecor to replace');
  process.exit(1);
}
html = html.replace(oldIceDecor, newIceDecor);
console.log('drawIceFieldDecor replaced OK');

// ============================================================
// TASK 2 — Life Icons Match Active Ship
// ============================================================

// Replace drawMiniShip alive branch to use drawImage(shipImages[selectedShip], ...)
const oldDrawMiniShip = `function drawMiniShip(x, y, w, h, alive) {
  ctx.save();
  ctx.translate(x, y);

  const hw = w / 2;
  const hh = h / 2;

  if (alive) {
    // Animated thruster flame
    const flameH = 4 + Math.random() * 4;
    const flameW = w * 0.3;
    ctx.fillStyle = '#FF8F00';
    ctx.beginPath();
    ctx.moveTo(-flameW / 2, hh);
    ctx.quadraticCurveTo(0, hh + flameH, flameW / 2, hh);
    ctx.fill();
    ctx.fillStyle = '#FFD54F';
    ctx.beginPath();
    ctx.moveTo(-flameW / 4, hh);
    ctx.quadraticCurveTo(0, hh + flameH * 0.6, flameW / 4, hh);
    ctx.fill();

    // Body
    const grad = ctx.createLinearGradient(-hw, 0, hw, 0);
    grad.addColorStop(0, '#9E9E9E');
    grad.addColorStop(0.5, '#E0E0E0');
    grad.addColorStop(1, '#9E9E9E');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(0, -hh);
    ctx.bezierCurveTo(hw * 0.4, -hh, hw * 0.8, -hh * 0.3, hw * 0.7, hh * 0.6);
    ctx.lineTo(-hw * 0.7, hh * 0.6);
    ctx.bezierCurveTo(-hw * 0.8, -hh * 0.3, -hw * 0.4, -hh, 0, -hh);
    ctx.fill();

    // Blue panels
    ctx.fillStyle = '#2962FF';
    ctx.beginPath();
    ctx.moveTo(0, -hh * 0.7);
    ctx.lineTo(hw * 0.5, hh * 0.4);
    ctx.lineTo(0, hh * 0.5);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(0, -hh * 0.7);
    ctx.lineTo(-hw * 0.5, hh * 0.4);
    ctx.lineTo(0, hh * 0.5);
    ctx.fill();

    // Red nose
    ctx.fillStyle = '#FF5252';
    ctx.beginPath();
    ctx.moveTo(0, -hh);
    ctx.bezierCurveTo(hw * 0.2, -hh, hw * 0.3, -hh * 0.6, 0, -hh * 0.5);
    ctx.bezierCurveTo(-hw * 0.3, -hh * 0.6, -hw * 0.2, -hh, 0, -hh);
    ctx.fill();

    // Wings
    ctx.fillStyle = '#D32F2F';
    ctx.beginPath();
    ctx.moveTo(-hw * 0.6, hh * 0.2);
    ctx.lineTo(-hw, hh * 0.8);
    ctx.lineTo(-hw * 0.4, hh * 0.6);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(hw * 0.6, hh * 0.2);
    ctx.lineTo(hw, hh * 0.8);
    ctx.lineTo(hw * 0.4, hh * 0.6);
    ctx.fill();

    // Cockpit
    ctx.fillStyle = '#81D4FA';
    ctx.beginPath();
    ctx.arc(0, -hh * 0.05, hw * 0.25, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // Ghost ship — greyed out, faded
    ctx.globalAlpha = 0.2;
    ctx.fillStyle = '#666';
    ctx.beginPath();
    ctx.moveTo(0, -hh);
    ctx.bezierCurveTo(hw * 0.4, -hh, hw * 0.8, -hh * 0.3, hw * 0.7, hh * 0.6);
    ctx.lineTo(-hw * 0.7, hh * 0.6);
    ctx.bezierCurveTo(-hw * 0.8, -hh * 0.3, -hw * 0.4, -hh, 0, -hh);
    ctx.fill();
    // Ghost wings
    ctx.beginPath();
    ctx.moveTo(-hw * 0.6, hh * 0.2);
    ctx.lineTo(-hw, hh * 0.8);
    ctx.lineTo(-hw * 0.4, hh * 0.6);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(hw * 0.6, hh * 0.2);
    ctx.lineTo(hw, hh * 0.8);
    ctx.lineTo(hw * 0.4, hh * 0.6);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  ctx.restore();
}`;

const newDrawMiniShip = `function drawMiniShip(x, y, w, h, alive) {
  ctx.save();
  ctx.translate(x, y);

  const hw = w / 2;
  const hh = h / 2;
  const s = SHIPS[selectedShip];
  const fc = s.flameColors;

  if (alive) {
    // Animated thruster flame using ship's own flame colors
    const flameH = 4 + Math.random() * 4;
    const flameW = w * 0.35;
    ctx.fillStyle = fc[0];
    ctx.beginPath();
    ctx.moveTo(-flameW / 2, hh);
    ctx.quadraticCurveTo(0, hh + flameH, flameW / 2, hh);
    ctx.fill();
    ctx.fillStyle = fc[1];
    ctx.beginPath();
    ctx.moveTo(-flameW / 4, hh);
    ctx.quadraticCurveTo(0, hh + flameH * 0.6, flameW / 4, hh);
    ctx.fill();
    ctx.fillStyle = fc[2];
    ctx.beginPath();
    ctx.moveTo(-flameW / 6, hh);
    ctx.quadraticCurveTo(0, hh + flameH * 0.35, flameW / 6, hh);
    ctx.fill();

    // Ship SVG image
    const img = shipImages[selectedShip];
    if (img.complete && img.naturalWidth > 0) {
      const drawW = w * s.drawW;
      const drawH = h * s.drawH;
      ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
    } else {
      // Fallback accent-colored shape
      ctx.fillStyle = s.accent;
      ctx.beginPath();
      ctx.moveTo(0, -hh);
      ctx.bezierCurveTo(hw * 0.4, -hh, hw * 0.8, -hh * 0.3, hw * 0.7, hh * 0.6);
      ctx.lineTo(-hw * 0.7, hh * 0.6);
      ctx.bezierCurveTo(-hw * 0.8, -hh * 0.3, -hw * 0.4, -hh, 0, -hh);
      ctx.fill();
    }
  } else {
    // Ghost / dead — same ship image at very low alpha
    ctx.globalAlpha = 0.15;
    const img = shipImages[selectedShip];
    if (img.complete && img.naturalWidth > 0) {
      const drawW = w * s.drawW;
      const drawH = h * s.drawH;
      ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
    } else {
      ctx.fillStyle = '#666';
      ctx.beginPath();
      ctx.moveTo(0, -hh);
      ctx.bezierCurveTo(hw * 0.4, -hh, hw * 0.8, -hh * 0.3, hw * 0.7, hh * 0.6);
      ctx.lineTo(-hw * 0.7, hh * 0.6);
      ctx.bezierCurveTo(-hw * 0.8, -hh * 0.3, -hw * 0.4, -hh, 0, -hh);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  ctx.restore();
}`;

if (!html.includes(oldDrawMiniShip)) {
  console.error('ERROR: Could not find drawMiniShip to replace');
  process.exit(1);
}
html = html.replace(oldDrawMiniShip, newDrawMiniShip);
console.log('drawMiniShip replaced OK');

// Fix LIVES label color to use ship accent
const oldLivesLabel = `  // "LIVES" label
  ctx.fillStyle = 'rgba(100,200,255,0.6)';
  ctx.font = \`bold \${Math.round(7 * scale)}px Arial, sans-serif\`;`;

const newLivesLabel = `  // "LIVES" label
  ctx.fillStyle = SHIPS[selectedShip].accent + '99';
  ctx.font = \`bold \${clampFont(7)}px Arial, sans-serif\`;`;

if (!html.includes(oldLivesLabel)) {
  console.error('ERROR: Could not find LIVES label to replace');
  process.exit(1);
}
html = html.replace(oldLivesLabel, newLivesLabel);
console.log('LIVES label color updated OK');

// Fix shipW/shipH minimum size in drawLives
const oldShipSize = `  const shipW = 16 * scale;
  const shipH = 22 * scale;`;
const newShipSize = `  const shipW = Math.max(14, 16 * scale);
  const shipH = Math.max(19, 22 * scale);`;

if (!html.includes(oldShipSize)) {
  console.error('ERROR: Could not find shipW/shipH to replace');
  process.exit(1);
}
html = html.replace(oldShipSize, newShipSize);
console.log('shipW/shipH min-size updated OK');

// ============================================================
// TASK 3 — Mobile HUD Scaling: add clampFont, apply it
// ============================================================

// Insert clampFont helper just before drawPowerupHUD
const oldPowerupHUD = `function drawPowerupHUD() {`;
const newPowerupHUD = `function clampFont(size) {
  return Math.max(11, Math.round(size * scale));
}

function drawPowerupHUD() {`;

if (!html.includes(oldPowerupHUD)) {
  console.error('ERROR: Could not find drawPowerupHUD to insert clampFont before');
  process.exit(1);
}
html = html.replace(oldPowerupHUD, newPowerupHUD);
console.log('clampFont inserted OK');

// Apply clampFont in drawPowerupHUD (the two font lines there)
html = html.replace(
  `ctx.font = \`bold \${Math.round(9 * scale)}px Arial, sans-serif\`;\n    ctx.fillText('⚡ PLASMA'`,
  `ctx.font = \`bold \${clampFont(9)}px Arial, sans-serif\`;\n    ctx.fillText('⚡ PLASMA'`
);
html = html.replace(
  `ctx.font = \`bold \${Math.round(9 * scale)}px Arial, sans-serif\`;\n    ctx.fillText('🛡️ SHIELD ACTIVE'`,
  `ctx.font = \`bold \${clampFont(9)}px Arial, sans-serif\`;\n    ctx.fillText('🛡️ SHIELD ACTIVE'`
);
console.log('drawPowerupHUD font sizes updated OK');

// Apply clampFont in drawHUD
html = html.replace(
  `ctx.font = \`bold \${Math.round(22 * scale)}px 'Arial Rounded MT Bold', Arial, sans-serif\`;`,
  `ctx.font = \`bold \${clampFont(22)}px 'Arial Rounded MT Bold', Arial, sans-serif\`;`
);
html = html.replace(
  `ctx.font = \`\${Math.round(11 * scale)}px Arial, sans-serif\`;\n    ctx.textAlign = 'right';\n    ctx.fillText('BEST '`,
  `ctx.font = \`\${clampFont(11)}px Arial, sans-serif\`;\n    ctx.textAlign = 'right';\n    ctx.fillText('BEST '`
);
html = html.replace(
  `ctx.font = \`bold \${Math.round(13 * scale)}px 'Arial Rounded MT Bold', Arial, sans-serif\`;\n    ctx.textAlign = 'center';\n    ctx.fillText(\`WORLD \${currentWorld + 1}`,
  `ctx.font = \`bold \${clampFont(13)}px 'Arial Rounded MT Bold', Arial, sans-serif\`;\n    ctx.textAlign = 'center';\n    ctx.fillText(\`WORLD \${currentWorld + 1}`
);
html = html.replace(
  `ctx.font = \`bold \${Math.round(7 * scale)}px Arial, sans-serif\`;\n    ctx.fillText(Math.round(progress * 100)`,
  `ctx.font = \`bold \${clampFont(7)}px Arial, sans-serif\`;\n    ctx.fillText(Math.round(progress * 100)`
);
console.log('drawHUD font sizes updated OK');

// Fix progress bar minimum width
html = html.replace(
  `const barW = Math.min(260, W * 0.35) * scale;`,
  `const barW = Math.max(120, Math.min(260, W * 0.35) * scale);`
);
console.log('progress bar min-width updated OK');

// Write result
fs.writeFileSync(filePath, html, 'utf8');
console.log('\nAll patches applied. File written.');
