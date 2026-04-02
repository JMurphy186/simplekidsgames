# Fish Expansion Batch 4 — Location Exclusives + Shimmer Fix

Read CLAUDE.md first. Then read the mockup file `fish-expansion-batch4-v2.html` in the repo root.

## Task

Two things:

1. **Fix:** Remove "0.75% shimmer per cast" from the Sunken Treasures trophy room subheader. It should just say "X / 5 paintings discovered" — no drop rate shown.

2. **Add 5 location-exclusive fish** to `games/catch-and-reel/index.html`. These fish ONLY appear at their assigned location.

## Fish to Add

### Legendary (2)
1. **Dock Cat** — prefix `lx0_` — Orange tabby catfish, whisker barbels, sail dorsal, adipose fin, smooth scaleless body, tabby stripes. **Location: Wooden Dock only.**
2. **Sunbeam Dolphin** — prefix `lx1_` — Sleek blue-silver dolphin, triangle dorsal, horizontal tail flukes, golden sunbeam shimmer streaks, rostrum beak. **Location: Sunny Pier only.**

### Exotic (3)
3. **Reef Guardian** — prefix `ex0_` — Teal body, red lionfish fan spines with translucent webbing, bioluminescent teal spots, armored scales. **Location: Coral Reef only.**
4. **Storm Leviathan** — prefix `ex1_` — Dark serpentine body, purple aura, lightning vein patterns, electric nodes, jagged dorsal ridge, horn. **Location: Deep Sea only.**
5. **Magma Serpent** — prefix `ex2_` — Obsidian body, glowing lava crack network, molten hotspot nodes, volcanic dorsal spines, smoke wisps. **Location: Volcano Cove only.**

## Location Exclusivity

This is the key new mechanic. Each of these 5 fish should ONLY be catchable at their specific location.

### Implementation approach

Add a `location` field to the FISH array entry for these 5 fish:

```javascript
{ name: 'Dock Cat', emoji: '🐱', rarity: 'LEGENDARY', wMin: 8.0, wMax: 25.0, lMin: 50, lMax: 100, location: 'Wooden Dock' },
{ name: 'Sunbeam Dolphin', emoji: '🐬', rarity: 'LEGENDARY', wMin: 80.0, wMax: 250.0, lMin: 150, lMax: 300, location: 'Sunny Pier' },
{ name: 'Reef Guardian', emoji: '🦁', rarity: 'EXOTIC', wMin: 5.0, wMax: 20.0, lMin: 30, lMax: 80, location: 'Coral Reef' },
{ name: 'Storm Leviathan', emoji: '⚡', rarity: 'EXOTIC', wMin: 200.0, wMax: 800.0, lMin: 300, lMax: 600, location: 'Deep Sea' },
{ name: 'Magma Serpent', emoji: '🌋', rarity: 'EXOTIC', wMin: 50.0, wMax: 200.0, lMin: 100, lMax: 300, location: 'Volcano Cove' },
```

Then modify the fish selection logic: when picking a random fish for a catch, **filter out** any fish that have a `location` field that doesn't match the current location. Fish without a `location` field (all existing fish) are available everywhere as before.

**Pseudocode:**
```javascript
// When selecting a fish to catch:
const currentLocation = /* however the current level/location is tracked */;
const availableFish = FISH.filter(f => !f.location || f.location === currentLocation);
// Then pick from availableFish using existing rarity/random logic
```

Find where the fish is randomly selected after a successful reel and add this filter there. Do NOT change the rarity weights — just filter the pool before selection.

## Critical Implementation Rules

1. **Copy SVGs exactly from `fish-expansion-batch4-v2.html`**
2. **Add `width="160" height="100"` to every SVG root tag** before base64 encoding
3. **Keep ALL SVG filter effects** (`<filter>`, `feGaussianBlur`, `feColorMatrix`)
4. **Gradient/clipPath IDs are already uniquified** (lx0_, lx1_, ex0_, ex1_, ex2_)
5. **Trailing comma** on last existing `FISH_SVGS` entry
6. **Match existing code patterns** for field names (wMin/wMax/lMin/lMax, uppercase rarity)
7. **Location names must exactly match** the location identifiers used in the game's level/location system — check the existing code for the exact strings

## Trophy Room

These fish should appear in their normal rarity sections (Legendary / Exotic) alongside the other fish of that tier. The trophy room does NOT need to show location info — players will discover the location exclusivity naturally.

## Implementation Steps

1. Fix shimmer text in trophy room (remove "0.75% shimmer per cast")
2. Add trailing comma to last `FISH_SVGS` entry
3. Add 5 SVG base64 data URIs to `FISH_SVGS`
4. Add 5 FISH array entries with `location` field
5. Add location filter to fish selection logic
6. Syntax check
7. Commit in 2 batches:
   - Batch A: Shimmer fix + 2 Legendaries (Dock Cat, Sunbeam Dolphin) + location filter logic
   - Batch B: 3 Exotics (Reef Guardian, Storm Leviathan, Magma Serpent)
   - Syntax check after each

## Verification

- Shimmer trophy room text shows only "X / 5 paintings discovered"
- All 5 new fish appear in trophy room under correct rarity tier
- Location filter works: fishing at Wooden Dock can catch Dock Cat but NOT Sunbeam Dolphin, etc.
- All existing non-location fish still appear at all locations
- SVGs render correctly at catch display (160×100) and trophy (80×50) sizes
- Glow/aura effects visible
