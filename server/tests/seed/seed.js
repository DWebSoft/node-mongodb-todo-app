const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const { Todo } = require('./../../models/todo');
const { User } = require('./../../models/user');
const todos = [
    { _id: new ObjectID(), title: 'First todo' },
    {
        _id: new ObjectID(),
        title: 'Second todo',
        completed: true,
        completedAt: 1213
    }
];

const populateTodos = (done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
};

var userOneId = new ObjectID();
var userTwoId = new ObjectID();
const users = [
    {
        _id: userOneId,
        name: 'Test User 1',
        email: 'user1@test.com',
        password: 'useronepass',
        tokens: [
            {
                access: 'auth',
                token: jwt.sign({_id:userOneId,access:'auth'}, 'abc123').toString()
            }
        ] 
    },
    {
        _id: userTwoId,
        name: 'Test User 2',
        email: 'user2@test.com',
        password: 'usertwopass',
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