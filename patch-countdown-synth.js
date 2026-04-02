const fs = require('fs');
let html = fs.readFileSync('C:/Users/jmurp/OneDrive/Desktop/TruckDriver/games/space-dodge/index.html', 'utf8');

// ── 1. Remove countdown and go entries from SOUNDS constant
// Each entry is: a comment line + a key: 'data:...' line
// We'll strip both the comment and the data URI line for each

// Pattern: optional leading comma/newline, comment line, then the key line with base64 data
// countdown entry
html = html.replace(/\n  \/\/ "?3-2-1 beeps[^\n]*\n  countdown: 'data:audio\/[^']+',?/g, '');
// go entry
html = html.replace(/\n  \/\/ "?["]?GO!["]?[^\n]*\n  go: 'data:audio\/[^']+',?/g, '');

console.log('Removed countdown/go from SOUNDS:', !html.includes("countdown: 'data:") && !html.includes("go: 'data:"));

// ── 2. Replace the playS() function to add synth special-cases
const oldPlayS = `function playS(key) {
  if (muted || !soundsInited || !soundBuffers[key]) return;
  try {
    const snd = soundBuffers[key].cloneNode();
    snd.volume = 0.7;
    snd.play().catch(() => {});
  } catch(e) {}
}`;

const newPlayS = `function playS(key) {
  if (muted || !soundsInited) return;
  // Synthesized tones for countdown/go — cleaner than the clip overlaps
  if (key === 'countdown') {
    try {
      const osc = audioCtx2.createOscillator();
      const g = audioCtx2.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(660, audioCtx2.currentTime);
      g.gain.setValueAtTime(0.18, audioCtx2.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, audioCtx2.currentTime + 0.1);
      osc.connect(g); g.connect(audioCtx2.destination);
      osc.start(audioCtx2.currentTime); osc.stop(audioCtx2.currentTime + 0.1);
    } catch(e) {}
    return;
  }
  if (key === 'go') {
    try {
      const osc = audioCtx2.createOscillator();
      const g = audioCtx2.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx2.currentTime);
      g.gain.setValueAtTime(0.25, audioCtx2.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, audioCtx2.currentTime + 0.2);
      osc.connect(g); g.connect(audioCtx2.destination);
      osc.start(audioCtx2.currentTime); osc.stop(audioCtx2.currentTime + 0.2);
    } catch(e) {}
    return;
  }
  if (!soundBuffers[key]) return;
  try {
    const snd = soundBuffers[key].cloneNode();
    snd.volume = 0.7;
    snd.play().catch(() => {});
  } catch(e) {}
}`;

if (!html.includes(oldPlayS)) {
  console.error('Could not find playS() function — check whitespace');
  process.exit(1);
}
html = html.replace(oldPlayS, newPlayS);
console.log('playS() updated with synth special-cases.');

// ── 3. Write
fs.writeFileSync('C:/Users/jmurp/OneDrive/Desktop/TruckDriver/games/space-dodge/index.html', html, 'utf8');
console.log('File written.');
