
// This will need to be updated when the tileset is.
// This just gives convenient names to the tileset indexes.
export enum TileID {
    FLOOR = 0,
    WALL = 1,
    DOT_TEST = 2,
    DOT_TILE = 3,
    TELEPORT = 4,
    PACMAN_SPAWN = 5,
		BLINKY_SPAWN = 6,
		PINKY_SPAWN = 7,
		INKY_SPAWN = 8,
		CLYDE_SPAWN = 9
}

// These tiles can be walked on by creatures.
var TRAVERSABLE_TILES = [TileID.FLOOR, TileID.DOT_TEST, TileID.DOT_TILE, TileID.PACMAN_SPAWN, TileID.BLINKY_SPAWN, TileID.PINKY_SPAWN, TileID.INKY_SPAWN, TileID.CLYDE_SPAWN]

// A Pacman map. Mostly just a wrapper over tilemap that understands some pacman logic.

export class PacMap {
    private tilemap: Phaser.Tilemap;
    constructor(tilemap: Phaser.Tilemap){
        this.tilemap = tilemap;
    }

    getCorners(): TileView[] {
        return [this.viewOf(1, 1), this.viewOf(this.getWidth()-2, 1), this.viewOf(1, this.getHeight()-2),
            this.viewOf(this.getHeight()-2, this.getWidth()-2)]
    }

    getTilemap(): Phaser.Tilemap {
        return this.tilemap;
    }

    getHeight(): number {
        return this.tilemap.height;
    }

    getWidth(): number {
        return this.tilemap.width;
    }

    // Returns the TileView at a set of tile coordinates.
    viewOf(x: number, y: number): TileView {
        return new TileView(this, x, y);
    }

    // Returns the TileView at a certain pixel coordinate.
    viewOfPixels(x: number, y: number): TileView {
        var tile = this.tilemap.getTileWorldXY(x, y);
        if (tile == null){
            return null;
        }
        return this.viewOf(tile.x, tile.y);
    }

    // Applies callback to every tile in the map.
    forEachView(callback: (tile: TileView) => void){
        this.tilemap.forEach(tile => {
            callback(this.viewOf(tile.x, tile.y));
        }, 0, 0, 0, this.tilemap.width, this.tilemap.height);
    }

    // Get all tiles with a certain ID.
    allTilesWithID(id: TileID): TileView[] {
        var matchingTiles: TileView[] = [];
        this.forEachView(tileView => {
            if (tileView.getTile().index === id){
                matchingTiles.push(tileView);
            }
        });

        return matchingTiles;
    }
	getBlinkySpawns(): TileView[] {
			return this.allTilesWithID(TileID.BLINKY_SPAWN);
	}
	getInkySpawns(): TileView[] {
			return this.allTilesWithID(TileID.INKY_SPAWN);
	}
	getPinkySpawns(): TileView[] {
			return this.allTilesWithID(TileID.PINKY_SPAWN);
	}
	getClydeSpawns(): TileView[] {
			return this.allTilesWithID(TileID.CLYDE_SPAWN);
	}
    getPacmanSpawns(): TileView[] {
        return this.allTilesWithID(TileID.PACMAN_SPAWN);
    }
}

export enum Direction {
    NORTH,
    SOUTH,
    EAST,
    WEST
}

export function randomDirection(): Direction {
    return Math.floor(Math.random() * 4);
}

// Represents a higher level 'view' of a tile and its neighbors.
export class TileView {
    private x: number;
    private y: number;
    private map: PacMap;

    constructor(map: PacMap, x: number, y: number){
        this.x = x;
        this.y = y;
        this.map = map;
    }

    getTile(): Phaser.Tile {
        return this.map.getTilemap().getTile(this.x, this.y);
    }

    // Gets the tileset index of the tile.
    getTileId(): TileID {
        return this.getTile().index;
    }

    getX(): number {
        return this.getTile().x;
    }

    getY(): number {
        return this.getTile().y;
    }

    // Can a creature walk across this tile?
    isTraversable(): boolean {
        for (var id of TRAVERSABLE_TILES){
            if (this.getTileId() === id){
                //console.log(this.getTileId() + " Can be walked on");
                return true;
            }
        }
        return false;
    }

    viewNorth(): TileView {
        return this.map.viewOf(this.x, this.y - 1);
    }

    viewSouth(): TileView {
        return this.map.viewOf(this.x, this.y + 1);
    }

    viewEast(): TileView {
        return this.map.viewOf(this.x + 1, this.y);
    }

    viewWest(): TileView {
        return this.map.viewOf(this.x - 1, this.y);
    }

    viewDirection(direction: Direction): TileView {
        if (direction === Direction.NORTH) return this.viewNorth();
        if (direction === Direction.SOUTH) return this.viewSouth();
        if (direction === Direction.EAST) return this.viewEast();
        if (direction === Direction.WEST) return this.viewWest();
    }
    // Gets all adjacent tiles.
    adjacent(): TileView[] {
        return [this.viewNorth(), this.viewSouth(), this.viewEast(), this.viewWest()];
    }

    // Gets all directions from this tile that can be traversed by a creature.
    getTraversableDirections(): Direction[] {
        var directions: Direction[] = [];
        var north = this.viewNorth();
        var south = this.viewSouth();
        var east = this.viewEast();
        var west = this.viewWest();

        if (north.isTraversable()) directions.push(Direction.NORTH);
        if (south.isTraversable()) directions.push(Direction.SOUTH);
        if (east.isTraversable()) directions.push(Direction.EAST);
        if (west.isTraversable()) directions.push(Direction.WEST);
        return directions;
    }

    // Top left corner of the tile in world pixels.
    getPixelX(): number {
        return this.getTile().worldX;
    }

    // Top left corner of the tile in world pixels.
    getPixelY(): number {
        return this.getTile().worldY;
    }

    // Center of the tile in world pixels.
    getCenterX(): number {
        return this.getTile().centerX + this.getPixelX();
    }

    // Center of the tile in world pixels
    getCenterY(): number {
        return this.getTile().centerY + this.getPixelY();
    }

    // Measures the distance of an object from the center of the tile.
    distanceFromCenter(obj: {x: number, y: number}): number {
        return Phaser.Point.distance(new Phaser.Point(this.getCenterX(), this.getCenterY()), obj);
    }

    // Is an object within epsilon pixels of the center?
    isAtCenter(obj: {x: number, y: number}, epsilon: number): boolean {
        return this.distanceFromCenter(obj) < epsilon;
    }

    toString(): string{
        return '(' + this.getX().toString() + ',' + this.getY().toString() + ')';
    }
}
