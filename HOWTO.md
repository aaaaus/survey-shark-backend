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

### Backend to Frontend Routing in Production

- in production, the create-react-app server won't be sitting in front of the express server (such as in dev); requests previously going to localhost:3000 in dev environment will now be going to express directly (with exception to requests that were proxied over to localhost:5000)
- When we're ready to go to production, we run `npm-run-build` on the client side to create a production build with all needed assets
- Express must identify three types of routes - routes it has route handlers for, routes that are defined by react router on the front end, and routes trying to access very specific development assets (frontend main.js file for example)
- set up a route hander in server/index.js to handle conditionally:

```javascript
if (process.env.NODE_ENV === 'production') {
  //Express will serve up assets like main.js or main.css files
  app.use(express.static('client/build'));
  //Express will serve up index.html if it doesn't recognize route (catch all route handler)
  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}
```

- Issue: within client, we are not tracking or committing 'client/build' files to git
- Solution: once we push to Heroku, we will have Heroku create the final build
- Once project is pushed to Heroku, it will install server dependencies and run 'Heroku-postbuild'; here we can tell it to install client dependencies and run 'npm run build'

- Add to scripts within sever's package.json file: `"heroku-postbuild": "NPM_CONFIG_PRODUCTION=false npm install --prefix client && npm run build --prefix client"`

- NOTE TO SELF - when pushing to heroku master, the build was failing; updating node in 'package.json' to latest version (10.15.3 at time of writing) fixed issue (Heroku will download that version to build app)
