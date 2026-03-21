# Monster Rally — Refinement Pass (Pre-Launch Polish)

**Read CLAUDE.md first.** This refinement pass addresses playtesting feedback from real users (ages 3 and 6 on iPads). Every change here is informed by watching kids actually play the game.

---

## Art Direction (Reference Images Provided)

Two reference sheets were created showing all vehicle models. **The approved art direction is:**

**Image 2 (clean vector) style rendered on dark game backgrounds.**

Key principles:
- **Clean, flat shapes** — smooth lines, solid fills, minimal gradients. NOT pixel art. This style maps directly to Canvas API primitives (`roundRect`, `arc`, `lineTo`, `fillStyle`).
- **Dark backgrounds** — the game's existing dark sky/ground palette stays. Vehicles should pop against it with bright, saturated colors.
- **Readable at small scale** — clean silhouettes that read clearly on a phone screen. No fine detail that disappears at game scale.
- **Every vehicle has personality** — distinct proportions, colors, and identifying features (not just recolored clones).
- **Consistent style across all vehicles** — monster trucks AND crushable vehicles share the same art language (same line weight feel, same color saturation level, same level of detail).

This art direction applies to ALL vehicles: the 4 playable monster trucks, the 4 new monster trucks, AND all crushable obstacle vehicles.

---

## Priority Order
1. Pause / Restart / Escape system (critical bug fix)
2. Engine sound replacement (constant drone is annoying)
3. Monster truck models — keep originals, add 4 new monster trucks (8 total)
4. Crushable vehicle redesign — replace generic cars with named vehicles
5. Speed / gameplay tuning (too fast for iPad touch)
6. Battle mode overhaul (complete redesign)
7. UI polish pass

---

## 1. Pause / Restart / Escape System

**Problem:** There is no way to pause, restart, or exit to the menu during gameplay. Parents need this.

**Implementation:**

### Pause Button (always visible during gameplay)
- Draw a **pause icon** (two vertical bars, ❚❚) in the **top-right corner** of the canvas during `gameState === 'playing'`
- Size: 36x36px hit area, icon is 20x20px, semi-transparent white
- Tappable on mobile, clickable on desktop
- Keyboard shortcut: **Escape** key or **P** key

### Pause Overlay
When paused, set `gameState = 'paused'` and draw:
- Semi-transparent dark overlay over the frozen game scene (game objects still visible underneath)
- **"PAUSED"** title text (large, centered, white)
- Three vertically stacked buttons:
  - **▶ RESUME** (green) — returns to `gameState = 'playing'`
  - **↺ RESTART** (orange) — calls `initGame()` then `startCountdown()`
  - **✕ QUIT** (red) — returns to `gameState = 'modeselect'`
- Each button: 200px wide, 50px tall, rounded corners, centered horizontally
- Keyboard shortcuts: **R** = restart, **Q** = quit, **Escape/P/Space** = resume

### State Management
- Add `'paused'` to valid gameState values
- The `update()` function should skip ALL game logic when `gameState === 'paused'`
- The `draw()` function should render the game scene (frozen) + pause overlay on top
- Audio: mute engine/big-air sounds while paused, resume on unpause
- Timer: `roundTimer` does NOT decrement while paused (important for Frenzy/Battle modes)

---

## 2. Engine Sound Replacement

**Problem:** The constant engine drone is overwhelming and annoying during extended play. It dominates the audio mix and makes the fun action sounds (crush, star, ramp) harder to hear.

**Solution:** Replace the constant engine hum with a **subtle rhythmic beat** that matches the game's energy without being fatiguing.

### Option A: Rhythmic Bounce (Preferred)
Replace the engine oscillator with a **soft kick drum pattern** — a low-frequency thump that pulses every ~0.5 seconds, tied to game speed:
- Use a short sine wave burst at ~60Hz, 50ms duration, very low gain (0.08-0.12)
- Interval: `600 / gameSpeed * 100` ms (gets faster as speed increases, feels like the truck is bouncing)
- This creates a heartbeat-like rhythm that's felt more than heard
- Much less fatiguing than a constant tone

### Option B: Silence + Wheel Sound
- Remove constant engine entirely
- Add a **soft rolling/rumble** that only plays when the truck is on the ground
- Filtered white noise, very low gain (0.05), band-pass filter at 100-300Hz
- Cuts out completely when airborne (the silence itself becomes a gameplay cue — "I'm in the air!")

### Implementation Notes
- Whichever option: the sound must be **dramatically quieter** than crush/star/ramp sounds
- Reduce overall engine/ambient gain to ~15% of current level at minimum
- The action sounds (crush, star, horn, ramp) should be the stars of the audio mix
- Respect the existing mute toggle — ambient sound mutes with everything else

---

## 3. New Monster Truck Models (Keep Originals + Add 4 New)

**What changed:** Keep ALL 4 original trucks exactly as they are (Flame Crusher, Blue Thunder, Green Machine, Purple Nightmare). They work, the kids like them. Add 4 NEW monster truck models alongside them for a total of **8 trucks** in the roster.

The new trucks use a completely different `drawTruckMonster()` function with monster truck proportions — massive tires, high suspension, aggressive stance. The original trucks continue using the existing `drawTruck()` function unchanged.

### Roster Structure (8 trucks total)

Each truck in the roster array needs a `style` property: `'classic'` or `'monster'`.

| # | Name | Style | Body Color | Accent Color | Decal |
|---|------|-------|-----------|-------------|-------|
| 1 | Flame Crusher | classic | `#ff4400` | `#ffcc00` | Flames (existing) |
| 2 | Blue Thunder | classic | `#2255ff` | `#00ccff` | Lightning bolts (existing) |
| 3 | Green Machine | classic | `#22cc44` | `#88ff00` | Racing stripes (existing) |
| 4 | Purple Nightmare | classic | `#8833cc` | `#ff44ff` | Stars (existing) |
| 5 | Grave Stomper | monster | `#1a1a1a` | `#44ff44` | Green skull/crossbones on door panel |
| 6 | Red Rampage | monster | `#cc1100` | `#ff4444` | Claw scratch marks (3 diagonal lines) |
| 7 | Thunder Bull | monster | `#1144aa` | `#ffcc00` | Bull horns on the hood, yellow stripe |
| 8 | Toxic Crusher | monster | `#338833` | `#00ff88` | Hazard stripes (black/green diagonal) |

### Drawing Logic
```js
// In the draw loop, check truck style:
if (truck.style === 'monster') {
  drawTruckMonster(tx, ty, truck.colors);
} else {
  drawTruck(tx, ty, truck.colors);  // existing function, unchanged
}
```

### New `drawTruckMonster()` Function — Monster Truck Proportions

**Overall dimensions:** Same collision box as classic trucks (~90x50) so gameplay physics are identical. Only the visuals change.

**Wheels (the star of the show):**
- Radius: **20px** (vs 14px on classic) — these should be MASSIVE
- Thick black tire with visible tread pattern (6 radial lines from hub to edge)
- Chrome/silver rim: 45% of wheel radius
- Colored hub cap: 25% of wheel radius (matches truck accent color)
- Wheels should sit BELOW the truck body with visible suspension gap
- Draw wheels with slight 3D effect: darker shadow on bottom half of tire

**Suspension:**
- Visible suspension arms connecting body to wheel axles
- 4 lines (2 per wheel) forming a V-shape from body corners down to wheel centers
- Color: dark gray (#444)
- Line width: 3px
- Suspension compresses on landing (animate with existing squish variable)

**Body:**
- Sits HIGH above the wheels — 12-15px of visible clearance between body bottom and ground
- Shorter and taller proportions than classic (less sedan, more truck cab)
- Main body: rounded rectangle, 65px wide, 30px tall
- Cab/roof: smaller rectangle on top-right portion, 25px wide, 15px tall
- Window: light blue rectangle inside cab
- Front bumper: aggressive, extends 5px forward from body, chrome colored
- Rear: slightly tapered

**Decals (per monster truck):**
- Grave Stomper: green skull shape on the door (simple: circle + triangle jaw)
- Red Rampage: 3 diagonal claw scratch lines in accent color
- Thunder Bull: two horn shapes on the hood (curved triangles), yellow center stripe
- Toxic Crusher: alternating black and green diagonal hazard stripes on body

**Exhaust:**
- When airborne: flame effect shoots from the BACK (same as classic)
- When grounded at high speed: small puffs from exhaust pipe on rear (new for monster trucks)

**Shadow:**
- Elliptical shadow on the ground beneath the truck
- Shadow Y position stays at GROUND_Y (doesn't follow truck up during jumps)
- Shadow gets smaller/fainter as truck gets higher (nice depth cue)
- Applied to monster trucks only (classic trucks keep their existing shadow)

### Truck Picker Updates
- Picker now scrolls through 8 trucks instead of 4
- Scale truck preview to ~1.5x game scale so kids can see detail on the monster trucks
- Show a subtle **"CLASSIC"** or **"MONSTER"** tag below each truck name so kids understand the two styles
- **Future improvement (NOT now):** Redesign picker from horizontal scroll to a full grid/garage menu. For now, the scroll picker with 8 trucks is fine.

### CLAUDE.md Roster Update
Update the truck roster table in CLAUDE.md to include all 8 trucks with the style column.

---

## 4. Crushable Vehicle Redesign (Replace Generic Obstacles)

**What changed:** Remove the old generic `car`, `suv`, and `bus` obstacle types. Replace them with **named, visually distinct vehicles** matching the reference sheet art direction (clean vector style).

### New Crushable Vehicle Roster

| Vehicle | Width | Height | Points | Color | Visual Notes |
|---------|-------|--------|--------|-------|-------------|
| **Red Racer** | 55 | 28 | 8 | `#e74c3c` (red) | Pickup truck — bed in back, cab up front, small wheels, angular body |
| **Cool Blue** | 55 | 28 | 8 | `#3498db` (blue) | Pickup truck — same proportions as Red Racer, blue paint, slightly different cab shape |
| **Gold Rush** | 55 | 28 | 8 | `#f39c12` (orange-gold) | Pickup truck — same proportions, warm gold, maybe a subtle bed cover |
| **Big SUV** | 65 | 35 | 10 | `#2c3e50` (dark gray-blue) | Taller, boxier than pickups, 4-door silhouette, roof rack suggestion, chunky |
| **School Bus** | 100 | 40 | 15 | `#f1c40f` (yellow) | Long body, "SCHOOL BUS" text on side (small, readable), flat front, emergency door on back, stop sign arm (small detail), multiple windows |
| **Stretch Limo** | 110 | 30 | 20 | `#ecf0f1` (white/silver) | Extra long, sleek and low, tinted windows (dark blue rectangles), chrome bumpers, fancy |

### Drawing Style (matching approved art direction)
- **Clean vector shapes** — rounded rectangles for bodies, circles for wheels, simple window shapes
- **Solid fills** — no pixel-art textures, no dithering. One main color per body panel, a darker shade for shadows/underside
- **Wheels:** Small dark circles with light gray/white rims (contrast with the monster trucks' massive wheels — makes the size difference obvious and satisfying)
- **Windows:** Light blue (`#88ccff`) rectangles with slight white reflection highlight
- **Exhaust puffs:** Small gray circles behind each vehicle (cosmetic, 2-3 circles trailing behind, static — they scroll with the vehicle)
- **Headlights:** Small white/yellow rectangles on the front of each vehicle

### Vehicle-Specific Crush Animations
Each vehicle type should have a slightly different crush effect:
- **Pickups (Red Racer, Cool Blue, Gold Rush):** Flatten vertically (standard crush), particle colors match body color
- **Big SUV:** Flatten + slight sideways tilt (tips to one side as it crushes), darker particles
- **School Bus:** Flatten significantly (it's tall, so the squish is dramatic), yellow + orange particles, hood pops up
- **Stretch Limo:** Accordion compress from front (crumples inward), white + silver particles, extra satisfying screen shake (it's the high-value target)

### Spawn Weights
```js
// Rally mode
types = ['red_racer','red_racer','cool_blue','cool_blue','gold_rush','gold_rush',
         'big_suv','big_suv','school_bus','stretch_limo',
         'ramp','ramp',
         'barrel','portapotty','tvstack','haybale','haybale'];

// Frenzy/Battle — no ramps, all crushable
types = ['red_racer','red_racer','red_racer','cool_blue','cool_blue','cool_blue',
         'gold_rush','gold_rush','big_suv','big_suv',
         'school_bus','stretch_limo',
         'barrel','barrel','portapotty','tvstack','haybale','haybale'];
```

Pickups are most common (easy, satisfying). School Bus and Stretch Limo are rarer (higher reward). The Phase 1 crushable objects (barrel, porta-potty, TV stack, hay bale) remain in the mix for variety.

### Code Changes
- Remove old `car`, `suv`, `bus` type strings from `spawnObstacle()` and drawing code
- Add new vehicle type strings: `red_racer`, `cool_blue`, `gold_rush`, `big_suv`, `school_bus`, `stretch_limo`
- Each new type gets its own draw function: `drawRedRacer(obs)`, `drawCoolBlue(obs)`, etc. — OR a single `drawVehicle(obs)` function that switches on type and applies the correct colors/proportions
- Keep the existing `drawCar(obs)` function signature pattern — new functions follow the same structure

---

## 5. Speed & Gameplay Tuning

**Problem:** The game is too fast, especially on iPad where touch input is less precise than keyboard. The 3-year-old can't react in time at higher speeds.

### Speed Reductions

**Rally mode:**
- Base speed: `2.0` → `1.6`
- Max speed: `8` → `6`
- Speed ramp formula: `Math.min(maxSpeed, 1.6 + maxScore / 1000)` (slower acceleration — takes longer to reach max)

**Crush Frenzy:**
- Fixed speed: `3.0` → `2.4`

**Battle mode:**
- Keep whatever speed the new battle system needs (see section 5)

### Obstacle Spacing
- Rally: increase minimum gap between obstacles by ~20%: `obstacleTimer = 80 + Math.random() * 70` (up from 70 + 60)
- Frenzy: `obstacleTimer = 20 + Math.random() * 20` (up from 15 + 15)

### Jump Physics
- Keep JUMP_FORCE the same (-12) — jumps feel good
- Reduce GRAVITY slightly: `0.55` → `0.48` — gives a slightly floatier feel, more time to line up crushes
- This also makes backflips easier to trigger (more hang time)

### Touch Responsiveness
- Ensure touch events use `{ passive: false }` and `preventDefault()` on both `touchstart` and `touchend`
- Add a **20ms debounce** on touch jump to prevent double-fire from iPad touch sensitivity
- Test that the tap-to-jump response feels instant (no perceptible delay)

---

## 6. Battle Mode Overhaul — Monster Truck Sumo

**Problem:** Current 2-player mode has both trucks on the left side going the same direction. It's not fun and doesn't feel competitive. 

**New concept: Face-to-face sumo battle.** Two trucks charge at each other. Jump to land on top of the opponent. Whoever lands on top scores a point. First to 5 wins.

### Arena Layout
- **No scrolling.** The arena is a fixed screen — both trucks visible at all times.
- Background: a flat arena/stadium (draw a simple dirt oval with crowd silhouettes along the edges)
- Ground line at the same Y position as other modes
- A center line marking the arena midpoint (dashed white line, subtle)

### Truck Positions
- **Player 1:** Starts on the LEFT side, facing RIGHT
- **Player 2:** Starts on the RIGHT side, facing LEFT (truck is drawn mirrored/flipped)
- Starting positions: P1 at x=150, P2 at x=650 (on an 800px wide canvas)

### Controls
- **Player 1:** A (move left), D (move right), W (jump) — OR left side of screen tap (jump only)
- **Player 2:** Left Arrow (move left), Right Arrow (move right), Up Arrow (jump) — OR right side of screen tap (jump only)
- On mobile: left half tap = P1 jump, right half tap = P2 jump. Trucks auto-charge toward each other on mobile (since there's no left/right movement with tap controls).

### Gameplay Loop
1. **Round start:** Both trucks at their starting positions. Brief "3, 2, 1, SMASH!" countdown.
2. **Charge phase:** Trucks move toward each other (auto-charge or player-controlled). They can jump at any time.
3. **Collision:** When trucks overlap horizontally:
   - If one truck is **above** the other (its Y is significantly higher and it's coming down): the **higher truck wins the clash** — it LANDS ON the lower truck
   - If both trucks are at roughly the same height: both bounce backward (no point scored)
   - If neither is jumping (both grounded): they bump and push each other back
4. **Point scored:** Winner gets screen shake, particle explosion, point added. Loser's truck gets squished briefly (cosmetic). Both trucks reset to starting positions.
5. **Score display:** "P1: 3 — P2: 2" centered at top, large text, each side colored to match their truck.
6. **Win condition:** First to **5 points** wins. Winning screen: "PLAYER 1 WINS!" with trophy particles, big truck celebration animation. "TAP TO PLAY AGAIN" returns to mode select.

### Collision Physics (simplified for kids)
```
When truck bounding boxes overlap:
  heightDiff = truckA.y - truckB.y
  
  if (heightDiff < -15):  // A is significantly ABOVE B
    → A wins (A landed on B)
  else if (heightDiff > 15):  // B is significantly ABOVE A
    → B wins (B landed on A)
  else:
    → Draw (both bounce backward, no point)
```

### Visual Feedback on Score
- Winning truck: brief glow effect + bounce animation
- Losing truck: squish flat briefly (like a crushed car), then pop back to normal
- Particle explosion at collision point (mix of both truck colors)
- Screen shake (strong, 10+)
- Text popup: "SMASH!", "CRUSHED!", "STOMPED!" (random)

### Mobile Considerations
- On mobile, remove left/right movement entirely. Trucks auto-approach each other at a moderate speed. Players can ONLY jump (tap their half of the screen). This makes it dead simple — timing your jump is the entire game.
- On desktop, movement + jump gives more depth for the 6-year-old.
- The auto-approach speed should be slow enough that both players have time to think about when to jump (~2px per frame).

### Removing Old Battle Mode
- Remove all references to the old side-by-side battle mode
- The `'battle'` gameMode string stays, but the gameplay is completely different
- Battle mode no longer uses the scrolling obstacle system AT ALL — it's an arena mode

---

## 7. UI Polish Pass

### Menu Transitions
- Add a quick **fade transition** (200ms) between menu states instead of hard cuts
- Implementation: when changing gameState, set a `fadeTimer = 12` (frames), draw a black overlay with decreasing opacity during the first 12 frames of the new state

### Truck Picker
- Make the selected truck's preview **larger** (2x scale instead of 1.5x)
- Add the truck NAME in bigger text below the preview
- Add left/right arrows on screen (tappable) in addition to keyboard controls
- Show a subtle "swipe" hint on mobile

### Game HUD
- Score text: add a subtle drop shadow for readability across all backgrounds
- Combo text: make it pulse/scale on increment (brief 1.2x scale that springs back)

### Title Screen
- Add version text in bottom corner: "v1.0" (small, subtle)
- Make the "TAP ANYWHERE TO START" text larger on mobile

### Back Button in Games
- When accessed from simplekidsgames.com, the game needs a way to get back to the game list
- Add a small **"← Back"** button in the top-left corner of the title screen only (not during gameplay)
- Links to `/` (site root) or uses `history.back()`
- Only show if `document.referrer` contains the site domain OR always show (simpler)

---

## Testing Checklist (verify all after implementation)
- [ ] Pause: Escape/P pauses, overlay shows, Resume/Restart/Quit all work
- [ ] Pause: Timer freezes in Frenzy mode while paused
- [ ] Pause: Tap the pause icon on mobile
- [ ] Sound: Engine drone is gone, replaced with subtle ambient
- [ ] Sound: Crush/star/ramp/horn sounds are clearly audible over ambient
- [ ] Sound: Mute toggle still works
- [ ] Trucks: All 4 classic trucks unchanged and still work
- [ ] Trucks: 4 new monster trucks have big wheels, high suspension, distinct look
- [ ] Trucks: Each of the 8 trucks has distinct decals visible during gameplay
- [ ] Trucks: Picker scrolls through all 8 trucks with CLASSIC/MONSTER tags
- [ ] Trucks: Picker screen shows trucks at larger scale with clear detail
- [ ] Vehicles: Red Racer, Cool Blue, Gold Rush spawn as distinct colored pickups
- [ ] Vehicles: Big SUV is visibly taller/boxier than pickups
- [ ] Vehicles: School Bus has yellow body, text, and multiple windows
- [ ] Vehicles: Stretch Limo is extra long, white/silver, tinted windows
- [ ] Vehicles: Old generic car/suv/bus types are fully removed
- [ ] Vehicles: Each vehicle type has unique crush animation
- [ ] Vehicles: Limo crush feels extra satisfying (more screen shake, particles)
- [ ] Speed: Rally mode feels 20-25% slower than before
- [ ] Speed: 3-year-old can react to obstacles on an iPad
- [ ] Speed: Game still reaches a satisfying "fast" feel at high scores, just takes longer
- [ ] Battle: Two trucks face each other in a fixed arena
- [ ] Battle: Landing on top of opponent scores a point
- [ ] Battle: First to 5 wins, celebration screen shows
- [ ] Battle: Mobile touch works (left half = P1, right half = P2)
- [ ] Battle: Trucks reset to starting positions after each point
- [ ] UI: Fade transitions between menu screens
- [ ] UI: Back button on title screen links to site root
- [ ] UI: HUD text has drop shadows for readability
- [ ] No console errors
- [ ] 60fps on desktop Chrome
- [ ] Touch controls responsive on iPad
