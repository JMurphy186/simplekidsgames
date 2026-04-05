# Catch & Reel — CLAUDE.md

## What This Is
Fishing collection game for kids (ages 3-6). 6 characters, 5 locations, 77 fish + 5 paintings + 3 junk items. Part of Simple Kids Games at simplekidsgames.com.

**File:** `games/catch-and-reel/index.html` (~3,695 lines, 7.2 MB)
**Live:** simplekidsgames.com/games/catch-and-reel/
**Deploy:** Vercel auto-deploy from GitHub `main` branch. No build step.

## Architecture
- Single HTML file, embedded JS + CSS
- HTML5 Canvas (2D context) for gameplay rendering
- DOM overlays for character/location select, trophy room, catch display
- 10 base64-encoded WAV/MP3 audio clips (~1.85MB)
- Google Fonts: Luckiest Guy (headings), Baloo 2 (body) via `@import`
- 77 SVG fish as base64 data URIs in `FISH_SVGS` object
- 5 Sunken Treasure paintings as base64 PNG in `PAINTING_IMAGES`
- 6 full-body SVG characters as base64 data URIs
- Painted sunset dock background on fisher picker (CSS multi-layer)
- Touch + keyboard input, adapts to portrait and landscape (no rotate overlay)

## Game Flow (State Machine)
1. **CHAR_SELECT** — 2×3 character grid with name + accent glow. MENU (top-left) + TROPHIES (top-right). Tap character → teal CAST button (🎣) appears → tap CAST to proceed.
2. **LOCATION_SELECT** — Unlocked locations selectable, locked ones dimmed. First play or Change Level.
3. **IDLE** — Character on dock/boat/ledge, themed rod out, waiting. Tap to cast.
4. **CAST** — Bobber flies out, splash SFX.
5. **WAIT** — Bobber floating, ambient fish silhouettes. Random bite timer. 0.75% Sunken Treasure shimmer check per cast.
6. **BITE** — Bobber dips! Tap to hook.
7. **REEL** — Tap-to-push tension bar minigame. Green zone at right end.
8. **CAUGHT** — Catch display: fish SVG, name, rarity, weight/length, trophy tracking.
9. **FAIL** — Line snapped or missed bite.

**Change Fisher:** Pause → Change Fisher → character picker → returns to SAME location.
**Change Level:** Pause → Change Level → location picker → 3-2-1 countdown → new location.

## UI Layout (Current — Post Session 9 Polish)
- **Title:** Gold CATCH + Sea Green & REEL (#20E5B5), Luckiest Guy font. Wave divider (dual teal gradient lines).
- **CAST button:** Teal gradient, "🎣 CAST", Luckiest Guy font. Appears after selecting a fisher.
- **Fisher cards:** Selected card pulses with accent color (CSS animation)
- **Dock platform:** Wood-toned gradient bar below character grid
- **Pagination dots:** Teal (#22C1C3) active with glow
- **Corner buttons:** Glass MENU + TROPHIES matching cross-game pattern
- **Trophy room:** strokeText outlines, reduced glow for crispness

## Characters (6 SVG Full-Body)

| Character | Rod Theme | Accent | Name Glow |
|-----------|----------|--------|-----------|
| Captain Hook Jr. (Pirate) | Driftwood + rusty reel | Gold | Gold |
| Robo-Fisher 3000 (Robot) | Chrome segmented + LEDs | Teal | Teal |
| Merlin the Caster (Wizard) | Purple staff + glowing orb (straight, no arc) | Purple | Purple |
| Shadow Ninja | Matte black bamboo + red cord | Red | Red |
| Princess Pearl | Pink crystal + ribbon | Pink | Pink |
| Zork the Angler (Alien) | Green plasma + energy field | Green | Green |

Per-character rod anchors in `CHAR_ROD_ANCHORS`. Rod styles in `CHAR_ROD_STYLES`. Rod rendering via `drawThemedRod()`. Rod stays Canvas-rendered with fishing line tracking rod tip. Wizard staff stays straight (rod arc experiments reverted — straight looks cleaner).

## Locations (5)

| Location | Unlock | Key Visuals |
|----------|--------|------------|
| Wooden Dock | Default | Night sky, lighthouse silhouette with sweeping beam, lantern, enhanced dock |
| Sunny Pier | 5 catches | Daytime, lighthouse on hilltop, palm trees with sway |
| Coral Reef | 15 catches | Underwater reef, upgraded coral detail, palm sway |
| Deep Sea | 30 catches | Dark ocean, oversized boat with rocking, red/green nav lights, scaled cabin |
| Volcano Cove | 50 catches | Volcanic setting, obsidian ledge, lava glow |

Auto-navigate to newly unlocked location after unlock celebration dismiss. HUD progress bar shows next unlock threshold with location icon + accent color.

## Fish Roster (77 + 5 paintings + 3 junk)

| Tier | Count | ID Prefix | Notes |
|------|-------|-----------|-------|
| Common | ~20 | `c0_`–`c9_` + originals | Batch 1 |
| Uncommon | ~20 | `u0_`–`u10_` + originals | Batch 1 |
| Rare | 10 | `r0_`–`r9_` | Batch 2A/2B |
| Ultra Rare | 8 | `ur0_`–`ur7_` (incl. Spotted Ray `sr_`, Pearl Clam `pc_`) | Batch 2 + replacements |
| Epic | 5 | `e0_`–`e4_` | Batch 3 (King Crab, Goliath Lobster, Tiger Prawn, Nautilus, Starfish) |
| Legendary | 6 | `l0_`–`l3_`, `lx0_`–`lx1_` | Batch 3 + Batch 4A location exclusives |
| Exotic | 6 | originals + `ex0_`–`ex2_` | Batch 4B location exclusives |
| Junk | 3 | `jb_`, `js_`, `jc_` | Boot, Seaweed, Tin Can (8% chance) |

### Location-Exclusive Fish
Fish with a `location` field in the FISH array. `pickFish()` filters these if player isn't at matching location.

| Fish | Location | Rarity |
|------|----------|--------|
| Dock Cat | Wooden Dock | Legendary |
| Sunbeam Dolphin | Sunny Pier | Legendary |
| Reef Guardian | Coral Reef | Exotic |
| Storm Leviathan | Deep Sea | Exotic |
| Magma Serpent | Volcano Cove | Exotic |

### Recent Fish Replacements (Session 9)
- **Spotted Ray** replaced Stingray (Ultra Rare): teal rounded body, white polka dots, big cute eyes, wing fins, whip tail with barb. All IDs `sr_` prefix.
- **Pearl Clam** replaced Thornback Ray (Ultra Rare): barely-cracked teal clam, fan ridges, scalloped edges, golden inner glow, pearl peeking through. All IDs `pc_` prefix.

## SVG Art Rules (CRITICAL — Follow for ALL Fish)
1. **Fins drawn BEFORE body** — body layer covers fin base naturally
2. **Dorsal/anal fin endpoints pinned to body ellipse** — compute ellipse edge at fin x-positions
3. **Sail-shaped fins** need smooth single-arc paths, NOT wavy multi-peak zigzags
4. **Filled path silhouettes** for organic shapes (seahorse body)
5. **Gradient/clipPath IDs uniquified** per fish with species-prefix
6. **`width="160" height="100"`** on every SVG root tag — browser renders 0px without them
7. **Trailing comma** on last FISH_SVGS entry before adding new ones
8. **Epic + Legendary** use SVG filter effects (feGaussianBlur, feColorMatrix) for glow
9. **"Barely cracked open" designs** work better at small sizes (Pearl Clam lesson)

## Sunken Treasures — Paintings System
- 0.75% chance per cast, rolled before fish selection
- Only triggers if current location's painting hasn't been found
- Gold shimmer particles + magical chime on discovery
- No reel minigame — auto-catch straight to catch card
- One-time discovery per location, saved to `catchreel_paintings`
- 5 paintings (1 per location), base64 PNG data URIs
- Trophy room: Sunken Treasures section above Exotic tier

## Reel Minigame Difficulty

| Rarity | Green Zone | Drift Rate | Tap Push |
|--------|-----------|------------|----------|
| Common | 65% | 0.12 | 0.08 |
| Uncommon | 55% | 0.13 | 0.08 |
| Rare | 48% | 0.14 | 0.09 |
| Ultra Rare | 42% | 0.15 | 0.09 |
| Epic | 38% | 0.16 | 0.10 |
| Legendary | 34% | 0.17 | 0.10 |
| Exotic | 30% | 0.18 | 0.10 |

Start position: 0.5 (center). One set of values for all devices (no mobile/desktop split).

## Trophy Room
- Fish organized by rarity tier (Exotic on top, Common at bottom)
- Bold colored header per tier
- Caught: SVG thumbnail, name, rarity label, weight/length, rarity-colored border
- Uncaught: dimmed "???" cards with fish name visible (collection goals)
- "X / 77 species discovered" counter
- Sunken Treasures section above Exotic with 5 painting slots
- 2-column grid, scrollable on mobile
- Accessible from gameplay, pause menu, character select

## Pause Menu (6 buttons)
1. ▶ RESUME (green)
2. 🔊 SOUND: ON/OFF (gray)
3. 🏆 TROPHIES (gold)
4. 🗺️ CHANGE LEVEL (orange #E67E22→#D35400)
5. 🎣 CHANGE FISHER (blue/purple)
6. 🏠 MENU (dark)

## Sound System (10 Audio Clips)
Base64 WAV data URIs (~1.85MB total). HTML Audio elements (NOT Web Audio buffers — different from Space Dodge).

| Key | Trigger |
|-----|---------|
| cast | Line cast |
| splash | Line hits water |
| bite | Fish bites |
| reelClick | Reeling in |
| reelDrag | Drag tension (ambient during reel) |
| catchCommon | Common/Uncommon catch |
| catchRare | Rare/Ultra Rare catch |
| catchExotic | Epic/Legendary/Exotic catch |
| lineSnap | Line breaks |
| newRecord | New best fish |

`initSounds()` on first cast. `playS(key)` triggers playback. Mute persisted to `catchreel_mute`.

## Key Data Structures
| Name | Type | Purpose |
|------|------|---------|
| `FISH_SVGS` | Object | Fish name → base64 SVG data URI |
| `FISH` | Array | Fish objects: name, emoji, rarity, wMin/wMax, lMin/lMax, location? |
| `FISH_IMAGES` | Object | Preloaded Image objects from FISH_SVGS |
| `PAINTING_IMAGES` | Object | Base64 PNG data URIs for 5 paintings |
| `PAINTINGS` | Array | Painting objects: name, location, locationName, color |
| `CHAR_ROD_STYLES` | Object | Per-character rod visual definitions |
| `CHAR_ROD_ANCHORS` | Object | Per-character rod attachment coordinates |
| `LOCATIONS` | Array | Location configs: id, name, unlock threshold, fishBoost |

## localStorage Keys
| Key | Purpose |
|-----|---------|
| `catchreel_trophies` | JSON: best catch per species |
| `catchreel_total_catches` | Lifetime fish count (drives location unlocks) |
| `catchreel_location` | Last selected location ID |
| `catchreel_shown_unlocks` | JSON: shown unlock notification IDs |
| `catchreel_paintings` | JSON: discovered paintings |
| `catchreel_mute` | Mute state ("1" = muted) |
| `catchReelChar` | Selected character index |
| `gf_bestFish` | Best fish JSON |
| `gf_fishCount` | Total fish count |

## Do NOT
- Show drop rates to players — trophy room shows only "X / 77 species"
- Add rod curve (experiments failed, straight rods look clean)
- Split reel difficulty by device — one set of values for everyone
- Add audio via Web Audio API — C&R uses HTML Audio elements (different from Space Dodge)
- Use external asset files
- Add build tools
- Break the two-step character select flow (tap fisher → CAST button → tap CAST)

## Queued Work
- Batch 5: Bass/Trout variants + location exclusivity wiring
- Sunken Treasures expansion (shells, treasure chests)
- Fish Tank Trophy Room aquarium redesign (fish swimming in tank)
- Favicon redesign (match gold/sea-green brand)

## Testing Checklist
- [ ] 6 characters render in picker with accent glow
- [ ] CAST button appears after selecting character
- [ ] 5 locations render with correct backgrounds
- [ ] Location unlock at 5/15/30/50 catches with celebration
- [ ] Reel minigame scales difficulty by rarity
- [ ] All 77 fish render in catch display (correct SVG, no 0px)
- [ ] Sunken Treasures trigger at ~0.75% with gold shimmer
- [ ] Trophy room: rarity tiers, scrollable, paintings section
- [ ] Junk catches (boot/seaweed/can) dismiss on player input
- [ ] Sound plays on cast, splash, bite, catch, snap
- [ ] Spotted Ray + Pearl Clam render correctly (unique gradient IDs)
- [ ] Change Fisher returns to same location
- [ ] Change Level shows 3-2-1 countdown
- [ ] Pause menu: all 6 buttons functional
- [ ] Title: gold CATCH + sea green REEL with wave divider
- [ ] iOS touch works on character select and location select
