const fs = require('fs');

// ── 1. Extract body from each clip file (strip `const SOUNDS = {` header and closing `};`)
function extractBody(filepath) {
  const raw = fs.readFileSync(filepath, 'utf8');
  const start = raw.indexOf('{') + 1;
  const end = raw.lastIndexOf('}');
  return raw.slice(start, end).trim();
}

const body1 = extractBody("C:/Users/jmurp/OneDrive/Desktop/TruckDriver/Space Dodge \u2014 Sound clips (base64) 1.txt");
const body2 = extractBody("C:/Users/jmurp/OneDrive/Desktop/TruckDriver/Space Dodge \u2014 Sound clips (base64) 2.txt");
const body4 = extractBody("C:/Users/jmurp/OneDrive/Desktop/TruckDriver/Space Dodge \u2014 Sound clips (base64) 4.txt");
// File 3 is a subset of file 2 — skipped.

function ensureTrailingComma(s) {
  const t = s.trimEnd();
  return t.endsWith(',') ? t : t + ',';
}
function stripTrailingComma(s) {
  const t = s.trimEnd();
  return t.endsWith(',') ? t.slice(0, -1) : t;
}

// Order: short SFX first (file4), then megabeam (file1), then timed/state sounds (file2)
const soundsConst = 'const SOUNDS = {\n' + ensureTrailingComma(body4) + '\n' + ensureTrailingComma(body1) + '\n' + stripTrailingComma(body2) + '\n};';

// Verify key count
const keys = [...soundsConst.matchAll(/^  ([a-zA-Z_]+):/gm)].map(m => m[1]);
console.log('Keys (' + keys.length + '):', keys.join(', '));
if (keys.length !== 12) { console.error('Expected 12 keys!'); process.exit(1); }

// ── 2. New audio section (replaces everything from // --- AUDIO --- through restartMusic)
const newAudioSection = [
  '// --- SOUNDS ---',
  soundsConst,
  '',
  '// --- AUDIO ---',
  "let muted = localStorage.getItem('sd_muted') === 'true';",
  'let soundsInited = false;',
  'let soundBuffers = {};',
  'let audioCtx2 = null;',
  'let musicNodes = [];',
  'let musicPingTimer = null;',
  'let musicPlaying = false;',
  '',
  'function initAudio() {',
  '  if (soundsInited) return;',
  '  soundsInited = true;',
  '  audioCtx2 = new (window.AudioContext || window.webkitAudioContext)();',
  '  Object.entries(SOUNDS).forEach(([key, uri]) => {',
  '    const audio = new Audio(uri);',
  '    audio.preload = \'auto\';',
  '    soundBuffers[key] = audio;',
  '  });',
  '}',
  '',
  'function playS(key) {',
  '  if (muted || !soundsInited || !soundBuffers[key]) return;',
  '  try {',
  '    const snd = soundBuffers[key].cloneNode();',
  '    snd.volume = 0.7;',
  "    snd.play().catch(() => {});",
  '  } catch(e) {}',
  '}',
  '',
  'function toggleMute() {',
  '  muted = !muted;',
  "  localStorage.setItem('sd_muted', muted.toString());",
  '  if (muted) stopMusic();',
  "  else if (gameState === 'playing') startMusic();",
  '}',
  '',
  '// --- BACKGROUND MUSIC (Ambient Drone + Melodic Pings) ---',
  'const MUSIC_VOL = 0.04; // very subtle',
  '// Per-world pentatonic scales',
  'const WORLD_SCALES = [',
  '  [220, 261.6, 329.6, 392, 440, 523.3],           // Deep Space \u2014 A minor pentatonic',
  '  [233, 277.2, 311.1, 370, 415.3, 466.2],          // Nebula \u2014 Bb, shifted dreamy',
  '  [196, 246.9, 293.7, 329.6, 392, 493.9],          // Asteroid Belt \u2014 G, earthy',
  '  [261.6, 311.1, 370, 415.3, 523.3, 622.3],        // Ice Field \u2014 C, crystalline',
  '  [293.7, 349.2, 392, 466.2, 523.3, 587.3],        // Supernova \u2014 D, intense',
  '];',
  '',
  'function startMusic() {',
  '  if (muted || !audioCtx2 || musicPlaying) return;',
  '  musicPlaying = true;',
  '  const t = audioCtx2.currentTime;',
  '  const idx = getWorldIdx();',
  '',
  '  // Bass drone \u2014 two detuned sines',
  '  const drone1 = audioCtx2.createOscillator();',
  '  const drone2 = audioCtx2.createOscillator();',
  '  const droneGain = audioCtx2.createGain();',
  '  const baseFreq = [55, 52, 49, 58, 62][idx] || 55;',
  "  drone1.type = 'sine';",
  '  drone1.frequency.setValueAtTime(baseFreq, t);',
  '  drone1.frequency.linearRampToValueAtTime(baseFreq * 1.12, t + 10);',
  '  drone1.frequency.linearRampToValueAtTime(baseFreq, t + 20);',
  '  drone1.frequency.linearRampToValueAtTime(baseFreq * 0.9, t + 30);',
  '  drone1.frequency.linearRampToValueAtTime(baseFreq, t + 40);',
  "  drone2.type = 'sine';",
  '  drone2.frequency.setValueAtTime(baseFreq + 0.5, t);',
  '  drone2.frequency.linearRampToValueAtTime(baseFreq * 1.12 + 0.5, t + 10);',
  '  drone2.frequency.linearRampToValueAtTime(baseFreq + 0.5, t + 20);',
  '  drone2.frequency.linearRampToValueAtTime(baseFreq * 0.9 + 0.5, t + 30);',
  '  drone2.frequency.linearRampToValueAtTime(baseFreq + 0.5, t + 40);',
  '  droneGain.gain.setValueAtTime(MUSIC_VOL, t);',
  '  drone1.connect(droneGain); drone2.connect(droneGain);',
  '  droneGain.connect(audioCtx2.destination);',
  '  drone1.start(t); drone2.start(t);',
  '  drone1.stop(t + 120); drone2.stop(t + 120);',
  '  musicNodes.push(drone1, drone2);',
  '',
  '  // Sub bass',
  '  const sub = audioCtx2.createOscillator();',
  '  const subGain = audioCtx2.createGain();',
  "  sub.type = 'sine';",
  '  sub.frequency.setValueAtTime(baseFreq / 2, t);',
  '  subGain.gain.setValueAtTime(MUSIC_VOL * 0.6, t);',
  '  sub.connect(subGain); subGain.connect(audioCtx2.destination);',
  '  sub.start(t); sub.stop(t + 120);',
  '  musicNodes.push(sub);',
  '',
  '  // Melodic pings \u2014 world-specific scale',
  '  const scaleNotes = WORLD_SCALES[idx] || WORLD_SCALES[0];',
  '  musicPingTimer = setInterval(() => {',
  '    if (!audioCtx2 || muted || paused) return;',
  '    const now = audioCtx2.currentTime;',
  '    const osc = audioCtx2.createOscillator();',
  '    const g = audioCtx2.createGain();',
  "    osc.type = 'sine';",
  '    osc.frequency.setValueAtTime(scaleNotes[Math.floor(Math.random() * scaleNotes.length)], now);',
  '    g.gain.setValueAtTime(MUSIC_VOL * 0.6, now);',
  '    g.gain.exponentialRampToValueAtTime(0.001, now + 2.5);',
  '    osc.connect(g); g.connect(audioCtx2.destination);',
  '    osc.start(now); osc.stop(now + 2.5);',
  '    musicNodes.push(osc);',
  '  }, 2000 + Math.random() * 1500);',
  '}',
  '',
  'function stopMusic() {',
  '  musicPlaying = false;',
  '  musicNodes.forEach(n => { try { n.stop(); } catch(e) {} });',
  '  musicNodes = [];',
  '  if (musicPingTimer) { clearInterval(musicPingTimer); musicPingTimer = null; }',
  '}',
  '',
  'function restartMusic() {',
  '  stopMusic();',
  '  startMusic();',
  '}',
].join('\n');

// ── 3. Load game file
let html = fs.readFileSync('C:/Users/jmurp/OneDrive/Desktop/TruckDriver/games/space-dodge/index.html', 'utf8');

// Find and replace the audio+music block
const audioStart = html.indexOf('// --- AUDIO ---');
const afterRestart = html.indexOf('\n// --- RESIZE ---');
if (audioStart === -1 || afterRestart === -1) {
  console.error('Could not find audio section boundaries');
  process.exit(1);
}
html = html.slice(0, audioStart) + newAudioSection + html.slice(afterRestart);
console.log('Audio section replaced.');

// ── 4. Remap playSound() → playS() calls
const remaps = [
  ["playSound('blaster')", "playS('laser')"],
  ["playSound('explode')", "playS('explode')"],
  ["playSound('powerup')", "playS('powerup')"],
  ["playSound('beep')", "playS('countdown')"],
  ["playSound('beepgo')", "playS('go')"],
  ["playSound('start')", "playS('go')"],
  ["playSound('victory')", "playS('victory')"],
  ["playSound('shieldbreak')", "playS('shield_break')"],
  ["playSound('hit')", "playS('hit')"],
  ["playSound('lose')", "playS('hit')"],
  ["playSound('levelup')", "playS('level_complete')"],
];
for (const [from, to] of remaps) {
  html = html.split(from).join(to);
}
// Remove score-milestone sound (no equivalent)
html = html.replace(/\s*if \(score % 50 === 0\) playS\('score'\);/g, '');
// Legacy fallback in case old key survived
html = html.replace(/\s*if \(score % 50 === 0\) playSound\('score'\);/g, '');
console.log('playSound() calls remapped.');

// ── 5. Add megabeam, phase, shield_hit sounds at activation
html = html.replace(
  "megabeamActive = true;\n        megabeamTimer",
  "megabeamActive = true;\n        playS('megabeam');\n        megabeamTimer"
);
html = html.replace(
  "phaseActive = true;\n        phaseTimer",
  "phaseActive = true;\n        playS('phase');\n        phaseTimer"
);
// shield_hit plays the moment the shield absorbs a blow (just before shieldActive = false)
html = html.replace(
  "shieldActive = false;\n        spawnHitParticles",
  "playS('shield_hit');\n        shieldActive = false;\n        spawnHitParticles"
);
console.log('New trigger sounds added.');

// ── 6. Verify no stale bare audioCtx references remain (music now uses audioCtx2)
// The only remaining `audioCtx` should be inside initAudio (the assignment) and comments
const bareRefs = (html.match(/\baudioCtx\b(?!2)/g) || []);
console.log('Bare audioCtx references remaining:', bareRefs.length, bareRefs.length ? '(check below)' : '');
if (bareRefs.length > 0) {
  // Show context for each
  let pos = 0;
  while ((pos = html.indexOf('audioCtx', pos)) !== -1) {
    if (html[pos + 8] !== '2') {
      console.log('  at char', pos, ':', JSON.stringify(html.slice(Math.max(0,pos-20), pos+30)));
    }
    pos++;
  }
}

// ── 7. Write file
fs.writeFileSync('C:/Users/jmurp/OneDrive/Desktop/TruckDriver/games/space-dodge/index.html', html, 'utf8');
console.log('File written.');
