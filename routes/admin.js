var express = require('express');
var router = express.Router();
var passport = require('passport');
var Admin = require('../models/admin');
var Pictures = require('../models/picture');
var Sections = require('../models/section');
var Info = require('../models/info');
var Comments = require('../models/comment');

var app = express();
// var http = require('http').Server(app);
// var io = require('socket.io')(http);
// io.on('connection', () =>{
//     console.log('a user is connected');
// });

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
    var nav = false;
    Info.findOne({}, function (err, info) {
        if (err) {
            next(err);
        }
        res.render('login', { user: req.user, nav: nav, authorized: false, info: info});
    })
});


router.post('/login',
    passport.authenticate('local'),
    function(req, res) {
        res.redirect('/admin');
    });


router.get('/admin', loggedInOnly, function (req, res) {
    var nav = true;
    Sections.find({}).populate('cover').exec(function(err, sections) {
        Info.findOne({}, function (err, info) {
            if (err){
                next(err);
            } else {
                res.render('index', {sections: sections, authorized: true, nav: nav, info: info});
            }
        })
    });
});

router.post('/admin', loggedInOnly, function (req, res) {
    var about = req.body.text;
    Info.findOne({}, function (err, info) {
        info.about = about;
        info.save();
        if (err) {
            next(err);
        } else {
            res.json({text: about});
        }
    });
});


router.get('/register', function(req, res) {
    Info.findOne({}, function (err, info) {
        res.render('register', {info: info});
    });
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


router.get('/settings', loggedInOnly, function (req, res) {
    var nav = false;
    var id = req.user.id;
    Admin.findById(id, function (err, admin) {
        if (err) {
            next(err);
        }
        else {
            Info.findOne({}, function (err, info) {
                res.render('settings', {
                    admin: admin,
                    nav: nav,
                    info: info
                });
            });
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
    var nav = false;
    Info.findOne({}, function (err, info) {
        res.render('addSection', { nav: nav, info: info, authorized: true});
    });
});


router.post('/addSection', upload.array('file', 50), loggedInOnly, async (req, res, next) => {
    var nav = false;
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


router.get('/editSection/:id', loggedInOnly, function (req, res) {
    var nav = false;
    const id = req.params.id;
    Sections.findById(id).populate('cover').populate('pictures').exec(function (err, section) {
        if (err) {
            next(err);
        }
        else {
            console.log(section.cover._id);

            Info.findOne({}, function (err, info) {
                if (err) {
                    next(err);
                }
                res.render('editSection', { nav: nav, info: info, section: section, authorized: true});
            });
        }
    })
});


router.put('/editSection/:id', upload.array('file', 50), loggedInOnly, async (req, res, next) => {
    const id = req.params.id;
    const cover = Number(req.body.cover);
    Sections.findById(id, async (err, section) => {
        section.name = req.body.sectionName;
        section.description = req.body.sectionDescription;
        section.pictures = section.pictures.concat(await Promise.all(
            req.files.map((file, i) => {
                const pic = new Pictures({
                    name: req.body.picname[i],
                    imagePath: file.path
                });
                // if (i === cover) {
                //     section.cover = pic;
                // }
                pic.section = section;
                return pic.save();
            })));
        section.cover = section.pictures[cover];
        await section.save();
        res.redirect('/admin');
    });
});


router.delete('/deleteImage/:id', loggedInOnly, function (req, res) {
    Pictures.findByIdAndRemove(req.params.id, function (err, pics) {
        if (err) {
            console.log(err);
            res.json({success: false, error: err});
        } else {
            res.json({success: true});
        }
    })
});

//Destroy
router.delete('/deleteSection/:id', loggedInOnly, function (req, res) {
    Sections.findByIdAndRemove(req.params.id, function (err, section) {
       Pictures.remove({section: section}, function (err, pics) {
            if (err) {
                console.log(err);
            } else {
                res.redirect('/portfolio');
            }
        })
    })
});


module.exports = router;
