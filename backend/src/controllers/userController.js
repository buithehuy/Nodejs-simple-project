const connection = require('../config/db');
const bcrypt = require('bcryptjs');

const profile = async (req, res) => {
    try {
        console.log('Fetching user profile...');
        const [results] = await connection.execute(
            'SELECT id, username, created_at FROM users WHERE id = ?',
            [req.session.userId]
        );

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'no user' });
        }

        const user = results[0];
        res.send(`
            <h1>Profile</h1>
            <p>id: ${user.id}</p>
            <p>username: ${user.username}</p>
            <p>created_at: ${user.created_at}</p>
            <form action="/user/change-password" method="get">
                <button type="submit">Change Password</button>
            </form>
        `);
    } catch (err) {
        console.error('Database error:', err);
        return res.status(500).json({ success: false, message: 'database err' });
    }
};

const change_password = async (req, res) => {
    const { password } = req.body;
    if (!password) {
        return res.status(400).json({ success: false, message: 'fill full form' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await connection.execute('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, req.session.userId]);
        res.status(200).json({ success: true, message: 'success' });
    } catch (err) {
        console.error('Database error:', err);
        return res.status(500).json({ success: false, message: 'database err' });
    }
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