const mongoose = require('mongoose');  // Import mongoose correctly
const bcrypt = require('bcryptjs');

const { Schema, model } = mongoose;  // Destructure Schema and model

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 12,
  },
});

// Hash the password before saving it to the database
userSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('password')) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
  next();
});

// Method to compare the password
userSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = model('User', userSchema);  // Use the destructured model

module.exports = User;
