const db = require('../models');
const validate = require('../helpers/Validate');
const authenticate =  require('../helpers/Authenticate');
const handleError = require('../helpers/handleError');

/**
 * @class Role
 */
class Role {

  /**
  * Create a role
  * Route: POST: /roles
  *
  * @static
  * @param {Object} req request object
  * @param {Object} res response object
  * @returns {Response} response object
  * @memberof Role
  * @method create
  */
  static create(req, res) {
    validate.role(req);
    const validateErrors = req.validationErrors();
    if (validateErrors) {
      res.status(400).send({ message: validateErrors[0].msg});
    } else {
      db.Role.findOne({ where: { title: req.body.title } })
        .then((role) => {
          if (role !== null) {
            handleError(400, 'Role already exist', res);
          } else {
            return db.Role.create({
              title: req.body.title,
              description: req.body.description
            })
              .then((newRole) => {
                newRole.save().then((savedRole) => {
                  res.status(201).send({ message: 'Role created', savedRole });
                });
              })
              .catch(() => {
                handleError(400,
                  "Sorry, role couldn't be created", res);
              });
          }
        });
    }
  }

  /**
  * Get roles
  * Route: GET: /roles or GET: /roles
  *
  * @static
  * @param {Object} req request object
  * @param {Object} res response object
  * @returns {Response} response object
  * @memberof Role
  */
  static view(req, res) {
    db.Role.findAll({
      where: { id: { $not: [1, 2, 3, 4] } },
      order: [['createdAt', 'DESC']]
    })
      .then((roles) => {
        if (roles.length === 0) {
          handleError(404,
            'There are no roles currently', res);
        }
        return res.status(200).send({ message: 'Roles found', roles });
      }).catch(() => {
        handleError(400,
          "We're sorry, the new role couldn't be created", res);
      });
  }

  /**
  * Update a role
  * Route: PUT: /roles/:id
  *
  * @static
  * @param {Object} req request object
  * @param {Object} res response object
  * @returns {Response} response object
  * @memberof Role
  */
  static update(req, res) {
    validate.roleUpdate(req);
    const validateErrors = req.validationErrors();
    if (validateErrors) {
      handleError(400, validateErrors[0].msg, res);
    } else {
      const id = authenticate.verify(req.params.id);
      if (id === false) {
        handleError(400, 'Id must be a number', res);
      }
      db.Role.findById(id)
        .then((roles) => {
          if (roles === null) {
            return res.status(404).send({ message: 'Role not found' });
          }
          roles.update({
            title: req.body.title || roles.title,
            description: req.body.description || roles.description
          }).then((updatedRole) => {
            return res.status(200).send({
              message: 'Role successfully updated',
              updatedRole
            });
          })
            .catch((error) => {
              handleError(404,
                `we're sorry, role ${error.errors[0].message}`, res);
            });
        })
        .catch(() => {
          handleError(404,
            "we're sorry, there was an error, please try again", res);
        });
    }
  }

  /**
  * Delete a role
  * Route: DELETE: /roles/:id
  *
  * @static
  * @param {Object} req request object
  * @param {Object} res response object
  * @returns {Response} response object
  * @memberof Role
  */
  static delete(req, res) {
    const id = authenticate.verify(req.params.id);
    if (id === false) {
      handleError(400, 'Id must be a number', res);
    }
    db.Role.findById(id)
      .then((roles) => {
        if (roles === null) {
          return res.status(404).send({ message: 'Role not found' });
        }
        roles.destroy()
          .then(() => {
            return res.status(200).send({ message: 'Role has been deleted' });
          });
      }).catch(() => {
        handleError(404, 'Role not found', res);
      });
  }
}

module.exports = Role;
