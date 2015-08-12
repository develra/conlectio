// modules =================================================
var express        = require('express');
var app            = express();
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var mongoose       = require('mongoose');
var passport       = require('passport');
var LocalStrategy  = require('passport-local').Strategy;

// configuration ===========================================
var dbConfig       = require('./config/db');
var adminConfig    = require('./config/adminCreds');

// passport configuration ==================================
passport.use(new LocalStrategy(
  function(username, password, done) {
    if (username !== adminConfig.username){
      return done(null, false, {message: 'Incorrect username.' });
    }
    if (password !== adminConfig.password){
      return done(null, false, {message: 'Incorrect password.' });
    }
    return done(null, username);
  }
));


// set our port
var port = process.env.PORT || 8080;

// connect to our mongoDB database
mongoose.connect(dbConfig.uri)

// parse application/json
app.use(bodyParser.json());

//passport initialization
app.use(passport.initialize());

// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override'));

// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/frontend'));

// routes ==================================================
require('./backend/routes')(app); // configure our routes

// start app ===============================================
app.listen(port);

// shoutout to the user
console.log('Serving on port ' + port);

// expose app
exports = module.exports = app;
