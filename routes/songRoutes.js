const express   = require('express'),
      router    = express.Router(),
      Song      = require('../models/songModel'),
      User      = require('../models/userModel');

// To add new song
router.post('/temp', (req, res) => {
    let uploadFile = req.files.file
    let directory;
    const fileName = req.body.name
    uploadFile.mv(
        `${__dirname}/../files/${fileName}`,
        (err) => {
            if(err) {
                console.log("Error in uploading")
            } else {
                directory = `${__dirname}/../files/${fileName}`
            }
        }
    )
    
    const newSong = new Song({
        name: req.body.name,
        contractAddress: req.body.contractAddress,
        price: req.body.price,
        genre: req.body.genre,
        artist: req.body.artist,
        numberContributers: req.body.contributers,
        contributers: req.body.contributerArray,
        directory: directory,
        id: req.body.id
    });
    newSong.save()
        .then(a => res.status(200).json({success: true}))
        .catch(console.log);
});

router.get('/', (req, res) => {
    Song.find()
        .then(list => res.json(list))
        .catch(console.log);
});

router.post('/purchase', (req, res) => {
    let query = { address: req.body.purchasedUserAddress };
    console.log(query)
    User.update( query, { "$push": { "ownedSongs": req.body.purchasedSongAddress }})
        .then(a => res.status(200).json({success: true}))
        .catch(err => res.status(404).json({success: false}));
});

router.post('/owned', (req, res) => {
    console.log("Recive rew")
    User.find({address: req.body.address})
        .then(user => res.json(user))
        .catch(err => res.status(404).json({success: false}));
})

router.post('/ownedSong', (req, res) => {
    Song.find({contractAddress: req.body.ownedAddress})
        .then(song => res.json(song))
        .catch(err => res.status(404).json({success: false}));
})

router.post('/search', (req, res) => {
    Song.find({$or: [{name: req.body.search}, {artist: req.body.search}, {genre: req.body.search}]})
        .then(searchResults => res.json(searchResults))
        .catch(console.log);
});

router.post("/upload",(req,res) => {
    let uploadFile = req.files.file
    const fileName = req.files.file.name
    uploadFile.mv(
        `${__dirname}/../files/${fileName}`,
        (err) => {
            if(err) {
                console.log("Error in uploading")
            } else {
                res.json({success:true})
            }
        }
    )
})

module.exports = router;