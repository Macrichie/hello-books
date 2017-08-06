const Books = require('../models').Books;

module.exports = {
  create(req, res) {
    return Books
      .create({
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        quantity: req.body.quantity,
        image: req.body.image,
        userId: req.params.userId,
      })
      .then(book => res.status(201).send(book))
      .catch(error => res.status(400).send(error));
  },
};