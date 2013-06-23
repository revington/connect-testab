var cookie = require('cookie'),
    dayInMSecs = 24 * 60 * 60 * 1000;

function aOrB() {
    return ['A', 'B'][(Math.floor(Math.random() * 2) + 1) - 1];
}

function setOptions(options) {
    /* Set cookie max age in milisecs */
    options.maxAge = options.maxAge || dayInMSecs * 7;
    options.expires = new Date(Date.now() + options.maxAge);
    options.maxAge /= 1000;
}

function persistedTest(req, options) {
    var ret;
    // Ignore any persisted value if volatile
    if (options.volatile) {
        return;
    }
    if ((ret = req.cookies && req.cookies.testAB)) {
        // Ensure persisted variant was A or B
        if (~['A', 'B'].indexOf(ret)) {
            return ret;
        }
    }
    return false;
}

function testAB(options) {
    options = options || {};
    setOptions(options);
    return function (req, res, next) {
        req.testAB = persistedTest(req, options);
        if (req.testAB) {
            return next();
        }
        req.testAB = aOrB();
        if (options.volatile) {
            next();
        }
        res.setHeader('Set-Cookie', cookie.serialize('testAB', req.testAB, options));
        next();
    };
}
module.exports = testAB;
