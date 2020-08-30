const express = require('express');
const User = require('../models/User');
const router = express.Router();

router.get('/', async (req, res) => {
  const users = await User.find({});

  res.send(users);
});

router.get('/data', (req, res) => {
  // res.send('Change data');
  res.render('data-form');
});

router.post('/data', async (req, res) => {
  const { name, hospitals, availableTime } = req.body;
  const user = req.user || req.tempUser;

  user.displayName = name;
  user.hospitals = hospitals;
  user.availableTime = availableTime;

  await user.save();
  res.send({
    message: 'User data added',
  });
});

module.exports = router;
