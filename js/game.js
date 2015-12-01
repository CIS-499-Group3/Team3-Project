define(["require", "exports", './creature', './map', './dot', './util'], function (require, exports, creature, map, dot, util) {
    var PacmanGame = (function () {
        function PacmanGame() {
            console.log("Yo!");
            this.game = new Phaser.Game(800, 800, Phaser.AUTO, 'game-div', this);
            this.score = 0;
            this.lives = 3;
            //this.lives = 99;
            this.mapCount = 0;
            this.smallDotMap = [];
        }
        // Called by phaser to preload resources.
        PacmanGame.prototype.preload = function () {
            this.game.load.image('badpacman', 'assets/awesomePacman.png');
            this.game.load.atlasJSONHash('pacman', 'assets/pacmove.png', 'assets/pacmove.json');
            this.game.load.image('testset', 'assets/testtileset.png');
            this.game.load.atlasJSONHash('blinky', 'assets/blinkymove.png', 'assets/blinkymove.json');
            //this.game.load.image('blinky', 'assets/blinky.png')
            this.game.load.image('smalldot', 'assets/dot2.png');
            this.game.load.tilemap('map0', PacmanGame.mapsAssets[0], null, Phaser.Tilemap.CSV);
            this.game.load.image('pacmanchunk', 'assets/pacman_chunk.png');
        };
        // Called by phaser to set up the game world.
        PacmanGame.prototype.create = function () {
            console.log(this);
            this.initializeMap('map0');
            //The score
            this.scoreText = this.game.add.text((20 * this.map.getTilemap().tileWidth), (this.map.getTilemap().tileHeight), 'Score:0', { fontSize: '32px', fill: '#0000FF' });
            this.livesText = this.game.add.text((20 * this.map.getTilemap().tileWidth), (this.map.getTilemap().tileHeight + 40), 'AAA', { fontSize: '32px', fill: '#0000FF' });
            this.updateLivesText();
        };
        // Called by phaser once per tick to update the game world.
        PacmanGame.prototype.update = function () {
            var _this = this;
            //dot collision
            for (var _i = 0, _a = this.smallDotMap; _i < _a.length; _i++) {
                var dot = _a[_i];
                this.game.physics.arcade.overlap(this.player, dot, function (creature, dot) {
                    dot.destroy();
                    _this.score += 5;
                    _this.updateScoreText();
                    if (_this.getDotsRemaining() === 0) {
                        _this.onWin();
                    }
                });
            }
            //normal collision
            this.game.physics.arcade.collide(this.player, this.layer);
            this.game.physics.arcade.collide(this.player, this.layer, function (s, t) {
                console.log("Collide " + s + " " + t);
            });
            //PacMan Death Collsion and Reset
            this.game.physics.arcade.collide(this.player, this.blinky1, function (s, t) {
                _this.killPlayer();
            });
            this.game.physics.arcade.collide(this.player, this.blinky2, function (s, t) {
                _this.killPlayer();
            });
            // if (this.lives < 0) {
            //     this.onLose();
            // }
        };
        // How many dots are left on this map?
        PacmanGame.prototype.getDotsRemaining = function () {
            var count = 0;
            for (var _i = 0, _a = this.smallDotMap; _i < _a.length; _i++) {
                var dot = _a[_i];
                if (dot.alive) {
                    count++;
                }
            }
            return count;
        };
        // Called when the game has been won.
        PacmanGame.prototype.onWin = function () {
            var _this = this;
            this.game.physics.arcade.isPaused = true;
            this.game.time.events.add(1000, function () {
                _this.player.destroy();
                _this.blinky1.destroy();
                _this.blinky2.destroy();
                _this.map.getTilemap().destroy();
                _this.mapCount++;
                _this.game.load.tilemap('map' + _this.mapCount, PacmanGame.mapsAssets[_this.mapCount % PacmanGame.mapsAssets.length], null, Phaser.Tilemap.CSV);
                _this.game.load.start();
                _this.game.load.onLoadComplete.add(function (game) { _this.initializeMap('map' + _this.mapCount); });
            });
        };
        PacmanGame.prototype.onLose = function () {
            window.location.pathname = "lose.html";
        };
        PacmanGame.prototype.respawnPlayer = function () {
            var _this = this;
            this.player.destroy();
            this.game.time.events.add(1000, function () {
                var pacmanSpawn = util.randomChoice(_this.map.getPacmanSpawns());
                _this.player = new creature.PlayerPacman(_this.game, _this.map, pacmanSpawn.getX(), pacmanSpawn.getY());
                var blinkySpawnTile = _this.map.getBlinkySpawns()[0];
                var inkySpawnTile = _this.map.getInkySpawns()[0];
                _this.blinky1.reset(blinkySpawnTile.getCenterX(), blinkySpawnTile.getCenterY());
                _this.blinky2.reset(inkySpawnTile.getCenterX(), blinkySpawnTile.getCenterY());
            });
        };
        PacmanGame.prototype.updateScoreText = function () {
            this.scoreText.text = 'Score: ' + this.score;
        };
        PacmanGame.prototype.updateLivesText = function () {
            this.livesText.text = 'Lives: ' + this.lives;
        };
        PacmanGame.prototype.removeLife = function () {
            this.lives--;
            this.updateLivesText();
        };
        PacmanGame.prototype.killPlayer = function () {
            var _this = this;
            this.removeLife();
            this.player.explode('pacmanchunk', 20);
            if (this.lives < 0) {
                this.player.destroy();
                this.game.time.events.add(1000, function () { return _this.onLose(); });
            }
            else {
                this.respawnPlayer();
            }
        };
        PacmanGame.prototype.initializeMap = function (name) {
            var _this = this;
            var tilemap = this.game.add.tilemap(name);
            //this.tilemap.create('layer', 20, 20, 32 ,32);
            //this.tilemap.putTile(1,4,4);
            this.layer = tilemap.createLayer('layer');
            tilemap.addTilesetImage('testset');
            tilemap.setCollision(1, true, this.layer);
            tilemap.setCollision([0, 2, 3, 5], false, this.layer); // Set floors to not collide.
            // Oddly enough, the 'score' value in the constructor doesn't hold and I don't know why.
            // Try it out:
            //console.log('Score is ' + this.score);
            this.score = 0;
            var pacMap = new map.PacMap(tilemap);
            this.map = pacMap;
            // Find where pacman should spawn.
            var pacmanSpawnTile = util.randomChoice(pacMap.getPacmanSpawns());
            this.player = new creature.PlayerPacman(this.game, this.map, pacmanSpawnTile.getX(), pacmanSpawnTile.getY());
            // Blinky, for the deliverables.
            var blinkySpawnTile = pacMap.getBlinkySpawns()[0];
            var inkySpawnTile = pacMap.getInkySpawns()[0];
            this.blinky1 = new creature.CornersGhost(this.game, pacMap, blinkySpawnTile.getX(), blinkySpawnTile.getY(), "blinky");
            this.blinky2 = new creature.ScanningGhost(this.game, pacMap, inkySpawnTile.getX(), inkySpawnTile.getY(), "blinky");
            this.blinky1.body.immovable = true;
            this.blinky2.body.immovable = true;
            //this.smallDot = new dot.SmallDot(this.game, pacMap, (10*this.tilemap.tileWidth)-160, (10*this.tilemap.tileHeight)-100);
            //console.log(this.smallDotMap);
            //Initialize the list of dots from the map data.
            this.smallDotMap = [];
            var dotTiles = pacMap.allTilesWithID(map.TileID.FLOOR);
            for (var _i = 0; _i < dotTiles.length; _i++) {
                var d = dotTiles[_i];
                var x = d.getCenterX();
                var y = d.getCenterY();
                this.smallDotMap.push(new dot.SmallDot(this.game, pacMap, x, y));
            }
            //Initialize the list of Teleport Tiles
            this.teleportTiles = [];
            var tTiles = pacMap.allTilesWithID(map.TileID.TELEPORT);
            for (var _a = 0; _a < tTiles.length; _a++) {
                var tile = tTiles[_a];
                this.teleportTiles.push(tile.getTile());
            }
            //Set the special rules for teleport tiles.
            pacMap.getTilemap().setTileIndexCallback(map.TileID.TELEPORT, function (creature, tile) {
                creature.explode('pacmanchunk');
                var destination = _this.teleportTiles[(_this.teleportTiles.indexOf(tile) + 1) % _this.teleportTiles.length];
                _this.player.x = _this.player.getMap().viewOf(destination.x, destination.y).getCenterX();
                _this.player.y = _this.player.getMap().viewOf(destination.x, destination.y).getCenterY();
                if (_this.player.getContainingTile().getTile().x == 0)
                    _this.player.x = _this.player.getContainingTile().viewEast().getCenterX();
                if (_this.player.getContainingTile().getTile().x == tilemap.width - 1)
                    _this.player.x = _this.player.getContainingTile().viewWest().getCenterX();
                if (_this.player.getContainingTile().getTile().y == 0)
                    _this.player.x = _this.player.getContainingTile().viewSouth().getCenterY();
                if (_this.player.getContainingTile().getTile().y == tilemap.height - 1)
                    _this.player.x = _this.player.getContainingTile().viewWest().getCenterY();
            }, this);
            this.game.physics.startSystem(Phaser.Physics.ARCADE);
        };
        PacmanGame.mapsAssets = ['assets/original_pacman_map.csv', 'assets/original_pacman_map2.csv'];
        return PacmanGame;
    })();
    var game = new PacmanGame();
});
//# sourceMappingURL=game.js.map