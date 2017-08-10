const db = require('../models');
const validate = require('../helpers/Validate');
const authenticate =  require('../helpers/Authenticate');


class Role {

/*
Create a role
Route: POST: /roles
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
            res.status(400).send({ message: 'Role already exist'});
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
                res.status(400).send({ message: "Sorry, role couldn't be created"});
              });
          }
        });
    }
  }

/*
Get roles
Route: GET: /roles or GET: /roles
*/
  static view(req, res) {
    db.Role.findAll({
      where: { id: { $not: [1, 2, 3, 4] } },
      order: [['createdAt', 'DESC']]
    })
      .then((roles) => {
        if (roles.length === 0) {
          res.status(404).send({ message: 'There are no roles currently'});
        }
        return res.status(200).send({ message: 'Roles found', roles });
      }).catch(() => {
        res.status(400).send({ message: "We're sorry, the new role couldn't be created"});
      });
  }

/*
Update a role
Route: PUT: /roles/:id
*/
  static update(req, res) {
    validate.roleUpdate(req);
    const validateErrors = req.validationErrors();
    if (validateErrors) {
      res.status(400).send({ message: validateErrors[0].msg});
    } else {
      const id = authenticate.verify(req.params.id);
      if (id === false) {
        res.status(400).send({ message: 'Id must be a number'});
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
              res.status(404).send({ message: `we're sorry, role ${error}`});
            });
        })
        .catch(() => {
          res.status(404).send({ message: "we're sorry, there was an error, please try again"});
        });
    }
  }

/*
Delete a role
Route: DELETE: /roles/:id
*/
  static delete(req, res) {
    const id = authenticate.verify(req.params.id);
    if (id === false) {
      res.status(400).send({ message: 'Id must be a number'});
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
        res.status(404).send({ message: 'Role not found'});
      });
  }
}

module.exports = Role;
