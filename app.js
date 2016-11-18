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



// function initTwitterOauth() {
//   var OAuth= require('oauth').OAuth;
  
//   oa = new OAuth(
//     "https://twitter.com/oauth/request_token",
//     "https://twitter.com/oauth/access_token", 
//     config.consumerKey, 
//     config.consumerSecret, 
//     "1.0A", 
//     "https://twitter-app-seanskiver.c9users.io/oauthn/twitter/callback", 
//     "HMAC-SHA1"
//   );
// }  

// function makeTweet(cb) {
//   oa.post(
//     "https://api.twitter.com/1.1/statuses/update.json",
//     user.token, 
//     user.tokenSecret,
//     {"status":"Posted from Node.js webapp OAuth"},
//     cb
//   );
// }

// function makeDm(sn, cb) {
//   oa.post(
//     "https://api.twitter.com/1.1/direct_messages/new.json",
//     user.token,
//     user.tokenSecret, 
//     {"screen_name":sn, "text": "This is a test message from my twitter app"},
//     cb
//   )
// }
// function getDms(token, tokenSecret, callback) {
//     console.log('USER TOKEN: ' + user.token)
    
//     oa.get(
//       "https://api.twitter.com/1.1/direct_messages.json?count=10",
//       token,
//       tokenSecret,
//       callback
//     );
// }





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



// ROUTE DEFINITIONS


// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

// app.use('/', index);
// app.use('/auth', auth);

// app.get('/', function(req, res, next) {
//   res.render('index');
// });

// app.get('/checkauth', function(req, res, next) {
//   // Check if a token has been issued, meaning they've authorized the app
//   if(req.session.hasOwnProperty('user')) {
//     res.json(req.session.user);
//   } else {
//     res.json({ 'auth': false });
//   }
  
//   console.log(req.session);
// })

// app.get('/authn/twitter', passport.authenticate('twitterAuthn'));

// app.get('/authz/twitter', passport.authenticate('twitterAuthz', function(err, user) {
//   console.log('authz Done');
// }));

// app.get(
//   '/authn/twitter/callback', 
//   passport.authenticate(
//     'twitterAuthn', { 
//       successRedirect: '/',
//       failureRedirect: '/nfailure' 
//     }
// ));
// app.get(
//   '/authz/twitter/callback', 
//   passport.authenticate('twitterAuthz'), function(req, res) {
//   req.session.user = req.user;
  
//   res.redirect('/');
  
// });

// app.get('/twitter/tweet', function(req, res) {
//   makeTweet(function(error, data) {
//     if(error) {
//       console.log(require('sys').inspect(error));
//       res.end('Something went wrong');
//     } else {
//       console.log(data);
//       res.end('Success! Check out your tweets');
//     }
//   });
// });

// app.get('/twitter/direct/:sn', function(req, res) {
//   makeDm(req.params.sn, function(error, data) {
//     if(error) {
//       console.log(require('sys').inspect(error));
//       res.end('Something went wrong');
//     } else {
//       console.log(data);
//       res.end('Message Sent! But you can\'t see it :(');
//     }
//   });
// });

// // View Direct Messages
// app.get('/twitter/inbox', function(req, res) {
//   getDms(req.session.user.token, req.session.user.tokenSecret, function(error, data) {
//     if (error) {
//       console.log(require('sys').inspect(error));
//       res.end('There was an error getting your DMs');
//     } else {
//       res.json({'messages': data});
//       console.log('USER: ' + req.session.user.profile.username);
//     }
//   })
// });


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
