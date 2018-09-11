var express = require('express');
var router = express.Router();
var passport = require('passport');
var Admin = require('../models/admin');
var Pictures = require('../models/picture');
var Sections = require('../models/section');
var multerConfig = require('../app');

var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads'); // Absolute path. Folder must exist, will not be created for you.
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
var upload = multer({ storage: storage });

// Authentication Middleware
const loggedInOnly = (req, res, next) => {
    if (req.isAuthenticated()) next();
    else res.redirect("/login");
};

const loggedOutOnly = (req, res, next) => {
    if (req.isUnauthenticated()) next();
    else res.redirect("/");
};

router.get('/login', function(req, res) {
    res.render('login', { user: req.user });
});

router.post('/login',
    passport.authenticate('local'),
    function(req, res) {
        // If this function gets called, authentication was successful.
        // `req.user` contains the authenticated user.
        res.redirect('/admin');
    });


router.get('/register', function(req, res) {
    res.render('register', {});
});

router.post("/register", (req, res, next) => {
    const { username, password } = req.body;
    Admin.create({ username, password })
    .then(user => {
        req.login(user, err => {
            if (err) next(err);
            else res.redirect("/");
        });
    })
    .catch(err => {
        if (err.name === "ValidationError") {
            res.redirect("/register");
        } else next(err);
    });
});


router.get('/admin', loggedInOnly, function (req, res) {
    res.render('admin');

});

router.get('/addPic',  function (req, res, next) {
    Sections.find({}, function (err, sections) {
        if (err){
            next(err);
        } else {
            res.render('addPic', {sections: sections})
        }
    });
});


router.post('/addPic', upload.single('file'), function (req, res, next) {
    var newPic = {
        name: req.body.name,
        description: req.body.description,
        section: req.body.section,
        file: req.body.file
    };
    Pictures.create(newPic, function (err, picture) {
        if (err) {
            next(err);
        } else {
            Sections.findById(req.body.section, function (error, section) {
                section.pictures.push(picture);
            });
            picture.save();
            res.redirect('/admin');
        }
    });
});

router.get('/addSection',  function (req, res) {
    res.render('addSection');
});

router.post('/addSection', function(req, res, next) {
    Sections.create(req.body.section, function(err, section){
        if (err) {
            next(err);
        } else {
            section.save();
            res.redirect('/admin');
        }
    });
});


module.exports = router;
