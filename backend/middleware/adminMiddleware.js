const users = require('../models/User');

module.exports = (req, res, next) => {
    try {
        // req.user is attached by the authMiddleware, which should run first
        const user = users.find(u => u.id === req.user.id);

        if (!user || user.role !== 'admin') {
            return res.status(403).json({ msg: 'Forbidden: Access is denied.' });
        }

        next();
    } catch (err) {
        res.status(500).json({ msg: 'Server error during admin verification.' });
    }
};