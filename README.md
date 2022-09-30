# family-expenses
Family expenses app is full stack app where you can manage your family expenses, add new users and spend some money.
It is written in JS, using express.js as a backend service, Bootstrap styling, MongoDB database and Cypress framework for e2e tests.

https://family-expenses-nodejs-web-app.herokuapp.com

### Reqs:
* MongoDB
* nodeJS

### Setup process is very simple, you have to:
* `npm install` - install all packages
* `npm run start` - start web server

### Other commands:
* `npm run tests` - runs cypress tests

Also if you want to set up your own nodeJS server you're gonna add following fields into .env file:
* DB_CONNECTION
* SESSION_SECRET
* TOKEN_SECRET
* ADMIN_EMAIL
* ADMIN_PASSWORD
* TEST_EMAIL
* TEST_PASSWORD
