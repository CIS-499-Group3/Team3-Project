define(["require", "exports"], function (require, exports) {
    // This will need to be updated when the tileset is.
    // This just gives convenient names to the tileset indexes.
    (function (TileID) {
        TileID[TileID["FLOOR"] = 0] = "FLOOR";
        TileID[TileID["WALL"] = 1] = "WALL";
        TileID[TileID["DOT_TEST"] = 2] = "DOT_TEST";
        TileID[TileID["DOT_TILE"] = 3] = "DOT_TILE";
        TileID[TileID["TELEPORT"] = 4] = "TELEPORT";
        TileID[TileID["PACMAN_SPAWN"] = 5] = "PACMAN_SPAWN";
        TileID[TileID["BLINKY_SPAWN"] = 6] = "BLINKY_SPAWN";
        TileID[TileID["PINKY_SPAWN"] = 7] = "PINKY_SPAWN";
        TileID[TileID["INKY_SPAWN"] = 8] = "INKY_SPAWN";
        TileID[TileID["CLYDE_SPAWN"] = 9] = "CLYDE_SPAWN";
    })(exports.TileID || (exports.TileID = {}));
    var TileID = exports.TileID;
    // These tiles can be walked on by creatures.
    var TRAVERSABLE_TILES = [TileID.FLOOR, TileID.DOT_TEST, TileID.DOT_TILE, TileID.PACMAN_SPAWN, TileID.BLINKY_SPAWN, TileID.PINKY_SPAWN, TileID.INKY_SPAWN, TileID.CLYDE_SPAWN];
    // A Pacman map. Mostly just a wrapper over tilemap that understands some pacman logic.
    var PacMap = (function () {
        function PacMap(tilemap) {
            this.tilemap = tilemap;
        }
        PacMap.prototype.getCorners = function () {
            var qq = [this.viewOf(1, 1), this.viewOf(this.getWidth() - 2, 1), this.viewOf(1, this.getHeight() - 2),
                this.viewOf(this.getWidth() - 2, this.getHeight() - 2)];
            console.log(qq);
            return qq;
        };
        PacMap.prototype.getTilemap = function () {
            return this.tilemap;
        };
        PacMap.prototype.getHeight = function () {
            return this.tilemap.height;
        };
        PacMap.prototype.getWidth = function () {
            return this.tilemap.width;
        };
        // Returns the TileView at a set of tile coordinates.
        PacMap.prototype.viewOf = function (x, y) {
            return new TileView(this, x, y);
        };
        // Returns the TileView at a certain pixel coordinate.
        PacMap.prototype.viewOfPixels = function (x, y) {
            var tile = this.tilemap.getTileWorldXY(x, y);
            if (tile == null) {
                return null;
            }
            return this.viewOf(tile.x, tile.y);
        };
        // Applies callback to every tile in the map.
        PacMap.prototype.forEachView = function (callback) {
            var _this = this;
            this.tilemap.forEach(function (tile) {
                callback(_this.viewOf(tile.x, tile.y));
            }, 0, 0, 0, this.tilemap.width, this.tilemap.height);
        };
        // Get all tiles with a certain ID.
        PacMap.prototype.allTilesWithID = function (id) {
            var matchingTiles = [];
            this.forEachView(function (tileView) {
                if (tileView.getTile().index === id) {
                    matchingTiles.push(tileView);
                }
            });
            return matchingTiles;
        };
        PacMap.prototype.getBlinkySpawns = function () {
            return this.allTilesWithID(TileID.BLINKY_SPAWN);
        };
        PacMap.prototype.getInkySpawns = function () {
            return this.allTilesWithID(TileID.INKY_SPAWN);
        };
        PacMap.prototype.getPinkySpawns = function () {
            return this.allTilesWithID(TileID.PINKY_SPAWN);
        };
        PacMap.prototype.getClydeSpawns = function () {
            return this.allTilesWithID(TileID.CLYDE_SPAWN);
        };
        PacMap.prototype.getPacmanSpawns = function () {
            return this.allTilesWithID(TileID.PACMAN_SPAWN);
        };
        PacMap.prototype.reportPacmanPosition = function (tile) {
            this.reportedPacmanPosition = tile;
        };
        PacMap.prototype.getReportedPacmanPosition = function () {
            return this.reportedPacmanPosition;
        };
        return PacMap;
    })();
    exports.PacMap = PacMap;
    (function (Direction) {
        Direction[Direction["NORTH"] = 0] = "NORTH";
        Direction[Direction["SOUTH"] = 1] = "SOUTH";
        Direction[Direction["EAST"] = 2] = "EAST";
        Direction[Direction["WEST"] = 3] = "WEST";
    })(exports.Direction || (exports.Direction = {}));
    var Direction = exports.Direction;
    function randomDirection() {
        return Math.floor(Math.random() * 4);
    }
    exports.randomDirection = randomDirection;
    // Represents a higher level 'view' of a tile and its neighbors.
    var TileView = (function () {
        function TileView(map, x, y) {
            this.x = x;
            this.y = y;
            this.map = map;
        }
        TileView.prototype.getTile = function () {
            var tile = this.map.getTilemap().getTile(this.x, this.y);
            if (tile === null) {
                return this.map.getTilemap().getTile(0, 0);
            }
            return tile;
        };
        // Gets the tileset index of the tile.
        TileView.prototype.getTileId = function () {
            return this.getTile().index;
        };
        TileView.prototype.getX = function () {
            return this.getTile().x;
        };
        TileView.prototype.getY = function () {
            return this.getTile().y;
        };
        // Can a creature walk across this tile?
        TileView.prototype.isTraversable = function () {
            for (var _i = 0; _i < TRAVERSABLE_TILES.length; _i++) {
                var id = TRAVERSABLE_TILES[_i];
                if (this.getTileId() === id) {
                    //console.log(this.getTileId() + " Can be walked on");
                    return true;
                }
            }
            return false;
        };
        TileView.prototype.viewNorth = function () {
            return this.map.viewOf(this.x, this.y - 1);
        };
        TileView.prototype.viewSouth = function () {
            return this.map.viewOf(this.x, this.y + 1);
        };
        TileView.prototype.viewEast = function () {
            return this.map.viewOf(this.x + 1, this.y);
        };
        TileView.prototype.viewWest = function () {
            return this.map.viewOf(this.x - 1, this.y);
        };
        TileView.prototype.viewDirection = function (direction) {
            if (direction === Direction.NORTH)
                return this.viewNorth();
            if (direction === Direction.SOUTH)
                return this.viewSouth();
            if (direction === Direction.EAST)
                return this.viewEast();
            if (direction === Direction.WEST)
                return this.viewWest();
        };
        // Gets all adjacent tiles.
        TileView.prototype.adjacent = function () {
            return [this.viewNorth(), this.viewSouth(), this.viewEast(), this.viewWest()];
        };
        // Gets all directions from this tile that can be traversed by a creature.
        TileView.prototype.getTraversableDirections = function () {
            var directions = [];
            var north = this.viewNorth();
            var south = this.viewSouth();
            var east = this.viewEast();
            var west = this.viewWest();
            if (north.isTraversable())
                directions.push(Direction.NORTH);
            if (south.isTraversable())
                directions.push(Direction.SOUTH);
            if (east.isTraversable())
                directions.push(Direction.EAST);
            if (west.isTraversable())
                directions.push(Direction.WEST);
            return directions;
        };
        // Top left corner of the tile in world pixels.
        TileView.prototype.getPixelX = function () {
            return this.getTile().worldX;
        };
        // Top left corner of the tile in world pixels.
        TileView.prototype.getPixelY = function () {
            return this.getTile().worldY;
        };
        // Center of the tile in world pixels.
        TileView.prototype.getCenterX = function () {
            return this.getTile().centerX + this.getPixelX();
        };
        // Center of the tile in world pixels
        TileView.prototype.getCenterY = function () {
            return this.getTile().centerY + this.getPixelY();
        };
        // Measures the distance of an object from the center of the tile.
        TileView.prototype.distanceFromCenter = function (obj) {
            return Phaser.Point.distance(new Phaser.Point(this.getCenterX(), this.getCenterY()), obj);
        };
        // Is an object within epsilon pixels of the center?
        TileView.prototype.isAtCenter = function (obj, epsilon) {
            return this.distanceFromCenter(obj) < epsilon;
        };
        TileView.prototype.toString = function () {
            return '(' + this.getX().toString() + ',' + this.getY().toString() + ')';
        };
        return TileView;
    })();
    exports.TileView = TileView;
});
//# sourceMappingURL=map.js.map