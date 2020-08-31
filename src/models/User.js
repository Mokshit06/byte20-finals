const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true,
  },
  displayName: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  hospitals: [
    {
      name: {
        type: String,
        required: true,
      },
    },
  ],
  address: {
    type: String,
  },
  location: [
    {
      type: Number,
    },
    {
      type: Number,
    },
  ],
  price: {
    type: Number,
    default: 400,
  },
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
