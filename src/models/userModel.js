const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A user should have name."],
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    required: [true, "A user should have email."],
    trim: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email.'],
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    required: [true, "A user should have password."],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "A user should have password."],
    validate: {
      // ONLY WORKS ON .create and .save
      message: 'Password are not the same',
      validator(el) {
        return this.password === el;
      },
    }
  }
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
