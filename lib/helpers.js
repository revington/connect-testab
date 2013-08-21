function alternate() {
    var last = 'B';
    return function () {
        return last === 'A' ? last = 'B' : last = 'A';
    };
}

function testIsInRange(input) {
    return input && ~['A', 'B'].indexOf(input);
}
exports.alternate = alternate;
exports.testIsInRange = testIsInRange;

