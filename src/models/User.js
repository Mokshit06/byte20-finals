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
  availableTime: {
    from: {
      type: Number,
    },
    to: {
      type: Number,
    },
  },
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
