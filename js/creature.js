var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", './map', './astarsearch'], function (require, exports, map, search) {
    var BASE_SPEED = 150;
    // Number of pixels a sprite can be away from the center of the tile to be counted as "at the center".
    // Smaller values will likely cause bugs as creatures skip over their turns.
    // Values less than ~10 also seem to allow ghosts to go through walls. The mechanism behind this isn't yet clear.
    var CENTER_TILE_EPSILON = 5;
    // A "Creature" is a sprite that moves with and understands the grid system of the pacman game.
    var Creature = (function (_super) {
        __extends(Creature, _super);
        function Creature(game, map, xtile, ytile, key) {
            var x = map.viewOf(xtile, ytile).getPixelX();
            var y = map.viewOf(xtile, ytile).getPixelY();
            _super.call(this, game, x, y, key); // Call the "Sprite" constructor.
            this.map = map;
            this.faceMovementDirection = false;
            game.physics.enable(this, Phaser.Physics.ARCADE); // Turn on basic arcade physics for creatures.
            this.anchor = new Phaser.Point(0.5, 0.5); // Set the 'origin' of the sprite to the center of it.
            game.add.existing(this); // Add ourselves to the game.
            this.centerOnTile(); // Let's avoid start-of-game weirdness by ensuring that we're in a sane starting spot.
        }
        Creature.prototype.getMap = function () {
            return this.map;
        };
        // The tile that the center of the creature is sitting in.
        Creature.prototype.getContainingTile = function () {
            // Since the anchor should be set to the middle to begin with, this.x and this.y should be at the center.
            return this.map.viewOfPixels(this.x, this.y);
        };
        // Centers the sprite on its current tile.
        Creature.prototype.centerOnTile = function () {
            this.x = this.getContainingTile().getCenterX();
            this.y = this.getContainingTile().getCenterY();
        };
        Creature.prototype.moveToTile = function (tile) {
            this.x = tile.getCenterX();
            this.y = tile.getCenterY();
        };
        // Sets the direction that the sprite is currently moving.
        Creature.prototype.changeDirection = function (direction) {
            // If this sprite turns with its movement, update the facing.
            if (this.faceMovementDirection)
                this.setFacing(direction);
            if (direction === map.Direction.NORTH) {
                this.body.velocity.y = -BASE_SPEED;
                this.body.velocity.x = 0;
            }
            else if (direction === map.Direction.SOUTH) {
                this.body.velocity.y = BASE_SPEED;
                this.body.velocity.x = 0;
            }
            else if (direction === map.Direction.EAST) {
                this.body.velocity.x = BASE_SPEED;
                this.body.velocity.y = 0;
            }
            else if (direction === map.Direction.WEST) {
                this.body.velocity.x = -BASE_SPEED;
                this.body.velocity.y = 0;
            }
            else {
                this.body.velocity.x = 0;
                this.body.velocity.y = 0;
            }
            //console.log("Change Direction", [this, direction, this.body.velocity.x, this.body.velocity.y]);
        };
        // Changes the direction that the sprite is facing.
        // Note that the default here is assumed to be the sprite facing EAST.
        Creature.prototype.setFacing = function (direction) {
            if (direction == map.Direction.WEST) {
                this.angle = 180;
            }
            else if (direction === map.Direction.EAST) {
                this.angle = 0;
            }
            else if (direction === map.Direction.SOUTH) {
                this.angle = 90;
            }
            else if (direction === map.Direction.NORTH) {
                this.angle = -90;
            }
        };
        Creature.prototype.update = function () {
        };
        Creature.prototype.explode = function (imagename, chunks) {
            //var image = new Phaser.Image(this.game, 0, 0, imagename, 0)
            if (chunks === void 0) { chunks = 10; }
            //if (!imagename){
            //    
            //}
            var emitter = this.game.add.emitter(this.x, this.y, 50);
            emitter.makeParticles(imagename);
            emitter.gravity = 0;
            emitter.start(true, 1000, null, chunks);
            this.game.time.events.add(2000, function () { return emitter.destroy(); });
            //emitter.destroy();
        };
        return Creature;
    })(Phaser.Sprite);
    exports.Creature = Creature;
    /* A DesiredDirectionCreature is a Creature that has a "desire" to
     * move in a particular direction, but will wait until an opportunity
     * is available.
     *
     * Any subclasses will need to call this.attemptDesiredDirection(), probably in update().
     */
    var DesiredDirectionCreature = (function (_super) {
        __extends(DesiredDirectionCreature, _super);
        function DesiredDirectionCreature() {
            _super.apply(this, arguments);
            this.desiredDirection = null;
        }
        DesiredDirectionCreature.prototype.setDesiredDirection = function (direction) {
            this.desiredDirection = direction;
        };
        DesiredDirectionCreature.prototype.attemptDesiredDirection = function () {
            // If we don't have a desired direction, keep on truckin
            if (this.desiredDirection == null)
                return;
            // If we're close to the center AND the direction that we want to go is clear, we may now turn.
            if (this.getContainingTile().isAtCenter(this, CENTER_TILE_EPSILON)
                && this.getContainingTile().viewDirection(this.desiredDirection).isTraversable()) {
                this.centerOnTile(); // Line ourselves up perfectly to fit.
                //turns in the direction of move.
                //this.setFacing(this.desiredDirection)
                this.animations.play('move');
                // Mythical magic code. If you don't reset the physics of the sprite, the sprite will continue
                // in its former direction for one frame. Don't ask me why, this just happened to fix it.
                // This will probably break rotation and everything else one day.
                this.body.reset(this.x, this.y);
                this.changeDirection(this.desiredDirection); // Change direction to where we wanted to go.
                this.desiredDirection = null; // Clear our desires.
            }
        };
        return DesiredDirectionCreature;
    })(Creature);
    exports.DesiredDirectionCreature = DesiredDirectionCreature;
    var Pacman = (function (_super) {
        __extends(Pacman, _super);
        function Pacman(game, map, xtile, ytile) {
            _super.call(this, game, map, xtile, ytile, "pacman");
            this.faceMovementDirection = true;
            this.scale.set(.5, .5); // This is just because our pacman image is 64x64.
            this.animations.add('move', [0, 1, 2, 1], 10, true);
        }
        return Pacman;
    })(DesiredDirectionCreature);
    exports.Pacman = Pacman;
    // Let's seperate this from the pure Pacman class, just in case we want to add multiplayer in the future.
    var PlayerPacman = (function (_super) {
        __extends(PlayerPacman, _super);
        function PlayerPacman(game, map, xtile, ytile) {
            _super.call(this, game, map, xtile, ytile);
        }
        PlayerPacman.prototype.update = function () {
            // This is called by the Sprite class once every tick.
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
                this.setDesiredDirection(map.Direction.WEST);
            }
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
                this.setDesiredDirection(map.Direction.EAST);
            }
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
                this.setDesiredDirection(map.Direction.SOUTH);
            }
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
                this.setDesiredDirection(map.Direction.NORTH);
            }
            // DEBUG control: Center pacman on tile.
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.C)) {
                this.centerOnTile();
            }
            // DEBUG control: Stop pacman entirely.
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.S)) {
                this.body.velocity.x = 0;
                this.body.velocity.y = 0;
            }
            this.attemptDesiredDirection();
        };
        return PlayerPacman;
    })(Pacman);
    exports.PlayerPacman = PlayerPacman;
    var Ghost = (function (_super) {
        __extends(Ghost, _super);
        function Ghost(game, map, xtile, ytile, key) {
            _super.call(this, game, map, xtile, ytile, key);
            this.animations.add('creep', [0, 1, 2, 3, 4, 5, 6, 7], 10, true);
            this.animations.play('creep');
        }
        return Ghost;
    })(DesiredDirectionCreature);
    exports.Ghost = Ghost;
    var RandomGhost = (function (_super) {
        __extends(RandomGhost, _super);
        function RandomGhost(game, map, xtile, ytile, key) {
            _super.call(this, game, map, xtile, ytile, key);
        }
        RandomGhost.prototype.update = function () {
            this.setDesiredDirection(map.randomDirection());
            this.attemptDesiredDirection();
        };
        return RandomGhost;
    })(Ghost);
    exports.RandomGhost = RandomGhost;
    /*
        Class that implements a simple ghost behavior.  All this does is move in a default direction until it bumps into
        a collision tile, then chooses a new, random, valid direction to travel in.
    
        This class will serve as the basis for any ghosts with a behavior that needs to track whether its current direction
        is valid.
     */
    var SimpleGhost = (function (_super) {
        __extends(SimpleGhost, _super);
        function SimpleGhost(game, pmap, xtile, ytile, key) {
            _super.call(this, game, pmap, xtile, ytile, key);
            this.currentDirection = map.Direction.EAST;
            this.setDesiredDirection(this.currentDirection);
        }
        SimpleGhost.prototype.update = function () {
            this.checkNextTile();
            //console.log([this, this.desiredDirection, this.currentDirection, this.body.velocity.x]);
            this.attemptDesiredDirection();
        };
        SimpleGhost.prototype.checkNextTile = function () {
            this.nextTile = this.getContainingTile().viewDirection(this.currentDirection);
            while (!this.nextTile.isTraversable()) {
                //console.log([this, this.currentDirection]);
                this.currentDirection = map.randomDirection();
                this.nextTile = this.getContainingTile().viewDirection(this.currentDirection);
                this.setDesiredDirection(this.currentDirection);
            }
        };
        return SimpleGhost;
    })(Ghost);
    exports.SimpleGhost = SimpleGhost;
    /*
     * Ghost that behaves largely like SimpleGhost, but attempts to leave any "spawning box" it may have started in.
     */
    var ScanningGhost = (function (_super) {
        __extends(ScanningGhost, _super);
        function ScanningGhost(game, pmap, xtile, ytile, key) {
            _super.call(this, game, pmap, xtile, ytile, key);
        }
        ScanningGhost.prototype.update = function () {
            if (this.isInSpawnBox()) {
                console.log('leaving box');
                var neighbors = this.getContainingTile().adjacent();
                for (var i = 0; i < neighbors.length; i++) {
                    if (neighbors[i].getTileId() == 0 && this.currentDirection != i) {
                        this.setDesiredDirection(i);
                        this.currentDirection = i;
                        break;
                    }
                    if (neighbors[i].isTraversable()) {
                        var twoTilesAway = neighbors[i].adjacent();
                        for (var j = 0; j < twoTilesAway.length; j++) {
                            if (twoTilesAway[j].getTileId() == 0 && this.currentDirection != i) {
                                this.setDesiredDirection(i);
                                this.currentDirection = i;
                                break;
                            }
                        }
                    }
                }
                //console.log(this.currentDirection);
                this.checkNextTile();
            }
            else
                this.checkNextTile();
            //console.log(this.desiredDirection);
            this.attemptDesiredDirection();
        };
        ScanningGhost.prototype.isInSpawnBox = function () {
            if (this.getContainingTile().getTileId() == 6
                || this.getContainingTile().getTileId() == 7
                || this.getContainingTile().getTileId() == 8
                || this.getContainingTile().getTileId() == 9)
                return true;
            else
                return false;
        };
        return ScanningGhost;
    })(SimpleGhost);
    exports.ScanningGhost = ScanningGhost;
    var SearchGhost = (function (_super) {
        __extends(SearchGhost, _super);
        function SearchGhost(game, pmap, xtile, ytile, key) {
            _super.call(this, game, pmap, xtile, ytile, key);
            this.goal = null;
            this.path = [];
            this.nextTile = null;
        }
        SearchGhost.prototype.update = function () {
            if (this.body.velocity.x == 0 && this.body.velocity.y == 0) {
                this.goal = null;
                this.nextTile = null;
            }
            //console.log('path length', this.path.length);
            if (this.goal == null) {
                this.setNewGoal();
                this.setNewPath();
            }
            while (this.nextTile == null) {
                //console.log(this.path);
                this.nextTile = this.path.pop();
                //console.log(this.nextTile);
                this.moveToNextTile();
            }
            this.attemptDesiredDirection();
        };
        SearchGhost.prototype.setNewGoal = function () {
        };
        SearchGhost.prototype.setNewPath = function () {
            //console.log('current tile', this.getContainingTile());
            //console.log('goal', this.goal);
            this.path = search.findPathToPosition(this.getContainingTile(), this.goal);
            //console.log('path', this.path);
        };
        SearchGhost.prototype.moveToNextTile = function () {
            if (this.path.length > 0) {
                this.nextTile = this.path.pop();
                var eastwest = this.nextTile.getX() - this.getContainingTile().getX();
                if (eastwest == -1) {
                    this.setDesiredDirection(map.Direction.WEST);
                }
                else if (eastwest == 1) {
                    this.setDesiredDirection(map.Direction.EAST);
                }
                else {
                    var northsouth = this.nextTile.getY() - this.getContainingTile().getY();
                    if (northsouth == -1) {
                        this.setDesiredDirection(map.Direction.NORTH);
                    }
                    else
                        this.setDesiredDirection(map.Direction.SOUTH);
                }
            }
            else {
                this.nextTile = null;
                this.goal = null;
            }
        };
        SearchGhost.prototype.attemptDesiredDirection = function () {
            _super.prototype.attemptDesiredDirection.call(this);
            if (this.getContainingTile().getTile() == this.nextTile.getTile()) {
                this.moveToNextTile();
            }
        };
        return SearchGhost;
    })(Ghost);
    exports.SearchGhost = SearchGhost;
    var CornersGhost = (function (_super) {
        __extends(CornersGhost, _super);
        function CornersGhost(game, pmap, xtile, ytile, key) {
            _super.call(this, game, pmap, xtile, ytile, key);
            this.corners = [1, 3, 0, 2];
            this.count = 0;
        }
        CornersGhost.prototype.setNewGoal = function () {
            //console.log(this);
            this.goal = this.getMap().getCorners()[this.corners[this.count % 4]];
            this.count = this.count + 1;
        };
        return CornersGhost;
    })(SearchGhost);
    exports.CornersGhost = CornersGhost;
});
//# sourceMappingURL=creature.js.map