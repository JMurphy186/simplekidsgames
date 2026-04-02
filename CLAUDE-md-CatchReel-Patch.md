# CLAUDE.md Patch — Catch & Reel Fish + Sound Sections

**Instructions:** Add these two sections to the Catch & Reel portion of CLAUDE.md, after the existing character/rod documentation.

---

## Fish Roster (25 SVG Fish)

All fish rendered as detailed SVG artwork, base64 encoded in `FISH_SVGS` constant. Preloaded via `FISH_IMAGES` object. Emoji kept as fallback if SVG not found.

**Display sizes:**
- Catch display: 160×100px
- Trophy room: 80×50px
- HUD fallback: 24×15px

**Gradient ID convention:** Each fish uses uniquified gradient IDs prefixed `f0_`, `f1_`, etc. to prevent SVG gradient conflicts when multiple fish render simultaneously.

### Active Fish (24 catchable)

| # | Name | Emoji | Rarity | Notes |
|---|------|-------|--------|-------|
| 1 | Bluegill | 🐟 | Common | Ear flap detail |
| 2 | Perch | 🐠 | Common | Vertical bar markings |
| 3 | Bass | 🐟 | Common | Red eye, bucket mouth |
| 4 | Catfish | 🐡 | Uncommon | Whiskers, scaleless skin |
| 5 | Trout | 🐟 | Uncommon | Pink stripe, adipose fin |
| 6 | Salmon | 🐠 | Uncommon | Species-accurate markings |
| 7 | Walleye | 🐟 | Uncommon | — |
| 8 | Pike | 🐊 | Rare | — |
| 9 | Muskie | 🐟 | Rare | — |
| 10 | Sturgeon | 🐠 | Rare | — |
| 11 | Swordfish | ⚔️ | Ultra Rare | — |
| 12 | Marlin | 🐟 | Ultra Rare | — |
| 13 | Tuna | 🐟 | Ultra Rare | — |
| 14 | Shark | 🦈 | Epic | — |
| 15 | Narwhal | 🦄 | Epic | Spiral tusk detail |
| 16 | Manta Ray | 🦅 | Epic | — |
| 17 | Giant Squid | 🦑 | Legendary | — |
| 18 | Anglerfish | 💡 | Legendary | — |
| 19 | Golden Koi | ✨ | Legendary | — |
| 20 | Loch Ness Monster | 🦕 | Exotic | Water mist effect |
| 21 | Kraken | 🐙 | Exotic | Ink wisp effect |
| 22 | Mermaid's Ring | 💍 | Exotic | Gem refraction effect |
| 23 | Phantom Jellyfish | 🪼 | Exotic | Translucent bell, trailing tentacles, bioluminescent spots |
| 24 | Ancient Treasure Chest | 🧰 | Exotic | Open lid, gold coins, gems, barnacles, seaweed |
| 25 | Poseidon's Trident | 🔱 | Exotic | Three-pronged, gold shaft, aqua gem, energy glow |

### Inactive Fish (SVG preserved, not in FISH array)

| Name | Emoji | Notes |
|------|-------|-------|
| Old Boot | 👢 | SVG exists in `FISH_SVGS`. Reserved for future junk catch mechanic. |

### Exotic Difficulty Settings

Exotics use a tighter catch minigame:
- Green zone: 88% of bar (was 92%)
- Drift rate: 0.35/sec (was 0.55/sec)
- Result: still challenging but actually catchable for kids

### SVG Art Quality Standards

All fish SVGs follow these quality guidelines:
- 3D gradients for body depth
- Translucent fins with ray line details
- Scale texture arcs where species-appropriate
- Species-accurate markings (bluegill ear flap, perch vertical bars, trout pink stripe + adipose fin, bass red eye + bucket mouth, narwhal spiral tusk, catfish whiskers + scaleless skin)
- Exotic fish include magic/fantasy effects (water mist, ink wisps, gem refraction, bioluminescence, energy glow)

---

## Sound System (10 Audio Clips)

All sounds are real audio clips (not Web Audio API synthesis), embedded as base64 WAV data URIs (~1.85MB total). Sourced from Pixabay (free, no attribution required).

### Sound Inventory

| Key | Trigger | Description |
|-----|---------|-------------|
| cast | Line cast | Casting whoosh |
| splash | Line hits water | Water splash |
| bite | Fish bites | Alert tone |
| reelClick | Reeling in | Click/ratchet |
| reelDrag | Drag tension | Tension sound |
| catchCommon | Catch common/uncommon | Simple fanfare |
| catchRare | Catch rare/ultra rare | Elevated fanfare |
| catchExotic | Catch epic/legendary/exotic | Grand fanfare |
| lineSnap | Line breaks | Snap sound |
| newRecord | New best fish | Record fanfare |

### Rarity → Sound Mapping

| Rarity Tier | Sound Key |
|-------------|-----------|
| Common, Uncommon | catchCommon |
| Rare, Ultra Rare | catchRare |
| Epic, Legendary, Exotic | catchExotic |

### Implementation Details

- **Init:** `initSounds()` called on first cast (browser autoplay policy compliant)
- **Playback:** `playS(key)` function triggers sounds
- **Mute:** Toggle button with `localStorage` persistence (`catchreel_mute` key)
- **iOS:** `touchend` fallback on mute button for Safari compatibility
- **Variables:** `sndCtx` and `sndMuted` use `var` declarations (fixes temporal dead zone crash)
- **Architecture:** Unlike Monster Rally and Space Dodge (Web Audio API synthesis), Catch & Reel uses real recorded audio clips for higher quality
