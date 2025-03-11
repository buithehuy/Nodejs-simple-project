const express = require('express');

const { register, login, get_register, get_login } = require('../controllers/authController');
const { profile, change_password, click_change_password, logout } = require('../controllers/userController');

const routes = express.Router();

const requireLogin = (req, res, next) => {
    if (!req.session.loggedin) {
      return res.status(401).json({ success: false, message: 'login first' });
    }
    next();
};


routes.get('/', function (req, res) {
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


routes.get('/register', get_register);
routes.get('/login', get_login);


routes.post('/register', register);
routes.post('/login', login);

routes.get('/profile', requireLogin, profile);

routes.get('/change-password', requireLogin, click_change_password);
routes.post('/change-password', requireLogin, change_password);

routes.get('/logout', requireLogin, logout);

module.exports = routes;