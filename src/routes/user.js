const express = require('express');
const User = require('../models/User');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_API_KEY);

//todo Remove from prod
router.get('/', async (req, res) => {
  const users = await User.find({});

  res.send(users);
});

router.get('/data', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'inr',
          product_data: {
            //todo Change name
            name: 'Company',
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
    cancel_url: `${process.env.MAIN_URL}/users/data`,
  });

  res.render('data-form', {
    session_id: session.id,
  });
});

// router.post('/data', async (req, res) => {
//   const { name, hospitals, availableTime = null } = req.body;
//   const user = req.user;

//   user.displayName = name;
//   user.hospitals = hospitals;
//   if (user.availableTime) {
//     user.availableTime = availableTime;
//   }

//   await user.save();

//   res.send({
//     message: 'User data added',
//   });
// });

module.exports = router;
