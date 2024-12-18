

var express = require('express');
var router = express.Router();
const Tweet = require('../models/tweets');

require('../models/connection');


// pour l'enregistrement d'un nouveau tweet
router.post('/postTweet', (req, res) => {
    const newTweet = new Tweet({
        firstname: req.body.firstname,
        username: req.body.username,
        timing: new Date(),
        text: req.body.text,
    });

    newTweet.save().then(newDoc => {
        res.json({ result: true, message: newDoc });
    });


})


module.exports = router;
