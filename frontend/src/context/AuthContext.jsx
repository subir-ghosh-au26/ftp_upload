import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Utility to set the authorization header
const setAuthToken = token => {
    if (token) {
        axios.defaults.headers.common['x-auth-token'] = token;
    } else {
        delete axios.defaults.headers.common['x-auth-token'];
    }
};

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // Start as true to check token

    useEffect(() => {
        const loadUser = async () => {
            const storedToken = localStorage.getItem('token');
            if (storedToken) {
                setAuthToken(storedToken);
                try {
                    // Verify token and get user data
                    const res = await axios.get('/api/auth/me');
                    setUser(res.data); // Set user with data from backend
                    setToken(storedToken);
                } catch (err) {
                    // Token is invalid or expired
                    console.error("Token validation failed", err);
                    localStorage.removeItem('token');
                    setToken(null);
                    setUser(null);
                    setAuthToken(null);
                }
            }
            setLoading(false); // Finished loading attempt
        };
        loadUser();
    }, []);

    const login = async (username, password) => {
        try {
            const res = await axios.post('/api/auth/login', { username, password });
            const { token } = res.data;

            localStorage.setItem('token', token);
            setAuthToken(token);
            setToken(token);

            // Fetch user data after successful login
            const userRes = await axios.get('/api/auth/me');
            setUser(userRes.data);

            return { success: true };
        } catch (err) {
            return { success: false, error: err.response?.data?.msg || 'Login failed' };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setAuthToken(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);