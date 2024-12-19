const mongoose = require('mongoose');

const tweetSchema = mongoose.Schema({
    // firstname: String,
    // username: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    timing: Date,
    text: String,
    // ajout du hastag,
    hashtag: String,
    // ajout des likes avec user id 
    // likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }]
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
});

const Tweet = mongoose.model('tweets', tweetSchema);
module.exports = Tweet;