# Monster Rally — Add HD Trucks #10-12 (Classic Set Complete)

**Read CLAUDE.md first.** This adds 3 more SVG-based HD trucks to the roster, completing the classic set. Same approach as Flame Crusher HD (truck #9) — SVG body + separate spinning wheel, embedded as base64 data URIs.

---

## What We're Adding

| # | Name | Body Color | Decal | Hub Accent |
|---|------|-----------|-------|------------|
| 9 | Flame Crusher HD | Orange `#FF8C00→#E65100` | Yellow zigzag | Dark `#111118` |
| **10** | **Blue Thunder HD** | Blue `#2962FF→#0000FF` | Lightning bolts (light blue + white stroke) | Blue `#0000FF` |
| **11** | **Green Machine HD** | Green `#64DD17→#33691E` | Slanted lime dashes | Green `#64DD17` |
| **12** | **Purple Nightmare HD** | Purple `#9C27B0→#4A148C` | Magenta stars | Purple `#9C27B0` |

---

## SVG Sources

For each truck, create TWO SVGs: body (no wheels, no static flames) and wheel.

### Shared Wheel Approach
The wheel design is identical across all 4 trucks EXCEPT for the hub accent color (the tiny center circle). Two options:

**Option A (simpler):** Use ONE shared wheel SVG with a neutral hub color. All 4 HD trucks share it.

**Option B (proper):** Each truck gets its own wheel SVG with the matching hub accent. 4 separate wheel data URIs.

**Use Option B** — the colored hub caps are a nice detail in the picker and the extra 3 data URIs are negligible.

---

## Body SVGs (remove wheels and static flames before encoding)

For each truck below, the body SVG is everything EXCEPT:
- The two `<use href="...monster-tire">` lines (wheels drawn separately)
- Any static flame `<path>` elements (animated Canvas flames drawn separately)

Keep: shadow ellipse, exhaust pipe rect, chassis, bumpers, body path, grille, headlights, windows, decals.

### Blue Thunder HD — Body SVG
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 250" width="400" height="250">
  <defs>
    <linearGradient id="bt_bodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#2962FF"/>
      <stop offset="100%" stop-color="#0000FF"/>
    </linearGradient>
    <linearGradient id="bt_windowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#90CAF9"/>
      <stop offset="100%" stop-color="#42A5F5"/>
    </linearGradient>
  </defs>
  <ellipse cx="200" cy="210" rx="140" ry="10" fill="#000000" opacity="0.15"/>
  <rect x="65" y="120" width="20" height="10" fill="#757575" rx="2"/>
  <rect x="110" y="140" width="160" height="20" fill="#263238" rx="5"/>
  <rect x="130" y="120" width="20" height="40" fill="#37474F"/>
  <rect x="250" y="120" width="20" height="40" fill="#37474F"/>
  <rect x="80" y="125" width="10" height="15" fill="#B0BEC5" rx="2"/>
  <path d="M 85 85 L 180 85 L 190 50 L 250 50 L 265 85 L 310 85 C 320 85 325 90 325 100 L 325 140 L 85 140 Z" fill="url(#bt_bodyGrad)"/>
  <rect x="315" y="130" width="15" height="10" fill="#FFF9C4" rx="2"/>
  <rect x="285" y="100" width="35" height="15" fill="#424242"/>
  <rect x="260" y="100" width="20" height="15" fill="#FFF9C4"/>
  <path d="M 195 55 L 215 55 L 215 85 L 185 85 Z" fill="url(#bt_windowGrad)"/>
  <path d="M 225 55 L 245 55 L 255 85 L 225 85 Z" fill="url(#bt_windowGrad)"/>
  <path d="M 105 100 L 95 115 L 110 115 L 100 135" fill="#64B5F6" stroke="#FFFFFF" stroke-width="1"/>
  <path d="M 135 100 L 125 115 L 140 115 L 130 135" fill="#64B5F6" stroke="#FFFFFF" stroke-width="1"/>
  <path d="M 165 100 L 155 115 L 170 115 L 160 135" fill="#64B5F6" stroke="#FFFFFF" stroke-width="1"/>
</svg>
```

### Blue Thunder HD — Wheel SVG
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="-48 -48 96 96" width="96" height="96">
  <defs>
    <linearGradient id="bt_tireGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#2C2C34"/>
      <stop offset="100%" stop-color="#1A1A24"/>
    </linearGradient>
  </defs>
  <circle cx="0" cy="0" r="42" fill="none" stroke="#1A1A24" stroke-width="12" stroke-dasharray="10 6"/>
  <circle cx="0" cy="0" r="40" fill="url(#bt_tireGrad)"/>
  <circle cx="0" cy="0" r="28" fill="#111118"/>
  <circle cx="0" cy="0" r="20" fill="#E0E0E0"/>
  <circle cx="0" cy="0" r="14" fill="#9E9E9E"/>
  <circle cx="0" cy="0" r="6" fill="#0000FF"/>
</svg>
```

### Green Machine HD — Body SVG
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 250" width="400" height="250">
  <defs>
    <linearGradient id="gm_bodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#64DD17"/>
      <stop offset="100%" stop-color="#33691E"/>
    </linearGradient>
    <linearGradient id="gm_windowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#90CAF9"/>
      <stop offset="100%" stop-color="#42A5F5"/>
    </linearGradient>
  </defs>
  <ellipse cx="200" cy="210" rx="140" ry="10" fill="#000000" opacity="0.15"/>
  <rect x="65" y="120" width="20" height="10" fill="#757575" rx="2"/>
  <rect x="110" y="140" width="160" height="20" fill="#263238" rx="5"/>
  <rect x="130" y="120" width="20" height="40" fill="#37474F"/>
  <rect x="250" y="120" width="20" height="40" fill="#37474F"/>
  <rect x="80" y="125" width="10" height="15" fill="#B0BEC5" rx="2"/>
  <path d="M 85 85 L 180 85 L 190 50 L 250 50 L 265 85 L 310 85 C 320 85 325 90 325 100 L 325 140 L 85 140 Z" fill="url(#gm_bodyGrad)"/>
  <rect x="315" y="130" width="15" height="10" fill="#FFF9C4" rx="2"/>
  <rect x="285" y="100" width="35" height="15" fill="#424242"/>
  <rect x="260" y="100" width="20" height="15" fill="#FFF9C4"/>
  <path d="M 195 55 L 215 55 L 215 85 L 185 85 Z" fill="url(#gm_windowGrad)"/>
  <path d="M 225 55 L 245 55 L 255 85 L 225 85 Z" fill="url(#gm_windowGrad)"/>
  <path d="M 95 105 L 110 105 L 105 125 L 90 125 Z" fill="#B2FF59"/>
  <path d="M 120 105 L 135 105 L 130 125 L 115 125 Z" fill="#B2FF59"/>
  <path d="M 145 105 L 160 105 L 155 125 L 140 125 Z" fill="#B2FF59"/>
  <path d="M 170 105 L 185 105 L 180 125 L 165 125 Z" fill="#B2FF59"/>
</svg>
```

### Green Machine HD — Wheel SVG
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="-48 -48 96 96" width="96" height="96">
  <defs>
    <linearGradient id="gm_tireGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#2C2C34"/>
      <stop offset="100%" stop-color="#1A1A24"/>
    </linearGradient>
  </defs>
  <circle cx="0" cy="0" r="42" fill="none" stroke="#1A1A24" stroke-width="12" stroke-dasharray="10 6"/>
  <circle cx="0" cy="0" r="40" fill="url(#gm_tireGrad)"/>
  <circle cx="0" cy="0" r="28" fill="#111118"/>
  <circle cx="0" cy="0" r="20" fill="#E0E0E0"/>
  <circle cx="0" cy="0" r="14" fill="#9E9E9E"/>
  <circle cx="0" cy="0" r="6" fill="#64DD17"/>
</svg>
```

### Purple Nightmare HD — Body SVG
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 250" width="400" height="250">
  <defs>
    <linearGradient id="pn_bodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#9C27B0"/>
      <stop offset="100%" stop-color="#4A148C"/>
    </linearGradient>
    <linearGradient id="pn_windowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#90CAF9"/>
      <stop offset="100%" stop-color="#42A5F5"/>
    </linearGradient>
  </defs>
  <ellipse cx="200" cy="210" rx="140" ry="10" fill="#000000" opacity="0.15"/>
  <rect x="65" y="120" width="20" height="10" fill="#757575" rx="2"/>
  <rect x="110" y="140" width="160" height="20" fill="#263238" rx="5"/>
  <rect x="130" y="120" width="20" height="40" fill="#37474F"/>
  <rect x="250" y="120" width="20" height="40" fill="#37474F"/>
  <rect x="80" y="125" width="10" height="15" fill="#B0BEC5" rx="2"/>
  <path d="M 85 85 L 180 85 L 190 50 L 250 50 L 265 85 L 310 85 C 320 85 325 90 325 100 L 325 140 L 85 140 Z" fill="url(#pn_bodyGrad)"/>
  <rect x="315" y="130" width="15" height="10" fill="#FFF9C4" rx="2"/>
  <rect x="285" y="100" width="35" height="15" fill="#424242"/>
  <rect x="260" y="100" width="20" height="15" fill="#FFF9C4"/>
  <path d="M 195 55 L 215 55 L 215 85 L 185 85 Z" fill="url(#pn_windowGrad)"/>
  <path d="M 225 55 L 245 55 L 255 85 L 225 85 Z" fill="url(#pn_windowGrad)"/>
  <polygon points="105,103 108,111 116,112 110,118 112,126 105,122 98,126 100,118 94,112 102,111" fill="#E040FB"/>
  <polygon points="140,103 143,111 151,112 145,118 147,126 140,122 133,126 135,118 129,112 137,111" fill="#E040FB"/>
  <polygon points="175,103 178,111 186,112 180,118 182,126 175,122 168,126 170,118 164,112 172,111" fill="#E040FB"/>
</svg>
```

### Purple Nightmare HD — Wheel SVG
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="-48 -48 96 96" width="96" height="96">
  <defs>
    <linearGradient id="pn_tireGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#2C2C34"/>
      <stop offset="100%" stop-color="#1A1A24"/>
    </linearGradient>
  </defs>
  <circle cx="0" cy="0" r="42" fill="none" stroke="#1A1A24" stroke-width="12" stroke-dasharray="10 6"/>
  <circle cx="0" cy="0" r="40" fill="url(#pn_tireGrad)"/>
  <circle cx="0" cy="0" r="28" fill="#111118"/>
  <circle cx="0" cy="0" r="20" fill="#E0E0E0"/>
  <circle cx="0" cy="0" r="14" fill="#9E9E9E"/>
  <circle cx="0" cy="0" r="6" fill="#9C27B0"/>
</svg>
```

---

## Implementation

### 1. Convert All SVGs to Base64 Data URIs

6 new data URIs (2 per truck × 3 trucks):
```js
const BT_BODY_SVG = 'data:image/svg+xml;base64,...';
const BT_WHEEL_SVG = 'data:image/svg+xml;base64,...';
const GM_BODY_SVG = 'data:image/svg+xml;base64,...';
const GM_WHEEL_SVG = 'data:image/svg+xml;base64,...';
const PN_BODY_SVG = 'data:image/svg+xml;base64,...';
const PN_WHEEL_SVG = 'data:image/svg+xml;base64,...';
```

### 2. Load All Images at Startup

Create asset objects for each truck, same pattern as Flame Crusher HD:
```js
const btAssets = { body: new Image(), wheel: new Image(), loaded: false };
const gmAssets = { body: new Image(), wheel: new Image(), loaded: false };
const pnAssets = { body: new Image(), wheel: new Image(), loaded: false };
// ... load each with onload counter, same as fchdAssets
```

### 3. Generalize `drawTruckHD()`

The existing `drawTruckHD()` function is hardcoded to use `fchdAssets`. Refactor it to accept an assets parameter:

```js
function drawTruckHD(tx, ty, player, assets) {
  if (!assets || !assets.loaded) {
    drawTruckWithColors(tx, ty, player.truckColors);
    return;
  }
  // ... same drawing code, but uses assets.body and assets.wheel
  // ... instead of fchdAssets.body and fchdAssets.wheel
}
```

### 4. Map Each Truck to Its Assets

In the roster or in the draw loop, map the truck index to the correct asset set:
```js
const hdAssetMap = {
  9: fchdAssets,   // Flame Crusher HD (already exists)
  10: btAssets,    // Blue Thunder HD
  11: gmAssets,    // Green Machine HD
  12: pnAssets     // Purple Nightmare HD
};
```

Then in the draw loop:
```js
if (currentTruck.renderMode === 'svg') {
  const assets = hdAssetMap[currentTruckIndex];
  drawTruckHD(player.x, player.y, player, assets);
}
```

### 5. Add Trucks to Roster

```js
// Truck #10
{ name: 'Blue Thunder HD', style: 'monster', renderMode: 'svg', bodyColor: '#2962FF', darkShade: '#0000FF', accentColor: '#64B5F6', decal: 'lightning' }

// Truck #11
{ name: 'Green Machine HD', style: 'monster', renderMode: 'svg', bodyColor: '#64DD17', darkShade: '#33691E', accentColor: '#B2FF59', decal: 'dashes' }

// Truck #12
{ name: 'Purple Nightmare HD', style: 'monster', renderMode: 'svg', bodyColor: '#9C27B0', darkShade: '#4A148C', accentColor: '#E040FB', decal: 'stars' }
```

Update `ROSTER_COUNT` to 12.

### 6. All HD Trucks Get Animated Exhaust

Same as Flame Crusher HD — the body SVGs have no static flames. The animated Canvas exhaust flame (always visible, 1.5x size) should draw for ALL trucks with `renderMode === 'svg'`. The exhaust color should match each truck's accent:

| Truck | Outer Flame | Inner Flame |
|-------|------------|-------------|
| Flame Crusher HD | `#ff4400` | `#ffcc00` |
| Blue Thunder HD | `#2962FF` | `#64B5F6` |
| Green Machine HD | `#33691E` | `#B2FF59` |
| Purple Nightmare HD | `#7B1FA2` | `#E040FB` |

### 7. Picker Badges

All 4 HD trucks show a gold **"HD"** badge in the picker. The picker now has 3 pages:
- Page 1: trucks 1-4 (Canvas classics)
- Page 2: trucks 5-8 (Canvas monsters)
- Page 3: trucks 9-12 (SVG HD)

---

## Do NOT Change
- Trucks #1-8 (Canvas-drawn, untouched)
- Collision boxes or physics
- Game mechanics, spawn logic, modes
- Single-file architecture

---

## Testing Checklist
- [ ] Blue Thunder HD renders correctly — blue body, lightning bolt decals, blue hub caps
- [ ] Green Machine HD renders correctly — green body, lime dash decals, green hub caps
- [ ] Purple Nightmare HD renders correctly — purple body, magenta star decals, purple hub caps
- [ ] All 3 new trucks have spinning wheels
- [ ] All 3 new trucks have animated exhaust flames in their accent colors
- [ ] All 3 new trucks work with tilt, backflip, squish animations
- [ ] Picker shows 12 trucks across 3 pages with HD badges on trucks 9-12
- [ ] `drawTruckHD()` is generalized (accepts assets parameter, not hardcoded)
- [ ] Fallback works if any SVG fails to load
- [ ] Trucks #1-8 completely unchanged
- [ ] No performance drop with 8 additional Image objects loaded
- [ ] No console errors
- [ ] ROSTER_COUNT updated to 12
