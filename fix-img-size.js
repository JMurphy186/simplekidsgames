const fs = require('fs');
let game = fs.readFileSync('games/catch-and-reel/index.html', 'utf8');

const old1 = 'max-width:160px;max-height:100px;width:auto;height:auto;object-fit:contain;';
const fix1 = 'width:160px;height:100px;object-fit:contain;';
const c1 = game.split(old1).length - 1;
game = game.split(old1).join(fix1);

const old2 = 'max-width:80px;max-height:50px;width:auto;height:auto;object-fit:contain;';
const fix2 = 'width:80px;height:50px;object-fit:contain;';
const c2 = game.split(old2).length - 1;
game = game.split(old2).join(fix2);

const remaining = game.includes('width:auto;height:auto;object-fit:contain');
console.log('160x100 replacements:', c1);
console.log('80x50 replacements:', c2);
console.log('Any old style remaining:', remaining);

fs.writeFileSync('games/catch-and-reel/index.html', game);
console.log('Saved!');
