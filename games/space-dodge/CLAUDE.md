# Space Dodge — CLAUDE.md

## What This Is
Vertical space shooter/dodger for kids (ages 3-6). 5-world campaign, 6 ships, 4 power-ups. Part of Simple Kids Games at simplekidsgames.com.

**File:** `games/space-dodge/index.html` (~3,728 lines, 6.9 MB)
**Live:** simplekidsgames.com/games/space-dodge/
**Deploy:** Vercel auto-deploy from GitHub `main` branch. No build step.

## Architecture
- Single HTML file, embedded JS + CSS
- HTML5 Canvas (2D context) for all rendering
- Web Audio API AudioBuffer system for SFX (10 decoded buffers)
- Web Audio oscillators for countdown/go beeps
- Google Fonts: Luckiest Guy (labels), Baloo 2 (body), Bungee (title) via `@import`
- 6 Gemini-painted ship sprites as base64 PNG (200×200px)
- 4 Gemini-painted power-up icons as base64 PNG (128×128px)
- 6 painted world backgrounds + 1 menu background as base64 PNG
- DPR Retina scaling: `canvas.width = W * dpr`
- Mobile-first: `mobileBoost()` returns 2.0× for W < 600
- 60fps with dt-based physics

## Game Flow (State Machine)
1. **TITLE** — Bungee font gold/blue title, inline ship picker (4.0× preview), MENU (top-left), TROPHIES (top-right), PLAY button, glass pill arrows, platform ring under ship, page dots
2. **COUNTDOWN** — 3-2-1-GO with synthesized oscillator beeps (660Hz/880Hz)
3. **PLAYING** — Dodge asteroids, collect power-ups, auto-fire blasters. Left/right movement (arrow keys + touch drag). Ship speed 5.5 (4.5 during Mega Beam)
4. **PAUSED** — 5-button stack: Resume → Sound → Trophies → Change Ship → Menu
5. **LEVEL_COMPLETE** — Stats + transition to next world
6. **VICTORY** — Confetti + unlocked ship at 3× with accent glow + "CHAMPION PILOT!" if all ships unlocked
7. **GAME_OVER** — World name (Luckiest Guy), brighter stats, retry option. No menu button.

## Ship Fleet (6 Gemini-Painted Ships)

| Slot | Ship | Style | Accent | Bolt Color | Unlock |
|------|------|-------|--------|-----------|--------|
| 0 | Nova Wing | Classic X-Wing | #42A5F5 blue | #42A5F5 | Default |
| 1 | Fury | Military stealth F-22 | #78909C blue-gray | #90A4AE | Default |
| 2 | Interceptor | Stealth/green neon | #00E676 green | #00E676 | World 1 |
| 3 | Juggernaut | Heavy tank | #E65100 orange | #FF6D00 | World 2 |
| 4 | Star Cruiser | Elegant racer | #FFD700 gold | #FFD700 | World 3 |
| 5 | Alien Tech | Organic bug/beetle | #E040FB magenta | #E040FB | World 4 |

### Per-Ship Systems
- **Colored bolts:** Each ship fires accent-colored laser bolts. Plasma power-up preserves ship bolt color.
- **Exhaust flames:** Per-ship `flames` array with `{xOff, yOff}` positions. Flame formula: `fx = w * xOff`, `fy = h * yOff` from ship center. Ship bottom edge = `drawH / 2`.
- **All sprites:** Gemini Pro 3.1 painted PNGs, black bg removed (R<30,G<30,B<30 → alpha=0, R<60 → alpha=128 feather), resized to 200×200, base64 encoded.
- **Ship sizes:** All `drawW` reduced ~15% from original (1.8→1.53, 1.6→1.36). Hitbox proportional.

### Flame Positions (Tuned Over 6 Rounds)
| Ship | Config |
|------|--------|
| Nova Wing | twin wide nacelles (±0.20, 0.15), flameScale 0.6 |
| Fury | single center (0, 0.63), flameScale 0.65, blue-white colors |
| Interceptor | twin close (±0.12, 0.45) |
| Juggernaut | triple tight (±0.10, 0.55) |
| Star Cruiser | single narrow (0, 0.4), flameScale 0.7 |
| Alien Tech | single center (0, 0.45) |

## World Campaign (5 Worlds)

| # | World | Background | Canvas Layers On Top |
|---|-------|-----------|---------------------|
| 1 | Deep Space | Painted starfield | Scrolling stars |
| 2 | Nebula | Gas columns | Tendrils, star clusters |
| 3 | Asteroid Belt | Gas giant | 3-layer parallax rocks, dust |
| 4 | Ice Field | Moon with glow | 3 aurora bands, crystals, fog, sparkles |
| 5 | Supernova | Shockwave | Expanding rings, embers |

Backgrounds use `drawCoverImage()` for aspect-ratio-preserving crop. All Canvas animation layers render ON TOP of painted backgrounds. Menu uses separate `MENU_BG_IMG` (ringed planet) with dark overlay.

## Power-Up System (4 Power-Ups)

| Power-Up | Icon (Gemini 128×128) | Effect |
|----------|----------------------|--------|
| Plasma Laser | Cyan crystal cartridge | Faster piercing shots, ship bolt color preserved |
| Energy Shield | Green hex sphere | Absorb one hit, hex mesh bubble visual |
| Mega Beam | Red crystal in dark frame | V-cone from ship center, 3-layer render (outer glow W×0.5, body W×0.38, core W×0.24), energy rings grow upward, 75% height cutoff, ship invulnerable, triangle collision |
| Phase Shift | Golden hourglass | Translucent ghost mode, orbiting sparkles, dual-frequency flicker, scan lines |

Duration bars show remaining time. Normal cannon fire suppressed during Mega Beam.

## Audio System (Web Audio API Buffers)
Replaced HTML Audio `cloneNode()` system (which leaked DOM nodes) with Web Audio `AudioBuffer` + `createBufferSource()`.

- 10 decoded AudioBuffers in `sfxBuffers`
- `playS()` creates disposable `BufferSource` nodes that auto-garbage-collect
- `ensureAudio()` calls `initAudio()` + `audioCtx2.resume()` on every user gesture (keydown, touchstart, click)
- iOS silent `.play()→.pause()` unlock pass for HTML `<audio>` elements on first gesture
- Countdown/go: Web Audio oscillator beeps (not audio clips — clips overlap during 3-2-1-GO)
- `_audioUnlocked` flag ensures iOS unlock runs once

**Critical:** `decodeSfx()` is async. Must complete before gameplay starts. Call on first user gesture — buffers ready by level load.

## UI Details (Current)
- **Title:** Bungee font, "SPACE" gold (#FFD700) with orange drop shadow, "DODGE" blue (#42A5F5) with dark blue shadow. Gold→blue gradient stripe.
- **Ship picker:** Glass pill arrows (40×64px), page dots, platform ring under preview ship
- **Progress bar:** No %, 40% thicker than original, progressive glow (accent color ramps to bright at 90%+)
- **Menu button:** 44px min, Baloo 2 16px, dark glass background
- **Ship names:** White text with glow shadow (works on all ship accent colors)
- **World Complete:** reduced shadowBlur to 3, 2px strokeText outline
- **Trophy Room:** Crisp text with strokeText outlines, larger fonts

## Asteroids (4 SVG Variants)
Pebble A, Pebble B (small), Rock (medium), Boulder (large). Slate gray palette. Scroll down at world-scaled speed.

## localStorage Keys
| Key | Purpose |
|-----|---------|
| `sd_best` | Best score |
| `sd_muted` | Audio mute state |
| `sd_ship` | Selected ship index |
| `sd_unlocked` | JSON array of unlocked ship indices |
| `sd_reorder_v1` | Migration flag for ship roster reorder |

## Do NOT
- Use `cloneNode()` for audio — creates DOM leaks. Use AudioBuffer system.
- Use `canvas.width`/`canvas.height` in game logic — use logical W/H after DPR fix
- Move `accumulator += delta` outside `if (!paused)` block
- Break the Mega Beam V-cone geometry (outer → body → core layers, triangle collision)
- Change flame `xOff/yOff` values without visual verification — 6 rounds of tuning went into these
- Add external asset files — everything base64 embedded
- Use npm, webpack, or build tools

## Queued Work
- Trophy Room achievements (combat, survival, power-up, fleet, milestone categories)
- World backgrounds still appear zoomed (needs diagnostic — DPR + cover crop interaction?)
- Difficulty/scoring rebalance
- Flying objects across screen + space capsule power-up
- Preferred composite ship art swap (5 ships from composite, favorites picked)

## Testing Checklist
- [ ] 5-world campaign starts and progresses
- [ ] All 6 ships render in picker and in-game
- [ ] Per-ship colored bolts fire correctly
- [ ] Per-ship flames positioned correctly (especially Fury single center)
- [ ] All 4 power-ups activate with visual effects
- [ ] Mega Beam V-cone renders (outer glow, body, core) with 75% cutoff
- [ ] Phase Shift makes ship translucent with sparkles
- [ ] Web Audio SFX play (not silent) on desktop and iOS
- [ ] Countdown beeps play (oscillator, not clips)
- [ ] Painted backgrounds render (not flat gradients)
- [ ] DPR scaling crisp on Retina displays
- [ ] Ship unlocks persist across sessions
- [ ] Glass pill arrows work in ship picker
- [ ] Title screen: gold SPACE + blue DODGE (Bungee font)
- [ ] Touch controls work on iPhone (left/right halves)
- [ ] Progress bar glows at 90%+
