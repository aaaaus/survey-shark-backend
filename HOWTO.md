# one hash

## two hash

### three hash

- this
- is
- a
- list

`npm install --save test`
`git push origin master`
`more command line stuff`

```javascript
console.log('hello world');
```

## STRIPE

- create an account on stripe.com
- stripe will be in test mode, where it accepts test credit card numbers
- in lieu of using checkout.js, make use of library 'react-stripe-checkout'
- in client directory, install `npm install --save react-stripe-checkout`
- in `config/dev.js` add keys for `stripePublishableKey` and `stripeSecretKey`
- in `config/prod.js` add environment variables:

```javascript
module.exports = {
  stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  stripeSecretKey: process.env.STRIPE_SECRET_KEY
};
```

- navigate to Heroku dashboard > settings > config vars, and add keys

### Keys on client side

- create `client/.env.development` and `client/.env.production`

- add key to both as `REACT_APP_STRIPE_KEY=(KEY HERE)`

### configuring Stripe on client side

- create new component `Payments.js`
- Within this component, only return is `<StripeCheckout />` component.
- Three properties are needed: amount (in USD cents), token (callback for when token is received from Stripe), and stripeKey (from env variables)

- import Payment component into Header component and add to render, which will render a payment button in the Header

- test transaction can be completed by using card number `4242 4242 4242 4242` and a JS object 'token' will be returned

- Stripe Checkout element can be further modified with "name" and "description" properties, and can also be changed from self closing to enclosing a child element for control over styling

- 'handleToken' action creator is set up to take the Stripe response and send it to a yet to be set up route on the backend; it expects the response to be a user which will be dispatched as existing FETCH_USER type (for header to re-render)
- 'handleToken' must be wired to the Payments component to be used as the callback function in the "token" property of the StripeCheckout element

- On the backend, set up a route that listens to post requests on `api/stripe`

- install `npm install --save stripe` in server directory

- install `npm install --save body-parser` which will allow us to parse the req object being sent to the express backend (which contains the payment info). This middleware will put the parsed info into the 'req.body' property of the incoming request object

- with body-parser, id can be pulled from stripe response object within the request handler; finalize charge is sent to Stripe API.
- User model is updated to include a credits property
- request handler updates the user instance and saves user, sends updated user instance back to frontend
