var assert = require('assert'),
    cookie = require('cookie'),
    connect = require('connect'),
    request = require('supertest'),
    testAB = require('..');

function readPersistedResult(res) {
    var theCookie, i;
    i = res.headers['set-cookie'].length;
    while (i--) {
        theCookie = cookie.parse(res.headers['set-cookie'][i]);
        if (!theCookie.testAB) {
            continue;
        }
        return theCookie.testAB;
    }
}
describe('connect-testab', function () {
    var app = connect();
    app.use(connect.cookieParser());
    app.use(testAB());
    app.use(function (req, res) {
        res.end(req.testAB);
    });
    describe('Alternate between "A" and "B"', function () {
        var expected = ['A', 'B', 'A', 'B', 'A', 'B', 'A', 'B', 'A', 'B'],
            actual = [];
        before(function () {
            var len = 10, alternate = testAB.alternate();
            while (len--) {
                actual.push(alternate());
            }
        });
        it('should alternate between "A" and "B"', function () {
            assert.deepEqual(actual, expected);
        });
    });
    describe('Default behavior', function () {
        describe('An A/B test', function () {
            it('should be stored on req.testAB', function (done) {
                request(app).get('/').end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    assert(~['A', 'B'].indexOf(res.text));
                    done();
                });
            });
            it('should be cookie persisted', function (done) {
                request(app).get('/').end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    assert(~['A', 'B'].indexOf(readPersistedResult(res)));
                    done();
                });
            });
            describe('persist acroos requests', function () {
                var cookies,
                    expected,
                    results = [];
                performRequest = function (callback) {
                    var req = request(app).get('/');
                    req.cookies = cookies;
                    req.end(function (err, res) {
                        if (err) {
                            throw err;
                        }
                        callback(res);
                    });
                };
                before(function (done) {
                    var i, testsLeft = 10,
                        cb = function (res) {
                            results.push(res.text);
                            if (!--testsLeft) {
                                done();
                            }
                        };
                    performRequest(function (res) {
                        expected = readPersistedResult(res);
                        cookies = res.headers['set-cookie'].pop().split(';')[0];
                        for (i = 0; i < 10; i++) {
                            performRequest(cb);
                        }
                    });
                });
                it('should not ignore persisted test', function (done) {
                    assert.equal(results.join(''), Array(11).join(expected));
                    done();
                });
            });
        });
    });
});
