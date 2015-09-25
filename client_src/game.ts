/// <reference path="../app/components/phaser/typescript/phaser.d.ts"/>


class PacmanGame {

    constructor() {
        this.game = new Phaser.Game(800, 600, Phaser.AUTO, 'game-div', { preload: this.preload, create: this.create, update: this.update});
    }

    private game: Phaser.Game;

    // Called by phaser to preload resources.
    preload(): void {
        this.game.load.image('testpic', 'assets/awesomePacman.png');
    }

    // Called by phaser to set up the game world.
    create(): void {
        var logo: Phaser.Sprite = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'testpic');
        logo.anchor.setTo(0.5, 0.5);
    }

    // Called by phaser once per tick to update the game world.
    update(): void {

    }

}

window.onload = () => {

    var game: PacmanGame = new PacmanGame();

};
