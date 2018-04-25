
// External modules
const config = require('./config/config');
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

// Local modules
const {mongoose} = require('./db/mongoose');
const {User} = require('./models/user');
const {Todo} = require('./models/todo');

const port = process.env.PORT;

var app = express();

app.use(bodyParser.json());

app.post('/todos', (request, response) => {
  console.log("POST", request.body);

  var todo = new Todo({
    text: request.body.text,
    completed: request.body.completed
  })

  todo.save().then((doc) => {
    response.send(doc);
  },
    (e) => {
      response.status(400).send(e);
    });
});

app.get('/todos', (request, response) => {
  console.log("GET ", request.body);

  Todo.find().then((todos) => {
    response.send({
      todos,
      test: "ok"
    });
  },
    (e) => {
      response.status(400).send(e)
    });
})

app.get('/todos/:id', (request, response) => {
  var id = request.params.id;

  // console.log('ID ', id);
  if (!ObjectID.isValid(id)) {
    return response.status(404).send({
      msg: 'invalid id'
    });
    console.log('Invalid ID ', id);
  }
  // else {

  Todo.findById(id)
    .then(
      (todos) => {
        if (!todos) {
          return response.status(404).send({});
        } else {
          response.send({
            todos
          });
        }
      },
      (error) => {
        response.status(400).send({
          error
        });
      })
    .catch((error) => {
      console.log("catch", error);
      response.status(400).send({
        error
      })
    });
// }
});


app.delete('/todos/:id', (request, response) => {
  var id = request.params.id;
  console.log('deleting ', id)


  if (!ObjectID.isValid(id)) {
    return response.status(404).send({
      msg: 'invalid id'
    });
    console.log('Invalid ID ', id);
  }


  Todo.findByIdAndRemove(id)
    .then((todo) => {
      if (!todo) {
        return response.status(404).send({});
      } else {
        response.send({
          todo
        }) ;
      }
    }, (error) => {
      response.status(400).send({
        error
      }) ;
      console.log(">>>>error") ;
    })
    .catch((error) => {
      console.log(">>>>catch", error) ;
      response.status(400).send({
        error
      }) ;
    }) ;
})


app.patch('/todos/:id', (request, response) => {
  var id = request.params.id;
  console.log("Patch ", id)
  var body = _.pick(request.body, ['text', 'completed']);

  if (!ObjectID.isValid(id)) {
    return response.status(404).send({
      msg: 'invalid id'
    });
    console.log('Invalid ID ', id);
  }


  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime() ;
  } else {
    body.completed = false ;
    body.completedAt = null ;
  }


  Todo.findByIdAndUpdate(id, {
    $set: body
  }, {
    new: true
  })
    .then((todo) => {

      if (!todo) {
        return response.status(404).send()
      }
      response.send(todo);
    })
    .catch((error) => {
      response.status(400).send() ;
    })


}) ;

app.post('/users', (request, response) => {
  console.log("POST", request.body);

  var body = _.pick(request.body, ['email', 'password']);
  var user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken();
  // response.send(user);
  }).then((token) => {
    response.header('x-auth', token).send(user)
  }).catch((e) => {
    console.log(JSON.stringify(e, undefined, 4));
    console.log(Object.keys(e));
    console.log(e);
    response.status(400).send(_.values(_.pick(e, ['errors.email.message', 'errors.password.message', 'errmsg']))) ;
  });
});

app.listen(port, () => {
  console.log(`Started at port ${port}`);
})

// mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://localhost:27017/TodoApp');

// var User = mongoose.model('User', {
//   email: {
//     type: String,
//     required: true,
//     trim: true,
//     minLength: 1,
//     validate: {
//       validator: function(v) {
//         return
//         /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
//         .test(v);
//       },
//       message: '{VALUE} is not a valid email!'
//     }
//
//   }
//
// })

// var Todo = mongoose.model('Todo', {
//   text: {
//     type: String,
//     required: true,
//     minLength: 1,
//     trim: true
//   },
//   completed: {
//     type: Boolean,
//     default: false
//
//   },
//   completedAt: {
//     type: Number,
//     default: null
//   }
// });

// var newTodo = new Todo({
//   text: 'Do something',
//   completed: false
// });
//
// newTodo.save().then((result) => {
//   console.log(`Stored todo ${result}`)
// }, (error) => {
//   console.log(`Failed storing todo ${error}`)
// });

//

// var newTodo = new Todo({
//   text: 'Do something esle',
//   completed: true,
//   completedAt: Date.now()
// });

// var newTodo = new Todo({
//   text: '  Something here   '
// });
//
// newTodo.save().then((result) => {
//   console.log(`Stored todo ${JSON.stringify(result,undefined,2)}`)
// }, (error) => {
//   console.log(`Failed storing todo ${error}`)
// });

// var newUser = new User({
//   email: 'jan@emdmd.com'
// });
//
// newUser.save().then((result) => {
//   console.log(`Stored todo ${JSON.stringify(result,undefined,2)}`)
// }, (error) => {
//   console.log(`Failed storing todo ${error}`)
// });

module.exports = {
  app
};
