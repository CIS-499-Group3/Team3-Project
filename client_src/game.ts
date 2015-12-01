/// <reference path="../app/components/phaser/typescript/phaser.d.ts"/>
import creature = require('./creature');
import map = require('./map');
import dot = require('./dot');
import util = require('./util');



class PacmanGame {
    static mapsAssets: string[] = ['assets/original_pacman_map.csv', 'assets/original_pacman_map2.csv'];
    private game: Phaser.Game;

    private player: creature.Pacman;
    private blinky1: creature.CornersGhost;
    private inky1: creature.SimpleGhost;
		private pinky1: creature.CornersGhostChange;
		private clyde1: creature.SimpleGhost;
    private smallDotMap: dot.SmallDot[];
    private teleportTiles: Phaser.Tile[];
    private layer: Phaser.TilemapLayer;

    private map: map.PacMap;

    public score: number;
    public lives: number;
    private mapCount: number;
    private scoreText;
    private livesText;

    constructor() {
        console.log("Yo!");
        this.game = new Phaser.Game(800, 800, Phaser.AUTO, 'game-div', this);
        this.score = 0;
        this.lives = 3;
        //this.lives = 99;
        this.mapCount = 0;
        this.smallDotMap = [];
    }
    
    // Called by phaser to preload resources.
    preload(): void {
        this.game.load.image('badpacman', 'assets/awesomePacman.png');
        this.game.load.atlasJSONHash('pacman', 'assets/pacmove.png', 'assets/pacmove.json')
        this.game.load.image('testset', 'assets/testtileset.png');
        this.game.load.atlasJSONHash('blinky', 'assets/blinky/blinkymove.png', 'assets/blinky/blinkymove.json')
        //this.game.load.image('blinky', 'assets/blinky.png')
				this.game.load.atlasJSONHash('inky', 'assets/inky/inkymove.png', 'assets/inky/inkymove.json')
        this.game.load.atlasJSONHash('pinky', 'assets/pinky/pinkymove.png', 'assets/pinky/pinkymove.json')
				this.game.load.atlasJSONHash('clyde', 'assets/clyde/clydemove.png', 'assets/clyde/clydemove.json')
				this.game.load.image('smalldot', 'assets/dot2.png');
        this.game.load.tilemap('map0', PacmanGame.mapsAssets[0], null, Phaser.Tilemap.CSV);
        this.game.load.image('pacmanchunk', 'assets/pacman_chunk.png');
    }



    // Called by phaser to set up the game world.
    create(): void {
        console.log(this);
        this.initializeMap('map0');

        //The score
        this.scoreText = this.game.add.text((20*this.map.getTilemap().tileWidth),
                                            (this.map.getTilemap().tileHeight),
                                            'Score:0', { fontSize: '32px', fill: '#0000FF' });
        this.livesText = this.game.add.text((20*this.map.getTilemap().tileWidth),
                                            (this.map.getTilemap().tileHeight + 40),
                                            'AAA', { fontSize: '32px', fill: '#0000FF' });
        this.updateLivesText();
    }
    
    // Called by phaser once per tick to update the game world.
    public update(): void {
        //dot collision
        for (var dot of this.smallDotMap) {
            this.game.physics.arcade.overlap(this.player, dot, (creature, dot) => {
                dot.destroy();
                this.score += 5;
                this.updateScoreText();

                if (this.getDotsRemaining() === 0){
                    this.onWin();
                }
            });
        }

        //normal collision
        this.game.physics.arcade.collide(this.player, this.layer);
        this.game.physics.arcade.collide(this.player, this.layer, (s,t) => {
            console.log("Collide " + s + " " + t)
        });

        //PacMan Death Collsion and Reset
        this.game.physics.arcade.collide(this.player, this.blinky1, (s, t) => {
            this.killPlayer();
        });

        this.game.physics.arcade.collide(this.player, this.inky1, (s, t) => {
            this.killPlayer();
        });
				
				this.game.physics.arcade.collide(this.player, this.pinky1, (s, t) => {
						this.killPlayer();
				});
				
				this.game.physics.arcade.collide(this.player, this.clyde1, (s, t) => {
						this.killPlayer();
				});

        // if (this.lives < 0) {
        //     this.onLose();
        // }
     
    }

    // How many dots are left on this map?
    public getDotsRemaining(): number {
        var count: number = 0;
        for (var dot of this.smallDotMap){
            if (dot.alive) {
                count++;
            }
        }
        return count;
    }

    // Called when the game has been won.
    private onWin(): void {
   //     this.game.physics.arcade.isPaused = true;
        this.game.time.events.add(1000, () => {
            this.player.destroy();
            this.blinky1.destroy();
            this.inky1.destroy();
						this.pinky1.destroy();
						this.clyde1.destroy();
            this.map.getTilemap().destroy();
            this.mapCount++;
            this.game.load.tilemap('map' + this.mapCount,
                                PacmanGame.mapsAssets[this.mapCount%PacmanGame.mapsAssets.length],
                                null, Phaser.Tilemap.CSV);
            this.game.load.start();
            this.game.load.onLoadComplete.add(game => {this.initializeMap('map' + this.mapCount)});
        });
    }

    private onLose(): void {
        window.location.pathname = "lose.html";
    }

    private respawnPlayer(): void {
        this.player.destroy();
        this.game.time.events.add(1000, () => {
            let pacmanSpawn = util.randomChoice(this.map.getPacmanSpawns());
            this.player = new creature.PlayerPacman(this.game, this.map, pacmanSpawn.getX(), pacmanSpawn.getY());
            let blinkySpawnTile = this.map.getBlinkySpawns()[0];
            let inkySpawnTile = this.map.getInkySpawns()[0];
						let pinkySpawnTile = this.map.getPinkySpawns() [0];
						let clydeSpawnTile = this.map.getClydeSpawns() [0];
            this.blinky1.reset(blinkySpawnTile.getCenterX(), blinkySpawnTile.getCenterY());
            this.inky1.reset(inkySpawnTile.getCenterX(), inkySpawnTile.getCenterY());
						this.pinky1.reset(pinkySpawnTile.getCenterX(), pinkySpawnTile.getCenterY());
						this.clyde1.reset(clydeSpawnTile.getCenterX(), clydeSpawnTile.getCenterY());
        });
    }

    private updateScoreText(){
        this.scoreText.text = 'Score: ' + this.score;
    }

    private updateLivesText(){
        this.livesText.text = 'Lives: ' + this.lives;
    }

    private removeLife(){
        this.lives--;
        this.updateLivesText();
    }

    private killPlayer(){
        this.removeLife();
        this.player.explode('pacmanchunk', 20);
        if (this.lives < 0){
            this.player.destroy();
            this.game.time.events.add(1000, () => this.onLose());
        } else {
            this.respawnPlayer();
        }

    }

    private initializeMap(name: string){
        let tilemap = this.game.add.tilemap(name);
        //this.tilemap.create('layer', 20, 20, 32 ,32);
        //this.tilemap.putTile(1,4,4);

        this.layer = tilemap.createLayer('layer');
        tilemap.addTilesetImage('testset');


        tilemap.setCollision(1, true, this.layer);
        tilemap.setCollision([0,2,3,5], false, this.layer); // Set floors to not collide.

        // Oddly enough, the 'score' value in the constructor doesn't hold and I don't know why.
        // Try it out:
        //console.log('Score is ' + this.score);
        this.score = 0;

        var pacMap: map.PacMap = new map.PacMap(tilemap);
        this.map = pacMap;

        // Find where pacman should spawn.
        let pacmanSpawnTile = util.randomChoice(pacMap.getPacmanSpawns());
        this.player = new creature.PlayerPacman(this.game, this.map, pacmanSpawnTile.getX(), pacmanSpawnTile.getY());

        // Blinky, for the deliverables.
        let blinkySpawnTile = pacMap.getBlinkySpawns() [0];
        let inkySpawnTile = pacMap.getInkySpawns() [0];
				let pinkySpawnTile = pacMap.getPinkySpawns() [0];
				let clydeSpawnTile = pacMap.getClydeSpawns() [0];
        this.blinky1 = new creature.CornersGhost(this.game, pacMap, blinkySpawnTile.getX(), blinkySpawnTile.getY(), "blinky");
        this.inky1 = new creature.ScanningGhost(this.game, pacMap, inkySpawnTile.getX(), inkySpawnTile.getY(), "inky");
				this.pinky1 = new creature.CornersGhostChange(this.game, pacMap, pinkySpawnTile.getX(), pinkySpawnTile.getY(), "pinky");
				this.clyde1 = new creature.ScanningGhost(this.game, pacMap, clydeSpawnTile.getX(), clydeSpawnTile.getY(), "clyde");
        this.blinky1.body.immovable = true;
        this.inky1.body.immovable = true;
				this.pinky1.body.immovable = true;
				this.clyde1.body.immovable = true;

        //this.smallDot = new dot.SmallDot(this.game, pacMap, (10*this.tilemap.tileWidth)-160, (10*this.tilemap.tileHeight)-100);
        //console.log(this.smallDotMap);

        //Initialize the list of dots from the map data.
        this.smallDotMap = [];
        var dotTiles = pacMap.allTilesWithID(map.TileID.FLOOR);
        for (var d of dotTiles){
            var x = d.getCenterX();
            var y = d.getCenterY();
            this.smallDotMap.push(new dot.SmallDot(this.game, pacMap, x, y));
        }

        //Initialize the list of Teleport Tiles
        this.teleportTiles = [];
        let tTiles = pacMap.allTilesWithID(map.TileID.TELEPORT);
        for (var tile of tTiles){
            this.teleportTiles.push(tile.getTile());
        }

        //Set the special rules for teleport tiles.
        pacMap.getTilemap().setTileIndexCallback(map.TileID.TELEPORT, (creature, tile) => {
            creature.explode('pacmanchunk');
            let destination = this.teleportTiles[(this.teleportTiles.indexOf(tile)+1)%this.teleportTiles.length];
            this.player.x = this.player.getMap().viewOf(destination.x, destination.y).getCenterX();
            this.player.y = this.player.getMap().viewOf(destination.x, destination.y).getCenterY();
            if (this.player.getContainingTile().getTile().x == 0)
                this.player.x = this.player.getContainingTile().viewEast().getCenterX();
            if (this.player.getContainingTile().getTile().x == tilemap.width-1)
                this.player.x = this.player.getContainingTile().viewWest().getCenterX();
            if (this.player.getContainingTile().getTile().y == 0)
                this.player.x = this.player.getContainingTile().viewSouth().getCenterY();
            if (this.player.getContainingTile().getTile().y == tilemap.height-1)
                this.player.x = this.player.getContainingTile().viewWest().getCenterY();
        }, this);
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
    }
}


let game: PacmanGame = new PacmanGame();