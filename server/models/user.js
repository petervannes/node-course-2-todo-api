const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

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
  // user.tokens.push({
  //   access,
  //   token
  // }) ;
  user.tokens = user.tokens.concat([{
    access,
    token
  }]) ;
  return user.save().then(() => {
    return token;
  })
};

UserSchema.statics.findByToken = function(token) {
  var User = this;

  var decoded = undefined;

  try {
    decoded = jwt.verify(token, 'abcd123') ;
  // console.log(`Decoded token ${JSON.stringify(decoded, undefined, 2)}`);
  } catch (error) {
    // console.log('findByToken error ', error);
    return Promise.reject();
  // return new Promise((resolve, reject) => {
  //   reject() ;
  // });
  };

  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });

};

UserSchema.pre('save', function(next) {
  var user = this;

  if (user.isModified('password')) {

    bcrypt.genSalt(10, (error, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash ;
        next() ;
      })
    }) ;
  } else {
    next() ;
  }

});

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
