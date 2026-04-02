# Night Dock Moon Fix

Read CLAUDE.md first.

## Task

In `games/catch-and-reel/index.html`, find the Night Dock / Wooden Dock background drawing code where the moon is rendered on the Canvas.

**Two changes:**

1. **Lower the moon** — move it down so it sits closer to the horizon/treeline rather than high in the sky. Adjust the y-coordinate downward.
2. **Make it bigger** — increase the moon's radius by roughly 40-50%. If it's currently ~15px, make it ~22px. If ~20px, make it ~30px. Use your judgment based on the current value.

The moon should feel like a big low-hanging harvest moon near the horizon, not a tiny dot in the upper sky.

**No other changes.** Visual only — no physics, no gameplay, no other locations affected.

Syntax check after: `node -e "try { new (require('vm').Script)(require('fs').readFileSync('games/catch-and-reel/index.html','utf8')); console.log('SYNTAX OK'); } catch(e) { console.log('ERROR:', e.message); }"`
