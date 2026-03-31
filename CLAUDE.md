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
├── index.html                        ← Landing page (90s arcade cabinet)
├── games/
│   ├── monster-rally/
│   │   └── index.html                ← Monster Rally (~5,000+ lines)
│   ├── space-dodge/
│   │   └── index.html                ← Space Dodge (~2,500 lines)
│   └── catch-and-reel/
│       └── index.html                ← Catch & Reel (~2,100+ lines)
├── CLAUDE.md                         ← Master spec
├── vercel.json                       ← Clean URLs, no-cache headers
├── favicon.ico / favicon-32.png / apple-touch-icon.png
├── skg-banner.png / og-image.png
└── [spec MDs, reference HTMLs, ideas/]
```

### Game Grid (current)
- 3 live games: Monster Rally, Space Dodge, Catch & Reel
- 2 coming soon placeholders (Dino Dash, Pirate Quest)
- INSERT COIN random picker selects from all 3 live games

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

**Status:** v1.0 — Complete. 5 worlds, 5 ships, 2 power-ups, audio system.

### Architecture
- Single HTML file (~2,500 lines) — Canvas only
- No external dependencies (fonts, assets, or audio files)
- 60fps frame cap, dt-based physics
- All graphics: Canvas paths + SVG ships via base64 data URI drawImage()
- All audio: Web Audio API synthesized (ambient drones, melodic pings, SFX)

### Game Flow (State Machine)
1. **TITLE** — Spotlight title screen with animated wave text. Inline ship picker below. MENU button (top-left), SHIPS label (top-right).
2. **PLAYING** — Dodge asteroids, collect power-ups, survive. Left/right movement + auto-fire laser.
3. **PAUSED** — Resume, Change Ship, Main Menu.
4. **GAME_OVER** — Stats display, retry option.
5. **VICTORY** — Confetti + unlocked ship preview after beating campaign.

### World Campaign (5 worlds)

| # | World | Background | Audio Vibe |
|---|-------|-----------|------------|
| 1 | Deep Space | Clean starfield | Calm drone |
| 2 | Nebula | Purple/pink gas clouds, particle wisps | Ethereal |
| 3 | Asteroid Belt | Dense floating rock debris, parallax layers | Tense |
| 4 | Ice Field | Crystalline shards, frost particles, pale aurora | Crisp |
| 5 | Supernova | Expanding red/orange shockwave rings, embers | Intense |

### Ships (5 total, all SVG base64 data URIs)

| # | Ship | Style | Unlock |
|---|------|-------|--------|
| 1 | Star Rider | Blue panels, red fins | Default |
| 2 | The Interceptor | Stealth black, green neon | Beat campaign with Ship 1 |
| 3 | Red Phantom | Heavy red hull, triple engines | Beat campaign with Ship 2 |
| 4 | Star Cruiser | White/gold needle, ion engine | Beat campaign with Ship 3 |
| 5 | Alien Tech | Purple energy pylons, orb core | Beat campaign with Ship 4 |

### Power-Ups (2)

| Power-Up | Effect | Visual |
|----------|--------|--------|
| Plasma Laser | Faster fire rate + wider beam, ~8s | Cyan energy beam |
| Energy Shield | Blocks ONE asteroid hit | Green bubble around ship |

### Audio System
- Per-world ambient drone + melodic ping patterns
- SFX: laser fire, asteroid explosion, power-up collect, shield pop, game over
- Mute toggle (persisted to localStorage)
- All Web Audio API — zero audio files

### localStorage Keys
- `sd_highscore` — best score
- `sd_unlocked` — unlocked ship indices
- `sd_ship` — selected ship index
- `sd_mute` — mute state
- `sd_campaign` — campaign progress

### Queued (Not Built)
- Bonus objects: UFO, Golden Comet, Supply Capsule
- Title screen demo scene
- Game over stats enhancement
- Ship-specific abilities

---

# Catch & Reel (`games/catch-and-reel/index.html`)

**Single HTML file (~7.4MB). No external assets. All SVGs and PNGs are base64 data URIs embedded in the file.**

#### Game Overview
Kids fishing game with 6 themed characters, 5 locations, 77 catchable fish across 7 rarity tiers, 5 Sunken Treasure paintings, 3 junk items, reel minigame, trophy room, and sound system.

#### Characters (6)
| Character | Rod Theme | Key Visual |
|-----------|-----------|-----------|
| Captain Hook Jr. (Pirate) | Driftwood + rusty reel | Gold name glow |
| Robo-Fisher 3000 (Robot) | Chrome segmented + LEDs | Teal name glow |
| Merlin the Caster (Wizard) | Purple staff + glowing orb | Purple name glow |
| Shadow Ninja | Matte black bamboo + red cord | Red name glow |
| Princess Pearl | Pink crystal + ribbon | Pink name glow |
| Zork the Angler (Alien) | Green plasma + energy field | Green name glow |

Per-character rod anchor points in `CHAR_ROD_ANCHORS`. Rod styles in `CHAR_ROD_STYLES`. Rod rendering: `drawThemedRod()` with helpers `drawRodGrip()`, `drawRodReel()`, `drawShaftDetails()`, `drawTipFeature()`, `drawLineEffects()`.

#### Locations (5)
| Location | Unlock | Visual |
|----------|--------|--------|
| Wooden Dock | Start | Night sky, lighthouse silhouette with sweeping beam |
| Sunny Pier | 5 fish | Daytime, lighthouse on hilltop |
| Coral Reef | 15 fish | Underwater reef backdrop |
| Deep Sea | 30 fish | Dark ocean, oversized boat with red/green nav lights |
| Volcano Cove | 50 fish | Volcanic setting |

Auto-navigation to newly unlocked locations on unlock celebration dismiss. HUD progress bar shows next unlock threshold with location icon + accent color.

#### Fish Roster (77 total)
| Tier | Count | Gradient Prefix Range |
|------|-------|-----------------------|
| Common | ~20 | `c0_` – `c9_` (originals: `f0_`+) |
| Uncommon | ~20 | `u0_` – `u10_` (originals: `f0_`+) |
| Rare | 10 | `r0_` – `r9_` |
| Ultra Rare | 8 | `ur0_` – `ur7_` |
| Epic | 5 | `e0_` – `e4_` |
| Legendary | 6 | `l0_` – `l3_`, `lx0_` – `lx1_` |
| Exotic | 6 | originals + `ex0_` – `ex2_` |

**Location-exclusive fish** (5 total) have a `location` field in the FISH array. `pickFish()` filters these out if the player isn't at the matching location. Fish without a `location` field are available everywhere.

| Fish | Location | Rarity |
|------|----------|--------|
| Dock Cat | Wooden Dock | Legendary |
| Sunbeam Dolphin | Sunny Pier | Legendary |
| Reef Guardian | Coral Reef | Exotic |
| Storm Leviathan | Deep Sea | Exotic |
| Magma Serpent | Volcano Cove | Exotic |

Plus 3 junk items (Old Boot `jb_`, Seaweed Clump `js_`, Tin Can `jc_`).

#### SVG Art Principles (FOLLOW FOR ALL FISH)
1. **Layer order:** Dorsal/anal fins drawn FIRST → body ON TOP → body hides fin bases naturally
2. **Patterns clipped:** All stripes, spots, markings use `<clipPath>` bounded to body shape
3. **Gradient IDs uniquified** per fish (prefix per tier) to prevent SVG conflicts in base64
4. **Species-accurate details:** ear flaps, barbels, adipose fins, egg spots, thread feelers — research each fish
5. **`width="160" height="100"`** must be on every SVG root tag — browser can't determine intrinsic size without them
6. **Epic + Legendary tiers** use SVG filter effects (`feGaussianBlur`, `feColorMatrix`, `feMerge`) for aura/glow
7. **Pufferfish spines:** 2.5px stroke width for small-size visibility

#### Sunken Treasures — Paintings System
- 0.75% chance per cast, rolled before fish selection
- Only triggers if current location's painting hasn't been found yet
- Gold shimmer particles rise from bobber + magical chime
- No reel minigame — auto-catch straight to catch card
- One-time discovery per location, saved to `catchreel_paintings` localStorage
- 5 paintings (1 per location), embedded as base64 PNG data URIs
- Catch card: gold-themed `✦ SUNKEN TREASURE ✦` with ornate frame
- Trophy room: Sunken Treasures section above Exotic tier, 5 painting slots
- **Do NOT show drop rates to players** — trophy room shows only "X / 5 paintings discovered"

#### Reel Minigame Difficulty (Linear Progression)
| Rarity | Green Zone | Drift Rate | Tap Push |
|--------|-----------|------------|----------|
| Common | 65% | 0.12 | 0.08 |
| Uncommon | 55% | 0.13 | 0.08 |
| Rare | 48% | 0.14 | 0.09 |
| Ultra Rare | 42% | 0.15 | 0.09 |
| Epic | 38% | 0.16 | 0.10 |
| Legendary | 34% | 0.17 | 0.10 |
| Exotic | 30% | 0.18 | 0.10 |

Start position: 0.5 (center) for all tiers. One set of values for all devices.

#### Game Flow (State Machine)
1. **CHAR_SELECT** — Character picker (6 characters, 2x3 grid). MENU + TROPHIES buttons.
2. **LOCATION_SELECT** — Location picker (first play or Change Level). Unlocked locations selectable.
3. **IDLE** — Character on dock/boat/ledge, rod out, waiting. Tap to cast.
4. **CAST** — Bobber flies out and splashes down.
5. **WAIT** — Bobber floating, ambient fish silhouettes. Random bite timer. 0.75% shimmer check per cast.
6. **BITE** — Bobber dips! Tap to hook.
7. **REEL** — Tension bar mini-game. Tap to push indicator right toward green zone.
8. **CAUGHT** — Catch display with trophy tracking (fish or painting).
9. **FAIL** — Line snapped or missed bite.

**Change Fisher flow:** Pause → Change Fisher → character picker → pick character → returns directly to same location (no location picker shown again).

**Change Level flow:** Pause → Change Level → location picker → pick location → 3-2-1 canvas countdown → game resumes at new location. Stats carry over.

#### Trophy Room
- Fish organized by rarity tier, rarest (Exotic) on top, Common at bottom
- Each tier has bold colored header
- Caught fish: SVG thumbnail, name, rarity label, weight/length stats, rarity-colored border
- Uncaught fish: dimmed "???" cards with fish name visible
- "X / 77 species discovered" counter at top
- Sunken Treasures section above Exotic tier with 5 painting slots
- 2-column grid, scrollable on mobile
- Accessible from gameplay, pause menu, and character select

#### Pause Menu
Buttons in order:
1. ▶ RESUME (green)
2. 🔊 SOUND: ON/OFF (gray)
3. 🏆 TROPHIES (gold)
4. 🗺️ CHANGE LEVEL (orange — `#E67E22` to `#D35400`)
5. 🎣 CHANGE FISHER (blue/purple)
6. 🏠 MENU (dark)

#### Sound System (10 Audio Clips)
All sounds are real audio clips (not Web Audio API synthesis), embedded as base64 WAV data URIs (~1.85MB total). Sourced from Pixabay (free, no attribution required).

| Key | Trigger |
|-----|---------|
| cast | Line cast |
| splash | Line hits water |
| bite | Fish bites |
| reelClick | Reeling in |
| reelDrag | Drag tension |
| catchCommon | Catch common/uncommon |
| catchRare | Catch rare/ultra rare |
| catchExotic | Catch epic/legendary/exotic |
| lineSnap | Line breaks |
| newRecord | New best fish |

`initSounds()` on first cast. `playS(key)` triggers playback. Mute persisted to `catchreel_mute`.

#### Key Constants & Data Structures
- `FISH_SVGS` — object mapping fish names to base64 SVG data URIs
- `FISH` — array of fish objects: `{ name, emoji, rarity, wMin, wMax, lMin, lMax, location? }`
- `FISH_IMAGES` — preloaded Image objects built from FISH_SVGS on load
- `PAINTING_IMAGES` — base64 PNG data URIs for 5 Sunken Treasure paintings
- `PAINTINGS` — array of `{ name, location, locationName, color }`
- `CHAR_ROD_STYLES` — per-character rod visual definitions
- `CHAR_ROD_ANCHORS` — per-character rod attachment coordinates
- `LOCATIONS` — array of location configs with id, name, unlock threshold, fishBoost

#### localStorage Keys
- `catchreel_trophies` — JSON object of best catch per species
- `catchreel_total_catches` — lifetime fish count (drives location unlocks)
- `catchreel_location` — last selected location ID
- `catchreel_shown_unlocks` — JSON array of shown unlock notification IDs
- `catchreel_paintings` — JSON object of discovered paintings `{ "Location Name": true }`
- `catchreel_mute` — mute state ("1" = muted)
- `catchreel_char` — selected character index

#### Known Issues / Parked Items
- Rod reel size on mobile (parked — multiple attempts, still looks large)
- Stingray SVG flagged as not looking like a stingray — revisit/redesign or swap Ultra Rare later
- Rod curve deferred (straight rods look clean)
- Captain Angler (7th character — designed, parked)
- Cross-game coin economy with Monster Rally
- PWA manifest for fullscreen on Add to Home Screen

---

## Implementation Patterns

### Trailing Comma Check (CRITICAL)
Always verify the trailing comma on the last entry in `FISH_SVGS` before adding new fish. A missing comma causes a **silent JS syntax error** that kills all `onclick` handlers while HTML `<a href>` links still work. This is easy to miss and has caused real bugs.

### SVG Root Dimensions (REQUIRED)
Every fish SVG must have `width="160" height="100"` on the root `<svg>` tag before base64 encoding. Without them, the browser renders the image at 0px — the SVG is present but invisible.

### Base64 PNG Data URIs
Acceptable for Sunken Treasures tier collectibles (paintings, future shells/chests). Monitor file size — each PNG category adds several MB. The game file is currently ~7.4MB.

### Syntax Check After Every Commit
```bash
node -e "try { new (require('vm').Script)(require('fs').readFileSync('games/catch-and-reel/index.html','utf8')); console.log('SYNTAX OK'); } catch(e) { console.log('ERROR:', e.message); }"
```
The `Unexpected token '<'` error is a **known false positive** from the HTML `<` characters — ignore it. Any OTHER error message is a real JS syntax error that will break the game.

### Patch Script Pattern (Node.js)
When adding fish in batches, use Node.js patch scripts saved in the repo root (not committed). Key steps:
1. Read mockup HTML, extract SVGs with regex
2. Fix dimensions (`320x200` → `160x100`)
3. Base64 encode: `Buffer.from(svg).toString('base64')`
4. Insert into `FISH_SVGS` using string replacement with reliable anchor
5. Insert into `FISH` array before closing `];`
6. Normalize CRLF↔LF before/after editing
7. Verify prefix IDs by decoding b64 back to text
8. Run syntax check on script block only (not full HTML)
