#!/usr/bin/env node
// patch-batch3-epics.js — Add Batch 3 Epic fish (King Crab, Goliath Lobster, Tiger Prawn, Nautilus, Starfish)
const fs = require('fs');

const GAME_FILE = 'games/catch-and-reel/index.html';

// SVGs from mockup — width/height corrected to 160x100, xmlns added
// IDs already uniquified with e0_..e4_ prefixes in the mockup
const RAW_SVGS = {
  'King Crab': `<svg width="160" height="100" viewBox="0 0 160 100" xmlns="http://www.w3.org/2000/svg">
<defs>
  <radialGradient id="e0_shell" cx="50%" cy="40%" r="50%">
    <stop offset="0%" stop-color="#ff6b4a"/>
    <stop offset="50%" stop-color="#d4381f"/>
    <stop offset="100%" stop-color="#8b1a0e"/>
  </radialGradient>
  <radialGradient id="e0_glow" cx="50%" cy="50%" r="50%">
    <stop offset="0%" stop-color="#ff6b4a" stop-opacity="0.3"/>
    <stop offset="70%" stop-color="#ff3c1a" stop-opacity="0.08"/>
    <stop offset="100%" stop-color="#ff3c1a" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="e0_claw" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="#e8523a"/>
    <stop offset="100%" stop-color="#a02010"/>
  </linearGradient>
  <linearGradient id="e0_leg" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#cc3d22"/>
    <stop offset="100%" stop-color="#8b1a0e"/>
  </linearGradient>
  <linearGradient id="e0_crown" x1="0" y1="1" x2="0" y2="0">
    <stop offset="0%" stop-color="#daa520"/>
    <stop offset="50%" stop-color="#ffd700"/>
    <stop offset="100%" stop-color="#ffe066"/>
  </linearGradient>
  <filter id="e0_aura">
    <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur"/>
    <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0.3  0 0.2 0 0 0  0 0 0.1 0 0  0 0 0 0.6 0" result="glow"/>
    <feMerge><feMergeNode in="glow"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
  <clipPath id="e0_bodyClip"><ellipse cx="80" cy="46" rx="28" ry="20"/></clipPath>
</defs>
<ellipse cx="80" cy="52" rx="55" ry="35" fill="url(#e0_glow)"/>
<g filter="url(#e0_aura)">
  <path d="M58,52 Q42,60 28,74" stroke="url(#e0_leg)" stroke-width="3" fill="none" stroke-linecap="round"/>
  <path d="M60,48 Q40,50 22,60" stroke="url(#e0_leg)" stroke-width="3" fill="none" stroke-linecap="round"/>
  <path d="M62,44 Q42,38 24,44" stroke="url(#e0_leg)" stroke-width="3" fill="none" stroke-linecap="round"/>
  <path d="M64,40 Q50,30 32,30" stroke="url(#e0_leg)" stroke-width="3" fill="none" stroke-linecap="round"/>
  <path d="M102,52 Q118,60 132,74" stroke="url(#e0_leg)" stroke-width="3" fill="none" stroke-linecap="round"/>
  <path d="M100,48 Q120,50 138,60" stroke="url(#e0_leg)" stroke-width="3" fill="none" stroke-linecap="round"/>
  <path d="M98,44 Q118,38 136,44" stroke="url(#e0_leg)" stroke-width="3" fill="none" stroke-linecap="round"/>
  <path d="M96,40 Q110,30 128,30" stroke="url(#e0_leg)" stroke-width="3" fill="none" stroke-linecap="round"/>
  <path d="M60,56 Q38,66 26,58" stroke="url(#e0_leg)" stroke-width="4" fill="none" stroke-linecap="round"/>
  <ellipse cx="22" cy="54" rx="10" ry="7" fill="url(#e0_claw)" stroke="#6b1008" stroke-width="0.8"/>
  <path d="M14,50 Q22,46 28,50" stroke="#6b1008" stroke-width="1" fill="none"/>
  <path d="M15,52 L13,50" stroke="#ffd700" stroke-width="0.8"/>
  <path d="M18,51 L17,49" stroke="#ffd700" stroke-width="0.8"/>
  <path d="M100,56 Q122,66 136,56" stroke="url(#e0_leg)" stroke-width="4.5" fill="none" stroke-linecap="round"/>
  <ellipse cx="140" cy="52" rx="13" ry="9" fill="url(#e0_claw)" stroke="#6b1008" stroke-width="0.8"/>
  <path d="M130,47 Q140,42 150,48" stroke="#6b1008" stroke-width="1.2" fill="none"/>
  <path d="M132,50 L130,48" stroke="#ffd700" stroke-width="0.8"/>
  <path d="M136,49 L135,46" stroke="#ffd700" stroke-width="0.8"/>
  <path d="M140,49 L140,46" stroke="#ffd700" stroke-width="0.8"/>
</g>
<ellipse cx="80" cy="46" rx="28" ry="20" fill="url(#e0_shell)" stroke="#6b1008" stroke-width="1"/>
<g clip-path="url(#e0_bodyClip)">
  <circle cx="72" cy="38" r="2.5" fill="#e8523a" opacity="0.6"/>
  <circle cx="88" cy="38" r="2.5" fill="#e8523a" opacity="0.6"/>
  <circle cx="80" cy="34" r="3" fill="#e8523a" opacity="0.6"/>
  <circle cx="75" cy="46" r="2" fill="#c03020" opacity="0.5"/>
  <circle cx="85" cy="46" r="2" fill="#c03020" opacity="0.5"/>
  <ellipse cx="74" cy="40" rx="8" ry="5" fill="white" opacity="0.12"/>
</g>
<path d="M60,28 L63,16 L67,24 L71,12 L75,22 L80,10 L85,22 L89,12 L93,24 L97,16 L100,28" fill="url(#e0_crown)" stroke="#b8860b" stroke-width="0.7"/>
<circle cx="71" cy="16" r="1.8" fill="#ff0040" stroke="#cc0033" stroke-width="0.4"/>
<circle cx="80" cy="14" r="2.2" fill="#ff0040" stroke="#cc0033" stroke-width="0.4"/>
<circle cx="89" cy="16" r="1.8" fill="#ff0040" stroke="#cc0033" stroke-width="0.4"/>
<circle cx="72" cy="40" r="3.5" fill="#1a0800" stroke="#ffd700" stroke-width="0.8"/>
<circle cx="71" cy="39" r="1.2" fill="white"/>
<circle cx="88" cy="40" r="3.5" fill="#1a0800" stroke="#ffd700" stroke-width="0.8"/>
<circle cx="87" cy="39" r="1.2" fill="white"/>
<path d="M77,50 Q80,52 83,50" stroke="#4a0800" stroke-width="1" fill="none"/>
</svg>`,

  'Goliath Lobster': `<svg width="160" height="100" viewBox="0 0 160 100" xmlns="http://www.w3.org/2000/svg">
<defs>
  <linearGradient id="e1_body" x1="0" y1="0" x2="1" y2="0.5">
    <stop offset="0%" stop-color="#c62828"/>
    <stop offset="40%" stop-color="#8e1318"/>
    <stop offset="100%" stop-color="#4a0a0e"/>
  </linearGradient>
  <radialGradient id="e1_glow" cx="50%" cy="50%" r="50%">
    <stop offset="0%" stop-color="#c62828" stop-opacity="0.25"/>
    <stop offset="100%" stop-color="#c62828" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="e1_claw" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="#d43030"/>
    <stop offset="100%" stop-color="#7a1015"/>
  </linearGradient>
  <linearGradient id="e1_sheen" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#5533aa" stop-opacity="0.3"/>
    <stop offset="100%" stop-color="#2211aa" stop-opacity="0"/>
  </linearGradient>
  <filter id="e1_aura">
    <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur"/>
    <feColorMatrix in="blur" type="matrix" values="0.8 0 0 0 0.1  0 0.1 0 0 0  0 0 0.2 0 0  0 0 0 0.5 0"/>
    <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
  <clipPath id="e1_bodyClip">
    <path d="M40,35 Q55,22 85,25 Q100,27 110,35 Q115,42 115,50 Q115,58 100,62 Q85,65 55,62 Q40,58 38,50 Q36,42 40,35Z"/>
  </clipPath>
</defs>
<ellipse cx="75" cy="50" rx="65" ry="35" fill="url(#e1_glow)"/>
<g filter="url(#e1_aura)">
  <path d="M46,34 Q30,18 15,10" stroke="#b02020" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  <path d="M48,32 Q35,14 28,5" stroke="#b02020" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  <path d="M44,38 Q35,32 28,30" stroke="#c03535" stroke-width="1" fill="none"/>
  <path d="M44,40 Q34,36 26,36" stroke="#c03535" stroke-width="1" fill="none"/>
  <path d="M60,60 Q55,72 48,80" stroke="#8e1318" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <path d="M70,62 Q68,74 62,82" stroke="#8e1318" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <path d="M80,62 Q82,74 80,84" stroke="#8e1318" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <path d="M90,60 Q94,72 96,80" stroke="#8e1318" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <path d="M112,42 Q125,38 132,30 Q134,40 130,50 Q134,60 132,68 Q125,60 112,56" fill="#7a1015" stroke="#4a0a0e" stroke-width="0.8"/>
  <path d="M40,35 Q55,22 85,25 Q100,27 110,35 Q115,42 115,50 Q115,58 100,62 Q85,65 55,62 Q40,58 38,50 Q36,42 40,35Z" fill="url(#e1_body)" stroke="#4a0a0e" stroke-width="1"/>
  <g clip-path="url(#e1_bodyClip)">
    <path d="M65,24 L63,64" stroke="#4a0a0e" stroke-width="0.6" opacity="0.4"/>
    <path d="M78,24 L76,64" stroke="#4a0a0e" stroke-width="0.6" opacity="0.4"/>
    <path d="M90,26 L88,64" stroke="#4a0a0e" stroke-width="0.6" opacity="0.4"/>
    <path d="M100,30 L100,62" stroke="#4a0a0e" stroke-width="0.6" opacity="0.4"/>
    <ellipse cx="70" cy="40" rx="20" ry="10" fill="url(#e1_sheen)"/>
    <circle cx="60" cy="42" r="1.5" fill="#d43030" opacity="0.4"/>
    <circle cx="75" cy="38" r="1.5" fill="#d43030" opacity="0.4"/>
    <circle cx="85" cy="45" r="1.5" fill="#d43030" opacity="0.4"/>
    <ellipse cx="65" cy="36" rx="12" ry="6" fill="white" opacity="0.08"/>
  </g>
  <path d="M42,42 Q28,38 18,32" stroke="#8e1318" stroke-width="4" fill="none" stroke-linecap="round"/>
  <ellipse cx="14" cy="28" rx="14" ry="10" fill="url(#e1_claw)" stroke="#4a0a0e" stroke-width="0.8"/>
  <path d="M4,22 Q14,16 22,22" stroke="#4a0a0e" stroke-width="1.2" fill="none"/>
  <path d="M8,24 L6,21" stroke="#ffa500" stroke-width="0.8"/>
  <path d="M12,23 L11,20" stroke="#ffa500" stroke-width="0.8"/>
  <path d="M16,23 L16,19" stroke="#ffa500" stroke-width="0.8"/>
  <path d="M20,24 L21,21" stroke="#ffa500" stroke-width="0.8"/>
  <path d="M44,48 Q32,52 22,50" stroke="#8e1318" stroke-width="3" fill="none" stroke-linecap="round"/>
  <ellipse cx="18" cy="48" rx="9" ry="6" fill="url(#e1_claw)" stroke="#4a0a0e" stroke-width="0.7"/>
  <path d="M11,44 Q18,41 24,44" stroke="#4a0a0e" stroke-width="0.8" fill="none"/>
</g>
<circle cx="48" cy="38" r="4" fill="#0a0000" stroke="#ffa500" stroke-width="0.8"/>
<circle cx="47" cy="37" r="1.5" fill="#ff6600"/>
<circle cx="46.5" cy="36.5" r="0.7" fill="white"/>
</svg>`,

  'Tiger Prawn': `<svg width="160" height="100" viewBox="0 0 160 100" xmlns="http://www.w3.org/2000/svg">
<defs>
  <linearGradient id="e2_body" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0%" stop-color="#f5c8b0"/>
    <stop offset="50%" stop-color="#f0a888"/>
    <stop offset="100%" stop-color="#e88a6a"/>
  </linearGradient>
  <radialGradient id="e2_glow" cx="50%" cy="50%" r="50%">
    <stop offset="0%" stop-color="#ff6b4a" stop-opacity="0.2"/>
    <stop offset="100%" stop-color="#ff6b4a" stop-opacity="0"/>
  </radialGradient>
  <filter id="e2_aura">
    <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur"/>
    <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0.2  0 0.3 0 0 0  0 0 0.2 0 0  0 0 0 0.4 0"/>
    <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
  <clipPath id="e2_bodyClip">
    <path d="M30,38 Q40,28 55,30 Q80,28 100,32 Q120,36 128,44 Q132,50 128,56 Q120,62 100,60 Q80,62 55,60 Q40,62 32,56 Q28,50 30,38Z"/>
  </clipPath>
</defs>
<ellipse cx="80" cy="50" rx="60" ry="30" fill="url(#e2_glow)"/>
<g filter="url(#e2_aura)">
  <path d="M34,36 Q18,20 5,8" stroke="#e88a6a" stroke-width="1" fill="none" stroke-linecap="round"/>
  <path d="M36,34 Q22,16 15,4" stroke="#e88a6a" stroke-width="1" fill="none" stroke-linecap="round"/>
  <path d="M33,40 Q22,34 14,32" stroke="#f0a888" stroke-width="0.7" fill="none"/>
  <path d="M33,42 Q24,38 16,38" stroke="#f0a888" stroke-width="0.7" fill="none"/>
  <path d="M50,58 Q48,68 44,76" stroke="#d08060" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  <path d="M60,60 Q58,70 55,78" stroke="#d08060" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  <path d="M72,60 Q72,72 70,80" stroke="#d08060" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  <path d="M84,60 Q86,72 86,78" stroke="#d08060" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  <path d="M96,58 Q100,68 102,76" stroke="#d08060" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  <path d="M128,44 Q140,38 148,34 Q146,44 142,50 Q146,56 148,66 Q140,62 128,56" fill="#e8a070" stroke="#aa6040" stroke-width="0.7"/>
  <path d="M32,38 L12,30 L14,34 L32,40" fill="#d08060" stroke="#aa6040" stroke-width="0.5"/>
  <path d="M18,31 L16,28" stroke="#cc7050" stroke-width="0.6"/>
  <path d="M22,32 L20,29" stroke="#cc7050" stroke-width="0.6"/>
  <path d="M26,34 L24,31" stroke="#cc7050" stroke-width="0.6"/>
  <path d="M30,38 Q40,28 55,30 Q80,28 100,32 Q120,36 128,44 Q132,50 128,56 Q120,62 100,60 Q80,62 55,60 Q40,62 32,56 Q28,50 30,38Z" fill="url(#e2_body)" stroke="#aa6040" stroke-width="0.8"/>
  <g clip-path="url(#e2_bodyClip)">
    <path d="M45,28 Q48,44 42,64" stroke="#8b3a20" stroke-width="4" fill="none" opacity="0.7"/>
    <path d="M58,26 Q62,44 56,64" stroke="#8b3a20" stroke-width="4" fill="none" opacity="0.7"/>
    <path d="M72,26 Q76,44 72,64" stroke="#8b3a20" stroke-width="4" fill="none" opacity="0.65"/>
    <path d="M86,28 Q90,44 86,64" stroke="#8b3a20" stroke-width="4" fill="none" opacity="0.6"/>
    <path d="M100,30 Q104,46 100,62" stroke="#8b3a20" stroke-width="3.5" fill="none" opacity="0.55"/>
    <path d="M112,34 Q116,48 114,60" stroke="#8b3a20" stroke-width="3" fill="none" opacity="0.5"/>
    <ellipse cx="65" cy="40" rx="20" ry="8" fill="white" opacity="0.1"/>
  </g>
</g>
<circle cx="38" cy="42" r="3.5" fill="#0a0500" stroke="#ffd700" stroke-width="0.7"/>
<circle cx="37" cy="41" r="1.2" fill="#ff8800"/>
<circle cx="36.5" cy="40.5" r="0.5" fill="white"/>
</svg>`,

  'Nautilus': `<svg width="160" height="100" viewBox="0 0 160 100" xmlns="http://www.w3.org/2000/svg">
<defs>
  <radialGradient id="e3_shell" cx="45%" cy="45%" r="50%">
    <stop offset="0%" stop-color="#f5e6d0"/>
    <stop offset="30%" stop-color="#e8c8a0"/>
    <stop offset="60%" stop-color="#c4885a"/>
    <stop offset="100%" stop-color="#8b5a32"/>
  </radialGradient>
  <radialGradient id="e3_glow" cx="50%" cy="50%" r="50%">
    <stop offset="0%" stop-color="#ff8844" stop-opacity="0.2"/>
    <stop offset="100%" stop-color="#cc6622" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="e3_inner" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="#fdf0e0"/>
    <stop offset="50%" stop-color="#f5dcc8"/>
    <stop offset="100%" stop-color="#e8c4a0"/>
  </linearGradient>
  <linearGradient id="e3_tentacle" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0%" stop-color="#d4a878"/>
    <stop offset="100%" stop-color="#c49468"/>
  </linearGradient>
  <filter id="e3_aura">
    <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur"/>
    <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 0.5 0 0 0  0 0 0.3 0 0  0 0 0 0.5 0"/>
    <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
  <clipPath id="e3_shellClip">
    <circle cx="88" cy="48" r="34"/>
  </clipPath>
</defs>
<ellipse cx="80" cy="50" rx="60" ry="40" fill="url(#e3_glow)"/>
<g filter="url(#e3_aura)">
  <path d="M58,58 Q42,62 30,56 Q22,50 18,42" stroke="url(#e3_tentacle)" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <path d="M56,62 Q40,68 26,64 Q16,58 12,48" stroke="url(#e3_tentacle)" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path d="M58,54 Q44,52 32,44 Q24,36 20,28" stroke="url(#e3_tentacle)" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path d="M56,66 Q44,74 34,76 Q24,74 18,66" stroke="url(#e3_tentacle)" stroke-width="1.8" fill="none" stroke-linecap="round"/>
  <path d="M60,50 Q48,44 38,34 Q30,24 28,16" stroke="url(#e3_tentacle)" stroke-width="1.8" fill="none" stroke-linecap="round"/>
  <path d="M54,68 Q40,78 28,80" stroke="#c49468" stroke-width="1.2" fill="none" stroke-linecap="round"/>
  <path d="M62,48 Q52,38 44,26" stroke="#c49468" stroke-width="1.2" fill="none" stroke-linecap="round"/>
  <path d="M56,70 Q46,82 38,86" stroke="#c49468" stroke-width="1" fill="none" stroke-linecap="round"/>
  <circle cx="88" cy="48" r="34" fill="url(#e3_shell)" stroke="#6b3a1a" stroke-width="1.2"/>
  <g clip-path="url(#e3_shellClip)">
    <path d="M88,48 Q78,20 105,16" stroke="#8b4513" stroke-width="2.5" fill="none" opacity="0.6"/>
    <path d="M88,48 Q110,22 120,32" stroke="#8b4513" stroke-width="2.5" fill="none" opacity="0.55"/>
    <path d="M88,48 Q118,40 120,52" stroke="#8b4513" stroke-width="2.5" fill="none" opacity="0.5"/>
    <path d="M88,48 Q116,58 112,68" stroke="#8b4513" stroke-width="2.5" fill="none" opacity="0.5"/>
    <path d="M88,48 Q104,72 92,78" stroke="#8b4513" stroke-width="2.5" fill="none" opacity="0.5"/>
    <path d="M88,48 Q80,76 68,74" stroke="#8b4513" stroke-width="2.5" fill="none" opacity="0.5"/>
    <path d="M88,48 Q64,66 60,56" stroke="#8b4513" stroke-width="2.5" fill="none" opacity="0.5"/>
    <path d="M88,48 Q62,42 66,30" stroke="#8b4513" stroke-width="2.5" fill="none" opacity="0.55"/>
    <path d="M88,48 Q72,24 84,18" stroke="#8b4513" stroke-width="2.5" fill="none" opacity="0.55"/>
    <path d="M88,48 Q92,42 96,40 Q104,38 108,42 Q112,48 108,56 Q102,64 92,66 Q80,66 72,58 Q66,50 68,40 Q72,30 82,26" stroke="#6b3a1a" stroke-width="1.2" fill="none" opacity="0.6"/>
    <circle cx="90" cy="46" r="6" fill="url(#e3_inner)" stroke="#a07050" stroke-width="0.6" opacity="0.8"/>
    <ellipse cx="82" cy="38" rx="12" ry="10" fill="white" opacity="0.1"/>
    <ellipse cx="98" cy="54" rx="8" ry="6" fill="#ffeedd" opacity="0.08"/>
    <ellipse cx="76" cy="50" rx="6" ry="8" fill="#aaccee" opacity="0.08"/>
    <ellipse cx="100" cy="40" rx="5" ry="7" fill="#eeccaa" opacity="0.06"/>
  </g>
  <path d="M56,38 Q58,30 64,26 Q70,24 74,28 Q66,32 62,40 Q58,50 60,60 Q62,68 68,72 Q64,74 58,70 Q52,64 52,54 Q52,44 56,38Z" fill="url(#e3_inner)" stroke="#a07050" stroke-width="0.8" opacity="0.9"/>
</g>
<circle cx="62" cy="44" r="4.5" fill="#0a0800" stroke="#d4a878" stroke-width="0.8"/>
<circle cx="61" cy="43" r="2" fill="#443322"/>
<circle cx="60" cy="42" r="0.8" fill="#aa8866"/>
<circle cx="59.5" cy="41.5" r="0.4" fill="white"/>
<path d="M58,38 Q62,34 68,36 Q64,38 60,42Z" fill="#d4a878" stroke="#a07050" stroke-width="0.4"/>
</svg>`,

  'Starfish': `<svg width="160" height="100" viewBox="0 0 160 100" xmlns="http://www.w3.org/2000/svg">
<defs>
  <radialGradient id="e4_body" cx="50%" cy="50%" r="55%">
    <stop offset="0%" stop-color="#e85530"/>
    <stop offset="40%" stop-color="#cc3815"/>
    <stop offset="100%" stop-color="#982a10"/>
  </radialGradient>
  <radialGradient id="e4_glow" cx="50%" cy="50%" r="50%">
    <stop offset="0%" stop-color="#ff6b35" stop-opacity="0.3"/>
    <stop offset="100%" stop-color="#ff4420" stop-opacity="0"/>
  </radialGradient>
  <filter id="e4_aura">
    <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur"/>
    <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0.2  0 0.3 0 0 0  0 0 0.1 0 0  0 0 0 0.5 0"/>
    <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
  <clipPath id="e4_starClip">
    <path d="M80,6 L88,36 L118,36 L94,54 L102,84 L80,68 L58,84 L66,54 L42,36 L72,36Z"/>
  </clipPath>
</defs>
<ellipse cx="80" cy="50" rx="55" ry="42" fill="url(#e4_glow)"/>
<g filter="url(#e4_aura)">
  <path d="M80,6 L88,36 L118,36 L94,54 L102,84 L80,68 L58,84 L66,54 L42,36 L72,36Z" fill="url(#e4_body)" stroke="#7a1505" stroke-width="1.2"/>
  <g clip-path="url(#e4_starClip)">
    <line x1="80" y1="50" x2="80" y2="8" stroke="#aa2812" stroke-width="1.5" opacity="0.5"/>
    <line x1="80" y1="50" x2="116" y2="36" stroke="#aa2812" stroke-width="1.5" opacity="0.5"/>
    <line x1="80" y1="50" x2="101" y2="82" stroke="#aa2812" stroke-width="1.5" opacity="0.5"/>
    <line x1="80" y1="50" x2="59" y2="82" stroke="#aa2812" stroke-width="1.5" opacity="0.5"/>
    <line x1="80" y1="50" x2="44" y2="36" stroke="#aa2812" stroke-width="1.5" opacity="0.5"/>
    <g fill="#f0e8dd" opacity="0.85">
      <circle cx="78" cy="12" r="1.4"/><circle cx="82" cy="14" r="1.2"/>
      <circle cx="79" cy="20" r="1.5"/><circle cx="83" cy="22" r="1.1"/>
      <circle cx="77" cy="22" r="1.1"/><circle cx="81" cy="28" r="1.3"/>
      <circle cx="79" cy="32" r="1.0"/><circle cx="76" cy="16" r="0.9"/>
      <circle cx="84" cy="17" r="0.9"/><circle cx="80" cy="25" r="1.0"/>
      <circle cx="108" cy="36" r="1.3"/><circle cx="104" cy="38" r="1.1"/>
      <circle cx="100" cy="36" r="1.4"/><circle cx="96" cy="38" r="1.0"/>
      <circle cx="112" cy="36" r="1.0"/><circle cx="92" cy="40" r="1.2"/>
      <circle cx="106" cy="34" r="1.0"/><circle cx="96" cy="36" r="0.9"/>
      <circle cx="88" cy="38" r="1.1"/>
      <circle cx="100" cy="78" r="1.3"/><circle cx="98" cy="72" r="1.1"/>
      <circle cx="96" cy="66" r="1.4"/><circle cx="94" cy="60" r="1.0"/>
      <circle cx="100" cy="70" r="1.0"/><circle cx="92" cy="56" r="1.2"/>
      <circle cx="98" cy="64" r="0.9"/><circle cx="96" cy="74" r="1.1"/>
      <circle cx="60" cy="78" r="1.3"/><circle cx="62" cy="72" r="1.1"/>
      <circle cx="64" cy="66" r="1.4"/><circle cx="66" cy="60" r="1.0"/>
      <circle cx="60" cy="70" r="1.0"/><circle cx="68" cy="56" r="1.2"/>
      <circle cx="62" cy="64" r="0.9"/><circle cx="64" cy="74" r="1.1"/>
      <circle cx="52" cy="36" r="1.3"/><circle cx="56" cy="38" r="1.1"/>
      <circle cx="60" cy="36" r="1.4"/><circle cx="64" cy="38" r="1.0"/>
      <circle cx="48" cy="36" r="1.0"/><circle cx="68" cy="40" r="1.2"/>
      <circle cx="54" cy="34" r="1.0"/><circle cx="64" cy="36" r="0.9"/>
      <circle cx="72" cy="38" r="1.1"/>
      <circle cx="80" cy="46" r="1.5"/><circle cx="76" cy="48" r="1.2"/>
      <circle cx="84" cy="48" r="1.2"/><circle cx="80" cy="52" r="1.3"/>
      <circle cx="74" cy="44" r="1.0"/><circle cx="86" cy="44" r="1.0"/>
      <circle cx="80" cy="42" r="1.1"/><circle cx="76" cy="54" r="1.0"/>
      <circle cx="84" cy="54" r="1.0"/>
    </g>
    <g fill="#f5ece0" opacity="0.55">
      <circle cx="74" cy="36" r="0.7"/><circle cx="86" cy="36" r="0.7"/>
      <circle cx="76" cy="10" r="0.7"/><circle cx="84" cy="10" r="0.7"/>
      <circle cx="90" cy="36" r="0.7"/><circle cx="70" cy="36" r="0.7"/>
    </g>
    <circle cx="78" cy="22" r="2.5" fill="white" opacity="0.1"/>
    <circle cx="104" cy="38" r="2" fill="white" opacity="0.08"/>
    <circle cx="56" cy="38" r="2" fill="white" opacity="0.08"/>
  </g>
</g>
</svg>`,
};

// Fish array entries — match existing field names (wMin/wMax/lMin/lMax) and uppercase rarity
const FISH_CONFIG = [
  { name: 'King Crab',       emoji: '\uD83E\uDD80', rarity: 'EPIC', wMin: 2.8,  wMax: 12.5, lMin: 25, lMax: 90  },
  { name: 'Goliath Lobster', emoji: '\uD83E\uDD9E', rarity: 'EPIC', wMin: 3.5,  wMax: 18.0, lMin: 30, lMax: 120 },
  { name: 'Tiger Prawn',     emoji: '\uD83E\uDD90', rarity: 'EPIC', wMin: 0.3,  wMax: 1.2,  lMin: 15, lMax: 35  },
  { name: 'Nautilus',        emoji: '\uD83D\uDC1A', rarity: 'EPIC', wMin: 0.8,  wMax: 2.5,  lMin: 15, lMax: 28  },
  { name: 'Starfish',        emoji: '\u2B50',       rarity: 'EPIC', wMin: 0.4,  wMax: 2.0,  lMin: 12, lMax: 40  },
];

function toBase64DataURI(svgStr) {
  return `data:image/svg+xml;base64,${Buffer.from(svgStr).toString('base64')}`;
}

console.log('=== Encoding Batch 3 Epic SVGs ===\n');
const encodedSVGs = {};
for (const [name, rawSvg] of Object.entries(RAW_SVGS)) {
  encodedSVGs[name] = toBase64DataURI(rawSvg);
  console.log(`✓ ${name}`);
}

function generateFishEntries() {
  const lines = ['  // Epics (Batch 3)'];
  for (const f of FISH_CONFIG) {
    lines.push(`  { name:'${f.name}', emoji:'${f.emoji}', rarity:'${f.rarity}', wMin:${f.wMin}, wMax:${f.wMax}, lMin:${f.lMin}, lMax:${f.lMax} },`);
  }
  return lines.join('\n');
}

function generateSVGEntries() {
  return FISH_CONFIG
    .filter(f => encodedSVGs[f.name])
    .map(f => `  "${f.name}": "${encodedSVGs[f.name]}",`)
    .join('\n');
}

console.log('\n=== Patching game file ===\n');
let game = fs.readFileSync(GAME_FILE, 'utf8');
const nl = game.includes('\r\n') ? '\r\n' : '\n';
console.log(`Line endings: ${nl === '\r\n' ? 'CRLF' : 'LF'}`);
let g = game.replace(/\r\n/g, '\n');

// Insert FISH array entries after last existing Epic (Anglerfish)
const anchorMarker = `{ name:'Anglerfish'`;
const anchorPos = g.indexOf(anchorMarker);
if (anchorPos === -1) { console.error('❌ Cannot find Anglerfish entry'); process.exit(1); }
const anchorLineEnd = g.indexOf('\n', anchorPos);
g = g.slice(0, anchorLineEnd + 1) + generateFishEntries() + '\n' + g.slice(anchorLineEnd + 1);
console.log('✓ Inserted FISH array entries after Anglerfish');

// Insert FISH_SVGS entries before closing
const svgClose = '\n};\n\n// Preload fish images';
const svgClosePos = g.indexOf(svgClose);
if (svgClosePos === -1) { console.error('❌ Cannot find FISH_SVGS closing'); process.exit(1); }
g = g.slice(0, svgClosePos) + '\n' + generateSVGEntries() + '\n' + g.slice(svgClosePos);
console.log('✓ Inserted FISH_SVGS entries');

if (nl === '\r\n') g = g.replace(/\n/g, '\r\n');
fs.writeFileSync(GAME_FILE, g, 'utf8');
console.log(`\n✅ Done! New file size: ${(fs.statSync(GAME_FILE).size / 1024 / 1024).toFixed(2)}MB`);
