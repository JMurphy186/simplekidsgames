# Simple Kids Games — Session 2 → Session 3 Handoff

**Date:** March 25, 2026
**Previous chats:** Simple Kids Games Session 1, Session 2 (this session — TWO conversations due to compaction)
**Transcript:** `/mnt/transcripts/2026-03-25-01-14-31-skg-session2-space-dodge-catch-reel.txt` (first half), plus current conversation (second half)

---

## What Was Accomplished in Session 2

### Space Dodge — Complete

All changes pushed to GitHub. Full game with 5 worlds, 5 ships, 2 power-ups, spotlight title screen with inline ship picker, proper pause menu, ambient music per world, mute toggle. ~2500 lines.

**Key commits this session:**
- Mini ships on world title card
- Button layout (MENU/SHIPS matching Monster Rally)
- Power-ups: Plasma Laser + Energy Shield
- Portrait mode support (removed rotate overlay)
- HUD fixes (score position, world bar %, lives spacing, shield icon)
- Power-up HUD moved under lives, bigger ship explosions
- Victory screen with confetti + unlocked ship preview
- World thresholds tripled for pacing
- UI overhaul: spotlight title, inline ship picker, proper pause menu
- Animated wave title text (per-letter colors, wave float, neon glow)
- Audio overhaul: ambient drone + melodic pings per world, polished SFX, mute toggle

### Catch & Reel — Major Overhaul

**Trophy Room (COMPLETE)**
- `53460c2` — Trophy Room with localStorage tracking, best catch per species
- `8ae47f0` — Trophy room div moved to body level (outside #gameContainer) for universal access
- Access points: gameplay 🏆 button, character select 🏆 TROPHIES, pause menu 🏆 TROPHIES
- Caught fish: emoji, name, rarity glow, stats. Uncaught: locked ❓ cards. Progress counter.
- `86e1914` — Reel rebalanced (easier green zones, slower drift, stronger taps) + gold pulse when in green zone

**iOS Touch Fix**
- Trophy/settings buttons moved outside pointer-events:none parents + touchend fallback listeners

**Full-Body SVG Characters (COMPLETE — after extensive debugging)**
- 6 characters: Pirate, Robot, Wizard, Ninja, Princess, Alien
- Bodies designed as HTML mockups (v1→v2→v3) with iterative head placement tuning
- Final design: full-body SVG (head+body combined, no rod) rendered via `drawImage()`, fishing rod stays Canvas-drawn with bend animation
- Body SVGs encoded as base64 data URIs in `CHAR_BODY_SVGS` constant
- **Critical fix:** Nested `<svg>` tags flattened to `<g transform>` for browser data URI compatibility
- **Critical fix:** Image preloader loop was missing — added `new Image()` + `.src` assignment
- All 6 characters confirmed rendering in-game: `d9d3895`

**Commits for character bodies:**
- `64e94a6` — drawCharacter() infrastructure (CHAR_BODY_SVGS empty, fallback ready)
- `2857701` — First attempt populating SVGs (had wrong base64 — head-only)
- `b408ed5` — Second attempt with correct base64 (still didn't render — nested SVG issue)
- `0c8fc9e` — Third attempt with flattened nested SVGs (still didn't render — preloader missing)
- `d9d3895` — Added missing image preloader loop — CHARACTERS NOW RENDER

**Rod positioning — PENDING**
- Per-character rod anchor points prompt drafted (see below)
- Rod currently uses fixed percentages, needs to map to each character's right hand
- `CHAR_ROD_ANCHORS` object with per-character handX/handY/tipX/tipY values

**Character Design Files (in Claude's workspace, not in repo):**
- `/home/claude/body_pirate.svg` through `body_alien.svg` — source SVG files
- `body-mockups-v3.html` — final approved mockup with all 6 characters
- `correct_body_svgs.js` — the verified JS constant (now in game code)
- Captain Angler (7th character) — designed but PARKED. 6 characters is clean.

---

## Pending — Immediate Next

### 1. Rod Position Tuning (Catch & Reel)
Per-character rod anchor points so the fishing rod appears in each character's hand. Prompt drafted. Values derived from SVG hand positions:
- Pirate: handX=0.90, handY=0.68
- Robot: handX=0.93, handY=0.69
- Wizard: handX=0.93, handY=0.73
- Ninja: handX=0.99, handY=0.64
- Princess: handX=0.91, handY=0.65
- Alien: handX=0.96, handY=0.68

### 2. CLAUDE.md Updates
Both Space Dodge and Catch & Reel sections need comprehensive updates. Prompts were drafted in conversation but not yet pushed.

### 3. Catch & Reel Sound System
- Cast, splash, bite alert, reel tension, catch fanfare, line snap — all Web Audio API
- Mute button
- No sounds exist yet

### 4. Character Select Screen Head SVGs
The select screen still uses the old `CHAR_HEAD_SVGS` (head-only). These are SEPARATE from the in-game `CHAR_BODY_SVGS`. Both coexist. No changes needed unless we want to update select screen art too.

---

## Pending — Space Dodge Backlog

- CLAUDE.md update (comprehensive prompt drafted)
- Bonus objects: UFO (shoots!), Golden Comet, Supply Capsule (drops power-up, rare 1-Up)
- Laser power-up visual redesign
- Asteroid explosion sound alternatives
- Title screen demo scene
- Game over stats
- World background polish
- Ship-specific abilities

---

## Pending — Monster Rally Backlog (unchanged from Session 1)

- Title screen refresh (SVG flanking trucks, spinning wheels)
- Landing page truck thumbnail (HD SVG)
- Version numbering
- Crushable vehicles SVG migration
- Portrait mode
- JS rotate overlay fix

---

## Pending — Site-Wide

- PWA manifest
- Cross-game coin economy (Monster Rally campaign + Space Dodge campaign + Catch & Reel trophy milestones → shared `skg_coins` → landing page toy machine)
- PARKED for dedicated session

---

## Key Architecture Decisions This Session

| Decision | Rationale |
|----------|-----------|
| Full-body SVG via drawImage() + Canvas rod | SVG gives visual quality, Canvas rod preserves bend animation |
| Nested SVGs flattened to `<g transform>` | Browsers can't render nested `<svg>` in data URI images |
| Trophy Room at body level (outside #gameContainer) | Accessible from any screen — char select, gameplay, pause |
| Reel difficulty scales by rarity | Common nearly impossible to fail, Exotic still challenging |
| Gold pulse on tension bar in green zone | Instant "I'm doing it right!" feedback for kids |
| Captain Angler parked | 6 characters clean for 2x3 picker grid |
| Rod anchors per-character | Each character's hand is at different SVG coordinates |

---

## File Structure (updated)

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
├── CLAUDE.md                         ← Master spec (needs update)
├── vercel.json
├── favicon.ico / favicon-32.png / apple-touch-icon.png
├── skg-banner.png / og-image.png
└── [spec MDs, reference HTMLs, ideas/]
```

---

## Tech Stack Reference

- **Architecture:** HTML/CSS/JS only, no frameworks, no build tools
- **Graphics:** Canvas API (all three games), SVG via base64 data URIs for character/ship/truck art
- **Audio:** Web Audio API (synthesized, no files)
- **Fonts:** Google Fonts (Catch & Reel only: Luckiest Guy + Baloo 2)
- **Deploy:** Vercel (auto-deploy from GitHub on push to main)
- **Persistence:** localStorage (coins, progress, trophies, prefs, mute state)
- **Repo:** github.com/JMurphy186/simplekidsgames
- **Live:** simplekidsgames.com
