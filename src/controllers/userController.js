const connection = require('../config/db');

const profile = (req, res) => {
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
                <form action="/user/logout" method="get">
                    <button type="submit">Logout</button>
                </form>
                <form action="/user/change-password" method="get">
                    <button type="submit">Change Password</button>
                </form>
            `);
        }
    );
};

const change_password = (req, res) => {
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
};

const click_change_password = (req, res) => {
    res.send(`
        <h1>Change Password</h1>
        <form action="/auth/change-password" method="post">
            <input type="password" name="password" placeholder="password" required><br>
            <button type="submit">Change Password</button>
        </form>
    `);
}

const logout = (req, res) => {
    req.session.destroy();
    res.redirect('/');
}


    module.exports = {
        profile, change_password, click_change_password, logout
    };