// patch-nova-wing.js — Replace Star Rider with Nova Wing in Space Dodge
'use strict';
const fs = require('fs');
const path = require('path');

const GAME_FILE = path.join(__dirname, 'games', 'space-dodge', 'index.html');
let raw = fs.readFileSync(GAME_FILE, 'utf8');
const hadCRLF = raw.includes('\r\n');
if (hadCRLF) raw = raw.replace(/\r\n/g, '\n');
console.log('Game file length:', raw.length);

// ============================================================
// Build the Nova Wing SVG
// ============================================================
const novaSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400" width="300" height="400">
  <defs>
    <!-- Body gradient: white-to-gray fuselage -->
    <linearGradient id="nw_bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F5F5F5"/>
      <stop offset="50%" stop-color="#E0E0E0"/>
      <stop offset="100%" stop-color="#BDBDBD"/>
    </linearGradient>
    <!-- Blue wing/panel gradient -->
    <linearGradient id="nw_blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#42A5F5"/>
      <stop offset="100%" stop-color="#1565C0"/>
    </linearGradient>
    <!-- Orange accent gradient -->
    <linearGradient id="nw_orangeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF9800"/>
      <stop offset="100%" stop-color="#E65100"/>
    </linearGradient>
    <!-- Nacelle gradient -->
    <linearGradient id="nw_nacelleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#90CAF9"/>
      <stop offset="50%" stop-color="#42A5F5"/>
      <stop offset="100%" stop-color="#1565C0"/>
    </linearGradient>
    <!-- Cockpit radial gradient -->
    <radialGradient id="nw_cockpitGrad" cx="40%" cy="30%" r="60%">
      <stop offset="0%" stop-color="#B3E5FC"/>
      <stop offset="50%" stop-color="#4FC3F7"/>
      <stop offset="100%" stop-color="#0288D1"/>
    </radialGradient>
    <!-- Cockpit shine -->
    <radialGradient id="nw_cockpitShine" cx="35%" cy="25%" r="55%">
      <stop offset="0%" stop-color="rgba(255,255,255,0.75)"/>
      <stop offset="100%" stop-color="rgba(255,255,255,0)"/>
    </radialGradient>
    <!-- Nose cone orange -->
    <linearGradient id="nw_noseGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFCC80"/>
      <stop offset="100%" stop-color="#E65100"/>
    </linearGradient>
    <!-- Engine glow -->
    <radialGradient id="nw_engineGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FF9800" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="#E65100" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <!-- ── LAYER 1: SWEPT WINGS (back) ── -->
  <!-- Left wing -->
  <polygon points="115,180 32,268 55,285 118,225" fill="url(#nw_blueGrad)" opacity="0.92"/>
  <!-- Right wing -->
  <polygon points="185,180 268,268 245,285 182,225" fill="url(#nw_blueGrad)" opacity="0.92"/>

  <!-- Wing orange racing stripes -->
  <!-- Left stripe -->
  <polygon points="100,205 42,262 52,270 112,215" fill="url(#nw_orangeGrad)" opacity="0.7"/>
  <!-- Right stripe -->
  <polygon points="200,205 258,262 248,270 188,215" fill="url(#nw_orangeGrad)" opacity="0.7"/>

  <!-- ── LAYER 2: ENGINE NACELLES (on wings) ── -->
  <!-- Left nacelle body -->
  <path d="M52,198 L78,198 L82,215 L84,258 L78,278 L52,278 L46,258 L48,215 Z"
        fill="url(#nw_nacelleGrad)" rx="6"/>
  <!-- Left nacelle highlight -->
  <rect x="55" y="202" width="10" height="50" rx="4" fill="rgba(255,255,255,0.25)"/>
  <!-- Left exhaust port -->
  <rect x="54" y="268" width="24" height="10" rx="3" fill="#0D1B2A"/>
  <!-- Left engine glow -->
  <ellipse cx="66" cy="280" rx="14" ry="6" fill="url(#nw_engineGlow)" opacity="0.85"/>

  <!-- Right nacelle body -->
  <path d="M222,198 L248,198 L252,215 L254,258 L248,278 L222,278 L216,258 L218,215 Z"
        fill="url(#nw_nacelleGrad)"/>
  <!-- Right nacelle highlight -->
  <rect x="235" y="202" width="10" height="50" rx="4" fill="rgba(255,255,255,0.25)"/>
  <!-- Right exhaust port -->
  <rect x="222" y="268" width="24" height="10" rx="3" fill="#0D1B2A"/>
  <!-- Right engine glow -->
  <ellipse cx="234" cy="280" rx="14" ry="6" fill="url(#nw_engineGlow)" opacity="0.85"/>

  <!-- ── LAYER 3: MAIN FUSELAGE ── -->
  <path d="M150,42 C150,42 130,80 122,130 C116,165 116,200 118,240 C120,265 130,295 150,310
           C170,295 180,265 182,240 C184,200 184,165 178,130 C170,80 150,42 150,42 Z"
        fill="url(#nw_bodyGrad)"/>

  <!-- Blue dorsal center stripe -->
  <path d="M150,70 L150,280" stroke="#42A5F5" stroke-width="3" opacity="0.25" fill="none"/>

  <!-- Blue panel accent lines — left side -->
  <line x1="133" y1="150" x2="128" y2="230" stroke="#42A5F5" stroke-width="1.5" opacity="0.35"/>
  <line x1="126" y1="160" x2="122" y2="220" stroke="#42A5F5" stroke-width="1" opacity="0.2"/>

  <!-- Blue panel accent lines — right side -->
  <line x1="167" y1="150" x2="172" y2="230" stroke="#42A5F5" stroke-width="1.5" opacity="0.35"/>
  <line x1="174" y1="160" x2="178" y2="220" stroke="#42A5F5" stroke-width="1" opacity="0.2"/>

  <!-- ── LAYER 4: NOSE CONE ── -->
  <path d="M142,65 L150,38 L158,65 C156,60 150,58 150,58 C150,58 144,60 142,65 Z"
        fill="url(#nw_noseGrad)"/>

  <!-- ── LAYER 5: INTAKE VENTS ── -->
  <!-- Left vents -->
  <rect x="119" y="188" width="12" height="3" rx="1" fill="#42A5F5" opacity="0.45"/>
  <rect x="119" y="195" width="10" height="3" rx="1" fill="#42A5F5" opacity="0.3"/>
  <!-- Right vents -->
  <rect x="169" y="188" width="12" height="3" rx="1" fill="#42A5F5" opacity="0.45"/>
  <rect x="171" y="195" width="10" height="3" rx="1" fill="#42A5F5" opacity="0.3"/>

  <!-- ── LAYER 6: COCKPIT DOME ── -->
  <ellipse cx="150" cy="145" rx="22" ry="28" fill="url(#nw_cockpitGrad)"/>
  <!-- Shine overlay -->
  <ellipse cx="150" cy="145" rx="22" ry="28" fill="url(#nw_cockpitShine)"/>
  <!-- Cockpit rim -->
  <ellipse cx="150" cy="145" rx="22" ry="28" fill="none" stroke="#0288D1" stroke-width="1.5" opacity="0.6"/>
  <!-- Pilot helmet -->
  <circle cx="150" cy="149" r="9" fill="#1A237E" opacity="0.85"/>
  <!-- Pilot visor highlight -->
  <path d="M144,143 Q150,139 156,143" stroke="#81D4FA" stroke-width="1.5" fill="none" opacity="0.7"/>

  <!-- ── LAYER 7: REAR THRUSTER HOUSING ── -->
  <path d="M130,295 C130,295 125,305 126,318 L150,322 L174,318 C175,305 170,295 170,295 Z"
        fill="#37474F"/>
  <!-- Main exhaust port -->
  <rect x="138" y="312" width="24" height="10" rx="4" fill="#0D1B2A"/>
  <!-- Main engine glow -->
  <ellipse cx="150" cy="324" rx="16" ry="7" fill="url(#nw_engineGlow)" opacity="0.9"/>

  <!-- ── LAYER 8: BODY SHINE (top highlight) ── -->
  <path d="M150,44 C150,44 136,78 130,120 C128,135 128,155 132,165 C138,148 144,130 150,115
           C156,130 162,148 168,165 C172,155 172,135 170,120 C164,78 150,44 150,44 Z"
        fill="rgba(255,255,255,0.18)"/>
</svg>`;

// Verify the SVG
if (!novaSVG.includes('width="300"') || !novaSVG.includes('height="400"')) {
  console.error('ERROR: SVG missing required width/height attributes!'); process.exit(1);
}
if (!novaSVG.includes('nw_bodyGrad') || !novaSVG.includes('nw_cockpitGrad')) {
  console.error('ERROR: SVG missing nw_ prefixed gradient IDs!'); process.exit(1);
}
console.log('✓ SVG validation passed. Length:', novaSVG.length);

// Base64 encode
const novaB64 = 'data:image/svg+xml;base64,' + Buffer.from(novaSVG).toString('base64');
console.log('✓ Base64 encoded. Length:', novaB64.length);

// ============================================================
// Replace the star_rider SHIPS entry
// ============================================================
const SHIPS_START = `const SHIPS = [\n  { id: 'star_rider',`;
const SHIPS_SHIP2 = `  { id: 'interceptor',`;

if (!raw.includes(SHIPS_START)) { console.error('ERROR: SHIPS start anchor not found!'); process.exit(1); }
if (!raw.includes(SHIPS_SHIP2)) { console.error('ERROR: interceptor anchor not found!'); process.exit(1); }

const insertBefore = raw.indexOf(SHIPS_SHIP2);
const insertFrom   = raw.indexOf(SHIPS_START) + 'const SHIPS = [\n'.length;

// The star_rider entry is everything from insertFrom to insertBefore
const starRiderEntry = raw.substring(insertFrom, insertBefore);
console.log('Star Rider entry length:', starRiderEntry.length);
console.log('Starts with:', starRiderEntry.substring(0, 50));

const novaEntry =
  `  { id: 'nova_wing', name: 'Nova Wing', type: 'Classic / Hero', accent: '#42A5F5', flameColors: ['#E65100','#FF9800','#FFCC80'], drawW: 1.8, drawH: 1.3,\n` +
  `    svg: '${novaB64}' },\n`;

raw = raw.substring(0, insertFrom) + novaEntry + raw.substring(insertBefore);
console.log('✓ Star Rider replaced with Nova Wing');

// ============================================================
// Syntax check on script block
// ============================================================
const scriptStart = raw.indexOf('<script>');
const scriptEnd   = raw.lastIndexOf('</script>');
const script = raw.substring(scriptStart + 8, scriptEnd);
try {
  new (require('vm').Script)(script);
  console.log('✓ Script syntax OK');
} catch(e) {
  console.error('SCRIPT ERROR:', e.message);
  process.exit(1);
}

// Verify nova_wing in output
if (!raw.includes("id: 'nova_wing'")) { console.error('ERROR: nova_wing not found in output!'); process.exit(1); }
if (raw.includes("id: 'star_rider'")) { console.error('ERROR: star_rider still present!'); process.exit(1); }
console.log('✓ nova_wing present, star_rider removed');

// ============================================================
// Write output
// ============================================================
if (hadCRLF) raw = raw.replace(/\n/g, '\r\n');
fs.writeFileSync(GAME_FILE, raw, 'utf8');
console.log('\n✅ Nova Wing patch applied!');
console.log('New file size:', fs.statSync(GAME_FILE).size, 'bytes');
