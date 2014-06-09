[![Build Status](https://travis-ci.org/revington/connect-testab.png)](https://travis-ci.org/revington/connect-testab)
connect-testab
==============

Just a simple A/B testing middleware for connect.

Install
-------
`$ npm install connect-testab`

Usage
-----

    var connect = require('connect'),
    testAB = require('connect-testab'),
    app = connect();
    app.use(connect.cookieParser());
    app.use(testAB());
    app.get('/', function(req, res){
        res.send('test ' + req.testAB);
    });

See a [full express example](https://www.github.com/revington/connect-testab/tree/master/examples/express)

By default the test will be persisted on a cookie for 7 days.
You can change this value by providing a new time in milisecs.

    var connect = require('connect'),
    testAB = require('connect-testab'),
    ONE_DAY = 24 * 60 * 60 * 1000;
    app = connect();
    app.use(connect.cookieParser());
    app.use(testAB(ONE_DAY));
    app.get('/', function(req, res){
        res.send('test ' + req.testAB);
    });

If you do not want to persist it on a cookie just pass a `-1`

    var connect = require('connect'),
    testAB = require('connect-testab'),
    NO_COOKIES = -1;
    app = connect();
    app.use(connect.cookieParser());
    app.use(testAB(NO_COOKIES));
    app.get('/', function(req, res){
        res.send('test ' + req.testAB);
    });



License
-------
MIT. See LICENSE file.



[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/revington/connect-testab/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

