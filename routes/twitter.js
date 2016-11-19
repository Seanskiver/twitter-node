var express = require('express')
, app = express()
, passport = require('passport')
, twitter = require('../twitter-core')
;


app.get('/', function(req, res, next) {
  res.render('index');
});

app.get('/checkauth', function(req, res, next) {
  // Check if a token has been issued, meaning they've authorized the app
  if(req.session.hasOwnProperty('user')) {
    res.json(req.session.user);
  } else {
    res.json({ 'auth': false });
  }
  
  console.log(req.session);
});

app.get('/authn/twitter', passport.authenticate('twitterAuthn'));

app.get('/authz/twitter', passport.authenticate('twitterAuthz', function(err, user) {
  console.log('authz Done');
}));

app.get(
  '/authn/twitter/callback', 
  passport.authenticate(
    'twitterAuthn', { 
      successRedirect: '/',
      failureRedirect: '/nfailure' 
    }
));
app.get(
  '/authz/twitter/callback', 
  passport.authenticate('twitterAuthz'), function(req, res) {
  req.session.user = req.user;
  
  res.redirect('/');
  
});

app.post('/twitter/tweet/:tweet', function(req, res) {
  twitter.makeTweet(req.session.user.token, req.session.user.tokenSecret, req.params.tweet, function(error, data) {
    if(error) {
      console.log(require('sys').inspect(error));
      res.end('Something went wrong');
    } else {
      console.log(data);
      res.end('Success! Check out your tweets');
    }
  });
});

app.get('/twitter/direct/:sn', function(req, res) {
  twitter.makeDm(req.params.sn, function(error, data) {
    if(error) {
      console.log(require('sys').inspect(error));
      res.end('Something went wrong');
    } else {
      console.log(data);
      res.end('Message Sent! But you can\'t see it :(');
    }
  });
});

// View Direct Messages
app.get('/twitter/inbox', function(req, res) {
  twitter.getDms(req.session.user.token, req.session.user.tokenSecret, function(error, data) {
    if (error) {
      console.log(require('sys').inspect(error));
      res.end('There was an error getting your DMs');
    } else {
      res.json({'messages': data});
      console.log('USER: ' + req.session.user.profile.username);
    }
  })
});

app.get('/twitter/getTweets', function(req, res) {
  twitter.getTweets(req.session.user.token, req.session.user.tokenSecret, function(error, data) {
    if (error) {
      console.log(require('sys').inspect(error));
      res.end('There was an error getting your tweets');
    } else {
      var tweets = JSON.parse(data)
      , noFavs = []
      ;

      for (var i = 0; i < tweets.length; i++) {
        if (tweets[i].retweeted == false && tweets[i].retweet_count == 0 && tweets[i].favorite_count == 0) {
          noFavs.push(tweets[i]);
        }
      }
      
      
      
      console.log("--------------------------NO FAV TWEETS--------------------------")
      console.log(require('sys').inspect(noFavs));
    }
  });
})

module.exports = app;