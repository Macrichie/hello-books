const passport = require('passport');

const controllers = require('../controllers');
const authenticate = require('../helpers/Authenticate');

const bookController = controllers.Book;
const auth = passport.authenticate('jwt', {
  session: false
});
module.exports = (app) => {
  app.get('/api/v1/users/:id/books',
    auth, authenticate.permitUserOrAdmin, bookController.getUserBooks);
  app.post('/api/v1/books', auth, bookController.create);
  app.get('/api/v1/books', auth, bookController.search);
  app.get('/api/v1/books/:id', auth, bookController.view);
  app.put('/api/v1/books/:id',
    auth, bookController.update);
  app.delete(
    '/api/v1/books/:id', auth, bookController.delete);
  app.get('/api/v1/search/books', auth, bookController.search);
};
