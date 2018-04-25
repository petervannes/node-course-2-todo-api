const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minLength: 1,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email!'
    },

  },
  password: {
    type: String,
    require: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]

});


UserSchema.methods.toJSON = function() {

  var user = this;
  var userObj = user.toObject();

  return _.pick(userObj, ['_id', 'email']);


}

UserSchema.methods.generateAuthToken = function() {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({
    _id: user._id.toHexString(),
    access
  }, 'abcd123');
  user.tokens.push({
    access,
    token
  }) ;
  // user.tokens = user.tokens.concat([{
  //   access,
  //   token
  // }]) ;
  return user.save().then(() => {
    return token;
  })
};

var User = mongoose.model('User', UserSchema);

/*
validator: function(value) {
  return
    /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
    .test(v);
},*/

module.exports = {
  User
};
