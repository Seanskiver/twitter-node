var mongoose = require('mongoose')
  // Mongo
, db = mongoose.connection
, dbUrl = 'mongodb://root:root@ds157677.mlab.com:57677/twitter-app'
, async = require('async')
, Schema = mongoose.Schema;
;

var TwitterUserSchema = new Schema({
    twitterUsername: {
        type: String,
        required: true
    }
    , twitterToken: {
        type: String,
        required: false, 
    }
    , twitterTokenSecret: {
        type: String,
        required: false
    }
});


var TwitterUser = mongoose.model('TwitterUser', TwitterUserSchema);

db.on('error', function() {
    console.error('DATABASE ERROR');
});

function insertUser(username, token, secret, callback) {
    TwitterUser.create({
          twitterUsername:      username
        , twitterToken:         token
        , twitterTokenSecret:   secret
    }, function(err) {
        if (err) {
            callback(err);
        }
    });
    
    
}

function findUser(username, callback) {
    TwitterUser.find({
        username: username
    }).exec(function(error, result) {
        if (error) {
            return callback(error);
        } else {
            return callback(null, result);
        }
    })
}

function findOrCreate(username, token) {
    
}

mongoose.connect(dbUrl, function(err) {
    if (err) {
        console.log('There was an error connecting to the database');
        console.log(err);
    }
    
    console.log('Connected!');
    
    insertUser('seanskiver', '454515873-VJYsjpdk5heKHcZ5IoQCnw1Ew32nK2rJVlMmYpwe', 'd8alJFzj1cw6uEgQbG7YKuUkppBruFAc1Z5VqDbqtdUzlo',function(err) {
        if (err) {
            console.log(err);
        }
    });
    
    db.close();
    process.exit();
});
