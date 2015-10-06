
// This will need to be updated when the tileset is.
// This just gives convenient names to the tileset indexes.
export enum TileID {
    FLOOR = 0,
    WALL = 1,
    DOT_TEST = 2
}

// These tiles can be walked on by creatures.
var TRAVERSABLE_TILES = [TileID.FLOOR]

// A Pacman map. Mostly just a wrapper over tilemap that understands some pacman logic.

export class PacMap {
    private tilemap: Phaser.Tilemap;
    constructor(tilemap: Phaser.Tilemap){
        this.tilemap = tilemap;
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

    viewOf(x: number, y: number): TileView {
        return new TileView(this, x, y);
    }

    viewOfPixels(x: number, y: number): TileView {
        var tile = this.tilemap.getTileWorldXY(x, y);
        if (tile == null){
            return null;
        }
        return this.viewOf(tile.x, tile.y);
    }
}

export enum Direction {
    NORTH,
    SOUTH,
    EAST,
    WEST
}

// Represents the higher level 'view' of a tile and its neighbors.
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

    // Can a creature walk across this tile?
    isTraversable(): boolean {
        for (var id of TRAVERSABLE_TILES){
            if (this.getTileId() == id){
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

    // Gets all adjacent tiles.
    adjacent(): TileView[] {
        return [this.viewNorth(), this.viewSouth(), this.viewEast(), this.viewWest()];
    }

    // adjacentTagged(): Array<{direction: Direction, view: TileView}> {
    //     var adjs = [];
    //     for (var direction of [Direction.NORTH, Direction.SOUTH, Direction.WEST, Direction.EAST]){
    //         adjs.push({direction: direction, view: 
    //     }
    // }

    
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
}