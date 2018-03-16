var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/TodoApp');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

module.exports = { mongoose };