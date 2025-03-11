
const express = require('express');
const { register, login, get_register, get_login } = require('./controllers/authController');
const { profile, change_password, get_change_password, logout } = require('./controllers/userController');

const connection = require('./config/db');

const bodyParser = require('body-parser');
const session = require('express-session');

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


const requireLogin = (req, res, next) => {
    if (!req.session.loggedin) {
      return res.status(401).json({ success: false, message: 'login first' });
    }
    next();
};


app.get('/', function (req, res) {
  res.send(`
  <h1>Hello</h1>
  <form action="/register" method="get">
    <button type="submit">Register</button>
  </form>
  
  <form action="/login" method="get">
    <button type="submit">Login</button>
  </form>
`);
})


app.get('/register', get_register);
app.get('/login', get_login);


app.post('/register', register);
app.post('/login', login);

app.get('/profile', requireLogin, profile);

app.get('/change-password', requireLogin, get_change_password);
app.post('/change-password', requireLogin, change_password);

app.get('/logout', requireLogin, logout);


module.exports = app;