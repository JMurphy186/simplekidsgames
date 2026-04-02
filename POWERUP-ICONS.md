# Monster Rally — Power-Up Icon Redesign

**Read CLAUDE.md first.** This replaces the current basic power-up icons with polished, detailed designs. Visual-only change — do not modify power-up behavior, duration, spawn logic, or game mechanics.

**Reference:** See `powerup-concepts.html` in the project folder for the exact Canvas drawing code. The selected concepts are already implemented there — extract the draw functions directly.

---

## Selected Designs

| Power-Up | Concept | Description |
|----------|---------|-------------|
| **Turbo Boost** | B: Speed Bolt | Orange/red gradient circle, horizontal speed lines on left side, bold white lightning bolt with yellow glow |
| **Mega Truck** | C: Shield Star | Red gradient circle, white hexagonal shield outline with translucent fill, white up-arrow in center |
| **Magnet** | A: Horseshoe Magnet | Blue gradient circle, classic red U-shaped magnet with silver/chrome tips, dashed magnetic field lines curving between poles |
| **Super Jump** | A: Spring Coil | Purple gradient circle, white coiled spring drawn as a sine wave path, yellow up-arrow triangle at the top |

---

## Implementation

### 1. Extract Drawing Functions from powerup-concepts.html

The mockup file contains the exact Canvas drawing code for each selected icon. Copy these functions into the game:

- **Turbo Boost** → copy `turboB(ctx, r)` function
- **Mega Truck** → copy `megaC(ctx, r)` function
- **Magnet** → copy `magA(ctx, r)` function
- **Super Jump** → copy `jumpA(ctx, r)` function

### 2. Replace Current Power-Up Drawing Code

Find the current power-up drawing code in the game (likely in a `drawPowerUp()` function or inside the draw loop where power-up items are rendered). Replace the simple circle + symbol drawing with calls to the new functions.

Each new function takes `(ctx, r)` where:
- `ctx` is the canvas 2D context
- `r` is the radius of the power-up icon

The functions assume `ctx` is already translated to the power-up's center position. So the calling code should be:
```js
ctx.save();
ctx.translate(powerup.x, powerup.y);
// Call the appropriate draw function based on power-up type
if (powerup.type === 'turbo') turboIcon(ctx, radius);
else if (powerup.type === 'mega') megaIcon(ctx, radius);
else if (powerup.type === 'magnet') magnetIcon(ctx, radius);
else if (powerup.type === 'superjump') jumpIcon(ctx, radius);
ctx.restore();
```

### 3. Glow Effect

Each icon includes a `drawGlow()` helper that creates a radial gradient glow behind the icon. This helper is:
```js
function drawGlow(ctx, r, color, intensity) {
  const grad = ctx.createRadialGradient(0, 0, r * 0.3, 0, 0, r * 1.5);
  grad.addColorStop(0, color + (intensity || '44'));
  grad.addColorStop(1, 'transparent');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(0, 0, r * 1.5, 0, Math.PI * 2);
  ctx.fill();
}
```
Add this as a shared helper if it doesn't exist. All 4 icons use it.

### 4. Bob Animation

Keep the existing bob/float animation on power-up items (they should still bounce up and down as they scroll). The new icons just replace what's drawn at each position.

### 5. HUD Active Indicator

When a power-up is active, there's typically a small icon in the HUD showing which power-up is running with a timer bar. Update that HUD icon to use the same new drawing function but at a smaller radius (e.g., `r = 12`).

### 6. Size Reference

| Context | Radius |
|---------|--------|
| In-game floating item | 20-24px (current size, keep as-is) |
| HUD active indicator | 12-14px |
| Collection burst | Scale up briefly to 30px on collect before disappearing |

---

## Do NOT Change
- Power-up spawn logic, timing, or frequency
- Power-up effects (Turbo = 1.4x speed, Mega = 2.0x size, Magnet = 220px radius, Super Jump = 1.8x jump)
- Power-up duration
- Collision detection / pickup radius
- Bob animation behavior
- Any game mechanics whatsoever

This is a visual-only change to the power-up icons.

---

## Testing Checklist
- [ ] Turbo Boost icon: orange circle with speed lines and white lightning bolt
- [ ] Mega Truck icon: red circle with shield outline and up-arrow
- [ ] Magnet icon: blue circle with red horseshoe magnet and field lines
- [ ] Super Jump icon: purple circle with white spring coil and yellow arrow
- [ ] All 4 icons have radial glow behind them
- [ ] Icons readable at in-game size (~22px radius)
- [ ] HUD active indicator uses the same icons at smaller scale
- [ ] Bob animation still works on floating power-ups
- [ ] No changes to power-up behavior or game mechanics
- [ ] 60fps maintained (gradient/glow shouldn't tank performance)
