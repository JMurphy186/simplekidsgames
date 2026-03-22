# Monster Rally — Mobile Playtest Fixes

**Read CLAUDE.md first.** These fixes come from real playtesting on iPhone Safari. Every issue here was observed by an actual user.

---

## Priority Order
1. iPhone Safari viewport/fullscreen fix (game is cut off)
2. Back to main site button (no way to exit to landing page)
3. Pause button too small on mobile
4. Vehicle picker cycling (can't loop through all trucks)
5. Change vehicle from mode select screen
6. Power-up tuning (slo-mo → speed boost, mega size bigger, magnet wider)
7. OG image verification

---

## 1. iPhone Safari — Viewport & Fullscreen

**Problem:** In landscape mode on iPhone Safari, the bottom of the game is cut off and the user can't scroll to see it. The game never fills the full screen.

**Root cause:** iPhone Safari has a dynamic toolbar (URL bar + bottom bar) that eats into viewport height. `100vh` doesn't account for this. The canvas sizing math is likely using `window.innerHeight` which doesn't reflect the actual visible area on iOS Safari.

**Fix — Multiple approaches, implement ALL:**

### A. Use `dvh` units and visual viewport API
```css
body {
  height: 100dvh; /* dynamic viewport height — accounts for Safari bars */
  overflow: hidden;
}
```

### B. Resize canvas using visualViewport
Replace the current `resize()` function with:
```js
function resize() {
  const vw = window.visualViewport ? window.visualViewport.width : window.innerWidth;
  const vh = window.visualViewport ? window.visualViewport.height : window.innerHeight;
  const ratio = 800 / 450;
  if (vw / vh > ratio) {
    canvas.height = vh;
    canvas.width = vh * ratio;
  } else {
    canvas.width = vw;
    canvas.height = vw / ratio;
  }
}

// Listen to both resize and visualViewport changes
window.addEventListener('resize', resize);
if (window.visualViewport) {
  window.visualViewport.addEventListener('resize', resize);
}
resize();
```

### C. Fullscreen-like experience
Add meta tags to the game's `<head>` (NOT the landing page, just the game HTML):
```html
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="mobile-web-app-capable" content="yes">
```

Add CSS to prevent scrolling and fill the screen:
```css
html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100dvh;
  overflow: hidden;
  position: fixed;
  touch-action: none;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
}
```

### D. Hide Safari UI on scroll (landscape)
When the game starts, attempt to scroll away the URL bar:
```js
// On game start, try to minimize Safari chrome
window.scrollTo(0, 1);
```

### E. Fullscreen API (for Android Chrome)
On first tap (title screen), attempt to go fullscreen:
```js
function tryFullscreen() {
  const el = document.documentElement;
  if (el.requestFullscreen) el.requestFullscreen();
  else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
}
```
Call this on the first user interaction (title screen tap). Note: iOS Safari does NOT support the Fullscreen API — the CSS/viewport fixes above are the iOS solution.

---

## 2. Back to Main Site Button

**Problem:** There is no way to navigate back to simplekidsgames.com from within the game. The "← Back" button from the UI polish spec was either not implemented or not visible enough.

**Implementation:**

### On the Title Screen
Draw a **"← GAMES"** button in the **top-left corner** of the title screen:
- Position: x=15, y=15 (virtual coords)
- Size: at least 120x44px hit area (Apple's minimum touch target)
- Visual: semi-transparent dark rounded rectangle (`rgba(0,0,0,0.5)`) with white text "← GAMES"
- Font: bold, 16px
- On tap/click: `window.location.href = '/'`
- Only visible on `gameState === 'title'`
- Canvas-drawn, not HTML

### On the Pause Overlay
Add a **4th button** to the pause menu: **"🏠 MAIN MENU"** (below Quit)
- Same button style as Resume/Restart/Quit
- Color: blue or teal
- On tap: `window.location.href = '/'`

### On the Mode Select Screen
Add a small **"← BACK TO GAMES"** text/button at the top of the mode select screen
- Tapping it goes to `window.location.href = '/'`

---

## 3. Pause Button Too Small on Mobile

**Problem:** The pause button (❚❚) in the top-right corner is too small to tap reliably on iPhone.

**Fix:**
- Increase the **hit area** to at least **50x50px** (virtual coords). The visible icon can stay smaller, but the tappable zone must be bigger.
- Increase the **visible icon size** from current to at least 28x28px
- Add a subtle semi-transparent background circle/rounded-rect behind the icon so it's visually distinct from the game scene
- Background: `rgba(0,0,0,0.4)`, rounded, with 4px padding around the icon
- Move it slightly inward from the edge: position at (W - 45, 15) instead of the very corner, so it's not competing with Safari's UI elements

**Test:** On iPhone in landscape, the pause button should be easy to tap with a thumb without accidentally hitting the browser's back/forward swipe zones.

---

## 4. Vehicle Picker — Free Cycling

**Problem:** You can scroll right through all 8 trucks, but scrolling left from the first truck hits a dead end instead of wrapping around to the last truck. The picker should loop infinitely in both directions.

**Fix:**
When the selected index goes below 0, wrap to the last truck. When it goes above the max, wrap to the first:

```js
// When pressing left arrow or tapping left button:
selectedTruck = (selectedTruck - 1 + ROSTER_COUNT) % ROSTER_COUNT;

// When pressing right arrow or tapping right button:
selectedTruck = (selectedTruck + 1) % ROSTER_COUNT;
```

This gives infinite looping in both directions. The same fix should apply to Player 2's truck selection in Battle mode.

### Single-Tap Selection (Remove Double-Tap Confirm)
**Problem:** Currently the picker requires one tap to select a truck, then a second tap to confirm. This is unnecessary friction — a 3-year-old doesn't understand "tap again to confirm." They tap the truck they want and expect the game to move forward.

**Fix:** Remove the confirm step entirely. A single tap on a truck card selects it AND immediately advances to the mode select screen. Same for keyboard — pressing Enter/Space on a highlighted truck advances immediately. Same behavior for Player 2's truck selection in Battle mode.

---

## 5. Change Vehicle from Mode Select Screen

**Problem:** After picking a truck, the user goes to mode select but can't change their truck choice without going all the way back to the title screen.

**Fix:** Add a **"← Change Truck"** button/link at the top of the mode select screen:
- Text: "← CHANGE TRUCK" in smaller font, positioned top-left
- On tap: set `gameState = 'picker'` (go back to truck picker)
- This is a canvas-drawn button, same style as other menu elements

Also consider: show the selected truck's name or a mini preview on the mode select screen so the user knows which truck they picked.

---

## 6. Power-Up Tuning

### A. Replace Slo-Mo with Speed Boost
**Problem:** Slo-Mo feels counterproductive — slowing down isn't fun in a game about speed and smashing. Replace with a Speed Boost that makes things faster and more exciting.

**Changes:**
- Rename: "Slow-Mo" → "TURBO BOOST"
- Visual: change the power-up icon color from green to orange/red. Change the clock shape to a lightning bolt or flame shape.
- Effect: instead of reducing game speed, INCREASE it by 40% for 4 seconds
- During Turbo Boost: add motion blur effect (subtle horizontal streak lines), increase particle count, make the engine sound faster
- Spawn rate: same as before, available in ALL modes (not restricted to 50% speed — remove any speed-gating)
- Text popup on collect: "TURBO!"

### B. Mega Truck — Make It Bigger
**Problem:** The size increase on Mega Truck power-up isn't dramatic enough.

**Fix:**
- Increase the scale from 1.5x to **2.0x** body size
- The truck should feel MASSIVE — comically oversized
- Make the crush effect even more dramatic at mega size: bigger particles, louder crush sound, more screen shake
- The visual should be impossible to miss — the truck should fill a significant portion of the screen height

### C. Magnet — Increase Radius
**Problem:** The magnet pull radius is too small — stars need to be very close before they're attracted.

**Fix:**
- Increase magnet radius from 150px to **220px**
- Stars within the magnet radius should accelerate toward the truck (not just drift), making the collection feel more satisfying
- Add a subtle visual indicator of the magnet field: faint circular glow or ring around the truck (pulsing, semi-transparent, in the magnet power-up color)

### D. Power-Up Availability
- ALL power-ups (Turbo Boost, Mega Truck, Magnet, Double Stars) should be available at any game speed / any point in gameplay
- Remove any conditions that gate power-up spawning based on current speed or score

---

## 7. OG Image Verification

**Problem:** The OG card image isn't showing when the site URL is shared.

**Checklist for the developer:**
1. Verify `og-image.png` exists in the root of the deployed site (check `https://simplekidsgames.com/og-image.png` loads in a browser)
2. Verify the root `index.html` has these meta tags in the `<head>`:
```html
<meta property="og:image" content="https://simplekidsgames.com/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
```
3. If the image is very large (>1MB), compress it — social platforms may reject oversized images
4. Use Facebook's Sharing Debugger to force a re-scrape: https://developers.facebook.com/tools/debug/
5. iMessage may cache old results — try sharing to someone who hasn't received the link before

---

## Testing Checklist
- [ ] iPhone Safari landscape: game fills the visible screen, nothing cut off
- [ ] iPhone Safari portrait: game scales correctly
- [ ] "← GAMES" button visible and tappable on title screen
- [ ] "← GAMES" button on mode select screen
- [ ] "MAIN MENU" button in pause overlay
- [ ] Pause button is easily tappable on iPhone (no accidental browser swipes)
- [ ] Truck picker loops infinitely left AND right through all 8 trucks
- [ ] Tapping a truck in the picker selects it AND advances to mode select (single tap, no confirm)
- [ ] Mode select has "← CHANGE TRUCK" option
- [ ] Turbo Boost power-up replaces Slo-Mo (speed INCREASE, not decrease)
- [ ] Turbo Boost spawns at any speed/score
- [ ] Mega Truck scales to 2.0x (comically large)
- [ ] Magnet radius is 220px with visible field indicator
- [ ] All power-ups available at all times (no speed gating)
- [ ] OG image loads at simplekidsgames.com/og-image.png
- [ ] OG meta tags present in root index.html
- [ ] Sharing URL on iMessage/social shows the cover image
