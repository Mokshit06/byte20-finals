const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
// const User = require('../models/User');
const Driver = require('../models/Driver');
const Help = require('../models/Help');
const { sendAlertEmail } = require('../utils/emails');

router.get('/', async (req, res) => {
  let hospitalsArr = (await Driver.find({})).map(driver => driver.hospitals);

  hospitalsArr = hospitalsArr.flat(1).map(hospital => hospital.name);

  const hospitals = [...new Set(hospitalsArr)];

  res.render('help/index', {
    hospitals,
  });
});

router.post('/', async (req, res) => {
  const { hospital, condition, symptoms } = req.body;

  const driversWithinRange = await Driver.find({
    'hospitals.name': {
      $regex: hospital,
      $options: 'i',
    },
  });

  if (driversWithinRange.length < 1 && condition === 'normal') {
    res.render('help/index', {
      error: 'Sorry, no drivers found in that area.',
    });
    return;
  }

  if (driversWithinRange.length < 1) {
    res.render('help/index', {
      error:
        'Sorry, no drivers found in that area. The ambulance should be arriving soon',
    });
  }

  const help = await Help.create({
    emergencyType: condition,
    user: req.user.id,
    informedUsers: driversWithinRange.map(driver => ({
      driver: driver._id,
    })),
    hospital,
    symptoms,
  });

  console.log(help);

  driversWithinRange.forEach(driver => {
    sendAlertEmail({
      email: driver.email,
      name: req.user.displayName,
      hospital,
      id: help.id,
    });
  });

  res.redirect(`/help/${help.id}`);
});

router.get('/:id', async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.render('404');
  }

  const help = await Help.findById(req.params.id).populate([
    {
      path: 'user',
    },
    {
      path: 'informedUsers.driver',
    },
    {
      path: 'readyToHelp',
    },
  ]);

  if (!help) {
    return res.render('404');
  }

  if (help.user.id != req.user.id) {
    return res.render('404');
  }

  const informedUsers = help.informedUsers.map(user => user.driver.displayName);

  if (req.headers['content-type'] === 'application/json') {
    return res.send({ help });
  }

  res.render('help/id', {
    help,
    informedUsers,
  });
});

router.get('/:id/do', async (req, res) => {
  const help = await Help.findById(req.params.id).populate([
    {
      path: 'informedUsers.driver',
    },
    {
      path: 'readyToHelp',
    },
  ]);

  if (!help) {
    return res.render('404');
  }
  const informedUsers = help.informedUsers.map(user => user.driver.displayName);

  if (
    !help.informedUsers.some(
      user => JSON.stringify(user.driver) === JSON.stringify(req.user)
    )
  ) {
    return res.render('404');
  }

  res.render('help/do', {
    help,
    informedUsers,
  });
});

router.post('/:id/do', async (req, res) => {
  const help = await Help.findById(req.params.id);

  if (!help) {
    return res.status(404).send({
      message: 'Page not found',
    });
  }

  if (!help.informedUsers.some(user => user.driver == req.user.id)) {
    return res.status(404).send({
      message: 'Page not found',
    });
  }

  help.readyToHelp = req.user._id;

  await help.save();
  res.send();
});

module.exports = router;
