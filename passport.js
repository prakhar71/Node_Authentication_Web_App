var LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');


module.exports = function (passport) {

    console.log('in passport.js');





    passport.use('local', new LocalStrategy({

            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
            
        },
            function (req,email,password,done) {

            console.log('in middle ware passport');
            process.nextTick(function () {
                var db = mongoose.connection;

                console.log(db);


                    const users = db.collection('users');



                // users.find({}).limit(100).sort({_id:1}).toArray(function (err,result) {
                //     if(err){
                //         throw err;
                //     }
                //     console.log(result);
                //
                // });

                   users.findOne({username: email}, function(err, user){

                       console.log(user);

                        if(err){
                            return done(err);

                        }

                        if(user) {
                            return done(null, false, req.flash('signupMessage', 'That email already taken'));
                        }else {

                            console.log('in else');
                            var users = db.collection('users');

                           users.insert({

                               username: email,
                               password: password

                           },function () {

                               users.find({}).limit(100).sort({_id:1}).toArray(function (err,result) {
                                   if(err){
                                       throw err;
                                   }
                                   console.log(result);

                               });


                               users.findOne({username: email}, function(err, user){
                                    console.log(user);
                                   return done(null,user,req.flash('successMessage','signup successful'));
                               });




                           });


                        }


                    });


            });
            }

    ));


    passport.use('local-login', new LocalStrategy({

            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true

        },
        function (req,email,password,done) {

            console.log('in middle ware passport-login');
            process.nextTick(function () {
                var db = mongoose.connection;

                const users = db.collection('users');


                users.findOne({username: email}, function(err, user) {
                    console.log(user);

                    if (err) {
                        return done(err);

                    }

                    if (!user){
                        return done(null, false, req.flash('loginMessage', 'No User found'));
                    }

                    if(user.password != password){
                        return done(null, false, req.flash('loginMessage', 'inavalid password'));
                    }

                    return done(null,user);


                });


            });
        }

    ));


    passport.serializeUser(function(user, done){
        done(null, user.username);

        console.log('serarialising user');
    });

    passport.deserializeUser(function(uname, done) {

        console.log(uname);
        var db = mongoose.connection;


        var users = db.collection('users');

        users.findOne({username: uname}, function(err, user) {
            console.log(user);
            done(err, user);
        });



    });


};
            
