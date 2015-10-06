import creature = require('./creature');
import game = require('./game');
import map = require('./map');

 // A "Dot" is a sprite that dies on contact with a Pacman or PlayerPacman Creature.
 export class Dot extends Phaser.Sprite {
    private map: map.PacMap;
     constructor(game: Phaser.Game, map: map.PacMap, xtile, ytile, key: string) {
     
         super(game, xtile, ytile, key); // Call the "Sprite" constructor.
        this.map = map;
        game.physics.enable(this, Phaser.Physics.ARCADE); // Turn on basic arcade physics for dots.
        game.add.existing(this); // Adds dots to the game.
     }

     public getContainingTile() {
         // TODO
     }
 }

 export class SmallDot extends Dot {
     constructor(game: Phaser.Game, map: map.PacMap, xtile, ytile) {
         super(game, map, xtile, ytile, "smalldot");
         }
       
     
 }

 export class LargeDot extends Dot {
     constructor(game: Phaser.Game, map: map.PacMap ,xtile, ytile) {
         super(game, map, xtile, ytile, "smalldot");
     }

    
 }



