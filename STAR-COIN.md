# Monster Rally — Star Coin Icon Redesign

**Read CLAUDE.md first.** This replaces the current basic star collectible with the Star Coin design (Concept C). Visual-only change — do not modify collectible behavior, scoring, spawn logic, or game mechanics.

**Reference:** See `star-concepts.html` in the project folder — extract the `drawHybridC` function. That is the exact drawing code to use.

---

## Selected Design: Star Coin (Concept C)

A chunky gold coin with a notched metallic rim and a raised/embossed star in the center. Feels collectible and premium.

### Visual Breakdown
1. **Outer glow** — soft gold radial gradient aura behind the coin
2. **Metallic rim** — linear gradient (gold to dark gold) full circle, gives a thick chunky edge
3. **Coin face** — slightly smaller circle inside the rim, radial gradient from bright gold center to darker gold edge
4. **Notched rim detail** — 24 small radial lines around the edge (subtle, like a coin's reeded edge)
5. **Star (shadow)** — dark gold star offset slightly down-right (emboss shadow effect)
6. **Star (bright)** — golden gradient star centered on the coin face, slightly smaller than the shadow
7. **Star outline** — thin dark gold stroke around the bright star for definition
8. **Shimmer highlight** — white ellipse on the upper-left area of the coin (glass/metal reflection)

### Drawing Function

Extract `drawHybridC(ctx, r)` from `star-concepts.html` and use it to replace the current star drawing code. The function takes:
- `ctx` — canvas 2D context (already translated to the star's center position)
- `r` — radius of the collectible

Also extract the `drawStarShape(ctx, cx, cy, outerR, innerR, points)` helper if it doesn't already exist in the game code.

### Integration

Find the current star/collectible drawing code (likely `drawStar(s)` or similar). Replace the drawing logic with:

```js
ctx.save();
ctx.translate(star.x, star.y + bobOffset); // keep existing bob animation
drawStarCoin(ctx, 12); // 12px radius at game scale
ctx.restore();
```

### Where It Appears
- **Floating collectibles** during gameplay — radius ~12px
- **HUD score display** (the ⭐ next to the score number) — radius ~8-10px
- **Collection burst** — briefly scale up to ~18px on collect before particle explosion
- **Truck picker** (Best: ⭐ score) — radius ~8px

### Bob Animation
Keep the existing bob/float animation on collectible items. The Star Coin just replaces what's drawn at each position.

### Collection Particles
When collected, the current star particle burst should update to use gold coin colors:
- Primary: `#ffd700` (gold)
- Secondary: `#ffdd44` (bright gold)
- Accent: `#cc9900` (dark gold)
- A few white sparkle particles mixed in

---

## Do NOT Change
- Star spawn logic, timing, or frequency
- Point values for collecting stars
- Star collision/pickup detection radius
- Bob animation behavior
- Star behavior during Magnet power-up
- Any game mechanics

This is a visual-only change to the star collectible appearance.

---

## Testing Checklist
- [ ] Floating collectibles show as gold coins with embossed star (not flat yellow stars)
- [ ] Coin has visible notched rim, metallic gradient, and shimmer highlight
- [ ] HUD score icon updated to match coin style
- [ ] Bob animation still works on floating coins
- [ ] Collection particle burst uses gold/coin colors
- [ ] Magnet power-up still attracts coins correctly
- [ ] Readable at game speed (coin shape distinct from power-up icons)
- [ ] 60fps maintained with multiple coins on screen (5-8 simultaneous)
- [ ] No changes to scoring, spawn rates, or collision
