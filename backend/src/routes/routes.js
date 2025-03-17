const express = require('express');

const { register, login, get_register, get_login } = require('../controllers/authController');
const { profile, change_password, click_change_password, logout, callApiFlash } = require('../controllers/userController');
const { get_all_users } = require('../controllers/adminController');

const routes = express.Router();

const requireLogin = (req, res, next) => {
    if (!req.session.loggedin) {
      return res.status(401).json({ success: false, message: 'login first' });
    }
    next();
};




routes.get('/', function (req, res) {
    if (req.session.loggedin && !req.session.isAdmin) {
        res.send(`
            <h1>Welcome ${req.session.username}</h1>
            <form action="/user/profile" method="get">
                <button type="submit">Profile</button>
            </form>
            <form action="/user/call-api-flash" method="get">
                <button type="submit">Call API Flash</button>
            </form>
            <form action="/user/logout" method="get">
                <button type="submit">Logout</button>
            </form>
        `);
    }else if(req.session.loggedin && req.session.isAdmin){
        res.send(`
            <h1>Welcom Admin</h1>
            <form action ="/admin/get_all_users" method="get">
            <button type="submit">Get all users</button>
            </form>
            <form action="/user/logout" method="get">
                <button type="submit">Logout</button>
            </form>
            `)

    }else {
        res.redirect('/user/login');
    }
})

routes.get('/admin/get_all_users', requireLogin, get_all_users);

routes.get('/user/register', get_register);
routes.get('/user/login', get_login);


routes.post('/auth/register', register);
routes.post('/auth/login', login);

routes.get('/user/profile', requireLogin, profile);
routes.get('/user/call-api-flash', requireLogin, callApiFlash);

routes.get('/user/change-password', requireLogin, click_change_password);
routes.post('/auth/change-password', requireLogin, change_password);

routes.get('/user/logout', requireLogin, logout);

module.exports = routes;