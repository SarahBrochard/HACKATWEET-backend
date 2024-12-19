
var express = require('express');
var router = express.Router();
const Tweet = require('../models/tweets');
const Hashtag = require('../models/hashtags');
const User = require('../models/users');



require('../models/connection');


// pour l'enregistrement d'un nouveau tweet
router.post('/postTweet', (req, res) => {

    User.findOne({ username: req.body.username }).then(data => {
        if (data === null) {
            res.json({ result: false, error: 'user not found' })
            return
        } else {

            const text = req.body.text;
            const hashtagMatch = text.match(/#\w+/);
            console.log(hashtagMatch)

            const hashtag = hashtagMatch ? hashtagMatch[0] : null;



            const newTweet = new Tweet({
                userId: data._id,
                timing: new Date(),
                text: req.body.text,
                hashtag: hashtag,

            });



            newTweet.save().then(newDoc => {
                const newHashtag = new Hashtag({
                    hashtagName: hashtag,
                });
                newHashtag.save().then(newHash => {
                    res.json({ result: true, message: newDoc, hastag: newHash });
                });
            })


        }

    })
})



// route testée et ok le 18/12/24

// get Last Tweets
router.get('/lastTweets', (req, res) => {

    Tweet.find().then(data => {
        res.json({ result: true, message: data });

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






module.exports = router;
