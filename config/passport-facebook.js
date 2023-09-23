const passport = require('passport')
const FacebookStrategy = require('passport-facebook').Strategy
const User = require('../Model/userModel')
const dotenv = require('dotenv')
dotenv.config()

passport.use(
    new FacebookStrategy({
        clientID: process.env.facebookClientID,
        clientSecret:process.env.facebookClientSecret,
        callbackURL: '/Auth/facebook/redirect',
        profileFields: ['id', 'displayName', 'photos', 'email']
    },(accessToken, refreshToken, profile, done)=>{
        console.log("you are in redirect")
        console.log(profile)
        User.findOne({facebookID : profile.id}).then((currentUser)=>{
            if (currentUser){
                console.log("user is "+currentUser)
                done(null ,currentUser)
            }else{
                new User ({
                    name : profile.displayName ,
                    email: profile.emails[0].value,
                    provider: 'google',
                    googleID: profile.id
                }).save().then((newUser)=>{

                    console.log("new user created"+newUser)
                    done(null , newUser)
                }).catch((err) => {
                    if (err.code === 11000) {
                      // Duplicate key error
                      console.error("Duplicate key error:", err.message);
                      // Handle the error (e.g., return an error response)
                      done(err); // Pass the error to the done callback
                    } else {
                      // Handle other errors
                      console.error("Error:", err.message);
                      done(err);
                    }
                  });
            }
        })
    })
)
