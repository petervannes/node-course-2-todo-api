// const MongoClient = require('mongodb').MongoClient;
const {
  MongoClient, ObjectID
} = require('mongodb');


var obj = new ObjectID();

console.log(obj);


MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, client) => {

  if (error) {
    return console.log('Unable to connect to MongoDB server.')
  }

  console.log('Connected to MongoDB server.');

  const db = client.db('TodoApp');
  //


  db.collection('Users').findOneAndUpdate({
    name: 'Jan'
  }, {
    $inc: {
      age: 1
    },
    $set: {
      location: 'somewhere'
    }
  }, {
    returnOriginal: false

  }).then((result) => {
    console.log(result);
  })

})

//client.close();
