# Space Dodge — Visual Overhaul (Backgrounds + Life Icons + HUD)

**Read CLAUDE.md first.** Single HTML file, no external assets. All changes in `games/space-dodge/index.html`.

---

## TASK 1: Background Reworks (Worlds 2, 3, 4)

Replace the `drawNebulaDecor()`, `drawAsteroidBeltDecor()`, `drawIceFieldDecor()` functions and their corresponding `generateWorldDecor()` sections. **Do NOT touch** `drawDeepSpaceDecor()` or `drawSupernovaDecor()` — Worlds 1 and 5 stay unchanged.

Also update `drawWorldGradient()` with the new gradient stops for worlds 1-3 (index 1, 2, 3).

---

### World 2: NEBULA — Pillars of Creation

**Gradient:** `['#0a0520', '#1a0a3e', '#2a0e4a', '#1a0830']`

**Layer 1 — Deep background glow patches (3-4 large radial gradients):**
- Colors: `#4A148C`, `#880E4F`, `#311B92`
- Radii: 150-250px, alpha 0.08-0.12
- These are static (no animation needed — they're deep background)

**Layer 2 — Nebula gas pillars (3 tall vertical columns):**
- Vertical gradient fills, wide (70-100px), spanning most of screen height
- Colors: purples/pinks (`#6A1B9A`, `#CE93D8`, `#AB47BC`, `#F48FB1`)
- Bright edge highlight stroke on one side of each pillar
- **ANIMATION — CRITICAL:**
  - Slow vertical drift downward: each pillar's `y` decreases by `speed * 0.001` per frame. When pillar scrolls fully off bottom, reset to top. Different speeds per pillar (0.2, 0.35, 0.5) for parallax depth.
  - Gentle horizontal sway: `x` offset by `Math.sin(frameCount * 0.008 + pillar.phase) * 15` pixels
  - Opacity pulse: `alpha * (0.9 + Math.sin(frameCount * 0.015 + pillar.phase) * 0.1)` so they breathe
- Pillars must be **transparent enough** (base alpha 0.10-0.18) that gameplay elements (ship, asteroids, blasters) are always clearly visible in front

**Layer 3 — Wispy tendrils (3-4 curved gas filaments):**
- Drawn with `quadraticCurveTo`, strokeWidth ~12px with a wider glow stroke (~30px) behind at lower alpha
- Colors: `#CE93D8`, `#F48FB1`, `#EA80FC`
- **ANIMATION:** Opacity pulse via `sin(frameCount * 0.02 + tendril.phase)`

**Layer 4 — Bright star clusters:**
- 5-6 prominent stars with radial glow halos (inner white core, outer colored glow)
- 1 tight star cluster (15-20 tiny stars in a ~40px radius)
- Stars shimmer: glow radius oscillates via `sin(frameCount * 0.03 + star.phase)`

**generateWorldDecor for Nebula:** Pre-generate pillars (x, topY, botY, width, colors, speed, phase), tendrils (control points, color, phase), bright stars (x, y, r, color, phase), cluster center.

---

### World 3: ASTEROID BELT — Dense Debris Field

**Gradient:** `['#0f0a04', '#1a1008', '#251810', '#1a1008']`

**Layer 1 — Distant gas giant (bottom-right quadrant):**
- Partial circle, center at ~(W*0.85, H*0.75), radius ~180
- Radial gradient: `#D4A574` → `#A67C52` → `#8D6E63` → `#5D4037` → `#3E2723`
- Alpha 0.25 (subtle, not overpowering)
- 5-6 horizontal bands across the planet surface (alternating `#BCAAA4` and `#795548`, alpha 0.08)
- Atmospheric glow ring outside planet edge (`#FFB74D`, alpha 0.15)
- **ANIMATION:** Bands scroll slowly left: `bandX -= 0.15` per frame (creates slow rotation illusion)

**Layer 2 — Dust haze lanes (3-4 horizontal bands):**
- Full-width rectangles, height 20-40px, staggered vertically
- Color: `#8D6E63`, alpha 0.04-0.08
- **ANIMATION:** Very slow vertical drift (different speeds per band, ~0.1-0.2px/frame)

**Layer 3 — Background asteroids at 3 depth layers:**

Each rock: irregular polygon (7-10 vertices), radial gradient (lit side brighter), small crater circle, highlight arc on one edge.

- **Far layer (3 rocks):** radius 35-50, alpha 0.08-0.12. Drift down at 0.15px/frame.
- **Mid layer (4-5 rocks):** radius 18-28, alpha 0.15-0.20. Drift down at 0.3px/frame. Slow rotation.
- **Near layer (10-12 rocks):** radius 4-10, alpha 0.15-0.25. Drift down at 0.5px/frame. Faster rotation.

When any rock scrolls off bottom (y > H + radius), reset to top (y = -radius) with new random x.

**Layer 4 — Dust particles (50-60):**
- Tiny circles, radius 0.5-2.5px, color `#BCAAA4` or `#8D6E63`, alpha 0.1-0.25
- Drift down at varied speeds

**Layer 5 — Warm bright stars (3):**
- Radial glow halo in `#FFB74D`, white core, glow radius oscillates

**generateWorldDecor for Asteroid Belt:** Pre-generate gas giant (static position), dust bands, rocks at 3 layers (x, y, r, alpha, rotation, speed, vertices), dust particles, bright stars.

---

### World 4: ICE FIELD — Frozen Expanse

**Gradient:** `['#040e18', '#081828', '#0a1e35', '#061520']`

**Layer 1 — Frozen moon (upper-left quadrant):**
- Center at ~(W*0.22, H*0.12), radius ~40
- Radial gradient body: `#E1F5FE` → `#B3E5FC` → `#81D4FA` → `#4FC3F7`
- 3 small dark craters (`#0288D1`, alpha 0.15)
- Ambient glow ring: large radial gradient (`#B3E5FC`, fading to transparent), radius 3x moon
- **ANIMATION:** Glow pulses: `glowAlpha = 0.08 + sin(frameCount * 0.01) * 0.03`

**Layer 2 — Vivid aurora bands (3 bands):**
- Each band: two strokes — wide glow (lineWidth ~30-40px, low alpha) + sharp core (lineWidth ~10-14px, higher alpha) + thin white highlight (lineWidth 1px)
- Wave math: `y = baseY + sin(x * 0.005 + frameCount * 0.02 + phase) * amplitude + sin(x * 0.012 + phase * 0.5) * (amplitude * 0.4)` — dual-frequency for organic look
- Colors: `#00BCD4`/`#4FC3F7`, `#26C6DA`/`#80DEEA`, `#00ACC1`/`#B2EBF2`
- Alpha: 0.08-0.12 core, 0.03-0.05 glow
- **ANIMATION:** Already animated via `frameCount` in wave equation (from current code, just increase visual parameters)

**Layer 3 — Ice crystal formations:**
- Pentagonal elongated shapes (5-sided: point on top, two angled sides, two bottom edges)
- Gradient fill: `#E0F7FA` → `#B2EBF2` → `#80DEEA` → `#4DD0E1`
- Internal facet line (white, low alpha)
- Some crystals have a triangular highlight (white, alpha 0.3) on one face
- **Large formations (4):** height 55-90px, width 15-25px, alpha 0.12-0.18, placed at screen edges (not blocking center gameplay area)
- **Medium (3):** height 35-50px, alpha 0.08-0.12, scattered
- **Small (8):** height 12-20px, alpha 0.06-0.08, random placement
- **ANIMATION:** Crystals are static (they're frozen!) but get occasional shimmer flash — every ~180 frames, one random crystal brightens briefly

**Layer 4 — Ice fog at bottom:**
- Linear gradient from transparent (at H*0.75) to `rgba(179,229,252,0.06)` at bottom
- **ANIMATION:** Fog top edge undulates slowly: `fogY = H * 0.75 + sin(frameCount * 0.005) * 10`

**Layer 5 — Ice sparkles (12-15):**
- 4-pointed diamond shapes (8-vertex star)
- Size 1.5-3.5px, white, alpha 0.4-1.0
- **ANIMATION:** Each sparkle has a `twinklePhase`; alpha = `0.5 + sin(frameCount * 0.08 + phase) * 0.5`. When alpha < 0.1, reposition randomly (creates twinkling migration effect)

**generateWorldDecor for Ice Field:** Pre-generate moon (static), aurora params (baseY, amplitude, freq, phase, colors), crystals (x, y, h, w, rot, alpha, hasHighlight), fog params, sparkles (x, y, size, phase).

---

## TASK 2: Life Icons Match Active Ship

**Current problem:** `drawMiniShip()` and `drawLives()` draw a hardcoded generic ship (blue panels, red nose, red wings) regardless of which ship the player selected.

**Fix:** Replace the `drawMiniShip()` alive branch with `drawImage()` using the actual selected ship's preloaded SVG image.

```javascript
function drawMiniShip(x, y, w, h, alive) {
  ctx.save();
  ctx.translate(x, y);
  if (alive) {
    // Draw actual selected ship SVG
    const img = shipImages[selectedShip];
    if (img.complete && img.naturalWidth > 0) {
      const s = SHIPS[selectedShip];
      ctx.drawImage(img, -w/2 * s.drawW, -h/2 * s.drawH, w * s.drawW, h * s.drawH);
    } else {
      // Fallback: accent-colored dot
      ctx.fillStyle = SHIPS[selectedShip].accent;
      ctx.beginPath();
      ctx.arc(0, 0, w/2, 0, Math.PI * 2);
      ctx.fill();
    }
    // Animated thruster flame (keep existing flame code, use ship's flameColors)
    const fc = SHIPS[selectedShip].flameColors;
    const flameH = 4 + Math.random() * 4;
    const flameW = w * 0.3;
    ctx.fillStyle = fc[1] || '#FF8F00';
    ctx.beginPath();
    ctx.moveTo(-flameW / 2, h/2 * 0.6);
    ctx.quadraticCurveTo(0, h/2 * 0.6 + flameH, flameW / 2, h/2 * 0.6);
    ctx.fill();
    ctx.fillStyle = fc[2] || '#FFD54F';
    ctx.beginPath();
    ctx.moveTo(-flameW / 4, h/2 * 0.6);
    ctx.quadraticCurveTo(0, h/2 * 0.6 + flameH * 0.6, flameW / 4, h/2 * 0.6);
    ctx.fill();
  } else {
    // Ghost ship — faded version of actual ship
    const img = shipImages[selectedShip];
    if (img.complete && img.naturalWidth > 0) {
      const s = SHIPS[selectedShip];
      ctx.globalAlpha = 0.15;
      ctx.drawImage(img, -w/2 * s.drawW, -h/2 * s.drawH, w * s.drawW, h * s.drawH);
      ctx.globalAlpha = 1;
    } else {
      ctx.globalAlpha = 0.15;
      ctx.fillStyle = '#666';
      ctx.beginPath();
      ctx.arc(0, 0, w/2, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }
  ctx.restore();
}
```

**Also update `drawLives()` label color** to use the selected ship's accent:
- Change `ctx.fillStyle = 'rgba(100,200,255,0.6)'` to `ctx.fillStyle = SHIPS[selectedShip].accent + '99'`

This same fix applies to the mini ship on the World Title screen (`drawWorldTitle()` around line 1592).

---

## TASK 3: Mobile HUD Scaling

**Current problem:** Font sizes at small `scale` values become unreadable on phones. The minimum readable size on mobile is roughly 11-12px.

**Fix:** Add a `clampFont(size)` helper and use it everywhere in the HUD:

```javascript
function clampFont(size) {
  return Math.max(11, Math.round(size * scale));
}
```

**Apply to these specific locations:**

| Location | Current | New Minimum |
|----------|---------|-------------|
| `drawLives()` — "LIVES" label | `7 * scale` | `clampFont(7)` → min 11px |
| `drawHUD()` — score | `22 * scale` | `clampFont(22)` → min 16px |
| `drawHUD()` — "BEST" score | `11 * scale` | `clampFont(11)` → min 11px |
| `drawHUD()` — world name | `13 * scale` | `clampFont(13)` → min 11px |
| `drawHUD()` — percentage text | `7 * scale` | `clampFont(7)` → min 11px |
| `drawPowerupHUD()` — timer text | whatever current | min 11px |

**Also increase the progress bar minimum width on mobile:**
- Current: `Math.min(260, W * 0.35) * scale`
- New: `Math.max(120, Math.min(260, W * 0.35) * scale)` — ensures bar is at least 120px wide on small screens

**Also increase mini ship size in `drawLives()`:**
- Current: `shipW = 16 * scale`, `shipH = 22 * scale`
- New: `shipW = Math.max(14, 16 * scale)`, `shipH = Math.max(19, 22 * scale)` — ensures ships are visible on mobile

---

## iOS Touch Handling

This task doesn't add new interactive buttons, so no new touch handlers needed. But verify that existing touch handlers still work after the changes (ship picker, mode buttons, pause, mute).

---

## Syntax Check

After every change, run:
```bash
node -e "try { new (require('vm').Script)(require('fs').readFileSync('games/space-dodge/index.html','utf8')); console.log('SYNTAX OK'); } catch(e) { console.log('ERROR:', e.message); }"
```
The HTML `<` token error is a known false positive.

---

## What NOT to Change

- Do NOT modify Worlds 1 (Deep Space) or 5 (Supernova) backgrounds
- Do NOT modify game physics, spawn rates, difficulty, or scoring
- Do NOT modify ship SVGs or the ship roster
- Do NOT modify power-up mechanics
- Do NOT modify the title screen or ship picker layout
- Do NOT add any external assets or dependencies
- Do NOT change the audio system

---

## Commit Strategy

Recommend 2-3 commits:
1. **Background reworks** — all 3 worlds (biggest change, test visually)
2. **Life icons + HUD scaling** — smaller, lower risk
3. Optional: split backgrounds into individual commits if debugging needed
