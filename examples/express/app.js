var express = require('express'),
    path = require('path'),
    http = require('http'),
    testAB = require('../../');
app = express();
app.locals.pretty = true;
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname);
app.set('view engine', 'jade');
app.use(express['static'](path.join(__dirname, 'public')));
app.use(express.cookieParser());
app.use(testAB());
var signups = [];
// We want to test which makes more signups
// A) sign up link on the right  
// B) sign up link on the left 
//
// index.jade reads the variable res.locals.testAB 
// to determine what css file to use.
app.use(function (req, res, next) {
    if (req.testAB === "A") {
        res.locals.testABCSS = 'signup-on-the-right.css';
        return next();
    }
    if (req.testAB === "B") {
        res.locals.testABCSS = 'signup-on-the-left.css';
        return next();
    }
    next();
});
app.get('/', function (req, res) {
    res.render('index');
});
app.get('/signup', function (req, res) {
    signups.push({
        date: new Date(),
        test: req.testAB
    });
    res.redirect('/');
});
// Just for demonstration purposes! do not 
// do this for real world
app.get('/results', function (req, res) {
    res.json(signups);
});
http.createServer(app).listen(app.get('port'), function () {
    console.log("connect-testab express demo listening on port " + app.get('port'));
});
