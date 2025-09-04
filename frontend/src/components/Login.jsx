import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Hyperspeed from './Effect/Hyperspeed';
import './Login.css';
import { AtSignIcon, LockIcon } from '@chakra-ui/icons';
import ElectricBorder from './Effect/ElectricBorder';
import SplashCursor from './Effect/SplashCursor';

// --- Reusable Footer JSX ---
const AppFooter = () => (
    <footer className="app-footer">
        <p>
            © {new Date().getFullYear()} Secure File Hub. All Rights Reserved. | Developed by{' '}
            <a href="https://portfolio-1-five-eosin.vercel.app/" target="_blank" rel="noopener noreferrer">
                Subir Ghosh
            </a>
        </p>
    </footer>
);

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
            <SplashCursor />
            <Hyperspeed
                effectOptions={{
                    onSpeedUp: () => { },
                    onSlowDown: () => { },
                    distortion: 'turbulentDistortion',
                    length: 400,
                    roadWidth: 10,
                    islandWidth: 2,
                    lanesPerRoad: 4,
                    fov: 90,
                    fovSpeedUp: 150,
                    speedUp: 2,
                    carLightsFade: 0.4,
                    totalSideLightSticks: 20,
                    lightPairsPerRoadWay: 40,
                    shoulderLinesWidthPercentage: 0.05,
                    brokenLinesWidthPercentage: 0.1,
                    brokenLinesLengthPercentage: 0.5,
                    lightStickWidth: [0.12, 0.5],
                    lightStickHeight: [1.3, 1.7],
                    movingAwaySpeed: [60, 80],
                    movingCloserSpeed: [-120, -160],
                    carLightsLength: [400 * 0.03, 400 * 0.2],
                    carLightsRadius: [0.05, 0.14],
                    carWidthPercentage: [0.3, 0.5],
                    carShiftX: [-0.8, 0.8],
                    carFloorSeparation: [0, 5],
                    colors: {
                        roadColor: 0x080808,
                        islandColor: 0x0a0a0a,
                        background: 0x000000,
                        shoulderLines: 0xFFFFFF,
                        brokenLines: 0xFFFFFF,
                        leftCars: [0xD856BF, 0x6750A2, 0xC247AC],
                        rightCars: [0x03B3C3, 0x0E5EA5, 0x324555],
                        sticks: 0x03B3C3,
                    }
                }}
            />
            <ElectricBorder>
                <div className="login-card">
                    <h1>Secure File Hub</h1>
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

                </div>
            </ElectricBorder>
            <AppFooter />
        </div>
    );
}

export default Login;