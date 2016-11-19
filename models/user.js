var mongoose = require('mongoose')
, postFind = require('mongoose-post-find')
, async = require('async')
, Schema = mongoose.Schema;
;

var UserSchema = new Schema({
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
