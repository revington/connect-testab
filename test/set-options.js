var assert = require('assert'),
    setOptions = require('..').setOptions,
    now = Date.now();
describe('#setOptions([ms, now as date])', function () {
    describe('with no options', function () {
        var options = setOptions(-1, now);
        describe('#maxAge', function () {
            it('should be -1 ', function () {
                assert.equal(options.maxAge, -1);
            });
        });
        describe('other properties', function () {
            it('should not be defined', function () {
                assert.deepEqual(Object.keys(options), ['maxAge']);
            });
        });
    });
    describe('setOptions([ms, now])', function () {
        var oneWeek = 7 * 24 * 60 * 60,
            oneWeekMS = oneWeek * 1000,
            options = setOptions(oneWeekMS, now);
        describe('#maxAge', function () {
            it('should be one week (in secs)', function () {
                assert.deepEqual(options.maxAge, oneWeek);
            });
        });
        describe('#expires', function () {
            it('should be one week (in ms)', function () {
                var expected = new Date(now + oneWeekMS);
                assert.deepEqual(options.expires, expected);
            });
        });
    });
});
