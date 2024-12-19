var express = require("express");
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

router.delete("/deleteTweet", (req, res) => {
  console.log("delete wanting recieved ");
  const tweetId = req.body._id;

  if (!tweetId) {
    return res
      .status(400)
      .json({ result: false, message: "Tweet ID is required" });
  }

  Tweet.deleteOne({ _id: tweetId })
    .then((result) => {
      if (result.deletedCount === 0) {
        return res
          .status(404)
          .json({ result: false, message: "Tweet not found" });
      }

      res.json({ result: true, message: `Tweet with ID ${tweetId} deleted` });
    })
    .catch((err) => {
      console.error(err);
      res
        .status(500)
        .json({
          result: false,
          error: "erreur dans la demande de suppression",
        });
    });
});
// route testée ok 


// NEW ROUTE POST LIKE 

router.post('/postLike', (req, res) => {
    const tweetId = req.body._id;

    User.findOne({ username: req.body.username }).then(userData => {
        if (userData === null) {
            res.json({ result: false, error: 'user not found' })
            return
        } else {
            // ajouter le user find one ici 
            const likedByUser = userData._id
            console.log(likedByUser)

            Tweet.findOne({ _id: tweetId })
                .then(data => {
                    console.log(data.userId)
                    if (!data) {
                        return res.status(404).json({ result: false, error: 'Tweet not found' });
                    }

                    const likeTable = data.likes
                    console.log(likeTable);

                    const foundLike = likeTable.some((element) => String(element) === String(likedByUser));

                    console.log(foundLike)

                    if (foundLike) {
                        const NewTable = likeTable.filter((element) => String(element) !== String(likedByUser))
                        data.likes = NewTable

                        data.save()
                            .then(updatedTweet => {
                                res.json({
                                    result: true,
                                    message: 'Tweet unliked',
                                    tweet: updatedTweet
                                });
                            })
                    } else {
                        data.likes.push(likedByUser)
                        data.save()
                            .then(updatedTweet => {
                                res.json({
                                    result: true,
                                    message: 'Tweet liked successfully',
                                    tweet: updatedTweet
                                });
                            })

                    }


                });


        }
    })
})





module.exports = router;
