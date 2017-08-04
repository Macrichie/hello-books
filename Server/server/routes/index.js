const userController = require('../controllers').user;
const bookController = require('../controllers').book;



module.exports = (app)=> {
	app.get('/api', (req, res)=> res.status(200).send({
		message: 'Welcome to the readers API',
	}));

	app.post('/api/user', userController.create);
	app.post('/api/book', bookController.create);
  	// //app.get('/api/book/bookId', userController.create);
  	app.get('/api/user/:userId', userController.retrieve);
  	// app.put('/api/todos/:todoId', todosController.update);
  	// app.delete('/api/todos/:todoId', todosController.destroy);

  	// app.post('/api/todos/:todoId/items', todoItemsController.create);
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