var express = require('express');
var { mongoose } = require('./../db/mongoose');
var { Todo } = require('./../models/todo');
var { authenticate } = require('./../middleware/authenticate');
const _ = require('lodash');
const { ObjectID } = require('mongodb');

var router = express.Router();

router.post('/', authenticate, (req, res) => {
    var todo = new Todo({
        title: req.body.title,
        _creator: req.user._id
    });

    todo.save().then((todo) => {
        res.send(todo);
    }, (err) => {
        res.status(400).send(err);
    });
});

router.get('/', authenticate, (req, res) => {
    Todo.find({ _creator: req.user._id }).then((todos) => {
        res.send({ todos });
    }, (err) => {
        res.status(400).send(err);
    });
});

router.get('/:id', authenticate, (req, res) => {
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Todo.findOne({ _id: id, _creator: req.user._id }).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }
        res.send({ todo });
    }).catch((err) => {
        res.status(400).send(err);
    });
});

router.delete('/:id', authenticate, (req, res) => {
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Todo.findOneAndRemove({ _id: id, _creator: req.user._id }).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }
        res.send({ todo });
    }).catch((err) => {
        res.status(400).send(err);
    })
});

router.patch('/:id', authenticate, (req, res) => {
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    var body = _.pick(req.body, ['title', 'completed']);

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findOneAndUpdate({ _id: id, _creator: req.user._id }, { $set: body }, { new: true }).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }
        res.send({ todo });
    }).catch((err) => () => {
        res.status(400).send(err);
    });
});

module.exports = router;