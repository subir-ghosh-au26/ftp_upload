import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function UploadedFiles({ refreshTrigger }) {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { token } = useAuth();

    const fetchUploadedFiles = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await axios.get('http://localhost:5000/api/upload', {
                headers: {
                    'x-auth-token': token,
                },
            });
            // Sort files by upload date, newest first
            const sortedFiles = res.data.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
            setFiles(sortedFiles);
        } catch (err) {
            console.error('Failed to fetch uploaded files:', err.response ? err.response.data : err.message);
            setError('Failed to fetch uploaded files.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUploadedFiles();
    }, [token, refreshTrigger]); // Re-fetch when token changes or refreshTrigger updates

    if (loading) return <p className="text-center">Loading uploaded files... <span className="loading-spinner"></span></p>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div className="uploaded-files-section">
            <h3>Your Upload History</h3>
            {files.length === 0 ? (
                <p className="text-center">No files uploaded yet. Start by uploading one!</p>
            ) : (
                <ul className="file-list">
                    {files.map((file, index) => (
                        <li key={index}>
                            <strong>{file.filename}</strong>
                            <span>
                                Uploaded on {new Date(file.uploadDate).toLocaleString()} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default UploadedFiles;