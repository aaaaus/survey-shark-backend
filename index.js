const express = require('express');
require('./services/passport'); //as we're not exporting anything from passport.js, does not need to be set to variable
//const authRoutes = require('./routes/authRoutes'); see refactor below

const app = express();

//authRoutes(app); see refactor below
require('./routes/authRoutes')(app);

const PORT = process.env.PORT || 5000; //Heroku compatibility
app.listen(PORT);
