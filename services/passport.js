const passport = require('passport');
const mongoose = require('mongoose');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('../config/keys');

const User = mongoose.model('users');

passport.serializeUser((user, done) => {
  done(null, user.id); //this is the mongo id, not the oauth id (oauth agnostic)
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy( //has an internal identifier called 'google', used in passport.authenticate function
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback' //URL after google authentication
    },
    (accessToken, refreshToken, profile, done) => {
      //async operation, use promise
      User.findOne({ googleId: profile.id }).then(existingUser => {
        if (existingUser) {
          //we already have an instance of this user
          done(null, existingUser);
        } else {
          //we don't have this user, make a new record
          new User({ googleId: profile.id })
            .save()
            .then(newUser => done(null, newUser)); //call save to persist to db
        }
      });
    }
  )
);
