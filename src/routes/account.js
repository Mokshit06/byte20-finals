const express = require('express');
const { ensureDataEntered } = require('../middleware/auth');
const stripe = require('stripe')(process.env.STRIPE_API_KEY);
const router = express.Router();

router.get('/', (req, res) => res.redirect('/account/overview'));

router.get('/overview', ensureDataEntered, (req, res) =>
  res.render('account/overview')
);

router.get('/profile', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'inr',
          product_data: {
            //todo Change name
            name: 'MedPool',
            //todo Add Image
            // images: [metro.image],
          },
          unit_amount: `${req.user.price || 400}00`,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${process.env.MAIN_URL}/account/overview`,
    cancel_url: `${process.env.MAIN_URL}/account/profile`,
  });
  res.render('account/profile', {
    session_id: session.id,
  });
});

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

router.delete('/overview', ensureDataEntered, async (req, res) => {
  await req.user.remove();
});

module.exports = router;
