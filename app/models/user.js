// Example model

const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

const {
  SECRET,
} = process.env;
const {
  Schema,
} = mongoose;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
}, {
  strictQuery: true,
  timestamps: true,
});

UserSchema.set('toObject', {
  virtuals: true,
});
UserSchema.set('toJSON', {
  virtuals: true,
});

function comparePassword(password) {
  return new Promise((resolve, reject) => bcrypt.compare(password, this.password, (err, stat) => {
    if (err) {
      return reject(err);
    }
    return resolve(stat);
  }));
}

function save(next) {
  const user = this;
  bcrypt.hash(user.password, 15, (err, hash) => {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  });
}

function generateJwt() {
  const user = this;
  return jwt.sign({
    email: user.email,
    name: user.name,
  }, SECRET);
}

UserSchema.pre('save', save);
UserSchema.methods.comparePassword = comparePassword;
UserSchema.methods.generateJwt = generateJwt;

module.exports = mongoose.model('Users', UserSchema);
