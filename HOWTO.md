## Initial Server Setup

- create new folder
- run `npm init`; hit enter to accept all default values
- run `npm install --save express` to install express

- create an index.js file, with the following code to ensure all is working:

```javascript
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send({ hi: 'there' });
});

app.listen(5000);
```

- navigate to localhost:5000 to ensure everything is working

## Heroku Deployment

- Dynamic port binding for prod and dev - change app.listen to the following:

```javascript
const PORT = process.env.PORT || 5000; //Heroku compatibility
app.listen(PORT);
```

- Specify Node environment: in package.json, add the following after "main":

```javascript
  "engines": {
    "node": "10.15.3",
    "npm": "5.0.3"
  },
```

- adding start script for Heroku (in package.json):

```javascript
    "start": "node index.js"
```

- create .gitignore file and include 'node_modules'

## First time Heroku Deployment

- create Heroku online account
- make sure git is installed, and commit
- make sure Heroku CLI is installed (check with command 'Heroku -v', if not installed it is possible to do it via homebrew)
- In the console, run command 'heroku login' to login (if not already)
- in the project directory, run command 'heroku create'; this will create the URL for our project on Heroku, and the URL for our Heroku git repository
- Using the second URL, run command 'git remote add heroku <<HEROKU GIT REPOSITORY>>'; we are telling git that we are adding a remote repository, naming it 'heroku' and giving it the address (it is ok if you get the 'fatal already exists' message)
- run command 'git push heroku master' to send to Heroku
- run command 'heroku open' to open project in a new browser tab
- (OPTIONAL) run 'heroku logs' to check for any errors

## Google OAuth and Passport.js

- Passport.js helps automate the OAuth flow between our server and Google
- Passport library components:

  - Passport: general helpers for handling auth in Express apps
  - Passport Strategy: helpers for authenticating with one specific method

- run command `npm install --save passport passport-google-oauth20`
- import both into the Express project and then call it:

```javascript
passport.use(new GoogleStrategy());
```

- GoogleStrategy needs a client ID and a client secret, from the Google OAuth service.
- Navigate to 'console.developers.google.com'
- Create a new project; find APIs & Services > Credentials and configure an OAuth consent screen under that tab
- Under 'Credentials' tab, select 'Create credentials' > OAuth client ID
- Follow prompts - for authorized origin: `http://localhost:5000`, for redirect URI: `http://localhost:5000/auth/google/callback`
- Get client ID and secret

- Client ID is public token - we can show this. Secret is obviously as secret. Add to a keys file with module.exports statement, add this file to .gitignore.

- Google Strategy config: first argument to pass in is an object with the client ID and the client secret. In this configurations object, include a callbackURL (such as `/auth/google/callback`)

- create a route handler to begin auth flow on get request to (`/auth/google`). The path is the first argument, and the second is passport configuration, instructing it to use the google strategy, and with scope configuration:

```javascript
passport.authenticate('google', {
  scope: ['profile', 'email']
});
```

- set up route handler for callback route. Pass it an argument of passport.authenticate again, so that passport can continue the oauth process and make second request to Google. The response from that second request (which contains the accessToken) will set off the callback in the GoogleStrategy

```javascript
app.get('/auth/google/callback', passport.authenticate('google'));
```

- end of stage 1 of authentication

## NODEMON SETUP

- `npm install --save nodemon`
- in package.json, add to "scripts": `"dev": "nodemon index.js"`
- launch application with `npm run dev`; sever will now auto restart when saving file

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

### Mongoose for Survey Creation

- In server/models, create Survey model
- Create a subdocument model 'Recipient'. This will be required by and passed into the Survey model (the idea behind this is that there is a 4mb limit on collections in Mongo - a single Survey collection is unlikely to exceed this even with the subdocument Recipient model)
- establish relationship between survey and user (by convention, underscore is used to denote a relationship):

```javascript
_user: { type: Schema.Types.ObjectId, ref: 'User' }
```

- set up a surveyRoutes file, create post route for '/api/surveys', include the previously created 'requireLogin' middleware created for the billing router
- create and include 'requireCredits' middleware, to ensure user has sufficient credits to proceed
- in post route for '/api/surveys', a new survey is created with info passed from the client.

### SendGrid

- SendGrid will be the third party application used for handling the distribution of emails
- install SendGrid library using `npm install --save sendgrid`
- sign up for SendGrid, add key to dev/prod, and to Heroku cvars
- create a new file, 'Mailer.js' in services
- this will define a new class, Mailer, that extends and adds onto the helper.Mail class from SendGrid (it is rather configuration dense as needed per SendGrid documentation)
- a surveyTemplate route is set up, and an instance of Mailer is created passing in a new Survey instance and a surveyTemplate. The mailer is what is sent to SendGrid.
- in surveyRoutes, set up a new route for thanking users after they click for feedback. This will utilize a redirectDomain key (based on dev or prod) set up in the surveyTemplate file.

### Client side setup of surveys

- Create Dashboard component, add a button (from Materialize) that will link (react-router) to the SurveyNew component

### Redux Form

- install Redux Form in the client side of the application (as of writing, last known good release is installed using `npm install redux-form@8.1.0`)

- Redux Form will automatically configure the Redux routing (action creators, reducers, etc) that would have been needed to pass form data over to other components

- After installing Redux Form, add the reducer to 'combineReducers', by importing it and setting it to the key 'form'

- All survey related components are stored in `components/survey`. SurveyNew will toggle between SurveyForm and SurveyFormReview.

- Within SurveyForm, wire up redux-form by importing `{ reduxForm }` from the library and adding it to the export statement with a configuration object.

- also import 'Field' component from redux-form. The Field can be used to render any different type of HTML element that will collect input from a user.

- Field components can be configured with type (i.e. text), name (anything, how it will be referenced), and component ("input" is acceptable, but you can also pass in React component as well)

- Our surveyForm will use the 'Field' component to render SurveyField components. The changing properties of our fields will be drawn from a config array (const FIELDS) set at the top of the file.

### Validation with Redux Form

- Create a validate function within SurveyForm, outside of the class, that reduxForm will refer to. The purpose of the function is to return an errors object; if empty, all is good to go; if it has values, those values are returned to the corresponding Field components as error messages.

### Reviewing the Survey

- Create new component 'SurveyFormReview' where user will be able to review their form before the final submission. Whether or not this component is shown is determined by a state-level boolean in the parent component (SurveyNew).

- The config array (FIELDS) from SurveyForm should be refactored into its own config file that both can reference with rendering their respective lists of JSX.

- Redux Form option `destroyOnUnmount: false` will keep the form data from being disposed when the component change (SurveyForm). This allows us to switch to and from SurveyFormReview component to make changes. However, the parent component that contains both (SurveyNew) is also wired to Redux Form (and this specific form 'surveyForm'), so when navigating away from that component, the data will be dumped, as desired.

- Redux mapStateToProps will bring in the formValues needed to populate this component. The submit button here will ultimately send off our formValues object to the action creator, where our data will be posted to the server.

- In terms of client routing, once the data is submitted, the client should be routed back to the list of surveys. React Router's 'withRouter' function is used for this. It is configured in the export statement, which will add a history object to the props. This is passed to the action creator - following the conclusion of the post request, the client will be routed back to '/surveys' with the line `history.push('/surveys')`

## Webhooks

- We will need to get information from SendGrid whenever a recipient clicks on one of the links inside of our email.

### Webhooks in Development

- In production, receiving post requests form SendGrid will be simple, but not so much in development, where we are operating on localhost:5000. To work around this, we'll take advantage of a service called LocalTunnel, which will receive the post requests on their server, pass it to a local server we will install, which will then pass it to our localhost app server.

- Install localtunnel: `npm install --save localtunnel`

- A script to launch the server is set up in scripts `"webhook": "lt -p 5000 -s roewvnienssxk"`, and added to the dev script to be run with the other servers concurrently. A random string is used as the custom domain name.

- SENDGRID: Login, go to settings > mail settings > event notification; under 'HTTP POST URL' enter the localtunnel url (found in console after server is launched). BE SURE TO INCLUDE the route where webhooks should be received (in our case: `/api/surveys/webhooks`). The url will have to be updated later when in production.

### Defensive Code (pre-processing)

- The post requests from SendGrid will contain objects for all click events. To help us, we are going to install two libraries: `npm install --save lodash path-parser`

- The post route '/api/surveys/webhooks' contains logic for singling out only click events in which the URL corresponds to one of the answers (yes/no), filtering out undefined events, and duplicate events. Lodash chain helper used to refactor this code.

### Proper querying of database

- Ideally we want to minimize the amount of records being transferred between the Express server and DB. We want to execute as much search logic within MONGO before pulling data over. For example, you would want to avoid fetching the entire survey from the DB as that instance would come with the entire subdocument collection of recipients (lots of data).

- Add Mongo query to the end of the webhook route handler. It is asynchronous, but we do not need to respond to SendGrid (beyond the blank response), so it is not necessary to wait on the response from the server.

- Mongoose querying testing tips: GOOD INFORMATION! `https://www.udemy.com/node-with-react-fullstack-web-development/learn/lecture/7607756#overview`
