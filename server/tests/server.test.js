const {Todo} = require('./../models/todo');
const {app} = require('./../server');
const request = require('supertest');
const expect = require('expect');
const {ObjectID} = require('mongodb');
const {User} = require('./../models/user');

const {todos, populateTodos, users, populateUsers} = require('./seed/seed');
// const todos = [
//   {
//     _id: new ObjectID(),
//     text: 'first todo',
//     completed: true,
//     completedAt: 1
//   },
//   {
//     _id: new ObjectID(),
//     text: 'second todo',
//     completed: false,
//     completedAt: 1234
//   },
//   {
//     _id: new ObjectID(),
//     text: 'third todo',
//     completed: false
//   }
// ]
// beforeEach((done) => { Todo.remove({}).then(() => done()); })
// beforeEach((done) => {Todo.remove({}).then(() => {
//              for (todoCnt in todos) {
//                console.log("Adding Todo to DB", todos[todoCnt]);
//                var saveTodo = new Todo(todos[todoCnt]);
//
//                saveTodo.save();
//              };
//              done();
//            })})

beforeEach(populateUsers) ;

beforeEach(
  populateTodos);


// beforeEach((done) => {
  //   Todo.remove({})
  //     .then(() => {
  //       return Todo.insertMany(todos);
  //     })
  //     .then(() => done()).catch((error) => {
  //   });
  //
  // });


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
      // console.log(todos[0]._id.toHexString());
      request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .expect(200)
        .expect((response) => {
          // console.log(response.body);
          expect(response.body.todos.text).toBe(todos[0].text);
        })
        .end(done);
    })

    it('should return a 404 if todo not found', (done) => {
      request(app).get(`/todos/${new ObjectID().toHexString()}`).expect(404).end(done);
    })

    it('should return a 404 for invalid object-ids', (done) => {
      request(app)
        .get(`/todos/${todos[0]._id.toHexString()}111`)
        .expect(404)
        .end(done);
    })

  });


describe('DELETE /todos/id:',
  () => {
    it('should remove a todo doc', (done) => {

      var hexID = todos[0]._id.toHexString();
      // console.log(todos[0]._id.toHexString());
      request(app)
        .delete(`/todos/${hexID}`)
        .expect(200)
        .expect((response) => {
          // console.log(response.body);
          expect(response.body.todo.text).toBe(todos[0].text);
        })
        .end((err, res) => {

          if (err) {
            return done(error);
          }

          Todo.findById(hexID).then((todo) => {
            expect(todo).toBeNull() ;
            done()
          }).catch((error) => done(error));


        })
    });


    it('should return a 404 if todo not found', (done) => {
      request(app).delete(`/todos/${new ObjectID().toHexString()}`).expect(404).end(done);
    })

    it('should return a 404 for invalid object-ids', (done) => {
      request(app)
        .delete(`/todos/${todos[0]._id.toHexString()}111`)
        .expect(404)
        .end(done);
    })

  });


describe('PATCH /todos/id:',
  () => {
    it('should update the todo ', (done) => {

      var hexID = todos[1]._id.toHexString();

      request(app)
        .patch(`/todos/${hexID}`)
        .send({
          completed: true,
          text: 'Finally completed it!'
        })
        .expect(200)
        .expect((response) => {
          expect(response.body.text).toBe('Finally completed it!') ;
        })
        .end((error, response) => {

          if (error) {
            return done(error);
          }

          Todo.findById(hexID).then((todo) => {
            expect(todo.text).toBe('Finally completed it!');
            expect(typeof todo.completedAt).toBe('number');
            done()
          }).catch((error) => done(error));

        })


    }) ;


    it('should clear completedAt when todo is not completed ', (done) => {

      // grab id
      // set completed to false
      // expect 200

      // expect completed is false completAt is null

      var hexID = todos[0]._id.toHexString();

      request(app)
        .patch(`/todos/${hexID}`)
        .send({
          completed: false
        })
        .expect(200)
        .expect((response) => {
          expect(response.body.completed).toBe(false) ;
          expect(response.body.completedAt).toBeNull() ;
        })
        .end((error, response) => {

          if (error) {
            return done(error);
          }

          Todo.findById(hexID).then((todo) => {
            expect(todo.completed).toBe(false);
            expect(todo.completedAt).toBeNull() ;
            done()
          }).catch((error) => done(error));

        })



    }) ;

  })


describe('GET /users/me', () => {
  it('should return a user if authenticated', (done) => {
    request(app).get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((response) => {
        expect(response.body._id).toBe(users[0]._id.toHexString());
        expect(response.body.email).toBe(users[0].email) ;
      })
      .end(done);
  })

  it('should return a 401 if not authenticed', (done) => {
    request(app).get('/users/me')
      .expect(401)
      .expect((response) => {
        expect(response.body).toEqual({});

      })
      .end(done);
  })
});

describe('POST /users', () => {

  it('should create a user', (done) => {
    var email = 'example@example.com';
    var password = '123abc7';

    request(app)
      .post('/users')
      .send({
        email,
        password
      })
      .expect(200)
      .expect((response) => {
        expect(response.headers['x-auth']).toBeTruthy() ;
        expect(response.body._id).toBeTruthy() ;
        expect(response.body.email).toBe(email) ;

      })
      .end((error) => {

        if (error) {
          return done(error);
        }

        User.findOne({
          email
        }).then((user) => {

          expect(user).toBeTruthy() ;
          expect(user.password).not.toMatch(password);
          done() ;
        })
          .catch((error) => {
            return done(error);
          });
      });

  })

  it('should return validation errors if request is invalid', (done) => {

    var incorrectEmail = 'example@example';
    var incorrectPassword = '123abc';

    request(app)
      .post('/users')
      .send({
        email: incorrectEmail,
        password: incorrectPassword
      })
      .expect(400)
      .end(done) ;

  })


  it('should not create a user if email in use', (done) => {

    var password = '123abc7';
    request(app)
      .post('/users')
      .send({
        email: users[0].email,
        password
      })
      .expect(400)
      .end(done) ;

  })


});
