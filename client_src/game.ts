/// <reference path="../app/components/phaser/typescript/phaser.d.ts"/>
import creature = require('./creature');

class PacmanGame {

    constructor() {
        console.log("Yo!");
        this.game = new Phaser.Game(800, 600, Phaser.AUTO, 'game-div', { preload: this.preload, create: this.create, update: this.update});
    }

    private game: Phaser.Game;

    // Called by phaser to preload resources.
    preload(): void {
        this.game.load.image('badpacman', 'assets/awesomePacman.png');
    }

    // Called by phaser to set up the game world.
    create(): void {
        var pacman = new creature.PlayerPacman(this.game, 10, 10);
    }

    // Called by phaser once per tick to update the game world.
    update(): void {

    }

}

window.onload = () => {

    var game: PacmanGame = new PacmanGame();

};
