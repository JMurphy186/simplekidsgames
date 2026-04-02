# Catch & Reel — Fishing Locations Architecture Spec

**Feature:** 5 unlockable fishing locations with unique backgrounds, atmospheres, and fish pool weighting.
**Flow:** Title → Character Select → Location Select → Fishing → (play again) → Character Select
**Unlock:** Lifetime total catches stored in localStorage. Freely revisitable once unlocked.

---

## Location Data

```javascript
const LOCATIONS = [
  {
    id: 'dock',
    name: 'Wooden Dock',
    desc: 'Calm waters under a starlit sky',
    unlock: 0,          // default, always available
    icon: '🌙',
    platform: 'dock',   // shared dock + lantern
    fishBoost: {}       // base rates, no modifications
  },
  {
    id: 'pier',
    name: 'Sunny Pier',
    desc: 'Bright coastal waters with seagulls overhead',
    unlock: 50,
    icon: '☀️',
    platform: 'dock',   // same dock, daytime colors
    fishBoost: { common: 1.15, uncommon: 1.10 }
  },
  {
    id: 'reef',
    name: 'Coral Reef',
    desc: 'Tropical sunset over shallow reef waters',
    unlock: 100,
    icon: '🌅',
    platform: 'dock',   // same dock, sunset tones
    fishBoost: { rare: 2.0, ultraRare: 1.5 }
  },
  {
    id: 'deepsea',
    name: 'Deep Sea',
    desc: 'Open ocean under storm clouds',
    unlock: 200,
    icon: '⛈️',
    platform: 'boat',   // fishing boat, no dock
    fishBoost: { epic: 2.0, legendary: 1.5 }
  },
  {
    id: 'volcano',
    name: 'Volcano Cove',
    desc: 'A hidden cove glowing with volcanic light',
    unlock: 300,
    icon: '🌋',
    platform: 'ledge',  // obsidian rock ledge, no dock
    fishBoost: { exotic: 3.0, legendary: 2.0, epic: 1.5 }
  }
];
```

---

## localStorage Keys

| Key | Type | Description |
|-----|------|-------------|
| `catchreel_total_catches` | number | Lifetime total fish caught (not junk). Incremented on every successful fish catch. Never resets. |
| `catchreel_location` | string | Last selected location ID. Defaults to 'dock'. |

**Important:** `catchreel_total_catches` must count ALL fish catches across all sessions. It is the unlock progression counter. Junk catches do NOT count.

---

## Location Select Screen

### When it appears
After character select, before gameplay begins. Every session.

### Layout
- Title: "CHOOSE YOUR SPOT" (or similar, in Luckiest Guy font)
- 5 location cards in a horizontal scrollable row (or 2-3 visible with arrows, same pattern as truck picker in Monster Rally)
- Each card shows:

**Unlocked card:**
- Location name
- Icon
- Brief description
- Sky gradient or scene preview as card background
- Tap to select → transition to fishing

**Locked card:**
- 🔒 icon (large, centered)
- Location name (dimmed)
- Unlock requirement text: "Catch 50 fish" / "Catch 100 fish" etc.
- Progress bar: current catches / threshold (e.g., "43 / 50")
- Progress bar fill color matches location accent
- Card is dimmed/desaturated, not tappable

### Selected state
- Last selected location (`catchreel_location`) is pre-highlighted on return
- Tapping an unlocked card selects it with a brief highlight animation
- "GO FISH!" button or tap-to-start at bottom

### Location accent colors (for progress bars, highlights, borders)
- Dock: #22C1C3 (teal)
- Sunny Pier: #f0c830 (gold)  
- Coral Reef: #ff8855 (warm orange)
- Deep Sea: #7ab0e0 (steel blue)
- Volcano Cove: #ff6030 (lava red)

---

## Background Rendering — Architecture

### Current structure (preserve this pattern)
```
drawSky()           → line 2088
drawStars()         → line 2098
drawShootingStars() → line 2118
drawMoon()          → line 2141
drawWater()         → line 2171
drawDock()          → line 2250
```

### New structure
Replace direct calls in the render loop with a location-aware dispatcher:

```javascript
function drawBackground() {
  switch (currentLocation) {
    case 'dock':    drawBg_dock(); break;
    case 'pier':    drawBg_pier(); break;
    case 'reef':    drawBg_reef(); break;
    case 'deepsea': drawBg_deepsea(); break;
    case 'volcano': drawBg_volcano(); break;
  }
}
```

Each `drawBg_*` function calls its own sky, atmosphere, water, and platform functions. The existing `drawSky()`, `drawStars()`, `drawShootingStars()`, `drawMoon()`, `drawWater()`, `drawDock()` become the `drawBg_dock()` implementation (with lantern enhancement).

### waterY stays at H * 0.58 for ALL locations
This is critical — the character, fishing rod, bobber, and all gameplay elements depend on this constant. Backgrounds render above and below waterY but never change it.

### Particle systems per location
Each location initializes its own particle set when selected. Particles live in a `bgParticles[]` array separate from gameplay particles.

| Location | Particles |
|----------|-----------|
| Dock | Stars (150), shooting stars (3), fireflies (8) |
| Sunny Pier | Clouds (6), seagulls (5), sun sparkles (40), floating debris (3) |
| Coral Reef | Clouds (4), tropical birds (3), underwater fish shadows (10), tropical fireflies (12) |
| Deep Sea | Rain (250), fog banks (5), sea spray (15), lightning system (1) |
| Volcano | Embers (80), smoke plumes (4), lava glow reflections (6), ash flakes (30) |

---

## Scene Details — What Each Location Draws

### Scene 0: Wooden Dock (Night) — ENHANCED VERSION OF CURRENT
**Keep everything that exists.** Add:
- Hanging lantern on tall post with curved iron bracket at end of dock
  - Swinging chain (subtle sinusoidal)
  - Glass panel housing with metal frame
  - Flickering flame (inner + outer)
  - Warm radial glow (80px radius, pulsing)
  - Light reflection on water below
- Fireflies drifting near dock area (warm glow pulses)
- Milky way band (very subtle, 2.5% opacity)
- Star cross-sparkle on brightest stars
- Moon crater detail
- Distant treeline silhouette at horizon
- Coiled rope on dock surface

### Scene 1: Sunny Pier (Day)
**Same dock structure, daytime wood colors** (#9a8868 / #b8a880)
- Sky: bright blue gradient with god rays from sun
- Sun with halo glow
- Puffy clouds (multi-lobe with bottom shadows)
- Seagulls with flapping wing animation and body dots
- Distant lighthouse with sweeping beam
- Green rolling hills on horizon
- Water: turquoise with sun sparkle particles
- Sun reflection column on water
- Gentle waves, floating debris
- Dock lantern present but dimmer (daytime, flame barely visible)

### Scene 2: Coral Reef (Sunset)
**Same dock structure, warm sunset tones** (#6a5030 / #8a6a48)
- Sky: dramatic sunset gradient (purple → crimson → orange → gold)
- Half-set sun with halo
- Warm-lit thin clouds
- 3 palm trees with trunk texture, swaying leaflet fronds
- Tropical birds (dark silhouettes)
- Water: warm turquoise with orange reflection from sun
- Coral formations underwater (pink, orange, purple, teal) with gentle sway
- Colorful fish shadows darting with tails
- Tropical sparkle fireflies
- Sun reflection column

### Scene 3: Deep Sea (Storm) — BOAT, NO DOCK
- Sky: dark stormy gradient
- Lightning system: random bolts with branching, scene flash
- Rolling fog banks
- NO dock. Instead: **fishing boat**
  - Hull with waterline stripe
  - Deck with plank lines
  - Cabin with two warm-glow windows
  - Mast with radar arms
  - Blinking red mast light
  - Railing with posts
  - Rocks on swells (sinusoidal Y + rotation)
  - Boat reflection on water
- Heavy rain (250 particles, angled with wind)
- Sea spray particles
- Dark choppy waves with white caps
- Water: very dark navy/black

### Scene 4: Volcano Cove (Dusk) — OBSIDIAN LEDGE, NO DOCK
- Sky: dark red-orange volcanic haze
- Volcano silhouette with texture lines
- Pulsing crater glow + wider halo
- Smoke plumes from crater
- Rock walls on both sides with **pulsing lava veins** (each on its own phase)
  - Outer glow + hot inner core line
- NO dock. Instead: **obsidian rock ledge**
  - Dark glassy surface with sharp facet edges
  - Obsidian highlight reflections
  - Pulsing lava vein along front edge with hot core
  - Small scattered rocks on surface
- Ember particles rising (80, with individual glow halos)
- Ash flakes falling
- Water: black with lava glow reflections
- Warm-tinted wave ripples

---

## Fish Pool Weighting

When a fish bite occurs, the rarity roll is modified by the current location's `fishBoost` multiplier. 

Implementation: After the base rarity is rolled, multiply that rarity's probability by the boost factor. Normalize if needed. This means Volcano Cove's 3× exotic rate makes exotics 3 times more likely to appear than at Wooden Dock.

Junk catch rate (8%) is NOT affected by location — it stays constant everywhere.

---

## Unlock Check Flow

When `catchreel_total_catches` is incremented after a successful fish catch:
1. Check if any new location threshold has been crossed
2. If yes: show a brief unlock notification during the catch display
   - "🔓 NEW LOCATION UNLOCKED!"
   - Location name + icon
   - This is a celebratory moment — make it feel good (gold text, maybe a brief animation)
3. The player continues fishing — they can visit the new location next time they return to location select

---

## What NOT to Change

- Character select screen: untouched
- Character themed rods: work at all locations
- Sound system: same sounds everywhere
- Fish SVGs: same art everywhere (pool weighting changes odds, not the fish themselves)
- HUD: same layout everywhere
- Trophy room: same everywhere (trophies are global, not per-location)
- Junk catches: same 8% everywhere
- Reel minigame: same mechanics everywhere
- Mute state: same everywhere
