const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const User = require('../modules/user/user.model')
const dotenv = require('dotenv')
dotenv.config()

passport.use(
    new GoogleStrategy({
        clientID:process.env.googleClientID ,
        clientSecret: process.env.googleClientSecret,
        callbackURL:'/auth/google/redirect',
    },(accessToken , refreshToken , profile , done)=>{
        // console.log(profile)
        User.findOne({OAuthToken : profile.id}).then((currentUser)=>{
            if (currentUser){
                console.log("user is "+currentUser)
                done(null ,currentUser)
            }else{
                new User ({
                    name : profile.displayName ,
                    email: profile.emails[0].value,
                    provider : 'google',
                    OAuthToken: profile.id
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