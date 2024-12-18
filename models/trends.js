const mongoose = require('mongoose');

const trendSchema = mongoose.Schema({
    hashtag: String,
});

const Trend = mongoose.model('trends', trendSchema);

module.exports = Trend;