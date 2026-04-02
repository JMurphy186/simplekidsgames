# Monster Rally — Quick Patch 3

**Read CLAUDE.md first.** Two fixes from user feedback.

---

## 1. Safari — Truck Not Visible Until First Tap

**Problem:** On some iPhones in Safari, the game canvas appears blank (or the truck doesn't render) until the user taps the screen for the first time. After the first tap, everything works normally.

**Root cause:** iOS Safari delays canvas rendering as a power optimization. The `requestAnimationFrame` loop may be running but Safari doesn't composite the canvas to the screen until there's a user interaction or a forced repaint.

**Fix — implement ALL of these:**

### A. Force initial draw before RAF loop
Call the `draw()` function once synchronously BEFORE starting the `requestAnimationFrame` loop:
```js
// At the end of initialization:
draw();  // Force first frame to paint immediately
gameLoop();  // Then start the RAF loop
```

### B. Force canvas repaint on load
After the canvas is set up and the first draw is complete, force Safari to acknowledge the content:
```js
window.addEventListener('load', function() {
  // Force Safari to repaint the canvas
  canvas.style.display = 'none';
  canvas.offsetHeight; // Force reflow
  canvas.style.display = '';
  
  // Also try toggling opacity
  canvas.style.opacity = '0.99';
  requestAnimationFrame(function() {
    canvas.style.opacity = '1';
  });
});
```

### C. Ensure resize fires on load
Make sure the `resize()` function is called immediately AND on load:
```js
resize(); // Called during init
window.addEventListener('load', resize); // Also on load (Safari sometimes needs this)
```

### D. Canvas willReadFrequently hint
When creating the canvas context, add the hint:
```js
const ctx = canvas.getContext('2d', { willReadFrequently: false });
```
This can help Safari optimize its rendering pipeline.

**Test:** Open the game in Safari on an iPhone WITHOUT tapping. The title screen and truck should be visible immediately. If the title screen shows but the truck in the picker doesn't render until tap, the issue is specifically in the picker's draw function — apply the same forced-draw fix there.

---

## 2. Limit Backflip Rotations (Anti-Dizzy)

**Problem:** When the truck is airborne for a long time (Super Jump, high ramps, crush bounces), it spins continuously for as long as it's in the air. Multiple rapid full rotations look chaotic and can be visually dizzying.

**Fix:** Cap the truck rotation at **1 full backflip** (360°) per jump. After completing one full rotation, the truck holds steady (no more spinning) until it lands.

### Implementation

Find the airborne rotation logic. It likely increments a rotation angle each frame while the truck is not grounded. Change it to:

```js
// Track total rotation this jump
if (!player.grounded) {
  player.airborneFrames++;
  
  // Only rotate if we haven't completed a full flip yet
  if (player.totalFlipRotation < Math.PI * 2) {
    const rotationSpeed = 0.15; // radians per frame (tune as needed)
    player.flipRotation += rotationSpeed;
    player.totalFlipRotation += rotationSpeed;
    
    // Clamp to exactly 360° if we've passed it
    if (player.totalFlipRotation >= Math.PI * 2) {
      player.totalFlipRotation = Math.PI * 2;
      player.flipRotation = 0; // Snap upright after completing the flip
    }
  }
} else {
  // On landing, reset flip tracking
  player.flipRotation = 0;
  player.totalFlipRotation = 0;
  player.airborneFrames = 0;
}
```

### Key behaviors:
- **One flip per jump** — truck rotates through 360°, then stops rotating and flies level
- **Flip still triggers** after the airborne threshold (~60 frames) — the threshold doesn't change
- **"BACKFLIP!" text and points** still award when the flip completes — that doesn't change
- **Landing mid-flip** still snaps to upright — that safety behavior stays
- **New jump = new flip allowance** — the counter resets on every landing
- **Super Jump gets one flip too** — even with 1.8x jump force and massive airtime, only one flip. The extra hangtime becomes about enjoying the height, not spinning endlessly.

### If a second flip is desired later
Add a `maxFlips` variable (default 1) that could be increased by a future power-up or unlockable. For now, hardcode to 1.

---

## Testing Checklist
- [ ] Safari iPhone: game canvas visible immediately on page load (no tap required)
- [ ] Safari iPhone: title screen renders with truck visible
- [ ] Safari iPhone: truck picker renders all 8 trucks without needing a tap
- [ ] Backflip: truck does exactly 1 full rotation then flies level
- [ ] Backflip: "BACKFLIP!" text and +50 points still award on flip completion
- [ ] Backflip: landing mid-flip still snaps upright (no punishment)
- [ ] Backflip: Super Jump only allows 1 flip despite extra airtime
- [ ] Backflip: new jump resets flip allowance
- [ ] No visual jittering or snap when flip completes and truck levels out
