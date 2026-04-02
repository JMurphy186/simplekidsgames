// patch-ship-redesigns.js — Replace SVGs for Interceptor, Juggernaut, Star Cruiser
'use strict';
const fs = require('fs');
const path = require('path');

const GAME_FILE = path.join(__dirname, 'games', 'space-dodge', 'index.html');
let raw = fs.readFileSync(GAME_FILE, 'utf8');
const hadCRLF = raw.includes('\r\n');
if (hadCRLF) raw = raw.replace(/\r\n/g, '\n');
console.log('Game file length:', raw.length);

// Coordinate transform: mockup local coords → SVG coords
// Scale 2.0, center at (150, 185)
// SVG_x = 150 + local_x * 2,  SVG_y = 185 + local_y * 2

// ============================================================
// INTERCEPTOR SVG  (s1_ prefix)
// Stealth fighter: forward-swept wings, faceted body, green neon accents
// ============================================================
const interceptorSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400" width="300" height="400">
  <defs>
    <!-- Wing gradient: dark at tip (#111) to lighter near body (#2a2a2a) -->
    <linearGradient id="s1_wingGrad" x1="10" y1="185" x2="150" y2="185" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#111"/>
      <stop offset="100%" stop-color="#2a2a2a"/>
    </linearGradient>
    <!-- Nacelle gradient: top to bottom -->
    <linearGradient id="s1_nacGrad" x1="150" y1="169" x2="150" y2="245" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#333"/>
      <stop offset="100%" stop-color="#1a1a1a"/>
    </linearGradient>
    <!-- Body gradient: horizontal faceted stealth -->
    <linearGradient id="s1_bodyGrad" x1="110" y1="185" x2="190" y2="185" gradientUnits="userSpaceOnUse">
      <stop offset="0%"   stop-color="#2a2a2a"/>
      <stop offset="30%"  stop-color="#404040"/>
      <stop offset="50%"  stop-color="#4a4a4a"/>
      <stop offset="70%"  stop-color="#404040"/>
      <stop offset="100%" stop-color="#2a2a2a"/>
    </linearGradient>
    <!-- Visor gradient: green diamond tint -->
    <linearGradient id="s1_vizGrad" x1="134" y1="129" x2="166" y2="161" gradientUnits="userSpaceOnUse">
      <stop offset="0%"   stop-color="#004D40"/>
      <stop offset="50%"  stop-color="#00E676"/>
      <stop offset="100%" stop-color="#004D40"/>
    </linearGradient>
  </defs>

  <!-- LAYER 1: Forward-swept wings (back) -->
  <!-- Left wing: (-12,-5),(-68,-20),(-60,8),(-10,15) -->
  <polygon points="126,175 14,145 30,201 130,215" fill="url(#s1_wingGrad)"/>
  <!-- Right wing: (12,-5),(68,-20),(60,8),(10,15) -->
  <polygon points="174,175 286,145 270,201 170,215" fill="url(#s1_wingGrad)"/>

  <!-- Neon edge lines on leading wing edges -->
  <line x1="126" y1="175" x2="14" y2="145" stroke="#00E676" stroke-width="2.4" opacity="0.7"/>
  <line x1="174" y1="175" x2="286" y2="145" stroke="#00E676" stroke-width="2.4" opacity="0.7"/>

  <!-- LAYER 2: Twin engine nacelles -->
  <!-- Left: (-42,-8),(-34,-8),(-32,30),(-44,30) -->
  <polygon points="66,169 82,169 86,245 62,245" fill="url(#s1_nacGrad)"/>
  <!-- Left nacelle highlight strip -->
  <rect x="69" y="172" width="8" height="55" rx="2" fill="rgba(255,255,255,0.08)"/>
  <!-- Right: (42,-8),(34,-8),(32,30),(44,30) -->
  <polygon points="234,169 218,169 214,245 238,245" fill="url(#s1_nacGrad)"/>
  <!-- Right nacelle highlight strip -->
  <rect x="223" y="172" width="8" height="55" rx="2" fill="rgba(255,255,255,0.08)"/>
  <!-- Exhaust ports -->
  <rect x="64" y="237" width="20" height="10" rx="2" fill="#0D1B2A"/>
  <rect x="216" y="237" width="20" height="10" rx="2" fill="#0D1B2A"/>

  <!-- LAYER 3: Main body — angular stealth polygon -->
  <!-- (0,-55),(18,-20),(22,15),(16,38),(-16,38),(-22,15),(-18,-20) -->
  <polygon points="150,75 186,145 194,215 182,261 118,261 106,215 114,145"
           fill="url(#s1_bodyGrad)"/>

  <!-- Faceted panel seam lines -->
  <line x1="150" y1="85" x2="186" y2="145" stroke="rgba(0,230,118,0.2)" stroke-width="1.6"/>
  <line x1="150" y1="85" x2="114" y2="145" stroke="rgba(0,230,118,0.2)" stroke-width="1.6"/>
  <line x1="114" y1="145" x2="106" y2="215" stroke="rgba(0,230,118,0.2)" stroke-width="1.6"/>
  <line x1="186" y1="145" x2="194" y2="215" stroke="rgba(0,230,118,0.2)" stroke-width="1.6"/>
  <!-- Cross panel at y=5 local -->
  <line x1="118" y1="195" x2="182" y2="195" stroke="rgba(0,230,118,0.2)" stroke-width="1.6"/>

  <!-- Ventral green center stripe -->
  <rect x="146" y="105" width="8" height="140" fill="rgba(0,230,118,0.15)"/>

  <!-- LAYER 4: Cockpit visor — tinted green diamond -->
  <!-- (0,-32),(9,-18),(0,-10),(-9,-18) -->
  <polygon points="150,121 168,149 150,165 132,149" fill="url(#s1_vizGrad)"/>
  <!-- Visor shine highlight -->
  <!-- (-2,-30),(4,-22),(0,-18),(-4,-24) -->
  <polygon points="146,125 158,141 150,149 142,137" fill="rgba(255,255,255,0.25)"/>
  <!-- HUD glow dot -->
  <circle cx="150" cy="145" r="3" fill="#00E676"/>

  <!-- LAYER 5: Right-half body highlight -->
  <polygon points="150,75 170,145 160,215 150,261 150,75" fill="rgba(255,255,255,0.06)"/>
</svg>`;

// ============================================================
// JUGGERNAUT SVG  (s2_ prefix)
// Heavy armor: red/orange hull, plated armor, side cannons, cockpit slit
// ============================================================
const juggernautSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400" width="300" height="400">
  <defs>
    <!-- Main hull gradient: horizontal red/orange -->
    <linearGradient id="s2_hullGrad" x1="70" y1="185" x2="230" y2="185" gradientUnits="userSpaceOnUse">
      <stop offset="0%"   stop-color="#BF360C"/>
      <stop offset="30%"  stop-color="#E65100"/>
      <stop offset="50%"  stop-color="#FF6D00"/>
      <stop offset="70%"  stop-color="#E65100"/>
      <stop offset="100%" stop-color="#BF360C"/>
    </linearGradient>
    <!-- Armor plate gradient: vertical highlight -->
    <linearGradient id="s2_armorGrad" x1="150" y1="125" x2="150" y2="175" gradientUnits="userSpaceOnUse">
      <stop offset="0%"   stop-color="#FF8F00"/>
      <stop offset="100%" stop-color="#E65100"/>
    </linearGradient>
  </defs>

  <!-- LAYER 1: Heavy side cannons -->
  <!-- Left cannon body: rect(-58,-15, 12,50) -->
  <rect x="34" y="155" width="24" height="100" rx="3" fill="#4E342E"/>
  <!-- Right cannon body: rect(46,-15, 12,50) -->
  <rect x="242" y="155" width="24" height="100" rx="3" fill="#4E342E"/>
  <!-- Left barrel tip: rect(-57,-22, 10,8) -->
  <rect x="36" y="141" width="20" height="16" rx="2" fill="#3E2723"/>
  <!-- Right barrel tip: rect(47,-22, 10,8) -->
  <rect x="244" y="141" width="20" height="16" rx="2" fill="#3E2723"/>
  <!-- Cannon tip glow (subtle) -->
  <circle cx="46" cy="141" r="10" fill="rgba(255,109,0,0.25)"/>
  <circle cx="254" cy="141" r="10" fill="rgba(255,109,0,0.25)"/>

  <!-- LAYER 2: Triple engine cluster (housing only — no glow, Canvas handles exhaust) -->
  <!-- Center engine: rect(-8,35, 16,12) -->
  <rect x="134" y="255" width="32" height="24" rx="3" fill="#2a1a10"/>
  <!-- Side engines: rect(-30,32, 10,10) and rect(20,32, 10,10) -->
  <rect x="90" y="249" width="20" height="20" rx="3" fill="#2a1a10"/>
  <rect x="190" y="249" width="20" height="20" rx="3" fill="#2a1a10"/>

  <!-- LAYER 3: Main hull polygon -->
  <!-- (0,-45),(38,-25),(44,10),(40,35),(-40,35),(-44,10),(-38,-25) -->
  <polygon points="150,95 226,135 238,205 230,255 70,255 62,205 74,135"
           fill="url(#s2_hullGrad)"/>

  <!-- LAYER 4: Layered armor plates -->
  <!-- Upper plate: (-30,-28),(30,-28),(36,-5),(-36,-5) -->
  <polygon points="90,129 210,129 222,175 78,175" fill="url(#s2_armorGrad)"/>
  <!-- Upper plate edge highlight -->
  <line x1="90" y1="129" x2="210" y2="129" stroke="rgba(255,255,255,0.15)" stroke-width="2"/>

  <!-- Lower plate: (-34,2),(34,2),(38,28),(-38,28) -->
  <polygon points="82,189 218,189 226,241 74,241" fill="url(#s2_armorGrad)"/>
  <!-- Lower plate edge highlight -->
  <line x1="82" y1="189" x2="218" y2="189" stroke="rgba(255,255,255,0.15)" stroke-width="2"/>

  <!-- LAYER 5: Rivet details -->
  <!-- [(-25,-22),(25,-22),(-30,5),(30,5),(-32,22),(32,22)] -->
  <circle cx="100" cy="141" r="3" fill="rgba(255,255,255,0.2)"/>
  <circle cx="200" cy="141" r="3" fill="rgba(255,255,255,0.2)"/>
  <circle cx="90"  cy="195" r="3" fill="rgba(255,255,255,0.2)"/>
  <circle cx="210" cy="195" r="3" fill="rgba(255,255,255,0.2)"/>
  <circle cx="86"  cy="229" r="3" fill="rgba(255,255,255,0.2)"/>
  <circle cx="214" cy="229" r="3" fill="rgba(255,255,255,0.2)"/>

  <!-- LAYER 6: Armored cockpit slit -->
  <!-- Gold outer frame: rect(-22,-20, 44,5) -->
  <rect x="106" y="145" width="88" height="10" fill="#FFD54F"/>
  <!-- Dark visor center: rect(-18,-19, 36,3) -->
  <rect x="114" y="147" width="72" height="6" fill="#3E2723"/>
  <!-- Slit glow line: rect(-16,-18.5, 32,1.5) -->
  <rect x="118" y="148" width="64" height="3" fill="#FFD54F" opacity="0.6"/>

  <!-- LAYER 7: Panel seam lines -->
  <!-- Vertical center seam -->
  <line x1="150" y1="95" x2="150" y2="255" stroke="rgba(0,0,0,0.3)" stroke-width="1.6"/>
  <!-- Horizontal cross seam at y=10 local -->
  <line x1="62" y1="205" x2="238" y2="205" stroke="rgba(0,0,0,0.3)" stroke-width="1.6"/>

  <!-- LAYER 8: Right-half body highlight -->
  <!-- (0,-45),(20,-25),(22,10),(15,35),(0,35) -->
  <polygon points="150,95 190,135 194,205 180,255 150,255 150,95"
           fill="rgba(255,255,255,0.06)"/>
</svg>`;

// ============================================================
// STAR CRUISER SVG  (s3_ prefix)
// Speed racer: needle fuselage, gold delta wings, teardrop cockpit
// ============================================================
const cruiserSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400" width="300" height="400">
  <defs>
    <!-- Left wing gradient: amber at tip, gold at root -->
    <linearGradient id="s3_wingL" x1="30" y1="185" x2="150" y2="185" gradientUnits="userSpaceOnUse">
      <stop offset="0%"   stop-color="#FF8F00"/>
      <stop offset="50%"  stop-color="#FFCA28"/>
      <stop offset="100%" stop-color="#FFD54F"/>
    </linearGradient>
    <!-- Right wing gradient: gold at root, amber at tip -->
    <linearGradient id="s3_wingR" x1="150" y1="185" x2="270" y2="185" gradientUnits="userSpaceOnUse">
      <stop offset="0%"   stop-color="#FFD54F"/>
      <stop offset="50%"  stop-color="#FFCA28"/>
      <stop offset="100%" stop-color="#FF8F00"/>
    </linearGradient>
    <!-- Fuselage gradient: pearlescent white with darker edges -->
    <linearGradient id="s3_bodyGrad" x1="122" y1="185" x2="178" y2="185" gradientUnits="userSpaceOnUse">
      <stop offset="0%"   stop-color="#BDBDBD"/>
      <stop offset="20%"  stop-color="#EEEEEE"/>
      <stop offset="50%"  stop-color="#FFFFFF"/>
      <stop offset="80%"  stop-color="#EEEEEE"/>
      <stop offset="100%" stop-color="#BDBDBD"/>
    </linearGradient>
    <!-- Cockpit radial gradient: cyan teardrop -->
    <radialGradient id="s3_cockGrad" cx="150" cy="149" r="28"
                    fx="144" fy="141" gradientUnits="userSpaceOnUse">
      <stop offset="0%"   stop-color="#B3E5FC"/>
      <stop offset="40%"  stop-color="#4FC3F7"/>
      <stop offset="80%"  stop-color="#0288D1"/>
      <stop offset="100%" stop-color="#01579B"/>
    </radialGradient>
  </defs>

  <!-- LAYER 1: Gold delta wings (swept back) -->
  <!-- Left: (-8,0),(-55,28),(-48,38),(-6,18) -->
  <polygon points="134,185 40,241 54,261 138,221" fill="url(#s3_wingL)"/>
  <!-- Right: (8,0),(55,28),(48,38),(6,18) -->
  <polygon points="166,185 260,241 246,261 162,221" fill="url(#s3_wingR)"/>
  <!-- Trailing edge detail lines -->
  <line x1="40" y1="241" x2="54" y2="261" stroke="rgba(255,255,255,0.2)" stroke-width="1.6"/>
  <line x1="260" y1="241" x2="246" y2="261" stroke="rgba(255,255,255,0.2)" stroke-width="1.6"/>

  <!-- LAYER 2: Ion engine housing (Canvas handles exhaust glow) -->
  <!-- moveTo(-12,38) Q(0,46) (12,38) L(10,48) Q(0,54) (-10,48) -->
  <path d="M 126,261 Q 150,277 174,261 L 170,281 Q 150,293 130,281 Z"
        fill="#37474F"/>
  <!-- Exhaust port -->
  <rect x="136" y="277" width="28" height="10" rx="2" fill="#0D1B2A"/>

  <!-- LAYER 3: Sleek needle fuselage -->
  <!-- moveTo(0,-60) C(8,-45,14,-15,14,10) L(14,38) L(-14,38) L(-14,10) C(-14,-15,-8,-45,0,-60) -->
  <path d="M 150,65 C 166,95 178,155 178,205 L 178,261 L 122,261 L 122,205
           C 122,155 134,95 150,65 Z"
        fill="url(#s3_bodyGrad)"/>

  <!-- Gold racing stripes -->
  <!-- rect(-5,-55, 2.5,88) and rect(2.5,-55, 2.5,88) -->
  <rect x="140" y="75" width="5" height="176" fill="rgba(255,202,40,0.5)"/>
  <rect x="155" y="75" width="5" height="176" fill="rgba(255,202,40,0.5)"/>

  <!-- Panel lines -->
  <line x1="122" y1="205" x2="178" y2="205" stroke="rgba(0,0,0,0.1)" stroke-width="1.2"/>
  <line x1="122" y1="235" x2="178" y2="235" stroke="rgba(0,0,0,0.1)" stroke-width="1.2"/>

  <!-- Intake vents -->
  <rect x="124" y="209" width="16" height="4"  fill="rgba(255,202,40,0.35)"/>
  <rect x="160" y="209" width="16" height="4"  fill="rgba(255,202,40,0.35)"/>
  <rect x="126" y="219" width="12" height="3"  fill="rgba(255,202,40,0.35)"/>
  <rect x="162" y="219" width="12" height="3"  fill="rgba(255,202,40,0.35)"/>

  <!-- LAYER 4: Teardrop cockpit dome -->
  <!-- moveTo(0,-35) C(9,-28,10,-14,7,-5) L(-7,-5) C(-10,-14,-9,-28,0,-35) -->
  <path d="M 150,115 C 168,129 170,157 164,175 L 136,175
           C 130,157 132,129 150,115 Z"
        fill="url(#s3_cockGrad)"/>
  <!-- Cockpit gold rim -->
  <path d="M 150,115 C 168,129 170,157 164,175 L 136,175
           C 130,157 132,129 150,115 Z"
        fill="none" stroke="rgba(255,202,40,0.5)" stroke-width="2"/>
  <!-- Cockpit shine -->
  <!-- moveTo(-2,-32) C(3,-28,4,-22,2,-18) L(-1,-20) C(-3,-24,-3,-28,-2,-32) -->
  <path d="M 146,121 C 156,129 158,141 154,149 L 148,145
           C 144,137 144,129 146,121 Z"
        fill="rgba(255,255,255,0.3)"/>
  <!-- Pilot helmet -->
  <circle cx="150" cy="153" r="10" fill="#1A237E" opacity="0.7"/>
  <!-- Pilot visor highlight -->
  <!-- moveTo(-3,-19) Q(0,-22) (3,-19) -->
  <path d="M 144,147 Q 150,141 156,147" fill="none" stroke="#81D4FA" stroke-width="2"/>

  <!-- LAYER 5: Gold nose tip -->
  <!-- moveTo(0,-60) L(3,-52) L(-3,-52) -->
  <polygon points="150,65 156,81 144,81" fill="#FFCA28"/>

  <!-- LAYER 6: Right-half body highlight -->
  <!-- moveTo(0,-58) C(5,-40,8,-10,8,20) L(0,38) -->
  <path d="M 150,69 C 160,105 166,165 166,225 L 150,261 Z"
        fill="rgba(255,255,255,0.08)"/>
</svg>`;

// ============================================================
// Validate all three SVGs
// ============================================================
function validateSVG(svg, prefix, name) {
  if (!svg.includes(`width="300"`))  { console.error(name + ': missing width="300"');  process.exit(1); }
  if (!svg.includes(`height="400"`)) { console.error(name + ': missing height="400"'); process.exit(1); }
  if (!svg.includes(prefix + '_'))   { console.error(name + ': missing ' + prefix + '_ IDs'); process.exit(1); }
  console.log('✓', name, 'SVG valid. Length:', svg.length);
}
validateSVG(interceptorSVG, 's1', 'Interceptor');
validateSVG(juggernautSVG,  's2', 'Juggernaut');
validateSVG(cruiserSVG,     's3', 'Star Cruiser');

// ============================================================
// Base64 encode
// ============================================================
function encode(svg) {
  return 'data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64');
}
const b64_int = encode(interceptorSVG);
const b64_jug = encode(juggernautSVG);
const b64_sc  = encode(cruiserSVG);
console.log('✓ Interceptor b64 length:', b64_int.length);
console.log('✓ Juggernaut  b64 length:', b64_jug.length);
console.log('✓ Star Cruiser b64 length:', b64_sc.length);

// ============================================================
// Patch each ship entry: replace the svg: '...' value only
// ============================================================
function patchShip(raw, id, newB64) {
  const marker   = "{ id: '" + id + "'";
  const entryPos = raw.indexOf(marker);
  if (entryPos < 0) { console.error('ERROR: ' + id + ' entry not found'); process.exit(1); }

  const svgKey   = "    svg: '";
  const svgStart = raw.indexOf(svgKey, entryPos);
  if (svgStart < 0) { console.error('ERROR: svg key not found for ' + id); process.exit(1); }

  const valStart = svgStart + svgKey.length;
  const valEnd   = raw.indexOf("' },", valStart);
  if (valEnd < 0) { console.error('ERROR: svg value end not found for ' + id); process.exit(1); }

  const before = raw.substring(0, valStart);
  const after  = raw.substring(valEnd);
  return before + newB64 + after;
}

raw = patchShip(raw, 'interceptor', b64_int);
console.log('✓ Interceptor patched');
raw = patchShip(raw, 'juggernaut',  b64_jug);
console.log('✓ Juggernaut patched');
raw = patchShip(raw, 'cruiser',     b64_sc);
console.log('✓ Star Cruiser patched');

// ============================================================
// Syntax check
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

// ============================================================
// Verify IDs in decoded SVGs
// ============================================================
function verifyDecoded(b64, prefix, name) {
  const decoded = Buffer.from(b64.replace('data:image/svg+xml;base64,',''), 'base64').toString('utf8');
  if (!decoded.includes(prefix + '_')) {
    console.error('VERIFY FAIL: ' + name + ' missing ' + prefix + '_ prefix in decoded SVG');
    process.exit(1);
  }
  if (!decoded.includes('width="300"')) {
    console.error('VERIFY FAIL: ' + name + ' missing width="300" in decoded SVG');
    process.exit(1);
  }
}
// Find final b64 values in written file
const rFinal = raw;
function extractB64(r, id) {
  const marker   = "{ id: '" + id + "'";
  const entryPos = r.indexOf(marker);
  const svgKey   = "    svg: '";
  const svgStart = r.indexOf(svgKey, entryPos);
  const valStart = svgStart + svgKey.length;
  const valEnd   = r.indexOf("' },", valStart);
  return r.substring(valStart, valEnd);
}
verifyDecoded(extractB64(rFinal, 'interceptor'), 's1', 'Interceptor');
verifyDecoded(extractB64(rFinal, 'juggernaut'),  's2', 'Juggernaut');
verifyDecoded(extractB64(rFinal, 'cruiser'),     's3', 'Star Cruiser');
console.log('✓ All prefix IDs verified in decoded SVGs');

// ============================================================
// Write output
// ============================================================
if (hadCRLF) raw = raw.replace(/\n/g, '\r\n');
fs.writeFileSync(GAME_FILE, raw, 'utf8');
console.log('\n✅ All 3 ship redesigns patched!');
console.log('New file size:', require('fs').statSync(GAME_FILE).size, 'bytes');
