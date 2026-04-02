#!/usr/bin/env node
// patch-batch3-legendaries.js — Add Batch 3 Legendary fish
// (Lanternfish, Primordial Carp, Golden Idolfish, Treasurefish)
// NOTE: Treasurefish has its tilted crown group removed per spec.
const fs = require('fs');

const GAME_FILE = 'games/catch-and-reel/index.html';

// IDs already uniquified with l0_..l3_ prefixes. Crown group stripped from Treasurefish.
const RAW_SVGS = {
  'Lanternfish': `<svg width="160" height="100" viewBox="0 0 160 100" xmlns="http://www.w3.org/2000/svg">
<defs>
  <linearGradient id="l0_body" x1="0" y1="0" x2="1" y2="0.5">
    <stop offset="0%" stop-color="#1a2a4a"/>
    <stop offset="50%" stop-color="#0d1832"/>
    <stop offset="100%" stop-color="#080e20"/>
  </linearGradient>
  <radialGradient id="l0_glow" cx="50%" cy="50%" r="50%">
    <stop offset="0%" stop-color="#00ffcc" stop-opacity="0.25"/>
    <stop offset="50%" stop-color="#0088ff" stop-opacity="0.1"/>
    <stop offset="100%" stop-color="#0044aa" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="l0_photophore" cx="50%" cy="50%" r="50%">
    <stop offset="0%" stop-color="#00ffcc"/>
    <stop offset="40%" stop-color="#00ddaa"/>
    <stop offset="100%" stop-color="#00ddaa" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="l0_eye" cx="40%" cy="40%" r="50%">
    <stop offset="0%" stop-color="#00ffcc"/>
    <stop offset="100%" stop-color="#006644"/>
  </radialGradient>
  <filter id="l0_biolum">
    <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur"/>
    <feColorMatrix in="blur" type="matrix" values="0 0 0 0 0  0 1 0 0 0.5  0 0 1 0 0.4  0 0 0 0.7 0" result="glow"/>
    <feMerge><feMergeNode in="glow"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
  <clipPath id="l0_bodyClip"><ellipse cx="75" cy="50" rx="42" ry="20"/></clipPath>
</defs>
<ellipse cx="75" cy="50" rx="60" ry="35" fill="url(#l0_glow)"/>
<path d="M55,30 Q65,22 80,28 L80,32 Q65,30 58,34Z" fill="#0d1832" stroke="#1a2a4a" stroke-width="0.5" opacity="0.8"/>
<path d="M60,68 Q70,76 82,70 L82,66 Q70,70 62,64Z" fill="#0d1832" stroke="#1a2a4a" stroke-width="0.5" opacity="0.8"/>
<path d="M100,34 Q104,30 108,34" fill="#0d1832" stroke="#1a2a4a" stroke-width="0.4"/>
<ellipse cx="75" cy="50" rx="42" ry="20" fill="url(#l0_body)" stroke="#1a2a4a" stroke-width="0.8"/>
<g clip-path="url(#l0_bodyClip)">
  <ellipse cx="70" cy="58" rx="30" ry="8" fill="#1a2a4a" opacity="0.5"/>
  <ellipse cx="75" cy="38" rx="35" ry="8" fill="#060a18" opacity="0.4"/>
</g>
<path d="M115,42 Q128,34 135,28 Q130,42 128,50 Q130,58 135,72 Q128,66 115,58" fill="#0d1832" stroke="#1a2a4a" stroke-width="0.6"/>
<path d="M48,50 Q40,56 36,62" stroke="#1a2a4a" stroke-width="1.5" fill="none" opacity="0.6"/>
<g filter="url(#l0_biolum)">
  <circle cx="42" cy="55" r="2" fill="url(#l0_photophore)"/>
  <circle cx="50" cy="57" r="2.2" fill="url(#l0_photophore)"/>
  <circle cx="58" cy="58" r="2" fill="url(#l0_photophore)"/>
  <circle cx="66" cy="58.5" r="2.2" fill="url(#l0_photophore)"/>
  <circle cx="74" cy="59" r="2" fill="url(#l0_photophore)"/>
  <circle cx="82" cy="58.5" r="2.2" fill="url(#l0_photophore)"/>
  <circle cx="90" cy="57" r="2" fill="url(#l0_photophore)"/>
  <circle cx="98" cy="55" r="1.8" fill="url(#l0_photophore)"/>
  <circle cx="105" cy="53" r="1.5" fill="url(#l0_photophore)"/>
  <circle cx="55" cy="47" r="1.5" fill="url(#l0_photophore)"/>
  <circle cx="64" cy="46.5" r="1.3" fill="url(#l0_photophore)"/>
  <circle cx="73" cy="46" r="1.5" fill="url(#l0_photophore)"/>
  <circle cx="82" cy="46.5" r="1.3" fill="url(#l0_photophore)"/>
  <circle cx="91" cy="47" r="1.5" fill="url(#l0_photophore)"/>
  <circle cx="100" cy="48" r="1.3" fill="url(#l0_photophore)"/>
</g>
<circle cx="44" cy="46" r="7" fill="#001a10" stroke="#00ffcc" stroke-width="0.8"/>
<circle cx="42" cy="44" r="3.5" fill="url(#l0_eye)"/>
<circle cx="41" cy="43" r="1.5" fill="#aaffee"/>
<circle cx="40" cy="42" r="0.6" fill="white"/>
<path d="M34,52 Q36,56 40,56" stroke="#1a2a4a" stroke-width="0.8" fill="none"/>
</svg>`,

  'Primordial Carp': `<svg width="160" height="100" viewBox="0 0 160 100" xmlns="http://www.w3.org/2000/svg">
<defs>
  <linearGradient id="l1_body" x1="0" y1="0" x2="1" y2="0.3">
    <stop offset="0%" stop-color="#2a4a2a"/>
    <stop offset="40%" stop-color="#1a3a1a"/>
    <stop offset="100%" stop-color="#0d2a10"/>
  </linearGradient>
  <radialGradient id="l1_glow" cx="50%" cy="50%" r="50%">
    <stop offset="0%" stop-color="#ffd700" stop-opacity="0.25"/>
    <stop offset="60%" stop-color="#aa8800" stop-opacity="0.08"/>
    <stop offset="100%" stop-color="#aa8800" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="l1_fin" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#3a5a2a"/>
    <stop offset="100%" stop-color="#1a3a1a" stop-opacity="0.6"/>
  </linearGradient>
  <filter id="l1_aura">
    <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur"/>
    <feColorMatrix in="blur" type="matrix" values="1 0.8 0 0 0  0 0.6 0 0 0  0 0 0.2 0 0  0 0 0 0.5 0" result="glow"/>
    <feMerge><feMergeNode in="glow"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
  <clipPath id="l1_bodyClip"><ellipse cx="78" cy="50" rx="44" ry="24"/></clipPath>
</defs>
<ellipse cx="78" cy="50" rx="62" ry="38" fill="url(#l1_glow)"/>
<g filter="url(#l1_aura)">
  <path d="M50,26 Q60,14 75,18 Q85,16 95,22 L92,30 Q80,24 65,26 L52,30Z" fill="url(#l1_fin)" stroke="#1a3a1a" stroke-width="0.6"/>
  <path d="M65,72 Q75,82 90,76 L88,70 Q78,74 68,68Z" fill="url(#l1_fin)" stroke="#1a3a1a" stroke-width="0.5"/>
  <path d="M55,64 Q48,74 42,80" stroke="#2a4a2a" stroke-width="2" fill="none" opacity="0.6"/>
  <path d="M120,38 Q136,28 144,20 Q138,38 136,50 Q138,62 144,80 Q136,72 120,62" fill="url(#l1_fin)" stroke="#1a3a1a" stroke-width="0.7"/>
  <ellipse cx="78" cy="50" rx="44" ry="24" fill="url(#l1_body)" stroke="#0d2a10" stroke-width="1"/>
  <g clip-path="url(#l1_bodyClip)">
    <g fill="none" stroke="#cca800" stroke-width="0.3" opacity="0.5">
      <path d="M40,40 Q44,36 48,40"/><path d="M48,40 Q52,36 56,40"/><path d="M56,40 Q60,36 64,40"/>
      <path d="M64,40 Q68,36 72,40"/><path d="M72,40 Q76,36 80,40"/><path d="M80,40 Q84,36 88,40"/>
      <path d="M88,40 Q92,36 96,40"/><path d="M96,40 Q100,36 104,40"/>
      <path d="M38,48 Q42,44 46,48"/><path d="M46,48 Q50,44 54,48"/><path d="M54,48 Q58,44 62,48"/>
      <path d="M62,48 Q66,44 70,48"/><path d="M70,48 Q74,44 78,48"/><path d="M78,48 Q82,44 86,48"/>
      <path d="M86,48 Q90,44 94,48"/><path d="M94,48 Q98,44 102,48"/><path d="M102,48 Q106,44 110,48"/>
      <path d="M40,56 Q44,52 48,56"/><path d="M48,56 Q52,52 56,56"/><path d="M56,56 Q60,52 64,56"/>
      <path d="M64,56 Q68,52 72,56"/><path d="M72,56 Q76,52 80,56"/><path d="M80,56 Q84,52 88,56"/>
      <path d="M88,56 Q92,52 96,56"/><path d="M96,56 Q100,52 104,56"/>
      <path d="M42,64 Q46,60 50,64"/><path d="M50,64 Q54,60 58,64"/><path d="M58,64 Q62,60 66,64"/>
      <path d="M66,64 Q70,60 74,64"/><path d="M74,64 Q78,60 82,64"/><path d="M82,64 Q86,60 90,64"/>
      <path d="M90,64 Q94,60 98,64"/>
    </g>
    <path d="M60,42 L62,48 L58,48Z" fill="#ffd700" opacity="0.2"/>
    <path d="M75,38 L78,44 L72,44Z" fill="#ffd700" opacity="0.2"/>
    <path d="M92,42 L95,48 L89,48Z" fill="#ffd700" opacity="0.2"/>
    <circle cx="68" cy="56" r="2" fill="#ffd700" opacity="0.15"/>
    <circle cx="85" cy="56" r="2" fill="#ffd700" opacity="0.15"/>
    <ellipse cx="72" cy="62" rx="28" ry="6" fill="#ffd700" opacity="0.1"/>
    <ellipse cx="68" cy="40" rx="18" ry="8" fill="white" opacity="0.06"/>
  </g>
  <path d="M40,52 Q22,58 10,62 Q8,60 6,66" stroke="#cca800" stroke-width="1.2" fill="none" stroke-linecap="round"/>
  <path d="M40,56 Q26,64 16,72 Q14,70 12,76" stroke="#cca800" stroke-width="1" fill="none" stroke-linecap="round"/>
  <circle cx="6" cy="66" r="2" fill="#ffd700" opacity="0.6"/>
  <circle cx="12" cy="76" r="1.5" fill="#ffd700" opacity="0.5"/>
</g>
<circle cx="44" cy="46" r="5" fill="#0a1a08" stroke="#ffd700" stroke-width="1"/>
<circle cx="43" cy="45" r="2.5" fill="#cca800"/>
<circle cx="42" cy="44" r="1" fill="#ffd700"/>
<circle cx="41.5" cy="43.5" r="0.5" fill="white"/>
<path d="M35,54 Q38,58 42,56" stroke="#1a3a1a" stroke-width="0.8" fill="none"/>
</svg>`,

  'Golden Idolfish': `<svg width="160" height="100" viewBox="0 0 160 100" xmlns="http://www.w3.org/2000/svg">
<defs>
  <linearGradient id="l2_body" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="#ffe066"/>
    <stop offset="25%" stop-color="#ffd700"/>
    <stop offset="50%" stop-color="#daa520"/>
    <stop offset="75%" stop-color="#ffd700"/>
    <stop offset="100%" stop-color="#cc9900"/>
  </linearGradient>
  <radialGradient id="l2_glow" cx="50%" cy="50%" r="50%">
    <stop offset="0%" stop-color="#ffd700" stop-opacity="0.4"/>
    <stop offset="50%" stop-color="#ffaa00" stop-opacity="0.15"/>
    <stop offset="100%" stop-color="#ffaa00" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="l2_fin" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#ffd700"/>
    <stop offset="100%" stop-color="#b8860b"/>
  </linearGradient>
  <linearGradient id="l2_crown" x1="0" y1="1" x2="0" y2="0">
    <stop offset="0%" stop-color="#daa520"/>
    <stop offset="50%" stop-color="#ffd700"/>
    <stop offset="100%" stop-color="#ffe066"/>
  </linearGradient>
  <filter id="l2_divine">
    <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur"/>
    <feColorMatrix in="blur" type="matrix" values="1 0.8 0 0 0  0 0.7 0 0 0  0 0 0.3 0 0  0 0 0 0.6 0" result="glow"/>
    <feMerge><feMergeNode in="glow"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
  <clipPath id="l2_bodyClip"><ellipse cx="80" cy="52" rx="36" ry="28"/></clipPath>
</defs>
<ellipse cx="80" cy="52" rx="60" ry="42" fill="url(#l2_glow)"/>
<g filter="url(#l2_divine)">
  <path d="M62,26 L65,14 L69,22 L73,10 L77,20 L80,8 L83,20 L87,10 L91,22 L95,14 L98,26" fill="url(#l2_crown)" stroke="#b8860b" stroke-width="0.7"/>
  <circle cx="73" cy="14" r="2" fill="#ff0040" stroke="#cc0033" stroke-width="0.5"/>
  <circle cx="80" cy="12" r="2.5" fill="#ff0040" stroke="#cc0033" stroke-width="0.5"/>
  <circle cx="87" cy="14" r="2" fill="#ff0040" stroke="#cc0033" stroke-width="0.5"/>
  <path d="M64,76 Q72,86 88,80 L86,74 Q76,78 66,72Z" fill="url(#l2_fin)" stroke="#b8860b" stroke-width="0.5"/>
  <path d="M62,68 Q52,78 46,82" stroke="#daa520" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path d="M96,68 Q106,78 112,82" stroke="#daa520" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path d="M114,42 Q130,32 140,24 Q134,42 132,52 Q134,62 140,76 Q130,68 114,62" fill="url(#l2_fin)" stroke="#b8860b" stroke-width="0.6"/>
  <ellipse cx="80" cy="52" rx="36" ry="28" fill="url(#l2_body)" stroke="#b8860b" stroke-width="1.2"/>
  <g clip-path="url(#l2_bodyClip)">
    <path d="M56,44 Q68,34 80,34 Q92,34 104,44" fill="none" stroke="#b8860b" stroke-width="0.8" opacity="0.5"/>
    <path d="M52,52 Q66,40 80,40 Q94,40 108,52" fill="none" stroke="#b8860b" stroke-width="0.8" opacity="0.4"/>
    <path d="M50,60 Q64,48 80,48 Q96,48 110,60" fill="none" stroke="#b8860b" stroke-width="0.8" opacity="0.35"/>
    <path d="M68,50 L72,46 L76,50 L72,54Z" fill="#ffe066" opacity="0.3" stroke="#b8860b" stroke-width="0.3"/>
    <path d="M80,50 L84,46 L88,50 L84,54Z" fill="#ffe066" opacity="0.3" stroke="#b8860b" stroke-width="0.3"/>
    <path d="M74,58 L78,54 L82,58 L78,62Z" fill="#ffe066" opacity="0.3" stroke="#b8860b" stroke-width="0.3"/>
    <path d="M62,56 L66,52 L70,56 L66,60Z" fill="#ffe066" opacity="0.25" stroke="#b8860b" stroke-width="0.3"/>
    <path d="M86,56 L90,52 L94,56 L90,60Z" fill="#ffe066" opacity="0.25" stroke="#b8860b" stroke-width="0.3"/>
    <ellipse cx="72" cy="44" rx="14" ry="10" fill="white" opacity="0.15"/>
    <ellipse cx="80" cy="68" rx="20" ry="8" fill="#cc9900" opacity="0.3"/>
  </g>
</g>
<circle cx="72" cy="46" r="5" fill="#990022" stroke="#ffd700" stroke-width="1.2"/>
<circle cx="72" cy="46" r="2.8" fill="#ff0040"/>
<circle cx="71" cy="45" r="1.2" fill="#ff8888"/>
<circle cx="70.5" cy="44.5" r="0.5" fill="white"/>
<circle cx="88" cy="46" r="5" fill="#990022" stroke="#ffd700" stroke-width="1.2"/>
<circle cx="88" cy="46" r="2.8" fill="#ff0040"/>
<circle cx="87" cy="45" r="1.2" fill="#ff8888"/>
<circle cx="86.5" cy="44.5" r="0.5" fill="white"/>
<path d="M74,60 Q80,64 86,60" stroke="#b8860b" stroke-width="1" fill="none"/>
</svg>`,

  // Treasurefish — tilted crown group REMOVED, dorsal fin + all body/fin/tail gems kept
  'Treasurefish': `<svg width="160" height="100" viewBox="0 0 160 100" xmlns="http://www.w3.org/2000/svg">
<defs>
  <linearGradient id="l3_body" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="#ffd700"/>
    <stop offset="30%" stop-color="#e8b800"/>
    <stop offset="60%" stop-color="#daa520"/>
    <stop offset="100%" stop-color="#b8860b"/>
  </linearGradient>
  <radialGradient id="l3_glow" cx="50%" cy="50%" r="50%">
    <stop offset="0%" stop-color="#ffd700" stop-opacity="0.3"/>
    <stop offset="40%" stop-color="#ff44aa" stop-opacity="0.1"/>
    <stop offset="100%" stop-color="#4444ff" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="l3_fin" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#e8b800"/>
    <stop offset="100%" stop-color="#996600"/>
  </linearGradient>
  <radialGradient id="l3_ruby" cx="30%" cy="30%" r="50%">
    <stop offset="0%" stop-color="#ff4466"/>
    <stop offset="100%" stop-color="#aa0022"/>
  </radialGradient>
  <radialGradient id="l3_emerald" cx="30%" cy="30%" r="50%">
    <stop offset="0%" stop-color="#44ff88"/>
    <stop offset="100%" stop-color="#008833"/>
  </radialGradient>
  <radialGradient id="l3_sapphire" cx="30%" cy="30%" r="50%">
    <stop offset="0%" stop-color="#4488ff"/>
    <stop offset="100%" stop-color="#0033aa"/>
  </radialGradient>
  <radialGradient id="l3_diamond" cx="30%" cy="30%" r="50%">
    <stop offset="0%" stop-color="#ffffff"/>
    <stop offset="50%" stop-color="#ccddff"/>
    <stop offset="100%" stop-color="#8899cc"/>
  </radialGradient>
  <filter id="l3_sparkle">
    <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="blur"/>
    <feColorMatrix in="blur" type="matrix" values="1 0.5 0.3 0 0  0.3 0.7 0 0 0  0.2 0 0.8 0 0  0 0 0 0.6 0" result="glow"/>
    <feMerge><feMergeNode in="glow"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
  <clipPath id="l3_bodyClip"><ellipse cx="80" cy="50" rx="40" ry="24"/></clipPath>
</defs>
<ellipse cx="80" cy="50" rx="62" ry="40" fill="url(#l3_glow)"/>
<g filter="url(#l3_sparkle)">
  <!-- Dorsal fin (blends into body, gem-studded) -->
  <path d="M68,28 Q78,20 92,24 Q98,26 104,30 L102,34 Q94,30 84,28 Q76,28 70,32Z" fill="url(#l3_fin)" stroke="#996600" stroke-width="0.5"/>
  <circle cx="80" cy="26" r="1.5" fill="url(#l3_ruby)" stroke="#880022" stroke-width="0.3"/>
  <circle cx="92" cy="28" r="1.2" fill="url(#l3_emerald)" stroke="#006622" stroke-width="0.3"/>
  <!-- Anal fin (gem-studded) -->
  <path d="M62,72 Q74,82 92,76 L90,70 Q76,76 64,68Z" fill="url(#l3_fin)" stroke="#996600" stroke-width="0.5"/>
  <circle cx="77" cy="76" r="1.5" fill="url(#l3_sapphire)" stroke="#003388" stroke-width="0.3"/>
  <!-- Tail (gem-studded) -->
  <path d="M118,40 Q134,30 144,22 Q138,40 136,50 Q138,60 144,78 Q134,70 118,60" fill="url(#l3_fin)" stroke="#996600" stroke-width="0.6"/>
  <circle cx="132" cy="34" r="1.5" fill="url(#l3_ruby)" stroke="#880022" stroke-width="0.3"/>
  <circle cx="134" cy="50" r="2" fill="url(#l3_diamond)" stroke="#6677aa" stroke-width="0.3"/>
  <circle cx="132" cy="66" r="1.5" fill="url(#l3_emerald)" stroke="#006622" stroke-width="0.3"/>
  <!-- Main body -->
  <ellipse cx="80" cy="50" rx="40" ry="24" fill="url(#l3_body)" stroke="#996600" stroke-width="1"/>
  <g clip-path="url(#l3_bodyClip)">
    <g stroke="#b8860b" stroke-width="0.4" fill="none" opacity="0.4">
      <path d="M44,42 Q48,38 52,42"/><path d="M52,42 Q56,38 60,42"/><path d="M60,42 Q64,38 68,42"/>
      <path d="M68,42 Q72,38 76,42"/><path d="M76,42 Q80,38 84,42"/><path d="M84,42 Q88,38 92,42"/>
      <path d="M92,42 Q96,38 100,42"/>
      <path d="M46,50 Q50,46 54,50"/><path d="M54,50 Q58,46 62,50"/><path d="M62,50 Q66,46 70,50"/>
      <path d="M70,50 Q74,46 78,50"/><path d="M78,50 Q82,46 86,50"/><path d="M86,50 Q90,46 94,50"/>
      <path d="M94,50 Q98,46 102,50"/>
      <path d="M48,58 Q52,54 56,58"/><path d="M56,58 Q60,54 64,58"/><path d="M64,58 Q68,54 72,58"/>
      <path d="M72,58 Q76,54 80,58"/><path d="M80,58 Q84,54 88,58"/><path d="M88,58 Q92,54 96,58"/>
    </g>
    <!-- Body gems -->
    <circle cx="78" cy="48" r="4" fill="url(#l3_ruby)" stroke="#880022" stroke-width="0.6"/>
    <ellipse cx="76" cy="46" rx="1.5" ry="1" fill="white" opacity="0.4"/>
    <circle cx="62" cy="44" r="2.5" fill="url(#l3_emerald)" stroke="#006622" stroke-width="0.5"/>
    <circle cx="96" cy="46" r="2.5" fill="url(#l3_emerald)" stroke="#006622" stroke-width="0.5"/>
    <circle cx="70" cy="56" r="2.5" fill="url(#l3_sapphire)" stroke="#003388" stroke-width="0.5"/>
    <circle cx="88" cy="54" r="2.5" fill="url(#l3_sapphire)" stroke="#003388" stroke-width="0.5"/>
    <path d="M54,50 L56,47 L58,50 L56,52Z" fill="url(#l3_diamond)" stroke="#6677aa" stroke-width="0.3"/>
    <path d="M102,50 L104,47 L106,50 L104,52Z" fill="url(#l3_diamond)" stroke="#6677aa" stroke-width="0.3"/>
    <ellipse cx="74" cy="40" rx="16" ry="8" fill="white" opacity="0.12"/>
  </g>
</g>
<!-- Eye -->
<circle cx="52" cy="46" r="5.5" fill="#1a0a00" stroke="#ffd700" stroke-width="1.2"/>
<circle cx="51" cy="45" r="3" fill="url(#l3_diamond)"/>
<circle cx="50" cy="44" r="1.2" fill="white"/>
<!-- Mouth -->
<path d="M46,56 Q52,60 58,56" stroke="#996600" stroke-width="1" fill="none"/>
<!-- Sparkles -->
<g fill="white" opacity="0.3">
  <path d="M60,36 L61,34 L62,36 L61,38Z"/>
  <path d="M98,38 L99,36 L100,38 L99,40Z"/>
  <path d="M68,62 L69,60 L70,62 L69,64Z"/>
  <path d="M90,62 L91,60 L92,62 L91,64Z"/>
</g>
</svg>`,
};

// Fish array entries — uppercase rarity, wMin/wMax/lMin/lMax field names
const FISH_CONFIG = [
  { name: 'Lanternfish',    emoji: '\uD83D\uDD26', rarity: 'LEGENDARY', wMin: 0.02, wMax: 0.1,  lMin: 3,  lMax: 8   },
  { name: 'Primordial Carp',emoji: '\uD83D\uDC09', rarity: 'LEGENDARY', wMin: 15.0, wMax: 45.0, lMin: 80, lMax: 150 },
  { name: 'Golden Idolfish', emoji: '\uD83D\uDC51', rarity: 'LEGENDARY', wMin: 2.0,  wMax: 8.0,  lMin: 20, lMax: 50  },
  { name: 'Treasurefish',   emoji: '\uD83D\uDC8E', rarity: 'LEGENDARY', wMin: 3.0,  wMax: 12.0, lMin: 25, lMax: 60  },
];

function toBase64DataURI(svgStr) {
  return `data:image/svg+xml;base64,${Buffer.from(svgStr).toString('base64')}`;
}

console.log('=== Encoding Batch 3 Legendary SVGs ===\n');
const encodedSVGs = {};
for (const [name, rawSvg] of Object.entries(RAW_SVGS)) {
  encodedSVGs[name] = toBase64DataURI(rawSvg);
  console.log(`✓ ${name}`);
}

function generateFishEntries() {
  const lines = ['  // Legendaries (Batch 3)'];
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

// Insert FISH array entries after last existing Legendary (Narwhal)
const anchorMarker = `{ name:'Narwhal'`;
const anchorPos = g.indexOf(anchorMarker);
if (anchorPos === -1) { console.error('❌ Cannot find Narwhal entry'); process.exit(1); }
const anchorLineEnd = g.indexOf('\n', anchorPos);
g = g.slice(0, anchorLineEnd + 1) + generateFishEntries() + '\n' + g.slice(anchorLineEnd + 1);
console.log('✓ Inserted FISH array entries after Narwhal');

// Insert FISH_SVGS entries before closing
const svgClose = '\n};\n\n// Preload fish images';
const svgClosePos = g.indexOf(svgClose);
if (svgClosePos === -1) { console.error('❌ Cannot find FISH_SVGS closing'); process.exit(1); }
g = g.slice(0, svgClosePos) + '\n' + generateSVGEntries() + '\n' + g.slice(svgClosePos);
console.log('✓ Inserted FISH_SVGS entries');

if (nl === '\r\n') g = g.replace(/\n/g, '\r\n');
fs.writeFileSync(GAME_FILE, g, 'utf8');
console.log(`\n✅ Done! New file size: ${(fs.statSync(GAME_FILE).size / 1024 / 1024).toFixed(2)}MB`);
