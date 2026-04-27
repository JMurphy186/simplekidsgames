"""
SKG-111 / SKG-113 — Batch chroma-key + edge-feather + auto-crop for Monster
Rally painted sprites (trucks + coins).

Inputs (both processed, idempotent):
  art/monster-rally/refined/*.png   (trucks; resize to 700px wide)
  art/monster-rally/coins/*.png     (coin pickups; resize to 128px wide)
Output: art/sprites/monster-rally/*.png   (RGBA, transparent, content-cropped)

Magenta predicate (tolerant): R>200 AND G<60 AND B>200
  - The ChatGPT-painted backgrounds vary by ~20 units per channel from pure #FF00FF.
  - Strict #FF00FF match would leave halos. Loose predicate catches the actual range.
  - cyber-truck note: its accent green is #42d18a (NOT magenta) — predicate ignores it.

Edge feather: 1px alpha-erode after the hard cut.
  - Eliminates the anti-aliased halo ring where painted edges meet magenta.
  - Implemented as MinFilter(3) on the alpha channel — equivalent to 1-pixel
    binary erosion of the opaque mask.

Auto-crop: bbox of non-transparent pixels, then crop. Removes empty margins.

Usage (from repo root):
    python tools/monster-rally-chroma-key.py
"""

import os
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

# Resolve repo root (parent of tools/)
REPO_ROOT = Path(__file__).resolve().parent.parent
TRUCKS_DIR    = REPO_ROOT / "art" / "monster-rally" / "refined"
COINS_DIR     = REPO_ROOT / "art" / "monster-rally" / "coins"
POWERUPS_DIR  = REPO_ROOT / "art" / "monster-rally" / "powerups"
OUTPUT_DIR    = REPO_ROOT / "art" / "sprites" / "monster-rally"
POWERUPS_OUT  = OUTPUT_DIR / "powerups"

# Magenta predicate thresholds
R_HI = 200    # R must be > this
G_LO = 60     # G must be < this
B_HI = 200    # B must be > this

# Retina-safe output widths. Game renders sprites well below source resolution,
# so target widths give ~2-10× retina headroom without bloating the bundle.
# Sprites narrower than these (post-crop) are NOT upscaled.
TARGET_TRUCK_WIDTH    = 700   # in-game display ~90×70
TARGET_WHEEL_WIDTH    = 256   # in-game display ~30×30
TARGET_COIN_WIDTH     = 128   # in-game display common~30, big~45, mega~60
TARGET_POWERUP_WIDTH  = 192   # in-world radius 22 → ~44px, HUD radius 8 → ~16px


def chroma_key_truck(input_path: Path, output_path: Path, target_w_override=None) -> dict:
    """
    Process one PNG: chroma-key magenta to alpha=0, 1px alpha erode, auto-crop.
    Returns a stats dict for logging.
    """
    img = Image.open(input_path).convert("RGBA")
    arr = np.array(img)  # shape (H, W, 4)
    h_in, w_in = arr.shape[:2]

    r = arr[:, :, 0].astype(np.int16)
    g = arr[:, :, 1].astype(np.int16)
    b = arr[:, :, 2].astype(np.int16)

    # Magenta mask — pixels we want transparent
    magenta_mask = (r > R_HI) & (g < G_LO) & (b > B_HI)

    # Hard cut: alpha = 0 where magenta, 255 where not
    alpha = np.where(magenta_mask, 0, 255).astype(np.uint8)

    # 1px alpha erode: shrink the opaque region by 1 pixel on all sides.
    # MinFilter(3) replaces each pixel with the min of its 3x3 neighborhood —
    # a single transparent neighbor pulls a border pixel from 255 → 0.
    # This kills anti-aliased halo where painted RGB met magenta and got blended.
    alpha_img = Image.fromarray(alpha, mode="L")
    alpha_eroded_img = alpha_img.filter(ImageFilter.MinFilter(3))
    alpha_eroded = np.array(alpha_eroded_img)

    # Compose final RGBA — preserve original RGB, replace alpha
    out_arr = arr.copy()
    out_arr[:, :, 3] = alpha_eroded

    # Also zero out RGB on transparent pixels — keeps the file slimmer and
    # prevents any accidental color bleed from anti-aliased magenta during
    # downstream resizes.
    transparent_mask = (alpha_eroded == 0)
    out_arr[transparent_mask] = [0, 0, 0, 0]

    out_img = Image.fromarray(out_arr, mode="RGBA")

    # Auto-crop to bbox of non-transparent pixels
    bbox = out_img.getbbox()
    if bbox is None:
        # Whole image was magenta — bail with a warning, write 1x1 transparent
        out_img = Image.new("RGBA", (1, 1), (0, 0, 0, 0))
        cropped = out_img
        crop_w, crop_h = 1, 1
    else:
        cropped = out_img.crop(bbox)
        crop_w, crop_h = cropped.size

    # Resize to retina-safe target width (only downscale, never up).
    if target_w_override is not None:
        target_w = target_w_override
    else:
        is_wheel = output_path.stem == "wheel"
        target_w = TARGET_WHEEL_WIDTH if is_wheel else TARGET_TRUCK_WIDTH
    if crop_w > target_w:
        scale = target_w / crop_w
        new_w = target_w
        new_h = max(1, round(crop_h * scale))
        cropped = cropped.resize((new_w, new_h), Image.LANCZOS)
        crop_w, crop_h = cropped.size

    # Write output
    output_path.parent.mkdir(parents=True, exist_ok=True)
    cropped.save(output_path, format="PNG", optimize=True)

    # Stats
    transparent_count = int(transparent_mask.sum())
    total_in = h_in * w_in
    transparent_pct = transparent_count / total_in * 100.0
    out_size = output_path.stat().st_size

    return {
        "in_w":  w_in,
        "in_h":  h_in,
        "out_w": crop_w,
        "out_h": crop_h,
        "transparent_pct_of_input": transparent_pct,
        "out_bytes": out_size,
    }


def process_dir(input_dir: Path, output_dir: Path, label: str, target_w_override=None) -> tuple:
    """Process every PNG under input_dir → output_dir. Returns (in_bytes, out_bytes)."""
    if not input_dir.exists():
        print(f"  SKIP: input dir not found: {input_dir}")
        return 0, 0
    inputs = sorted(p for p in input_dir.glob("*.png") if p.is_file())
    if not inputs:
        print(f"  SKIP: no PNGs in {input_dir}")
        return 0, 0

    print(f"\n=== {label} ({len(inputs)} files) ===")
    print(f"Input:  {input_dir}")
    print(f"Output: {output_dir}")
    print()
    print(f"{'file':<22}  {'in (WxH)':>11}  {'out (WxH)':>11}  {'trans%':>7}  {'KB':>6}")
    print(f"{'-'*22}  {'-'*11}  {'-'*11}  {'-'*7}  {'-'*6}")

    total_in = 0
    total_out = 0
    for src in inputs:
        # Defensive rename: spaces → hyphens
        safe_name = src.stem.replace(" ", "-") + src.suffix
        # Coin pickup files share OUTPUT_DIR with trucks; namespace them with
        # a `coin-` prefix to avoid filename collisions if a truck were ever
        # named `common.png` etc.
        if label == "coins":
            safe_name = "coin-" + safe_name
        dst = output_dir / safe_name

        try:
            stats = chroma_key_truck(src, dst, target_w_override=target_w_override)
        except Exception as e:
            print(f"  ERROR processing {src.name}: {e}", file=sys.stderr)
            continue

        total_in += src.stat().st_size
        total_out += stats["out_bytes"]

        print(
            f"{safe_name:<22}  "
            f"{stats['in_w']:>4}x{stats['in_h']:<5}  "
            f"{stats['out_w']:>4}x{stats['out_h']:<5}  "
            f"{stats['transparent_pct_of_input']:>6.1f}%  "
            f"{stats['out_bytes']/1024:>5.1f}"
        )

    return total_in, total_out


def main() -> int:
    grand_in = 0
    grand_out = 0

    in_b, out_b = process_dir(TRUCKS_DIR, OUTPUT_DIR, "trucks")
    grand_in += in_b; grand_out += out_b

    in_b, out_b = process_dir(COINS_DIR,  OUTPUT_DIR, "coins", target_w_override=TARGET_COIN_WIDTH)
    grand_in += in_b; grand_out += out_b

    # SKG-115: power-up sprites get their own subdirectory under OUTPUT_DIR
    # so they don't clash with truck/coin filenames (mega.png exists as a
    # power-up; could collide with a truck if filename hygiene slips later).
    in_b, out_b = process_dir(POWERUPS_DIR, POWERUPS_OUT, "powerups", target_w_override=TARGET_POWERUP_WIDTH)
    grand_in += in_b; grand_out += out_b

    print()
    print(f"Total input:  {grand_in/1024/1024:.2f} MB")
    print(f"Total output: {grand_out/1024/1024:.2f} MB")
    print(f"Output dir:   {OUTPUT_DIR}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
