//Modules
const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

const RoleController = require('./server/controllers/roles');
//Set up the express app
const app = express();
//Log requests to the console.
app.use(logger('dev'));
//Parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//Require our routes into the application.
//require('./server/routes')(app);

app.post('/roles', RoleController.create);
// app.get('/roles', RoleController.findAll);
// app.delete('/roles', RoleController.deleteAll);

//Setup a default catch-all route that sends back a welcome message in JSON
app.get('*', (req, res)=> res.status(200).send({
	'message': 'Welcome to the beginning of greatness.',
}));

module.exports = app;