var assert = require('assert'),
    cookie = require('cookie'),
    connect = require('connect'),
    request = require('supertest'),
    testAB = require('../..');

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
    describe('Default behavior', function () {
        describe('An A/B test', function () {
            it('should be stored on req.testAB', function (done) {
                request(app).get('/').end(function (err, res) {
                    if (err) {
			    console.error(err);
			    connect.trace(err.stack);
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
        });
    });
});
