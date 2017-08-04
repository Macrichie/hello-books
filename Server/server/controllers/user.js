const User = require('../models').User;
const Books = require('../models').Books;

module.exports = {
	create(req, res) {
		return User
			.create({
				name: req.body.name,
                email: req.body.email,
                password: req.body.password,
			})
			.then(user => res.status(201).send(user))
			.catch(error => res.status(400).send(error));
	},
	retrieve(req, res) {
  		return User
    		.findById(req.params.userId)
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
      return User
      .findById(req.params.userId)
      .then(user => {
        if (!user) {
          return res.status(404).send({
            message: 'User Not Found',
          });
        }
        return user
          .update({
            name: req.body.name || user.title,
            email: req.body.email || user.email,
            password: req.body.password || user.password,
          })
          .then(() => res.status(200).send(user))  // Send back the updated user.
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },
  destroy(req, res) {
    return User
      .findById(req.params.userId)
      .then(user => {
        if (!user) {
          return res.status(400).send({
            message: 'User Not Found',
          });
        }
        return user
          .destroy()
          .then(() => res.status(200).send({ message: 'User deleted successfully.' }))
          .catch(error => res.status(400).send(error));
      })
      .catch(error => res.status(400).send(error));
  },


};