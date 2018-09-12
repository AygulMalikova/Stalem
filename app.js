var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sassMiddleware = require('node-sass-middleware');
var session = require('express-session');
var bodyParser = require('body-parser');
var Admin = require('./models/admin');
var Picture = require('./models/picture');
var Section = require('./models/section');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var multer = require('multer');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

var indexRouter = require('./routes/index');
var adminRouter = require('./routes/admin');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use(session({ keys: ['secretkey1', 'secretkey2', '...'] }));

app.use(sassMiddleware({
    src: __dirname,
    dest: __dirname,
    debug: true,
    outputStyle: 'compressed',
    prefix:  '',
    sourceMap: true
}));

const expressSession = require("express-session");
app.use(
    expressSession({
        resave: false,
        saveUninitialized: true,
        secret:
           "Some secret message"
    })
);


app.use(passport.initialize());
app.use(passport.session());

// Configure passport-local to use account model for authentication
// console.log (Admin.findOne({username: "123"}).fetch());

passport.serializeUser(function(user, done) {
    done(null, user._id);
});

passport.deserializeUser(function(userId, done) {
    Admin.findById(userId, (err, user) => done(err, user));
});

const local = new LocalStrategy((username, password, done) => {
    Admin.findOne({ username })
    .then(user => {
        if (!user || !user.validPassword(password)) {
            done(null, false, { message: "Invalid username/password" });
        } else {
            done(null, user);
        }
    })
    .catch(e => {
        console.log (e);
        done(e)
    });
});
passport.use("local", local);


// Database
mongoose.connect('mongodb://localhost:27017/stalem', { useNewUrlParser: true });

// app.use(session({ secret: 'cats' }));
// app.use(passport.initialize());
// app.use(passport.session());


app.use('/public', express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', indexRouter);
app.use('/', adminRouter);


mongoose.set('useCreateIndex', true);


// const multerConfig = {
//
//     storage: multer.diskStorage({
//         //Setup where the user's file will go
//         destination: function(req, file, next){
//             next(null, '.');
//         },
//
//         //Then give the file a unique name
//         filename: function(req, file, next){
//             console.log(file);
//             const ext = file.mimetype.split('/')[1];
//             next(null, file.fieldname + '-' + Date.now() + '.'+ext);
//         }
//     }),
//
//     //A means of ensuring only images are uploaded.
//     fileFilter: function(req, file, next){
//         if(!file){
//             next();
//         }
//         const image = file.mimetype.startsWith('image/');
//         if(image){
//             console.log('photo uploaded');
//             next(null, true);
//         }else{
//             console.log("file not supported");
//
//             //TODO:  A better message response to user on failure.
//             return next();
//         }
//     }
// };

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports.app = app;
//module.exports.multerConfig = multerConfig;
