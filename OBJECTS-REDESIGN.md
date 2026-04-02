# Monster Rally — Crushable Objects Redesign

**Read CLAUDE.md first.** This replaces all crushable object drawing functions with polished redesigns. Visual-only change — do not modify collision boxes, spawn logic, point values, or game mechanics.

**Reference files in the project folder:**
- `objects-redesign.html` — vehicle and prop drawing code (pickups, SUV, bus, limo, barrels, porta-potty, TV, ramp)
- `trash-concepts.html` — trash can concepts (use Concept B: Green Wheelie Bins)
- `ramp-concepts.html` — ramp concepts (use Concept C: Construction Ramp)

Extract drawing functions from these files. The code is working Canvas — copy directly.

---

## Summary of Changes

| Object | What Changes |
|--------|-------------|
| Red Racer | Stepped pickup silhouette, chrome grille, headlights, window reflection, exhaust puffs |
| Cool Blue | Same as Red Racer in blue |
| Gold Rush | Same as Red Racer in gold |
| Big SUV | Boxy full-cab body, two windows with pillar, roof rack, running board |
| School Bus | Long body, 5 windows, "SCHOOL BUS" text, STOP sign arm, emergency door |
| Stretch Limo | Curved nose, 5 tinted windows, chrome trim stripe, 3 wheels |
| Barrel Pile | Wooden barrels with gradient shading, metal bands, stacked pyramid |
| Porta-Potty | Blue box with curved roof, vent slits, WC symbol, door handle |
| TV Stack | Two CRT TVs with **animated static**, rabbit ears, buttons — **static flickers every frame** |
| ~~Hay Bale~~ | **REMOVED** — replaced by Green Wheelie Bins |
| **Green Wheelie Bins** | **NEW** — three green residential bins with lids, ridges, wheels |
| Ramp | **REDESIGNED** — Construction ramp with yellow/black hazard stripes, flashing orange warning light |

---

## Object Specs

### Vehicles — Stepped Silhouette Pattern

All vehicles (pickups, SUV, bus, limo) use the `drawPickupTruck()` pattern from `objects-redesign.html`:
- Stepped body silhouette using `beginPath()`/`lineTo()` (hood → cab → bed)
- Two-tone body: bright upper fill + darker lower fill
- Thin outline stroke
- Window with reflection highlight
- Chrome grille at front with headlight
- Taillights at rear
- Small wheels with rim detail
- Exhaust puffs (2 small gray circles behind vehicle)
- Ground shadow ellipse

Extract `drawPickupTruck()`, `drawBigSUV()`, `drawSchoolBus()`, `drawStretchLimo()` from `objects-redesign.html`.

### Props

**Barrel Pile** — extract `drawBarrelPile()` from `objects-redesign.html`. Three wooden barrels with gradient shading, metal band rings, highlight, stacked in pyramid.

**Porta-Potty** — extract `drawPortaPotty()` from `objects-redesign.html`. Blue box with curved roof, door frame, vent slits, WC symbol, door handle.

**TV Stack** — extract `drawTVStack()` from `objects-redesign.html` BUT add animation:
- The TV screens should have **animated static/noise** that changes every frame
- Implementation: in the draw function, add random horizontal lines of varying brightness across the screen area, randomized each frame
- Also add a subtle **flicker** — every ~30 frames, briefly flash the screen brightness up then back down
- The rabbit ear antennas and buttons stay static, only the screen content animates
- This should be lightweight — just 4-6 random horizontal lines per TV per frame, not per-pixel noise

### Green Wheelie Bins (NEW — replaces Hay Bale)

Extract `drawTrashB()` from `trash-concepts.html` (Concept B: Green Wheelie Bins).

**Implementation details:**
- Three green residential wheelie bins
- Each bin: tapered body with linear gradient (dark green edges, bright green center), darker green hinged lid, handle groove, horizontal ridges, two small wheels at the bottom
- Back bin centered and higher, two front bins side by side
- Front-right bin slightly tilted (0.15 radians) for character
- Highlight streak on each bin body
- Ground shadow

**Spawn integration:**
- Replace the `'haybale'` type string with `'trashcan'`
- Same dimensions: 35×30px
- Same point value: 5 pts
- Same spawn weight in the obstacle type arrays
- Search for ALL references to `'haybale'`, `'hay'`, `'Hay'` and replace with `'trashcan'`/trash can equivalents

**Crush animation:**
- On crush: bins scatter outward (3 separate pieces flying in different directions)
- Lids fly off independently (2-3 small green rectangles with rotation)
- Particle colors: `#33aa33` (green), `#227722` (dark green), `#999` (gray for lids)
- Sound: metallic clatter (reuse the barrel crush sound or similar)

### Construction Ramp (REDESIGNED)

Extract `drawRampC()` from `ramp-concepts.html` (Concept C: Construction Ramp).

**Implementation details:**
- Triangle ramp body filled with yellow/black hazard stripes (diagonal)
- Use `ctx.clip()` to constrain the stripes within the triangle shape
- Edge outline in dark yellow
- **Flashing orange warning light** at the peak:
  - Orange circle with radial gradient glow
  - Small pole connecting it to the ramp surface
  - **Animated flash**: light pulses on/off every ~20 frames (toggle between full brightness and 30% brightness)
  - The glow radius expands/contracts with the flash
- The stripes themselves are static — only the warning light animates

**Ramp behavior stays identical** — same launch physics, same dimensions (60×25px). Only the visual changes.

---

## Integration Checklist

1. Add `drawGreenWheeliBins()` (or `drawTrashCans()`) function
2. Add `drawConstructionRamp()` function
3. Replace all vehicle draw functions with the new stepped-silhouette versions
4. Replace all prop draw functions with the new versions
5. Add TV static animation (randomize screen lines each frame)
6. Add ramp warning light flash animation (toggle every ~20 frames)
7. Replace `'haybale'` type with `'trashcan'` everywhere
8. Update spawn arrays to use `'trashcan'` instead of `'haybale'`
9. Update crush particle colors for trash cans (greens + gray)
10. Verify all crush animations still work with new drawings

---

## Do NOT Change
- Collision boxes or dimensions for any object
- Point values
- Spawn rates or type weights (except renaming haybale → trashcan)
- Physics (ramp launch force, etc.)
- Game state or mode logic

---

## Testing Checklist
- [ ] Red Racer / Cool Blue / Gold Rush: proper stepped pickup shape with grille, windows, wheels
- [ ] Big SUV: boxy, taller than pickups, two windows, roof rack
- [ ] School Bus: long yellow, 5 windows, "SCHOOL BUS" text, STOP sign
- [ ] Stretch Limo: extra long, white, tinted windows, chrome trim, 3 wheels
- [ ] Barrel Pile: 3 wooden barrels with metal bands, stacked
- [ ] Porta-Potty: blue box with curved roof, WC symbol
- [ ] TV Stack: two CRT TVs with **animated flickering static on screens**
- [ ] Green Wheelie Bins: 3 green bins with lids, wheels, one tilted
- [ ] No hay bales anywhere in the game
- [ ] Construction Ramp: yellow/black stripes with **flashing orange warning light**
- [ ] Ramp still launches the truck correctly
- [ ] All crush animations work (scatter, flatten, tip, etc.)
- [ ] Trash can crush: bins scatter, lids fly off, green particles
- [ ] 60fps maintained with all new objects on screen
- [ ] No changes to collision, points, spawn rates, or physics
