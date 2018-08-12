
var mongoose = require('mongoose');


module.exports = function (app,passport) {
    app.get('/', function(req, res){

        res.sendFile('index.html',{root: __dirname + '/views'});

    });


    app.get('/login',function (req,res) {

        res.sendFile('login.html',{root: __dirname + '/views'});
    });

    app.post('/login',passport.authenticate('local-login',{
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash: true
    }));


    app.get('/signup', function(req, res){

        res.sendFile('signup.html',{root: __dirname + '/views'});

    });


    app.post('/signup', passport.authenticate('local',{
        successRedirect: '/',
        failureRedirect: '/signup',
        failureFlash: true
        })
    );

    app.get('/profile',isLoggedIn,function (req,res) {

        console.log(req.isAuthenticated());
        res.sendFile('profile.html',{root: __dirname + '/views'});

    });


    app.get('/profile/user',isLoggedIn,function (req,res) {

        console.log(req.isAuthenticated());
        res.sendFile('user.html',{root: __dirname + '/views'});

    });

    app.get('/:username/:password', function(req, res){
       var uname = req.params.username;
       var pass = req.params.password;

       //create a schema


         var Schema = mongoose.Schema;
        var userSchema = new Schema({
            username: String,
            password: String
        });


        var users = mongoose.model('Users',userSchema);

        var newUser = new users({
            username: uname,
            password: pass
        });



        newUser.save(function (err) {
           if(err){
               throw err;
           }
        });

        res.redirect('/');
    });


    app.get('/logout',function (req,res) {
       req.logout();
       res.redirect('/');
    });


};


function isLoggedIn(req, res, next) {

    if(req.isAuthenticated()){
        return next();
    }

    res.redirect('/login');

}

