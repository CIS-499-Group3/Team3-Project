/// <reference path="../app/components/phaser/typescript/phaser.d.ts"/>
import creature = require('./creature');
import map = require('./map');
import dot = require('./dot');

class PacmanGame {
    private game: Phaser.Game;

    private player: creature.Pacman;
    private blinky1: creature.CornersGhost;
    private blinky2: creature.SimpleGhost;
    private tilemap: Phaser.Tilemap;
    private smallDotMap: dot.SmallDot[];
    private teleportTiles: Phaser.Tile[];
    private layer: Phaser.TilemapLayer;

    public score: number;
    private scoreText;

    constructor() {
        console.log("Yo!");
        this.game = new Phaser.Game(800, 800, Phaser.AUTO, 'game-div', this);
        this.score = 0;
        this.smallDotMap = [];
        
    }
    
    
    

    // Called by phaser to preload resources.
    preload(): void {
        
        this.game.load.image('badpacman', 'assets/awesomePacman.png');
        this.game.load.atlasJSONHash('pacman', 'assets/pacmove.png', 'assets/pacmove.json')
        this.game.load.image('testset', 'assets/testtileset.png');
        this.game.load.atlasJSONHash('blinky', 'assets/blinkymove.png', 'assets/blinkymove.json')
        //this.game.load.image('blinky', 'assets/blinky.png')
        this.game.load.image('smalldot', 'assets/dot2.png');
        this.game.load.tilemap('tileset', 'assets/original_pacman_map.csv', null, Phaser.Tilemap.CSV);
    }



    // Called by phaser to set up the game world.
    create(): void {
        console.log(this)
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.tilemap = this.game.add.tilemap('tileset');
        //this.tilemap.create('layer', 20, 20, 32 ,32);
        //this.tilemap.putTile(1,4,4);

        this.layer = this.tilemap.createLayer('layer');
        this.tilemap.addTilesetImage('testset');


        this.tilemap.setCollision(1, true, this.layer);
        this.tilemap.setCollision([0,2,3,5], false, this.layer); // Set floors to not collide.

        // Oddly enough, the 'score' value in the constructor doesn't hold and I don't know why.
        // Try it out:
        //console.log('Score is ' + this.score);
        this.score = 0;

        var pacMap: map.PacMap = new map.PacMap(this.tilemap);

        // Find where pacman should spawn.
        let pacmanSpawnTile = pacMap.getPacmanSpawns()[0];
        console.log("Spawn tile: ", pacmanSpawnTile.getX(), pacmanSpawnTile.getY())
        this.player = new creature.PlayerPacman(this.game, pacMap, pacmanSpawnTile.getX(), pacmanSpawnTile.getY());
        
        // Blinky, for the deliverables.
		let blinkySpawnTile = pacMap.getBlinkySpawns() [0];
		let inkySpawnTile = pacMap.getInkySpawns() [0];
        this.blinky1 = new creature.CornersGhost(this.game, pacMap, blinkySpawnTile.getX(), blinkySpawnTile.getY(), "blinky");
        this.blinky2 =new creature.SimpleGhost(this.game, pacMap, inkySpawnTile.getX(), inkySpawnTile.getY(), "blinky");

        //this.smallDot = new dot.SmallDot(this.game, pacMap, (10*this.tilemap.tileWidth)-160, (10*this.tilemap.tileHeight)-100);
        //console.log(this.smallDotMap);

        //Initialize the list of dots from the map data.
        this.smallDotMap = [];
        var dotTiles = pacMap.allTilesWithID(map.TileID.FLOOR);
        for (var i=0; i<dotTiles.length; i++){
            var x = dotTiles[i].getCenterX();
            var y = dotTiles[i].getCenterY();
            this.smallDotMap.push(new dot.SmallDot(this.game, pacMap, x, y));
        }
        console.log(this.smallDotMap);

        //Initialize the list of Teleport Tiles
        this.teleportTiles = [];
        let tTiles = pacMap.allTilesWithID(map.TileID.TELEPORT);
        for (var i=0; i<tTiles.length; i++)
            this.teleportTiles.push(tTiles[i].getTile());

        //Set the special rules for teleport tiles.
        pacMap.getTilemap().setTileIndexCallback(4, (creature, tile) => {
            let destination = this.teleportTiles[(this.teleportTiles.indexOf(tile)+1)%this.teleportTiles.length];
            this.player.x = this.player.getMap().viewOf(destination.x, destination.y).getCenterX();
            this.player.y = this.player.getMap().viewOf(destination.x, destination.y).getCenterY();
            if (this.player.getContainingTile().getTile().x == 0)
                this.player.x = this.player.getContainingTile().viewEast().getCenterX();
            if (this.player.getContainingTile().getTile().x == this.tilemap.width-1)
                this.player.x = this.player.getContainingTile().viewWest().getCenterX();
            if (this.player.getContainingTile().getTile().y == 0)
                this.player.x = this.player.getContainingTile().viewSouth().getCenterY();
            if (this.player.getContainingTile().getTile().y == this.tilemap.height-1)
                this.player.x = this.player.getContainingTile().viewWest().getCenterY();
        }, this);
        console.log(this.teleportTiles);

        //The score
        this.scoreText = this.game.add.text((20*this.tilemap.tileWidth), (this.tilemap.tileHeight), 'Score:0', { fontSize: '32px', fill: '#0000FF' });
    }
    
    //qq(): void {}
    //public qq = function () {};
    
    
    // Called by phaser once per tick to update the game world.
    public update(): void {
        //dot collision
        for(var i=0; i<this.smallDotMap.length; i++) {
            this.game.physics.arcade.overlap(this.player, this.smallDotMap[i], (creature, dot) => {
                this.smallDotMap[i].destroy();
                console.log(this.getDotsRemaining());
                this.score += 5;
                this.scoreText.text = 'Score:' + this.score;
            });
        }

        //normal collision
        this.game.physics.arcade.collide(this.player, this.layer);
        this.game.physics.arcade.collide(this.player, this.layer, (s,t) => {
            console.log("Collide " + s + " " + t)
        });

        //PacMan Death Collsion and Reset
        if ((Math.abs(this.player.x - this.blinky1.x) < 20 && Math.abs(this.player.y - this.blinky1.y) < 20)) {
            this.player.reset(304, 368)

        }

        if ((Math.abs(this.player.x - this.blinky2.x) < 20 && Math.abs(this.player.y - this.blinky2.y) < 20)) {
            this.player.reset(304, 368)

        }

    }

    public getDotsRemaining(): number {
        var count: number = 0;
        for (var dot of this.smallDotMap){
            if (dot.alive) {
                count++;
            }
        }
        return count;
    }


    
}


let game: PacmanGame = new PacmanGame();
