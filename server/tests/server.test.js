const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

var todos = [
    { _id: new ObjectID(), title: 'First todo' },
    { _id: new ObjectID(), title: 'Second todo' }
];

beforeEach((done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
});

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