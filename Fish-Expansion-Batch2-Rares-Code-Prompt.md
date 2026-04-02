# Fish Expansion Batch 2 Rares — Claude Code Implementation Prompt

**Read CLAUDE.md first.** Then read this entire prompt before making any changes.

---

## Overview

Add 10 new Rare fish to Catch & Reel. The approved SVG artwork is in `fish-expansion-batch2-rares-v2.html` in the repo root. Extract each fish's SVG, base64 encode it, and wire it into the game.

**IMPORTANT: Batch 1 (21 fish) was just added. Do NOT modify or remove any existing fish. Only ADD new ones.**

**Do this in 2 batches — commit after each. Syntax check after every commit.**

**CRITICAL: Add `width="160" height="100"` to each SVG root tag before base64 encoding. Without these attributes the catch display will render them at 0px width (this was a bug we already fixed once for Batch 1).**

---

## Step 1: Extract & Encode SVGs

For each of the 10 fish below, extract the **160×100 catch-size SVG** (the FIRST/larger one in each card) from the mockup file.

Before encoding each SVG to base64:
1. **Add** `width="160" height="100"` to the root `<svg>` tag
2. **Add** `xmlns="http://www.w3.org/2000/svg"` to the root `<svg>` tag
3. **Uniquify ALL gradient/clipPath IDs** using the prefix in the table below
4. **Set viewBox** to `0 0 160 100`

Add each encoded SVG to the `FISH_SVGS` constant. **Make sure the last existing entry has a trailing comma before adding new ones** (this caused a syntax error in Batch 1).

---

## Step 2: Add Fish to FISH Array

### RARE TIER (10 fish)

| Name | Rarity | Weight (min-max lbs) | Length (min-max in) | Locations |
|------|--------|---------------------|--------------------|----|
| Barracuda | Rare | 5.0 - 30.0 | 18 - 48 | deepsea |
| Lionfish | Rare | 1.0 - 3.0 | 8 - 15 | reef, deepsea |
| Triggerfish | Rare | 2.0 - 8.0 | 8 - 20 | reef |
| Parrotfish | Rare | 3.0 - 15.0 | 10 - 24 | reef |
| Yellow Tang | Rare | 0.5 - 2.0 | 4 - 8 | reef |
| Butterflyfish | Rare | 0.3 - 1.5 | 4 - 8 | reef |
| Needlefish | Rare | 1.0 - 8.0 | 12 - 36 | pier, deepsea |
| Sauger | Rare | 1.0 - 5.0 | 10 - 20 | dock, pier |
| Hawkfish | Rare | 0.5 - 2.0 | 4 - 10 | reef |
| Royal Tang | Rare | 0.5 - 2.5 | 5 - 10 | reef |

**Location keys:** Match the exact keys already used by existing fish in the FISH array (check existing entries for the precise strings).

---

## Step 3: Gradient ID Prefixes

| Fish | Prefix |
|------|--------|
| Barracuda | `ba_` |
| Lionfish | `lf_` |
| Triggerfish | `tf_` |
| Parrotfish | `pf2_` |
| Yellow Tang | `yt_` |
| Butterflyfish | `bf_` |
| Needlefish | `nf_` |
| Sauger | `sg_` |
| Hawkfish | `hf_` |
| Royal Tang | `rt_` |

Every `id="..."` and every `url(#...)` reference inside each SVG must use the prefix.

---

## Step 4: Preloader

Add all 10 new fish names to the `FISH_IMAGES` preloader. Each needs `new Image()` with `.src` explicitly assigned to the base64 data URI.

---

## Step 5: Syntax Check

After EVERY batch, run:
```bash
node -e "try { new (require('vm').Script)(require('fs').readFileSync('games/catch-and-reel/index.html','utf8')); console.log('SYNTAX OK'); } catch(e) { console.log('ERROR:', e.message); }"
```

The HTML `<` token error is a FALSE POSITIVE — ignore it.

---

## Implementation Order

**Batch A (commit after):** Barracuda, Lionfish, Triggerfish, Parrotfish, Yellow Tang
**Batch B (commit after):** Butterflyfish, Needlefish, Sauger, Hawkfish, Royal Tang

---

## Critical Reminders

- **Add `width="160" height="100"`** to every SVG root tag before encoding — prevents 0px render bug
- **Trailing comma** on last FISH_SVGS entry before adding new ones
- **Single HTML file** — all SVGs as base64 data URIs, no external files
- **Do NOT modify existing fish** — only ADD new ones
- **Do NOT modify game physics, reel mechanics, or difficulty values**
- **Gradient IDs MUST be uniquified** per fish
- **Syntax check after every batch commit**
- **Fresh Code session** if you hit "Prompt is too long"
- The mockup file `fish-expansion-batch2-rares-v2.html` is the source of truth

---

## Verification After Both Batches

1. Open the game in browser
2. Trophy Room should show **55 total species** (24 original + 21 Batch 1 + 10 Batch 2)
3. New Rare fish should appear as "???" uncaught cards in the Rare section
4. Catch at least one new Rare — verify SVG renders on catch display AND in trophy room
5. Console should be clean
