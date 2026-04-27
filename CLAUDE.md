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

### Commit / Push / PR Protocol (ALL PROMPTS — MANDATORY)

**Auto-merge protocol locked in 2026-04 (post SKG-111).** No more manual PR opening or merging by Jay.

For any code change:
```bash
# 1. Syntax check the modified game(s)
node -e "const fs=require('fs'); const html=fs.readFileSync('games/[game]/index.html','utf8'); const m=html.match(/<script>([\s\S]*?)<\/script>/); new Function(m[1]); console.log('OK')"

# 2. Branch off main with a descriptive name (typically ticket-keyed)
git checkout main && git pull origin main
git checkout -b skg-NNN-short-description

# 3. Make changes, stage, commit
git add <specific files>   # avoid `git add -A` — sweeps in unrelated untracked items
git commit -m "SKG-NNN: descriptive subject

Multi-line body explaining what / why / how."

# 4. Push branch
git push origin skg-NNN-short-description

# 5. Open PR via gh CLI
"/c/Program Files/GitHub CLI/gh.exe" pr create \
  --title "SKG-NNN: descriptive title" \
  --body "$(cat <<'EOF'
Closes SKG-NNN.

## Summary
...

## Smoke test
...
EOF
)" \
  --base main

# 6. Auto-merge — fully automatic, no manual gate.
#    Jay reviews/playtests post-merge via the live URL and reverts if needed.
"/c/Program Files/GitHub CLI/gh.exe" pr merge --merge --delete-branch

# 7. Confirm origin/main advanced
git fetch origin && git log origin/main --oneline -3
```

**Why no pre-merge gate:** Jay decided 2026-04 the friction of manual review/merge wasn't paying for itself given how often kids playtest reveals issues only post-deploy anyway. Auto-merge means visual changes ship in <2 minutes; if anything regresses, the PR-based history makes "Revert PR" on GitHub a one-click rollback.

**Exception — high-risk changes need an explicit gate:**
- Save-state migrations (anything touching localStorage schema)
- Collision / physics math
- Audio system rewires
- Any change spanning >2 game files

For those, push the branch + open the PR but **do NOT merge** — surface the PR URL in chat and wait for Jay's "ship it" before merging. When in doubt, ask.

**`gh` CLI path on this Windows machine:** `/c/Program Files/GitHub CLI/gh.exe` (use absolute path; the shell session this Code runs in doesn't have `gh` in PATH even after install).

**Post-merge cache-bust:** After production deploy completes (~60-90s on Vercel), bump the version query string on the affected game URL: `simplekidsgames.com/games/<game>/?v=N+1`. Tracks per-game in each game's `CLAUDE.md`.

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
