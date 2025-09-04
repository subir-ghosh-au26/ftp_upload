import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import FileUpload from './FileUpload';
import UploadedFiles from './UploadedFiles';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
    const { user, logout } = useAuth(); // Get user from context
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                {/* Welcome message using the user's name */}
                <h2>Welcome, {user ? user.username : 'User'}!</h2>
                <button onClick={handleLogout} className="btn btn-danger">
                    Logout
                </button>
            </div>

            <FileUpload onUploadSuccess={handleUploadSuccess} />
            <hr className="separator" />
            <UploadedFiles refreshTrigger={refreshFiles} />
        </div>
    );
}

export default Dashboard;