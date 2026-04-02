# Monster Rally — Campaign Mode Design

**Read CLAUDE.md first.** This redesigns Rally mode from endless into a structured 8-level campaign with progression, level completion, a coin reward, and an unlockable Endless mode.

---

## Overview

Rally mode becomes a **campaign**. The player drives through 8 themed environments, building speed in each one. When they hit max speed and survive for 60 seconds, the level completes. After all 8 levels, they win a coin. Endless mode unlocks after beating the campaign.

---

## Campaign Flow

```
Mode Select → RALLY → Campaign Start
  │
  ├── Level 1: Desert Night
  │     Speed builds → Hit max → Survive 60s → "LEVEL COMPLETE!" → Stats
  ├── Level 2: Sunset City
  │     Speed resets → Builds faster → Survive 60s → "LEVEL COMPLETE!"
  ├── Level 3: Neon Arena
  ├── Level 4: Stormy Highway (NEW)
  ├── Level 5: Moon Surface (low gravity)
  ├── Level 6: Jungle Ruins (NEW)
  ├── Level 7: Lava World
  ├── Level 8: Rainbow Road (NEW — finale)
  │
  └── "YOU WIN!" → Coin Earned → Endless Mode Unlocked → Mode Select
```

---

## The 8 Levels

### Existing (refined)

| # | Name | Sky Gradient | Ground | Special Mechanic | Difficulty |
|---|------|-------------|--------|-----------------|------------|
| 1 | **Desert Night** | `#0f0c29 → #302b63` | Brown dirt `#5a4a3a` | None — the tutorial level | Easy |
| 2 | **Sunset City** | `#ff6b35 → #f7c59f → #2d3142` | Asphalt `#555555` | City skyline silhouette, streetlights | Easy+ |
| 3 | **Neon Arena** | `#0a0020 → #1a0040` | Dark concrete `#222222` | Neon spotlights sweeping, crowd silhouette | Medium |
| 5 | **Moon Surface** | `#000011 → #000022` | Grey regolith `#888888` | **Lower gravity (0.7x)** — floatier jumps, more hang time | Medium+ |
| 7 | **Lava World** | `#1a0000 → #330000` | Lava/rock `#ff4400 → #aa2200` | Lava bubbles in background, ember particles floating up | Hard |

### New Levels

| # | Name | Sky Gradient | Ground | Special Mechanic | Difficulty |
|---|------|-------------|--------|-----------------|------------|
| 4 | **Stormy Highway** | `#1a1a2e → #2d3436` (dark grey, moody) | Wet asphalt `#3a3a3a` (slightly reflective) | **Rain effect** — diagonal white streaks falling across the screen (cosmetic, no gameplay change). Lightning flashes every ~8 seconds (brief white screen flash). Darker/moodier than other levels. Distant thunder rumble sound (low noise burst). | Medium |
| 6 | **Jungle Ruins** | `#0a2a0a → #1a4a1a` (deep green) | Mossy stone `#4a5a3a` | **Vine obstacles** (cosmetic — green ropes hanging from the top of the screen that don't affect gameplay but add visual density). Firefly particles (small yellow dots floating slowly). Ancient stone ramp variants (same physics, different color — grey stone instead of orange). | Medium+ |
| 8 | **Rainbow Road** | Cycling rainbow gradient (smoothly shifts hue over time) | Translucent white with rainbow shimmer `rgba(255,255,255,0.3)` | **The finale.** Background constantly shifts through rainbow colors. Extra stars spawn (celebration feel). All power-ups spawn more frequently. Confetti particles in the air. The ground has a glossy/reflective quality. Everything feels festive. When the player completes this level, the celebration is extra dramatic. | Hard |

---

## Per-Level Mechanics

### Speed Progression (per level)
Each level follows this arc:

```
Start of level:
  gameSpeed = BASE_SPEED (varies per level)
  
During gameplay:
  gameSpeed increases as score accumulates (same formula as current)
  
When gameSpeed >= MAX_SPEED for this level:
  Show "MAX SPEED!" text (large, pulsing, centered)
  Start a 60-second countdown timer
  Speed stays at max
  
When 60s countdown reaches 0:
  "LEVEL COMPLETE!" screen
```

### Difficulty Scaling Per Level

| Level | Base Speed | Max Speed | Speed Ramp | Obstacle Spacing | Star Frequency |
|-------|-----------|-----------|------------|-----------------|----------------|
| 1 | 1.4 | 4.0 | Slow (÷1200) | Wide (90+80) | High |
| 2 | 1.5 | 4.5 | Slow (÷1100) | Wide (85+75) | High |
| 3 | 1.6 | 5.0 | Medium (÷1000) | Medium (80+70) | Medium |
| 4 | 1.7 | 5.5 | Medium (÷900) | Medium (75+65) | Medium |
| 5 | 1.6 | 5.0 | Medium (÷1000) | Medium (80+70) | Medium (Moon gravity makes it easier) |
| 6 | 1.8 | 5.5 | Faster (÷850) | Tighter (70+60) | Medium |
| 7 | 1.9 | 6.0 | Fast (÷800) | Tight (65+55) | Lower |
| 8 | 1.6 | 5.5 | Medium (÷900) | Medium (75+65) | Very High (celebration!) |

Level 8 (Rainbow Road) is intentionally NOT the hardest — it's the victory lap. The hardest level is 7 (Lava World). Level 8 is about celebration and fun.

### Gravity Per Level

| Level | Gravity Multiplier | Feel |
|-------|-------------------|------|
| 1-4 | 1.0x (normal) | Standard |
| 5 (Moon) | 0.7x | Floaty, more hang time |
| 6 | 1.0x | Normal |
| 7 (Lava) | 1.0x | Normal (hard enough already) |
| 8 (Rainbow) | 0.85x | Slightly floaty (fun, more tricks) |

---

## HUD Changes

### Level Indicator
Top-center of the screen, show:
```
LEVEL 3: NEON ARENA
```
Font: bold, 12px, white with text shadow. Always visible during gameplay.

### Max Speed Countdown
When max speed is reached:
- The speed bar turns **gold** and pulses
- Large text appears: **"MAX SPEED!"** (centered, pulsing scale animation)
- A countdown timer appears below the speed bar: **"0:47"** counting down from 60
- The timer text is gold, uses a monospace-style font
- When timer hits **10 seconds**, it turns **red** and pulses faster (urgency)
- When timer hits **0**: level complete trigger

### Level Complete Screen

When the 60-second countdown finishes:
1. Game freezes (same as pause — game objects visible but not updating)
2. Semi-transparent dark overlay
3. **"LEVEL COMPLETE!"** text (large, gold, bounce animation)
4. Level name below: "Desert Night" etc.
5. Stats panel:
   - ⭐ Stars Collected: [number]
   - 💥 Vehicles Crushed: [number]
   - 🔄 Backflips: [number]
   - 📊 Final Score: [number]
6. **"TAP TO CONTINUE"** blinking text
7. On tap → transition to next level (or win screen if Level 8)

### Level Transition

Between levels:
1. Brief fade to black (300ms)
2. **"LEVEL [N]"** text appears centered with the level name below (e.g., "LEVEL 4 — STORMY HIGHWAY")
3. Hold for 1.5 seconds
4. Fade into the new level's environment
5. Countdown: **3, 2, 1, GO!** → gameplay starts

---

## Campaign Win Screen (After Level 8)

When Level 8 (Rainbow Road) is completed:

1. Extra dramatic screen shake + particle explosion
2. Overlay with special background (rainbow gradient cycling)
3. **"🏆 YOU WIN! 🏆"** text (huge, gold, bouncing)
4. **"CAMPAIGN COMPLETE!"** subtitle
5. Total campaign stats:
   - Total Stars: [sum across all levels]
   - Total Crushes: [sum]
   - Total Backflips: [sum]
   - Total Score: [sum]
6. **🪙 "COIN EARNED!"** — animated gold coin drops into view (reuse the landing page coin animation style)
7. **"🔓 ENDLESS MODE UNLOCKED!"** text appears with a glow
8. Coin and unlock state saved to **localStorage**:
   ```js
   localStorage.setItem('mr_coins', (parseInt(localStorage.getItem('mr_coins') || '0') + 1).toString());
   localStorage.setItem('mr_endless_unlocked', 'true');
   localStorage.setItem('mr_campaign_beaten', 'true');
   ```
9. **"TAP TO CONTINUE"** → returns to mode select

---

## Endless Mode

### Unlock
- Locked by default. Shows as a 4th option on the mode select screen with a 🔒 icon.
- Label: **"ENDLESS"** with subtitle "Beat the campaign to unlock!"
- When `localStorage.getItem('mr_endless_unlocked') === 'true'`: lock disappears, mode is selectable
- Tapping the locked button shows a brief tooltip: "Complete all 8 levels to unlock!"

### Gameplay
- Identical to the current Rally mode behavior (endless, no timer, speed increases forever)
- Environments cycle every 500 points (existing behavior)
- No level complete screens, no campaign win
- The goal is pure high score
- All power-ups available

### Mode Select (Updated)

```
┌─────────────────────┐
│       RALLY          │  ← 8-level campaign
│  "8-level campaign!" │
├─────────────────────┤
│   CRUSH FRENZY       │  ← 30-second time attack
│  "30 sec smash!"     │
├─────────────────────┤
│      BATTLE          │  ← 2-player sumo
│  "2P truck sumo!"    │
├─────────────────────┤
│   🔒 ENDLESS         │  ← Unlocked after campaign
│  "Beat campaign to   │
│   unlock!"           │
└─────────────────────┘
```

After unlocking:
```
│   ♾️ ENDLESS          │
│  "Drive forever!"    │
```

---

## Campaign Progress Persistence

Save the player's campaign progress in localStorage so they can resume:

```js
// After each level completion:
localStorage.setItem('mr_campaign_level', currentLevel.toString());

// On campaign start:
const savedLevel = parseInt(localStorage.getItem('mr_campaign_level') || '1');
// Ask: "Continue from Level [N]?" or "Start from Level 1?"
```

### Resume Prompt
When starting Rally/Campaign, if there's saved progress beyond Level 1:
- Show a prompt: **"Continue from Level [N]?"** with two buttons:
  - **"CONTINUE"** (green) — starts from saved level
  - **"START OVER"** (orange) — resets to Level 1

---

## Coin System (Foundation)

For now, coins are simple:
- Beat the campaign → earn 1 coin
- Coin count stored in `localStorage` as `mr_coins`
- Coin count displayed on the **mode select screen** near the top: **"🪙 x [N]"**
- Replaying the campaign earns another coin each time (incentive to replay)

Future: coins will be spendable on the landing page (claw machine, trophy room, etc.)

---

## New Environment Details

### Level 4: Stormy Highway

**Background drawing:**
- Sky: dark moody gradient (`#1a1a2e → #2d3436`)
- Clouds: larger, darker, lower than other levels (`rgba(80,80,90,0.15)`)
- No stars visible (overcast)
- City skyline in the far distance (very dark silhouette, barely visible)

**Rain effect:**
- 40-60 white diagonal lines falling across the screen
- Each raindrop: thin line (1px wide, 8-15px long), slight angle (~15° from vertical)
- Speed: faster than game scroll speed (they fall quickly)
- Opacity: 0.2-0.4 (subtle, not overwhelming)
- Implementation: array of raindrop objects, each with x, y, speed, length. Reset to top when they pass the bottom.

**Lightning flash:**
- Every 6-10 seconds (randomized interval)
- Brief white screen flash: opacity goes to 0.3 for 2 frames, then 0 → 0.15 for 2 frames → 0
- Optional: 1-2 seconds after the flash, play a low rumble sound (noise burst, 200ms, very low gain)

**Ground:** Darker asphalt with subtle horizontal wet-reflection lines (thin white stripes at low opacity)

### Level 6: Jungle Ruins

**Background drawing:**
- Sky: deep green gradient (`#0a2a0a → #1a4a1a`)
- Dense tree canopy silhouettes at the top of the screen (dark green shapes)
- Ancient stone columns in the background (gray rectangles of varying heights)
- Moss/vine details on the columns (small green streaks)

**Firefly particles:**
- 15-20 small yellow-green dots (`#ccff44`, radius 2-3px)
- Float slowly in random directions (much slower than the game scroll)
- Gentle pulse animation (opacity 0.3 → 0.8 → 0.3, 2-second cycle, staggered)
- Stay in the upper 60% of the screen (above the road)

**Ground:** Mossy stone texture — base color `#4a5a3a` with darker splotches and occasional stone-gray patches

**Ramp variant:** In this level, ramps could optionally look like stone blocks (same triangle shape, but gray `#777` with a mossy top edge `#5a6a4a`). Same physics, just a visual swap.

### Level 8: Rainbow Road

**Background drawing:**
- Sky: smoothly cycling rainbow hue
  ```js
  const hue = (frame * 0.5) % 360;
  // Use HSL for the gradient stops
  skyGrad.addColorStop(0, `hsl(${hue}, 70%, 30%)`);
  skyGrad.addColorStop(1, `hsl(${(hue + 60) % 360}, 70%, 20%)`);
  ```
- Brighter than other levels — this is a celebration
- Extra stars twinkling in the sky (more numerous, slightly larger)

**Confetti particles:**
- 30-40 small squares and circles falling slowly from the top of the screen
- Random colors from a bright palette: red, blue, green, yellow, pink, cyan
- Each piece: 3-5px, rotating slowly, falling at 0.5-1.5px per frame
- Reset to top when they pass the bottom
- Slightly translucent (0.6 opacity)

**Ground:** Translucent white with a rainbow shimmer — draw a white-ish ground (`#ddd`), then overlay a thin horizontal rainbow gradient at low opacity that shifts with the frame counter

**Power-up frequency:** Double the normal spawn rate in this level. The player should feel overpowered and amazing. This is the victory lap.

**Star frequency:** Extra high. Stars everywhere. Reward the player for making it this far.

---

## Testing Checklist
- [ ] Campaign starts at Level 1 with correct environment
- [ ] Speed builds from base to max during each level
- [ ] "MAX SPEED!" text appears when max reached
- [ ] 60-second countdown visible and accurate
- [ ] "LEVEL COMPLETE!" screen shows with stats
- [ ] Tap advances to next level
- [ ] Level transition shows level number and name
- [ ] 3-2-1-GO countdown before each level
- [ ] Speed resets at the start of each new level
- [ ] Level 4 (Stormy Highway): rain effect + lightning flashes
- [ ] Level 5 (Moon): gravity is noticeably lower
- [ ] Level 6 (Jungle Ruins): fireflies + green theme
- [ ] Level 7 (Lava): lava bubbles + embers
- [ ] Level 8 (Rainbow Road): cycling colors + confetti + extra stars/power-ups
- [ ] Campaign win screen after Level 8 with coin animation
- [ ] Coin saved to localStorage
- [ ] "ENDLESS MODE UNLOCKED" shows on win screen
- [ ] Endless mode appears locked on mode select (before campaign beaten)
- [ ] Endless mode unlocks after campaign beaten
- [ ] Endless mode plays like current Rally (endless, cycling environments)
- [ ] Campaign progress saves to localStorage
- [ ] Resume prompt on re-entering campaign
- [ ] Coin count displays on mode select screen
- [ ] All 8 levels playable start to finish without bugs
- [ ] No performance issues with rain/confetti particle effects
