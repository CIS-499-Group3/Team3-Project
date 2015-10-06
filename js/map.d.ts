export declare enum TileID {
    FLOOR = 0,
    WALL = 1,
    DOT_TEST = 2,
}
export declare class PacMap {
    private tilemap;
    constructor(tilemap: Phaser.Tilemap);
    getTilemap(): Phaser.Tilemap;
    getHeight(): number;
    getWidth(): number;
    viewOf(x: number, y: number): TileView;
    viewOfPixels(x: number, y: number): TileView;
}
export declare enum Direction {
    NORTH = 0,
    SOUTH = 1,
    EAST = 2,
    WEST = 3,
}
export declare class TileView {
    private x;
    private y;
    private map;
    constructor(map: PacMap, x: number, y: number);
    getTile(): Phaser.Tile;
    getTileId(): TileID;
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
}
