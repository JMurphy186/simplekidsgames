# Simple Kids Games — CLAUDE.md

## Project Overview
Browser-based kids game platform built by a dad for his two sons (ages 3 and 6). Three live games, no frameworks, single HTML file per game. Live at simplekidsgames.com.

## Per-Game Documentation
Each game has its own CLAUDE.md with full architecture, current state, and implementation patterns:
- **Monster Rally:** `games/monster-rally/CLAUDE.md`
- **Space Dodge:** `games/space-dodge/CLAUDE.md`
- **Catch & Reel:** `games/catch-and-reel/CLAUDE.md`

**Read the game-specific CLAUDE.md BEFORE making any changes.**

## Repo Structure
```
simplekidsgames/
├── index.html                         # Landing page (animated Canvas cards)
├── games/
│   ├── monster-rally/
│   │   ├── index.html                 # Monster Rally (~4,757 lines, 1.1 MB)
│   │   └── CLAUDE.md
│   ├── space-dodge/
│   │   ├── index.html                 # Space Dodge (~3,728 lines, 6.9 MB)
│   │   └── CLAUDE.md
│   └── catch-and-reel/
│       ├── index.html                 # Catch & Reel (~3,695 lines, 7.2 MB)
│       └── CLAUDE.md
├── privacy.html
├── 404.html
├── vercel.json
└── .gitignore
```

## Cross-Game Design System (ALL games follow these)
- **Title pattern:** First word in gold (#FFD700), second word in game accent color. Luckiest Guy font.
- **Fonts:** Google Fonts via `@import` — Luckiest Guy (headings/labels), Baloo 2 (body/stats)
- **Glass pill arrows:** 40×64px rounded pills with gradient fill + thin border
- **Corner buttons:** Glass MENU (top-left) + TROPHIES (top-right), 44px minimum
- **DPR Retina scaling:** `canvas.width = W * dpr`, `canvas.style.width = W + 'px'`, `ctx.scale(dpr, dpr)`
- **Painted PNG backgrounds:** All games use base64-encoded painted backgrounds, NOT flat gradients
- **Text crispness:** strokeText outlines (2px), reduced shadowBlur (3), glow effects via shadow

## Universal Implementation Rules

### Commit/Push Protocol (ALL PROMPTS)
After every change:
```bash
node -c games/[game]/index.html   # Syntax check
git add -A
git commit -m "descriptive message"
git push
```

### Trailing Comma Check (CRITICAL)
When adding entries to arrays (FISH_SVGS, SHIPS, etc.), ensure the PREVIOUS last entry has a trailing comma. Missing comma = `Unexpected string` syntax error.

### SVG Root Dimensions (REQUIRED)
Every SVG used as a base64 data URI MUST include `width` and `height` on the root `<svg>` tag. Without them, `<img>` renders at 0px.

### Gradient/ClipPath ID Uniquification
All SVG gradient and clipPath IDs must be unique per entity (species-prefix like `sr_`, ship-prefix like `nw_`). Duplicate IDs cause rendering collisions.

### DPR-Aware Coordinates
After DPR fix, ALL game logic uses logical W/H — never `canvas.width`/`canvas.height`. Touch: `x = (e.clientX - rect.left) * (W / rect.width)`.

### Pause Accumulator Bug
`accumulator += delta` MUST be inside `if (!paused)` block. Otherwise frames accumulate during pause and burst on resume.

### Mockup-First Implementation
When porting visuals from a mockup HTML file: "Open [mockup.html], find function [drawXxx()], and port the EXACT Canvas/SVG drawing code." Do NOT reinterpret visual descriptions.

### Mobile Boost Pattern
For elements that need to be larger on mobile: `function mobileBoost() { return W < 600 ? 2.0 : 1; }`. Apply to ships, bolts, pickups, UI elements. 1.5× is too conservative — use 2.0×.
