const Books = require('../models').Books;

module.exports = {
	create(req, res) {
		return Books
			.create({
        title: req.body.title,
        description: req.body.description,
        category: req.body.description,
        quantity: req.body.quantity,
        image: req.body.image,				
			})
      .then(book => res.status(201).send(book))
      .catch(error => res.status(400).send(error));
	},
	retrieve(req, res) {
  		return User
    		.findById(req.params.bookId)
    		.then(user => {
      			if (!user) {
        			return res.status(404).send({
          				message: 'User Not Found',
        			});
      			}
      			return res.status(200).send(user);
    		})
    		.catch(error => res.status(400).send(error));
	},
	update(req, res) {
		return Books
			.findById(req.params.bookId)
			.then(book => {
				if (!book) {
					return res.status(404).send({
						message: 'Book Not Found',
					});
				}
				return book
					.update({
                title: req.body.title || book.title,
                description: req.body.description || book.description,
                category: req.body.category || book.category,
                quantity: req.body.quantity || book.quantity,
                image: req.body.image || book.image,						
					})
			.catch(error => res.status(400).send(error));
			})
	},
	destroy(req, res) {
		return Books
			.find(req.params.bookId)
			.then(book => {
				if (!book) {
					return res.status(404).send({
						message: 'Book Not Found',
					});
				}
				return book
					.destroy()
					.then(() => res.status(204).send())
					.catch(error => res.status(400).send(error));
			})
			.catch(error => res.status(400).send(error));
	}	
};