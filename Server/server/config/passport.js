const passportJWT = require('passport-jwt');

const db = require('../models');


module.exports = (passport) => {
  const ExtractJwt = passportJWT.ExtractJwt;
  const JwtStrategy = passportJWT.Strategy;
  const jwtOptions = {};
  jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeader();
  jwtOptions.secretOrKey = process.env.SECRET;

  const strategy = new JwtStrategy(jwtOptions, (jwtPayload, next) => {
    return db.User.findOne({ where: { email: jwtPayload.email } })
      .then((user) => {
        if (user) {
          return next(null, user);
        }
        return next(null, false);
      })
      .catch(err => next(err, false));
  });
  passport.use(strategy);
};
