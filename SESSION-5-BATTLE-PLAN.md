# Simple Kids Games — Session 5 Battle Plan

**Date:** March 27, 2026
**Starting state:** Game rolled back to commit `72c7c44` (HUD polish). All Session 4 features live EXCEPT location system.
**Goal:** Rebuild the full location system cleanly with syntax verification at every step.

---

## THE RULE: VERIFY AFTER EVERY COMMIT

After EVERY commit, before moving to the next prompt:

1. Hard refresh the game in your browser
2. Open Console (F12) — must show **zero errors**
3. If there's a syntax error: **STOP. Do not proceed.** Roll back that commit and try again.

Tell Claude Code to include this at the end of every prompt:

> **Before committing, verify syntax:** `node -e "try { new (require('vm').Script)(require('fs').readFileSync('games/catch-and-reel/index.html','utf8')); console.log('SYNTAX OK'); } catch(e) { console.log('ERROR:', e.message); }"` — Do NOT commit if this fails.

---

## STEP 1: Location Select Screen + Flow Wiring

This is the UI and game flow — no background rendering changes.

### Prompt:

**Read CLAUDE.md first. Then read FISHING-LOCATIONS-SPEC.md.**

Add the location select screen and game flow to `games/catch-and-reel/index.html`.

**Build:**

1. Add `LOCATIONS` array constant with 5 locations (dock/pier/reef/deepsea/volcano), each with: id, name, desc, unlock threshold, icon, platform type, accent color, fishBoost object.

2. Add `var currentLocation = 'dock';` near the top of the script with other game state variables.

3. Add localStorage tracking:
   - `catchreel_total_catches` — lifetime fish count, increment on fish catch (NOT junk)
   - `catchreel_location` — last selected location ID

4. Build the Location Select screen as a new HTML overlay (same pattern as character select):
   - Title: "CHOOSE YOUR SPOT"
   - 5 location cards in a scrollable row
   - Unlocked: icon, name, desc, accent border, tappable
   - Locked: 🔒, progress bar (current/threshold), dimmed, not tappable
   - Default dock always unlocked

5. Wire the game flow:
   - Character Select → Location Select → Fishing
   - Play again → Character Select
   - Store selected location in localStorage

6. Add iOS touch handlers (touchstart with preventDefault + 500ms debounce) on ALL interactive elements:
   - Character select cards
   - Location select cards
   - Any confirm/go buttons
   - TROPHIES button on character select screen

7. For the global touchstart handler that calls preventDefault(): ONLY call preventDefault when `gameStarted === true && !gamePaused` AND the touch target is not inside a UI overlay. Default behavior: let touches through. Game canvas during active fishing: intercept.

8. Increment `catchreel_total_catches` on fish catches (not junk).

**Do NOT add any new background rendering.** All locations show the existing night dock background — that's expected.

**Before committing, verify syntax:** `node -e "try { new (require('vm').Script)(require('fs').readFileSync('games/catch-and-reel/index.html','utf8')); console.log('SYNTAX OK'); } catch(e) { console.log('ERROR:', e.message); }"`

Do NOT commit if syntax check fails. Fix the error first.

Commit message: `feat: location select screen + unlock progression system`

### Verify:
- [ ] Browser console: zero errors
- [ ] Desktop: click character → location select appears
- [ ] Desktop: click location → fishing starts
- [ ] Desktop: TROPHIES button works from character select
- [ ] Mobile/iOS: character select advances (if you can test)
- [ ] `typeof drawBackground` in console — should still be `"function"` (existing bg code untouched)

---

## STEP 2: Background Refactor + Dock Enhanced + Sunny Pier + Coral Reef

Three dock-based scenes. The dock structure is shared.

### Prompt:

**Read CLAUDE.md first. Read FISHING-LOCATIONS-SPEC.md. Reference fishing-locations-v2.html for visual targets.**

Refactor background rendering to support multiple locations in `games/catch-and-reel/index.html`.

**Build:**

1. Create a `drawBackground()` function that switches on `currentLocation` and calls the appropriate scene function.

2. Replace the existing background draw calls in the `frame()` function render section with a single `drawBackground()` call.

3. Create `bgParticles` array and `initBgParticles(location)` function. Initialize when location is selected.

4. Create helper functions: `bgGrad()`, `bgRadGrad()`, `bgWave()` for compact gradient/wave creation.

5. Scene 0 — Wooden Dock (Night) — enhance existing:
   - Keep all current sky/stars/moon/water rendering
   - Add: hanging lantern (post, curved bracket, swinging chain, glass housing, flickering flame, 80px warm glow, water reflection)
   - Add: 8 fireflies, milky way band, star cross-sparkle, moon craters, treeline silhouette, rope on dock
   - Dock extends from left edge, lantern at far right end past character

6. Scene 1 — Sunny Pier (Day):
   - Same dock structure, daytime wood colors (#9a8868 / #b8a880)
   - Bright blue sky, sun with god rays, puffy clouds, seagulls, lighthouse, green hills
   - Turquoise water, sun sparkles, sun reflection column

7. Scene 2 — Coral Reef (Sunset):
   - Same dock, warm sunset tones (#6a5030 / #8a6a48)
   - Sunset gradient sky, half-set sun, warm clouds, 3 palm trees with deterministic sway (NO Math.random in render)
   - Rich underwater flora: fan coral, brain coral, sea anemone, seaweed
   - Fish shadows, tropical fireflies, tropical birds

**CRITICAL: All palm tree rendering must use deterministic values. NO Math.random() in any render loop function. Use index-based calculations or pre-computed values.**

**CRITICAL: waterY stays at H * 0.58 for ALL locations.**

**Before committing, verify syntax:** `node -e "try { new (require('vm').Script)(require('fs').readFileSync('games/catch-and-reel/index.html','utf8')); console.log('SYNTAX OK'); } catch(e) { console.log('ERROR:', e.message); }"`

Do NOT commit if syntax check fails.

Commit message: `feat: location backgrounds — dock enhanced, sunny pier, coral reef`

### Verify:
- [ ] Browser console: zero errors
- [ ] `typeof drawBackground` → `"function"`
- [ ] Wooden Dock: enhanced with lantern, fireflies, bigger moon
- [ ] Sunny Pier: bright day scene with seagulls, lighthouse
- [ ] Coral Reef: sunset with palms (smooth sway, no flicker), coral, fish shadows
- [ ] Character and rod render correctly on top of all 3 scenes

---

## STEP 3: Deep Sea Boat + Volcano Cove

Two scenes with unique platforms (no dock).

### Prompt:

**Read CLAUDE.md first. Read FISHING-LOCATIONS-SPEC.md. Reference fishing-locations-v2.html for visual targets.**

Add Deep Sea and Volcano Cove backgrounds in `games/catch-and-reel/index.html`.

**Build:**

1. Scene 3 — Deep Sea (Storm) with fishing boat:
   - Dark stormy sky, lightning with branching + scene flash
   - Fishing boat: hull, deck, cabin with warm windows, mast with blinking red light, railings
   - Boat rocks on swells (sinusoidal Y + rotation)
   - Character must stand ON the boat and rock with it
   - 250 rain particles, sea spray, fog banks, white caps, dark choppy water

2. Scene 4 — Volcano Cove (Dusk) with obsidian ledge:
   - Dark volcanic haze sky, volcano silhouette with crater glow, smoke
   - Rock walls with pulsing lava veins (each on own phase)
   - Obsidian ledge extending from left edge: glassy surface, faceted edges, lava vein along front, scattered rocks, lava glow pool at water edge
   - 80 embers rising, 30 ash flakes falling, lava glow reflections on black water

**For the boat: the character's ground position, rod, and fishing line must all use the boat's rocking Y offset and rotation. When the boat tips, the character tips with it.**

**For the obsidian ledge: character stands on the ledge surface. The ledge doesn't rock.**

**waterY stays at H * 0.58.**

**Before committing, verify syntax:** `node -e "try { new (require('vm').Script)(require('fs').readFileSync('games/catch-and-reel/index.html','utf8')); console.log('SYNTAX OK'); } catch(e) { console.log('ERROR:', e.message); }"`

Do NOT commit if syntax check fails.

Commit message: `feat: location backgrounds — deep sea boat, volcano cove`

### Verify:
- [ ] Browser console: zero errors
- [ ] Deep Sea: storm scene, boat rocks, character rides on boat
- [ ] Volcano: lava veins pulse, embers rise, obsidian ledge visible
- [ ] Fishing gameplay works correctly at both locations
- [ ] All 5 locations selectable and rendering

---

## STEP 4: Fish Pool Weighting + Unlock Celebrations

Gameplay mechanics — makes each location play differently.

### Prompt:

**Read CLAUDE.md first. Read FISHING-LOCATIONS-SPEC.md.**

Add fish pool weighting and unlock notifications in `games/catch-and-reel/index.html`.

**Build:**

1. Fish pool weighting:
   - After junk check (8% stays constant), modify rarity probabilities by location's fishBoost
   - Multiply each rarity's base probability by its boost factor, normalize to sum to 1.0
   - Dock: no boost. Pier: common 1.15×, uncommon 1.1×. Reef: rare 2×, ultra rare 1.5×. Deep Sea: epic 2×, legendary 1.5×. Volcano: exotic 3×, legendary 2×, epic 1.5×.

2. Unlock celebrations:
   - After incrementing totalCatches, check if new threshold crossed (50/100/200/300)
   - Show gold overlay: "🔓 NEW LOCATION UNLOCKED!", location name + icon, accent glow
   - Auto-dismiss 4 seconds or tap to dismiss
   - Show once per unlock (track in localStorage `catchreel_shown_unlocks`)
   - Add iOS touchend to dismiss

3. Location select reflects new unlocks immediately on return.

**Before committing, verify syntax:** `node -e "try { new (require('vm').Script)(require('fs').readFileSync('games/catch-and-reel/index.html','utf8')); console.log('SYNTAX OK'); } catch(e) { console.log('ERROR:', e.message); }"`

Do NOT commit if syntax check fails.

Commit message: `feat: fish pool weighting per location + unlock celebrations`

### Verify:
- [ ] Browser console: zero errors
- [ ] Set catches to 300 in console: `localStorage.setItem('catchreel_total_catches', '300')`
- [ ] All locations unlocked on location select
- [ ] Fish at Volcano Cove — exotics appear more frequently
- [ ] Reset and test unlock: `localStorage.setItem('catchreel_total_catches', '49'); localStorage.removeItem('catchreel_shown_unlocks');`
- [ ] Catch one fish — unlock notification for Sunny Pier appears

---

## STEP 5: CLAUDE.md Update

Quick housekeeping after everything works.

### Prompt:

**Read CLAUDE.md first. Then update it with these new sections:**

1. Add a **Fishing Locations** section documenting:
   - 5 locations with unlock thresholds
   - Fish pool weighting per location
   - Background rendering architecture (drawBackground dispatcher, bgParticles, per-scene functions)
   - Location select screen flow
   - localStorage keys (catchreel_total_catches, catchreel_location, catchreel_shown_unlocks)

2. Add a **Junk Catches** section documenting:
   - 3 items (boot, seaweed, tin can) with SVG keys
   - 8% chance, 0 points, no trophy, no stats
   - Dismiss on player input
   - Funny label rotation

3. Update the **Queued** section — remove completed items, add any new backlog.

Commit message: `docs: update CLAUDE.md with locations system + junk catches`

---

## Files needed in repo root before starting:
- `FISHING-LOCATIONS-SPEC.md` ← already there
- `fishing-locations-v2.html` ← already there
- `junk-catches-v2.html` ← already there

## Quick reference — test commands:
```bash
# Unlock all locations
localStorage.setItem('catchreel_total_catches', '300');

# Reset unlocks
localStorage.setItem('catchreel_total_catches', '0');
localStorage.removeItem('catchreel_shown_unlocks');

# Syntax check (run in repo root)
node -e "try { new (require('vm').Script)(require('fs').readFileSync('games/catch-and-reel/index.html','utf8')); console.log('SYNTAX OK'); } catch(e) { console.log('ERROR:', e.message); }"
```

---

## Estimated time: 
- Step 1: 15-20 min
- Step 2: 20-30 min (biggest prompt)
- Step 3: 15-20 min
- Step 4: 10-15 min
- Step 5: 5-10 min
- **Total: ~60-90 min if each step passes first try**

Good luck. Verify after every commit. Trust the browser, not Claude Code.
