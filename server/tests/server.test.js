const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const { Todo } = require('./../models/todo');
const { User } = require('./../models/user');

const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        var title = "Test todo text";
        request(app)
            .post('/todos')
            .send({title})
            .expect(200)
            .expect((res) => {
                expect(res.body.title).toBe(title);
            })
            .end((err, res) => {
                if(err){
                    return done(err);
                }
                //Check if Todo is stored in db
                Todo.find({title}).then((todos)=>{
                    expect(todos.length).toBe(1);
                    expect(todos[0].title).toBe(title);
                    done();
                }).catch((err) => done(err));
            });
    });

    it('should not create todo with invalid data', (done) => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if(err){
                    return done(err);
                }
                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch((err) => done(err));
            })
    });    
});

describe('GET /todos', () =>{
    it('should return all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);
    });

});

describe('GET /todos/:id', () => {
    it('should return todo', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.title).toBe(todos[0].title);
            })
            .end(done);
    });

    it('should return 404 if todo not found', (done) => {
        var id = new ObjectID().toHexString();
        request(app)
            .get(`/todos/${id}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 if id is invalid', (done) => {
        request(app)
            .get('/todos/123')
            .expect(404)
            .end(done);
    });
});

describe('DELETE /todos/:id', () => {
    it('should remove todo', (done) => {
        var hexId = todos[0]._id.toHexString();
        request(app)
            .delete(`/todos/${hexId}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(hexId);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Todo.findById(hexId).then((todo) => {
                    expect(todo).toBeFalsy();
                    done();
                }).catch((err) => done(err));
            });
    });

    it('should return 404 if todo not found', (done) => {
        var id = new ObjectID().toHexString();
        request(app)
            .delete(`/todos/{$id}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 if objectId is invald', (done) => {
        request(app)
            .delete('/todos/123')
            .expect(404)
            .end(done);
    });
});

describe('PATCH /todos/:id', () => {
    var hexId = todos[1]._id.toHexString();
    var title = 'Third Todo';
    it('should update todo', (done) => {
        request(app)
            .patch(`/todos/${hexId}`)
            .send({
                title,
                completed: true
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.title).toBe(title);
                expect(res.body.todo.completed).toBe(true);
                expect(res.body.todo.completedAt).not.toBe(null);
            })
            .end(done);
    });

    it('should clear completedAt when todo is not completed', (done) => {
        request(app)
            .patch(`/todos/${hexId}`)
            .send({
                title,
                completed: false
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.title).toBe(title);
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedAt).toBeFalsy();
            })
            .end(done);
    });
});

describe('GET /users/me', () => {
    it('should return user if authorized', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            }).end(done);
    });
    it('should return 401 if unauthorized', (done) => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done);
    });
});

describe('POST /users', () => {
    it('should create a user', (done) => {
        var user = {
            name: 'Test user 3',
            email: 'user3@test.com',
            password: 'userthree'
        };
        request(app)
            .post('/users')
            .send(user)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBeTruthy();
                expect(res.body.name).toBe(user.name);
                expect(res.body.email).toBe(user.email);
                expect(res.headers['x-auth']).toBeTruthy();
            })
            .end((err, res) => {
                if(err){
                    return done(err);
                }

                User.findOne({email: user.email}).then((doc) => {
                    expect(doc).toBeTruthy();
                    expect(doc.password).not.toBe(user.password);
                    done();
                }).catch((err) => done(err));
            });
    });
    it('should return validation errors if request invalid', (done) => {
        var user = {
            name: '  ',
            email: 'user2@test.com',
            password: 'userthree'
        };
        request(app)
            .post('/users')
            .send(user)
            .expect(400)
            .end(done);
    });
    it('should not create user if email in use', (done) => {
        var user = {
            name: 'Test user 3',
            email: 'user2@test.com',
            password: 'userthree'
        };
        request(app)
            .post('/users')
            .send(user)
            .expect(400)
            .end(done);
    });
});

describe('POST /users/login', () => {
    it('should login user and return auth token', (done) => {
        var user = { email: users[1].email, password: users[1].password };
        request(app)
            .post('/users/login')
            .send( user )
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeTruthy();
            })
            .end((err, res) => {
                if ( err ) {
                    return done(err);
                }
                User.findById(users[1]._id).then((user) => {
                    //console.log(user);
                    expect(user.tokens[0]).toMatchObject({
                        access: "auth",
                        token: res.headers['x-auth']
                    });
                    done();
                }).catch((err) => done(err));
            });
    });
    it('should reject invalid login', (done) => {
        var user = { email: 'user12@test.com', password: 'useronepass11' };
        request(app)
            .post('/users/login')
            .send(user)
            .expect(400)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeFalsy();
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch((err) => done(err));
            });
    });
});