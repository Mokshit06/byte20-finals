const express = require('express');
const router = express.Router();

router.get('/overview', (req, res) => res.render('account/overview'));

router.get('/profile', (req, res) => res.render('account/profile'));

router.get('/notification', (req, res) => res.render('account/notification'));

module.exports = router;
