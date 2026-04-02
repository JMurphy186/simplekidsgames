# Catch & Reel — Pause Menu: Add Change Level Button

**Read CLAUDE.md first.** Single HTML file, no external assets. All changes in `games/catch-and-reel/index.html`.

---

## Task Summary

Add a "Change Level" button to the existing pause menu. Also swap the Change Fisher icon from 🔄 to 🎣. After selecting a new level, show a 3-2-1 countdown before resuming gameplay at the new location.

---

## Button Order (Final)

The pause menu buttons should appear in this exact order:

1. ▶ **RESUME** — green (existing, no changes)
2. 🔊 **SOUND: ON/OFF** — gray (existing, no changes)
3. 🏆 **TROPHIES** — gold (existing, no changes)
4. 🗺️ **CHANGE LEVEL** — **NEW BUTTON** (orange)
5. 🎣 **CHANGE FISHER** — blue/purple (existing — swap icon from 🔄 to 🎣)
6. 🏠 **MENU** — dark (existing, no changes)

---

## Change Level Button — Style

- Background: linear gradient from `#E67E22` to `#D35400`
- Border color: `#F0923E`
- Box shadow: `0 0 16px rgba(230, 126, 34, 0.4), 0 4px 12px rgba(0,0,0,0.3)`
- White text with text-shadow
- Icon: 🗺️
- Label: `CHANGE LEVEL`
- Match the existing button sizing, border-radius, font, and padding exactly

---

## Behavior: Change Level Flow

1. Player taps **Change Level** in pause menu
2. The **location picker overlay** opens (reuse the existing location select UI — the same one shown before gameplay starts)
3. Player taps a location
4. Pause menu closes
5. **3-2-1 countdown** appears on screen:
   - Large number (3... 2... 1...) centered on screen
   - Below the number: "Loading [Location Name]..." in smaller text
   - Each number displays for 1 second with a scale pulse animation
   - After "1", brief pause then gameplay resumes
6. Game resets for new location:
   - Background re-renders (sky, water, dock/boat/ledge, particles)
   - Fish pool re-filters for location exclusives (`pickFish()` already handles this via the `location` field)
   - HUD progress bar updates to reflect new location
   - Bobber resets to idle state
   - Score/catches/stats from current session carry over (do NOT reset — player is just changing scenery)

**Important:** If the player selects the SAME location they're already at, just close the overlay and return to pause menu. No countdown needed.

---

## Behavior: Change Fisher (Existing — Icon Swap Only)

- Swap the icon from 🔄 to 🎣
- No other changes to Change Fisher behavior

---

## 3-2-1 Countdown Implementation

- Draw the countdown on the Canvas (not HTML overlay) — consistent with the game's rendering approach
- Number font: same as existing level transition text (Luckiest Guy or the game's display font)
- Number color: `#F0923E` (orange, matching the Change Level button)
- Glow/shadow: `0 0 30px rgba(230, 126, 34, 0.6)` text shadow effect
- Scale pulse: number starts at scale 1.0, pulses to 1.15 and back over each 1-second interval
- Location name text below: smaller, white/gray, standard game font
- During countdown: game is NOT running (no fish spawns, no casts, no physics)

---

## iOS Touch Handling — CRITICAL

Every new button and interactive element MUST have touch handlers baked in from line one:

```javascript
// Pattern for the Change Level button:
changeLevelBtn.addEventListener('touchstart', function(e) {
  e.preventDefault();
  // handler logic here
}, { passive: false });
changeLevelBtn.addEventListener('click', function(e) {
  // same handler logic (desktop fallback)
});
```

- Use `touchstart` with `preventDefault` + `{ passive: false }` on ALL new buttons
- Verify the global touch handler exclusion covers the pause menu container
- The location picker overlay buttons also need iOS touch handling (they should already have it — verify, don't assume)

---

## Syntax Check

After every change, run:
```bash
node -e "try { new (require('vm').Script)(require('fs').readFileSync('games/catch-and-reel/index.html','utf8')); console.log('SYNTAX OK'); } catch(e) { console.log('ERROR:', e.message); }"
```
The HTML `<` token error is a known false positive — ignore it. Any OTHER error is real.

---

## What NOT to Change

- Do not modify game physics, fish spawning rates, or reel mechanics
- Do not change the existing location picker UI design — just reuse it
- Do not reset score/catches when changing levels (session stats carry over)
- Do not touch any SVG fish data or FISH_SVGS
- Do not modify the trophy room
- Do not add any external assets or dependencies
