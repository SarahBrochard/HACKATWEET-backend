
var express = require('express');
var router = express.Router();
const Tweet = require('../models/tweets');
const Hashtag = require('../models/hashtags');
const User = require('../models/users');



require('../models/connection');



// route post tweet améliorée
router.post('/postTweet', (req, res) => {
    // ici faire un find one par token et pas par username sur prochain projet 
    User.findOne({ username: req.body.username }).then(data => {
        if (data === null) {
            res.json({ result: false, error: 'user not found' })
            return
        } else {

            const text = req.body.text;
            const hashtagMatch = text.match(/#([\wÀ-ÿ]+)/g);
            console.log(hashtagMatch)

            //const hashtag = hashtagMatch ? hashtagMatch[0] : null;
            const hashtags = hashtagMatch || [];


            const newTweet = new Tweet({
                userId: data._id,
                timing: new Date(),
                text: req.body.text,
                hashtags: hashtags,

            });


            newTweet.save().then(async newDoc => {
                console.log(newDoc)
                // hashtags.forEach((hashtag) => {
                //     const newHashtag = new Hashtag({ hashtagName: hashtag });
                //     newHashtag.save().then(() => {
                //         console.log(`newhashtag ${hashtag} saved`)
                //     })
                // })
                for (const hashtag of hashtags) {
                    const hashtagFound = await Hashtag.findOne({ hashtagName: hashtag })
                    // on ne veut pas récupérer la data dans le .then mais la récupérer dans la constante à gauche pour ensuite tout faire de haut en bas dans un sens logique 
                    // on attend avec le await avant d'exécuter la suite mais on déclare en amont avec async pour qu'il comprenne await-> tout ce qui est dans des points then peut être transformer en await 
                    if (hashtagFound) {
                        continue
                        // dans une boucle on fait continue pour passer au prochain item 

                    } else {
                        const newHashtag = new Hashtag({ hashtagName: hashtag });
                        await newHashtag.save()
                        console.log(`newhashtag ${hashtag} saved`)
                    }

                }
                // mettre le res .Json après la boucle for à chaque fois et pas dans la boucle 
                res.json({ result: true, message: 'la boucle des hashtags a été réalisée' })
            })


        }
    })
})




// get Last Tweets
router.get('/lastTweets', (req, res) => {

    Tweet.find().then(data => {
        res.json({ result: true, message: data });

    });
})

// Route delete tweet if tweet user ID = username 
router.delete('/deleteTweet', (req, res) => {
    console.log('delete wanting recieved ')
    const tweetId = req.body._id;
    const username = req.body.username

    if (!tweetId) {
        return res.status(400).json({ result: false, message: 'Tweet ID is required' });
    }

    User.findOne({ username: username }).then(userData => {
        if (userData === null) {
            res.json({ result: false, error: 'user not found' })
            return
        } else {

            const userDataId = userData.id
            console.log(userDataId)

            // retrouver l'user Id du tweet 
            Tweet.findOne({ _id: tweetId }).then(TweetData => {


                if (!TweetData) {
                    return res.status(404).json({ result: false, message: 'Tweet not found' });
                }

                console.log(TweetData.userId)
                const tweetUserId = TweetData.userId

                if (String(userDataId) === String(tweetUserId)) {
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
                } else {
                    res.json({ result: false, message: `User unauthorized to delete tweet` });


                }

            })


        }
    })
});

// NEW ROUTE POST LIKE 

router.post('/postLike', (req, res) => {
    const tweetId = req.body._id;
    const username = req.body.username


    User.findOne({ username: username }).then(userData => {
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
