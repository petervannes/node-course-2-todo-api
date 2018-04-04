const {Todo} = require('./../models/todo');
const {app} = require('./../server');
const request = require('supertest');
const expect = require('expect');

const testTodos = [
  {text : 'first todo'}, {text : 'second todo', completedAt : 1234},
  {text : 'third todo', completed : false}
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
      .then(() => { return Todo.insertMany(testTodos); })
      .then(() => done());
});

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    var text = "Hi mum! testing TEXT";

    request(app)
        .post('/todos')
        .send({text})
        .expect(200)
        .expect((response) => {expect(response.body.text).toBe(text)})
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
             .expect((response) => {expect(response.body.todos.length).toBe(3)})
             .end((error, response) => {
               if (error) {
                 return done(error);
               } else {
                 return done();
               }
             })

     });
});
