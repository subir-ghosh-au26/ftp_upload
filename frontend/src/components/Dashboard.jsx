import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import FileUpload from './FileUpload';
import UploadedFiles from './UploadedFiles';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

function Dashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [refreshFiles, setRefreshFiles] = useState(0);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleUploadSuccess = () => {
        setRefreshFiles(prev => prev + 1);
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-content">
                <div className="dashboard-header">
                    <h2>Welcome, {user ? user.name : 'User'}</h2>
                    <button onClick={handleLogout} className="logout-button">
                        Logout
                    </button>
                </div>

                <div className="glass-card">
                    <FileUpload onUploadSuccess={handleUploadSuccess} />
                </div>

                <div className="glass-card">
                    <UploadedFiles refreshTrigger={refreshFiles} />
                </div>
            </div>
        </div>
    );
}

export default Dashboard;