const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const keys = require('./config/keys'); //needed for mongoose.connect call

require('./models/User'); //must precede passport code, which needs this to exist first
require('./services/passport'); //as we're not exporting anything from passport.js, does not need to be set to variable
//const authRoutes = require('./routes/authRoutes'); see refactor below

mongoose.connect(keys.mongoURI);

const app = express();

//app.use calls are wiring up middleware, used to modify requests in our app before going to route handlers
app.use(bodyParser.json());
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
  })
);
app.use(passport.initialize());
app.use(passport.session());

//authRoutes(app); see refactor below
require('./routes/authRoutes')(app); //require statment becomes a function where passing in app sets up oauth routes
require('./routes/billingRoutes')(app);

const PORT = process.env.PORT || 5000; //Heroku compatibility
app.listen(PORT);
