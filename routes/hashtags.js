
var express = require('express');
var router = express.Router();
const Tweet = require('../models/tweets');
const Hashtag = require('../models/hashtags');

// route get hashtag -> obtenir tous les hashtag à droite 
router.get('/all', (req, res) => {

    Hashtag.find().then(data => {
        res.json({ result: true, message: data })

    });
})


// récupération des tweets sur un tableau d'hashtag

router.get('/', (req, res) => {
    console.log('Route pour hashtag existe');

    const hashtag = req.query.hashtagName;

    if (!hashtag) {
        return res.json({ result: false, error: 'Hashtag is required' });
    }

    Tweet.find({ hashtags: { $in: [hashtag] } }).then(data => {
        console.log('Liste des tweets pour le hashtag', hashtag, 'est la suivante', data);

        if (data.length === 0) {
            return res.json({ result: false, message: `No tweets found for ${hashtag}` });
        }

        res.json({ result: true, tweets: data });
    })
});



module.exports = router;

