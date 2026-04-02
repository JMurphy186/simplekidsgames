# Fish Expansion Batch 1 — Claude Code Implementation Prompt

**Read CLAUDE.md first.** Then read this entire prompt before making any changes.

---

## Overview

Add 21 new fish (10 Common + 11 Uncommon) to Catch & Reel. The approved SVG artwork is in the mockup file `fish-expansion-batch1-v6-review.html` in the repo root (or `/mnt/user-data/outputs/`). Extract each fish's SVG from that file, base64 encode it, and wire it into the game.

**Do this in batches — commit after every 5-7 fish. Syntax check after every commit.**

---

## Step 1: Extract & Encode SVGs

For each of the 21 fish below, extract the **160×100 catch-size SVG** from the mockup file. Each fish card has two SVGs — use the FIRST one (160×100), not the 80×50 trophy version.

Before encoding each SVG to base64:
1. **Uniquify ALL gradient/clipPath IDs** — prefix with fish-specific ID (e.g., `gf_` for Goldfish, `sd_` for Shad, etc.) to prevent conflicts when multiple fish SVGs coexist as base64 data URIs
2. **Ensure the SVG has** `xmlns="http://www.w3.org/2000/svg"` on the `<svg>` tag
3. **Set viewBox** to `0 0 160 100`
4. **Remove** any `width` and `height` attributes from the root `<svg>` tag (the game scales these dynamically)

Add each encoded SVG to the `FISH_SVGS` constant, using the fish name as the key (matching the `name` field in the FISH array exactly).

---

## Step 2: Add Fish to FISH Array

Add all 21 fish to the `FISH` array. Follow the exact same object structure as existing fish entries. Here are the stats for each:

### COMMON TIER (10 fish)

| Name | Rarity | Weight (min-max lbs) | Length (min-max in) | Locations |
|------|--------|---------------------|--------------------|----|
| Goldfish | Common | 0.1 - 0.8 | 3 - 8 | dock, pier |
| Sunfish | Common | 1.0 - 5.0 | 6 - 14 | pier, reef |
| Shad | Common | 0.5 - 3.0 | 6 - 16 | dock, pier |
| Smelt | Common | 0.1 - 0.5 | 3 - 7 | dock, pier |
| Crappie | Common | 0.3 - 2.0 | 5 - 12 | dock, pier |
| Goby | Common | 0.05 - 0.3 | 2 - 5 | dock, reef |
| Bream | Common | 0.5 - 3.0 | 5 - 14 | dock, pier |
| Minnow | Common | 0.05 - 0.2 | 2 - 4 | dock |
| Blue Chromis | Common | 0.1 - 0.5 | 3 - 6 | reef |
| Damselfish | Common | 0.1 - 0.4 | 3 - 5 | reef |

### UNCOMMON TIER (11 fish)

| Name | Rarity | Weight (min-max lbs) | Length (min-max in) | Locations |
|------|--------|---------------------|--------------------|----|
| Cichlid | Uncommon | 0.5 - 3.0 | 4 - 10 | pier, reef |
| Gourami | Uncommon | 0.3 - 2.0 | 4 - 10 | dock, pier |
| Cod | Uncommon | 2.0 - 12.0 | 10 - 28 | deepsea |
| Crawfish | Uncommon | 0.2 - 1.0 | 3 - 7 | dock |
| Clownfish | Uncommon | 0.1 - 0.5 | 3 - 5 | reef |
| Pufferfish | Uncommon | 1.0 - 6.0 | 6 - 14 | reef, deepsea |
| Hermit Crab | Uncommon | 0.2 - 1.5 | 2 - 6 | dock, reef |
| Zebrafish | Uncommon | 0.3 - 1.5 | 4 - 8 | pier, reef |
| Pilotfish | Uncommon | 1.0 - 5.0 | 8 - 18 | deepsea |
| Cardinalfish | Uncommon | 0.1 - 0.4 | 3 - 5 | reef, deepsea |
| Anemonefish | Uncommon | 0.1 - 0.5 | 3 - 5 | reef |

**Location keys:** Use the same location identifiers already in the codebase. Check existing fish entries for the exact key names (likely `dock`, `pier`, `reef`, `deepsea`, `volcano` or similar — match what's already there).

---

## Step 3: Gradient ID Prefixes

Use these unique prefixes when renaming gradient/clipPath IDs for each fish:

| Fish | Prefix |
|------|--------|
| Goldfish | `gf_` |
| Sunfish | `sf_` |
| Shad | `sd_` |
| Smelt | `sm_` |
| Crappie | `cr_` |
| Goby | `gb_` |
| Bream | `br_` |
| Minnow | `mn_` |
| Blue Chromis | `bc_` |
| Damselfish | `df_` |
| Cichlid | `ci_` |
| Gourami | `go_` |
| Cod | `co_` |
| Crawfish | `cw_` |
| Clownfish | `cf_` |
| Pufferfish | `pf_` |
| Hermit Crab | `hc_` |
| Zebrafish | `zf_` |
| Pilotfish | `pl_` |
| Cardinalfish | `cd_` |
| Anemonefish | `af_` |

Every `id="..."` and every `url(#...)` reference inside each SVG must use the prefix. This prevents gradient ID collisions when multiple fish SVGs are rendered as base64 data URIs on the same page.

---

## Step 4: Preloader

Add all 21 new fish names to the `FISH_IMAGES` preloader so their SVGs are loaded via `new Image()` with `.src` set to the base64 data URI on game init. **The Image object must be explicitly created and .src assigned — the object existing isn't enough.**

---

## Step 5: Trophy Room

The trophy room already renders fish from the FISH array by rarity tier. Verify the new fish appear correctly:
- Common fish should appear in the Common section
- Uncommon fish should appear in the Uncommon section
- Uncaught fish show as "???" cards with the fish name visible
- Caught fish show SVG thumbnail at 80×50

The trophy room counter at the top should update automatically (was "X / 24 species", should now be "X / 45 species" — 24 existing + 21 new).

---

## Step 6: Syntax Check

After EVERY batch of fish added, run:
```bash
node -e "try { new (require('vm').Script)(require('fs').readFileSync('games/catch-and-reel/index.html','utf8')); console.log('SYNTAX OK'); } catch(e) { console.log('ERROR:', e.message); }"
```

**The HTML `<` token error is a FALSE POSITIVE — ignore it.** Only real JS syntax errors matter.

---

## Implementation Order

**Batch A (commit after):** Goldfish, Sunfish, Shad, Smelt, Crappie, Goby, Bream
**Batch B (commit after):** Minnow, Blue Chromis, Damselfish, Cichlid, Gourami, Cod
**Batch C (commit after):** Crawfish, Clownfish, Pufferfish, Hermit Crab, Zebrafish, Pilotfish, Cardinalfish, Anemonefish

---

## Critical Reminders

- **Single HTML file** — all SVGs go as base64 data URIs inside the JS, no external files
- **Do NOT modify game physics, reel mechanics, or difficulty values**
- **Do NOT modify existing fish** — only ADD new ones
- **Gradient IDs MUST be uniquified** per fish — this is the #1 source of visual bugs
- **Syntax check after every batch commit**
- **Fresh Code session** if you hit "Prompt is too long" — the 2MB game file maxes context
- The mockup HTML file `fish-expansion-batch1-v6-review.html` is your source of truth for all SVG artwork

---

## Verification After All 3 Batches

1. Open the game in browser
2. Check each location — new fish should appear in catches
3. Open Trophy Room — should show 45 total species, new ones as "???" uncaught
4. Catch at least one new Common and one new Uncommon — verify SVG renders at catch display size AND trophy room size
5. Console should be clean (no gradient ID errors, no missing image errors)
