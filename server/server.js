require('./config/config')

const express = require('express');
const bodyParser = require('body-parser');

//Logger
var fs = require('fs');
var morgan = require('morgan');
var path = require('path');
var rfs = require('rotating-file-stream');

var logDirectory = path.join(__dirname, 'log');

// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

// create a rotating write stream
var accessLogStream = rfs('access.log', {
    interval: '1d', // rotate daily
    path: logDirectory
});

//Routes
var todos = require('./routes/todos');
var users = require('./routes/users');

const app = express();
const port = process.env.PORT;

// setup the logger
app.use(morgan('combined', { stream: accessLogStream }));

app.use(bodyParser.json());

app.use('/todos', todos);
app.use('/users', users);

app.listen(port, () => {
    console.log(`Server started at port ${port}`);
});

module.exports = {app}