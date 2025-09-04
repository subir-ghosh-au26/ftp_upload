// frontend-vite/src/components/UploadedFiles.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function UploadedFiles({ refreshTrigger }) {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();

    useEffect(() => {
        const fetchUploadedFiles = async () => {
            setLoading(true);
            try {
                const res = await axios.get('/api/upload', { headers: { 'x-auth-token': token } });
                setFiles(res.data);
            } catch (err) {
                console.error('Failed to fetch uploaded files:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchUploadedFiles();
    }, [token, refreshTrigger]);

    if (loading) return <p style={{ textAlign: 'center' }}>Loading files...</p>;

    return (
        <div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Your Upload History</h3>
            {files.length === 0 ? (
                <p style={{ textAlign: 'center', marginTop: '20px', opacity: 0.7 }}>
                    No files uploaded yet.
                </p>
            ) : (
                <ul className="uploaded-files-list">
                    {files.map((file, index) => (
                        <li key={index}>
                            <div className="file-info">
                                <strong>{file.filename}</strong>
                                <span className="file-meta">
                                    Uploaded on {new Date(file.uploadDate).toLocaleString()}
                                </span>
                            </div>
                            <div className="file-meta">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default UploadedFiles;