const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const adminController = require('../controllers/adminController');

// All routes here are protected by both auth and admin middleware
router.use(authMiddleware, adminMiddleware);

// @route   GET api/admin/ftp-files
// @desc    Get a live listing of all files on the FTP server
router.get('/ftp-files', adminController.getFtpFiles);

// @route   GET api/admin/download-ftp
// @desc    Download a file directly from FTP using its path
router.get('/download-ftp', adminController.downloadFtpFile);

// @route   GET api/admin/stats
// @desc    Get dashboard statistics
router.get('/stats', adminController.getStats);

// @route   GET api/admin/files
// @desc    Get all uploaded files by all users
router.get('/files', adminController.getAllFiles);

// @route   GET api/admin/download/:fileId
// @desc    Download a specific file
router.get('/download/:fileId', adminController.downloadFile);

module.exports = router;