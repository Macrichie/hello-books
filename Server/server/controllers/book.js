const db = require('../models');
const validate = require('../helpers/Validate');
const authenticate = require('../helpers/Authenticate');
const handleError = require('../helpers/handleError');
const paginate = require('../helpers/paginate');

//const Books = require('../models').Books;
//const User = require('../models').User;

/**
 * @class Book
 */
class Book {
  /**
  * Creates a Book
  * Route: POST: /book
  *
  * @static
  * @param {Object} req request object
  * @param {Object} res response object
  * @return {Object} response Object containing message and created book
  * @memberof Book
  */
  static create(req, res) {
    validate.book(req);
    const validateErrors = req.validationErrors();
    if (validateErrors) {
      handleError(400, validateErrors[0].msg, res);
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
              handleError(400, `we're sorry,
                book ${error.errors[0].message}, please try again`, res);
            });
        }).catch(() => {
          handleError(400,
            "we're sorry, there was an error, please try again", res);
        });
    }
  }

  /**
  * View Books
  * Route: GET: /books
  *
  * @static
  * @param {Object} req request object
  * @param {Object} res response object
  * @returns {Response} response object
  * @memberof Book
  */
  static view(req, res) {
    const id = authenticate.verify(req.params.id);
    if (id === false) {
      handleError(400,
        'Id must be a number', res);
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
            handleError(401, 'You are unauthorized to view this book', res);
          }
        } else {
          handleError(404, 'Book not found', res);
        }
      })
      .catch((error) => {
        handleError(400,
          `We're sorry, ${error.errors[0].message} , please try again`, res);
      });
  }

  /**
  * Get a user's books
  * Route: GET: /users/:id/books
  *
  * @param {Object} req request object
  * @param {Object} res response object
  * @returns {Response} response object
  * @memberof Book
  */
  static getUserBooks(req, res) {
    const offset = authenticate.verify(req.query.offset);
    const limit = authenticate.verify(req.query.limit);
    if ((req.query.limit && limit === false)
      || (req.query.offset && offset === false)) {
      handleError(400, 'Offset and Limit must be Numbers', res);
    }
    return db.Book.findAndCount({
      offset: offset || 0,
      limit: limit || 5,
      where: { authorId: req.params.id },
      include: [{
        model: db.User,
        attributes: ['fullName', 'username', 'roleId']
      }],
      order: [['createdAt', 'DESC']]
    })
      .then((books) => {
        res.status(200).send({
          message: 'Books found',
          books: books.rows,
          metaData: paginate(books.count, limit, offset)
        });
      })
      .catch(() => handleError(400,
        "we're sorry, there was an error, please try again", res));
  }

  /**
  * Update a Book
  * Route: PUT: /book/:id
  *
  * @static
  * @param {Object} req request object
  * @param {Object} res response object
  * @returns {Response} response object
  * @memberof Book
  */
  static update(req, res) {
    // write test for method
    validate.bookUpdate(req);
    const validateErrors = req.validationErrors();
    if (validateErrors) {
      handleError(400, validateErrors[0].msg, res);
    } else {
      const id = authenticate.verify(req.params.id);
      if (id === false) {
        handleError(400, 'Id must be a number', res);
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
                handleError(400,
                  'Book already exists', res);
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
                handleError(400,
                  `We're sorry, book ${error.errors[0].message}`, res);
              });
            }).catch(() => {
              handleError(400,
                "We're sorry, there was an error, please try again", res);
            });
        }).catch(() => {
          handleError(404,
            'Book does not exist', res);
        });
    }
  }

  /**
  * Get books
  * Route: GET: /search/books?q=[title]&limit=[integer]&offset=[integer] and
  * Route: GET: /books?q=[title]&limit=[integer]&offset=[integer]
  *
  * @static
  * @param {Object} req request object
  * @param {Object} res response object
  * @returns {Response} response object
  * @memberof Book
  */
  static search(req, res) {
    let searchTerm = '%%';
    if (req.query.q) {
      searchTerm = `%${req.query.q}%`;
    }
    const offset = authenticate.verify(req.query.offset);
    const limit = authenticate.verify(req.query.limit);
    if ((req.query.limit && limit === false)
      || (req.query.offset && offset === false)) {
      handleError(400, 'Offset and Limit must be Numbers', res);
    }
    let query;
    if (req.user.roleId === 1) {
      query = {
        offset: offset || 0,
        limit: limit || 5,
        where: {
          $or: [
            { title: { $iLike: `%${searchTerm}%` } }
          ]
        },
        include: [{
          model: db.User,
          attributes: ['fullName', 'username', 'roleId']
        }],
        order: [['createdAt', 'DESC']]
      };
    } else {
      query = {
        offset: offset || 0,
        limit: limit || 5,
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
          attributes: ['fullName', 'userame', 'roleId']
        }],
        order: [['createdAt', 'DESC']]
      };
    }

    return db.Book.findAndCount(query)
      .then((books) => {
        return res.status(200).send(
          {
            message: 'Books found',
            bookList: books.rows,
            metaData: paginate(books.count, limit, offset)
          });
      })
      .catch(() => {
        handleError(400, "We're sorry, we had an error, please try again", res);
      });
  }

  /**
  * Delete a book
  * Route: DELETE: /books/:id
  *
  * @static
  * @param {Object} req request object
  * @param {Object} res response object
  * @returns {Response} response object
  * @memberof Book
  */
  static delete(req, res) {
    const id = authenticate.verify(req.params.id);
    if (id === false) {
      handleError(400, 'Id must be a number', res);
    }
    db.Book.findById(id)
      .then((book) => {
        if (Number(book.adminId) !== req.user.id &&
          req.user.roleId !== 1) {
          handleError(401, 'You are unauthorized for this action', res);
        } else {
          book.destroy()
            .then(() => {
              res.status(200).send({ message: 'Book has been deleted' });
            });
        }
      }).catch(() => {
        handleError(404, 'Book not found', res);
      });
  }
}

module.exports = Book;