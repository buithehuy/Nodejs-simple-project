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
        
        res.redirect('/');
        
    });
};

const get_register = (req, res) => {
    res.send(`
    <h1>Register</h1>
    <form action="/register" method="post">
      <input type="text" name="username" placeholder="username" required><br>
      <input type="password" name="password" placeholder="password" required><br>
      <button type="submit">Register</button>
    </form>
    <form>
    <h2>Already have an account?</h2>
    <a href="/login">Login</a>
    </form>

  `);
 }

const get_login = function (req, res) {
    res.send(`
    <h1>Login</h1>
    <form action="/login" method="post">
      <input type="text" name="username" placeholder="username" required><br>
      <input type="password" name="password" placeholder="password" required><br>
      <button type="submit">Login</button>
    </form>
    <form>
    <h2>Don't have an account?</h2>
    <a href="/register">Register</a>
    </form>
  `);
 }


module.exports = {
    register, login, get_register, get_login
};