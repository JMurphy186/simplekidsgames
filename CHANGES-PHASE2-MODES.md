# Monster Rally — Phase 2 Changes: Crush Frenzy + Battle Mode

## Summary
Added two new game modes (Crush Frenzy and Battle) plus a redesigned mode select screen, game over screen, and round timer system.

---

## 1. New State Variables (Game State section)

Added to the game state block around line 148:

```js
let gameMode = 'rally'; // 'rally' | 'frenzy' | 'battle'
let roundTimer = 0;     // countdown timer for frenzy/battle (frames, 1800 = 30s)
```

Updated `gameState` to include new states:
```js
let gameState = 'title';
// Now supports: 'title' | 'picker' | 'modeselect' | 'playerselect' | 'countdown' | 'playing' | 'gameover'
```

---

## 2. Player Object: Added `totalCrushes` Counter

In `createPlayer()`, added tracking for total crushes (combo resets, this doesn't):

```js
function createPlayer(truckIdx, groundOffset) {
  return {
    score: 0, combo: 0, comboTimer: 0, totalCrushes: 0,  // <-- added totalCrushes
    // ... rest unchanged
  };
}
```

In `updatePlayer()` collision section, increment on each crush:
```js
p.combo++; p.totalCrushes++; p.comboTimer = (gameMode === 'frenzy' || gameMode === 'battle') ? 120 : 90;
```

---

## 3. Redesigned Mode Select Screen

Replaced the old "1 PLAYER / 2 PLAYERS" mode select with a 3-button vertical layout:

### `drawModeSelectScreen()` — Complete Replacement
- 3 vertically stacked buttons with pulsing colors:
  - **RALLY** (green) — "Classic driving fun!" — key [1]
  - **CRUSH FRENZY** (red-orange) — "30 sec smash attack!" — key [2]
  - **BATTLE** (purple) — "2 players, most crushes wins!" — key [3]
- Shows selected truck preview at top
- Each button has label, description, and keyboard shortcut hint

### `handleModeSelectClick(vx, vy)` — Complete Replacement
Hit-tests 3 vertical buttons and calls `selectMode('rally'|'frenzy'|'battle')`.

### New: `selectMode(mode)` — Replaces `startGameWithMode()`
```js
function selectMode(mode) {
  gameMode = mode;
  if (mode === 'rally') {
    gameState = 'playerselect';       // ask 1P or 2P
  } else if (mode === 'frenzy') {
    numPlayers = 1;                   // always 1P
    startCountdown();
  } else if (mode === 'battle') {
    numPlayers = 2;                   // always 2P
    pickerPlayer = 2;
    selectedTruck2 = (selectedTruck + 1) % ROSTER_COUNT;
    gameState = 'picker';             // P2 picks truck
  }
}
```

---

## 4. New: Player Select Screen (Rally sub-menu)

### `drawPlayerSelectScreen()` — New Function
- Only appears when Rally mode is selected
- Shows "HOW MANY PLAYERS?" with 1P/2P buttons (moved from old mode select)

### `handlePlayerSelectClick(vx, vy)` — New Function
- Hit-tests the 1P/2P buttons, calls `startRallyWithPlayers(n)`

### `startRallyWithPlayers(n)` — New Function
```js
function startRallyWithPlayers(n) {
  numPlayers = n;
  if (n === 2) {
    pickerPlayer = 2;
    selectedTruck2 = (selectedTruck + 1) % ROSTER_COUNT;
    gameState = 'picker';
  } else {
    startCountdown();
  }
}
```

---

## 5. New: Game Over Screen

### `drawGameOverScreen()` — New Function
- Semi-transparent overlay on top of frozen game scene
- **"TIME'S UP!"** text with bounce animation
- **Battle mode**: Shows both trucks side-by-side with scores, announces winner ("PLAYER 1 WINS!" / "PLAYER 2 WINS!" / "IT'S A TIE!")
- **Frenzy mode**: Shows single truck, final score, total crushes count
- "TAP TO PLAY AGAIN!" blinking text — returns to mode select

---

## 6. Updated `initGame()` — Mode-Specific Settings

```js
function initGame() {
  // ... array resets unchanged ...

  // Mode-specific settings
  if (gameMode === 'frenzy' || gameMode === 'battle') {
    gameSpeed = 3.0;              // fixed medium speed (no acceleration)
    obstacleTimer = 10;           // start spawning fast immediately
    starTimer = 9999;             // no stars
    powerUpSpawnTimer = 9999;     // no power-ups
    roundTimer = 1800;            // 30 seconds at 60fps
  } else {
    gameSpeed = 2.0;              // rally: starts slow, accelerates
    obstacleTimer = 60;
    starTimer = 30;
    powerUpSpawnTimer = 150;
    roundTimer = 0;               // no timer in rally
  }
  // ... player creation unchanged ...
}
```

---

## 7. Updated `spawnObstacle()` — No Ramps in Frenzy/Battle

```js
function spawnObstacle() {
  let types;
  if (gameMode === 'frenzy' || gameMode === 'battle') {
    // No ramps — all crushable objects only
    types = ['car','car','car','suv','suv','bus',
             'barrel','barrel','portapotty','tvstack','haybale','haybale','limo','car'];
  } else {
    types = ['car','car','car','suv','ramp','ramp','bus',
             'barrel','barrel','portapotty','tvstack','haybale','haybale','limo'];
  }
  // ... rest unchanged ...
}
```

---

## 8. Updated `update()` Loop

### Speed: No acceleration in frenzy/battle
```js
if (gameMode === 'rally') {
  gameSpeed = Math.min(maxSpeed, 2.0 + maxScore / 800);
}
```

### Round timer countdown
```js
if (roundTimer > 0) {
  roundTimer--;
  if (roundTimer <= 0) {
    gameState = 'gameover';
    stopEngine();
    stopBigAir();
    return;  // stop updating
  }
}
```

### Faster obstacle spawning in frenzy/battle
```js
if (gameMode === 'frenzy' || gameMode === 'battle') {
  obstacleTimer = 15 + Math.random() * 15;   // ~4x faster than rally
} else {
  obstacleTimer = 70 + Math.random() * 60 - Math.min(maxScore / 50, 30);
}
```

### Stars and power-ups: Rally only
```js
if (gameMode === 'rally') {
  // spawn stars and power-ups
}
```

---

## 9. Updated Input Handling

### Mouse/Touch (`handleDown`):
```js
if (gameState === 'playerselect') { handlePlayerSelectClick(vc.x, vc.y); return; }
if (gameState === 'gameover') { gameState = 'modeselect'; return; }
```

### Keyboard:
```js
// New state handling
if (gameState === 'gameover') { gameState = 'modeselect'; return; }

// Mode select shortcuts
if (gameState === 'modeselect') {
  if (e.code === 'Digit1') selectMode('rally');
  if (e.code === 'Digit2') selectMode('frenzy');
  if (e.code === 'Digit3') selectMode('battle');
}
if (gameState === 'playerselect') {
  if (e.code === 'Digit1') startRallyWithPlayers(1);
  if (e.code === 'Digit2') startRallyWithPlayers(2);
}
```

Removed old `startGameWithMode` keyboard bindings.

---

## 10. Updated HUD (`drawHUD`)

### Round timer display (frenzy/battle only)
- Large countdown in seconds, centered at top
- Turns **red and shakes** when <= 5 seconds remain
- Shows mode label ("CRUSH FRENZY" or "BATTLE") above timer

### Speed bar: Rally mode only
The speed indicator bar is now wrapped in `if (gameMode === 'rally') { ... }`.

---

## 11. Updated Draw Loop

Added rendering for new game states:
```js
if (gameState === 'playerselect') drawPlayerSelectScreen();
if (gameState === 'gameover') drawGameOverScreen();
```

Game objects render behind gameover overlay:
```js
if (gameState === 'playing' || gameState === 'countdown' || gameState === 'gameover') {
  // draw game scene
}
```

---

## 12. Combo Timer: Longer in Frenzy/Battle

Combo window increased from 90 to 120 frames (1.5s to 2s) to make chaining combos easier in the fast-paced modes:
```js
p.comboTimer = (gameMode === 'frenzy' || gameMode === 'battle') ? 120 : 90;
```

---

## Removed Functions
- `startGameWithMode(mode)` — replaced by `selectMode(mode)` and `startRallyWithPlayers(n)`

## New Functions
- `selectMode(mode)` — handles mode selection routing
- `handlePlayerSelectClick(vx, vy)` — 1P/2P button clicks for Rally
- `startRallyWithPlayers(n)` — starts Rally with n players
- `drawModeSelectScreen()` — completely rewritten (3 mode buttons)
- `drawPlayerSelectScreen()` — new (1P/2P for Rally)
- `drawGameOverScreen()` — new (results + winner announcement)

## Game Flow
```
Title → Picker (P1) → Mode Select
                         ├── RALLY → Player Select (1P/2P) → [P2 Picker if 2P] → Countdown → Playing
                         ├── CRUSH FRENZY → Countdown → Playing (30s) → Game Over → Mode Select
                         └── BATTLE → P2 Picker → Countdown → Playing (30s) → Game Over → Mode Select
```
