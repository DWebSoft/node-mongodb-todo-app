var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

var connectPath;
if(process.env.PORT){
    connectPath = "mongodb://durgesh@ds115579.mlab.com:15579/durgesh-todo";
    creds = {
        auth: {
            user: 'durgesh',
            password: 'durgesh7$$'
        }
    }
}else{
    connectPath = "mongodb://localhost/TodoApp";
    creds = {}
}
mongoose.connect(connectPath, creds);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

module.exports = { mongoose };