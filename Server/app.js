//Modules
const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const dotenv = require('dotenv');
const passport = require('passport');
const passportConfig = require('./server/config/passport');

//const RoleController = require('./server/controllers/roles');

//configure dotenv
dotenv.config();

//Set up the express app
const app = express();

// setup passport authentication
passportConfig(passport);
app.use(passport.initialize());

//Log requests to the console.
app.use(logger('dev'));

//Parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Setup expressValidator Middleware
app.use(expressValidator({
  errorFormatter: (param, msg, value) => {
    const namespace = param.split('.');
    const root = namespace.shift();
    let formParam = root;

    while (namespace.length) {
      formParam += `[${namespace.shift()}]`;
    }
    return {
      param: formParam,
      msg,
      value
    };
  }
}));


//Require our routes into the application.
require('./server/routes')(app);

//Setup a default catch-all route that sends back a welcome message in JSON
app.get('*', (req, res)=> res.status(200).send({
	'message': 'Welcome to the beginning of greatness.',
}));

module.exports = app;