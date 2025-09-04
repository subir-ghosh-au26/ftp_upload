// backend/controllers/adminController.js
const ftp = require('basic-ftp');
const users = require('../models/User');
const { uploadedFilesLog } = require('../database/store');
const { PassThrough } = require('stream'); // For robust downloads
const path = require('path');


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

exports.getFtpFiles = async (req, res) => {
    const client = new ftp.Client();
    try {
        await client.access({
            host: process.env.FTP_HOST,
            user: process.env.FTP_USER,
            password: process.env.FTP_PASSWORD,
            secure: true,
            secureOptions: { rejectUnauthorized: false },
        });

        // The .list() method is recursive by default for the root directory
        const fileList = await client.list('/files');

        // Filter out directories and map to a clean format for the frontend
        const filesOnly = fileList
            .filter(item => item.type === '-') // The '-' type indicates a file
            .map(file => ({
                // We use Buffer to create a URL-safe Base64 path for the ID
                id: Buffer.from(file.path).toString('base64'),
                name: file.name,
                path: file.path,
                size: file.size,
                modifiedAt: file.modifiedAt,
            }));

        res.json(filesOnly);
    } catch (err) {
        console.error('FTP List Error:', err);
        res.status(500).json({ msg: 'Failed to list files from FTP server', error: err.message });
    } finally {
        if (!client.closed) {
            client.close();
        }
    }
};


/**
 * Downloads a specific file from the FTP server using its full path.
 */
exports.downloadFtpFile = async (req, res) => {
    // We get the path from a query parameter, decoded from Base64 for safety
    const encodedPath = req.query.path;
    if (!encodedPath) {
        return res.status(400).json({ msg: 'File path is required.' });
    }
    const filePath = Buffer.from(encodedPath, 'base64').toString('utf8');

    // --- Basic Security Check ---
    // Prevent directory traversal attacks (e.g., ../../etc/passwd)
    if (filePath.includes('..')) {
        return res.status(400).json({ msg: 'Invalid file path.' });
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

        // Extract the filename from the path for the download dialog
        const filename = path.basename(filePath);
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Type', 'application/octet-stream');

        const downloadStream = new PassThrough();
        downloadStream.pipe(res);
        await client.downloadTo(downloadStream, filePath);

    } catch (err) {
        console.error('FTP Direct Download Error:', err);
        if (!res.headersSent) {
            res.status(500).json({ msg: 'Failed to download file', error: err.message });
        }
    } finally {
        if (!client.closed) {
            client.close();
        }
    }
};
