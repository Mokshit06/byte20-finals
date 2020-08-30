const express = require('express');
const router = express.Router();
const Driver = require('../models/Driver');
const { ensureGuest } = require('../middleware/auth');

router.get('/', (req, res) => res.send('Home page'));

router.get('/login', ensureGuest, (req, res) => res.render('index'));

router.get('/drivers', async (req, res) => {
  const drivers = await Driver.find({});

  res.send(drivers);
});

router.post('/drivers/training', async (req, res) => {
  if (!req.user.training) {
    return res.status(403).send({ message: 'You are not a driver' });
  }

  const { course } = req.query;

  if (!course) {
    res.end();
  }

  if (req.user.training.includes(course)) {
    return res.status(400).send({
      message: 'Course is already completed.',
    });
  }
  req.user.training.push(course);
  await req.user.save();
  res.send(req.user);
});

module.exports = router;
