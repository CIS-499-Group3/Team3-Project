/// <reference path="../app/components/phaser/typescript/phaser.d.ts"/>
import creature = require('./creature');
import map = require('./map');
import dot = require('./dot');

class PacmanGame {
    private game: Phaser.Game;

    private player: creature.Pacman;
    private tilemap: Phaser.Tilemap;
    private smallDotMap: dot.SmallDot[];
    private layer: Phaser.TilemapLayer;

    public score: number;
    private scoreText;

    constructor() {
        console.log("Yo!");
        this.game = new Phaser.Game(800, 800, Phaser.AUTO, 'game-div', { preload: this.preload, create: this.create, update: this.update});
        this.score = 0;
        this.smallDotMap = [];
    }


    // Called by phaser to preload resources.
    preload(): void {
        this.game.load.image('badpacman', 'assets/awesomePacman.png');
        this.game.load.atlasJSONHash('pacman', 'assets/pacmove.png', 'assets/pacmove.json')
        this.game.load.image('testset', 'assets/testtileset2.png');
        this.game.load.atlasJSONHash('blinky', 'assets/blinkymove.png', 'assets/blinkymove.json')
        //this.game.load.image('blinky', 'assets/blinky.png')
        this.game.load.image('smalldot', 'assets/dot2.png');
        this.game.load.tilemap('tileset', 'assets/test_map_5.csv', null, Phaser.Tilemap.CSV);
    }



    // Called by phaser to set up the game world.
    create(): void {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.tilemap = this.game.add.tilemap('tileset');
        //this.tilemap.create('layer', 20, 20, 32 ,32);
        //this.tilemap.putTile(1,4,4);

        this.layer = this.tilemap.createLayer('layer')
        this.tilemap.addTilesetImage('testset');


        this.tilemap.setCollision(1, true, this.layer);
        this.tilemap.setCollision([0,2,3,4,5], false, this.layer); // Set floors to not collide.

        // Oddly enough, the 'score' value in the constructor doesn't hold and I don't know why.
        // Try it out:
        //console.log('Score is ' + this.score)
        this.score = 0;

        let pacMap: map.PacMap = new map.PacMap(this.tilemap);

        // Find where pacman should spawn.
        let pacmanSpawnTile = pacMap.getPacmanSpawns()[0];
        console.log("Spawn tile: ", pacmanSpawnTile.getX(), pacmanSpawnTile.getY())
        this.player = new creature.PlayerPacman(this.game, pacMap, pacmanSpawnTile.getX(), pacmanSpawnTile.getY());

        // Blinky, for the deliverables.
        new creature.CornersGhost(this.game, pacMap, 1, 2, "blinky");
        new creature.SimpleGhost(this.game, pacMap, 1, 1, "blinky");

        //this.smallDot = new dot.SmallDot(this.game, pacMap, (10*this.tilemap.tileWidth)-160, (10*this.tilemap.tileHeight)-100);
        //console.log(this.smallDotMap);
        this.smallDotMap = [];
        var dotTiles = pacMap.allTilesWithID(map.TileID.DOT_TILE);
        for (var i=0; i<dotTiles.length; i++){
            var x = dotTiles[i].getCenterX();
            var y = dotTiles[i].getCenterY();
            this.smallDotMap.push(new dot.SmallDot(this.game, pacMap, x, y));
        }
        console.log(this.smallDotMap);

        //The score
        this.scoreText = this.game.add.text((20*this.tilemap.tileWidth), (this.tilemap.tileHeight), 'Score:0', { fontSize: '32px', fill: '#0000FF' });
    }

    // Called by phaser once per tick to update the game world.
    update(): void {
        //dot collision
        for(var i=0; i<this.smallDotMap.length; i++) {
            this.game.physics.arcade.overlap(this.player, this.smallDotMap[i], (creature, dot) => {
                this.smallDotMap[i].destroy();
                //console.log(this.game)
                this.score += 5;
                this.scoreText.text = 'Score:' + this.score;
            });
        }

        this.game.physics.arcade.collide(this.player, this.layer);
        this.game.physics.arcade.collide(this.player, this.layer, (s,t) => {
            console.log("Collide " + s + " " + t)
        });
    }
}


let game: PacmanGame = new PacmanGame();
