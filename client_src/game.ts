/// <reference path="../app/components/phaser/typescript/phaser.d.ts"/>
import creature = require('./creature');
import map = require('./map');
import dot = require('./dot');

class PacmanGame {
    private game: Phaser.Game;

    private player: creature.Pacman;
    private tilemap: Phaser.Tilemap;
    private smallDot: dot.SmallDot;
    private layer: Phaser.TilemapLayer;
    constructor() {
        console.log("Yo!");
        this.game = new Phaser.Game(800, 600, Phaser.AUTO, 'game-div', { preload: this.preload, create: this.create, update: this.update});
    }


    // Called by phaser to preload resources.
    preload(): void {
        this.game.load.image('badpacman', 'assets/awesomePacman.png');
        this.game.load.image('squarepacman', 'assets/squarepacman.png');
        this.game.load.image('testset', 'assets/testtileset.png');
        this.game.load.image('blinky', 'assets/blinky.png')
        this.game.load.image('smalldot', 'assets/dot2.png');
        //this.game.load.tilemap('tiled2', 'assets/titled2.csv', null, Phaser.Tilemap.CSV);
        this.game.load.tilemap('tileset4', 'assets/tiled_4.csv', null, Phaser.Tilemap.CSV);
    }

    // Called by phaser to set up the game world.
    create(): void {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.tilemap = this.game.add.tilemap('tileset4');
        //this.tilemap.create('layer', 20, 20, 32 ,32);
        //this.tilemap.putTile(1,4,4);

        this.layer = this.tilemap.createLayer('layer')
        this.tilemap.addTilesetImage('testset');


        this.tilemap.setCollision([1,2], true, this.layer);
        this.tilemap.setCollision(0,false, this.layer); // Set floors to not collide.


        console.log(this.layer)
        //this.layer.resizeWorld()

        var pacMap: map.PacMap = new map.PacMap(this.tilemap);

        //tilemap.fill(0,0,0,20,20);
        //this.game.add.existing(tilemap);
        this.player = new creature.PlayerPacman(this.game, pacMap, (10*this.tilemap.tileWidth)-40, (10*this.tilemap.tileHeight)-40);

        new creature.Ghost(this.game, pacMap, 50, 50);
        
        this.smallDot = new dot.SmallDot(this.game, pacMap, (10*this.tilemap.tileWidth)-160, (10*this.tilemap.tileHeight)-100);
    }

    // Called by phaser once per tick to update the game world.
    update(): void {
    
            this.game.physics.arcade.overlap(this.player, this.smallDot, collectDot, null, this);
        this.game.physics.arcade.collide(this.player, this.layer);
        this.game.physics.arcade.collide(this.player, this.layer, (s,t) => {
            console.log("Collide " + s + " " + t)
            //dot collision
            
        });
    }

}
function collectDot(Creature, Dot){
this.smallDot.destroy();

}
var game: PacmanGame = new PacmanGame();
