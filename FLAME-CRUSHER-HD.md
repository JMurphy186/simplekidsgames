# Monster Rally — Flame Crusher SVG Truck (Add as Truck #9)

**Read CLAUDE.md first.** This adds a new 9th truck to the roster using SVG-based rendering. The existing 8 Canvas-drawn trucks stay unchanged. This is a visual quality test — if the SVG truck looks good at game scale, we'll migrate the others.

---

## What We're Doing

Adding **"Flame Crusher HD"** as truck #9 in the picker. It uses pre-rendered SVG art instead of Canvas path drawing. The player can choose it alongside the existing trucks and see the quality difference in real gameplay.

---

## SVG Assets (Embed as Data URIs)

### Body SVG (everything EXCEPT the wheels)

Take this SVG and convert it to a base64 data URI. This is the truck body, cab, windows, decal, grille, bumpers, exhaust pipe, chassis, and shadow — everything except the tires:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 250" width="400" height="250">
  <defs>
    <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FF8C00"/>
      <stop offset="100%" stop-color="#E65100"/>
    </linearGradient>
    <linearGradient id="stripeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFF00"/>
      <stop offset="100%" stop-color="#FFD600"/>
    </linearGradient>
    <linearGradient id="windowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#90CAF9"/>
      <stop offset="100%" stop-color="#42A5F5"/>
    </linearGradient>
  </defs>
  <ellipse cx="200" cy="210" rx="140" ry="10" fill="#000000" opacity="0.15"/>
  <path d="M 60 115 Q 30 110 20 120 Q 40 125 35 130 Q 50 130 55 135 Q 30 140 40 145 Q 60 140 70 125 Z" fill="#FF9800"/>
  <path d="M 65 120 Q 45 118 40 125 Q 55 128 52 132 Q 65 132 70 125 Z" fill="#FFEB3B"/>
  <rect x="65" y="120" width="20" height="10" fill="#757575" rx="2"/>
  <rect x="110" y="140" width="160" height="20" fill="#263238" rx="5"/>
  <rect x="130" y="120" width="20" height="40" fill="#37474F"/>
  <rect x="250" y="120" width="20" height="40" fill="#37474F"/>
  <rect x="80" y="125" width="10" height="15" fill="#B0BEC5" rx="2"/>
  <path d="M 85 85 L 180 85 L 190 50 L 250 50 L 265 85 L 310 85 C 320 85 325 90 325 100 L 325 140 L 85 140 Z" fill="url(#bodyGrad)"/>
  <rect x="315" y="130" width="15" height="10" fill="#FFF9C4" rx="2"/>
  <rect x="285" y="100" width="35" height="15" fill="#424242"/>
  <rect x="260" y="100" width="20" height="15" fill="#FFF9C4"/>
  <path d="M 195 55 L 215 55 L 215 85 L 185 85 Z" fill="url(#windowGrad)"/>
  <path d="M 225 55 L 245 55 L 255 85 L 225 85 Z" fill="url(#windowGrad)"/>
  <path d="M 85 105 L 140 105 L 155 130 L 175 105 L 195 130 L 215 105 L 255 105 L 255 115 L 210 115 L 195 140 L 175 115 L 155 140 L 135 115 L 85 115 Z" fill="url(#stripeGrad)"/>
</svg>
```

### Wheel SVG (single tire, reused for both wheels)

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="-48 -48 96 96" width="96" height="96">
  <defs>
    <linearGradient id="tireGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#2C2C34"/>
      <stop offset="100%" stop-color="#1A1A24"/>
    </linearGradient>
  </defs>
  <circle cx="0" cy="0" r="42" fill="none" stroke="#1A1A24" stroke-width="12" stroke-dasharray="10 6"/>
  <circle cx="0" cy="0" r="40" fill="url(#tireGrad)"/>
  <circle cx="0" cy="0" r="28" fill="#111118"/>
  <circle cx="0" cy="0" r="20" fill="#E0E0E0"/>
  <circle cx="0" cy="0" r="14" fill="#9E9E9E"/>
  <circle cx="0" cy="0" r="6" fill="#111118"/>
</svg>
```

**Note:** The wheel SVG viewBox is centered on 0,0 (`-48 -48 96 96`) so rotation via `ctx.rotate()` spins naturally around the center. This is important — do NOT use a viewBox starting at 0,0 with offset circles.

---

## Implementation Steps

### 1. Convert SVGs to Base64 Data URIs

Encode both SVGs above as base64 data URIs:

```js
const FCHD_BODY_SVG = 'data:image/svg+xml;base64,' + btoa(bodyStringAbove);
const FCHD_WHEEL_SVG = 'data:image/svg+xml;base64,' + btoa(wheelStringAbove);
```

Or use a tool/script to convert. Store these as constants near the top of the game code.

### 2. Load Images at Startup

```js
const fchdAssets = { body: new Image(), wheel: new Image(), loaded: false };
let fchdToLoad = 2;
function onFchdLoad() { fchdToLoad--; if (fchdToLoad <= 0) fchdAssets.loaded = true; }
fchdAssets.body.onload = onFchdLoad;
fchdAssets.wheel.onload = onFchdLoad;
fchdAssets.body.src = FCHD_BODY_SVG;
fchdAssets.wheel.src = FCHD_WHEEL_SVG;
```

### 3. Add Truck #9 to the Roster

Add to the truck roster array:

```js
{
  name: 'Flame Crusher HD',
  style: 'monster',
  renderMode: 'svg',
  bodyColor: '#FF8C00',
  darkShade: '#E65100',
  accentColor: '#FFD600',
  decal: 'zigzag'
}
```

Update `ROSTER_COUNT` to 9.

### 4. Create `drawTruckHD()` Function

```js
function drawTruckHD(tx, ty, player) {
  if (!fchdAssets.loaded) {
    // Fallback to canvas Flame Crusher if not loaded
    drawTruckWithColors(tx, ty, player.truckColors);
    return;
  }

  const squishY = player.squish * 4;

  ctx.save();

  // Apply tilt + flip rotation
  ctx.translate(tx + player.w / 2, ty + player.h);
  ctx.rotate(player.tilt * 0.05);
  if (player.flipRotation) ctx.rotate(player.flipRotation);
  ctx.translate(-(tx + player.w / 2), -(ty + player.h));

  // --- BODY ---
  // The SVG body viewBox is 400x250. We need to scale it to the game truck size.
  // The truck body in the SVG spans roughly from x=85 to x=325 (240px) and y=50 to y=160 (110px).
  // We want the visible body to be about player.w wide.
  const svgBodyVisibleW = 240; // pixels of body content in the SVG
  const svgBodyVisibleH = 110;
  const scale = player.w / svgBodyVisibleW;
  
  // Full SVG dimensions scaled
  const fullW = 400 * scale;
  const fullH = 250 * scale;
  
  // Offset so the body portion aligns with the collision box
  // SVG body starts at x=85, so offset = 85 * scale
  const bodyOffsetX = 85 * scale;
  const bodyOffsetY = 50 * scale; // SVG cab top is at y=50
  
  const drawX = tx - bodyOffsetX;
  const drawY = ty - bodyOffsetY + squishY;
  
  // Draw body (includes exhaust flame, chassis, shadow, everything except wheels)
  ctx.drawImage(fchdAssets.body, drawX, drawY, fullW, fullH);

  // --- WHEELS (spinning) ---
  // In the original SVG, wheels are at x=140,y=165 and x=270,y=165 (center points)
  // Scale these positions
  const wheelR = 42 * scale; // wheel radius in SVG is 42px
  const wheelDiameter = wheelR * 2;
  
  // Rear wheel center position (SVG x=140, y=165, relative to SVG origin)
  const rearWheelCX = drawX + 140 * scale;
  const rearWheelCY = drawY + 165 * scale;
  
  // Front wheel center position (SVG x=270, y=165)
  const frontWheelCX = drawX + 270 * scale;
  const frontWheelCY = drawY + 165 * scale;

  // Draw rear wheel with rotation
  ctx.save();
  ctx.translate(rearWheelCX, rearWheelCY);
  ctx.rotate(wheelAngle); // existing game wheelAngle variable
  ctx.drawImage(fchdAssets.wheel, -wheelDiameter/2, -wheelDiameter/2, wheelDiameter, wheelDiameter);
  ctx.restore();

  // Draw front wheel with rotation
  ctx.save();
  ctx.translate(frontWheelCX, frontWheelCY);
  ctx.rotate(wheelAngle);
  ctx.drawImage(fchdAssets.wheel, -wheelDiameter/2, -wheelDiameter/2, wheelDiameter, wheelDiameter);
  ctx.restore();

  ctx.restore();
}
```

**CRITICAL: The offset values (bodyOffsetX, bodyOffsetY, wheel positions) are estimates based on the SVG coordinates. They WILL need visual tuning.** After the first implementation:
1. Open the game in a browser
2. Select Flame Crusher HD
3. Check: Does the body align with the collision box? Are wheels touching the ground? Is the exhaust in the right spot?
4. Adjust the offset values until it looks correct

### 5. Hook Into Draw Loop

Where the player truck is drawn, add the SVG path:

```js
if (currentTruck.renderMode === 'svg') {
  drawTruckHD(player.x, player.y, player);
} else if (currentTruck.style === 'monster') {
  drawTruckMonster(player.x, player.y, player);
} else {
  drawTruckWithColors(player.x, player.y, player);
}
```

### 6. Truck Picker

The picker should also render Flame Crusher HD using `drawTruckHD()` at picker scale. Since the picker draws trucks larger, the SVG will look even better there — more detail visible.

Add an **"HD"** badge on the picker card (similar to CLASSIC/MONSTER badges) in a gold/yellow color to distinguish it.

---

## Roster Update

| # | Name | Style | Render | Badge |
|---|------|-------|--------|-------|
| 1 | Flame Crusher | classic | canvas | CLASSIC |
| 2 | Blue Thunder | classic | canvas | CLASSIC |
| 3 | Green Machine | classic | canvas | CLASSIC |
| 4 | Purple Nightmare | classic | canvas | CLASSIC |
| 5 | Grave Stomper | monster | canvas | MONSTER |
| 6 | Red Rampage | monster | canvas | MONSTER |
| 7 | Thunder Bull | monster | canvas | MONSTER |
| 8 | Toxic Crusher | monster | canvas | MONSTER |
| **9** | **Flame Crusher HD** | **monster** | **svg** | **HD** |

---

## Do NOT Change
- Any of the existing 8 trucks
- Collision boxes or physics
- Game mechanics
- Spawn logic
- The single-file architecture (no external files)

## What Changes
- Truck roster grows from 8 to 9
- New `drawTruckHD()` function added
- Two SVG data URIs embedded in the code
- Two `Image` objects loaded at startup
- Picker pages now include a 3rd page for truck #9
- Draw loop checks `renderMode` before choosing draw function

---

## Testing Checklist
- [ ] Flame Crusher HD appears as truck #9 in the picker
- [ ] Picker shows "HD" badge in gold/yellow
- [ ] SVG body renders correctly at game scale (aligned with collision box)
- [ ] Wheels spin using the game's wheelAngle
- [ ] Exhaust flame visible behind the truck body
- [ ] Shadow visible beneath the truck
- [ ] Truck tilts correctly during jumps
- [ ] Backflip rotation works
- [ ] Landing squish animation works
- [ ] Truck looks correct at picker scale (larger, more detail visible)
- [ ] Original Flame Crusher (truck #1) still works unchanged
- [ ] All other 7 trucks still work unchanged
- [ ] No external file requests — all SVGs embedded as data URIs
- [ ] Fallback to Canvas rendering if SVG images fail to load
- [ ] Performance: no frame drops compared to Canvas trucks
- [ ] No console errors
