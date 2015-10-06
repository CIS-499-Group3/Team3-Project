define(["require", "exports", './creature', './map', './dot'], function (require, exports, creature, map, dot) {
    var PacmanGame = (function () {
        function PacmanGame() {
            console.log("Yo!");
            this.game = new Phaser.Game(800, 600, Phaser.AUTO, 'game-div', { preload: this.preload, create: this.create, update: this.update });
            this.score = 0;
        }
        // Called by phaser to preload resources.
        PacmanGame.prototype.preload = function () {
            this.game.load.image('badpacman', 'assets/awesomePacman.png');
            //this.game.load.image('squarepacman', 'assets/squarepacman.png');
            this.game.load.atlasJSONHash('pacman', 'assets/pacmove.png', 'assets/pacmove.json');
            this.game.load.image('testset', 'assets/testtileset.png');
            this.game.load.atlasJSONHash('blinky', 'assets/blinkymove.png', 'assets/blinkymove.json');
            //this.game.load.image('blinky', 'assets/blinky.png')
            this.game.load.image('smalldot', 'assets/dot2.png');
            //this.game.load.tilemap('tiled2', 'assets/titled2.csv', null, Phaser.Tilemap.CSV);
            this.game.load.tilemap('tileset4', 'assets/tiled_4.csv', null, Phaser.Tilemap.CSV);
        };
        // Called by phaser to set up the game world.
        PacmanGame.prototype.create = function () {
            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            this.tilemap = this.game.add.tilemap('tileset4');
            //this.tilemap.create('layer', 20, 20, 32 ,32);
            //this.tilemap.putTile(1,4,4);
            this.layer = this.tilemap.createLayer('layer');
            this.tilemap.addTilesetImage('testset');
            this.tilemap.setCollision([1, 2], true, this.layer);
            this.tilemap.setCollision(0, false, this.layer); // Set floors to not collide.
            // Oddly enough, the 'score' value in the constructor doesn't hold and I don't know why.
            // Try it out:
            //console.log('Score is ' + this.score)
            this.score = 0;
            var pacMap = new map.PacMap(this.tilemap);
            //tilemap.fill(0,0,0,20,20);
            //this.game.add.existing(tilemap);
            this.player = new creature.PlayerPacman(this.game, pacMap, 4, 2);
            // Blinky, for the deliverables.
            new creature.Ghost(this.game, pacMap, 1, 1);
            this.smallDot = new dot.SmallDot(this.game, pacMap, (10 * this.tilemap.tileWidth) - 160, (10 * this.tilemap.tileHeight) - 100);
            //The score
            this.scoreText = this.game.add.text((20 * this.tilemap.tileWidth), (this.tilemap.tileHeight), 'Score:0', { fontSize: '32px', fill: '#0000FF' });
        };
        // Called by phaser once per tick to update the game world.
        PacmanGame.prototype.update = function () {
            var _this = this;
            //dot collision
            this.game.physics.arcade.overlap(this.player, this.smallDot, function (creature, dot) {
                _this.smallDot.destroy();
                //console.log(this.game)
                _this.score += 42;
                _this.scoreText.text = 'Score:' + _this.score;
            });
            this.game.physics.arcade.collide(this.player, this.layer);
            this.game.physics.arcade.collide(this.player, this.layer, function (s, t) {
                console.log("Collide " + s + " " + t);
            });
        };
        return PacmanGame;
    })();
    var game = new PacmanGame();
});
//# sourceMappingURL=game.js.map