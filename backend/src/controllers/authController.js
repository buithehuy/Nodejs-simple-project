const connection = require('../config/db');
const path = require('path');
const bcrypt = require('bcryptjs');

const register = async (req, res) => {
    try {
        console.log('Registering user...');
        const {username, password} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const [users] = await connection.execute('SELECT * FROM users WHERE username = ?', [username]);

        if (users.length > 0) {
            return res.status(409).json({ success: false, message: 'exist user' });
        }

        await connection.execute('INSERT INTO users (username, password) VALUE (?, ?)', [username, hashedPassword]);
        res.status(201).json({ success: true, message: 'sucess' });

    } catch (err) {
        console.error('Database error:', err);
        return res.status(500).json({ success: false, message: 'database err' });
    }
};

const login = async (req, res) => {
    const {username, password} = req.body;
    const [users] = await connection.execute('SELECT * FROM users WHERE username = ?', [username]);
    const user = users[0];

    if (!user) {
        return res.status(401).json({ success: false, message: 'username or password is incorrect' });
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return res.status(401).json({ success: false, message: 'username or password is incorrect' });
    }
    
    if (user.role === 'admin') {
        req.session.isAdmin = true;
    }

    req.session.loggedin = true;
    req.session.username = username;
    req.session.userId = user.id;
    
    res.redirect('/');
        
    
};

const get_register = (req, res) => {
    res.sendFile(path.join(__dirname, '../templates/register.html'));
 }

const get_login = function (req, res) {
    res.sendFile(path.join(__dirname, '../templates/login.html'));
}


module.exports = {
    register, login, get_register, get_login
};