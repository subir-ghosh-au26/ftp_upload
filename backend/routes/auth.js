// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// @route   POST api/auth/login
// @desc    Authenticate user & get token
router.post('/login', authController.login);

// @route   GET api/auth/me
// @desc    Get current logged in user data
// @access  Private
router.get('/me', authMiddleware, authController.getMe);

module.exports = router;