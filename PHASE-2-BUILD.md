# Monster Rally — Phase 2 Build Prompt

**Read CLAUDE.md first.** Phase 1 must be complete before starting Phase 2.

---

## Phase 2 Deliverables

### 1. Environment Progression (Levels)

Every **500 points**, the environment changes. This is purely visual — same gameplay, different backdrop. Gives the 6-year-old a sense of progression.

**Environments (in order, cycling):**

| Level | Name | Sky Colors | Ground Color | Features |
|-------|------|-----------|-------------|----------|
| 1 | Desert Night | `#0f0c29` → `#302b63` (current) | `#5a4a3a` (brown dirt) | Mountains, stars, stadium lights (existing) |
| 2 | Sunset City | `#ff6b35` → `#f7c59f` → `#2d3142` | `#555555` (asphalt) | City skyline silhouette, orange/pink clouds, streetlights |
| 3 | Neon Arena | `#0a0020` → `#1a0040` | `#222222` (dark concrete) | Neon colored spotlights sweeping, crowd silhouette along bottom, flashing signs |
| 4 | Moon Surface | `#000011` → `#000022` | `#888888` (grey regolith) | Earth in background, craters in ground, lower gravity (reduce GRAVITY by 30%), stars are brighter/bigger |
| 5 | Lava World | `#1a0000` → `#330000` | `#ff4400` → `#aa2200` (lava/rock) | Lava bubbles popping in background, orange particle embers floating up, volcanic mountains |

**Implementation:**
- Store current environment index, derived from `Math.floor(score / 500) % 5`
- Each environment is a config object: sky gradient stops, ground color, and a `drawBackground(env)` function
- Transition between environments: brief 1-second flash + "DESERT NIGHT!" / "MOON SURFACE!" etc. announcement text
- Moon level modifies gravity constant temporarily (multiply GRAVITY by 0.7) — trucks jump higher and float longer. Kids will LOVE this.
- Ground texture and mountain shapes should change per environment

### 2. Two-Player Split Screen

Two trucks on screen simultaneously. **Not split screen** — both trucks share the same view, same road, same obstacles.

**Implementation:**
- Truck picker allows selecting two trucks (Player 1 picks first, then Player 2)
- Player 1: **A/W/D** keys or **left half of screen** tap
- Player 2: **Arrow keys** or **right half of screen** tap
- Both trucks drawn at slightly different Y offsets to avoid perfect overlap (P1 at lane top, P2 at lane bottom — maybe 20px apart)
- Both trucks have the SAME x-position (they don't race each other — they both scroll together)
- Each truck has independent jump, score, and combo tracking
- Obstacles are shared — if P1 crushes a car, P2 can't also crush it
- Stars can be collected by either player (first to touch)
- **Separate score displays:** P1 score top-left, P2 score top-right
- At the end of each "run" (if we add sessions later) or on title screen, show both scores
- HUD labels: "P1 🔴" and "P2 🔵" (or use their truck colors)

**Mode selection:** After truck picker, show "1 PLAYER" / "2 PLAYERS" choice. This can be two big tappable buttons.

**Touch zones for mobile two-player:**
- Draw a subtle dividing line down the center of the screen
- Left half = P1 jump
- Right half = P2 jump
- Show "P1" and "P2" labels in each zone during first 5 seconds

### 3. Power-Ups

Occasional power-up items that spawn like stars but are rarer and have temporary effects.

| Power-Up | Visual | Duration | Effect |
|----------|--------|----------|--------|
| Mega Truck | Glowing orange circle with ↑ arrow | 5 seconds | Truck grows 1.5x size, crushes EVERYTHING including ramps, double points |
| Magnet | Blue circle with magnet shape | 8 seconds | Stars are attracted to truck from 150px radius |
| Slow-Mo | Green circle with clock shape | 4 seconds | Game speed drops to 60%, truck speed normal — makes crushing easier, looks cinematic |
| Double Stars | Gold circle with "x2" text | 10 seconds | All star pickups worth double |

**Implementation:**
- Spawn every ~300-400 frames (rare enough to be exciting)
- Float and bob like stars but slightly larger with a colored glow
- On collection, show power-up name as large text popup
- Active power-up shown as icon + shrinking timer bar in HUD
- Power-up effects must work in both single and two-player mode (each player has independent power-up state)
- Sound: unique power-up collect sound (deep whomp + ascending sparkle)

### 4. Polish Pass

**Title screen improvements:**
- Animated truck driving across the title screen in background
- Title letters bounce individually (wave animation)
- Monster truck engine rev sound on title screen (low rumble, triggered after first tap)

**Transitions:**
- Smooth fade between title → picker → game (don't hard-cut)
- Brief "3, 2, 1, GO!" countdown after truck selection before game starts

**Mobile controls overlay:**
- First 3 seconds of gameplay: show translucent "TAP!" with a hand icon on the tap zone
- In two-player: show the split zones with P1/P2 labels

**Visual flair:**
- Tire tracks left behind on the ground (dark marks that scroll with the ground, fade over time)
- Headlight glow on the front of the truck (subtle cone of light)
- Background parallax: far mountains move slow, near ground details move fast (layer the scroll speeds)

**High score persistence:**
- Use localStorage to save best score per truck
- Show on truck picker screen: "Best: ⭐ 1240" under each truck

---

## Performance Notes
Two-player mode doubles the draw calls for trucks. Keep particle counts bounded:
- Cap total particles at 150
- Cap dust trail at 30 entries
- If two-player, reduce per-crush particle count from 20 to 12
- Use object pooling for particles if GC stutters occur

## Testing Checklist
- [ ] Environment transitions at 500, 1000, 1500, 2000, 2500 points
- [ ] Moon gravity feels noticeably different (floatier jumps)
- [ ] Two-player mode: both trucks jump independently
- [ ] Two-player mode: touch zones work on mobile (left half / right half)
- [ ] Power-ups spawn, activate, and expire correctly
- [ ] Power-up timer bar displays and shrinks accurately
- [ ] No performance drops below 45fps in two-player with particles
- [ ] localStorage saves: selected truck, best scores, mute state
- [ ] Horn button works for both players in two-player mode
