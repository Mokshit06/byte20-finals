const mongoose = require('mongoose');

const DriverSchema = new mongoose.Schema({
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
  availableTime: {
    from: {
      type: String,
    },
    to: {
      type: String,
    },
  },
  training: [
    {
      type: String,
      enum: ['cpr', 'first aid'],
    },
  ],
  hospitals: [
    {
      name: {
        type: String,
        required: true,
      },
    },
  ],
});

const Driver = mongoose.model('Driver', DriverSchema);

module.exports = Driver;
