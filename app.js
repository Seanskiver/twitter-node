"use strict";
/**
 * Module dependencies.
 */
var express = require('express'), 
  routes = require('./routes'), 
  http = require('http'), 
  path = require('path'), 
  app = express(), 
  
  user = {}, 
  passport = require('passport'), 
  TwitterStrategy = require('passport-twitter').Strategy, 
  oa, 
  twitterAuthn, 
  twitterAuthz, 
  util = require('util'),
  session = require('express-session'),
  bodyParser = require('body-parser'),
  config = require('./config'),
  twitter = require('./twitter-core'),
  Troutes = require('./routes/twitter')
  ;




var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.use(express.logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.methodOverride());
app.use(express.session({secret: "keyboard cat"}));
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(Troutes);
app.use(express.static(path.join(__dirname, 'public')));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
