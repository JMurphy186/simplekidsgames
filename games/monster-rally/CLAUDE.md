# Monster Rally — CLAUDE.md

## What This Is
Monster truck action game for kids (ages 3-6). 8-level campaign + Crush Frenzy arena mode. Part of Simple Kids Games at simplekidsgames.com.

**File:** `games/monster-rally/index.html` (~4,757 lines, 1.1 MB)
**Live:** simplekidsgames.com/games/monster-rally/
**Deploy:** Vercel auto-deploy from GitHub `main` branch. No build step.

## Architecture
- Single HTML file, embedded JS + CSS
- HTML5 Canvas (2D context) for all rendering
- Web Audio API (`AudioContext`) for procedural SFX — no audio files
- Google Fonts: Luckiest Guy (headings), Baloo 2 (body) via `@import`
- 9 painted PNG backgrounds embedded as base64 data URIs
- 8 HD SVG trucks embedded as base64 data URIs
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

### Crush Frenzy
60-second timed arena. One random environment per session (no cycling). Only Mega Truck + Turbo Boost power-ups. Score by crushing objects.

## Game Flow
```
Title Screen → Truck Picker (pagination, 2 pages) → Mode Select
  ├── RALLY (green) → Countdown → 8-level campaign → Win Screen
  └── CRUSH FRENZY (orange) → Countdown → 60s arena → Game Over
```

## UI Layout (Current — Post Session 9 Overhaul)
- **Title:** Gold MONSTER + Red RALLY (Luckiest Guy), gradient stripe, subtitle
- **Corner buttons:** Glass MENU (top-left) + TROPHIES (top-right)
- **Truck picker:** Glass pill arrows (40×64px), dirt platform under truck, orange pagination dots with glow
- **Mode buttons:** Rally (green gradient) + Crush Frenzy (orange gradient)
- **Settings:** Glass 44×44 rounded square with gear emoji (⚙️)
- **HUD:** Top-left `LVL N: NAME` (Luckiest Guy) + breathing speed bar. Top-right gold ★ score with shadow.
- **Speed bar:** Per-truck indicator with gradient fill, glow, `Math.sin` oscillation
- **Star coins:** Progressive glow based on collection %, springy `Math.sin` bob per star
- **Text:** strokeText outlines (2px), reduced shadowBlur (3) for crispness
- **Screen shake:** 4-12px intensity on crush (already existed pre-overhaul)

## Truck Roster (8 SVG trucks)

| Slot | Name | Style |
|------|------|-------|
| 1 | Flame Crusher | Classic, orange/yellow |
| 2 | Blue Thunder | Classic, blue/cyan |
| 3 | Green Machine | Classic, green/lime |
| 4 | Purple Nightmare | Classic, purple/magenta |
| 5 | Iron Patriot | Pro Stadium, navy/gold |
| 6 | Desert Storm | Pro Stadium, tan/brown |
| 7 | Neon Viper | Pro Stadium, green neon |
| 8 | Chrome Titan | Pro Stadium, silver/chrome |

All rendered via `drawTruckHD()` with `svgMeta` generalized system. Canvas animated exhaust flames on all trucks. Pro Stadium trucks shown first in picker.

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
| Key | Purpose |
|-----|---------|
| `monsterRallyBest` | Overall best score |
| `monsterRallyBest_[idx]` | Per-truck best score |
| `monsterRallyMuted` | Audio mute state |
| `monsterRallyTruck` | Selected truck index |
| `mr_campaign_sequence` | Saved campaign level order |
| `mr_campaign_level` | Current campaign progress |
| `mr_campaign_beaten` | Campaign completion flag |
| `mr_coins` | Star coin balance |
| `mr_endless_unlocked` | Endless mode unlock flag |

## Do NOT
- Add death/game-over in Rally mode — truck always continues
- Use external asset files — everything embedded in single HTML
- Add complex menus/settings — kids play, adults don't configure
- Break the 800×450 virtual coordinate system
- Use `canvas.width`/`canvas.height` in game logic (use W/H after DPR fix)
- Move `accumulator += delta` outside `if (!paused)` block
- Add npm, webpack, or any build tools

## Queued Work (Art Ready, Not In Code)
- 19 Gemini-painted truck sprites (replace SVG trucks) — art saved locally
- 19 Gemini-painted crushable object sprites — art saved locally
- Universal tire + chrome rim sprite for spinning wheel system
- Expanded truck roster (8 → 14-19 trucks)

## Testing Checklist
- [ ] Rally campaign starts and progresses through 8 levels
- [ ] Crush Frenzy runs 60 seconds with timer
- [ ] All 8 trucks render in picker and in-game
- [ ] Star coins collect with chime + springy animation
- [ ] Crush triggers screen shake + particles
- [ ] Painted backgrounds render (not flat gradients)
- [ ] Google Fonts load (Luckiest Guy + Baloo 2)
- [ ] Glass pill arrows work in truck picker
- [ ] DPR scaling crisp on Retina displays
- [ ] Touch controls work on iPhone/iPad
- [ ] Landscape orientation enforced (rotate overlay)
- [ ] Speed bar animates with breathing glow
- [ ] Title screen: gold MONSTER + red RALLY rendering
