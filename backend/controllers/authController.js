const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const users = require('../models/User');

exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = users.find(u => u.username === username);
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }
        const payload = { user: { id: user.id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// NEW: Get the logged-in user's data
exports.getMe = async (req, res) => {
    try {
        const user = users.find(u => u.id === req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        // Return user data MINUS the password
        res.json({
            id: user.id,
            username: user.username,
            name: user.name,
            role: user.role,
        });
    } catch (err) {
        console.error('GetMe Error:', err.message);
        res.status(500).send('Server Error');
    }
};