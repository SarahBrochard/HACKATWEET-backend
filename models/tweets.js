const mongoose = require('mongoose');

const tweetSchema = mongoose.Schema({
    // firstname: String,
    // username: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    timing: Date,
    text: String,
});

const Tweet = mongoose.model('tweets', tweetSchema);
module.exports = Tweet;