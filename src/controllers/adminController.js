const connection = require('../config/db');

const get_all_users = async (req, res) => {
    try {
        const [users] = await connection.execute('SELECT * FROM users');
        res.send(users.slice(0, 12))
    } catch (err) {
        console.error('Database error:', err);
        return res.status(500).json({ success: false, message: 'database err' });
    }
}

module.exports = { get_all_users };