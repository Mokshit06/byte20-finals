const express = require('express');
const { ensureDataEntered } = require('../middleware/auth');
const router = express.Router();

router.get('/', (req, res) => res.redirect('/account/overview'));

router.get('/overview', ensureDataEntered, (req, res) =>
  res.render('account/overview')
);

router.get('/profile', (req, res) => res.render('account/profile'));

router.post('/profile', async (req, res) => {
  const { name, hospitals, availableTime, address } = req.body;

  req.user.displayName = name;
  req.user.hospitals = hospitals;
  if (req.user.availableTime) {
    req.user.availableTime = availableTime;
  } else {
    req.user.address = address;
  }

  await req.user.save();
  res.end();
});

router.delete('/overview', async (req, res) => {
  await req.user.remove();
});

module.exports = router;
