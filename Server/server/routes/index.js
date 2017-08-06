const userController = require('../controllers').user;
//const userbooksController = require('../controllers').userbooks;
const bookController = require('../controllers').book;



module.exports = (app)=> {
	app.get('/api', (req, res)=> res.status(200).send({
		message: 'Welcome to the readers API',
	}));

	app.post('/api/user', userController.create);
	app.post('/api/book', bookController.create);
	app.get('/api/user', userController.list);
	app.get('/api/book', bookController.list);
  	app.get('/api/user/:userId', userController.retrieve);
  	app.get('/api/book/bookId', bookController.retrieve);
  	app.put('/api/user/:userId', userController.update);
  	app.put('/api/user/:bookId', bookController.update);
  	app.delete('/api/user/:userId', userController.destroy);
  	app.delete('/api/user/:bookId', bookController.destroy);


  	app.post('/api/user/:userId/item', bookController.create);
  	// app.put('/api/todos/:todoId/items/:todoItemId', todoItemsController.update);
  	// app.delete(
    // '/api/todos/:todoId/items/:todoItemId', todoItemsController.destroy
  	// );

  	// For any other request method on todo items, we're going to return "Method Not Allowed"
  	app.all('/api/user/:userId/', (req, res) =>
    	res.status(405).send({
      		message: 'Method Not Allowed',
  	}));
};