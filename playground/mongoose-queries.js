const {ObjectID} = require('mongodb');
const mongoose = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

const id = '5ab41d66a37ad068e0e4aa04';

// if (!ObjectID.isValid(id)) {
//   console.log('ID is not valid ');
// }

// Todo.find({_id : id}).then((todos) => { console.log('Todos', todos); });
//
// Todo.findOne({_id : id}).then((todo) => { console.log('Todo', todo); });

// Todo.findById(id)
//     .then((todo) => {
//       if (!todo) {
//         console.log('No Todo found');
//       }
//       console.log('Todo', todo);
//     })
//     .catch((e) => console.log(e));

User.findById(id)
    .then(
        (user) => {
          if (!user) {
            return console.log('User not found');
          }
          console.log('User', JSON.stringify(user, undefined, 2));
        },
        (error) => { console.log('Error occured', error); })
    .catch((e) => console.log('Invalid ID'));
