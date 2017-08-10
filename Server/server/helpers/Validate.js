/* eslint-disable */
/**
 * @class Validate
 */
class Validate {
  /**
   * Validate Input Fields for User Update
   * 
   * @static
   * @param {Object} req request object
   * @memberof Validate
   * @return {void}
   */
  static userUpdate(req) {
    const keys = Object.keys(req.body);
    keys.forEach((element, index, array) => {
      if (element === 'email') {
        const email = req.body[element];
        req.checkBody('email', 'Please Input Valid Email').isEmail().notEmpty();
      }
      if (element === 'password') {
        const password = req.body[element];
        req.checkBody('password', 'Password is Required').notEmpty();
      }
      if (element === 'confirmPassword') {
        const confirmPassword = req.body[element];
        req.checkBody('confirmPassword', 'Passwords do not match').equals(
          req.body.password);
      }
      if (element === 'firstname') {
        const fullName = req.body[element];
        req.checkBody('firstname', 'Must be alphabets').isAlpha();
        req.checkBody('firstname', 'Required').notEmpty();
      }
      if (element === 'lastname') {
        const username = req.body[element];
        req.checkBody('lastname', 'Must be alphabets').isAlpha();
        req.checkBody('lastname', 'Required').notEmpty();
      }
    });
  }

  /**
   * Validate Input Fields for user Signup and Login
   * 
   * @static
   * @param {Object} req request object
   * @return {void}
   * @memberof Validate
   */
  static user(req) {
    let firstname, lastname, email, password, confirmPassword;
    if (!req.body.firstname || !req.body.lastname) {
      email = req.body.email;
      password = req.body.password;
      req.checkBody('email', 'Please Input Valid Email').isEmail().notEmpty();
      req.checkBody('password', 'Password is Required').notEmpty();
    } else {
      firstname = req.body.firstname;
      lastname = req.body.lastname;
      email = req.body.email;
      password = req.body.password;
      confirmPassword = req.body.confirmPassword;
      req.checkBody('firstname', 'First Name is Required').notEmpty();
      req.checkBody('firstname', 'Must be alphabets').isAlpha();
      req.checkBody('lastname', 'User Name is Required').isAlpha();
      req.checkBody('lastname', 'Must be alphabets').isAlpha();
      req.checkBody('email', 'Email is Required').notEmpty();
      req.checkBody('email', 'Email is not valid').isEmail();
      req.checkBody('password', 'Password is Required').notEmpty();
      req.checkBody('confirmPassword', 'Passwords do not match').equals(password);
    }
  }

  /**
   * Validate Input Fields for creating Roles
   * 
   * @static
   * @param {any} req 
   * @memberof Validate
   * @return {void}
   */
  static role(req) {
    const title = req.body.title;
    const description = req.body.description;

    req.checkBody('title', 'Title is Required').notEmpty();
    req.checkBody('title', 'Must be alphabets').isAlpha();
    req.checkBody('description', 'Descrition is Required').notEmpty();
  }

  /**
   * Validate Input Fields for updating Roles
   * 
   * @static
   * @param {Object} req request object
   * @return {void}
   * @memberof Validate
   */
  static roleUpdate(req) {
    const keys = Object.keys(req.body);
    keys.forEach((element, index, array) => {
      if (element === 'title') {
        const title = req.body[element];
        req.checkBody('title', 'Title is Required').notEmpty();
      }
      if (element === 'description') {
        const description = req.body[element];
        req.checkBody('description', 'Description is Required').notEmpty();
      }
    });
  }
  /**
   * Validate Input Fields for updating Roles
   * 
   * @static
   * @param {Object} req request object
   * @return {void}
   * @memberof Validate
   */
  static book(req) {
    const title = req.body.title;
    const isbn = req.body.isbn;
    const description = req.body.description;
    const author = req.body.author;
    const copies = req.body.copies;
    const content = req.body.content;
    const category = req.body.category;

    req.checkBody('title', 'Title is Required').notEmpty();
    req.checkBody('isbn', 'ISBN is Required').notEmpty();
    req.checkBody('description', 'Description is Required').notEmpty();
    req.checkBody('author', 'Author is Required').notEmpty();
    req.checkBody('copies', 'Copies is Required').notEmpty();
    req.checkBody('content', 'Content is Required').notEmpty();
    req.checkBody('category', 'Invalid Access Type').isAlpha().notEmpty();
  }

  /**
   * Validate Input Fields for updating Roles
   * 
   * @static
   * @param {Object} req request object
   * @return {void}
   * @memberof Validate
   */
  static bookUpdate(req) {
    const keys = Object.keys(req.body);
    keys.forEach((element, index, array) => {
      if (element === 'title') {
        const title = req.body[element];
        req.checkBody('title', 'Title is Required').notEmpty();
      }
      if (element === 'isbn') {
        const isbn = req.body[element];
        req.checkBody('isbn', 'ISBN is Required').notEmpty();
      }
      if (element === 'descrition') {
        const descrition = req.body[element];
        req.checkBody('descrition', 'Description is Required').notEmpty();
      }
      if (element === 'author') {
        const author = req.body[element];
        req.checkBody('author', 'Author is Required').notEmpty();
      }
      if (element === 'copies') {
        const copies = req.body[element];
        req.checkBody('copies', 'Author is Require').isAlpha().notEmpty();
      }
      if (element === 'content') {
        const content = req.body[element];
        req.checkBody('content', 'Content is Require').isAlpha().notEmpty();
      }
      if (element === 'category') {
        const category = req.body[element];
        req.checkBody('category', 'Category is Require').isAlpha().notEmpty();
      }
    });
  }
}

module.exports = Validate;