
const express = require('express');

const connection = require('./config/db');

const bodyParser = require('body-parser');
const session = require('express-session');

const routes = require('./routes/routes');

const app = express();
const port = 8081;



app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 1 * 1000 }
  }));


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', routes);



module.exports = app;