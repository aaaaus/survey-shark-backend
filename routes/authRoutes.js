const passport = require('passport');

module.exports = app => {
  app.get(
    '/auth/google',
    passport.authenticate('google', {
      scope: ['profile', 'email'] //this is the information we are requesting from Google, see documentation
    })
  );

  app.get('/auth/google/callback', passport.authenticate('google'));
};
