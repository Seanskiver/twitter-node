var 
config = require('./config')
, oa
, user = {}
, passport = require('passport')
, TwitterStrategy = require('passport-twitter').Strategy
, twitterAuthn
, twitterAuthz
;


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
    user.token = token;
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
    callbackURL: "https://twitter-seanskiver.c9users.io/authz/twitter/callback",
    userAuthorizationURL: 'https://api.twitter.com/oauth/authorize',
  },
  
  function(token, tokenSecret, profile, done) {
    user.token= token;
    user.tokenSecret = tokenSecret;
    user.profile = profile;
    user.id = profile.id
    module.exports.initTwitterOauth();
    done(null, user);
  }
);
twitterAuthz.name = 'twitterAuthz';


passport.use(twitterAuthn);
passport.use(twitterAuthz);  


module.exports.initTwitterOauth = function() {
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

module.exports.makeTweet = function(token, tokenSecret, tweet, cb) {
  console.log('Tweet body: ' + tweet);
  oa.post(
    "https://api.twitter.com/1.1/statuses/update.json",
    token, 
    tokenSecret,
    {"status": tweet},
    cb
  );    
}

module.exports.makeDm = function(sn, cb) {
  oa.post(
    "https://api.twitter.com/1.1/direct_messages/new.json",
    user.token,
    user.tokenSecret, 
    {"screen_name":sn, "text": "This is a test message from my twitter app"},
    cb
  );    
}

module.exports.getDms = function(token, tokenSecret, callback) {
    console.log('USER TOKEN: ' + user.token)
    
    oa.get(
      "https://api.twitter.com/1.1/direct_messages.json?count=10",
      token,
      tokenSecret,
      callback
    );    
}

// MAKE ME COOL FUNCTIONS
module.exports.getTweets = function(token, tokenSecret, callback) {
  oa.get('https://api.twitter.com/1.1/statuses/user_timeline.json?count=50&trim_user=true&exclude_replies=true', token, tokenSecret, callback);
}