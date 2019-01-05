var express = require('express');
var router = express.Router();
var Pictures = require('../models/picture');
var Sections = require('../models/section');
var Comments = require('../models/comment');

/* GET home page. */
router.get('/', function(req, res, next) {
    var nav = true;
    Sections.find({}).populate('cover').exec(function(err, sections) {
        if (err){
            next(err);
        } else {
            let auth = false;
            if (req.isAuthenticated()) {
                auth = true;
            }
            res.render('index', {sections: sections, authorized: auth, nav: nav});
        }
    });
});


router.get('/portfolio', function (req, res, next) {
    Sections.find({}).populate({
            path: 'pictures',
            populate: {
                path: 'comments',
                model: 'Comments'
            }
        }). exec(function(err, sections) {
        if (err){
            next(err);
        } else {
            let auth = false;
            if (req.isAuthenticated()) {
               auth = true;
            }
            res.render('portfolio', {sections: sections, authorized: auth})

        }
    });
});


router.post('/addComment/:id', function (req, res, next) {
    const id = req.params.id;
    console.log(id);
    Pictures.findById(id).
        populate('comments').
        exec( function (err, pic) {
        if (err) {
            next(err);
        } else {
            Comments.create({text: req.body.text, author: req.body.author, picture: pic}, function (err, comment) {
                if (err) {
                    next(err);
                } else {
                    console.log(comment);
                    pic.comments.push(comment);
                    pic.save();
                    res.redirect('/portfolio/');
                }
            })
        }
    });
});


module.exports = router;
