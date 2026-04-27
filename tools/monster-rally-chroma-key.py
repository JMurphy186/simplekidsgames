"""
SKG-111 — Batch chroma-key + edge-feather + auto-crop for Monster Rally truck sprites.

Input:  art/monster-rally/refined/*.png   (RGB, magenta background)
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
INPUT_DIR  = REPO_ROOT / "art" / "monster-rally" / "refined"
OUTPUT_DIR = REPO_ROOT / "art" / "sprites" / "monster-rally"

# Magenta predicate thresholds
R_HI = 200    # R must be > this
G_LO = 60     # G must be < this
B_HI = 200    # B must be > this

# Retina-safe output width. Game renders trucks at ~90×70 max display size, so
# 700px wide is ~10× display scale on Retina screens — plenty crisp without
# bloating the bundle. Sprites narrower than this (post-crop) are NOT upscaled.
# Wheel asset uses its own (smaller) target since it renders at ~30×30 in-game.
TARGET_TRUCK_WIDTH = 700
TARGET_WHEEL_WIDTH = 256


def chroma_key_truck(input_path: Path, output_path: Path) -> dict:
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


def main() -> int:
    if not INPUT_DIR.exists():
        print(f"STOP: input dir not found: {INPUT_DIR}", file=sys.stderr)
        return 1

    inputs = sorted(p for p in INPUT_DIR.glob("*.png") if p.is_file())
    if not inputs:
        print(f"STOP: no PNGs in {INPUT_DIR}", file=sys.stderr)
        return 1

    print(f"Input:  {INPUT_DIR}")
    print(f"Output: {OUTPUT_DIR}")
    print(f"Files:  {len(inputs)}")
    print()
    print(f"{'file':<22}  {'in (WxH)':>11}  {'out (WxH)':>11}  {'trans%':>7}  {'KB':>6}")
    print(f"{'-'*22}  {'-'*11}  {'-'*11}  {'-'*7}  {'-'*6}")

    total_in_bytes = 0
    total_out_bytes = 0

    for src in inputs:
        # The ticket mentions "pirate ship.png" → "pirate-ship.png" rename, but
        # the refined dir already has hyphenated names — handle defensively
        # in case a future drop ships with a space.
        safe_name = src.stem.replace(" ", "-") + src.suffix
        dst = OUTPUT_DIR / safe_name

        try:
            stats = chroma_key_truck(src, dst)
        except Exception as e:
            print(f"  ERROR processing {src.name}: {e}", file=sys.stderr)
            continue

        total_in_bytes += src.stat().st_size
        total_out_bytes += stats["out_bytes"]

        print(
            f"{safe_name:<22}  "
            f"{stats['in_w']:>4}x{stats['in_h']:<5}  "
            f"{stats['out_w']:>4}x{stats['out_h']:<5}  "
            f"{stats['transparent_pct_of_input']:>6.1f}%  "
            f"{stats['out_bytes']/1024:>5.1f}"
        )

    print()
    print(f"Total input:  {total_in_bytes/1024/1024:.2f} MB")
    print(f"Total output: {total_out_bytes/1024/1024:.2f} MB")
    print(f"Output dir:   {OUTPUT_DIR}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
