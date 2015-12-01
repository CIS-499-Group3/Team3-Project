var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports"], function (require, exports) {
    // A "Dot" is a sprite that dies on contact with a Pacman or PlayerPacman Creature.
    var Dot = (function (_super) {
        __extends(Dot, _super);
        function Dot(game, map, xtile, ytile, key) {
            _super.call(this, game, xtile, ytile, key); // Call the "Sprite" constructor.
            this.anchor = new Phaser.Point(0.5, 0.5); // Set the 'origin' of the sprite to the center of it.
            this.map = map;
            game.physics.enable(this, Phaser.Physics.ARCADE); // Turn on basic arcade physics for dots.
            game.add.existing(this); // Adds dots to the game.
        }
        return Dot;
    })(Phaser.Sprite);
    exports.Dot = Dot;
    var SmallDot = (function (_super) {
        __extends(SmallDot, _super);
        function SmallDot(game, map, xtile, ytile) {
            _super.call(this, game, map, xtile, ytile, "smalldot");
        }
        return SmallDot;
    })(Dot);
    exports.SmallDot = SmallDot;
    var LargeDot = (function (_super) {
        __extends(LargeDot, _super);
        function LargeDot(game, map, xtile, ytile) {
            _super.call(this, game, map, xtile, ytile, "smalldot");
        }
        return LargeDot;
    })(Dot);
    exports.LargeDot = LargeDot;
});
//# sourceMappingURL=dot.js.map