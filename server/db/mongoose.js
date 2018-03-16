var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

var connectPath;
if(process.env.PORT){
    connectPath = "mongodb://durgesh:durgesh7$$@ds115579.mlab.com:15579/durgesh-todo";
}else{
    connectPath = "mongodb://localhost/TodoApp";
}
mongoose.connect(connectPath);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

module.exports = { mongoose };