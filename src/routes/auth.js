const express = require('express');
const router = express.Router();
const passport = require('passport');
const { ensureAuth, ensureGuest } = require('../middleware/auth.js');

router.get(
  '/google/user',
  ensureGuest,
  passport.authenticate('user', {
    scope: ['profile', 'email'],
  })
);

router.get(
  '/google/driver',
  ensureGuest,
  passport.authenticate('driver', {
    scope: ['profile', 'email'],
  })
);

router.get(
  '/google/user/callback',
  ensureGuest,
  passport.authenticate('user', {
    failureRedirect: '/',
  }),
  (req, res) => {
    res.redirect('/account/profile');
  }
);

router.get(
  '/google/driver/callback',
  ensureGuest,
  passport.authenticate('driver', {
    failureRedirect: '/',
  }),
  (req, res) => {
    res.redirect('/account/profile');
  }
);

router.get('/logout', ensureAuth, (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
