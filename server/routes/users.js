var express = require('express');
var { mongoose } = require('./../db/mongoose');
var { User } = require('./../models/user');
var { authenticate } = require('./../middleware/authenticate');
const _ = require('lodash');
const { ObjectID } = require('mongodb');
var router = express.Router();

router.post('/', (req, res) => {
    var body = _.pick(req.body, ['name', 'email', 'password']);

    var user = new User(body);
    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth', token).send(user);
    }).catch((err) => {
        res.status(400).send(err);
    });
});

router.get('/me', authenticate, (req, res) => {
    res.send(req.user);
});

router.post('/login', (req, res) => {
    var user = _.pick(req.body, ['email', 'password']);

    User.findByCredentials(user.email, user.password).then((user) => {
        return user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user);
        });
    }).catch((err) => {
        res.status(400).send(err);
    });
});

router.delete('/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.send();
    }, (err) => {
        res.status(400).send();
    })
});

module.exports = router;