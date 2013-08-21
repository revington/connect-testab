var assert = require('assert'),
    cookie = require('cookie'),
    connect = require('connect'),
    request = require('supertest'),
    volatileTestAB = require('../..')(-1);
describe('volatile', function () {
    var cookies,
        results = [],
        expected = ['A', 'B', 'A', 'B', 'A', 'B', 'A', 'B', 'A', 'B', 'A'];
    var app = connect();
    app.use(connect.cookieParser());
    app.use(volatileTestAB);
    app.use(function (req, res) {
        res.end(req.testAB);
    });
    var performRequest = function (callback) {
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
            results.push(res.text);
            for (i = 0; i < 10; i++) {
                performRequest(cb);
            }
        });
    });
    it('should not ignore persisted test', function (done) {
        assert.deepEqual(results, expected);
        done();
    });
});
