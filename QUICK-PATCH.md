# Monster Rally — Quick Patch (iPad Playtest Round 2)

**Read CLAUDE.md first.** These are small targeted fixes from live playtesting on iPad.

---

## 1. Rally Mode — 1 Player Only (Remove 2P Option)

**Problem:** The "1 Player / 2 Players" sub-menu after selecting Rally is confusing for young kids. They don't understand the choice and it adds an extra screen before they can play.

**Fix:** Remove the player select screen for Rally mode entirely. Rally is always 1 player. When the user selects RALLY from the mode select screen, skip straight to the countdown and start the game with 1 player.

- Remove the `'playerselect'` gameState transition for Rally
- `selectMode('rally')` should set `numPlayers = 1` and call `startCountdown()` directly
- The `drawPlayerSelectScreen()` function can remain in the code (in case 2P Rally is re-enabled later) but should never be triggered
- Battle mode remains 2 players — that's fine, kids understand "battle = two people"

---

## 2. Slo-Mo Still Exists — Replace with Turbo Boost

**Problem:** The Slo-Mo power-up is STILL spawning in the game despite the previous fix spec. It needs to be completely replaced with Turbo Boost.

**Fix — verify ALL of these:**
- Search the entire codebase for any reference to `'slowmo'`, `'slow'`, `'Slow-Mo'`, `'SLOW'` — replace with Turbo Boost
- The power-up type string should be `'turbo'` (not `'slowmo'`)
- The spawn logic should create a `'turbo'` type power-up, not `'slowmo'`
- Effect on collection: `gameSpeed *= 1.4` (40% FASTER), NOT `gameSpeed *= 0.6`
- Duration: 4 seconds (240 frames at 60fps)
- Visual: orange/red icon with ⚡ symbol, NOT green with clock
- Text popup: "TURBO!" not "SLOW-MO!"
- During Turbo Boost active: subtle horizontal speed lines in the background (2-3 thin white lines that streak across the screen)
- HUD timer bar color: orange/red (not green)

**Double-check:** Run the game, collect every power-up type, and confirm Slo-Mo never appears.

---

## 3. All Power-Ups Available at All Times

**Problem:** Some power-ups aren't spawning until later in the game. All power-ups should be available from the very start.

**Fix:**
- Remove ANY conditions that gate power-up spawning based on score, speed, time, or game progress
- The power-up spawn timer should start immediately when the game starts
- ALL 4 power-up types (Turbo Boost, Mega Truck, Magnet, Double Stars) should have equal spawn chance from frame 1
- In Rally mode: power-ups spawn on the normal timer from the start
- In Crush Frenzy mode: power-ups should also be available (they were previously disabled — enable them)
- In Battle Sumo mode: no power-ups (the arena mode doesn't use scrolling obstacles)

---

## 4. Back Button — Make It a Real Visible Button

**Problem:** The "← Back" text on the title screen is too subtle for young kids to see or understand. It looks like plain text, not something interactive.

**Fix:** Replace the text-only "← Back" with a prominent, colorful button:

- **Size:** At least 130x50px (virtual coords) — big enough for small fingers
- **Position:** Top-left corner of the title screen, with 15px margin from edges
- **Visual:**
  - Rounded rectangle background (`border-radius: 12px`)
  - Background color: semi-transparent with a colored fill — use `rgba(255,107,53,0.85)` (orange, matching the site's primary color)
  - White text: "🏠 GAMES" in bold, 18px font
  - 2px border: `rgba(255,255,255,0.3)` for definition
  - Subtle shadow: `rgba(0,0,0,0.3)` drop shadow behind the button
- **Behavior:** On tap → `window.location.href = '/'`
- **Only visible on title screen** (`gameState === 'title'`)

Apply the same button style to the "← GAMES" button on the mode select screen — replace the plain text with the same colorful button.

---

## Testing Checklist
- [ ] Rally mode: selecting Rally goes straight to countdown (no 1P/2P choice)
- [ ] Battle mode: still goes through P2 truck selection as before
- [ ] No Slo-Mo power-up anywhere in the game — only Turbo Boost
- [ ] Turbo Boost makes the game FASTER (not slower)
- [ ] Turbo Boost icon is orange/red with ⚡, not green with clock
- [ ] Power-ups spawn from the very start of Rally mode
- [ ] Power-ups spawn in Crush Frenzy mode
- [ ] Back button on title screen is a prominent orange rounded button with "🏠 GAMES"
- [ ] Back button on mode select is the same style
- [ ] Both back buttons navigate to `/` (landing page)
- [ ] All buttons are easily tappable on iPad
