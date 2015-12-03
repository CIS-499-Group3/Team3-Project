import map = require('./map');
export declare class Creature extends Phaser.Sprite {
    private map;
    protected speed: number;
    faceMovementDirection: boolean;
    constructor(game: Phaser.Game, map: map.PacMap, xtile: number, ytile: number, key: string);
    getMap(): map.PacMap;
    getContainingTile(): map.TileView;
    setSpeed(velocity: number): void;
    centerOnTile(): void;
    moveToTile(tile: map.TileView): void;
    changeDirection(direction: map.Direction): void;
    setFacing(direction: map.Direction): void;
    update(): void;
    explode(imagename: string, chunks?: number): void;
}
export declare class DesiredDirectionCreature extends Creature {
    protected desiredDirection: map.Direction;
    setDesiredDirection(direction: map.Direction): void;
    protected attemptDesiredDirection(): void;
}
export declare class Pacman extends DesiredDirectionCreature {
    constructor(game: Phaser.Game, map: map.PacMap, xtile: any, ytile: any);
    update(): void;
}
export declare class PlayerPacman extends Pacman {
    constructor(game: Phaser.Game, map: map.PacMap, xtile: any, ytile: any);
    update(): void;
}
export declare class Ghost extends DesiredDirectionCreature {
    afraid: boolean;
    protected currentDirection: map.Direction;
    constructor(game: Phaser.Game, map: map.PacMap, xtile: any, ytile: any, key: any);
    setGhostLook(): void;
    setDeadGhostLook(): void;
    attemptDesiredDirection(): void;
    runAway(): void;
}
export declare class RandomGhost extends Ghost {
    constructor(game: Phaser.Game, map: map.PacMap, xtile: any, ytile: any, key: any);
    update(): void;
}
export declare class SimpleGhost extends Ghost {
    protected nextTile: map.TileView;
    constructor(game: Phaser.Game, pmap: map.PacMap, xtile: any, ytile: any, key: any);
    update(): void;
    checkNextTile(): void;
}
export declare class ScanningGhost extends SimpleGhost {
    constructor(game: Phaser.Game, pmap: map.PacMap, xtile: any, ytile: any, key: any);
    update(): void;
    isInSpawnBox(): boolean;
}
export declare class SearchGhost extends Ghost {
    protected goal: map.TileView;
    protected path: map.TileView[];
    protected nextTile: map.TileView;
    constructor(game: Phaser.Game, pmap: map.PacMap, xtile: any, ytile: any, key: any);
    update(): void;
    setNewGoal(): void;
    setNewPath(): void;
    moveToNextTile(): void;
    attemptDesiredDirection(): void;
    runAway(): void;
}
export declare class CornersGhost extends SearchGhost {
    private corners;
    private count;
    constructor(game: Phaser.Game, pmap: map.PacMap, xtile: any, ytile: any, key: any);
    setNewGoal(): void;
}
export declare class CornersGhostChange extends SearchGhost {
    private corners;
    private count;
    constructor(game: Phaser.Game, pmap: map.PacMap, xtile: any, ytile: any, key: any);
    setNewGoal(): void;
}
export declare class SeekPacmanGhost extends SearchGhost {
    constructor(game: Phaser.Game, pmap: map.PacMap, xtile: any, ytile: any, key: any);
    setNewGoal(): void;
}
