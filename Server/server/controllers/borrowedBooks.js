const db = require('../models');
const validate = require('../helpers/Validate');
const authenticate = require('../helpers/Authenticate');

const book = require('./book').create;
const { borrowedBooks } = db;

class borrowedBooks {

    rentBook(req, res) {
    const currDate = new Date();
    const dueDate = currDate.setDate(currDate.getDate() + 30);
    return borrowedBooks
      .create({
        bookId: req.params.bookId,
        userId: req.params.userId,
        toReturnDate: dueDate
      })
      .then(() => {
        return Book
          .findOne({ where: { id: req.params.bookId } })
          .then((books) => Book);
        })
      .then(() => res.status(201).send({
        message: 'Book successfully rented out',
      }))
      .catch(error => res.status(400).send(error));
  }


}