import map = require('./map');
export declare class Dot extends Phaser.Sprite {
    private map;
    constructor(game: Phaser.Game, map: map.PacMap, xtile: any, ytile: any, key: string);
    getContainingTile(): void;
}
export declare class SmallDot extends Dot {
    constructor(game: Phaser.Game, map: map.PacMap, xtile: any, ytile: any);
}
export declare class LargeDot extends Dot {
    constructor(game: Phaser.Game, map: map.PacMap, xtile: any, ytile: any);
}
