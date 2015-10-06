// var BASE_SPEED: number = 100;
// // A "Dot" is a sprite that dies on contact with a Pacman or PlayerPacman Creature.
// export class Dot extends Phaser.Sprite {
//     constructor(game: Phaser.Game, xtile, ytile, key: string) {
//         super(game, xtile, ytile, key); // Call the "Sprite" constructor.
//         game.physics.enable(this, Phaser.Physics.ARCADE); // Turn on basic arcade physics for dots.
//         game.add.existing(this); // Adds dots to the game.
//     }
//     public getContainingTile() {
//         // TODO
//     }
// }
// export class SmallDot extends Dot {
//     constructor(game: Phaser.Game, xtile, ytile) {
//         super(game, xtile, ytile, "dot");
//         this.body.scale.setTo(.5, .5);
//     }
// }
// // Let's seperate this from the pure Pacman class, just in case we want to add multiplayer in the future.
// export class LargeDot extends Dot {
//     constructor(game: Phaser.Game, xtile, ytile) {
//         super(game, xtile, ytile, "dot");
//     }
//     update() {
//         // This is called by the Sprite class once every tick.
//         //  Checks to see if the player overlaps with any of the dots, if he does call the collectdot function
//         this.game.physics.arcade.overlap(Creature, this, collectSmallDot, null, this);
//     }
// }
// function collectDot(Creature, SmallDot) {
//     // Removes the dot from the screen
//     this.body.kill();
//     Creature.score += 150;
// }
// function collectDot(Creature, ) {
//     // Removes the dot from the screen
//     this.body.kill();
//     Creature.score += 1000;
// } 
//# sourceMappingURL=dots.js.map