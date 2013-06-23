var cookie = require('cookie'),
    alternate = require('./alternate'),
    NO_PERSISTENCE = -1,
    dayInMSecs = 24 * 60 * 60 * 1000,
    aWeek = dayInMSecs * 7;

function testIsInRange(input) {
    return input && ~['A', 'B'].indexOf(input);
}

function alreadyUnderTest(req, options) {
    // Does req.testAB already exist?
    if (req.testAB && testIsInRange(req.testAB)) {
        return req.testAB;
    }
    // Ignore any cookie persisted value if volatile
    if (options.noCookiePersistence) {
        return;
    }
    if (req.cookies && req.cookies.testAB) {
        // Ensure persisted variant was A or B
        if (testIsInRange(req.cookies.testAB)) {
            return req.cookies.testAB;
        }
    }
    return false;
}

function setOptions(timePersisted) {
    var options = {};
    options.maxAge = timePersisted || aWeek;
    if (options.maxAge === NO_PERSISTENCE) {
        options.noCookiePersistence = true;
        return options;
    }
    options.expires = new Date(Date.now() + options.maxAge);
    options.maxAge /= 1000;
    return options;
}

function persistItOnACookie(req, res, options) {
    return res.setHeader('Set-Cookie', cookie.serialize('testAB', req.testAB, options));
}

function testAB(timePersisted) {
    var options = setOptions(timePersisted),
        newTest = alternate();
    return function (req, res, next) {
        if ((req.testAB = alreadyUnderTest(req, options))) {
            return next();
        }
	// Start a new test
        req.testAB = newTest();
        if (options.noCookiePersistence) {
            return next();
        }
        persistItOnACookie(req, res, options);
        return next();
    };
}
exports = module.exports = testAB;
exports.alternate = alternate;
