
const express = require('express');
const bcrypt = require('bcrypt');

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


app.get('/register', function (req, res) {
    res.send(`
    <h1>Register</h1>
    <form action="/register" method="post">
      <input type="text" name="username" placeholder="username" required><br>
      <input type="password" name="password" placeholder="password" required><br>
      <button type="submit">Register</button>
    </form>
  `);
 }
)

app.get('/login', function (req, res) {
    res.send(`
    <h1>Login</h1>
    <form action="/login" method="post">
      <input type="text" name="username" placeholder="username" required><br>
      <input type="password" name="password" placeholder="password" required><br>
      <button type="submit">Login</button>
    </form>
  `);
 }
)

app.post('/register', (req, res) => {
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
});

app.post('/login', (req, res) => {
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
});

app.get('/profile', requireLogin, (req, res) => {
    connection.query(
      'SELECT id, username, created_at FROM users WHERE id = ?',
      [req.session.userId],
      (err, results) => {
        if (err) {
          return res.status(500).json({ success: false, message: 'database err' });
        }
        
        if (results.length === 0) {
          return res.status(404).json({ success: false, message: 'no user' });
        }
        
        res.send(`
          <h1>Profile</h1>
          <p>id: ${results[0].id}</p>
          <p>username: ${results[0].username}</p>
          <p>created_at: ${results[0].created_at}</p>
          <form action="/logout" method="get">
            <button type="submit">Logout</button>
          </form>
          <form action="/change-password" method="get">
            <button type="submit">Change Password</button>
          </form>
        `);
      }
    );
  });

app.get('/change-password', requireLogin, (req, res) => {
    res.send(`
    <h1>Change Password</h1>
    <form action="/change-password" method="post">
      <input type="password" name="password" placeholder="password" required><br>
      <button type="submit">Change Password</button>
    </form>
  `);
});

app.post('/change-password', requireLogin, (req, res) => {
    const {password} = req.body;
    if(!password) {
        return res.status(400).json({ success: false, message: 'fill full form' });
    }

    connection.query('UPDATE users SET password = ? WHERE id = ?', [password, req.session.userId], (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'database err' });
        }
        res.status(200).json({ success: true, message: 'success' });
    });
});


app.get('/logout', requireLogin, (req, res) => {
    req.session.destroy();
    res.redirect("/");
});


module.exports = app;