import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function FileUpload({ onUploadSuccess }) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [message, setMessage] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const { token } = useAuth();
    const fileInputRef = useRef(null); // Ref to clear the input

    const handleFileChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setSelectedFile(event.target.files[0]);
            setMessage('');
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setMessage({ type: 'error', text: 'Please select a file first!' });
            return;
        }
        const formData = new FormData();
        formData.append('file', selectedFile);
        setIsUploading(true);
        setMessage('');

        try {
            const res = await axios.post('/api/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data', 'x-auth-token': token },
            });
            setMessage({ type: 'success', text: `Success: "${res.data.filename}" uploaded!` });
            setSelectedFile(null);
            fileInputRef.current.value = null; // Clear the file input
            if (onUploadSuccess) {
                onUploadSuccess();
            }
        } catch (err) {
            setMessage({ type: 'error', text: `Upload failed: ${err.response?.data?.msg || err.message}` });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div>
            <div className="file-upload-section">
                <input
                    type="file"
                    id="file-upload-input"
                    className="file-upload-input"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    disabled={isUploading}
                />
                <label htmlFor="file-upload-input" className="file-upload-label">
                    {selectedFile ? selectedFile.name : 'Click to choose a file...'}
                </label>
                <button
                    onClick={handleUpload}
                    className="upload-button"
                    disabled={!selectedFile || isUploading}
                >
                    {isUploading ? 'Uploading...' : 'Upload'}
                </button>
            </div>
            {message.text && (
                <div className={`upload-message ${message.type}`}>
                    {message.text}
                </div>
            )}
        </div>
    );
}

export default FileUpload;