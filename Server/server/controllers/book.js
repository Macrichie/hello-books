const db = require('../models');
const validate = require('../helpers/Validate');
const authenticate = require('../helpers/Authenticate');

class Book {

//Creates a Book
  static create(req, res) {
    validate.book(req);
    const validateErrors = req.validationErrors();
    if (validateErrors) {
      res.status(400).send({message: validateErrors[0].msg});
    } else {
      db.User.findById(req.user.id)
        .then((user) => {
          db.Book.create({
            title: req.body.title,
            isbn: req.body.isbn,
            description: req.body.description,
            author: req.user.author,
            copies: req.user.copies,
            adminId: req.user.id,
            content: req.user.content,
            category: req.user.category,
          })
            .then((book) => {
              book.save()
                .then((newBook) => {
                  return res.status(201).send({
                    message: 'Book successfully created',
                    newBook: newBook.filterBookDetails()
                  });
                });
            }).catch((error) => {
              res.status(400).send({ message: `We're sorry,${error}`});
            });
        }).catch(() => {
          res.status(400).send({ message: 'Something went wrong, book not created'});
        });
    }
  }


/*View Books
  Route: GET: /books*/

  static view(req, res) {
    const id = authenticate.verify(req.params.id);
    if (id === false) {
      res.status(400).send({ message: 'Id must be a number'});
    }
    db.Book.findOne({ where: { id } })
      .then((book) => {
        if (book) {
          if (
            ((Number(book.adminId) === Number(req.user.id))
              || (book.category === 'finance'
                && Number(book.roleId) === Number(req.user.roleId)))
            || Number(req.user.roleId) === 1
            || book.category === 'technology'
          ) {
            res.status(200).send(
              {
                message: 'Book found',
                book: book.filterBookDetails()
              });
          } else {
            res.status(400).send({ message: 'Book not found'});
          }
        } else {
          res.status(400).send({ message: 'Book not found'});
        }
      })
      .catch((error) => {
        res.status(400).send({ message: 'Sorry, book not found, please try again'});
      });
  }

  /*
  Get a user's books
  Route: GET: /users/:id/books
  */

  static getUserBooks(req, res) {
    return db.Book.findAll({
      where: { authorId: req.params.id },
      include: [{
        model: db.User,
        attributes: ['firstname', 'lastname', 'roleId']
      }],
      order: [['createdAt', 'DESC']]
    })
      .then((books) => {
        res.status(200).send({
          message: 'Books found',
          books: books.rows
        });
      })
      .catch(() => res.status(400).send({ message: "we're sorry, there was an error, please try again"}));
  }

/*
Update a Book
Route: PUT: /book/:id
*/
  static update(req, res) {
    validate.bookUpdate(req);
    const validateErrors = req.validationErrors();
    if (validateErrors) {
      res.status(400).send({message: validateErrors[0].msg});
    } else {
      const id = authenticate.verify(req.params.id);
      if (id === false) {
        res.status(400).send({ message: 'Id must be a number'});
      }
      db.Book.findById(id)
        .then((book) => {
          if (book.adminId !== req.user.id && req.user.roleId !== 1) {
            return res.status(401).send({
              message: 'you are unauthorized for this action'
            });
          }
          db.Book.findAll({ where: { title: req.body.title } })
            .then((existingBook) => {
              if (existingBook.length !== 0 &&
                book.adminId !== req.user.id) {
                res.status(400).send({ message: 'Book already exist'});
              }
              book.update({
                title: req.body.title || book.title,
				        isbn: req.body.isbn || book.isbn,
				        description: req.body.description || book.description,
				        author: req.body.author || book.author,
				        copies: req.body.copies || book.copies,
				        adminId: req.body.adminId || book.adminId,
                content: req.body.content || book.content,
                category: req.body.category || book.category
              }).then((updatedBook) => {
                return res.status(200).send(
                  {
                    message: 'Book has been updated',
                    updatedBook: updatedBook.filterBookDetails()
                  });
              }).catch((error) => {
                res.status(400).send({ message: "Sorry,book can't be updated"});
              });
            }).catch(() => {
              res.status(400).send({ message: "Sorry, there's an error please try again"});
            });
        }).catch(() => {
          res.status(400).send({ message: "Book does not exist"});
        });
    }
  }

/*
Get books
*/
  static search(req, res) {
    let searchTerm = '%%';
    if (req.query.q) {
      searchTerm = `%${req.query.q}%`;
    }
    let query;
    if (req.user.roleId === 1) {
      query = {
        where: {
          $or: [
            { title: { $iLike: `%${searchTerm}%` } }
          ]
        },
        include: [{
          model: db.User,
          attributes: ['firstame', 'lastname', 'roleId']
        }],
        order: [['createdAt', 'DESC']]
      };
    } else {
      query = {
        where: {
          $and: [{
            $or: [
              {
                $or: [{ category: 'technology' }, {
                  $and: [
                    { access: 'role' }, { roleId: req.user.roleId }]
                }]
              },
              { adminId: req.user.id }
            ]
          },
          { title: { $iLike: `%${searchTerm}%` } }
          ]
        },
        include: [{
          model: db.User,
          attributes: ['firstname', 'lastname', 'roleId']
        }],
        order: [['createdAt', 'DESC']]
      };
    }

    return db.Book.findAll(query)
      .then((books) => {
        return res.status(200).send(
          {
            message: 'Books found',
            bookList: books.rows
          });
      })
      .catch(() => {
        res.status(400).send({ message: "Sorry, there was an error, please try again later"});
      });
  }

/*
Delete a book
Route: DELETE: /books/:id
*/
  static delete(req, res) {
    const id = authenticate.verify(req.params.id);
    if (id === false) {
      res.status(400).send({ message: 'Id must be a number'});
    }
    db.Book.findById(id)
      .then((book) => {
        if (Number(book.adminId) !== req.user.id &&
          req.user.roleId !== 1) {
          res.status(400).send({ message: 'You are Unauthorized for this action'});
        } else {
          book.destroy()
            .then(() => {
              res.status(200).send({ message: 'Book has been deleted' });
            });
        }
      }).catch(() => {
        res.status(400).send({ message: 'Book not found'});
      });
  }
}

module.exports = Book;