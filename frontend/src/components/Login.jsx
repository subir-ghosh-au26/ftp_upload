// frontend-vite/src/components/Login.jsx

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Login.css'; // Import our new stylesheet
import { AtSignIcon, LockIcon } from '@chakra-ui/icons'; // Using icons from Chakra

function Login() {
    const [username, setUsername] = useState(''); // We need state again for a custom form
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission
        setError('');
        setIsLoading(true);
        const result = await login(username, password);
        setIsLoading(false);

        if (!result.success) {
            setError(result.error || 'Login failed. Please check your credentials.');
        }
        // On success, App.jsx handles the redirect
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h1>BIPARD</h1>
                <p>Enter your credentials to access your secure hub.</p>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <AtSignIcon className="input-icon" />
                        <input
                            type="text"
                            className="login-input"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <LockIcon className="input-icon" />
                        <input
                            type="password"
                            className="login-input"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="login-button" disabled={isLoading}>
                        {isLoading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}
                <p style={{ fontSize: '0.8rem', marginTop: '20px', opacity: 0.6 }}>
                    Developmed by <strong>Subir Ghosh</strong>
                </p>
            </div>
        </div>
    );
}

export default Login;