const express = require('express');
const router = express.Router();
const Driver = require('../models/Driver');
const Help = require('../models/Help');
const { ensureAuth, ensureDataEntered } = require('../middleware/auth');
const mongoose = require('mongoose');

router.get('/training', (req, res) => {
  res.render('driver/training');
});

router.get('/:id', ensureAuth, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.render('404');
  }

  const driver = await Driver.findById(req.params.id);

  if (!driver) {
    return res.render('404');
  }

  const ridesGiven = await Help.count({ 'informedUsers.driver': driver.id });
  const ridesDone = await Help.count({ readyToHelp: driver.id });

  res.render('driver/id.ejs', {
    driver,
    ridesDone,
    ridesGiven,
  });
});

router.post('/training', ensureAuth, ensureDataEntered, async (req, res) => {
  if (!req.user.training) {
    return res.status(403).send({ message: 'You are not a driver' });
  }

  const { course } = req.body;

  if (!course) {
    res.end();
  }

  console.log(course);

  req.user.training.push(course);
  await req.user.save();

  res.redirect('/account/overview', 302);
});

module.exports = router;
