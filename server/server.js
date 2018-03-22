// External modules
const express = require('express');
const bodyParser = require('body-parser');

// Local modules
const {
  mongoose
} = require('./db/mongoose');

const {
  User
} = require('./models/user');
const {
  Todo
} = require('./models/todo');


var app = express();

app.use(bodyParser.json());

app.post('/todos', (request, response) => {

  console.log(request.body);

  var todo = new Todo({
    text: request.body.text,
    completed: request.body.completed
  })

  todo.save().then((doc) => {
    response.send(doc);
  }, (e) => {
    response.status(400).send(e);

  });
});


app.listen(3000, () => {
  console.log('Started on port 3000');
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
//         return /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
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
