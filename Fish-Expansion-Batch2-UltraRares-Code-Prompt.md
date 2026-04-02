# Fish Expansion Batch 2 Ultra Rares — Claude Code Implementation Prompt

**Read CLAUDE.md first.** Then read this entire prompt before making any changes.

---

## Overview

Add 8 new Ultra Rare fish to Catch & Reel. The approved SVG artwork is in `fish-expansion-batch2-ultrarares-v2.html` in the repo root. Extract each fish's SVG, base64 encode it, and wire it into the game.

**IMPORTANT: Batch 1 (21 fish) and Batch 2 Rares (10 fish) were already added. Do NOT modify or remove any existing fish. Only ADD new ones.**

**Do this in 2 batches — commit after each. Syntax check after every commit.**

**CRITICAL: Add `width="160" height="100"` to each SVG root tag before base64 encoding. Without these attributes the catch display renders them at 0px width.**

---

## Step 1: Extract & Encode SVGs

For each of the 8 fish below, extract the **160×100 catch-size SVG** (the FIRST/larger one in each card) from the mockup file.

Before encoding each SVG to base64:
1. **Add** `width="160" height="100"` to the root `<svg>` tag
2. **Add** `xmlns="http://www.w3.org/2000/svg"` to the root `<svg>` tag
3. **Uniquify ALL gradient/clipPath IDs** using the prefix in the table below
4. **Set viewBox** to `0 0 160 100`

Add each encoded SVG to the `FISH_SVGS` constant. **Make sure the last existing entry has a trailing comma before adding new ones.**

---

## Step 2: Add Fish to FISH Array

### ULTRA RARE TIER (8 fish)

| Name | Rarity | Weight (min-max lbs) | Length (min-max in) | Locations |
|------|--------|---------------------|--------------------|----|
| Angelfish | Ultra Rare | 1.0 - 4.0 | 6 - 14 | reef |
| Cuttlefish | Ultra Rare | 2.0 - 10.0 | 8 - 20 | deepsea |
| Stingray | Ultra Rare | 10.0 - 50.0 | 18 - 48 | deepsea |
| Sawfish | Ultra Rare | 20.0 - 100.0 | 36 - 84 | deepsea |
| Seahorse | Ultra Rare | 0.01 - 0.1 | 2 - 6 | reef |
| Halfmoon Tuna | Ultra Rare | 15.0 - 80.0 | 24 - 60 | deepsea |
| Thornback Ray | Ultra Rare | 5.0 - 25.0 | 14 - 36 | deepsea |
| Octopus | Ultra Rare | 3.0 - 20.0 | 12 - 36 | reef, deepsea |

**Location keys:** Match the exact keys already used by existing fish in the FISH array.

---

## Step 3: Gradient ID Prefixes

| Fish | Prefix |
|------|--------|
| Angelfish | `af2_` |
| Cuttlefish | `ct_` |
| Stingray | `sr_` |
| Sawfish | `sw_` |
| Seahorse | `sh_` |
| Halfmoon Tuna | `ht_` |
| Thornback Ray | `tr_` |
| Octopus | `oc_` |

Every `id="..."` and every `url(#...)` reference inside each SVG must use the prefix.

---

## Step 4: Preloader

Add all 8 new fish names to the `FISH_IMAGES` preloader. Each needs `new Image()` with `.src` explicitly assigned to the base64 data URI.

---

## Step 5: Syntax Check

After EVERY batch, run:
```bash
node -e "try { new (require('vm').Script)(require('fs').readFileSync('games/catch-and-reel/index.html','utf8')); console.log('SYNTAX OK'); } catch(e) { console.log('ERROR:', e.message); }"
```

The HTML `<` token error is a FALSE POSITIVE — ignore it.

---

## Implementation Order

**Batch A (commit after):** Angelfish, Cuttlefish, Stingray, Sawfish
**Batch B (commit after):** Seahorse, Halfmoon Tuna, Thornback Ray, Octopus

---

## Critical Reminders

- **Add `width="160" height="100"`** to every SVG root tag before encoding
- **Trailing comma** on last FISH_SVGS entry before adding new ones
- **Single HTML file** — all SVGs as base64 data URIs, no external files
- **Do NOT modify existing fish** — only ADD new ones
- **Do NOT modify game physics, reel mechanics, or difficulty values**
- **Gradient IDs MUST be uniquified** per fish
- **Syntax check after every batch commit**
- **Fresh Code session** if you hit "Prompt is too long"
- The mockup file `fish-expansion-batch2-ultrarares-v2.html` is the source of truth

---

## Verification After Both Batches

1. Open the game in browser
2. Trophy Room should now show the updated total species count (previous + 8 new)
3. New Ultra Rare fish should appear as "???" uncaught cards in the Ultra Rare section
4. Catch at least one new Ultra Rare — verify SVG renders on catch display AND in trophy room
5. Console should be clean
