// patch-change-level.js — Add "Change Level" button to pause menu + 3-2-1 countdown
'use strict';
const fs = require('fs');
const path = require('path');

const GAME_FILE = path.join(__dirname, 'games', 'catch-and-reel', 'index.html');
let raw = fs.readFileSync(GAME_FILE, 'utf8');
const hadCRLF = raw.includes('\r\n');
if (hadCRLF) raw = raw.replace(/\r\n/g, '\n');
console.log('Game file length:', raw.length);

// ============================================================
// PATCH 1: CSS — add .pause-level style + restate pause-char
// Insert after .pause-trophy block
// ============================================================
const CSS_ANCHOR = `.pause-trophy { background: rgba(255,229,53,0.15); color: #FFE135; border: 1px solid rgba(255,229,53,0.25); }
.pause-trophy:hover { background: rgba(255,229,53,0.25); }`;

const CSS_INSERT = `.pause-trophy { background: rgba(255,229,53,0.15); color: #FFE135; border: 1px solid rgba(255,229,53,0.25); }
.pause-trophy:hover { background: rgba(255,229,53,0.25); }
.pause-level { background: linear-gradient(135deg, #E67E22, #D35400); color: #fff; border: 1px solid #F0923E; box-shadow: 0 0 16px rgba(230,126,34,0.4), 0 4px 12px rgba(0,0,0,0.3); text-shadow: 0 1px 3px rgba(0,0,0,0.4); }
.pause-level:hover { background: linear-gradient(135deg, #F08A30, #E05808); }`;

if (!raw.includes(CSS_ANCHOR)) { console.error('ERROR: CSS anchor not found!'); process.exit(1); }
raw = raw.replace(CSS_ANCHOR, CSS_INSERT);
console.log('✓ Patch 1: CSS added');

// ============================================================
// PATCH 2: HTML — insert Change Level button + swap Fisher icon
// ============================================================
const HTML_OLD = `    <button class="pause-btn pause-trophy" onclick="closePauseOpenTrophy()">🏆 TROPHIES</button>
    <button class="pause-btn pause-char" onclick="changeCharacter()">🔄 CHANGE FISHER</button>`;

const HTML_NEW = `    <button class="pause-btn pause-trophy" onclick="closePauseOpenTrophy()">🏆 TROPHIES</button>
    <button class="pause-btn pause-level" id="changeLevelBtn">🗺️ CHANGE LEVEL</button>
    <button class="pause-btn pause-char" onclick="changeCharacter()">🎣 CHANGE FISHER</button>`;

if (!raw.includes(HTML_OLD)) { console.error('ERROR: HTML anchor not found!'); process.exit(1); }
raw = raw.replace(HTML_OLD, HTML_NEW);
console.log('✓ Patch 2: HTML updated (Change Level button added, Fisher icon swapped)');

// ============================================================
// PATCH 3: JS — countdown state variables + changeLevel function
// Insert before `let gamePaused = false;`
// ============================================================
const PAUSED_VAR_ANCHOR = `let gamePaused = false;`;

const COUNTDOWN_VARS = `// ── CHANGE LEVEL COUNTDOWN ──
let countdownActive = false;
let countdownValue = 0;        // 3, 2, 1
let countdownT = 0;            // time within current number
let countdownTargetLoc = null; // { id, name } of destination

`;

if (!raw.includes(PAUSED_VAR_ANCHOR)) { console.error('ERROR: gamePaused anchor not found!'); process.exit(1); }
raw = raw.replace(PAUSED_VAR_ANCHOR, COUNTDOWN_VARS + PAUSED_VAR_ANCHOR);
console.log('✓ Patch 3: Countdown state variables added');

// ============================================================
// PATCH 4: JS — changeLevel() and startCountdown() functions
// Insert after togglePauseMenu() and before changeCharacter()
// ============================================================
const CHANGE_CHAR_ANCHOR = `function changeCharacter() {`;

const CHANGE_LEVEL_FN = `function changeLevel() {
  // Close pause menu, open location select in "change level" mode
  document.getElementById('pauseMenu').classList.remove('open');
  gamePaused = false;
  // Flag so selectLocation knows to do countdown instead of normal flow
  window._changeLevelMode = true;
  showLocationSelect();
  // Show location select overlay over the game canvas
  var ls = document.getElementById('locationSelect');
  ls.style.display = 'block';
  document.getElementById('gameContainer').style.display = 'block';
}

function startLocationCountdown(locId) {
  // If same location, just close overlay and resume
  if (locId === currentLocation) {
    document.getElementById('locationSelect').style.display = 'none';
    gamePaused = false;
    return;
  }
  document.getElementById('locationSelect').style.display = 'none';
  var loc = LOCATIONS.find(function(l) { return l.id === locId; }) || LOCATIONS[0];
  countdownTargetLoc = loc;
  countdownValue = 3;
  countdownT = 0;
  countdownActive = true;
  gamePaused = true; // freeze gameplay during countdown
  // Transition the location now so bg starts rendering immediately
  initBgParticles(locId);
  currentLocation = locId;
  localStorage.setItem('catchreel_location', locId);
  resize();
  // Also reset to idle state
  stopReelDrag && stopReelDrag();
  gameState = ST.IDLE;
  stateTime = 0;
  showUI(false, false, false);
  setInstruction('', false);
}

`;

if (!raw.includes(CHANGE_CHAR_ANCHOR)) { console.error('ERROR: changeCharacter anchor not found!'); process.exit(1); }
raw = raw.replace(CHANGE_CHAR_ANCHOR, CHANGE_LEVEL_FN + CHANGE_CHAR_ANCHOR);
console.log('✓ Patch 4: changeLevel() and startLocationCountdown() added');

// ============================================================
// PATCH 5: Intercept selectLocation to use countdown when in change-level mode
// The existing selectLocation directly hides locationSelect and shows gameContainer.
// Wrap it so _changeLevelMode routes through countdown instead.
// ============================================================
const SEL_LOC_OLD = `selectLocation = function(id) {
  initBgParticles(id);
  currentLocation = id;
  localStorage.setItem('catchreel_location', id);
  document.getElementById('locationSelect').style.display = 'none';
  document.getElementById('gameContainer').style.display = 'block';
  gameStarted = true;
  resize();
  document.getElementById('title').style.display = 'none';
}`;

const SEL_LOC_NEW = `selectLocation = function(id) {
  if (window._changeLevelMode) {
    window._changeLevelMode = false;
    startLocationCountdown(id);
    return;
  }
  initBgParticles(id);
  currentLocation = id;
  localStorage.setItem('catchreel_location', id);
  document.getElementById('locationSelect').style.display = 'none';
  document.getElementById('gameContainer').style.display = 'block';
  gameStarted = true;
  resize();
  document.getElementById('title').style.display = 'none';
}`;

if (!raw.includes(SEL_LOC_OLD)) { console.error('ERROR: selectLocation anchor not found!'); process.exit(1); }
raw = raw.replace(SEL_LOC_OLD, SEL_LOC_NEW);
console.log('✓ Patch 5: selectLocation intercepted for change-level mode');

// ============================================================
// PATCH 6: Draw countdown on canvas — insert into frame() draw block
// Insert after drawFlash(); inside frame()
// ============================================================
const DRAW_FLASH_ANCHOR = `  drawBackground();
  drawCharacter();
  drawFishingLine();
  drawBobber();
  drawParticles();
  drawFlash();

  ctx.restore();`;

const DRAW_COUNTDOWN = `  drawBackground();
  drawCharacter();
  drawFishingLine();
  drawBobber();
  drawParticles();
  drawFlash();
  if (countdownActive) drawCountdown();

  ctx.restore();`;

if (!raw.includes(DRAW_FLASH_ANCHOR)) { console.error('ERROR: draw block anchor not found!'); process.exit(1); }
raw = raw.replace(DRAW_FLASH_ANCHOR, DRAW_COUNTDOWN);
console.log('✓ Patch 6: drawCountdown() call added to frame()');

// ============================================================
// PATCH 7: Update countdown state in frame() update block
// Insert before the gamePaused check in the update section
// ============================================================
const FRAME_UPDATE_ANCHOR = `  // Update state (skip when paused)
  if (!gamePaused) {`;

const FRAME_COUNTDOWN_UPDATE = `  // Countdown update (runs even when gamePaused)
  if (countdownActive) {
    countdownT += dt;
    if (countdownT >= 1.0) {
      countdownT -= 1.0;
      countdownValue--;
      if (countdownValue <= 0) {
        // Countdown done — resume
        countdownActive = false;
        countdownTargetLoc = null;
        gamePaused = false;
        enterIdle();
      }
    }
  }

  // Update state (skip when paused)
  if (!gamePaused) {`;

if (!raw.includes(FRAME_UPDATE_ANCHOR)) { console.error('ERROR: frame update anchor not found!'); process.exit(1); }
raw = raw.replace(FRAME_UPDATE_ANCHOR, FRAME_COUNTDOWN_UPDATE);
console.log('✓ Patch 7: Countdown update logic added to frame()');

// ============================================================
// PATCH 8: drawCountdown() function — insert before frame()
// ============================================================
const FRAME_FN_ANCHOR = `function frame(now) {`;

const DRAW_COUNTDOWN_FN = `function drawCountdown() {
  if (!countdownActive || countdownValue <= 0) return;
  var cx = W / 2, cy = H / 2;
  // Scale pulse: 0→1 within each second, peak at 0.15 then settle
  var progress = countdownT; // 0..1 within this second
  var scale = 1.0 + 0.15 * Math.sin(progress * Math.PI);

  // Dark overlay (semi-transparent)
  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,0.45)';
  ctx.fillRect(0, 0, W, H);

  // Number
  var numSize = Math.min(W, H) * 0.28;
  ctx.font = 'bold ' + numSize + 'px "Luckiest Guy", cursive';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#F0923E';
  ctx.shadowColor = 'rgba(230,126,34,0.8)';
  ctx.shadowBlur = 40;

  ctx.save();
  ctx.translate(cx, cy - numSize * 0.15);
  ctx.scale(scale, scale);
  ctx.fillText(countdownValue, 0, 0);
  ctx.restore();

  // Location name below
  if (countdownTargetLoc) {
    var subSize = Math.min(W, H) * 0.045;
    ctx.font = '600 ' + subSize + 'px "Baloo 2", cursive';
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.fillText('Heading to ' + countdownTargetLoc.name + '...', cx, cy + numSize * 0.45);
  }

  ctx.restore();
}

`;

if (!raw.includes(FRAME_FN_ANCHOR)) { console.error('ERROR: frame() fn anchor not found!'); process.exit(1); }
raw = raw.replace(FRAME_FN_ANCHOR, DRAW_COUNTDOWN_FN + FRAME_FN_ANCHOR);
console.log('✓ Patch 8: drawCountdown() function added');

// ============================================================
// PATCH 9: Wire up Change Level button with touchstart + click
// Insert after the locBackBtn event listener block
// ============================================================
const LOCBACK_ANCHOR = `document.getElementById('locBackBtn')?.addEventListener('touchend', function(e)`;
// Find it and get more context
const locBackIdx = raw.indexOf(LOCBACK_ANCHOR);
if (locBackIdx < 0) { console.error('ERROR: locBackBtn anchor not found!'); process.exit(1); }
// Find end of that statement (next semicolon after the function body)
let searchPos = locBackIdx + LOCBACK_ANCHOR.length;
let depth = 0;
let inFn = false;
let stmtEnd = -1;
for (let i = searchPos; i < searchPos + 500; i++) {
  if (raw[i] === '{') { depth++; inFn = true; }
  if (raw[i] === '}') { depth--; }
  if (inFn && depth === 0 && raw[i] === ';') { stmtEnd = i + 1; break; }
}
if (stmtEnd < 0) { console.error('ERROR: Could not find end of locBackBtn listener'); process.exit(1); }

const CHANGE_LEVEL_WIRE = `

// Wire up Change Level button
(function() {
  var btn = document.getElementById('changeLevelBtn');
  if (!btn) return;
  function handleChangeLevel(e) {
    e.preventDefault();
    changeLevel();
  }
  btn.addEventListener('touchstart', handleChangeLevel, { passive: false });
  btn.addEventListener('click', handleChangeLevel);
})();
`;

raw = raw.substring(0, stmtEnd) + CHANGE_LEVEL_WIRE + raw.substring(stmtEnd);
console.log('✓ Patch 9: Change Level button event listeners wired');

// ============================================================
// Write output
// ============================================================
if (hadCRLF) raw = raw.replace(/\n/g, '\r\n');
fs.writeFileSync(GAME_FILE, raw, 'utf8');
console.log('\n✅ All patches applied!');
console.log('New file size:', fs.statSync(GAME_FILE).size, 'bytes');
