import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function FileUpload({ onUploadSuccess }) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [message, setMessage] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const { token } = useAuth();

    const handleFileChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setSelectedFile(event.target.files[0]);
            setMessage('');
        } else {
            setSelectedFile(null);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setMessage({ type: 'danger', text: 'Please select a file first!' });
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);

        setIsUploading(true);
        setMessage({ type: 'info', text: 'Uploading file...' });

        try {
            const res = await axios.post('http://localhost:5000/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'x-auth-token': token,
                },
            });
            setMessage({ type: 'success', text: `File "${res.data.filename}" uploaded successfully!` });
            setSelectedFile(null); // Clear selected file
            document.getElementById('file-input').value = ''; // Clear file input visual
            if (onUploadSuccess) {
                onUploadSuccess();
            }
        } catch (err) {
            console.error('File upload failed:', err.response ? err.response.data : err.message);
            setMessage({ type: 'danger', text: `Upload failed: ${err.response?.data?.msg || err.message}` });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="file-upload-section">
            <h3>Upload New File</h3>
            <div className="form-group flex-group">
                <input
                    type="file"
                    id="file-input"
                    onChange={handleFileChange}
                    disabled={isUploading}
                    aria-label="Choose file to upload"
                />
                <button
                    onClick={handleUpload}
                    className="btn"
                    disabled={!selectedFile || isUploading}
                >
                    {isUploading ? (
                        <>Uploading... <span className="loading-spinner"></span></>
                    ) : (
                        'Upload'
                    )}
                </button>
            </div>
            {message.text && (
                <div className={`alert alert-${message.type}`}>
                    {message.text}
                </div>
            )}
            {selectedFile && !isUploading && (
                <p>Selected: <strong>{selectedFile.name}</strong> ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)</p>
            )}
        </div>
    );
}

export default FileUpload;