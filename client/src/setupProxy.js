const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(proxy(['/api', '/auth/google'], { target: 'http://localhost:5000' }));
};

//this proxy allows us to continue to use relative paths when running our dev server (create-react-app server). On the production server, when deplyoyed to heroku, the final client build will be run from express, so the relative paths will correctly refer to the heroku domain name (meaning this proxy isn't used).
