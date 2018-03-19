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

  // console.log(db.collection('Todos').find({})
  // db.collection('Todos').find({
  //   text2: 'mum.'
  // }).toArray().then((docs) => {

  // db.collection('Todos').find({
  //   _id: new ObjectID('5ab0301eb179fba95f9a15d2')
  // }).toArray().then((docs) => {
  //
  //
  //   console.log('Todo\'s');
  //   console.log(JSON.stringify(docs, undefined, 2));
  //
  // }, (err) => {
  //   console.log('Unable to fetc todos', err)
  // })

  // db.collection('Todos').find({}).count().then((count) => {
  //
  //   console.log(count, ' objects');
  // }, (error) => {
  //
  // })


  db.collection('Users').find({
    name: 'Peter'
  }).toArray().then((docs) => {


    console.log('User\'s');
    console.log(JSON.stringify(docs, undefined, 2));

  }, (err) => {
    console.log('Unable to fetc todos', err)
  })

  // console.log(count);

})

//client.close();
