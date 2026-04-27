# Monster Rally — CLAUDE.md

## What This Is
Monster truck action game for kids (ages 3-6). 8-level campaign + Crush Frenzy arena mode. Part of Simple Kids Games at simplekidsgames.com.

**File:** `games/monster-rally/index.html` (~5,640 lines, ~1.1 MB game code + 14 MB external sprites)
**Live:** simplekidsgames.com/games/monster-rally/
**Deploy:** Vercel auto-deploy from GitHub `main` branch. No build step.

## Architecture
- Single HTML file, embedded JS + CSS
- HTML5 Canvas (2D context) for all rendering
- Web Audio API (`AudioContext`) for procedural SFX — no audio files
- Google Fonts: Luckiest Guy (headings), Baloo 2 (body) via `@import`
- 9 painted PNG backgrounds embedded as base64 data URIs
- **35 painted PNG trucks loaded as external files** from `assets/trucks/<sprite-stem>.png`
- **Universal wheel asset** at `assets/trucks/wheel.png` (drawn rotated at each truck's calibrated axles)
- Async sprite decode via `truckDecodeStatus` gate — drawTruckPNG falls back to colored rectangle until decode resolves
- DPR Retina scaling: `canvas.width = W * dpr`
- Virtual resolution: 800×450, scaled to viewport
- Touch + keyboard input, mobile-first
- 60fps with elapsed time tracking

## Key Principles
- **No death / no fail state.** Truck NEVER stops. Side hits = bump animation. Kids never feel punished.
- **Juice everything.** Screen shake on crush. Particles. Flash colors. Combo text.
- **One-button core.** Primary mechanic is JUMP (spacebar / tap / up arrow).
- **Performance:** Target 60fps on iPad Air. Cap particles at 150.
- **Mobile-first.** iPhone and iPad primary. All UI thumb-tappable.

## Game Modes

### Rally Campaign (8 levels)
First 4 levels randomized from pool, levels 5-8 fixed difficulty curve, Rainbow Road always final (level 8). Side-scrolling, dodge & crush, collect star coins. Progressive speed ramp per level.

Campaign sequence saved to localStorage (`mr_campaign_sequence`) so resuming picks up where you left off.

Campaign tier truck unlocks fire on level clear via `TruckUnlocks.recordClear()` → `checkNewUnlocks()`. Each campaign truck has `unlockLevel` + `unlockClearCount` thresholds.

### Crush Frenzy
60-second timed arena. One random environment per session (no cycling). Only Mega Truck + Turbo Boost power-ups. Score by crushing objects.

## Game Flow
```
Title Screen → Truck Picker (pagination, multi-page across 4 tiers) → Mode Select
  ├── RALLY (green) → Countdown → 8-level campaign → Win Screen
  └── CRUSH FRENZY (orange) → Countdown → 60s arena → Game Over
```

## UI Layout
- **Title:** Gold MONSTER + Red RALLY (Luckiest Guy), gradient stripe, subtitle
- **Corner buttons:** Glass MENU (top-left) + TROPHIES (top-right)
- **Truck picker:** Glass pill arrows (40×64px), dirt platform under truck, orange pagination dots with glow
- **Mode buttons:** Rally (green gradient) + Crush Frenzy (orange gradient)
- **Settings:** Glass 44×44 rounded square with gear emoji (⚙️)
- **HUD:** Top-left `LVL N: NAME` (Luckiest Guy) + breathing speed bar. Top-right gold ★ score with shadow.
- **Speed bar:** Per-truck indicator with gradient fill, glow, `Math.sin` oscillation
- **Star coins:** Progressive glow based on collection %, springy `Math.sin` bob per star
- **Text:** strokeText outlines (2px), reduced shadowBlur (3) for crispness
- **Screen shake:** 4-12px intensity on crush

## Truck Roster (35 — SKG-111)

4-tier system, total 35 trucks. Names + IDs in `TRUCK_ROSTER`. Each entry has:
- `id` (e.g. `red-rocket`) — used for localStorage, picker, code lookups
- `sprite` — full path `assets/trucks/<file>.png` (sprite stem differs from id)
- `tier` — `starter` | `campaign` | `coin` | `achievement`
- `body`, `accent`, `highlight`, `flameOuter`, `flameInner` — color metadata for exhaust particles + UI accents (5 hex codes per truck)
- `axles: { front: {xPct, yPct}, rear: {xPct, yPct}, sizePct }` — per-truck wheel calibration as fractions of the displayed sprite (0.0-1.0)
- Tier-specific fields: campaign has `unlockLevel`/`unlockClearCount`; coin has `cost` (mr_coins price)

| Tier | Count | Unlock |
|------|-------|--------|
| Starter | 8 | Free from launch |
| Campaign | 13 | Clear specific levels (`unlockLevel`, `unlockClearCount`) |
| Coin | 7 | Purchase with mr_coins (500–2000) |
| Achievement | 7 | Locked, future achievement system |

### Per-truck axle calibration

Wheel positions are in fractions of the **displayed sprite** rect, not the logical hitbox. So a truck whose painted wheels sit ~96% of the way down its sprite stores `axles.front.yPct = 0.96`. This is calibrated once via `tools/monster-rally-wheel-calibrator.html` and persisted in the roster.

Default fallback: `DEFAULT_AXLES = { front: { xPct: 0.22, yPct: 0.78 }, rear: { xPct: 0.78, yPct: 0.78 }, sizePct: 0.32 }`. Applied to any roster entry that omits its own axles field.

### Aspect ratio handling

Painted sprites have varied natural aspect ratios (pirate-ship is square-ish, dino-bones is long, muscle-car is squat). `drawTruckPNG` preserves each sprite's natural ratio: fits sprite width to logical `tw`, computes height from natural ratio, clamps to `DRAWN_TRUCK_MAX_DISPLAY_H = 70` if too tall. Sprite is anchored bottom-of-logical-box (so wheels touch the road consistently) and centered horizontally.

Physics still operates on the logical hitbox (tx, ty, tw, th). Display rect is purely cosmetic.

### Universal wheel sprite

`assets/trucks/wheel.png` is the only wheel asset. Drawn at each axle position, rotated by `tireAngle` accumulator (driving rotation), sized by `axles.sizePct × displayedSpriteWidth`. Kept the variable name `tireImage` in code for minimum diff churn after the SKG-111 swap from `tire-universal.png`.

## Environments / Levels
8 campaign environments + 1 menu arena. All have painted PNG backgrounds (`LEVEL_BG_IMGS`) with `drawEnvironmentBg()` that checks `LEVEL_BG_MAP` → `drawImage()` first, existing Canvas gradients as fallback.

Semi-transparent road overlay: ground at `globalAlpha 0.7`, road band at `0.8`, dashed center line at `rgba(255,255,255,0.15)`.

## Crushable Objects
Canvas-drawn vehicles on the road: sedans, pickups, SUVs, buses. Side-scrolling at level speed. Crush triggers: screen shake, particles, score, SFX.

## Power-Ups
| Power-Up | Effect |
|----------|--------|
| Mega Truck | 2× size + invulnerable |
| Turbo Boost | 2× speed burst |
| Super Jump | 3× jump height |

Stackable. Auto-turbo triggers on MAX SPEED countdown.

## Sound Design (Web Audio API)
All procedural — no audio files:
- Engine rhythm (`oscillator` at ENGINE_BASE_FREQ 80Hz)
- Crush crunch (noise burst, CRUSH_NOISE_DURATION 0.1s)
- Star chime (C5, E5, G5 sequence)
- Ramp whoosh (frequency sweep 200→800Hz)
- Horn honk (180Hz square wave)
- Combo fanfare (ascending arpeggio)

## Physics Constants
```
GROUND_Y = 340
GRAVITY = 0.48 (floatier for kids)
JUMP_FORCE = -12
SLAM_FORCE = 8
BASE_GRAVITY = 0.55
```

## localStorage Keys

| Key | Purpose | Format |
|-----|---------|--------|
| `mr_selected_truck` | Currently selected truck | string ID (e.g. `red-rocket`) |
| `mr_unlocked_trucks` | Coin/achievement unlocks | JSON array of IDs |
| `mr_level_clears` | Per-level clear count, drives campaign auto-unlocks | JSON `{levelId: count}` |
| `mr_coins` | Star coin balance | string int |
| `monsterRallyBest_<truck-id>` | Per-truck best score | string int — **ID-keyed since SKG-111** (was index-keyed, migrated automatically) |
| `monsterRallyBest` | Overall best score | string int |
| `monsterRallyMuted` | Audio mute state | "0" / "1" |
| `mr_campaign_sequence` | Saved level order for current campaign run | JSON array |
| `mr_campaign_level` | Current campaign progress | string int |
| `mr_campaign_beaten` | Campaign completion flag | "1" |
| `mr_endless_unlocked` | Endless mode unlock flag | "1" |
| `mr_skg111_migrated` | Idempotent SKG-111 migration flag | "1" — prevents re-running |

### SKG-111 migration

One-time migration block at the top of the script. Maps the 26-truck pre-SKG-111 roster to the 35-truck new roster:
- **Preserved 3 truck IDs** (player state survives): `bone-rattler` (identity), `frostbite → frost-bite`, `magma-maw → magma-crusher`
- **Retired 23 truck IDs**: their `mr_unlocked_trucks` entries and `monsterRallyBest_<idx>` scores are dropped
- **`mr_selected_truck`**: if it was one of the preserved 3, mapped; otherwise reset to `red-rocket` (default starter)
- **`monsterRallyBest_<idx>` → `monsterRallyBest_<id>` rekey**: index-keyed scores are mapped to ID via the OLD_IDX_TO_ID lookup, then run through the migration table

Guarded by `mr_skg111_migrated` flag so it only runs once. Clearing the flag re-runs the migration.

## Sprite Pipeline (SKG-111)

Source art lives in `art/monster-rally/refined/` (gitignored, force-added). Pipeline:

1. **Chroma-key + crop:** `python tools/monster-rally-chroma-key.py`
   - Predicate: `R>200 AND G<60 AND B>200` (tolerant — strict `#FF00FF` would leave halos)
   - 1px alpha-erode after key (kills anti-aliased halo)
   - Auto-crop to non-transparent bbox
   - Resize: 700px wide for trucks, 256px for wheel — retina-safe at game render scale ~90×70px
   - Output: `art/sprites/monster-rally/<id>.png`
2. **Wheel calibration:** `tools/monster-rally-wheel-calibrator.html`
   - Open via `python -m http.server 8000` then `http://localhost:8000/tools/monster-rally-wheel-calibrator.html`
   - Drag front/rear handles + adjust sizePct slider per truck
   - Persists to localStorage `skg111_calibration`
   - Export JSON, paste into TRUCK_ROSTER axles fields
3. **Integration:** copy `art/sprites/monster-rally/*.png` → `games/monster-rally/assets/trucks/`

Pipeline can be re-run end-to-end if sprites are regenerated upstream.

## Do NOT
- Add death/game-over in Rally mode — truck always continues
- Use base64 inline embedding for sprites — external files keep the HTML lean (1.1 MB is already chunky)
- Add complex menus/settings — kids play, adults don't configure
- Break the 800×450 virtual coordinate system
- Use `canvas.width`/`canvas.height` in game logic (use W/H after DPR fix)
- Move `accumulator += delta` outside `if (!paused)` block
- Use roster index for any localStorage key — always use ID after SKG-111
- Add npm, webpack, or any build tools
- Set sprite-loading state via `img.decode()`-promise gate without an `img.complete` fast-path. SKG-111 lesson: decode() can hang silently on large preload batches; flip to `ready` on `onload` directly and use decode as a non-gating GPU-upload hint

## Testing Checklist
- [ ] Rally campaign starts and progresses through 8 levels
- [ ] Crush Frenzy runs 60 seconds with timer
- [ ] All 35 trucks render in picker and in-game (no missing sprites, no fallback rectangles)
- [ ] Wheels rotate when driving on all 35 trucks
- [ ] Aspect ratios: pirate-ship doesn't squash, dino-bones doesn't stretch, muscle-car doesn't get tiny
- [ ] Star coins collect with chime + springy animation
- [ ] Crush triggers screen shake + particles
- [ ] Painted backgrounds render (not flat gradients)
- [ ] Google Fonts load (Luckiest Guy + Baloo 2)
- [ ] Glass pill arrows work in truck picker pagination
- [ ] DPR scaling crisp on Retina displays
- [ ] Touch controls work on iPhone/iPad
- [ ] Landscape orientation enforced (rotate overlay)
- [ ] Speed bar animates with breathing glow
- [ ] Title screen: gold MONSTER + red RALLY rendering
- [ ] localStorage migration: existing player retains preserved-3 unlocks (bone-rattler / frost-bite / magma-crusher) on first post-SKG-111 load
- [ ] Per-truck high scores survive migration where applicable (preserved 3) and show 0 / no-score for new IDs
