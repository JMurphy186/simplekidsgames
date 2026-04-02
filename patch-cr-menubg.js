const fs = require('fs');

// Read the BG data file — extract the base64 src value
const bgRaw = fs.readFileSync('C:/Users/jmurp/OneDrive/Desktop/TruckDriver/catch_reel-MenuBG-Data.js', 'utf8');
const srcMatch = bgRaw.match(/MENU_BG_IMG\.src = "([^"]+)"/);
if (!srcMatch) { console.error('ERROR: Could not extract src from data file'); process.exit(1); }
const dataSrc = srcMatch[1]; // e.g. "data:image/jpeg;base64,..."
console.log('Extracted data URI, length:', dataSrc.length, 'chars');

let html = fs.readFileSync('C:/Users/jmurp/OneDrive/Desktop/TruckDriver/games/catch-and-reel/index.html', 'utf8');

// Replace the CSS background on #charSelect:
// Old:  background: #0B0E18; + background-image: radial-gradient(...)
// New:  background: #0B0E18; + background-image: url("data:...") with cover sizing
//       + a pseudo-overlay is handled by a ::before or by the existing semi-transparent inner elements
//       Actually simplest: replace background-image with the photo, add background-size/position,
//       and add a separate overlay using a gradient on top via multi-layer backgrounds.

const oldBg = `  background: #0B0E18;\n  z-index: 100;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  background-image: radial-gradient(ellipse at 50% 30%, #0f1a2e 0%, #0B0E18 70%);`;

// Use multi-layer background: dark overlay gradient on top of the photo
const newBg = `  background: #0B0E18;\n  z-index: 100;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  background-image: linear-gradient(rgba(0,0,0,0.30), rgba(0,0,0,0.30)), url("${dataSrc}");\n  background-size: cover, cover;\n  background-position: center, center;`;

if (!html.includes(oldBg)) { console.error('ERROR: Could not find #charSelect CSS block'); process.exit(1); }
html = html.replace(oldBg, newBg);
console.log('CSS background replaced on #charSelect.');

// Write
fs.writeFileSync('C:/Users/jmurp/OneDrive/Desktop/TruckDriver/games/catch-and-reel/index.html', html, 'utf8');
const sizeMB = (html.length / 1024 / 1024).toFixed(2);
console.log('File written. Size:', sizeMB, 'MB');

// Verify
console.log('Contains new background-image:', html.includes('linear-gradient(rgba(0,0,0,0.30)'));
console.log('Contains data:image/jpeg:', html.includes('data:image/jpeg;base64,/9j/'));
console.log('Old radial-gradient removed:', !html.includes('radial-gradient(ellipse at 50% 30%'));
