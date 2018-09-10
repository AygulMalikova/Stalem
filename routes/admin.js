var express = require('express');
var router = express.Router();
var passport = require('passport');
var Admin = require('../models/admin');
var Pictures = require('../models/picture');
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

router.get('/form',  function (req, res) {
    res.render('form');

});

// var insertDocuments = function(req, db, filePath) {
//     var collection = db.collection('pictures');
//     collection.insertOne({
//         name: req.body.name,
//         description: req.body.description,
//         section: req.body.description,
//         imagePath : filePath
//     }, (err, result) => {
//         assert.equal(err, null);
//     });
// };

router.post('/form', upload.single('file'), function (req, res, next) {
    // var collection = db.collection('pictures');
    Pictures.create({
        name: req.body.name,
        description: req.body.description,
        section: req.body.description,
        imagePath : 'public/uploads/' + req.file.originalname
    }, (err, result) => {
        if (err) next(err);
    });
    // insertDocuments(req, db, 'public/uploads/' + req.file.originalname);
    res.render('admin');
});



module.exports = router;
