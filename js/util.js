define(["require", "exports"], function (require, exports) {
    function randomChoice(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }
    exports.randomChoice = randomChoice;
});
//# sourceMappingURL=util.js.map