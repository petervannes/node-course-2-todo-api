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

  // db.collection('Todos').deleteMany({
  //   text2: 'dad.'
  // }).then((result) => {
  //   console.log(result);
  // })
  //
  // db.collection('Todos').deleteOne({
  //   text2: 'mum.'
  // }).then((result) => {
  //   console.log(result);
  // })


  // db.collection('Todos').findOneAndDelete({
  //   _id: new ObjectID('5ab1652b96d916d80ed94aff')
  // }).then((result) => {
  //   console.log(result);
  // })


  // db.collection('Users').deleteMany({
  //   name: 'Klaas'
  // }).then((result) => {
  //   console.log(result);
  // })

  db.collection('Users').findOneAndDelete({
    _id: new ObjectID('5ab02ef6c477e9a8c79bc9ad')
  }).then((result) => {
    console.log(result);
  })

})

//client.close();
