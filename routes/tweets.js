
var express = require('express');
var router = express.Router();
const Tweet = require('../models/tweets');

require('../models/connection');


// pour l'enregistrement d'un nouveau tweet
router.post('/postTweet', (req, res) => {
    const text = req.body.text;
    const hashtagMatch = text.match(/#\w+/);
    console.log(hashtagMatch)

    const hashtag = hashtagMatch ? hashtagMatch[0] : null;

    const newTweet = new Tweet({
        userId: req.body.userId,
        timing: new Date(),
        text: req.body.text,
        hashtag: hashtag,

    });

    newTweet.save().then(newDoc => {
        res.json({ result: true, message: newDoc });
    });


    // newTweet.save().then(newDoc => {
    //     res.json({ result: true, message: newDoc });
    // });



})
// route testée et ok le 18/12/24

// get Last Tweets
router.get('/lastTweets', (req, res) => {

    Tweet.find().then(data => {
        console.log('la liste des tweets est la suivante', data);
    });
})

// delete tweets 


router.delete('/deleteTweet', (req, res) => {
    console.log('delete wanting recieved ')
    const tweetId = req.body._id;

    if (!tweetId) {
        return res.status(400).json({ result: false, message: 'Tweet ID is required' });
    }

    Tweet.deleteOne({ _id: tweetId })
        .then(result => {
            if (result.deletedCount === 0) {
                return res.status(404).json({ result: false, message: 'Tweet not found' });
            }

            res.json({ result: true, message: `Tweet with ID ${tweetId} deleted` });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ result: false, error: "erreur dans la demande de suppression" });
        });
});
// route testée ok 


//todo -> clef étrangère sur firstname username sur tweets -> ok done et testé 


// route sur les like 
router.post('/postLike', (req, res) => {

    const tweetId = req.body._id;
    const likedByUser = req.body.userId;

    console.log("req body tweet id", tweetId);

    Tweet.findOne({ _id: tweetId })
        .then(data => {
            console.log(data.likes);
            data.likes.push(likedByUser)
            console.log(data.likes)


            data.save()
                .then(updatedTweet => {
                    res.json({
                        result: true,
                        message: 'Tweet liked successfully',
                        tweet: updatedTweet
                    });
                })
        });




})




// route sur les trends -> get hasttag tweet 


module.exports = router;
