var express = require('express');
var router = express.Router();
var Pictures = require('../models/picture');
var Sections = require('../models/section');
var Comments = require('../models/comment');
var Info = require('../models/info');


/* GET home page. */
router.get('/', function(req, res, next) {
    var nav = true;
    Info.findOne({}, function (err, info) {
        if (err) {
            next(err);
        } else {
            info.developer = "https://github.com/AygulMalikova";
            info.save();
        }
    });
    Sections.find({}).populate('cover').exec(function(err, sections) {
        Info.findOne({}, function (err, info) {
            console.log(123);
            if (err) {
                next(err);
            } else {
                let auth = false;
                if (req.isAuthenticated()) {
                    auth = true;
                }
                res.render('index', {
                    sections: sections,
                    authorized: auth,
                    nav: nav,
                    info: info
                });
            }
        })
    });
});


router.get('/portfolio', function (req, res, next) {
    var nav = true;
    Sections.find({}).populate({
            path: 'pictures',
            populate: {
                path: 'comments',
                model: 'Comments'
            }
        }). exec(function(err, sections) {
            Info.findOne({}, function (err, info) {
                if (err){
                    next(err);
                } else {
                    let auth = false;
                    if (req.isAuthenticated()) {
                        auth = true;
                    }
                    res.render('portfolio', {sections: sections, authorized: auth, nav: nav, info: info})
                }
            })
    });
});


router.post('/addComment/:id', function (req, res, next) {
    const id = req.params.id;
    Pictures.findById(id).
        populate('comments').
        exec( function (err, pic) {
        if (err) {
            next(err);
        } else {
            Comments.create({text: req.body.text, author: req.body.author, picture: pic}, function (err, comment) {
                if (err) {
                    next(err);
                    res.json({success: false});
                } else {
                    pic.comments.push(comment);
                    pic.save();
                    res.json({success: true});
                }
            })
        }
    });
});


module.exports = router;
