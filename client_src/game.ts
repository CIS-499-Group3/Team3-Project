/// <reference path="../app/components/phaser/typescript/phaser.d.ts"/>
import creature = require('./creature');

class PacmanGame {
    private game: Phaser.Game;

    private player: creature.Pacman;
    private tilemap: Phaser.Tilemap;
    private layer: Phaser.TilemapLayer;
    constructor() {
        console.log("Yo!");
        this.game = new Phaser.Game(800, 600, Phaser.AUTO, 'game-div', { preload: this.preload, create: this.create, update: this.update});
    }


    // Called by phaser to preload resources.
    preload(): void {
        this.game.load.image('badpacman', 'assets/awesomePacman.png');
        this.game.load.image('testset', 'assets/testtileset.png');
        this.game.load.tilemap('tiled2', 'assets/titled2.csv', null, Phaser.Tilemap.CSV);
    }

    // Called by phaser to set up the game world.
    create(): void {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.tilemap = this.game.add.tilemap('tiled2', 40, 40, 20,15);
        this.tilemap.create('layer', 20, 15, 40, 40);
		//eventually all of these for loops will be dispensed with once we have the game loading the maps from files, but these set up a map to test collision in properly until then.
        //initializes borders of the map
		for (var i=0; i < this.tilemap.width; i++) {
			this.tilemap.putTile(0,i,0);
		}
		for (var i=0; i < this.tilemap.height; i++) {
			this.tilemap.putTile(0,0,i);
		}
		for (var i=0; i < this.tilemap.width; i++) {
			this.tilemap.putTile(0, i, this.tilemap.height-1);
		}
		for (var i=0; i < this.tilemap.height; i++) {
			this.tilemap.putTile(0, this.tilemap.width-1, i);
		}
			
		//add some collision tiles to the middle of the map
		for (var i=3; i < 10; i++) {
			this.tilemap.putTile(0,2,i);
			this.tilemap.putTile(0,4,i);
		}
		this.tilemap.putTile(0,4,10)

        this.layer = this.tilemap.createLayer('layer')
        this.tilemap.addTilesetImage('testset');


        this.tilemap.setCollision([0,1,2], true, this.layer);


        console.log(this.layer)
        //this.layer.resizeWorld()


        //this.tilemap.fill(0,0,0,20,20);
        //this.game.add.existing(this.tilemap);
        this.player = new creature.PlayerPacman(this.game, 2*this.tilemap.tileWidth, 2*this.tilemap.tileHeight);
    }

    // Called by phaser once per tick to update the game world.
    update(): void {
        this.game.physics.arcade.collide(this.player, this.layer);
        this.game.physics.arcade.collide(this.player, this.layer, (s,t) => {
            console.log("Collide " + s + " " + t)
        });
    }

}


var game: PacmanGame = new PacmanGame();
