const express = require('express');
const router = express.Router();
const { ensureGuest } = require('../middleware/auth');

router.get('/', (req, res) => res.render('index'));

router.get('/login', ensureGuest, (req, res) => res.render('login'));

module.exports = router;
