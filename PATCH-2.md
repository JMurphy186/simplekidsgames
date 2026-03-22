# Monster Rally — Urgent Fixes (Patch 2)

**Read CLAUDE.md first.** Critical bugs from live playtesting plus quick improvements.

---

## 1. 🚨 CRITICAL — Pause Menu Buttons Are Wired Wrong

**Problem:** The pause overlay buttons are connected to the WRONG actions:
- **Resume** does nothing (broken)
- **Restart** actually resumes the game
- **Quit** restarts the current session

**Expected behavior:**
- **Resume** → unpause, return to `gameState = 'playing'`, resume engine sound
- **Restart** → call `initGame()` then `startCountdown()` (fresh game, same mode)
- **Quit** → return to `gameState = 'modeselect'`, stop all sounds

**Fix:** Find the pause overlay button click handlers and the keyboard shortcut handlers (R for restart, Q for quit). The hit-test Y coordinates or the action assignments are swapped. Check:
1. The button draw positions (which button is drawn where)
2. The click handler hit-test regions (which Y range maps to which action)
3. Make sure the draw order matches the click order

The buttons should be stacked vertically in this order (top to bottom):
1. **▶ RESUME** (green) — top button
2. **↺ RESTART** (orange) — middle button  
3. **✕ QUIT** (red) — bottom button
4. **🏠 MAIN MENU** (blue) — lowest button

Each button's click hit-test Y range must match its drawn Y position EXACTLY. If button 1 is drawn at y=180 and button 2 at y=240, the click handler must check those same ranges.

**Test thoroughly:** Pause the game, tap each button one at a time, verify each does the correct action. Test with both touch and keyboard (P/ESC to pause, R to restart, Q to quit, Space to resume).

---

## 2. Change Truck Button — Match GAMES Button Style

**Problem:** The "CHANGE TRUCK" text on the mode select screen is too subtle. It should match the prominent orange button style used for the "🏠 GAMES" button.

**Fix:** Replace the plain text "CHANGE TRUCK →" with a styled button:
- **Size:** At least 130x50px hit area
- **Visual:** Rounded rectangle (`border-radius: 12px`)
- **Background:** `rgba(255,107,53,0.85)` (orange, same as GAMES button)
- **Text:** "🚛 CHANGE TRUCK" in white, bold, 16px
- **Border:** 2px `rgba(255,255,255,0.3)`
- **Position:** Top-right area of mode select screen (balanced with the GAMES button on the left)

Both buttons (GAMES on left, CHANGE TRUCK on right) should look like matching siblings — same style, same size, different icons/labels.

---

## 3. Faster Start — Less Empty Space Before First Object

**Problem:** When the game starts, there's too much empty road before the first obstacle appears. The player taps, the countdown finishes, and then they're just... driving through nothing for several seconds. Kids lose interest.

**Fix:**
- Set the initial `obstacleTimer` to a LOW value so the first obstacle spawns almost immediately:
  ```js
  // In initGame() or right after countdown:
  obstacleTimer = 15; // First obstacle appears within ~0.25 seconds
  ```
- Also pre-spawn a star at a reachable position so there's something to collect in the first 2 seconds:
  ```js
  // Spawn an early star
  spawnStar(400, GROUND_Y - 80); // Ahead of the truck, jumpable height
  ```
- Pre-spawn the first obstacle closer to the truck's starting position:
  ```js
  // Spawn first obstacle at x=500 instead of waiting for the timer
  // (call spawnObstacle() and set its x to 500)
  ```
- The goal: within 1-2 seconds of the countdown ending, the player should see BOTH a star to collect AND an obstacle to crush/dodge. Immediate engagement.

---

## 4. Replace Double Stars with Super Jump

**Problem:** Double Stars is boring — kids don't notice or care about score multipliers. Replace with Super Jump, which is visceral and fun.

**Changes:**

### Power-Up Definition
- **Name:** "SUPER JUMP"
- **Type string:** `'superjump'` (replaces `'doublestars'`)
- **Visual icon:** Purple/blue circle with an ↑ arrow or spring shape
- **Icon color:** `#8855ff` (purple) with `#aa88ff` accent
- **Text popup on collect:** "SUPER JUMP!"
- **Duration:** 8 seconds (480 frames at 60fps)
- **HUD timer bar color:** purple

### Effect
- While active, JUMP_FORCE is multiplied by **1.8x** (so `-12` becomes `-21.6`)
- The truck jumps MUCH higher — nearly to the top of the screen
- Higher jumps mean more airtime, which means:
  - Easier backflips (more hang time)
  - Can clear multiple obstacles in one jump
  - More satisfying crush landings (falling from higher = bigger screen shake)
- Add a visual indicator while active: subtle purple glow/trail behind the truck (3-4 small purple circles that fade, drawn at the truck's previous positions)

### Spawn
- Same spawn chance as other power-ups
- Available in all modes (Rally, Crush Frenzy)
- The 4 power-up types are now: **Turbo Boost, Mega Truck, Magnet, Super Jump**

### Remove Double Stars
- Remove all references to `'doublestars'`, `'double'`, `'Double Stars'`, `'2x'`
- Remove the score doubling logic
- Replace with Super Jump everywhere

---

## Testing Checklist
- [ ] Pause → Resume button RESUMES the game (returns to playing)
- [ ] Pause → Restart button RESTARTS (fresh game, countdown)
- [ ] Pause → Quit button goes to MODE SELECT
- [ ] Pause → Main Menu button goes to landing page (/)
- [ ] Keyboard: P/ESC pauses, R restarts, Q quits, Space resumes
- [ ] Change Truck button on mode select is an orange rounded button
- [ ] Change Truck button matches GAMES button style
- [ ] First obstacle appears within 1-2 seconds of game start
- [ ] A star is visible within the first 2 seconds
- [ ] No long empty road at the beginning
- [ ] Super Jump power-up exists (purple icon with ↑)
- [ ] Super Jump makes truck jump ~1.8x higher
- [ ] Super Jump lasts 8 seconds with purple HUD timer
- [ ] Purple trail effect visible during Super Jump
- [ ] Double Stars power-up is completely gone
- [ ] All 4 power-ups spawn: Turbo Boost, Mega Truck, Magnet, Super Jump
