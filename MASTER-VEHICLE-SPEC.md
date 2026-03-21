# Monster Rally — Master Vehicle Drawing Spec

**This replaces the vehicle drawing section in VEHICLE-ART-REFINEMENT.md.**

**CRITICAL: Look at `/reference/flame-crusher-target.png` before writing ANY code.** That image is the quality target. Every playable truck should match that level of detail and proportion. Study it carefully.

---

## What the Reference Image Shows (Flame Crusher Target)

Analyze the reference image (`/reference/flame-crusher-target.png`) closely. Here is what it contains — every one of these elements must be reproduced in Canvas:

### Overall Proportions
- The truck is roughly **2x as wide as it is tall** (excluding wheels)
- The **wheels are almost as tall as the body** — this is the defining monster truck look
- The body sits HIGH above the ground with significant clearance
- The truck has a **front-heavy, aggressive stance** — it looks like it's leaning forward slightly

### Body Shape — The Stepped Silhouette
The body is NOT a rectangle. It has **three distinct height zones** when viewed from the side:

```
Profile (side view, left = front, right = rear):

        ┌─────────────┐
        │             │  ← CAB (tallest, ~40% of width)
   ┌────┤             ├────────┐
   │    │             │        │  ← BED (behind cab, ~70% of cab height)
   │HOOD│   WINDOW    │  BED   │
   │    │             │        │
   └────┴─────────────┴────────┘
```

**Key proportions (for a ~90px wide truck at game scale):**
- **Hood:** Front 25% of the body. Lower than cab by ~30%. Slopes very slightly upward toward the cab. Has a horizontal crease/seam line across the middle.
- **Cab:** Middle 40% of the body. The TALLEST section. Nearly vertical front edge where it meets the hood (slight angle). Roof is flat or very slightly curved. Rear edge drops straight down to meet the bed.
- **Bed:** Rear 35% of the body. Lower than cab by ~30% (similar height to hood). Flat top. Squared-off rear end with a small tailgate detail.

**The transitions between sections are NOT rounded curves** — they're angular steps with just a tiny radius (2-3px) to soften. The truck should look chunky and aggressive, not smooth and bubbly.

### Body Color & Shading
The body has **3 color zones** (not a flat fill):
1. **Main body** (top 60%): Primary color (e.g., `#ff6600` for Flame Crusher)
2. **Lower panel / rocker panel** (bottom 25%): Slightly darker shade, separated by a subtle horizontal line. This is where the flame decal sits.
3. **Underside shadow**: Darkest shade along the very bottom edge of the body (2-3px strip)

### Window
- **One large window** filling most of the cab section
- **Light blue tint** (`#7ec8e3` or similar — slightly more teal/green than pure sky blue)
- **Angled slightly** — the front edge of the window tilts back from vertical by ~5-8°. This angle gives the cab a sporty/aggressive look. It's NOT perfectly vertical.
- **White reflection highlight**: A diagonal white rectangle/parallelogram in the upper portion of the window (`rgba(255,255,255,0.5)`). About 30% of the window width, positioned in the upper-left area.
- **Window border**: The body color frames the window on all sides (~3px margin from cab edges to window)

### Chrome Grille
- At the **front face** of the truck (the vertical surface of the hood)
- **3-4 vertical chrome bars** (`#c0c0c0` or `#d0d0d0`) evenly spaced
- Small dark gaps between the bars
- Full height of the hood section
- **Headlights**: 2 small bright rectangles (white or yellow, `#ffffcc`) integrated into or just beside the grille, one near the top and one near the bottom

### Front Bumper
- **Chrome/silver bar** (`#aaaaaa`) extending slightly forward and below the body
- Wider than the grille (extends 2-3px beyond body on each side)
- About 6-8px tall
- Slightly darker underside

### Flame Decal (Specific to Flame Crusher)
- **Jagged flame shapes** running along the LOWER PANEL of the body
- Start at the front bumper area, extend backward to about the middle of the cab
- **Yellow** (`#ffcc00`) flames on the **orange** lower panel — high contrast
- The flames are pointed triangles of varying heights (tallest near the front, getting shorter toward the back)
- About **6-8 flame tongues**, each is a triangle pointing toward the rear
- The tallest flame reaches about 60% of the body height, the shortest about 20%

### Wheels — The Most Important Element
The wheels MAKE the monster truck. Get these right and the whole truck looks right.

**Size:** Each wheel should be visually massive — nearly as tall as the body height above ground. At game scale (~90px wide truck), each wheel is about **18-22px radius**.

**Tire construction (draw from outside in):**
1. **Outer tire** — near-black (`#1a1a1a`), full circle
2. **Tread blocks** — the reference shows **chunky, angled tread blocks** around the circumference, not just radial lines. Draw 8-10 small trapezoid/rectangle shapes around the tire edge, each rotated to follow the circumference. Color: slightly lighter (`#333`). These rotate with `wheelAngle`. Alternatively, radial lines work if treads are too complex — but make them THICK (3px).
3. **Sidewall** — a ring between the tread and rim, very slightly lighter than the tire (`#2a2a2a`). About 20% of the tire width.
4. **Rim** — silver/chrome circle (`#c8c8c8`), about 45% of total wheel radius. Add a subtle darker edge ring.
5. **Spokes** — 5 thin dark lines radiating from center to rim edge, evenly spaced. These rotate with `wheelAngle`.
6. **Hub cap** — small center circle, truck's accent color or chrome, about 15% of radius.

**Wheel position:**
- Wheels sit directly below the body, roughly aligned with the front and rear of the body
- There's visible **axle area** between the bottom of the body and the top of the wheels — this gap is what makes it a monster truck. The gap should be at least 8-12px at game scale.
- The tops of the wheels should NOT be hidden behind the body — they should be mostly visible

### Fender Arches
- Small curved arcs drawn above each wheel, following the wheel's circumference
- Same color as the body
- These suggest wheel wells / fender flares
- They're subtle but they connect the body to the wheels visually

### Exhaust Flames
- Shoot from the **rear of the truck** when airborne
- Orange-yellow gradient, flickering (randomize slightly per frame)
- 2-3 overlapping flame shapes: a larger one underneath and smaller ones on top
- Point BACKWARD (to the left, since the truck faces right)

### Ground Shadow
- Dark ellipse on the ground plane beneath the truck
- Gets smaller/fainter as the truck jumps higher
- Wider than the truck body (extends ~10px past each side)

---

## Applying This Pattern to ALL 8 Trucks

The Flame Crusher target image defines the QUALITY BAR. All 8 trucks should have the same level of shape detail, even though they differ in color and decals.

### Classic Trucks (14px wheels, lower body)
Use the SAME stepped-silhouette body shape and detail level as described above, but:
- Wheels are 14px radius (smaller, normal truck)
- Body sits lower (less ground clearance)
- No V-arm suspension visible
- Fender arches are smaller

| Truck | Body Color | Dark Shade | Accent | Decal |
|-------|-----------|-----------|--------|-------|
| Flame Crusher | `#ff6600` | `#cc4400` | `#ffcc00` | Yellow flame triangles on lower panel |
| Blue Thunder | `#2255ff` | `#1133cc` | `#00ccff` | 2 lightning bolt zigzags (cyan) on door/bed |
| Green Machine | `#22cc44` | `#119933` | `#88ff00` | 2 diagonal racing stripes (lime) across body |
| Purple Nightmare | `#8833cc` | `#6622aa` | `#ff44ff` | 3 star shapes (magenta) on door and bed |

### Monster Trucks (20px wheels, high body, V-arm suspension)
Same body shape quality, but:
- Wheels are 20px radius (massive)
- Body sits much higher (12-15px ground clearance)
- V-arm suspension lines visible connecting body to wheel axles
- Fender arches are larger and more prominent
- Overall feels lifted and aggressive

| Truck | Body Color | Dark Shade | Accent | Decal |
|-------|-----------|-----------|--------|-------|
| Grave Stomper | `#1a1a1a` | `#0a0a0a` | `#44ff44` | Green skull on door (circle+triangle+dots) |
| Red Rampage | `#cc1100` | `#990d00` | `#ff4444` | 3 diagonal claw scratch lines (light red) |
| Thunder Bull | `#1144aa` | `#0d3388` | `#ffcc00` | Horn shapes on hood + yellow center stripe |
| Toxic Crusher | `#338833` | `#226622` | `#00ff88` | Black + green diagonal hazard stripes |

---

## Crushable Vehicles — Same Quality Bar, Civilian Proportions

These are SMALLER and sit LOW to the ground. They should look squashable.

### Pickups (Red Racer, Cool Blue, Gold Rush)
Same stepped silhouette pattern (hood-cab-bed) but:
- Total width: ~55px, height: ~28px
- Small wheels: 5-6px radius
- Single window, small grille, basic headlights/taillights
- NO decals — plain civilian trucks
- They should look like something a monster truck would LOVE to crush

### Big SUV
- Width: ~65px, height: ~35px
- Boxier — cab extends almost full length, barely any hood step
- 2 windows with pillar between them
- Roof rack (thin rectangle on top)
- Dark gray-blue, menacing but still smaller than monster trucks

### School Bus
- Width: ~100px, height: ~40px
- Distinctive flat front, long body
- Row of 4-5 windows
- "SCHOOL BUS" text (tiny but readable)
- Yellow with black trim

### Stretch Limo
- Width: ~110px, height: ~30px
- Absurdly long and low
- Tinted (dark) windows, chrome trim stripe, 3 visible wheels
- White/silver — the luxury target
- Most satisfying to crush

---

## Prompt for Claude Code

Drop this file and the reference images into the project, then tell Code:

> Read CLAUDE.md and MASTER-VEHICLE-SPEC.md. Study the reference image at /reference/flame-crusher-target.png — that is the exact quality target. Redraw ALL vehicle drawing functions to match this level of detail. Use beginPath()/lineTo() for stepped body silhouettes, NOT roundRect. This is a visual-only change — do not modify collision boxes, physics, or game logic.

