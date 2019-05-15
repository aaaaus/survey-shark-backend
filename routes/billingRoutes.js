//https://stripe.com/docs/api

const keys = require('../config/keys');
const stripe = require('stripe')(keys.stripeSecretKey);
const requireLogin = require('../middlewares/requireLogin');

module.exports = app => {
  app.post('/api/stripe', requireLogin, async (req, res) => {
    //this will make a request to the stripe API to finalize transaction
    const charge = await stripe.charges.create({
      amount: 500,
      currency: 'usd',
      description: '$5 for 5 credits',
      source: req.body.id
    });

    //req.user is current user, provided by passport
    req.user.credits += 5;
    const user = await req.user.save();

    res.send(user);
  });
};
