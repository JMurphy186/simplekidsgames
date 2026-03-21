# Monster Rally — Phase 1 Build Prompt

**Read CLAUDE.md first.** It contains architecture rules, constraints, and design principles.

---

## Context
This is a browser-based monster truck game for two kids (ages 3 and 6). The base game exists in `index.html` — a working side-scrolling monster truck with one-button jump, car crushing, star collection, combos, ramps, and particle effects. Everything runs in a single HTML file using Canvas 2D. No build tools, no external assets.

## Phase 1 Deliverables

### 1. Sound Effects (Web Audio API)

Add procedurally generated sound effects using the Web Audio API (`AudioContext`). **No external audio files.** All sounds synthesized in code.

**Implementation requirements:**
- Create an `AudioContext` on the FIRST user interaction (tap/keypress) to comply with browser autoplay policy. Store it globally.
- Create a `SoundEngine` object/class with methods for each sound. Keep it simple — helper functions that create oscillators/noise and connect to destination.
- All sounds should be short and punchy. Kids game = satisfying audio feedback on every action.

**Sounds to implement:**

| Sound | Trigger | Synthesis approach |
|-------|---------|-------------------|
| Engine hum | Constant while playing | Low sawtooth oscillator (~80Hz), gain tied to `gameSpeed`. Start quiet, get louder/higher as speed increases. Use a GainNode with subtle LFO modulation for rumble feel. |
| Crush/Smash | On car crush | White noise burst (100ms) through a low-pass filter (cutoff ~800Hz) + simultaneous sine wave thump at 60Hz (80ms decay). Randomize slightly per hit for variety. |
| Star collect | On star pickup | Quick 3-note ascending sequence: C5→E5→G5, sine wave, 40ms per note, slight overlap. Clean and cheerful. |
| Ramp launch | On ramp contact | Rising pitch sweep: sine oscillator from 200Hz→800Hz over 250ms with exponential ramp. |
| Big air | When airborne > 1.5 seconds | Sustained whoosh — filtered noise, band-pass filter sweeping up slowly. Fade in, cut on landing. |
| Landing thud | On ground contact after jump | Very short noise burst (50ms) through low-pass filter at 200Hz. Volume proportional to fall distance. |
| Combo fanfare | On combo >= 3 | Major chord burst (C4+E4+G4, triangle waves) with duration scaling up with combo count. Add a high sparkle (sine at 2000Hz, 30ms) on top. |
| Horn | User-presses H key or honk button | Fat square wave at 180Hz, 400ms duration, slight pitch bend down. FUN and LOUD. Should make kids giggle. |

**Horn button:** Add a visible "HONK!" button in the bottom-right corner of the screen (canvas-drawn, not HTML). Tappable on mobile. Also triggered by pressing H on keyboard.

**Audio toggle:** Small speaker icon in top-right corner to mute/unmute. Default ON. Mute state persisted in localStorage.

### 2. Truck Picker Screen

Add a truck selection screen between the title screen and gameplay.

**Flow:** Title Screen → [tap to start] → Truck Picker → [select truck] → Game Starts

**Truck roster (from CLAUDE.md):**

| Name | Body Color | Accent Color | Decal |
|------|-----------|-------------|-------|
| Flame Crusher | `#ff4400` | `#ffcc00` | Flame pattern (existing) |
| Blue Thunder | `#2255ff` | `#00ccff` | Lightning bolt shapes |
| Green Machine | `#22cc44` | `#88ff00` | Diagonal racing stripes |
| Purple Nightmare | `#8833cc` | `#ff44ff` | Star shapes |

**Truck picker UI:**
- Dark background matching game aesthetic
- "CHOOSE YOUR TRUCK!" title text, bold, centered
- 4 trucks displayed in a 2x2 grid (or horizontal row on wide screens)
- Each truck shown as a mini preview: the actual truck drawn at ~1.5x scale with its name below
- Selected truck has a glowing border/highlight (pulsing animation)
- Tap/click a truck to select it. Tap/click again or press Enter/Space to confirm and start.
- Arrow keys can also navigate between trucks
- The selected truck's colors are stored and used to draw the truck during gameplay

**Implementation:**
- Add a `gameState` variable: `'title'` | `'picker'` | `'playing'`
- The `drawTruck()` function must accept color parameters instead of hardcoded `#ff4400`
- Store selected truck index in a variable, reference the truck roster array for colors
- Selection persisted to localStorage so the kid's favorite is pre-selected next time

### 3. More Crushable Objects

Add variety to obstacles. Currently: car, suv, bus, ramp. Add:

| Object | Width | Height | Points | Visual |
|--------|-------|--------|--------|--------|
| Barrel pile | 40 | 30 | 8 | 3 stacked brown barrels/circles |
| Porta-potty | 30 | 45 | 15 | Tall blue rectangle with door line and vent, tips over when crushed |
| Old TV stack | 50 | 40 | 12 | 2 retro TVs stacked, static-screen rectangles with antennas |
| Hay bale | 35 | 25 | 5 | Golden circle/cylinder with line texture |
| Limo | 110 | 30 | 20 | Extra-long car, shiny white/silver with tinted windows |

**Each new object needs:**
- Unique draw function (Canvas shapes only, no images)
- Crush animation (flatten, tip, shatter — varies by type)
- Unique particle colors on crush
- Added to the spawn randomizer with appropriate weights (common objects more frequent)

### 4. Backflip Trick

When the truck is airborne for more than ~60 frames (1 second at 60fps), it automatically starts doing a backflip.

**Implementation:**
- Track consecutive airborne frames in a counter
- After threshold, begin rotating the truck (add rotation to `drawTruck`'s transform)
- Full 360° rotation over ~40 frames
- On completion: burst of particles, "BACKFLIP!" text popup, +50 bonus points
- Multiple flips possible on huge air (ramp → crush bounce chains)
- If the truck lands MID-flip, snap rotation to 0 (forgiving — never punish)
- Screen shake + flash on flip completion

---

## Code Quality Requirements
- Keep everything in `index.html` — no separate files
- Comment each new section clearly with section headers
- Use constants for all tuning values (sound frequencies, timing, physics)
- Don't break existing functionality — the base game must still work identically with the new features layered on
- Test that touch still works after adding keyboard shortcuts (H for horn, arrows for truck picker)

## What NOT To Do
- Don't add npm or build tools
- Don't create separate JS/CSS files  
- Don't add difficulty that would frustrate a 3-year-old
- Don't use any external assets (images, audio files, fonts via URL)
- Don't add a game-over or death state
- Don't use ES module imports (except CDN script tag for Tone.js if AudioContext proves insufficient, but prefer raw Web Audio API)
