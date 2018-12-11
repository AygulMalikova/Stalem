var express = require('express');
var router = express.Router();
var passport = require('passport');
var Admin = require('../models/admin');
var Pictures = require('../models/picture');
var Sections = require('../models/section');


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

router.get('/admin', loggedInOnly, function (req, res) {
    Sections.find({}, function (err, sections) {
        if (err){
            next(err);
        } else {
            res.render('index', {sections: sections, authorized: true});
        }
    });
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


router.get('/settings', loggedInOnly, function (req, res) {
    var id = req.user.id;
    Admin.findById(id, function (err, admin) {
        if (err) {
            next(err);
        }
        else {
            res.render('settings', {admin: admin});
        }
    });
});


router.post('/settings', loggedInOnly, function (req, res) {
    var id = req.user.id;
    req.user.username = req.sanitize(req.body.username);
    var oldPassword = req.body.oldPassword;
    var newPassword = req.body.newPassword;
    console.log(oldPassword, newPassword);
    Admin.findById(id, function (err, admin) {
        admin.username = req.user.username;
        if (oldPassword.length > 0) {
            if (admin.validPassword(oldPassword)) {
                if (newPassword.length >= 6) {
                    console.log("done");
                    admin.password = newPassword;
                    admin.save(function (err) {
                        if(err) {
                            console.error('ERROR!');
                        }
                        else {
                            res.redirect('/admin');
                        }
                    });
                }
                else {
                    console.log(1345);
                }
            }
        }
        admin.save(function (err) {
            if(err) {
                console.error('ERROR!');
            }
            else {
                res.redirect('/settings');
            }
        });
    });
});

router.get('/logout', loggedInOnly, function(req, res){
    req.logout();
    res.redirect('/');
});


router.get('/addSection', loggedInOnly, function (req, res) {
    res.render('addSection');
});

router.post('/addSection', upload.array('file', 4), loggedInOnly, async (req, res, next) => {
    const cover = Number(req.body.cover);
    const section = new Sections({
        name: req.body.sectionName,
        description: req.body.sectionDescription,
        cover: null,
        pictures: []
    });
    section.pictures = await Promise.all(
        req.files.map((file, i) => {
            const pic = new Pictures({
                name: req.body.picname[i],
                imagePath: file.path
            });
            if (i === cover) {
                section.cover = pic;
            }
            pic.section = section;
            return pic.save();
        }));
    await section.save();
    res.redirect('/admin');
});


module.exports = router;
