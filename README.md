# SurveyShark

SurveyShark is a simple survey creation app that allows a user to create and send surveys via email. It uses a React frontend, a Node/Express backend, and MongoDB.

A production version can be viewed HERE: https://secure-headland-47036.herokuapp.com/

- credits can be added to account using test card '4242 4242 4242 4242'

The app was created following the Udemy course 'Node with React: Fullstack Web Development' by Stephen Grider.

App basics:

- User can log in via Google OAuth
- User can add credits to account via Stripe, which allows the creation of new surveys
- User can see a list of their surveys
- User can create a new survey with a title, subject, body and recipient list
- Survey is a simple yes/no question, displayed as URL for recipient to click on
- Survey yes/no tally is displayed; SendGrid webhook system utilized to collect data

Dependencies used:

- Backend: express, stripe, sendgrid, mongoose, cookie-session, passport, passport-google-oauth20, body-parser, concurrently, localtunnel, lodash, nodemon, path-parser

- Frontend: redux, react-redux, redux-thunk, redux-form, react-router-dom, axios, react-stripe-checkout, materialize-css
