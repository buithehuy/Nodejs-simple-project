const connection = require('../config/db');
const bcrypt = require('bcrypt');

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

    req.session.loggedin = true;
    req.session.username = username;
    req.session.userId = user.id;
    
    res.redirect('/');
        
    
};

const get_register = (req, res) => {
    res.send(`
    <h1>Register</h1>
    <form action="/auth/register" method="post">
      <input type="text" name="username" placeholder="username" required><br>
      <input type="password" name="password" placeholder="password" required><br>
      <button type="submit">Register</button>
    </form>
    <form>
    <h2>Already have an account?</h2>
    <a href="/user/login">Login</a>
    </form>

  `);
 }

const get_login = function (req, res) {
    res.send(`
    <h1>Login</h1>
    <form action="/auth/login" method="post">
      <input type="text" name="username" placeholder="username" required><br>
      <input type="password" name="password" placeholder="password" required><br>
      <button type="submit">Login</button>
    </form>
    <form>
    <h2>Don't have an account?</h2>
    <a href="/user/register">Register</a>
    </form>
  `);
 }


module.exports = {
    register, login, get_register, get_login
};