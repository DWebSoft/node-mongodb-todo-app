var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

//Check if we are on Heroku
if (process.env.NODE_ENV === 'production') {
    options = {
        auth: {
            user: process.env.MONGODB_USER,
            password: process.env.MONGODB_PWD
        }
    }
}else{
    options = {}
}
mongoose.connect( process.env.MONGODB_URI, options);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

module.exports = { mongoose };