var Test = (function () {
    function Test(name) {
        this.name = name;
    }
    Test.prototype.getName = function () {
        return this.name;
    };
    return Test;
})();
function myfunc(arg1, arg2optional, arg3default) {
    if (arg3default === void 0) { arg3default = "This value is default"; }
    return arg1 + arg2optional + arg3default;
}
var test_inferred = new Test("What5");
var test_explicit = new Test("What 2");
console.log(test_inferred.getName());
//# sourceMappingURL=test.js.map