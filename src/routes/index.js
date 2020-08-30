const express = require('express');

const router = express.Router();

router.get('/', (req, res) => res.send('Home page'));

router.get('/login', (req, res) => res.render('index'));

router.get('/dashboard', (req, res) => res.render('dashboard'));

module.exports = router;
