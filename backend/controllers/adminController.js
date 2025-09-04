// backend/controllers/adminController.js
const ftp = require('basic-ftp');
const users = require('../models/User');
const { uploadedFilesLog } = require('../database/store'); // Using our central store

// GET STATS (No change needed here)
exports.getStats = (req, res) => {
    const totalUploads = uploadedFilesLog.length;
    const totalUsers = users.length;
    const totalSize = uploadedFilesLog.reduce((acc, file) => acc + file.size, 0);
    const uploadsPerUser = uploadedFilesLog.reduce((acc, file) => {
        acc[file.userName] = (acc[file.userName] || 0) + 1;
        return acc;
    }, {});
    res.json({ totalUploads, totalUsers, totalSize, uploadsPerUser });
};

// --- START: PAGINATION CHANGE ---
exports.getAllFiles = (req, res) => {
    // Get query parameters for pagination, with defaults
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10; // e.g., 10 files per page
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    // Sort all files with newest first
    const sortedFiles = [...uploadedFilesLog].sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));

    // Get the slice of files for the current page
    const paginatedFiles = sortedFiles.slice(startIndex, endIndex);

    // Send back the paginated data along with total count for UI
    res.json({
        totalFiles: sortedFiles.length,
        totalPages: Math.ceil(sortedFiles.length / limit),
        currentPage: page,
        files: paginatedFiles,
    });
};
// --- END: PAGINATION CHANGE ---


// --- START: DOWNLOAD FIX ---
exports.downloadFile = async (req, res) => {
    const { fileId } = req.params;
    const fileToDownload = uploadedFilesLog.find(f => f.fileId === fileId);

    if (!fileToDownload) {
        return res.status(404).json({ msg: 'File not found' });
    }

    const client = new ftp.Client();
    try {
        await client.access({
            host: process.env.FTP_HOST,
            user: process.env.FTP_USER,
            password: process.env.FTP_PASSWORD,
            secure: true,
            secureOptions: { rejectUnauthorized: false },
        });

        // Set headers to prompt a download dialog in the browser
        res.setHeader('Content-Disposition', `attachment; filename="${fileToDownload.filename}"`);
        res.setHeader('Content-Type', 'application/octet-stream');

        // This is a more robust method. We create a temporary writable stream (pass-through),
        // pipe the FTP download to it, and then pipe that stream to the HTTP response.
        const { PassThrough } = require('stream');
        const downloadStream = new PassThrough();

        // When the download stream gets data, pipe it to the response
        downloadStream.pipe(res);

        // Start the download from FTP server into our pass-through stream
        await client.downloadTo(downloadStream, fileToDownload.ftpPath);

        // The download is complete once this promise resolves.
        // The streams will handle closing correctly.
        console.log(`Successfully streamed download for ${fileToDownload.filename}`);

    } catch (err) {
        console.error('FTP Download Error:', err);
        // Important: check if headers were already sent before sending error response
        if (!res.headersSent) {
            res.status(500).json({ msg: 'Failed to download file', error: err.message });
        }
    } finally {
        if (!client.closed) {
            client.close();
        }
    }
};
// --- END: DOWNLOAD FIX ---