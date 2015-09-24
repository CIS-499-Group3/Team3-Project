/// <reference path="../app/components/phaser/typescript/phaser.d.ts"/>


class Game {

    constructor() {
        this.game = new Phaser.Game(800, 600, Phaser.AUTO, 'game-div', { preload: this.preload, create: this.create });
    }

    game: Phaser.Game;

    preload() {
        this.game.load.image('testpic', 'assets/awesomePacman.png');
    }

    create() {
        var logo = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'testpic');
        logo.anchor.setTo(0.5, 0.5);
    }

}

window.onload = () => {

    var game = new Game();

};