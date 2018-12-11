var express = require('express');
var router = express.Router();
var Pictures = require('../models/picture');
var Sections = require('../models/section');
var Comments = require('../models/comment');

/* GET home page. */
router.get('/', function(req, res, next) {
    Sections.find({}).populate('cover').exec(function(err, sections) {
        if (err){
            next(err);
        } else {
            res.render('index', {sections: sections, authorized: false});
        }
    });
});

router.get('/portfolio', function (req, res, next) {
    Sections.find({}).
        populate('pictures').
        populate('pictures.comments').
        exec(function(err, sections) {
            if (err){
                next(err);
            } else {
                res.render('portfolio', {sections: sections, authorized: false})
            }
        });
});

// router.post('/addComment/:id', function (req, res, next) {
//     const id = req.params.id;
//     Pictures.findById(id, function (err, pic) {
//         if (err) {
//             next(err);
//         } else {
//             Comments.create({text: req.body.text, author: req.body.author}, function (err, comment) {
//                 if (err) {
//                     next(err);
//                 } else {
//                     console.log(comment);
//                     pic.comments.push(comment);
//                     pic.save();
//                     res.redirect('/portfolio/');
//                 }
//             })
//         }
//     });
// });


module.exports = router;
