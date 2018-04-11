const {ObjectID} = require('mongodb');
const mongoose = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

const id = "5ace5bdf1f46525a6ba0ef15";


Todo.findByIdAndRemove(id).then((result) => {
  console.log(`removed record ${JSON.stringify(result, undefined, 2)}`)
}) ;


Todo.findById(id)
  .then(
    (todo) => {
      if (!todo) {
        return console.log('Todo not found');
      }
      console.log("Found record")
      Todo.deleteOne({
        _id: new ObjectID(id)
      }).then((result) => {
        console.log("Deleted record", result)

      })
    },
    (error) => {
      console.log('Error occured', error);
    })
  .catch((e) => console.log('Invalid ID', e));
