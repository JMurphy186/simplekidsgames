# Monster Rally — CLAUDE.md

## What This Is
**Monster Rally** — a browser-based monster truck game built for two kids (ages 3 and 6). The game must be FUN FIRST — every decision should optimize for "would a 3-year-old mash buttons and laugh?" and "would a 6-year-old want to beat their high score?"

## Architecture
- **Single HTML file** (`index.html`) with embedded JS and CSS
- **No build tools, no npm, no bundler** — this ships as one file you open in a browser
- **HTML5 Canvas** for all game rendering (2D context)
- **Web Audio API** (via Tone.js CDN or procedural AudioContext) for sound effects — no audio file assets
- **No external assets** — all graphics are drawn with Canvas API (shapes, gradients, arcs). All sounds are synthesized. Zero asset hosting required.
- **Responsive** — scales to any screen size while maintaining 800x450 virtual resolution
- **Touch + keyboard** — works on tablets, phones, laptops. Touch is first-class, not an afterthought.

## Virtual Coordinate System
The game logic runs at **800x450** virtual pixels. The canvas scales to fit the viewport using aspect ratio math. ALL game positions, collision boxes, and drawing coordinates use virtual coords. The scaling transform is applied once in the draw loop.

## Code Organization
Everything lives in `index.html`. Use clearly commented sections:

```
// ============================================================
// SECTION NAME
// ============================================================
```

Sections in order:
1. **HTML/CSS** — canvas element, body styling, meta viewport
2. **Constants** — physics, dimensions, colors, tuning values
3. **Game State** — all mutable state in a clear block
4. **Asset Generation** — procedural sound and visual helpers
5. **Input Handling** — keyboard, touch, gamepad listeners
6. **Entity Spawning** — obstacle, star, particle, power-up factories
7. **Entity Drawing** — individual draw functions per entity type
8. **Physics & Collision** — update loop logic
9. **HUD & UI** — score, combo, menus, truck picker
10. **Game Loop** — requestAnimationFrame orchestration

## Key Principles
- **No death / no fail state.** The truck NEVER stops. If it hits something from the side, it pushes through with a bump animation. Kids should never feel punished.
- **Juice everything.** Screen shake on crush. Particles on every interaction. Flash colors. Combo text. The game should feel ALIVE.
- **One-button core.** The primary mechanic is JUMP (spacebar / tap / up arrow). Everything else is bonus.
- **Performance matters.** Target 60fps on a 2020-era laptop and modern tablets. Keep particle counts bounded. Object-pool if needed.
- **Sound is critical.** A game without sound is a dead game for kids. Engine hum, crush crunch, star chime, ramp whoosh, combo fanfare, horn honk — all procedurally generated.

## Current State
The base game exists with:
- Side-scrolling monster truck with one-button jump
- Cars, SUVs, buses, and ramps as obstacles
- Star collectibles
- Crush particles and combo system
- Speed progression
- Title screen with best score tracking
- Responsive canvas scaling
- Touch and keyboard input

## Build Priority (in order)
1. **Sound effects** — engine, crush, star, ramp, combo, horn button
2. **Truck picker screen** — 4 trucks with names/colors, selection before game starts
3. **More crushable objects** — variety pack (stack of cars, porta-potty, old TV, barrel pile)
4. **Backflip trick** — auto-flip if airborne long enough, bonus points + special particles
5. **Level/environment progression** — background changes every 500pts (desert → city → moon)
6. **Two-player split screen** — Player 1 (WASD/left-side tap), Player 2 (arrows/right-side tap)
7. **Polish pass** — title screen animation, transitions, button hover states, mobile controls overlay

## Do NOT
- Add npm, webpack, vite, or any build tooling
- Create separate JS/CSS files — everything in index.html
- Use external image or audio assets (URLs, files, etc.)
- Add a game-over or death mechanic
- Make it too hard for a 3-year-old
- Use ES modules or import statements (except CDN script tags if needed for Tone.js)

## Sound Design Notes
Use `AudioContext` (Web Audio API) to synthesize all sounds:
- **Engine hum**: Low-frequency oscillator (sawtooth, ~80Hz), subtle volume modulation tied to game speed
- **Crush/smash**: Short burst of white noise with fast decay + low-freq thump
- **Star collect**: Quick ascending tone sequence (C5→E5→G5, sine wave, 50ms each)
- **Ramp launch**: Rising pitch sweep (200Hz→600Hz, 200ms)
- **Combo fanfare**: Stacked chord burst, pitch scales with combo count
- **Horn**: User-triggered, fat square wave honk (~200Hz, 300ms)
- **Landing thud**: Short noise burst with low-pass filter

All sounds must be triggered AFTER first user interaction (browser autoplay policy). Initialize AudioContext on first tap/keypress.

## Truck Roster
| Name | Body Color | Accent | Personality |
|------|-----------|--------|-------------|
| Flame Crusher | #ff4400 (red-orange) | #ffcc00 (yellow flames) | The classic |
| Blue Thunder | #2255ff (bright blue) | #00ccff (lightning bolts) | Fast and electric |
| Green Machine | #22cc44 (green) | #88ff00 (lime stripes) | Eco-warrior vibes |
| Purple Nightmare | #8833cc (purple) | #ff44ff (magenta stars) | Spooky cool |

## Testing Checklist
After each feature addition, verify:
- [ ] Game runs at 60fps in Chrome
- [ ] Touch controls work (tap to jump)
- [ ] Keyboard controls work (space/up arrow)
- [ ] No console errors
- [ ] Title screen still works
- [ ] Score still tracks correctly
- [ ] Canvas scales properly on window resize
