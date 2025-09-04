import React from 'react';
import { Button, Spacer } from '@chakra-ui/react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Stats from './Stats';
import FilesTable from './FilesTable';
import FtpFileBrowser from './FtpFileBrowser';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="admin-dashboard-container">
            <div className="admin-dashboard-content">
                <header className="admin-header">
                    <div>
                        <h1>Admin Dashboard</h1>
                        <p>Welcome, {user ? user.name : 'Admin'}!</p>
                    </div>
                    <Spacer />
                    <Button
                        colorScheme="whiteAlpha"
                        variant="outline"
                        onClick={handleLogout}
                        _hover={{ bg: 'rgba(255, 255, 255, 0.1)' }}
                    >
                        Logout
                    </Button>
                </header>

                <Stats />
                <FtpFileBrowser />
                <FilesTable />
            </div>
        </div>
    );
};

export default AdminDashboard;