# Monster Rally — Full SVG Roster (Replace All Canvas Trucks)

**Read CLAUDE.md first.** This adds 4 Pro Stadium monster trucks and removes ALL Canvas-drawn trucks. The game goes from 12 trucks (8 Canvas + 4 HD) to **8 SVG-only trucks**.

**Reference file in project folder:** `pro_stadium_trucks_final.html` — open in browser to see all 4 Pro trucks assembled.

---

## Final Roster (8 trucks)

### Classic Set (already in-game as HD, trucks 9-12 → renumber to 1-4)

| # | Name | Style | ViewBox | Hub Accent |
|---|------|-------|---------|------------|
| 1 | Flame Crusher | classic | 400×250 | Dark `#111118` |
| 2 | Blue Thunder | classic | 400×250 | Blue `#0000FF` |
| 3 | Green Machine | classic | 400×250 | Green `#64DD17` |
| 4 | Purple Nightmare | classic | 400×250 | Purple `#9C27B0` |

### Pro Stadium Set (NEW — add these)

| # | Name | Style | ViewBox | Hub Accent | Exhaust Colors |
|---|------|-------|---------|------------|----------------|
| 5 | Grave Stomper | pro | 450×350 | Green star `#76FF03` | `#76FF03` / `#B2FF59` |
| 6 | Red Rampage | pro | 450×350 | Red star `#FF8A80` | `#D32F2F` / `#FF8A80` |
| 7 | Thunder Bull | pro | 450×350 | Gold star `#FFD600` | `#4A148C` / `#FFD600` |
| 8 | Toxic Crusher | pro | 450×350 | Green star `#76FF03` | `#33691E` / `#76FF03` |

---

## What Gets Removed

**Delete ALL of these:**
- All 8 original Canvas truck drawing functions (`drawTruckWithColors`, `drawTruckMonster`, and any per-truck Canvas draw code)
- Trucks 1-8 from the old roster array (Canvas classics + Canvas monsters)
- The `style: 'classic'` and `style: 'monster'` rendering paths in the draw loop
- Any Canvas-specific truck code (V-arm suspension drawing, etc.)

**Keep:**
- `drawTruckHD()` function (generalized, already accepts assets param)
- All existing HD asset loading infrastructure
- The `renderMode: 'svg'` code path

After cleanup, EVERY truck uses the SVG `drawTruckHD()` path. No more Canvas truck drawing at all.

---

## Pro Stadium SVGs — Body (remove wheels + shadow before encoding)

For each Pro truck below, remove:
- The ground shadow ellipse (`<ellipse cx="225" cy="310".../>`)
- The two `<use href="...pro-tire">` lines
- Keep everything else (chassis, shocks, body, fenders, windows, decals, exhaust headers)

### Grave Stomper — Body SVG

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 450 350" width="450" height="350">
  <defs>
    <linearGradient id="gs_bodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#111118"/>
      <stop offset="100%" stop-color="#000000"/>
    </linearGradient>
    <linearGradient id="gs_tireGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#2C2C34"/>
      <stop offset="100%" stop-color="#111118"/>
    </linearGradient>
    <g id="gs_shock">
      <rect x="-4" y="-30" width="8" height="60" fill="#B0BEC5" rx="4"/>
      <path d="M -6 -20 L 6 -15 M -6 -10 L 6 -5 M -6 0 L 6 5 M -6 10 L 6 15 M -6 20 L 6 25" stroke="#76FF03" stroke-width="3" stroke-linecap="round"/>
    </g>
  </defs>
  <path d="M 120 180 L 160 140 L 290 140 L 330 180 Z" fill="none" stroke="#76FF03" stroke-width="6" stroke-linejoin="round"/>
  <path d="M 140 180 L 180 230 L 270 230 L 310 180" fill="none" stroke="#76FF03" stroke-width="8" stroke-linejoin="round"/>
  <line x1="130" y1="240" x2="225" y2="200" stroke="#76FF03" stroke-width="6" stroke-linecap="round"/>
  <line x1="320" y1="240" x2="225" y2="200" stroke="#76FF03" stroke-width="6" stroke-linecap="round"/>
  <rect x="110" y="235" width="40" height="10" fill="#212121" rx="4"/>
  <rect x="300" y="235" width="40" height="10" fill="#212121" rx="4"/>
  <circle cx="130" cy="240" r="15" fill="#111"/>
  <circle cx="320" cy="240" r="15" fill="#111"/>
  <use href="#gs_shock" x="145" y="200" transform="rotate(15 145 200)"/>
  <use href="#gs_shock" x="115" y="200" transform="rotate(-15 115 200)"/>
  <use href="#gs_shock" x="335" y="200" transform="rotate(15 335 200)"/>
  <use href="#gs_shock" x="305" y="200" transform="rotate(-15 305 200)"/>
  <path d="M 230 170 Q 230 190 200 190 M 240 170 Q 240 190 200 190 M 250 170 Q 250 190 200 190 M 260 170 Q 260 190 200 190" fill="none" stroke="#9E9E9E" stroke-width="4" stroke-linecap="round"/>
  <rect x="160" y="182" width="40" height="12" fill="#757575" rx="6"/>
  <path d="M 60 140 L 60 70 Q 70 50 100 50 L 220 50 L 250 80 L 380 85 C 390 85 395 90 395 100 L 395 140 Z" fill="url(#gs_bodyGrad)"/>
  <path d="M 50 140 C 50 70 210 70 210 140 Z" fill="url(#gs_bodyGrad)"/>
  <path d="M 240 140 C 240 70 400 70 400 140 Z" fill="url(#gs_bodyGrad)"/>
  <path d="M 195 55 L 240 55 L 255 80 L 195 80 Z" fill="#111"/>
  <polygon points="200,75 200,60 220,60 210,75" fill="#424242" opacity="0.6"/>
  <path d="M 60 100 L 30 70" stroke="#757575" stroke-width="3"/>
  <polygon points="30,70 50,60 30,50" fill="#111"/>
  <path d="M 395 120 Q 360 110 320 130 Q 300 110 260 130 Q 230 110 190 140" fill="none" stroke="#76FF03" stroke-width="6" stroke-linecap="round"/>
  <path d="M 395 130 Q 340 120 300 140" fill="none" stroke="#B2FF59" stroke-width="4" stroke-linecap="round"/>
  <path d="M 70 130 Q 100 120 130 135 Q 160 120 190 135 Q 220 120 250 135" fill="none" stroke="#9C27B0" stroke-width="8" stroke-linecap="round" opacity="0.7"/>
  <path d="M 130 65 C 110 65 105 85 110 95 C 105 110 115 125 125 130 L 125 140 L 130 140 L 130 130 L 140 130 L 140 140 L 145 140 L 145 130 C 155 125 165 110 160 95 C 165 85 150 65 130 65 Z" fill="#BDBDBD"/>
  <path d="M 130 68 C 115 68 112 85 115 92 C 112 105 120 115 128 120 L 128 128 L 132 128 L 132 120 L 138 120 L 138 128 L 142 128 L 142 120 C 150 115 158 105 155 92 C 158 85 145 68 130 68 Z" fill="#E0E0E0"/>
  <path d="M 120 85 C 115 85 115 95 125 95 C 128 90 125 85 120 85 Z" fill="#111"/>
  <path d="M 140 85 C 145 85 145 95 135 95 C 132 90 135 85 140 85 Z" fill="#111"/>
  <polygon points="130,98 126,108 134,108" fill="#111"/>
</svg>
```

### Red Rampage — Body SVG

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 450 350" width="450" height="350">
  <defs>
    <linearGradient id="rr_bodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#D32F2F"/>
      <stop offset="100%" stop-color="#B71C1C"/>
    </linearGradient>
    <linearGradient id="rr_tireGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#2C2C34"/>
      <stop offset="100%" stop-color="#111118"/>
    </linearGradient>
    <g id="rr_shock">
      <rect x="-4" y="-30" width="8" height="60" fill="#B0BEC5" rx="4"/>
      <path d="M -6 -20 L 6 -15 M -6 -10 L 6 -5 M -6 0 L 6 5 M -6 10 L 6 15 M -6 20 L 6 25" stroke="#FF8A80" stroke-width="3" stroke-linecap="round"/>
    </g>
  </defs>
  <path d="M 120 180 L 160 140 L 290 140 L 330 180 Z" fill="none" stroke="#263238" stroke-width="6" stroke-linejoin="round"/>
  <path d="M 140 180 L 180 230 L 270 230 L 310 180" fill="none" stroke="#37474F" stroke-width="8" stroke-linejoin="round"/>
  <line x1="130" y1="240" x2="225" y2="200" stroke="#37474F" stroke-width="6" stroke-linecap="round"/>
  <line x1="320" y1="240" x2="225" y2="200" stroke="#37474F" stroke-width="6" stroke-linecap="round"/>
  <rect x="110" y="235" width="40" height="10" fill="#212121" rx="4"/>
  <rect x="300" y="235" width="40" height="10" fill="#212121" rx="4"/>
  <circle cx="130" cy="240" r="15" fill="#111"/>
  <circle cx="320" cy="240" r="15" fill="#111"/>
  <use href="#rr_shock" x="145" y="200" transform="rotate(15 145 200)"/>
  <use href="#rr_shock" x="115" y="200" transform="rotate(-15 115 200)"/>
  <use href="#rr_shock" x="335" y="200" transform="rotate(15 335 200)"/>
  <use href="#rr_shock" x="305" y="200" transform="rotate(-15 305 200)"/>
  <path d="M 230 170 Q 230 190 200 190 M 240 170 Q 240 190 200 190 M 250 170 Q 250 190 200 190 M 260 170 Q 260 190 200 190" fill="none" stroke="#9E9E9E" stroke-width="4" stroke-linecap="round"/>
  <rect x="160" y="182" width="40" height="12" fill="#757575" rx="6"/>
  <path d="M 60 140 L 60 100 L 90 90 L 120 70 L 150 60 L 180 50 L 240 50 L 280 65 L 320 75 L 360 80 C 380 80 400 90 400 100 L 400 120 C 390 120 380 115 360 115 L 320 115 Z" fill="url(#rr_bodyGrad)"/>
  <path d="M 50 140 C 50 70 210 70 210 140 Z" fill="url(#rr_bodyGrad)"/>
  <path d="M 240 140 C 240 70 400 70 400 140 Z" fill="url(#rr_bodyGrad)"/>
  <path d="M 180 55 L 230 55 L 260 80 L 150 80 Z" fill="#111"/>
  <polygon points="70,100 80,75 95,90" fill="#FF8A80"/>
  <polygon points="95,90 110,60 125,80" fill="#FF8A80"/>
  <polygon points="125,80 145,45 160,60" fill="#FF8A80"/>
  <polygon points="160,60 185,30 200,50" fill="#FF8A80"/>
  <polygon points="200,50 225,35 240,50" fill="#FF8A80"/>
  <polygon points="240,50 265,45 275,60" fill="#FF8A80"/>
  <circle cx="315" cy="90" r="6" fill="#FFD600"/>
  <circle cx="317" cy="90" r="2" fill="#111"/>
  <path d="M 305 85 L 325 88" stroke="#B71C1C" stroke-width="3" stroke-linecap="round"/>
  <path d="M 310 115 L 400 115 C 390 130 360 135 320 130 Z" fill="url(#rr_bodyGrad)"/>
  <path d="M 320 115 L 330 125 L 340 115 L 350 125 L 360 115 L 370 125 L 380 115 L 390 125 L 400 115" fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linejoin="round"/>
</svg>
```

### Thunder Bull — Body SVG

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 450 350" width="450" height="350">
  <defs>
    <linearGradient id="tb_bodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#4A148C"/>
      <stop offset="100%" stop-color="#21006F"/>
    </linearGradient>
    <linearGradient id="tb_tireGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#2C2C34"/>
      <stop offset="100%" stop-color="#111118"/>
    </linearGradient>
    <g id="tb_shock">
      <rect x="-4" y="-30" width="8" height="60" fill="#B0BEC5" rx="4"/>
      <path d="M -6 -20 L 6 -15 M -6 -10 L 6 -5 M -6 0 L 6 5 M -6 10 L 6 15 M -6 20 L 6 25" stroke="#FFD600" stroke-width="3" stroke-linecap="round"/>
    </g>
  </defs>
  <path d="M 120 180 L 160 140 L 290 140 L 330 180 Z" fill="none" stroke="#263238" stroke-width="6" stroke-linejoin="round"/>
  <path d="M 140 180 L 180 230 L 270 230 L 310 180" fill="none" stroke="#37474F" stroke-width="8" stroke-linejoin="round"/>
  <line x1="130" y1="240" x2="225" y2="200" stroke="#37474F" stroke-width="6" stroke-linecap="round"/>
  <line x1="320" y1="240" x2="225" y2="200" stroke="#37474F" stroke-width="6" stroke-linecap="round"/>
  <rect x="110" y="235" width="40" height="10" fill="#212121" rx="4"/>
  <rect x="300" y="235" width="40" height="10" fill="#212121" rx="4"/>
  <circle cx="130" cy="240" r="15" fill="#111"/>
  <circle cx="320" cy="240" r="15" fill="#111"/>
  <use href="#tb_shock" x="145" y="200" transform="rotate(15 145 200)"/>
  <use href="#tb_shock" x="115" y="200" transform="rotate(-15 115 200)"/>
  <use href="#tb_shock" x="335" y="200" transform="rotate(15 335 200)"/>
  <use href="#tb_shock" x="305" y="200" transform="rotate(-15 305 200)"/>
  <path d="M 230 170 Q 230 190 200 190 M 240 170 Q 240 190 200 190 M 250 170 Q 250 190 200 190 M 260 170 Q 260 190 200 190" fill="none" stroke="#9E9E9E" stroke-width="4" stroke-linecap="round"/>
  <rect x="160" y="182" width="40" height="12" fill="#757575" rx="6"/>
  <path d="M 60 140 L 60 85 L 170 85 L 200 45 L 270 45 L 300 85 L 380 85 C 390 85 395 90 395 105 L 395 140 Z" fill="url(#tb_bodyGrad)"/>
  <path d="M 50 140 C 50 70 210 70 210 140 Z" fill="url(#tb_bodyGrad)"/>
  <path d="M 240 140 C 240 70 400 70 400 140 Z" fill="url(#tb_bodyGrad)"/>
  <path d="M 205 50 L 255 50 L 275 85 L 185 85 Z" fill="#111"/>
  <path d="M 240 45 C 240 25 210 15 180 15 C 200 25 210 40 220 45 Z" fill="#FFD600"/>
  <path d="M 255 45 C 265 25 290 15 320 15 C 300 25 285 40 270 45 Z" fill="#FFD600"/>
  <path d="M 360 85 C 390 85 405 105 395 130 C 385 110 360 110 360 85 Z" fill="#4A148C"/>
  <circle cx="385" cy="100" r="4" fill="#111"/>
  <circle cx="395" cy="115" r="10" fill="none" stroke="#FFD600" stroke-width="4"/>
  <path d="M 280 110 L 290 120 L 300 110 L 310 120 L 320 110 L 330 120 L 340 110 L 350 120 L 360 110 L 370 120 L 380 110" fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linejoin="round"/>
</svg>
```

### Toxic Crusher — Body SVG

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 450 350" width="450" height="350">
  <defs>
    <linearGradient id="tc_bodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#33691E"/>
      <stop offset="100%" stop-color="#1B5E20"/>
    </linearGradient>
    <linearGradient id="tc_tireGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#2C2C34"/>
      <stop offset="100%" stop-color="#111118"/>
    </linearGradient>
    <g id="tc_shock">
      <rect x="-4" y="-30" width="8" height="60" fill="#B0BEC5" rx="4"/>
      <path d="M -6 -20 L 6 -15 M -6 -10 L 6 -5 M -6 0 L 6 5 M -6 10 L 6 15 M -6 20 L 6 25" stroke="#76FF03" stroke-width="3" stroke-linecap="round"/>
    </g>
  </defs>
  <path d="M 120 180 L 160 140 L 290 140 L 330 180 Z" fill="none" stroke="#263238" stroke-width="6" stroke-linejoin="round"/>
  <path d="M 140 180 L 180 230 L 270 230 L 310 180" fill="none" stroke="#37474F" stroke-width="8" stroke-linejoin="round"/>
  <line x1="130" y1="240" x2="225" y2="200" stroke="#37474F" stroke-width="6" stroke-linecap="round"/>
  <line x1="320" y1="240" x2="225" y2="200" stroke="#37474F" stroke-width="6" stroke-linecap="round"/>
  <rect x="110" y="235" width="40" height="10" fill="#212121" rx="4"/>
  <rect x="300" y="235" width="40" height="10" fill="#212121" rx="4"/>
  <circle cx="130" cy="240" r="15" fill="#111"/>
  <circle cx="320" cy="240" r="15" fill="#111"/>
  <use href="#tc_shock" x="145" y="200" transform="rotate(15 145 200)"/>
  <use href="#tc_shock" x="115" y="200" transform="rotate(-15 115 200)"/>
  <use href="#tc_shock" x="335" y="200" transform="rotate(15 335 200)"/>
  <use href="#tc_shock" x="305" y="200" transform="rotate(-15 305 200)"/>
  <path d="M 230 170 Q 230 190 200 190 M 240 170 Q 240 190 200 190 M 250 170 Q 250 190 200 190 M 260 170 Q 260 190 200 190" fill="none" stroke="#9E9E9E" stroke-width="4" stroke-linecap="round"/>
  <rect x="160" y="182" width="40" height="12" fill="#757575" rx="6"/>
  <path d="M 120 100 C 150 70 220 50 280 60 C 330 70 380 80 400 100 C 410 110 405 130 380 130 L 320 130 Z" fill="url(#tc_bodyGrad)"/>
  <path d="M 330 130 C 360 140 380 135 390 130 Z" fill="#E0E0E0"/>
  <path d="M 50 140 C 50 70 210 70 210 140 Z" fill="url(#tc_bodyGrad)"/>
  <path d="M 240 140 C 240 70 400 70 400 140 Z" fill="url(#tc_bodyGrad)"/>
  <path d="M 210 65 L 260 70 L 270 95 L 180 95 Z" fill="#111"/>
  <path d="M 130 95 C 100 90 70 60 50 40 C 70 70 80 100 80 130 C 60 140 40 150 20 160 C 50 140 90 130 120 120 Z" fill="url(#tc_bodyGrad)"/>
  <path d="M 230 55 C 230 30 240 10 260 0 C 260 20 270 40 280 60 Z" fill="url(#tc_bodyGrad)"/>
  <path d="M 230 110 C 250 110 270 120 290 135 C 270 135 240 130 220 120 Z" fill="#64DD17"/>
  <circle cx="340" cy="95" r="4" fill="#111"/>
  <path d="M 290 85 C 285 95 285 105 290 115" stroke="#111" stroke-width="2" fill="none"/>
  <path d="M 300 87 C 295 97 295 107 300 117" stroke="#111" stroke-width="2" fill="none"/>
  <path d="M 310 90 C 305 100 305 110 310 120" stroke="#111" stroke-width="2" fill="none"/>
  <path d="M 330 128 L 335 135 L 340 128 L 345 135 L 350 128 L 355 135 L 360 128 L 365 135 L 370 128 L 375 135 L 380 128 L 385 135 L 390 128" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linejoin="round"/>
  <path d="M 120 120 C 180 130 250 130 320 130 C 250 115 180 115 120 100 Z" fill="#B2FF59" opacity="0.5"/>
</svg>
```

---

## Pro Stadium Wheel SVGs

The Pro tires are significantly larger and more detailed than the classic tires. Each has a star-shaped hub accent in the truck's color.

**IMPORTANT:** The Pro tire radius is 70 (vs 42 for classics). The viewBox must be centered for rotation: `-80 -80 160 160`.

### Grave Stomper — Wheel SVG
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="-80 -80 160 160" width="160" height="160">
  <defs>
    <linearGradient id="gs_wTireGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#2C2C34"/>
      <stop offset="100%" stop-color="#111118"/>
    </linearGradient>
  </defs>
  <circle cx="0" cy="0" r="70" fill="none" stroke="#111118" stroke-width="20" stroke-dasharray="16 12"/>
  <circle cx="0" cy="0" r="66" fill="url(#gs_wTireGrad)"/>
  <circle cx="0" cy="0" r="54" fill="none" stroke="#222" stroke-width="4"/>
  <circle cx="0" cy="0" r="42" fill="#1A1A24"/>
  <circle cx="0" cy="0" r="32" fill="#37474F"/>
  <circle cx="0" cy="0" r="26" fill="#263238"/>
  <circle cx="0" cy="0" r="18" fill="#9E9E9E"/>
  <circle cx="0" cy="0" r="40" fill="none" stroke="#424242" stroke-width="2" stroke-dasharray="2 4"/>
  <circle cx="0" cy="0" r="10" fill="#111118"/>
  <path d="M 0 -8 L 2 -2 L 8 -2 L 3 2 L 5 8 L 0 4 L -5 8 L -3 2 L -8 -2 L -2 -2 Z" fill="#76FF03"/>
</svg>
```

### Red Rampage — Wheel SVG
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="-80 -80 160 160" width="160" height="160">
  <defs>
    <linearGradient id="rr_wTireGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#2C2C34"/>
      <stop offset="100%" stop-color="#111118"/>
    </linearGradient>
  </defs>
  <circle cx="0" cy="0" r="70" fill="none" stroke="#111118" stroke-width="20" stroke-dasharray="16 12"/>
  <circle cx="0" cy="0" r="66" fill="url(#rr_wTireGrad)"/>
  <circle cx="0" cy="0" r="54" fill="none" stroke="#222" stroke-width="4"/>
  <circle cx="0" cy="0" r="42" fill="#1A1A24"/>
  <circle cx="0" cy="0" r="32" fill="#37474F"/>
  <circle cx="0" cy="0" r="26" fill="#263238"/>
  <circle cx="0" cy="0" r="18" fill="#9E9E9E"/>
  <circle cx="0" cy="0" r="40" fill="none" stroke="#424242" stroke-width="2" stroke-dasharray="2 4"/>
  <circle cx="0" cy="0" r="10" fill="#111118"/>
  <path d="M 0 -8 L 2 -2 L 8 -2 L 3 2 L 5 8 L 0 4 L -5 8 L -3 2 L -8 -2 L -2 -2 Z" fill="#FF8A80"/>
</svg>
```

### Thunder Bull — Wheel SVG
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="-80 -80 160 160" width="160" height="160">
  <defs>
    <linearGradient id="tb_wTireGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#2C2C34"/>
      <stop offset="100%" stop-color="#111118"/>
    </linearGradient>
  </defs>
  <circle cx="0" cy="0" r="70" fill="none" stroke="#111118" stroke-width="20" stroke-dasharray="16 12"/>
  <circle cx="0" cy="0" r="66" fill="url(#tb_wTireGrad)"/>
  <circle cx="0" cy="0" r="54" fill="none" stroke="#222" stroke-width="4"/>
  <circle cx="0" cy="0" r="42" fill="#1A1A24"/>
  <circle cx="0" cy="0" r="32" fill="#37474F"/>
  <circle cx="0" cy="0" r="26" fill="#263238"/>
  <circle cx="0" cy="0" r="18" fill="#9E9E9E"/>
  <circle cx="0" cy="0" r="40" fill="none" stroke="#424242" stroke-width="2" stroke-dasharray="2 4"/>
  <circle cx="0" cy="0" r="10" fill="#111118"/>
  <path d="M 0 -8 L 2 -2 L 8 -2 L 3 2 L 5 8 L 0 4 L -5 8 L -3 2 L -8 -2 L -2 -2 Z" fill="#FFD600"/>
</svg>
```

### Toxic Crusher — Wheel SVG
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="-80 -80 160 160" width="160" height="160">
  <defs>
    <linearGradient id="tc_wTireGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#2C2C34"/>
      <stop offset="100%" stop-color="#111118"/>
    </linearGradient>
  </defs>
  <circle cx="0" cy="0" r="70" fill="none" stroke="#111118" stroke-width="20" stroke-dasharray="16 12"/>
  <circle cx="0" cy="0" r="66" fill="url(#tc_wTireGrad)"/>
  <circle cx="0" cy="0" r="54" fill="none" stroke="#222" stroke-width="4"/>
  <circle cx="0" cy="0" r="42" fill="#1A1A24"/>
  <circle cx="0" cy="0" r="32" fill="#37474F"/>
  <circle cx="0" cy="0" r="26" fill="#263238"/>
  <circle cx="0" cy="0" r="18" fill="#9E9E9E"/>
  <circle cx="0" cy="0" r="40" fill="none" stroke="#424242" stroke-width="2" stroke-dasharray="2 4"/>
  <circle cx="0" cy="0" r="10" fill="#111118"/>
  <path d="M 0 -8 L 2 -2 L 8 -2 L 3 2 L 5 8 L 0 4 L -5 8 L -3 2 L -8 -2 L -2 -2 Z" fill="#76FF03"/>
</svg>
```

---

## Scaling Differences: Classic vs Pro

`drawTruckHD()` must handle two different viewBox sizes. Add a `viewBox` property to each roster entry:

| Style | ViewBox | Body Width Range | Wheel Center Y | Wheel Center X (rear/front) |
|-------|---------|-----------------|----------------|---------------------------|
| classic | 400×250 | ~240px (x=85 to x=325) | 165 | 140 / 270 |
| pro | 450×350 | ~340px (x=60 to x=400) | 240 | 130 / 320 |

The scale factor calculation in `drawTruckHD()` needs to use the truck's viewBox dimensions:

```js
// In the roster, each truck defines its SVG metadata:
{
  name: 'Grave Stomper',
  renderMode: 'svg',
  style: 'pro',
  svgMeta: {
    viewBoxW: 450,
    viewBoxH: 350,
    bodyMinX: 60,   // leftmost body content
    bodyMaxX: 400,  // rightmost body content
    bodyMinY: 15,   // topmost content (Thunder Bull horns go to y=15)
    wheelCX: [130, 320],  // wheel center X positions in SVG coords
    wheelCY: 240,         // wheel center Y position in SVG coords
    wheelR: 70            // wheel radius in SVG coords
  },
  // ... colors, etc.
}

// Classic trucks use:
svgMeta: {
  viewBoxW: 400,
  viewBoxH: 250,
  bodyMinX: 85,
  bodyMaxX: 325,
  bodyMinY: 50,
  wheelCX: [140, 270],
  wheelCY: 165,
  wheelR: 42
}
```

Then `drawTruckHD()` uses `svgMeta` to calculate scale and positioning:

```js
function drawTruckHD(tx, ty, player, assets, meta) {
  const bodyContentW = meta.bodyMaxX - meta.bodyMinX;
  const scale = player.w / bodyContentW;
  const fullW = meta.viewBoxW * scale;
  const fullH = meta.viewBoxH * scale;
  const offsetX = meta.bodyMinX * scale;
  const offsetY = meta.bodyMinY * scale;
  
  const drawX = tx - offsetX;
  const drawY = ty - offsetY + squishY;
  
  ctx.drawImage(assets.body, drawX, drawY, fullW, fullH);
  
  // Wheels at SVG positions, scaled
  const wheelDiam = meta.wheelR * 2 * scale;
  for (const wcx of meta.wheelCX) {
    const wx = drawX + wcx * scale;
    const wy = drawY + meta.wheelCY * scale;
    ctx.save();
    ctx.translate(wx, wy);
    ctx.rotate(wheelAngle);
    ctx.drawImage(assets.wheel, -wheelDiam/2, -wheelDiam/2, wheelDiam, wheelDiam);
    ctx.restore();
  }
}
```

**CRITICAL: These offset values are starting points. Code MUST visually test each truck and adjust until the body sits correctly, wheels touch the ground, and nothing clips.** The Pro trucks have more content extending beyond the body (horns, tail fins, skull) so the positioning needs extra care.

---

## Roster Definition

```js
const TRUCK_ROSTER = [
  // Classic Set
  { name: 'Flame Crusher', style: 'classic', renderMode: 'svg',
    svgMeta: { viewBoxW:400, viewBoxH:250, bodyMinX:85, bodyMaxX:325, bodyMinY:50, wheelCX:[140,270], wheelCY:165, wheelR:42 },
    flameOuter:'#ff4400', flameInner:'#ffcc00' },
  { name: 'Blue Thunder', style: 'classic', renderMode: 'svg',
    svgMeta: { viewBoxW:400, viewBoxH:250, bodyMinX:85, bodyMaxX:325, bodyMinY:50, wheelCX:[140,270], wheelCY:165, wheelR:42 },
    flameOuter:'#2962FF', flameInner:'#64B5F6' },
  { name: 'Green Machine', style: 'classic', renderMode: 'svg',
    svgMeta: { viewBoxW:400, viewBoxH:250, bodyMinX:85, bodyMaxX:325, bodyMinY:50, wheelCX:[140,270], wheelCY:165, wheelR:42 },
    flameOuter:'#33691E', flameInner:'#B2FF59' },
  { name: 'Purple Nightmare', style: 'classic', renderMode: 'svg',
    svgMeta: { viewBoxW:400, viewBoxH:250, bodyMinX:85, bodyMaxX:325, bodyMinY:50, wheelCX:[140,270], wheelCY:165, wheelR:42 },
    flameOuter:'#7B1FA2', flameInner:'#E040FB' },
  
  // Pro Stadium Set
  { name: 'Grave Stomper', style: 'pro', renderMode: 'svg',
    svgMeta: { viewBoxW:450, viewBoxH:350, bodyMinX:30, bodyMaxX:400, bodyMinY:15, wheelCX:[130,320], wheelCY:240, wheelR:70 },
    flameOuter:'#76FF03', flameInner:'#B2FF59' },
  { name: 'Red Rampage', style: 'pro', renderMode: 'svg',
    svgMeta: { viewBoxW:450, viewBoxH:350, bodyMinX:50, bodyMaxX:400, bodyMinY:30, wheelCX:[130,320], wheelCY:240, wheelR:70 },
    flameOuter:'#D32F2F', flameInner:'#FF8A80' },
  { name: 'Thunder Bull', style: 'pro', renderMode: 'svg',
    svgMeta: { viewBoxW:450, viewBoxH:350, bodyMinX:50, bodyMaxX:400, bodyMinY:15, wheelCX:[130,320], wheelCY:240, wheelR:70 },
    flameOuter:'#4A148C', flameInner:'#FFD600' },
  { name: 'Toxic Crusher', style: 'pro', renderMode: 'svg',
    svgMeta: { viewBoxW:450, viewBoxH:350, bodyMinX:20, bodyMaxX:410, bodyMinY:0, wheelCX:[130,320], wheelCY:240, wheelR:70 },
    flameOuter:'#33691E', flameInner:'#76FF03' },
];
```

---

## Picker Updates

- **2 pages:** Page 1 = Classic (trucks 1-4), Page 2 = Pro Stadium (trucks 5-8)
- Remove "HD" badges — ALL trucks are now SVG, no distinction needed
- Pro trucks should show a **"PRO"** badge in the picker (same style, different color — red or gold)
- Classic trucks show **"CLASSIC"** badge
- The picker preview should render each truck using `drawTruckHD()` at picker scale

---

## Cleanup Checklist

Remove all of the following dead code after migration:
- [ ] `drawTruckWithColors()` function
- [ ] `drawTruckMonster()` function
- [ ] `drawWheel()` (Canvas-based wheel drawing)
- [ ] Any per-truck Canvas color definitions not used by SVG trucks
- [ ] The old 8-entry Canvas roster array
- [ ] `style: 'classic'` and `style: 'monster'` code paths in the draw loop
- [ ] V-arm suspension Canvas drawing code
- [ ] Any truck-related Canvas code that's no longer referenced

---

## Testing Checklist

### All 8 trucks render correctly:
- [ ] Flame Crusher — orange body, zigzag decal, spinning classic tires
- [ ] Blue Thunder — blue body, lightning bolts, spinning classic tires
- [ ] Green Machine — green body, lime dashes, spinning classic tires
- [ ] Purple Nightmare — purple body, magenta stars, spinning classic tires
- [ ] Grave Stomper — black body, skull decal, green chassis/flames, neon green springs, spinning Pro tires with green star hub
- [ ] Red Rampage — red body, swept-back profile, triangular fins, spinning Pro tires with red star hub
- [ ] Thunder Bull — purple body, gold horns, bull nose ring, teeth, spinning Pro tires with gold star hub
- [ ] Toxic Crusher — green body, organic shape, gill lines, slime accent, spinning Pro tires with green star hub

### Gameplay:
- [ ] All 8 trucks tilt correctly during jumps
- [ ] All 8 trucks do backflip rotation
- [ ] All 8 trucks have landing squish animation
- [ ] All 8 trucks have always-on animated exhaust in their accent colors
- [ ] No Canvas truck drawing code remains
- [ ] Picker shows 2 pages (Classic + Pro Stadium) with correct badges
- [ ] Picker renders SVG preview for all trucks
- [ ] Fallback works if any SVG fails to load

### Performance:
- [ ] 60fps maintained with 16 Image objects loaded (8 bodies + 8 wheels)
- [ ] No console errors
- [ ] No external file requests — all SVGs embedded as data URIs
- [ ] Single HTML file maintained
