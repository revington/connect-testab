var assert = require('assert'),
    alternate = require('..').helpers.alternate;
describe('Alternate between "A" and "B"', function () {
    var expected = ['A', 'B', 'A', 'B', 'A', 'B', 'A', 'B', 'A', 'B'],
        actual = [];
    before(function () {
        var len = 10,
            fn = alternate();
        while (len--) {
            actual.push(fn());
        }
    });
    it('should alternate between "A" and "B"', function () {
        assert.deepEqual(actual, expected);
    });
});
