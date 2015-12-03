export declare enum TileID {
    FLOOR = 0,
    WALL = 1,
    DOT_TEST = 2,
    DOT_TILE = 3,
    TELEPORT = 4,
    PACMAN_SPAWN = 5,
    BLINKY_SPAWN = 6,
    PINKY_SPAWN = 7,
    INKY_SPAWN = 8,
    CLYDE_SPAWN = 9,
}
export declare class PacMap {
    private tilemap;
    private reportedPacmanPosition;
    constructor(tilemap: Phaser.Tilemap);
    getCorners(): TileView[];
    getTilemap(): Phaser.Tilemap;
    getHeight(): number;
    getWidth(): number;
    viewOf(x: number, y: number): TileView;
    viewOfPixels(x: number, y: number): TileView;
    forEachView(callback: (tile: TileView) => void): void;
    allTilesWithID(id: TileID): TileView[];
    getBlinkySpawns(): TileView[];
    getInkySpawns(): TileView[];
    getPinkySpawns(): TileView[];
    getClydeSpawns(): TileView[];
    getPacmanSpawns(): TileView[];
    reportPacmanPosition(tile: TileView): void;
    getReportedPacmanPosition(): TileView;
}
export declare enum Direction {
    NORTH = 0,
    SOUTH = 1,
    EAST = 2,
    WEST = 3,
}
export declare function randomDirection(): Direction;
export declare class TileView {
    private x;
    private y;
    private map;
    constructor(map: PacMap, x: number, y: number);
    getTile(): Phaser.Tile;
    getTileId(): TileID;
    getX(): number;
    getY(): number;
    isTraversable(): boolean;
    viewNorth(): TileView;
    viewSouth(): TileView;
    viewEast(): TileView;
    viewWest(): TileView;
    viewDirection(direction: Direction): TileView;
    adjacent(): TileView[];
    getTraversableDirections(): Direction[];
    getPixelX(): number;
    getPixelY(): number;
    getCenterX(): number;
    getCenterY(): number;
    distanceFromCenter(obj: {
        x: number;
        y: number;
    }): number;
    isAtCenter(obj: {
        x: number;
        y: number;
    }, epsilon: number): boolean;
    toString(): string;
}
