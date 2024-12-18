
var express = require('express');
var router = express.Router();
const Tweet = require('../models/tweets');

require('../models/connection');


// pour l'enregistrement d'un nouveau tweet
router.post('/postTweet', (req, res) => {
   user.findOne({username : req.body.username}).then(data =>{
    if(data === null){
        res.json({result : false, error : 'user not found'})
        return
    };
   })
    const newTweet = new Tweet({
        firstname: data.firstname,
        username: data.username,
        timing: new Date(),
        text: req.body.text,
    });

    newTweet.save().then(newDoc => {
        res.json({ result: true, message: newDoc });
    });


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





module.exports = router;
