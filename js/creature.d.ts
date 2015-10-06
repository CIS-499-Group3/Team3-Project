import map = require('./map');
export declare class Creature extends Phaser.Sprite {
    private map;
    constructor(game: Phaser.Game, map: map.PacMap, xtile: number, ytile: number, key: string);
    getContainingTile(): map.TileView;
    centerOnTile(): void;
    changeDirection(direction: map.Direction): void;
}
export declare class Pacman extends Creature {
    constructor(game: Phaser.Game, map: map.PacMap, xtile: any, ytile: any);
}
export declare class PlayerPacman extends Pacman {
    private desiredDirection;
    constructor(game: Phaser.Game, map: map.PacMap, xtile: any, ytile: any);
    private setDesiredDirection(direction);
    private attemptDesiredDirection();
    update(): void;
}
export declare class Ghost extends Creature {
    constructor(game: Phaser.Game, map: map.PacMap, xtile: any, ytile: any);
}
