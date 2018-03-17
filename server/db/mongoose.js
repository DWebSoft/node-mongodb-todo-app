var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

var connectPath;
//Check if we are on Heroku
if(process.env.PORT){
    connectPath = "mongodb://durgesh@ds115579.mlab.com:15579/durgesh-todo";
    creds = {
        auth: {
            user: 'durgesh',
            password: 'durgesh7$$'
        }
    }
}else{
    connectPath = "mongodb://localhost:27017/TodoApp";
    creds = {}
}
mongoose.connect(connectPath, creds);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

module.exports = { mongoose };