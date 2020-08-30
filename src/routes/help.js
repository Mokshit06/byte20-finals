const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
// const User = require('../models/User');
const Driver = require('../models/Driver');
const Help = require('../models/Help');
const { sendAlertEmail } = require('../utils/emails');

router.get('/', async (req, res) => {
  res.render('help/index');
});

router.post('/', async (req, res) => {
  const { hospital, emergencyType } = req.body;

  const driversWithinRange = await Driver.find({
    'hospitals.hospital': {
      $regex: hospital,
      $options: 'i',
    },
  });

  if (driversWithinRange.length < 1) {
    return res.send({
      message: 'Sorry, no drivers in that area',
    });
  }

  const help = await Help.create({
    emergencyType,
    user: req.user.id,
    informedUsers: driversWithinRange,
    hospital,
  });

  driversWithinRange.forEach(driver => {
    sendAlertEmail({
      email: driver.email,
      name: req.user.displayName,
      hospital,
      id: help.id,
    });
  });

  res.send({
    message: 'Your response has been sent to the drivers in that area',
  });
});

router.get('/:id', async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).send({
      message: 'Page not found',
    });
  }

  const help = await Help.findById(req.params.id);

  if (!help) {
    return res.status(404).send({
      message: 'Page not found',
    });
  }

  if (help.user !== req.user) {
    return res.status(404).send({
      message: 'Page not found',
    });
  }

  if (req.headers['content-type'] === 'application/json') {
    return res.send(help.readyToHelp);
  }

  res.render('help/id', {
    help,
  });
});

router.get('/:id/do', async (req, res) => {
  const help = await Help.findById(req.params.id);

  if (!help) {
    return res.status(404).send({
      message: 'Page not found',
    });
  }

  if (!help.informedUsers.includes({ name: req.user.id })) {
    return res.status(404).send({
      message: 'Page not found',
    });
  }

  res.render('help/do', {
    help,
  });
});

router.post('/:id/do', async (req, res) => {
  const help = await Help.findById(req.params.id);

  if (!help) {
    return res.status(404).send({
      message: 'Page not found',
    });
  }

  if (!help.informedUsers.includes({ name: req.user.id })) {
    return res.status(404).send({
      message: 'Page not found',
    });
  }

  help.readyToHelp = req.user.id;

  await help.save();
});

module.exports = router;
