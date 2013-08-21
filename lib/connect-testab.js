var cookie = require('cookie'),
    helpers = require('./helpers.js'),
    dayInMSecs = 24 * 60 * 60 * 1000,
    aWeek = dayInMSecs * 7;
// Returns the active test (via cookie)

function activeTest(req, options) {
    if (!~options.maxAge) {
        return;
    }
    if (req.cookies && req.cookies.testAB) {
        // Ensure persisted variant was A or B
        if (helpers.testIsInRange(req.cookies.testAB)) {
            return req.cookies.testAB;
        }
    }
}

function setOptions(ms, now) {
    var ret = {};
    now = now || Date.now();
    ret.maxAge = ms || aWeek;
    if (!~ret.maxAge) {
        return ret;
    }
    ret.expires = new Date(now + ret.maxAge);
    ret.maxAge /= 1000;
    return ret;
}

function persistItOnACookie(req, res, options) {
    return res.setHeader('Set-Cookie', cookie.serialize('testAB', req.testAB, options));
}

function testAB(timePersisted) {
    var options = setOptions(timePersisted),
        newTest = helpers.alternate();
    return function (req, res, next) {
        // Does req.testAB already exist?
        if (req.testAB) {
            return next();
        }
        if ((req.testAB = activeTest(req, options))) {
            return next();
        }
        // Start a new test
        req.testAB = newTest();
        // persist
        if (~options.maxAge) {
            persistItOnACookie(req, res, options);
        }
        return next();
    };
}
exports = module.exports = testAB;
exports.helpers = helpers;
exports.setOptions = setOptions;
