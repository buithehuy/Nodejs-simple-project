const connection = require('../config/db');

const register = (req, res) => {
    const {username, password} = req.body;
    if(!username||!password) {
        return res.status(400).json({ success: false, message: 'fill full form' });
    }

    connection.query('SELECT * FROM users WHERE username = ?', [username], (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'database err' });
        }

        if (result.length > 0) {
            return res.status(409).json({ success: false, message: 'exist user' });
        }

        connection.query('INSERT INTO users (username, password) VALUE (?, ?)', [username, password], (err, result) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'database err' });
            }
            return res.status(201).json({ success: true, message: 'sucess' });
        })
    })
};

const login = (req, res) => {
    const {username, password} = req.body;
    if(!username || !password) {
        return res.status(400).json({success: false, message: 'fill full form'});
    }

    connection.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'database err' });
        }

        if (result.length === 0) {
            return res.status(401).json({ success: false, message: 'username or password is incorrect' });
        }

        req.session.loggedin = true;
        req.session.username = username;
        req.session.userId = result[0].id;
        
        res.redirect('/profile');
        
    });
};


module.exports = {
    register, login
};