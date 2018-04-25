const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');


var data = {
  id: 5
};

var token = jwt.sign(data, 'seed');
console.log(token) ;


var decoded = jwt.verify(token, 'sesed');
console.log(decoded) ;
jwt.sign
jwt.verify


// var message = "I am user peter";
// var hash = SHA256(message).toString();

// console.log(hash) ;
