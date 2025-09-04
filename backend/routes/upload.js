const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');

router.post('/', uploadController.uploadFile);
router.get('/', uploadController.getUploadedFiles);

module.exports = router;