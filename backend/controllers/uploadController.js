const multer = require('multer');
const path = require('path');
const fs = require('fs');
const ftp = require('basic-ftp');
const authMiddleware = require('../middleware/authMiddleware');
const users = require('../models/User');
const { uploadedFilesLog } = require('../database/store');

// Multer storage configuration for temporary local storage on the Node.js server
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage: storage });

exports.uploadFile = [authMiddleware, upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ msg: 'No file uploaded' });
    }

    const client = new ftp.Client();
    // client.ftp.verbose = true; // Uncomment for extremely detailed FTP logs for debugging

    try {
        // Connect to the FTP server using secure FTPS
        await client.access({
            host: process.env.FTP_HOST,
            user: process.env.FTP_USER,
            password: process.env.FTP_PASSWORD,
            secure: true,
            secureOptions: {
                rejectUnauthorized: false // Required for self-signed certificates (like on Ubuntu)
            }
        });

        console.log('Connected to FTP server securely.');

        const currentDate = new Date().toISOString().slice(0, 10); // Format: YYYY-MM-DD

        // --- START: NEW UPLOAD PATH LOGIC for vsftpd chroot jail ---

        // The base directory INSIDE the user's jail where files will be uploaded.
        // This corresponds to the `/var/ftp/webapp_uploads/files` folder on the server.
        const remoteBaseDir = '/files';
        const remoteDailyDir = `${remoteBaseDir}/${currentDate}`;

        // The `ensureDir` command will handle creating the necessary directories.
        // `basic-ftp` is smart enough to create parent directories if needed.
        await client.ensureDir(remoteDailyDir);

        console.log(`Ensured remote directory exists: ${remoteDailyDir}`);

        const localFilePath = req.file.path;
        const remoteFileName = req.file.filename;
        // The final, full path for the file on the FTP server
        const remoteFilePath = `${remoteDailyDir}/${remoteFileName}`;

        // --- END: NEW UPLOAD PATH LOGIC ---


        // Upload the file from the local temporary path to the final remote path
        await client.uploadFrom(localFilePath, remoteFilePath);
        console.log(`File uploaded successfully to: ${remoteFilePath}`);

        // Log the successful upload for the user to see in their dashboard
        const user = users.find(u => u.id === req.user.id);
        uploadedFilesLog.push({
            fileId: `file_${Date.now()}`,
            userId: req.user.id,
            username: user.username,
            userName: user.name,
            filename: req.file.originalname,
            ftpPath: remoteFilePath,
            uploadDate: new Date().toISOString(),
            size: req.file.size
        });

        res.json({ msg: 'File uploaded successfully!', filename: req.file.originalname, remotePath: remoteFilePath });

    } catch (err) {
        console.error('FTP Upload Error:', err);
        res.status(500).json({ msg: 'FTP upload failed', error: err.message });
    } finally {
        // This block ensures cleanup happens whether the upload succeeds or fails

        // Close the FTP connection if it's open
        if (!client.closed) {
            client.close();
        }
        // Delete the temporary file from the Node.js server's local 'uploads' folder
        fs.unlink(req.file.path, (unlinkErr) => {
            if (unlinkErr) console.error('Error deleting local temp file:', unlinkErr);
            else console.log('Local temp file deleted:', req.file.path);
        });
    }
}];

exports.getUploadedFiles = [authMiddleware, (req, res) => {
    // Filter files to only show those uploaded by the currently logged-in user
    const userFiles = uploadedFilesLog.filter(file => file.userId === req.user.id);
    // Sort files with the newest ones first
    const sortedFiles = userFiles.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
    res.json(sortedFiles);
}];