const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/getTots', mid.requiresLogin, controllers.Tot.getTots);
  app.get('/getTot', mid.requiresLogin, controllers.Tot.getTot);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/maker', mid.requiresLogin, controllers.Tot.makerPage);
  app.post('/maker', mid.requiresLogin, controllers.Tot.make);
  app.get('/voter', mid.requiresLogin, controllers.Tot.voterPage);
  app.post('/voter', mid.requiresLogin, controllers.Tot.vote);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
