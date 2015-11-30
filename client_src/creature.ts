import map = require('./map');
import search = require('./astarsearch');

var BASE_SPEED: number = 150;

// Number of pixels a sprite can be away from the center of the tile to be counted as "at the center".
// Smaller values will likely cause bugs as creatures skip over their turns.
// Values less than ~10 also seem to allow ghosts to go through walls. The mechanism behind this isn't yet clear.
const CENTER_TILE_EPSILON: number = 5;

// A "Creature" is a sprite that moves with and understands the grid system of the pacman game.
export class Creature extends Phaser.Sprite {
    private map: map.PacMap;
    public faceMovementDirection: boolean;

    constructor(game: Phaser.Game, map: map.PacMap, xtile: number, ytile: number, key: string){
        let x = map.viewOf(xtile, ytile).getPixelX();
        let y = map.viewOf(xtile, ytile).getPixelY();

        super(game, x, y, key); // Call the "Sprite" constructor.
        this.map = map;

        this.faceMovementDirection = false;

        game.physics.enable(this, Phaser.Physics.ARCADE); // Turn on basic arcade physics for creatures.
        this.anchor = new Phaser.Point(0.5, 0.5); // Set the 'origin' of the sprite to the center of it.
        game.add.existing(this); // Add ourselves to the game.
        this.centerOnTile(); // Let's avoid start-of-game weirdness by ensuring that we're in a sane starting spot.
    }

    public getMap(): map.PacMap {
        return this.map;
    }
    // The tile that the center of the creature is sitting in.
    public getContainingTile(): map.TileView {
        // Since the anchor should be set to the middle to begin with, this.x and this.y should be at the center.
        return this.map.viewOfPixels(this.x, this.y);
    }

    // Centers the sprite on its current tile.
    centerOnTile(): void {
        this.x = this.getContainingTile().getCenterX();
        this.y = this.getContainingTile().getCenterY();
    }

    // Sets the direction that the sprite is currently moving.
    changeDirection(direction: map.Direction){
        // If this sprite turns with its movement, update the facing.
        if (this.faceMovementDirection) this.setFacing(direction);

        if (direction === map.Direction.NORTH) {
            this.body.velocity.y = -BASE_SPEED;
            this.body.velocity.x = 0;

        } else if (direction === map.Direction.SOUTH) {
            this.body.velocity.y = BASE_SPEED;
            this.body.velocity.x = 0;

        } else if (direction === map.Direction.EAST) {
            this.body.velocity.x = BASE_SPEED;
            this.body.velocity.y = 0;

        } else if (direction === map.Direction.WEST) {
            this.body.velocity.x = -BASE_SPEED;
            this.body.velocity.y = 0;

        } else {
            this.body.velocity.x = 0;
            this.body.velocity.y = 0;
        }
        //console.log("Change Direction", [this, direction, this.body.velocity.x, this.body.velocity.y]);
    }

    // Changes the direction that the sprite is facing.
    // Note that the default here is assumed to be the sprite facing EAST.
    setFacing(direction: map.Direction){
        if (direction == map.Direction.WEST){
            this.angle = 180;
        } else if (direction === map.Direction.EAST){
            this.angle = 0;
        } else if (direction === map.Direction.SOUTH){
            this.angle = 90;
        } else if (direction === map.Direction.NORTH){
            this.angle = -90;
        }
    }

    update(){

    }
}

/* A DesiredDirectionCreature is a Creature that has a "desire" to
 * move in a particular direction, but will wait until an opportunity
 * is available.
 *
 * Any subclasses will need to call this.attemptDesiredDirection(), probably in update().
 */
export class DesiredDirectionCreature extends Creature {
    protected desiredDirection: map.Direction = null;

    public setDesiredDirection(direction: map.Direction){
        this.desiredDirection = direction;
    }

    protected attemptDesiredDirection(){
        // If we don't have a desired direction, keep on truckin
        if (this.desiredDirection == null) return;


        // If we're close to the center AND the direction that we want to go is clear, we may now turn.
        if (this.getContainingTile().isAtCenter(this, CENTER_TILE_EPSILON)
            && this.getContainingTile().viewDirection(this.desiredDirection).isTraversable()){
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
    }

}


export class Pacman extends DesiredDirectionCreature {
    constructor(game: Phaser.Game, map: map.PacMap, xtile, ytile){
        super(game, map, xtile, ytile, "pacman");
        this.faceMovementDirection = true;
        this.scale.set(.5,.5); // This is just because our pacman image is 64x64.
        this.animations.add('move', [0, 1, 2, 1], 10, true);
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

export class Ghost extends DesiredDirectionCreature {
    constructor(game: Phaser.Game, map: map.PacMap, xtile, ytile, key){
        super(game, map, xtile, ytile, key);
        this.animations.add('creep', [0,1,2,3,4,5,6,7],10, true);
        this.animations.play('creep');
    }
}

export class RandomGhost extends Ghost {
    constructor(game: Phaser.Game, map: map.PacMap, xtile, ytile, key){
        super(game, map, xtile, ytile, key)
    }
    update(){
        this.setDesiredDirection(map.randomDirection());
        this.attemptDesiredDirection();
    }
}

/*
    Class that implements a simple ghost behavior.  All this does is move in a default direction until it bumps into
    a collision tile, then chooses a new, random, valid direction to travel in.

    This class will serve as the basis for any ghosts with a behavior that needs to track whether its current direction
    is valid.
 */
export class SimpleGhost extends Ghost {
    protected nextTile: map.TileView;
    protected currentDirection: map.Direction;

    constructor(game: Phaser.Game, pmap: map.PacMap, xtile, ytile, key) {
        super(game, pmap, xtile, ytile, key);
        this.currentDirection = map.Direction.EAST;
        this.setDesiredDirection(this.currentDirection);
    }

    update(){
        this.nextTile = this.getContainingTile().viewDirection(this.currentDirection);
        while(!this.nextTile.isTraversable()) {
            //console.log([this, this.currentDirection]);
            this.currentDirection = map.randomDirection();
            this.nextTile = this.getContainingTile().viewDirection(this.currentDirection);
            this.setDesiredDirection(this.currentDirection);
        }
        //console.log([this, this.desiredDirection, this.currentDirection, this.body.velocity.x]);
        this.attemptDesiredDirection();
    }
}

/*
 * Class that implements a slightly more sophisticated Ghost behavior.  This ghost first tries to reach the top of the
 * map, and then scans left-to-right downwards towards the bottom of the map, then scans back to the top, ad infinitum.
 */
export class ScanningGhost extends SimpleGhost {
    private scanningDown: boolean;

    constructor(game: Phaser.Game, pmap: map.PacMap, xtile, ytile, key) {
        super(game, pmap, xtile, ytile, key);
        this.scanningDown = false;
        this.currentDirection = map.Direction.NORTH;
        this.setDesiredDirection(this.currentDirection);
    }

    update(){
        this.nextTile = this.getContainingTile().viewDirection(this.currentDirection);
        while(!this.nextTile.isTraversable()) {
            if(this.scanningDown){
                if(this.currentDirection === map.Direction.EAST || this.currentDirection === map.Direction.WEST){
                    if(this.getContainingTile().viewDirection(map.Direction.SOUTH).isTraversable()){
                        this.currentDirection = map.Direction.SOUTH;
                        break;
                    }
                    else if(this.getContainingTile().viewDirection(map.Direction.NORTH).isTraversable()){
                        this.currentDirection = map.Direction.NORTH;
                        continue;
                    }
                }
                else if(this.currentDirection === map.Direction.SOUTH || this.currentDirection === map.Direction.NORTH){
                    if(this.currentDirection === map.Direction.SOUTH && this.getContainingTile().getY() ===
                        this.getMap().getHeight()){
                        this.scanningDown = false;
                        continue;
                    }
                    if (this.getContainingTile().viewDirection(map.Direction.EAST).isTraversable()) {
                        this.currentDirection = map.Direction.EAST;
                        break;
                    }
                    else if (this.getContainingTile().viewDirection(map.Direction.WEST).isTraversable()) {
                        this.currentDirection = map.Direction.WEST;
                        continue;
                    }
                }
            }
            else {
                if(this.currentDirection === map.Direction.EAST || this.currentDirection === map.Direction.WEST){
                    if(this.getContainingTile().viewDirection(map.Direction.NORTH).isTraversable()){
                        this.currentDirection = map.Direction.NORTH;
                        break;
                    }
                }
            }
            this.currentDirection = map.randomDirection();
        }
        this.nextTile = this.getContainingTile().viewDirection(this.currentDirection);
        this.setDesiredDirection(this.currentDirection);
        this.attemptDesiredDirection();
    }
}

export class SearchGhost extends Ghost {
    protected goal: map.TileView;
    protected path: map.TileView[];
    protected nextTile: map.TileView;
    constructor(game: Phaser.Game, pmap: map.PacMap, xtile, ytile, key) {
        super(game, pmap, xtile, ytile, key);
        this.goal = null;
        this.path = [];
        this.nextTile = null;
    }

    update(){
        console.log('path length', this.path.length);
        if(this.goal == null) {
            this.setNewGoal();
            this.setNewPath();
        }
        while(this.nextTile == null) {
            //console.log(this.path);
            this.nextTile = this.path.pop();
            //console.log(this.nextTile);
            this.moveToNextTile();
        }
        this.attemptDesiredDirection();
    }

    setNewGoal(): void {
    }

    setNewPath(): void {
        //console.log('current tile', this.getContainingTile());
        //console.log('goal', this.goal);
        this.path = search.findPathToPosition(this.getContainingTile(), this.goal);
        //console.log('path', this.path);
    }

    moveToNextTile(): void {
        if(this.path.length > 0){
            this.nextTile = this.path.pop();
            var eastwest = this.nextTile.getX() - this.getContainingTile().getX();
            if(eastwest == -1){
                this.setDesiredDirection(map.Direction.WEST);
            }
            else if(eastwest == 1){
                this.setDesiredDirection(map.Direction.EAST);
            }
            else {
                var northsouth = this.nextTile.getY() - this.getContainingTile().getY();
                if(northsouth == -1){
                    this.setDesiredDirection(map.Direction.NORTH);
                }
                else
                    this.setDesiredDirection(map.Direction.SOUTH);
            }
            //console.log(this.desiredDirection);
        }
        else{
            this.nextTile = null;
            this.goal = null;
        }
    }

    attemptDesiredDirection(){
        super.attemptDesiredDirection();
        if(this.getContainingTile().getTile() == this.nextTile.getTile()){
            this.moveToNextTile();
        }
    }
}

export class CornersGhost extends SearchGhost {
    private corners: number[];
    private count: number;
    constructor(game: Phaser.Game, pmap: map.PacMap, xtile, ytile, key){
        super(game, pmap, xtile, ytile, key);
        this.corners = [1, 3, 0, 2];
        this.count = 0;
    }

    setNewGoal(): void {
        //console.log(this);
        this.goal = this.getMap().getCorners()[this.corners[this.count % 4]];
        this.count = this.count + 1;
    }
}
