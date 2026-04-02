# Fish Expansion Batch 3 — Epics & Legendaries Code Prompt

Read CLAUDE.md first. Then read the mockup file `fish-expansion-batch3-v4.html` in the repo root.

## Task

Add 9 new fish (5 Epic + 4 Legendary) to `games/catch-and-reel/index.html`. Follow the exact same pattern used for Batch 1 and Batch 2 fish.

## Fish to Add

### Epic (5)
1. **King Crab** — prefix `e0_` — Top-down red shell, golden crown with ruby jewels, crusher claw, 4 leg pairs
2. **Goliath Lobster** — prefix `e1_` — Side view crimson body, purple iridescent sheen, massive crusher claw, fan tail, antennae
3. **Tiger Prawn** — prefix `e2_` — Side view translucent pink, bold tiger stripes, serrated rostrum, fan tail
4. **Nautilus** — prefix `e3_` — Spiral chambered shell with brown stripe lines, cream aperture, trailing tentacles, pearlescent shimmer
5. **Starfish** — prefix `e4_` — Top-down symmetrical five-pointed star, orange-red, white tubercle bumps (clipped inside star body)

### Legendary (4)
6. **Lanternfish** — prefix `l0_` — Dark navy deep-sea body, two rows of teal bioluminescent photophores (SVG filter glow), massive glowing eye, adipose fin
7. **Primordial Carp** — prefix `l1_` — Emerald green body, golden scale arc patterns, long barbels with glowing gold tips, triangle rune markings, flowing fins
8. **Golden Idolfish** — prefix `l2_` — Pure metallic gold body, ornate zigzag crown dorsal with ruby jewels, engraved diamond scale pattern, ruby red eyes (both facing forward)
9. **Treasurefish** — prefix `l3_` — Gold body encrusted with rubies/emeralds/sapphires/diamonds, gem-studded dorsal and anal fins, gem-studded tail, sparkle highlights. NO crown (removed). Body-blending dorsal fin with gems.

## Critical Implementation Rules

1. **Copy SVGs exactly from `fish-expansion-batch3-v4.html`** — extract the inner `<svg>` content for each fish
2. **Add `width="160" height="100"` to every SVG root tag** before base64 encoding — prevents 0px render bug
3. **Keep ALL SVG filter effects** (`<filter>`, `feGaussianBlur`, `feColorMatrix`) — these are the glow/aura effects that make Epic and Legendary tiers visually distinct
4. **Gradient/clipPath IDs are already uniquified** with prefixes (e0_, e1_, e2_, e3_, e4_, l0_, l1_, l2_, l3_) — no conflicts
5. **Remove the Treasurefish tilted crown group** — the `<g transform="translate(52,30) rotate(-15, 14, 16)">` block with the crown path and gems. Keep the dorsal fin and all body/fin/tail gems.
6. **Trailing comma** — ensure there's a trailing comma on the last existing entry in `FISH_SVGS` before adding new ones
7. **FISH array entries** — add after the last Ultra Rare fish. Use these rarity values:
   - Epic: `rarity: 'epic'`
   - Legendary: `rarity: 'legendary'`

## FISH Array Entry Template

```javascript
{ name: 'King Crab', emoji: '🦀', rarity: 'epic', minW: 2.8, maxW: 12.5, minL: 25, maxL: 90 },
{ name: 'Goliath Lobster', emoji: '🦞', rarity: 'epic', minW: 3.5, maxW: 18.0, minL: 30, maxL: 120 },
{ name: 'Tiger Prawn', emoji: '🦐', rarity: 'epic', minW: 0.3, maxW: 1.2, minL: 15, maxL: 35 },
{ name: 'Nautilus', emoji: '🐚', rarity: 'epic', minW: 0.8, maxW: 2.5, minL: 15, maxL: 28 },
{ name: 'Starfish', emoji: '⭐', rarity: 'epic', minW: 0.4, maxW: 2.0, minL: 12, maxL: 40 },
{ name: 'Lanternfish', emoji: '🔦', rarity: 'legendary', minW: 0.02, maxW: 0.1, minL: 3, maxL: 8 },
{ name: 'Primordial Carp', emoji: '🐉', rarity: 'legendary', minW: 15.0, maxW: 45.0, minL: 80, maxL: 150 },
{ name: 'Golden Idolfish', emoji: '👑', rarity: 'legendary', minW: 2.0, maxW: 8.0, minL: 20, maxL: 50 },
{ name: 'Treasurefish', emoji: '💎', rarity: 'legendary', minW: 3.0, maxW: 12.0, minL: 25, maxL: 60 },
```

## Implementation Steps

1. Add trailing comma to last `FISH_SVGS` entry
2. Add all 9 SVG base64 data URIs to `FISH_SVGS` (key = fish name exactly as in FISH array)
3. Add all 9 FISH array entries after the last Ultra Rare
4. Run syntax check: `node -e "try { new (require('vm').Script)(require('fs').readFileSync('games/catch-and-reel/index.html','utf8')); console.log('SYNTAX OK'); } catch(e) { console.log('ERROR:', e.message); }"`
5. Commit in 2 batches:
   - Batch A: 5 Epics (King Crab, Goliath Lobster, Tiger Prawn, Nautilus, Starfish) — syntax check after
   - Batch B: 4 Legendaries (Lanternfish, Primordial Carp, Golden Idolfish, Treasurefish) — syntax check after

## Verification

After each batch commit:
- Syntax check passes (the HTML `<` token error is a false positive)
- All new fish appear in trophy room
- SVG renders at catch display size (160×100) and trophy room size (80×50)
- Glow/aura effects visible on dark background
- No gradient ID conflicts with existing fish
