import map = require('./map');

var BASE_SPEED: number = 100;

// A "Creature" is a sprite that moves with and understands the grid system of the pacman game.
export class Creature extends Phaser.Sprite {
    private map: map.PacMap;
    constructor(game: Phaser.Game, map: map.PacMap, xtile: number, ytile: number, key: string){
        super(game, xtile, ytile, key); // Call the "Sprite" constructor.
        this.map = map;
        game.physics.enable(this, Phaser.Physics.ARCADE); // Turn on basic arcade physics for creatures.
        this.anchor = new Phaser.Point(0.5, 0.5); // Set the 'origin' of the sprite to the center of it.
        game.add.existing(this); // Add ourselves to the game.
        this.centerOnTile(); // Let's avoid start-of-game weirdness by ensuring that we're in a sane starting spot.
    }

    public getContainingTile(): map.TileView {
        // TODO: get center?
        return this.map.viewOfPixels(this.x, this.y);
    }

    centerOnTile(): void {
        this.x = this.getContainingTile().getCenterX();
        this.y = this.getContainingTile().getCenterY();
    }

    changeDirection(direction: map.Direction){
        if (direction == map.Direction.NORTH) {
            this.body.velocity.y = -BASE_SPEED;
            this.body.velocity.x = 0;

        } else if (direction == map.Direction.SOUTH) {
            this.body.velocity.y = BASE_SPEED;
            this.body.velocity.x = 0;

        } else if (direction == map.Direction.EAST) {
            this.body.velocity.x = BASE_SPEED;
            this.body.velocity.y = 0;

        } else if (direction == map.Direction.WEST) {
            this.body.velocity.x = -BASE_SPEED;
            this.body.velocity.y = 0;

        } else {
            this.body.velocity.x = 0;
            this.body.velocity.y = 0;
        }
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
    private desiredDirection: map.Direction = null;

    constructor(game: Phaser.Game, map: map.PacMap, xtile, ytile){
        super(game, map, xtile, ytile);
    }

    private setDesiredDirection(direction: map.Direction){
        this.desiredDirection = direction;
    }

    private attemptDesiredDirection(){
        // If we don't have a desired direction, keep on truckin
        if (this.desiredDirection == null) return;

        // Distance to center of the tile. We use this to figure out when we should turn exactly.
        var distanceToCenter: number = this.getContainingTile().distanceFromCenter(this);

        // If we're close to the center AND the direction that we want to go is clear, we may now turn.
        if (distanceToCenter < 5 && this.getContainingTile().viewDirection(this.desiredDirection).isTraversable()){
            this.centerOnTile(); // Line ourselves up perfectly to fit.
            this.changeDirection(this.desiredDirection); // Change direction to where we wanted to go.
            this.desiredDirection = null; // Clear our desires.
        }
    }

    update(){
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
    }
}

export class Ghost extends Creature {
    constructor(game: Phaser.Game, map: map.PacMap, xtile, ytile){
        super(game, map, xtile, ytile, "blinky");
    }
}
