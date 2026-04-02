// patch-paintings.js — Sunken Treasures Paintings System
// Phases 1-5: data, shimmer mechanic, catch card UI, trophy room, image embedding
'use strict';

const fs = require('fs');
const path = require('path');

const GAME_FILE = path.join(__dirname, 'games', 'catch-and-reel', 'index.html');
const PAINTINGS_DIR = __dirname;

// Load the 5 painting base64 files
function loadB64(filename) {
  const p = path.join(PAINTINGS_DIR, filename);
  return fs.readFileSync(p, 'utf8').trim();
}

console.log('Loading painting images...');
const b64_nightWatch    = loadB64('painting-nightWatch.txt');
const b64_morningVoyage = loadB64('painting-morningVoyage.txt');
const b64_sunkenGalleon = loadB64('painting-sunkenGalleon.txt');
const b64_fireMountain  = loadB64('painting-fireMountain.txt');
const b64_abyssalGlow   = loadB64('painting-abyssalGlow.txt');
console.log('Images loaded:',
  b64_nightWatch.length, b64_morningVoyage.length,
  b64_sunkenGalleon.length, b64_fireMountain.length, b64_abyssalGlow.length);

// Read game file
let raw = fs.readFileSync(GAME_FILE, 'utf8');
const hadCRLF = raw.includes('\r\n');
if (hadCRLF) raw = raw.replace(/\r\n/g, '\n');

console.log('Game file length:', raw.length);

// ============================================================
// PATCH 1: CSS — add painting styles before </style>
// ============================================================
const CSS_ANCHOR = '\n</style>';
const CSS_INSERT = `

/* ── SUNKEN TREASURES — PAINTINGS ── */
#catchDisplay.painting-mode {
  border-color: #d7b56d !important;
  box-shadow: 0 0 40px #d7b56d66, 0 0 80px #d7b56d33, 0 0 120px #d7b56d18 !important;
  background: rgba(8, 8, 16, 0.97) !important;
}
.painting-frame {
  position: relative;
  display: inline-block;
  border: 4px solid #d7b56d;
  border-radius: 6px;
  box-shadow: 0 0 18px #d7b56d88, inset 0 0 12px rgba(0,0,0,0.5);
  animation: paintingFloat 2.8s ease-in-out infinite;
  overflow: hidden;
  background: #111;
}
.painting-frame img {
  display: block;
  width: clamp(140px, 30vw, 180px);
  height: clamp(140px, 30vw, 180px);
  object-fit: cover;
}
.painting-frame::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(215,181,109,0.18) 0%, transparent 50%, rgba(215,181,109,0.10) 100%);
  pointer-events: none;
  z-index: 1;
}
/* Corner ornaments */
.painting-frame::after {
  content: '✦';
  position: absolute;
  top: -12px;
  right: -12px;
  font-size: 18px;
  color: #d7b56d;
  text-shadow: 0 0 8px #d7b56dcc;
  z-index: 2;
}
@keyframes paintingFloat {
  0%,100% { transform: translateY(0) rotate(-1.5deg); }
  50%      { transform: translateY(-10px) rotate(1.5deg); }
}
.painting-rarity-label {
  font-family: 'Baloo 2', cursive;
  font-weight: 700;
  font-size: clamp(9px, 1.8vw, 16px);
  letter-spacing: 3px;
  color: #d7b56d;
  text-shadow: 0 0 14px #d7b56dcc;
  animation: goldShimmer 2s ease-in-out infinite;
  text-align: center;
}
@keyframes goldShimmer {
  0%,100% { color: #d7b56d; text-shadow: 0 0 10px #d7b56daa; }
  50%     { color: #ffe59a; text-shadow: 0 0 22px #ffe59acc, 0 0 40px #d7b56d66; }
}
@keyframes shimmerBobber {
  0%,100% { box-shadow: 0 0 8px #d7b56d88; }
  50%     { box-shadow: 0 0 24px #ffe59acc, 0 0 48px #d7b56d66; }
}

/* Trophy room paintings section */
.trophy-paintings-header {
  width: 100%;
  text-align: center;
  font-family: 'Luckiest Guy', cursive;
  font-size: clamp(14px, 3vw, 20px);
  color: #d7b56d;
  text-shadow: 0 0 16px #d7b56daa;
  margin: 16px 0 10px;
  letter-spacing: 2px;
}
.trophy-paintings-subheader {
  width: 100%;
  text-align: center;
  font-family: 'Baloo 2', cursive;
  font-size: clamp(10px, 2vw, 13px);
  color: rgba(215,181,109,0.65);
  margin-bottom: 14px;
  letter-spacing: 1px;
}
.trophy-paintings-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
  width: 100%;
  margin-bottom: 20px;
}
.trophy-painting-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 10px;
  border-radius: 10px;
  border: 2px solid #d7b56d44;
  background: rgba(215,181,109,0.05);
  width: clamp(100px, 18vw, 130px);
  box-sizing: border-box;
  transition: transform 0.2s;
}
.trophy-painting-card.found {
  border-color: #d7b56daa;
  background: rgba(215,181,109,0.10);
  box-shadow: 0 0 12px #d7b56d33;
}
.trophy-painting-card.found:hover {
  transform: scale(1.04);
}
.trophy-painting-card .paint-img-wrap {
  border: 2px solid #d7b56d88;
  border-radius: 4px;
  overflow: hidden;
  width: clamp(70px, 13vw, 90px);
  height: clamp(70px, 13vw, 90px);
  background: #0a0a18;
  display: flex;
  align-items: center;
  justify-content: center;
}
.trophy-painting-card.found .paint-img-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.trophy-painting-card .paint-name {
  font-family: 'Baloo 2', cursive;
  font-weight: 700;
  font-size: clamp(8px, 1.5vw, 11px);
  color: #d7b56d;
  text-align: center;
  line-height: 1.2;
}
.trophy-painting-card .paint-loc {
  font-family: 'Baloo 2', cursive;
  font-size: clamp(7px, 1.2vw, 10px);
  color: rgba(255,255,255,0.4);
  text-align: center;
}
.trophy-painting-card.locked .paint-img-wrap {
  border-color: rgba(255,255,255,0.12);
}
.trophy-painting-card.locked .paint-name {
  color: rgba(255,255,255,0.3);
}

`;

if (!raw.includes(CSS_ANCHOR)) {
  console.error('ERROR: CSS anchor not found!'); process.exit(1);
}
raw = raw.replace(CSS_ANCHOR, CSS_INSERT + CSS_ANCHOR);
console.log('✓ Patch 1: CSS added');

// ============================================================
// PATCH 2: PAINTINGS constant + PAINTING_IMAGES + helpers
// Insert after JUNK_CHANCE block
// ============================================================
const JUNK_ANCHOR = `var JUNK_CHANCE = 0.08; // 8% chance per catch\n;`;

const PAINTINGS_CODE = `
// ── SUNKEN TREASURES — PAINTINGS DATA ──
var PAINTINGS = [
  { name: 'Night Watch',    location: 'dock',    locationName: 'Wooden Dock',  color: '#4466bb' },
  { name: 'Morning Voyage', location: 'pier',    locationName: 'Sunny Pier',   color: '#f0c830' },
  { name: 'Sunken Galleon', location: 'reef',    locationName: 'Coral Reef',   color: '#ff8855' },
  { name: 'Fire Mountain',  location: 'volcano', locationName: 'Volcano Cove', color: '#ff6030' },
  { name: 'Abyssal Glow',   location: 'deepsea', locationName: 'Deep Sea',     color: '#7ab0e0' },
];

const PAINTING_IMAGES = {
  'Night Watch':    'data:image/png;base64,__NIGHT_WATCH__',
  'Morning Voyage': 'data:image/png;base64,__MORNING_VOYAGE__',
  'Sunken Galleon': 'data:image/png;base64,__SUNKEN_GALLEON__',
  'Fire Mountain':  'data:image/png;base64,__FIRE_MOUNTAIN__',
  'Abyssal Glow':   'data:image/png;base64,__ABYSSAL_GLOW__',
};

// Preload painting images
const PAINTING_IMG_ELEMS = {};
Object.keys(PAINTING_IMAGES).forEach(function(name) {
  var img = new Image();
  img.src = PAINTING_IMAGES[name];
  PAINTING_IMG_ELEMS[name] = img;
});

function loadPaintings() {
  try { return JSON.parse(localStorage.getItem('catchreel_paintings') || '{}'); } catch(e) { return {}; }
}
function savePainting(name) {
  var p = loadPaintings();
  p[name] = true;
  localStorage.setItem('catchreel_paintings', JSON.stringify(p));
}
function hasPainting(name) {
  return !!loadPaintings()[name];
}

`;

if (!raw.includes(JUNK_ANCHOR)) {
  console.error('ERROR: JUNK_ANCHOR not found! Trying alternate...');
  // Try without the trailing semicolon
  const alt = `var JUNK_CHANCE = 0.08; // 8% chance per catch`;
  if (!raw.includes(alt)) { console.error('Alternate also not found!'); process.exit(1); }
  raw = raw.replace(alt + '\n;', alt + '\n;' + PAINTINGS_CODE);
} else {
  raw = raw.replace(JUNK_ANCHOR, JUNK_ANCHOR + PAINTINGS_CODE);
}

// Inject actual base64 strings
raw = raw.replace('__NIGHT_WATCH__', b64_nightWatch);
raw = raw.replace('__MORNING_VOYAGE__', b64_morningVoyage);
raw = raw.replace('__SUNKEN_GALLEON__', b64_sunkenGalleon);
raw = raw.replace('__FIRE_MOUNTAIN__', b64_fireMountain);
raw = raw.replace('__ABYSSAL_GLOW__', b64_abyssalGlow);
console.log('✓ Patch 2: PAINTINGS data + PAINTING_IMAGES injected');

// ============================================================
// PATCH 3: sfxShimmer() — insert after sfxLegendary()
// ============================================================
const SFX_ANCHOR = `function sfxLegendary() {
  [523,659,784,1047,1319,1568].forEach((n,i)=>setTimeout(()=>tone(n,0.25,'sine',0.12), i*120));
  setTimeout(()=>{ tone(2093,0.6,'sine',0.15); tone(1568,0.6,'sine',0.1); }, 750);
}`;

const SFX_SHIMMER = `
function sfxShimmer() {
  // Ethereal shimmer chime — rising sparkle arpeggios with long bell sustain
  if (!ac) return;
  var notes = [1047, 1319, 1568, 2093, 2637];
  notes.forEach(function(n, i) {
    setTimeout(function() { tone(n, 0.45, 'sine', 0.13); }, i * 90);
  });
  setTimeout(function() {
    tone(2093, 1.2, 'sine', 0.10);
    tone(2637, 1.2, 'sine', 0.07);
    tone(3136, 1.0, 'sine', 0.05);
  }, notes.length * 90 + 80);
}
`;

if (!raw.includes(SFX_ANCHOR)) {
  console.error('ERROR: sfxLegendary anchor not found!'); process.exit(1);
}
raw = raw.replace(SFX_ANCHOR, SFX_ANCHOR + SFX_SHIMMER);
console.log('✓ Patch 3: sfxShimmer() added');

// ============================================================
// PATCH 4: enterPaintingCatch() function — insert before enterFail()
// ============================================================
const FAIL_ANCHOR = `function enterFail(msg) {`;

const PAINTING_CATCH_FN = `
// ── SUNKEN TREASURES — PAINTING CATCH ──
function enterPaintingCatch(painting) {
  gameState = ST.CAUGHT;
  stateTime = 0;
  caughtInputLock = 2.5;
  holding = false;

  // Save to localStorage
  savePainting(painting.name);

  // Big gold flash + confetti
  flash(0.7, [215, 181, 109]);
  spawnConfetti(W * 0.5, H * 0.4, 60, ['#d7b56d', '#ffe59a', '#ffd700', '#ffffff', '#c8a45e']);
  sfxShimmer();
  shake(6);

  showUI(false, false, true);

  // Style the catchDisplay as gold/painting mode
  var catchDisp = document.getElementById('catchDisplay');
  if (catchDisp) {
    catchDisp.style.display = 'flex';
    catchDisp.classList.add('painting-mode');
  }

  // Rarity label
  var elRarity = document.getElementById('catchRarity');
  if (elRarity) {
    elRarity.innerHTML = '<span class="painting-rarity-label">✦ SUNKEN TREASURE ✦</span>';
    elRarity.style.animation = '';
  }

  // Painting image in frame
  var elEmoji = document.getElementById('catchEmoji');
  if (elEmoji) {
    var imgSrc = PAINTING_IMAGES[painting.name] || '';
    elEmoji.style.fontSize = ''; // clear emoji font size
    elEmoji.style.animation = ''; // clear fishBounce
    elEmoji.innerHTML =
      '<div class="painting-frame">' +
        '<img src="' + imgSrc + '" alt="' + painting.name + '">' +
      '</div>';
  }

  // Title
  var elTitle = document.getElementById('catchTitle');
  if (elTitle) {
    elTitle.textContent = painting.name;
    elTitle.style.color = '#d7b56d';
    elTitle.style.textShadow = '0 0 16px #d7b56daa';
  }

  // Details
  var elDetails = document.getElementById('catchDetails');
  if (elDetails) {
    elDetails.textContent = 'From: ' + painting.locationName;
    elDetails.style.color = 'rgba(215,181,109,0.7)';
  }

  // Action hint (hidden until lock expires)
  var elAction = document.getElementById('catchAction');
  if (elAction) elAction.textContent = '';

  setInstruction('', false);
}

`;

if (!raw.includes(FAIL_ANCHOR)) {
  console.error('ERROR: enterFail anchor not found!'); process.exit(1);
}
raw = raw.replace(FAIL_ANCHOR, PAINTING_CATCH_FN + FAIL_ANCHOR);
console.log('✓ Patch 4: enterPaintingCatch() added');

// ============================================================
// PATCH 5: Shimmer roll in enterWait()
// Insert after `waitLen = rng(2.5, 5.5);`
// ============================================================
const WAIT_ANCHOR = `  waitLen = rng(2.5, 5.5);
  nibbleIdx = 0; dipAmount = 0; dipTarget = 0;`;

const SHIMMER_ROLL = `  waitLen = rng(2.5, 5.5);

  // 0.75% shimmer event per cast — auto-catch a painting for current location
  if (Math.random() < 0.0075) {
    var _shimmerPainting = null;
    for (var _pi = 0; _pi < PAINTINGS.length; _pi++) {
      if (PAINTINGS[_pi].location === currentLocation) { _shimmerPainting = PAINTINGS[_pi]; break; }
    }
    if (_shimmerPainting) {
      // Spawn golden shimmer particles from bobber
      for (var _si = 0; _si < 50; _si++) {
        var _sa = Math.random() * Math.PI * 2;
        var _ss = rng(1, 6);
        particles.push({
          x: bobberX, y: bobberY,
          vx: Math.cos(_sa) * _ss, vy: Math.sin(_sa) * _ss - 3,
          gravity: 6, life: rng(0.8, 1.8), maxLife: 1.8,
          size: rng(2, 6), color: Math.random() < 0.5 ? '#d7b56d' : '#ffe59a', type: 'circle'
        });
      }
      addRipple(bobberX, bobberY, 80, 120);
      flash(0.4, [215, 181, 109]);
      sfxShimmer();
      setInstruction('✨ Something glimmers beneath the surface...', false);
      var _sp = _shimmerPainting;
      setTimeout(function() {
        if (gameState === ST.WAIT || gameState === ST.IDLE) enterPaintingCatch(_sp);
      }, 2000);
      return;
    }
  }

  nibbleIdx = 0; dipAmount = 0; dipTarget = 0;`;

if (!raw.includes(WAIT_ANCHOR)) {
  console.error('ERROR: enterWait anchor not found!'); process.exit(1);
}
raw = raw.replace(WAIT_ANCHOR, SHIMMER_ROLL);
console.log('✓ Patch 5: Shimmer roll in enterWait()');

// ============================================================
// PATCH 6: Clean up catchDisplay painting-mode on enterIdle
// After `document.getElementById('catchDisplay').style.display = 'none';`
// ============================================================
const IDLE_CATCH_ANCHOR = `  document.getElementById('catchDisplay').style.display = 'none';`;
const IDLE_CATCH_REPLACE = `  var _cd = document.getElementById('catchDisplay');
  if (_cd) { _cd.style.display = 'none'; _cd.classList.remove('painting-mode'); }
  // Reset catchEmoji and catchTitle styling from painting mode
  var _ce = document.getElementById('catchEmoji');
  if (_ce) { _ce.style.animation = 'fishBounce 0.5s ease-in-out infinite alternate'; }
  var _ct = document.getElementById('catchTitle');
  if (_ct) { _ct.style.color = ''; _ct.style.textShadow = ''; }
  var _cdet = document.getElementById('catchDetails');
  if (_cdet) { _cdet.style.color = ''; }`;

if (!raw.includes(IDLE_CATCH_ANCHOR)) {
  console.error('ERROR: enterIdle catchDisplay anchor not found!'); process.exit(1);
}
// Replace only first occurrence (in enterIdle)
const firstIdx = raw.indexOf(IDLE_CATCH_ANCHOR);
raw = raw.substring(0, firstIdx) + IDLE_CATCH_REPLACE + raw.substring(firstIdx + IDLE_CATCH_ANCHOR.length);
console.log('✓ Patch 6: enterIdle cleanup for painting-mode');

// ============================================================
// PATCH 7: Trophy Room — prepend paintings section
// Find the loop start inside openTrophyRoom
// ============================================================
const TROPHY_ANCHOR = `  const tierOrder = ['EXOTIC','LEGENDARY','EPIC','ULTRA_RARE','RARE','UNCOMMON','COMMON'];`;

const PAINTINGS_TROPHY = `
  // ── SUNKEN TREASURES SECTION ──
  var paintingData = loadPaintings();
  var foundCount = 0;
  for (var _pk in paintingData) { if (paintingData[_pk]) foundCount++; }

  var paintingsSection = document.createElement('div');
  paintingsSection.style.width = '100%';

  var paintingsHeader = document.createElement('div');
  paintingsHeader.className = 'trophy-paintings-header';
  paintingsHeader.textContent = '✦ SUNKEN TREASURES ✦';
  paintingsSection.appendChild(paintingsHeader);

  var paintingsSub = document.createElement('div');
  paintingsSub.className = 'trophy-paintings-subheader';
  paintingsSub.textContent = foundCount + ' / ' + PAINTINGS.length + ' paintings discovered  •  0.75% shimmer per cast';
  paintingsSection.appendChild(paintingsSub);

  var paintingsGrid = document.createElement('div');
  paintingsGrid.className = 'trophy-paintings-grid';

  PAINTINGS.forEach(function(painting) {
    var found = !!paintingData[painting.name];
    var card = document.createElement('div');
    card.className = 'trophy-painting-card ' + (found ? 'found' : 'locked');

    var imgWrap = document.createElement('div');
    imgWrap.className = 'paint-img-wrap';
    if (found) {
      var imgEl = document.createElement('img');
      imgEl.src = PAINTING_IMAGES[painting.name];
      imgEl.alt = painting.name;
      imgWrap.appendChild(imgEl);
    } else {
      imgWrap.style.fontSize = '28px';
      imgWrap.style.color = 'rgba(255,255,255,0.18)';
      imgWrap.textContent = '🔒';
    }
    card.appendChild(imgWrap);

    var nameEl = document.createElement('div');
    nameEl.className = 'paint-name';
    nameEl.textContent = found ? painting.name : '???';
    card.appendChild(nameEl);

    var locEl = document.createElement('div');
    locEl.className = 'paint-loc';
    locEl.textContent = found ? painting.locationName : painting.locationName;
    card.appendChild(locEl);

    paintingsGrid.appendChild(card);
  });

  paintingsSection.appendChild(paintingsGrid);

  // Divider
  var divider = document.createElement('div');
  divider.style.cssText = 'width:100%;height:1px;background:linear-gradient(90deg,transparent,#d7b56d44,transparent);margin:8px 0 18px;';
  paintingsSection.appendChild(divider);

  grid.appendChild(paintingsSection);
  // ── END SUNKEN TREASURES SECTION ──

  const tierOrder = ['EXOTIC','LEGENDARY','EPIC','ULTRA_RARE','RARE','UNCOMMON','COMMON'];`;

if (!raw.includes(TROPHY_ANCHOR)) {
  console.error('ERROR: Trophy room tierOrder anchor not found!'); process.exit(1);
}
raw = raw.replace(TROPHY_ANCHOR, PAINTINGS_TROPHY);
console.log('✓ Patch 7: Trophy room paintings section added');

// ============================================================
// Write output
// ============================================================
if (hadCRLF) raw = raw.replace(/\n/g, '\r\n');
fs.writeFileSync(GAME_FILE, raw, 'utf8');
console.log('\n✅ All patches applied! Game file written.');
console.log('New file size:', fs.statSync(GAME_FILE).size, 'bytes');
