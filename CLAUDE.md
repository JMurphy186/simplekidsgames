# Monster Rally — CLAUDE.md

## What This Is
**Monster Rally** — a browser-based monster truck game built by a dad for his two kids (ages 3 and 6). Part of the **Simple Kids Games** platform at simplekidsgames.com. The game must be FUN FIRST — every decision should optimize for "would a 3-year-old mash buttons and laugh?" and "would a 6-year-old want to beat their high score?"

## Deployment
- **Live at:** `simplekidsgames.com/games/monster-rally/`
- **Hosted on:** Vercel (Hobby plan, auto-deploys from GitHub on push)
- **Repo:** `github.com/JMurphy186/simplekidsgames`
- **File location:** `games/monster-rally/index.html`
- **Landing page:** Root `index.html` (separate from the game — dark arcade theme, 10-tile game grid)
- **Donations:** buymeacoffee.com/simplekidsgames

Every push to `main` auto-deploys. The game is a single HTML file — no build step.

## Architecture
- **Single HTML file** (`index.html`) with embedded JS and CSS (~4,200 lines)
- **No build tools, no npm, no bundler** — ships as one file
- **HTML5 Canvas** for all game rendering (2D context)
- **Web Audio API** (`AudioContext`) for all sound effects — procedurally generated, no audio files
- **No external assets** — all graphics drawn with Canvas API, all sounds synthesized. Zero asset hosting.
- **Responsive** — scales to any screen size while maintaining 800x450 virtual resolution
- **Touch + keyboard** — works on tablets, phones, laptops. Touch is first-class.
- **60fps frame cap** — uses elapsed time tracking to prevent faster-than-60fps updates on high-refresh displays (120Hz iPads, 144Hz monitors)

## Virtual Coordinate System
The game logic runs at **800x450** virtual pixels. The canvas scales to fit the viewport using aspect ratio math. ALL game positions, collision boxes, and drawing coordinates use virtual coords. The scaling transform is applied once in the draw loop.

## Code Organization
Everything lives in `index.html`. Use clearly commented sections:

```
// ============================================================
// SECTION NAME
// ============================================================
```

## Key Principles
- **No death / no fail state.** The truck NEVER stops. If it hits something from the side, it pushes through with a bump animation. Kids should never feel punished.
- **Juice everything.** Screen shake on crush. Particles on every interaction. Flash colors. Combo text. The game should feel ALIVE.
- **One-button core.** The primary mechanic is JUMP (spacebar / tap / up arrow). Everything else is bonus.
- **Performance matters.** Target 60fps on iPad Air (2020+) and modern phones. Keep particle counts bounded (cap at 150). Object-pool if needed.
- **Sound is critical.** Engine rhythm, crush crunch, star chime, ramp whoosh, combo fanfare, horn honk — all procedurally generated via Web Audio API.
- **Mobile-first.** iPhone and iPad are the primary play devices. Every UI element must be tappable with a thumb.

## Art Direction
- **Clean vector style** on dark game backgrounds
- Vehicles drawn with `beginPath()`/`lineTo()` for stepped body silhouettes (hood → cab → bed) — NOT simple rectangles
- Three-zone body coloring: main color (top), darker lower panel, underside shadow strip
- Layered wheel construction: tire → tread → sidewall → rim → spokes → hub
- Reference images in `/reference/` folder

## Current State (What's Built)

### Game Modes
| Mode | Description | Timer | Players |
|------|-------------|-------|---------|
| **Rally** | Endless side-scrolling, dodge & crush, collect stars | None | 1 or 2 |
| **Crush Frenzy** | 30-second solo time attack, all crushable, no ramps | 30s | 1 |
| **Battle (Sumo)** | Fixed arena, face-to-face, land on top to score, first to 5 wins | Per round | 2 |

### Game Flow
```
Title → Truck Picker (P1) → Mode Select
                               ├── RALLY → Player Select (1P/2P) → [P2 Picker if 2P] → Countdown → Playing
                               ├── CRUSH FRENZY → Countdown → Playing (30s) → Game Over → Mode Select
                               └── BATTLE → P2 Picker → Countdown → Playing (first to 5) → Game Over → Mode Select
```

### Playable Trucks (8 total)

**Classic trucks** (14px wheels, standard body):

| # | Name | Style | Body Color | Accent | Decal |
|---|------|-------|-----------|--------|-------|
| 1 | Flame Crusher | classic | `#ff6600` | `#ffcc00` | Yellow flame triangles on lower panel |
| 2 | Blue Thunder | classic | `#2255ff` | `#00ccff` | Lightning bolt zigzags |
| 3 | Green Machine | classic | `#22cc44` | `#88ff00` | Diagonal racing stripes |
| 4 | Purple Nightmare | classic | `#8833cc` | `#ff44ff` | Star shapes |

**Monster trucks** (20px wheels, high suspension, V-arm suspension):

| # | Name | Style | Body Color | Accent | Decal |
|---|------|-------|-----------|--------|-------|
| 5 | Grave Stomper | monster | `#1a1a1a` | `#44ff44` | Green skull on door |
| 6 | Red Rampage | monster | `#cc1100` | `#ff4444` | Claw scratch marks |
| 7 | Thunder Bull | monster | `#1144aa` | `#ffcc00` | Bull horns + yellow stripe |
| 8 | Toxic Crusher | monster | `#338833` | `#00ff88` | Hazard stripes |

Drawing logic: `if (truck.style === 'monster') drawTruckMonster() else drawTruckWithColors()`

### Crushable Vehicles (Obstacles)
| Vehicle | Type | Width | Height | Points |
|---------|------|-------|--------|--------|
| Red Racer | Pickup | 55 | 28 | 8 |
| Cool Blue | Pickup | 55 | 28 | 8 |
| Gold Rush | Pickup | 55 | 28 | 8 |
| Big SUV | SUV | 65 | 35 | 10 |
| School Bus | Bus | 100 | 40 | 15 |
| Stretch Limo | Limo | 110 | 30 | 20 |
| Barrel Pile | Prop | 40 | 30 | 8 |
| Porta-Potty | Prop | 30 | 45 | 15 |
| TV Stack | Prop | 50 | 40 | 12 |
| Hay Bale | Prop | 35 | 25 | 5 |
| Ramp | Ramp | 60 | 25 | — |

### Features Complete
- **Sound:** Rhythmic engine kick (replaces old drone), crush, star, ramp, horn (H key), combo fanfare, landing thud, big air whoosh — all Web Audio API
- **Truck picker:** 8 trucks, horizontal scroll with arrows, CLASSIC/MONSTER badges, per-truck best score (localStorage)
- **Pause system:** Pause icon in top-right, ESC/P to pause, overlay with Resume/Restart/Quit buttons
- **Power-ups:** Mega Truck (1.5x size), Magnet (150px radius), Slow-Mo (60% speed), Double Stars (2x)
- **Backflip trick:** Auto-flip after ~1 second airborne, +50 points, "BACKFLIP!" text
- **Environment progression:** Background changes every 500pts (desert → sunset city → neon arena → moon → lava world). Moon has reduced gravity.
- **Combo system:** Chain crushes for multiplier, longer window in Frenzy/Battle (120 frames vs 90)
- **Battle Sumo:** Fixed arena, trucks face each other, auto-charge + jump, land on top to score, first to 5 wins
- **Two-player Rally:** Both trucks on same screen, shared obstacles, independent scores
- **Mute toggle:** Speaker icon, persisted to localStorage
- **Dark/light mode:** Game always renders on dark backgrounds

### Physics (Current Values)
| Parameter | Rally | Frenzy | Battle |
|-----------|-------|--------|--------|
| Base speed | 1.6 | 2.4 | Auto-charge |
| Max speed | 6 | 2.4 (fixed) | N/A |
| Gravity | 0.48 | 0.48 | 0.48 |
| Jump force | -12 | -12 | -12 |
| Obstacle spacing | 80 + rand(70) | 20 + rand(20) | N/A |

## Do NOT
- Add npm, webpack, vite, or any build tooling
- Create separate JS/CSS files — everything stays in the single index.html
- Use external image or audio assets (URLs, files, CDNs)
- Add a game-over or death mechanic in Rally mode (Rally is endless)
- Make anything too hard for a 3-year-old
- Modify the landing page (root index.html) — that's a separate file, managed separately
- Change collision boxes when changing vehicle art (visual-only changes to drawing functions)

## Sound Design
All sounds use `AudioContext` (Web Audio API), synthesized procedurally:
- **Engine rhythm:** Soft kick drum pulse (~60Hz, 50ms), interval tied to game speed (600ms → 250ms). Much quieter than action sounds.
- **Crush/smash:** White noise burst (100ms) + sine wave thump at 60Hz. Randomized slightly per hit.
- **Star collect:** 3-note ascending sequence (C5→E5→G5, sine wave, 40ms each)
- **Ramp launch:** Rising pitch sweep (200Hz→800Hz, 250ms)
- **Big air:** Filtered noise, band-pass sweep, fades in while airborne
- **Landing thud:** Short noise burst (50ms), low-pass filter at 200Hz
- **Combo fanfare:** Major chord burst (C4+E4+G4), duration scales with combo count
- **Horn:** Square wave at 180Hz, 400ms. Triggered by H key or honk button.

All sounds triggered AFTER first user interaction (browser autoplay policy).

## File Structure (in repo)
```
simplekidsgames/
├── index.html                    ← Landing page (arcade grid, NOT the game)
├── og-image.png                  ← Social sharing image
├── vercel.json                   ← Clean URLs, caching
├── CLAUDE.md                     ← This file
├── MOBILE-FIXES.md               ← Current active spec
├── REFINEMENT-PASS.md             ← Completed
├── MASTER-VEHICLE-SPEC.md         ← Completed
├── PHASE-1-BUILD.md               ← Completed
├── PHASE-2-BUILD.md               ← Completed
├── CHANGES-PHASE2-MODES.md        ← Completed
├── games/
│   └── monster-rally/
│       └── index.html             ← THE GAME (~4,200 lines)
├── reference/
│   ├── flame-crusher-target.png   ← Art quality target
│   ├── vehicle-models-clean-vector.png
│   └── vehicle-models-pixel-art.png
└── ideas/
    └── 8-bit-monster-trucks.md    ← Future game concept (parked)
```

## Spec Documents (Status)
| Document | Status | What It Covers |
|----------|--------|----------------|
| PHASE-1-BUILD.md | ✅ Complete | Sound, truck picker, crushable objects, backflip |
| PHASE-2-BUILD.md | ✅ Complete | Environments, two-player, power-ups, polish |
| CHANGES-PHASE2-MODES.md | ✅ Complete | Crush Frenzy + Battle modes |
| REFINEMENT-PASS.md | ✅ Complete | Pause, engine sound, new trucks, named vehicles, speed tuning, battle sumo, UI polish |
| MASTER-VEHICLE-SPEC.md | ✅ Complete | Full vehicle art rewrite (stepped silhouettes) |
| **MOBILE-FIXES.md** | **🔴 ACTIVE** | iPhone viewport, back button, pause size, picker cycling, power-up tuning |

## Testing Checklist (verify after every change)
- [ ] Game runs at 60fps in Chrome desktop
- [ ] Game runs at 60fps on iPad Safari
- [ ] iPhone Safari landscape: game fills visible screen, nothing cut off
- [ ] Touch controls work (tap to jump) — responsive, no double-fire
- [ ] Keyboard controls work (space/up arrow, P/ESC for pause, H for horn)
- [ ] All 8 trucks render correctly (4 classic, 4 monster)
- [ ] All crushable vehicles render with stepped silhouettes
- [ ] All 3 game modes work (Rally, Crush Frenzy, Battle Sumo)
- [ ] Pause overlay: Resume, Restart, Quit all function
- [ ] Sound: crush/star/ramp/horn clearly audible over engine rhythm
- [ ] Mute toggle works and persists
- [ ] Best scores persist in localStorage per truck
- [ ] No console errors
- [ ] Canvas scales properly on window resize and orientation change

---

# Space Dodge (`games/space-dodge/index.html`)

**Status:** v1.0 — Full game with 5 ships, 5 worlds, power-ups, campaign + endless modes

## Architecture
- **Single HTML file** (~2300 lines) — Canvas API, Web Audio API, no external assets
- **SVG art** loaded as base64 data URIs, drawn via `drawImage()` with Canvas rotation
- **60fps frame cap**, `100dvh`, `visualViewport` API, Safari initial paint fix
- **Works in any orientation** — no rotate overlay, canvas adapts via resize
- `orientationchange` listener with 200ms delay for browser dimension updates

## Game Modes
- **Campaign:** 5 worlds (Deep Space → Nebula → Asteroid Belt → Ice Field → Supernova). Title card + 3-2-1 countdown between worlds. Beat all 5 → "WELL DONE!" victory screen with confetti pops → Endless unlocked + next ship unlocked.
- **Endless:** Unlocked after beating campaign. Background cycles through worlds over time. High score tracked.

## Ship Roster (5 ships)
Each ship in `SHIPS[]` array has: `id`, `name`, `type`, `accent` (UI color), `flameColors` [outer, mid, core], `drawW`/`drawH` (scale factors), `svg` (base64 data URI).

| # | Ship | Type | Accent | Flame Colors | Unlock |
|---|------|------|--------|-------------|--------|
| 1 | Star Rider | Classic / Explorer | `#42A5F5` | Orange→Gold→White | Default |
| 2 | Interceptor | Stealth / Fighter | `#00E676` | Teal→Green→Mint | Beat campaign with #1 |
| 3 | Juggernaut | Heavy / Armor | `#FF6D00` | Red→Orange→Gold | Beat campaign with #2 |
| 4 | Star Cruiser | Speed / Racing | `#FFCA28` | Navy→Cyan→Ice | Beat campaign with #3 |
| 5 | Alien Tech | Exotic / Energy | `#EA80FC` | Purple→Violet→Magenta | Beat campaign with #4 |

Ship picker is inline on the title screen — left/right arrows flanking a spotlight showcase. No separate picker screen. Arrow keys cycle ships on desktop. Locked ships show "?" silhouette with unlock hint. Dot indicators below show all 5 slots.

### Ship Drawing
- `drawShip()` uses `selectedShip` index to get the correct image, flame colors, and draw dimensions
- `drawShipByIndex()` renders any ship by index (used for picker, victory preview)
- Exhaust flames are always Canvas-animated (3-layer: outer→mid→core), never part of SVG
- Ship SVGs have no flame elements, no drop shadow filters, no ambient stars

## Core Mechanics
- Left/right movement only (arrow keys, A/D, touch drag)
- Auto-firing blasters every ~0.47s (28 frames) — no button needed
- 3 lives with mini ship indicators (active ships with flames, ghost ships when lost)
- Bigger explosion on hit — 30 burst particles + 10 white core particles + expanding shockwave ring
- Progression bar: blasted asteroids = 3x progress, dodged = 1x
- "GREAT RUN!" on game over, "WELL DONE!" on victory (no punishment language)

## Power-Ups
Two power-up types float down from top, collected on ship contact:

| Power-Up | Icon | Color | Effect | Duration |
|----------|------|-------|--------|----------|
| Plasma Laser | Lightning bolt | `#00E5FF` | 2x+ fire rate, wider cyan beam, pierces through asteroids | 8 seconds |
| Energy Shield | Shield + checkmark | `#69F0AE` | Green bubble around ship, absorbs ONE asteroid hit then pops | Until hit |

- Spawn every ~10 seconds (`POWERUP_SPAWN_INTERVAL` = 600 frames)
- Power-up HUD displays below lives area (top-left): plasma timer bar, shield active indicator
- Both can be active simultaneously
- Unique sounds: ascending chime on collect, descending break on shield pop
- All power-up state resets on world transition

## World System
Each world in `WORLDS[]` has: `name`, `bg`, `starColor` (RGB), `accent`, `baseSpeed`, `spawnStart`, `spawnMin`, `speedInc`, `spawnDec`, `threshold`.

| # | World | Threshold | Background Art |
|---|-------|-----------|---------------|
| 1 | Deep Space | 150 | Dark gradient, distant galaxy ellipses |
| 2 | Nebula | 250 | Purple gradient, drifting gas cloud shapes (pink/purple) |
| 3 | Asteroid Belt | 350 | Brown gradient, 14 background rocks + 30 dust particles |
| 4 | Ice Field | 450 | Cyan gradient, crystal shards + animated aurora wave bands |
| 5 | Supernova | 550 | Red gradient, expanding shockwave rings from bottom, ember particles floating up |

World decorations generated via `generateWorldDecor()` on each world start. Rendered every frame via `drawWorldBackground()` which draws gradient + decorations + tinted stars.

## UI Layout (matches Monster Rally)
- **Title screen:** MENU (top-left), ship spotlight with arrows (center), Campaign/Endless buttons (bottom), best score, dot indicators
- **Gameplay:** Lives + power-up status (top-left), World name + progress bar with % (top-center), Score (top-right, left of pause), Pause button (top-right corner)
- **Pause menu:** Dark overlay with Resume (green), Restart (blue), Menu (grey) — three tappable buttons
- **Victory:** "WELL DONE!" + confetti pops from sides + falling confetti + unlocked ship SVG preview next to unlock text

## Pause Menu
Pause button is top-right (matches Monster Rally). Opens a proper menu overlay:
- ▶ Resume — unpause
- 🔄 Restart — restart current world (campaign) or reset (endless)
- 🏠 Menu — back to title screen

## SVG Assets
- **Ship bodies:** 5 entries in `SHIPS[]`, each with unique base64 SVG. All viewBox 300×400. Flames stripped.
- **Asteroid:** `ASTEROID_SVG_B64` — gradient rock body, edge highlights, fissures, 3 craters. No drop shadow filter. All asteroids use same SVG at different scales + rotations.

## localStorage Keys
- `sd_best` — best score (int)
- `sd_endless` — endless mode unlocked (`'true'`)
- `sd_ship` — selected ship index (int)
- `sd_unlocked` — unlocked ship indices (JSON array, e.g. `[0,1,2]`)

## Audio (all Web Audio API synthesized)
- `start` — ascending 3-note chime
- `blaster` — quick sine pew
- `explode` — sawtooth descend
- `hit` — sawtooth descend (ship hit)
- `lose` — square wave descend
- `score` — 3-note milestone chime (every 50 pts)
- `levelup` — 4-note ascending fanfare
- `victory` — 5-note ascending fanfare
- `beep` / `beepgo` — countdown tones
- `powerup` — ascending 3-note collect chime
- `shieldbreak` — triangle wave descend

## Queued (Not Built)
- Bonus objects: Alien Saucer (+500), Golden Comet (+1000), Supply Capsule (+250) — SVG mockups exist
- Title screen demo scene — ship auto-fires on menu
- Game over stats — blasted, dodged, world reached, time
- Sound polish — blaster volume at high fire rates
- World background enhancements — richer animations
- Ship-specific abilities — stat differences per ship
- Cross-game coin economy with Monster Rally
- PWA manifest for fullscreen on Add to Home Screen

## Do NOT
- Add npm, webpack, vite, or any build tooling
- Create separate JS/CSS files — everything stays in the single `index.html`
- Use external image or audio assets (URLs, files, CDNs)
- Add punishment language ("Game Over", "You Lost") — use encouraging phrasing
- Modify the landing page (root `index.html`) when working on Space Dodge
- Change collision boxes when changing vehicle art (visual-only changes)

## Important Patterns
- **Visual-only changes** = no physics modifications — always specify this in prompts
- **Single HTML file, no external assets** — everything embedded
- Ship exhaust is always Canvas-animated, never part of the SVG
- Asteroid SVG has no drop shadow filter — Canvas handles rotation cleaner without it
- World speed/spawn values reset per world via `worldFrameCount` (not global `frameCount`)
- Power-up state resets on `resetPlayState()` — powerups array, timers, shield, plasma all cleared
- Ship picker is inline on title screen — no separate `shippicker` game state used (dead code remains)
- `drawShipByIndex(idx, x, y, w, h)` for rendering any ship outside gameplay (picker, victory)

## Testing Checklist
- [ ] Ship renders as SVG with animated Canvas exhaust
- [ ] All 5 ships selectable, locked ships show "?" with unlock hint
- [ ] Asteroids render as SVG at various scales and rotations
- [ ] Auto-blasters fire every ~0.47s
- [ ] Left/right controls work (keyboard + touch drag)
- [ ] 3 lives with mini ship indicators, wobble on hit
- [ ] Campaign: 5 worlds with progression bar, transitions, countdown
- [ ] Each world has unique background art (nebula clouds, crystals, etc.)
- [ ] Plasma Laser power-up: piercing cyan beam, 8 second timer
- [ ] Energy Shield power-up: green bubble, absorbs one hit
- [ ] Level complete screen shows stats
- [ ] Victory screen: "WELL DONE!" with confetti + unlocked ship preview
- [ ] Endless mode accessible after campaign completion
- [ ] localStorage persists high score, endless unlock, ship selection, unlocked ships
- [ ] Works in both portrait and landscape (no rotate overlay)
- [ ] 60fps on desktop Chrome and iPad Safari
- [ ] No console errors
