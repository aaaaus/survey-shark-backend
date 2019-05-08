const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const keys = require('./config/keys'); //needed for mongoose.connect call
require('./models/User'); //must precede passport, which needs this to exist first
require('./services/passport'); //as we're not exporting anything from passport.js, does not need to be set to variable
//const authRoutes = require('./routes/authRoutes'); see refactor below

mongoose.connect(keys.mongoURI);

const app = express();

app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
  })
);

app.use(passport.initialize());
app.use(passport.session());

//authRoutes(app); see refactor below
require('./routes/authRoutes')(app); //passing in app sets up oauth routes

const PORT = process.env.PORT || 5000; //Heroku compatibility
app.listen(PORT);
