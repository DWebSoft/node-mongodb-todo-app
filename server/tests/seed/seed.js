const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const { Todo } = require('./../../models/todo');
const { User } = require('./../../models/user');

var userOneId = new ObjectID();
var userTwoId = new ObjectID();

const todos = [
    { 
        _id: new ObjectID(),
        title: 'First todo',
        _creator: userOneId
    },
    {
        _id: new ObjectID(),
        title: 'Second todo',
        completed: true,
        completedAt: 1213,
        _creator: userTwoId
    }
];

const populateTodos = (done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
};


const users = [
    {
        _id: userOneId,
        name: 'Test User 1',
        email: 'user1@test.com',
        password: 'useronepass',
        tokens: [
            {
                access: 'auth',
                token: jwt.sign({_id:userOneId,access:'auth'},  process.env.JWT_SECRET).toString()
            }
        ] 
    },
    {
        _id: userTwoId,
        name: 'Test User 2',
        email: 'user2@test.com',
        password: 'usertwopass',
        tokens: [
            {
                access: 'auth',
                token: jwt.sign({ _id: userTwoId, access: 'auth' },  process.env.JWT_SECRET).toString()
            }
        ] 
    }
];

const populateUsers = (done) => {
    User.remove({}).then(() => {
        var userone = new User(users[0]).save();
        var usertwo = new User(users[1]).save();
        return Promise.all([userone, usertwo]);
    }).then(() => done());
}

module.exports = {todos, populateTodos, users, populateUsers}