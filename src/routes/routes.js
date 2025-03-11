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
    if (req.session.loggedin) {
        res.send(`
            <h1>Welcome ${req.session.username}</h1>
            <form action="/logout" method="get">
                <button type="submit">Logout</button>
            </form>
            <form action="/profile" method="get">
                <button type="submit">Profile</button>
            </form>
        `);
    }else{
        return res.redirect('/login');
    }
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