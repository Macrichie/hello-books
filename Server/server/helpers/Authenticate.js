const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


//Authenticate

class Authenticate {
//Return secure user details

  static setUserInfo(request) {
    return {
      id: request.id,
      firstname: request.firstname,
      lastname: request.lastname,
      email: request.email,
      roleId: request.roleId,
    };
  }

//Generate a token

  static generateWebToken(user) {
    return jwt.sign(user, process.env.SECRET, {
      expiresIn: 60 * 60 * 24 * 7
    });
  }

//Compares password with hashed password

  static verifyPassword(password, hash) {
    return bcrypt.compareSync(password, hash);
  }

//check if input is a number

  static verify(request) {
    const number = Number(request);
    if (isNaN(number)) return false;
    return Number(request);
  }

//Permits user or admin

  static permitUserOrAdmin(req, res, next) {
    if (
      req.user.roleId === 1 || Number(req.params.id) === Number(req.user.id)) {
      res.locals.user = req.user;
      return next();
    }
    return res.status(401).send(
      { message: 'You are unauthorized for this action' });
  }


//Permits only admin

  static permitAdmin(req, res, next) {
    if (req.user.roleId !== 1) {
      return res.status(401).send(
        { message: "We're sorry, you're not authorized for this feature" });
    }
    res.locals.user = req.user;
    return next();
  }
}
module.exports = Authenticate;