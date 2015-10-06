import creature = require('./creature');
import game = require('./game');

 // A "Dot" is a sprite that dies on contact with a Pacman or PlayerPacman Creature.
 export class Dot extends Phaser.Sprite {
     constructor(game: Phaser.Game, xtile, ytile, key: string) {
         super(game, xtile, ytile, key); // Call the "Sprite" constructor.
        game.physics.enable(this, Phaser.Physics.ARCADE); // Turn on basic arcade physics for dots.
        game.add.existing(this); // Adds dots to the game.
     }

     public getContainingTile() {
         // TODO
     }
 }

 export class SmallDot extends Dot {
     constructor(game: Phaser.Game, xtile, ytile) {
         super(game, xtile, ytile, "dot2");
         }

       
     
 }

 export class LargeDot extends Dot {
     constructor(game: Phaser.Game, xtile, ytile) {
         super(game, xtile, ytile, "dot");
     }

    
 }
 
 function collectdot () {

    // Removes the dot from the screen
    this.kill();


}

