var express = require('express');
var app = express();
var port = process.env.PORT || 8080;

var cookieParser = require('cookie-parser');
var session = require('express-session');
var morgan = require('morgan');
var bodyParser = require('body-parser');

const mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var LocalStrategy = require('passport-local').Strategy;


app.use(express.static(__dirname + "/public"));


const cookieExpirationDate = new Date();
const cookieExpirationDays = 365;
cookieExpirationDate.setDate(cookieExpirationDate.getDate() + cookieExpirationDays);


mongoose.connect('mongodb://localhost/LoginAppUsers');

app.use(morgan('dev'));
app.use(session({secret: 'anystringoftext',
    saveUninitialized: true,
    resave: true,
    cookie: {
        httpOnly: true,
        expires: cookieExpirationDate
    }
}));
app.use(cookieParser('anystringoftext'));
app.use(bodyParser.urlencoded({extended: false}));
require('./passport')(passport);
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session



var db = mongoose.connection;

db.on('error',function (err) {
    console.log('error : cant connect to db' + err);
});


db.once('open',function () {
    console.log('connection success to db');

    require('./routes')(app,passport);
});


// app.use('/', function(req, res){
//     res.send('Our First Express program!');
//     console.log(req.cookies);
//     console.log('================');
//     console.log(req.session);
//
// });

//********************

//*******************


app.listen(port,function () {
    console.log('Server running on port: ' + port);
});

