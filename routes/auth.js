var 
express = require('express'),
passport = require('passport'),
TwitterStrategy = require('passport-twitter').Strategy, 
twitterAuthn, 
twitterAuthz,
config = require('../config.json'), 
user,
router = express.Router(),
oa
;

function initTwitterOauth() {
  var OAuth= require('oauth').OAuth;
  
  oa = new OAuth(
    "https://twitter.com/oauth/request_token",
    "https://twitter.com/oauth/access_token", 
    config.consumerKey, 
    config.consumerSecret, 
    "1.0A", 
    "https://twitter-app-seanskiver.c9users.io/oauthn/twitter/callback", 
    "HMAC-SHA1"
  );
}  


passport.serializeUser(function(err, done) {
  done(null, user.id);
});

passport.deserializeUser(function(err, done) {
  done(null, user);
});

// For posting 
twitterAuthn = new TwitterStrategy({
    consumerKey: config.consumerKey,
    consumerSecret: config.consumerSecret,
    callbackURL: "https://twitter-app-seanskiver.c9users.io/authn/twitter/callback"
  },
  function(token, tokenSecret, profile, done) {
    user.token= token;
    user.tokenSecret = tokenSecret;
    user.profile = profile;

    done(null, user);
  }
);
twitterAuthn.name = 'twitterAuthn';

// For Direct Messages
twitterAuthz = new TwitterStrategy({
    consumerKey: config.consumerKey,
    consumerSecret: config.consumerSecret,
    callbackURL: "https://twitter-app-seanskiver.c9users.io/authz/twitter/callback",
    userAuthorizationURL: 'https://api.twitter.com/oauth/authorize',
  },
  
  function(token, tokenSecret, profile, done) {
    user.token= token;
    user.tokenSecret = tokenSecret;
    user.profile = profile;
    initTwitterOauth();
    done(null, user);
  }
);
twitterAuthz.name = 'twitterAuthz';


passport.use(twitterAuthn);
passport.use(twitterAuthz);  


// router.get(
//   '/authz/twitter/callback', 
//   passport.authenticate('twitterAuthz'), function(req, res) {
//   req.session.user = req.user;
  
//   res.redirect('/');
  
// });

router.get('/sean', function (req, res) {
    res.end('Sup');
});

router.get('/authn/twitter', passport.authenticate('twitterAuthn'));

router.get('/authz/twitter', passport.authenticate('twitterAuthz', function(err, user) {
  console.log('authz Done');
}));


module.exports = router;