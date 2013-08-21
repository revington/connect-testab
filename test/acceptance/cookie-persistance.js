var assert = require('assert'),
    cookie = require('cookie'),
    connect = require('connect'),
    request = require('supertest'),
    testAB = require('../..');
describe('persist acroos requests', function () {
    var cookies,
        results = [],
        expected = ['A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A'];
    var app = connect();
    app.use(connect.cookieParser());
    app.use(testAB());
    app.use(function (req, res) {
        res.end(req.testAB);
    });
    var performRequest = function (cookies, callback) {
        var req = request(app).get('/');
        if (arguments.length < 2) {
            callback = cookies;
            cookies = null;
        }
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
            cookies = res.headers['set-cookie'].pop().split(';')[0];
            for (i = 0; i < 10; i++) {
                performRequest(cookies, cb);
            }
        });
    });
    it('should not ignore persisted test', function (done) {
        assert.deepEqual(results, expected);
        done();
    });
});
