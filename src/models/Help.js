const mongoose = require('mongoose');

const HelpSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  hospital: {
    type: String,
    required: true,
  },
  informedUsers: [
    {
      driver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Driver',
        required: true,
      },
    },
  ],
  emergencyType: {
    type: String,
    required: true,
    enum: ['normal', 'extreme', 'medium'],
  },
  readyToHelp: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
  },
  symptoms: {
    type: String,
  },
});

const Help = mongoose.model('Help', HelpSchema);

module.exports = Help;
