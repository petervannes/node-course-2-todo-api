const {Todo} = require('./../models/todo');
const {app} = require('./../server');
const request = require('supertest');
const expect = require('expect');
const {ObjectID} = require('mongodb');

const testTodos = [
  {
    _id: new ObjectID(),
    text: 'first todo'
  },
  {
    _id: new ObjectID(),
    text: 'second todo',
    completedAt: 1234
  },
  {
    _id: new ObjectID(),
    text: 'third todo',
    completed: false
  }
]
// beforeEach((done) => { Todo.remove({}).then(() => done()); })
// beforeEach((done) => {Todo.remove({}).then(() => {
//              for (todoCnt in testTodos) {
//                console.log("Adding Todo to DB", testTodos[todoCnt]);
//                var saveTodo = new Todo(testTodos[todoCnt]);
//
//                saveTodo.save();
//              };
//              done();
//            })})

beforeEach((done) => {
  Todo.remove({})
    .then(() => {
      return Todo.insertMany(testTodos);
    })
    .then(() => done());
});

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    var text = "Hi mum! testing TEXT";

    request(app)
      .post('/todos')
      .send({
        text
      })
      .expect(200)
      .expect((response) => {
        expect(response.body.text).toBe(text)
      })
      .end((error, response) => {
        if (error) {
          return done(error);
        }

        Todo.find()
          .then((todos) => {
            expect(todos.length).toBe(4);
            expect(todos[3].text).toBe(text);
            done();
          })
          .catch((error) => done(error));
      });
  });

  it('should not create a new todo with invalid body data', (done) => {
    request(app).post('/todos').send({}).expect(400).end((error, response) => {
      if (error) {
        return done(error);
      }

      Todo.find()
        .then((todos) => {
          expect(todos.length).toBe(3);
          done();
        })
        .catch((error) => done(error));
    });
  });
});

describe('GET /todos', () => {

  it('should return all todos',
    (done) => {
      request(app)
        .get('/todos')
        .expect(200)
        .expect((response) => {
          expect(response.body.todos.length).toBe(3)
        })
        .end((error, response) => {
          if (error) {
            return done(error);
          } else {
            return done();
          }
        })

    });
});

describe('GET /todos/id:',
  () => {
    it('should return a todo doc', (done) => {
      // console.log(testTodos[0]._id.toHexString());
      request(app)
        .get(`/todos/${testTodos[0]._id.toHexString()}`)
        .expect(200)
        .expect((response) => {
          // console.log(response.body);
          expect(response.body.todos.text).toBe(testTodos[0].text);
        })
        .end(done);
    })

    it('should return a 404 if todo not found', (done) => {
      request(app).get(`/todos/${new ObjectID().toHexString()}`).expect(404).end(done);
    })

    it('should return a 404 for invalid object-ids', (done) => {
      request(app)
        .get(`/todos/${testTodos[0]._id.toHexString()}111`)
        .expect(404)
        .end(done);
    })

  });


describe('DELETE /todos/id:',
  () => {
    it('should remove a todo doc', (done) => {
      // console.log(testTodos[0]._id.toHexString());
      request(app)
        .delete(`/todos/${testTodos[0]._id.toHexString()}`)
        .expect(200)
        .expect((response) => {
          console.log(response.body);
          expect(response.body.todo.text).toBe(testTodos[0].text);
        })
        .end(done);
    })

    it('should return a 404 if todo not found', (done) => {
      request(app).delete(`/todos/${new ObjectID().toHexString()}`).expect(404).end(done);
    })

    it('should return a 404 for invalid object-ids', (done) => {
      request(app)
        .delete(`/todos/${testTodos[0]._id.toHexString()}111`)
        .expect(404)
        .end(done);
    })

  });
