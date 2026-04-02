# CLAUDE.md Update — Catch & Reel Section

**Read the current CLAUDE.md first**, then replace the Catch & Reel section with the content below. Keep all other sections (Monster Rally, Space Dodge, Landing Page, architecture rules, etc.) unchanged.

---

## Replace the entire Catch & Reel section with:

### Catch & Reel (`games/catch-and-reel/index.html`)

**Single HTML file (~7.4MB). No external assets. All SVGs and PNGs are base64 data URIs embedded in the file.**

#### Game Overview
Kids fishing game with 6 themed characters, 5 locations, 77 catchable fish across 7 rarity tiers, 5 Sunken Treasure paintings, 3 junk items, reel minigame, trophy room, and sound system.

#### Characters (6)
| Character | Rod Theme | Key Visual |
|-----------|-----------|-----------|
| Captain Hook Jr. (Pirate) | Driftwood + rusty reel | Gold name glow |
| Robo-Fisher 3000 (Robot) | Chrome segmented + LEDs | Teal name glow |
| Merlin the Caster (Wizard) | Purple staff + glowing orb | Purple name glow |
| Shadow Ninja | Matte black bamboo + red cord | Red name glow |
| Princess Pearl | Pink crystal + ribbon | Pink name glow |
| Zork the Angler (Alien) | Green plasma + energy field | Green name glow |

Per-character rod anchor points in `CHAR_ROD_ANCHORS`. Rod styles in `CHAR_ROD_STYLES`. Rod rendering: `drawThemedRod()` with helpers `drawRodGrip()`, `drawRodReel()`, `drawShaftDetails()`, `drawTipFeature()`, `drawLineEffects()`.

#### Locations (5)
| Location | Unlock | Visual |
|----------|--------|--------|
| Wooden Dock | Start | Night sky, lighthouse silhouette with sweeping beam |
| Sunny Pier | 5 fish | Daytime, lighthouse on hilltop |
| Coral Reef | 15 fish | Underwater reef backdrop |
| Deep Sea | 30 fish | Dark ocean, oversized boat with red/green nav lights |
| Volcano Cove | 50 fish | Volcanic setting |

Auto-navigation to newly unlocked locations on unlock celebration dismiss. HUD progress bar shows next unlock threshold with location icon + accent color.

#### Fish Roster (77 total)
| Tier | Count | Gradient Prefix Range |
|------|-------|-----------------------|
| Common | ~20 | `c0_` – `c9_` (originals: `f0_`+) |
| Uncommon | ~20 | `u0_` – `u10_` (originals: `f0_`+) |
| Rare | 10 | `r0_` – `r9_` |
| Ultra Rare | 8 | `ur0_` – `ur7_` |
| Epic | 5 | `e0_` – `e4_` |
| Legendary | 6 | `l0_` – `l3_`, `lx0_` – `lx1_` |
| Exotic | 6 | originals + `ex0_` – `ex2_` |

**Location-exclusive fish** (5 total) have a `location` field in the FISH array. `pickFish()` filters these out if the player isn't at the matching location. Fish without a `location` field are available everywhere.

| Fish | Location | Rarity |
|------|----------|--------|
| Dock Cat | Wooden Dock | Legendary |
| Sunbeam Dolphin | Sunny Pier | Legendary |
| Reef Guardian | Coral Reef | Exotic |
| Storm Leviathan | Deep Sea | Exotic |
| Magma Serpent | Volcano Cove | Exotic |

Plus 3 junk items (Old Boot SVG preserved, Tin Can, Seaweed).

#### SVG Art Principles (FOLLOW FOR ALL FISH)
1. **Layer order:** Dorsal/anal fins drawn FIRST → body ON TOP → body hides fin bases naturally
2. **Patterns clipped:** All stripes, spots, markings use `<clipPath>` bounded to body shape
3. **Gradient IDs uniquified** per fish (prefix per tier) to prevent SVG conflicts in base64
4. **Species-accurate details:** ear flaps, barbels, adipose fins, egg spots, thread feelers — research each fish
5. **`width="160" height="100"`** must be on every SVG root tag — browser can't determine intrinsic size without them
6. **Epic + Legendary tiers** use SVG filter effects (`feGaussianBlur`, `feColorMatrix`, `feMerge`) for aura/glow
7. **Pufferfish spines:** 2.5px stroke width for small-size visibility

#### Sunken Treasures — Paintings System
- 0.75% chance per cast, rolled before fish selection
- Only triggers if current location's painting hasn't been found yet
- Gold shimmer particles rise from bobber + magical chime
- No reel minigame — auto-catch straight to catch card
- One-time discovery per location, saved to `catchreel_paintings` localStorage
- 5 paintings (1 per location), embedded as base64 PNG data URIs
- Catch card: gold-themed `✧ SUNKEN TREASURE ✧` with ornate SVG frame
- Trophy room: Sunken Treasures section above Exotic tier, 5 painting slots
- **Do NOT show drop rates to players** — trophy room shows only "X / 5 paintings discovered"

#### Reel Minigame Difficulty (Linear Progression)
| Rarity | Green Zone | Drift Rate | Tap Push |
|--------|-----------|------------|----------|
| Common | 65% | 0.12 | 0.08 |
| Uncommon | 55% | 0.13 | 0.08 |
| Rare | 48% | 0.14 | 0.09 |
| Ultra Rare | 42% | 0.15 | 0.09 |
| Epic | 38% | 0.16 | 0.10 |
| Legendary | 34% | 0.17 | 0.10 |
| Exotic | 30% | 0.18 | 0.10 |

Start position: 0.5 (center) for all tiers. One set of values for all devices.

#### Trophy Room
- Fish organized by rarity tier, rarest (Exotic) on top, Common at bottom
- Each tier has bold colored header
- Caught fish: SVG thumbnail, name, rarity label, weight/length stats, rarity-colored border
- Uncaught fish: dimmed "???" cards with fish name visible
- "X / 77 species discovered" counter at top (was 24, now 77)
- Sunken Treasures section above Exotic tier with 5 painting slots
- 2-column grid, scrollable on mobile

#### Pause Menu
Buttons in order:
1. ▶ RESUME (green)
2. 🔊 SOUND: ON/OFF (gray)
3. 🏆 TROPHIES (gold)
4. 🗺️ CHANGE LEVEL (orange — `#E67E22` to `#D35400`)
5. 🎣 CHANGE FISHER (blue/purple)
6. 🏠 MENU (dark)

**Change Level flow:** Tap → location picker overlay → pick location → 3-2-1 countdown on Canvas (orange text, scale pulse, "Loading [Name]...") → game resumes at new location. Background re-renders, fish pool re-filters, HUD updates. Stats carry over (no reset). Same-location pick = no-op, returns to pause menu.

#### Sound System
- 10 base64 WAV audio clips (~1.85MB)
- Sounds: cast, splash, bite alert, reel click, reel drag, catch common, catch rare, catch exotic, line snap, new record
- Rarity-scaled catch fanfares
- `playS(key)` function, `initSounds()` on first cast
- Mute button with localStorage persistence (`catchreel_mute`)

#### Key Constants & Data Structures
- `FISH_SVGS` — object mapping fish names to base64 SVG strings
- `FISH` — array of fish objects with name, rarity, emoji, weight/length ranges, optional `location` field
- `FISH_IMAGES` — preloaded Image objects (built from FISH_SVGS on load)
- `CHAR_ROD_STYLES` — per-character rod visual definitions
- `CHAR_ROD_ANCHORS` — per-character rod attachment coordinates
- `catchreel_paintings` — localStorage key for discovered paintings

#### Known Issues / Parked Items
- Rod reel size on mobile (parked — multiple attempts, still looks large)
- Stingray SVG flagged as not looking like a stingray — revisit/redesign or swap Ultra Rare later
- Rod curve deferred (straight rods look clean)
- Batch 5 Bass/Trout variants (optional, not blocking)

---

## Also update these global rules if not already present:

### Implementation Patterns
- **Trailing comma check:** Always verify trailing comma on last entry in `FISH_SVGS` before adding new fish — a missing comma causes silent JS syntax error that kills all `onclick` handlers while HTML links still work
- **SVG root dimensions:** Every SVG must have `width="160" height="100"` attributes before base64 encoding — without them, browser renders at 0px
- **Base64 PNG data URIs** are acceptable for Sunken Treasures tier collectibles (paintings, future shells/chests). Monitor file size — each PNG category adds several MB.
- **Syntax check after every commit:**
```bash
node -e "try { new (require('vm').Script)(require('fs').readFileSync('games/catch-and-reel/index.html','utf8')); console.log('SYNTAX OK'); } catch(e) { console.log('ERROR:', e.message); }"
```
The HTML `<` token error is a known false positive — ignore it. Any OTHER error is real.
