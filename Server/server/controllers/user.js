const bcrypt = require('bcrypt');
const db = require('../models');
const validate = require('../helpers/Validate');
const authenticate = require('../helpers/Authenticate');
const handleError = require('../helpers/handleError');
const paginate = require('../helpers/paginate');

/**
 * @class User
 */
class User {
  /**
  * Create a user
  * Route: POST: /users
  *
  * @static
  * @param {Object} req request object
  * @param {Object} res response object
  * @returns {Response} response object
  * @memberof User
  */
  static create(req, res) {
    validate.user(req);
    const validateErrors = req.validationErrors();
    if (validateErrors) {
      handleError(400, validateErrors[0].msg, res);
    } else {
      db.User.findOne({ where: { email: req.body.email } })
        .then((user) => {
          if (user !== null) {
            handleError(400, 'Email already exists', res);
          } else {
            return db.User.create({
              fullName: req.body.fullName,
              username: req.body.username,
              email: req.body.email,
              password: req.body.password,
              roleId: req.body.roleId || 3
            })
              .then((newUser) => {
                newUser.save()
                  .then((savedUser) => {
                    const userInfo = authenticate.setUserInfo(savedUser);
                    const token = authenticate.generateWebToken(userInfo);
                    res.status(201).send({
                      message: 'Signup successful',
                      userData: savedUser.filterUserDetails(),
                      token
                    });
                  }).catch(() => {
                    handleError(400,
                      "Sorry, we couldn't sign you up", res);
                  });
              })
              .catch(() => {
                handleError(400, "Sorry, we couldn't sign you up", res);
              });
          }
        });
    }
  }

  /**
  * Login a user
  * Route: POST: /users/login
  *
  * @static
  * @param {Object} req request object
  * @param {Object} res response object
  * @returns {Response} response object
  * @memberof User
  */
  static login(req, res) {
    validate.user(req);
    const validateErrors = req.validationErrors();
    if (validateErrors) {
      handleError(400, validateErrors[0].msg, res);
    } else {
      db.User.findOne({ where: { email: req.body.email } })
        .then((user) => {
          if (!user) {
            handleError(400, 'User does not exist', res);
          } else {
            const verifyUser = authenticate.verifyPassword(
              req.body.password, user.password);
            if (verifyUser) {
              const userInfo = authenticate.setUserInfo(user);
              const token = authenticate.generateWebToken(userInfo);
              res.status(200).send({
                message: 'login successful',
                userData: user.filterUserDetails(),
                token
              });
            } else {
              handleError(400,
                'Wrong password, Please input correct password', res);
            }
          }
        })
        .catch(() => {
          handleError(400, "Sorry, login failed", res);
        });
    }
  }

  /**
  * Get a user
  * Route: GET: /users/:id
  *
  * @static
  * @param {Object} req request object
  * @param {Object} res response object
  * @returns {Response} response object
  * @memberof User
  */
  static view(req, res) {
    const id = authenticate.verify(req.params.id);
    if (id === false) {
      handleError(400, 'Id must be a number', res);
    }
    db.User.findOne({ where: { id } })
      .then((user) => {
        if (user) {
          res.status(200).send(
            {
              message: 'User found',
              user: user.filterUserDetails()
            });
        } else {
          handleError(404, 'User not found', res);
        }
      })
      .catch(() => {
        handleError(400,
          "Sorry, an error occured, please try again", res);
      });
  }

  /**
  * Update a user
  * Route: PUT: /users/:id
  *
  * @static
  * @param {Object} req request object
  * @param {Object} res response object
  * @returns {Response} response object
  * @memberof User
  */
  static update(req, res) {
    validate.userUpdate(req, res);
    const validateErrors = req.validationErrors();
    if (req.body.oldPassword) {
      if (!bcrypt.compareSync(req.body.oldPassword, res.locals.user.password)) {
        handleError(400, 'Old password is incorrect', res);
      }
      if (req.body.oldPassword === req.body.password) {
        handleError(400, 'Please change your password', res);
      }
    }
    if (validateErrors) {
      handleError(400, validateErrors[0].msg, res);
    } else {
      const id = authenticate.verify(req.params.id);
      if (id === false) {
        handleError(400, 'Id must be a number', res);
      }
      db.User.findById(id)
        .then((user) => {
          db.User.findAll({ where: { email: req.body.email } })
            .then((existingUser) => {
              if ((existingUser.length !== 0) &&
                (existingUser[0].id !== res.locals.user.id)) {
                handleError(400, 'Email already exists', res);
              } else {
                user.update(req.body).then((updatedUser) => {
                  const userInfo = authenticate.setUserInfo(updatedUser);
                  const token = authenticate.generateWebToken(userInfo);
                  res.status(200).send(
                    {
                      message: 'User information has been updated',
                      updatedUser: updatedUser.filterUserDetails(),
                      token
                    });
                }).catch(() => {
                  handleError(400,
                    "we're sorry, there was an error, please try again", res);
                });
              }
            }).catch((error) => {
              handleError(400,
                `We're sorry,${error.errors[0].message}, please try again`,
                res);
            });
        })
        .catch(() => {
          handleError(400, 'User not found', res);
        });
    }
  }

  /**
  * Delete a user
  * Route: DELETE: /users/:id
  *
  * @static
  * @param {Object} req request object
  * @param {Object} res response object
  * @returns {Response} response object
  * @memberof User
  */
  static remove(req, res) {
    const id = authenticate.verify(req.params.id);
    if (id === false) {
      handleError(400, 'Id must be a number', res);
    }
    return db.User.findById(id)
      .then((user) => {
        if (user === null) {
          handleError(404, 'User not found', res);
        } else {
          user.destroy()
            .then(() => {
              res.status(200).send({ message: 'User has been deleted' });
            });
        }
      }).catch(() => {
        handleError(400, "We're sorry, we had an error, please try again", res);
      });
  }

  /**
  * Get users
  * Route: GET: /search/users and
  * Route: GET: /users/?limit=[integer]&offset=[integer]&q=[username]
  *
  * @static
  * @param {Object} req request object
  * @param {Object} res response object
  * @returns {Response} response object
  * @memberof User
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
    const query = {
      offset: offset || 0,
      limit: limit || 5,
      include: [{
        model: db.Role,
        attributes: ['title']
      }],
      where: {
        $or: [
          { firstName: { $iLike: `%${searchTerm}%` } },
          { lastName: { $iLike: `%${searchTerm}%` } }
        ]
      }
    };

    return db.User.findAndCount(query)
      .then((users) => {
        res.status(200).send(
          {
            message: 'Users found',
            userList: users.rows.map(user => user.filterUserList()),
            metaData: paginate(users.count, limit, offset)
          });
      })
      .catch(() => {
        handleError(400, "Sorry, an error occured, please try again", res);
      });
  }

  /**
  * Logout a user
  * Route: POST: /users/login
  *
  * @static
  * @param {Object} req request object
  * @param {Object} res response object
  * @returns {Response} response object
  * @memberof User
  */
  static logout(req, res) {
    res.status(200).send({
      message: 'Success, delete user token'
    });
  }
}

module.exports = User;