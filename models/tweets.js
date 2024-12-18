const mongoose = require('mongoose');

const tweetSchema = new mongoose.Schema({
    firstname: String,
    username: String,
    timing: Date,
    text: String,
});

const Tweet = mongoose.model('Tweet', tweetSchema);
module.exports = Tweet;