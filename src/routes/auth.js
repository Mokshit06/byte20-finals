const express = require('express');
const router = express.Router();
const passport = require('passport');
const { ensureAuthenticated, ensureGuest } = require('../../middleware/auth');

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/',
  }),
  (req, res) => {
    if (
      req.user.hospitals.length > 0 &&
      req.user.availableTime.from &&
      req.user.availableTime.to
    ) {
      res.redirect('/dashboard');
    }
    res.redirect('/users/data');
  }
);

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
