const passport = require('passport');

const controllers = require('../controllers');
const authenticate = require('../helpers/Authenticate');

const userController = controllers.User;
const auth = passport.authenticate('jwt', {
  session: false
});

module.exports = (app) => {
  app.post('/api/v1/users', auth, authenticate.permitAdmin, userController.create);
  app.post('/api/v1/users/login', auth, authenticate.permitAdmin, userController.login);
  app.post('/api/v1/users/logout', auth, authenticate.permitAdmin, userController.logout);
  app.get('/api/v1/users',
    auth, authenticate.permitAdmin, userController.search);
  app.get(
    '/api/v1/users/:id',
    auth, authenticate.permitUserOrAdmin, userController.view);
  app.put(
    '/api/v1/users/:id',
    auth, authenticate.permitUserOrAdmin, userController.update);
  app.delete(
    '/api/v1/users/:id',
    auth, authenticate.permitUserOrAdmin, userController.remove);
  app.get('/api/v1/search/users',
    auth, authenticate.permitAdmin, userController.search);
};
