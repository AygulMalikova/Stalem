var express = require('express');
var router = express.Router();
var Pictures = require('../models/picture');
var Sections = require('../models/section');

/* GET home page. */
router.get('/', function(req, res, next) {
    Sections.find({}, function (err, sections) {
        if (err){
            next(err);
        } else {
            res.render('index', {sections: sections, authorized: false});
        }
    });
});

router.get('/portfolio', function (req, res, next) {
    Sections.findById(Sections.find({}).populate("pictures").exec(function(err, sections) {
        if (err){
            next(err);
        } else {
            res.render('portfolio', {sections: sections})
        }
    }));
});

module.exports = router;
