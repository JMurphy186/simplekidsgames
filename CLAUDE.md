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

**Status:** v1.5 — Arcade fishing game with trophy room, full-body SVG characters, rebalanced reel. **Note:** Originally built by a friend, now heavily modified.

### Architecture
- Single HTML file (~2,100+ lines) — Canvas + DOM hybrid
- **External dependency:** Google Fonts (Luckiest Guy, Baloo 2) — requires internet
- Canvas for scene rendering (sky, water, dock, character, fish, particles)
- DOM overlays for UI (scoreboard, reel bars, catch display, character select, trophy room)

### Game Flow (State Machine)
1. **CHAR_SELECT** — Character picker (6 characters, 2x3 grid). MENU + TROPHIES buttons.
2. **IDLE** — Character on dock, rod out, waiting. Tap to cast.
3. **CAST** — Bobber flies out and splashes down.
4. **WAIT** — Bobber floating, ambient fish silhouettes. Random bite timer.
5. **BITE** — Bobber dips! Tap to hook.
6. **REEL** — Tension bar mini-game. Tap to push indicator right toward green zone. Gold pulse when in green.
7. **CAUGHT** — Catch display with trophy tracking.
8. **FAIL** — Line snapped or missed bite.

### Reel Mechanic
- Tap = pushes indicator RIGHT, no input = drifts LEFT
- Green zone at END (right side) — difficulty scales by rarity
- Gold pulse visual feedback when in green zone
- Common fish: large green zone, slow drift. Exotic: tiny zone, fast drift.

### Characters (6, full-body SVG)

| # | Character | Theme |
|---|-----------|-------|
| 1 | Captain Hook Jr. | Pirate — red coat, hook hand, tricorn hat |
| 2 | Robo-Fisher 3000 | Robot — metal chassis, glowing cyan eyes |
| 3 | Merlin the Caster | Wizard — purple robes, Gandalf beard |
| 4 | Shadow Ninja | Ninja — dark outfit, red sash, shuriken |
| 5 | Princess Pearl | Princess — pink dress, tiara, glass slippers |
| 6 | Zork the Angler | Alien — space suit, sucker hands, antennae |

**Rendering:** Full-body SVGs via `CHAR_BODY_SVGS` base64 data URIs + Canvas fishing rod with per-character `CHAR_ROD_ANCHORS`.

### Trophy Room
- Best catch per species saved to localStorage
- Grid display with rarity glow, locked cards for undiscovered species
- Accessible from gameplay, pause menu, and character select

### localStorage Keys
- `catchreel_best` — best single catch points
- `catchreel_total` — total score across sessions
- `catchreel_char` — selected character index
- `catchreel_trophies` — JSON object of best catch per species

### Fish Roster (25 SVG Fish)

All fish rendered as detailed SVG artwork, base64 encoded in `FISH_SVGS` constant. Preloaded via `FISH_IMAGES` object. Emoji kept as fallback if SVG not found.

**Display sizes:**
- Catch display: 160×100px
- Trophy room: 80×50px
- HUD fallback: 24×15px

**Gradient ID convention:** Each fish uses uniquified gradient IDs prefixed `f0_`, `f1_`, etc. to prevent SVG gradient conflicts when multiple fish render simultaneously.

#### Active Fish (24 catchable)

| # | Name | Emoji | Rarity | Notes |
|---|------|-------|--------|-------|
| 1 | Bluegill | 🐟 | Common | Ear flap detail |
| 2 | Perch | 🐠 | Common | Vertical bar markings |
| 3 | Bass | 🐟 | Common | Red eye, bucket mouth |
| 4 | Catfish | 🐡 | Uncommon | Whiskers, scaleless skin |
| 5 | Trout | 🐟 | Uncommon | Pink stripe, adipose fin |
| 6 | Salmon | 🐠 | Uncommon | Species-accurate markings |
| 7 | Walleye | 🐟 | Uncommon | — |
| 8 | Pike | 🐊 | Rare | — |
| 9 | Muskie | 🐟 | Rare | — |
| 10 | Sturgeon | 🐠 | Rare | — |
| 11 | Swordfish | ⚔️ | Ultra Rare | — |
| 12 | Marlin | 🐟 | Ultra Rare | — |
| 13 | Tuna | 🐟 | Ultra Rare | — |
| 14 | Shark | 🦈 | Epic | — |
| 15 | Narwhal | 🦄 | Epic | Spiral tusk detail |
| 16 | Manta Ray | 🦅 | Epic | — |
| 17 | Giant Squid | 🦑 | Legendary | — |
| 18 | Anglerfish | 💡 | Legendary | — |
| 19 | Golden Koi | ✨ | Legendary | — |
| 20 | Loch Ness Monster | 🦕 | Exotic | Water mist effect |
| 21 | Kraken | 🐙 | Exotic | Ink wisp effect |
| 22 | Mermaid's Ring | 💍 | Exotic | Gem refraction effect |
| 23 | Phantom Jellyfish | 🪼 | Exotic | Translucent bell, trailing tentacles, bioluminescent spots |
| 24 | Ancient Treasure Chest | 🧰 | Exotic | Open lid, gold coins, gems, barnacles, seaweed |
| 25 | Poseidon's Trident | 🔱 | Exotic | Three-pronged, gold shaft, aqua gem, energy glow |

#### Inactive Fish (SVG preserved, not in FISH array)

| Name | Emoji | Notes |
|------|-------|-------|
| Old Boot | 👢 | SVG exists in `FISH_SVGS`. Reserved for future junk catch mechanic. |

#### Exotic Difficulty Settings

Exotics use a tighter catch minigame:
- Green zone: 88% of bar (was 92%)
- Drift rate: 0.35/sec (was 0.55/sec)
- Result: still challenging but actually catchable for kids

### Sound System (10 Audio Clips)

All sounds are real audio clips (not Web Audio API synthesis), embedded as base64 WAV data URIs (~1.85MB total). Sourced from Pixabay (free, no attribution required).

| Key | Trigger | Description |
|-----|---------|-------------|
| cast | Line cast | Casting whoosh |
| splash | Line hits water | Water splash |
| bite | Fish bites | Alert tone |
| reelClick | Reeling in | Click/ratchet |
| reelDrag | Drag tension | Tension sound |
| catchCommon | Catch common/uncommon | Simple fanfare |
| catchRare | Catch rare/ultra rare | Elevated fanfare |
| catchExotic | Catch epic/legendary/exotic | Grand fanfare |
| lineSnap | Line breaks | Snap sound |
| newRecord | New best fish | Record fanfare |

**Rarity → Sound Mapping:**
- Common, Uncommon → `catchCommon`
- Rare, Ultra Rare → `catchRare`
- Epic, Legendary, Exotic → `catchExotic`

**Implementation:** `initSounds()` on first cast. `playS(key)` triggers playback. Mute toggle in pause menu with `localStorage` persistence (`catchreel_mute`). Variables use `var` (fixes temporal dead zone). Unlike Monster Rally and Space Dodge (Web Audio API synthesis), Catch & Reel uses real recorded audio clips.

### Queued (Not Built)
- Self-host Google Fonts or explore adding fonts to other games
- Rod position fine-tuning (values may need visual adjustment)
- Additional fish species
- Seasonal themes
- Captain Angler (7th character — designed, parked)
- Integration with SKG coin economy (future)
