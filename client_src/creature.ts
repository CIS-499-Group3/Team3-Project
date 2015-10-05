import map = require('./map');

var BASE_SPEED: number = 100;

// A "Creature" is a sprite that moves with and understands the grid system of the pacman game.
export class Creature extends Phaser.Sprite {
    private map: map.PacMap;
    constructor(game: Phaser.Game, map: map.PacMap, xtile: number, ytile: number, key: string){
        super(game, xtile, ytile, key); // Call the "Sprite" constructor.
        this.map = map;
        game.physics.enable(this, Phaser.Physics.ARCADE); // Turn on basic arcade physics for creatures.
        game.add.existing(this); // Add ourselves to the game.
    }

    public getContainingTile(): map.TileView {
        // TODO: get center?
        return this.map.viewOfPixels(this.x, this.y);
    }
}

export class Pacman extends Creature {
    constructor(game: Phaser.Game, map: map.PacMap, xtile, ytile){
        super(game, map, xtile, ytile, "squarepacman");
        //this.sprite = new Phaser.Sprite(game, 10, 10, "testpic");
    }
}

// Let's seperate this from the pure Pacman class, just in case we want to add multiplayer in the future.
export class PlayerPacman extends Pacman {
    constructor(game: Phaser.Game, map: map.PacMap, xtile, ytile){
        super(game, map, xtile, ytile);
    }

    update(){
        // This is called by the Sprite class once every tick.

        if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
            this.body.velocity.x = -BASE_SPEED;
            this.body.velocity.y = 0;
        }

        if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            this.body.velocity.x = BASE_SPEED;
            this.body.velocity.y = 0;
        }

        if (this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
            this.body.velocity.y = BASE_SPEED;
            this.body.velocity.x = 0;
        }

        if (this.game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
            this.body.velocity.y = -BASE_SPEED;
            this.body.velocity.x = 0;
        }
    }
}

export class Ghost extends Creature {

}
