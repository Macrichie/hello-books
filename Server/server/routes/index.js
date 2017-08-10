
const roles = require('./role');
const users = require('./user');
const books = require('./book');

module.exports = (app) => {
  roles(app);
  users(app);
  books(app);
};