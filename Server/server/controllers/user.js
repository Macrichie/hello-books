const bcrypt = require('bcrypt');
const db = require('../models');
const validate = require('../helpers/Validate');
const authenticate = require('../helpers/Authenticate');


class User {
/*
  Create a user
  Route: POST: /users
*/

  static create(req, res) {
    validate.user(req);
    const validateErrors = req.validationErrors();
    if (validateErrors) {
      res.status(400).send({message: validateErrors[0].msg});
    } else {
      db.User.findOne({ where: { email: req.body.email } })
        .then((user) => {
          if (user !== null) {
            res.status(400).send({ message: 'Email already exists'});
          } else {
            return db.User.create({
              firstname: req.body.firstname,
              lastname: req.body.lastname,
              email: req.body.email,
              password: req.body.password,
              roleId: req.body.roleId || 4
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
                  }).catch((err) => {
                    res.status(400).send({ message: "Signup Failed"});
                  });
              })
              .catch((err) => {
                res.status(400).send({ message: "Signup Failed"});
              });
          }
        });
    }
  }

/*
Login a user
Route: POST: /users/login
*/
  static login(req, res) {
    validate.user(req);
    const validateErrors = req.validationErrors();
    if (validateErrors) {
      res.status(400).send({message: validateErrors[0].msg});
    } else {
      db.User.findOne({ where: { email: req.body.email } })
        .then((user) => {
          if (!user) {
            res.status(400).send({ message: 'User does not exist'});
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
              res.status(400).send({ message: 'Wrong password, Please input correct password'});
            }
          }
        })
        .catch(() => {
          res.status(400).send({ message: "Login failed"});
        });
    }
  }

/*
Get a user
Route: GET: /users/:id
*/
  static view(req, res) {
    const id = authenticate.verify(req.params.id);
    if (id === false) {
      res.status(400).send({ message: 'Id must be a number'});
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
          res.status(400).send({ message: 'User not found'});
        }
      })
      .catch(() => {
        res.status(400).send({ message: "Sorry, an error occured, please try again"});
      });
  }

/*
Update a user
Route: PUT: /users/:id
*/
  static update(req, res) {
    validate.userUpdate(req, res);
    const validateErrors = req.validationErrors();
    if (req.body.oldPassword) {
      if (!bcrypt.compareSync(req.body.oldPassword, res.locals.user.password)) {
        res.status(400).send({ message: 'Old password is incorrect'});
      }
      if (req.body.oldPassword === req.body.password) {
        res.status(400).send({ message: 'Please change your password'});
      }
    }
    if (validateErrors) {
      res.status(400).send({message: validateErrors[0].msg});
    } else {
      const id = authenticate.verify(req.params.id);
      if (id === false) {
        res.status(400).send({ message: 'Id must be a number'});
      }
      db.User.findById(id)
        .then((user) => {
          db.User.findAll({ where: { email: req.body.email } })
            .then((existingUser) => {
              if ((existingUser.length !== 0) &&
                (existingUser[0].id !== res.locals.user.id)) {
                res.status(400).send({ message: 'Email already exists'});
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
                  res.status(400).send({ message: "we're sorry, there was an error, please try again"});
                });
              }
            }).catch((error) => {
              res.status(400).send({ message: `We're sorry,${error} please try again`});
            });
        })
        .catch(() => {
          res.status(400).send({ message: 'User not found'});
        });
    }
  }

/*
Delete a user
Route: DELETE: /users/:id
*/
  static remove(req, res) {
    const id = authenticate.verify(req.params.id);
    if (id === false) {
      res.status(400).send({ message: 'Id must be a number'});
    }
    return db.User.findById(id)
      .then((user) => {
        if (user === null) {
          res.status(400).send({ message: 'User not found'});
        } else {
          user.destroy()
            .then(() => {
              res.status(200).send({ message: 'User has been deleted' });
            });
        }
      }).catch(() => {
        res.status(400).send({ message: "We're sorry, we had an error, please try again"});
      });
  }

/*
Get users
Route: GET: /search/users and
Route: GET: /users/?limit=[integer]&offset=[integer]&q=[username]
*/
  static search(req, res) {
    let searchTerm = '%%';
    if (req.query.q) {
      searchTerm = `%${req.query.q}%`;
    }
    const query = {
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

    return db.User.findAll(query)
      .then((users) => {
        res.status(200).send(
          {
            message: 'Users found',
            userList: users.rows.map(user => user.filterUserList())
          });
      })
      .catch(() => {
        res.status(400).send({ message: "Sorry, an error occured, please try again"});
      });
  }

/*
Logout a user
Route: POST: /users/login
*/
  static logout(req, res) {
    res.status(200).send({
      message: 'Success, delete user token'
    });
  }
}

module.exports = User;