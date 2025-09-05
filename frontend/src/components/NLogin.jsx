import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './NLogin.css';

function NLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    const result = await login(username, password);
    setIsLoading(false);

    if (!result.success) {
      setError(result.error || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="neural-login-container">
      <div className="floating-cube"></div>
      <div className="login-card">
        <header className="login-header">
          <div className="logo-container">
            <span className="logo-icon" style={{ fontSize: '50px' }}>🤖</span>
          </div>
          <h1 className="login-title">Secure File Hub</h1>
        </header>

        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          
          <div className="input-group">
            <input
              type="text"
              className="login-input"
              placeholder="Neural ID (Email)"
              value={username}
              onChange={(e) => setUsername(e.value)}
              required
            />
            <span className="input-icon">🧠</span>
          </div>
          <div className="input-group">
            <input
              type="password"
              className="login-input"
              placeholder="Access Key (Password)"
              value={password}
              onChange={(e) => setPassword(e.value)}
              required
            />
            <span className="input-icon">🔒</span>
          </div>
          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? 'Connecting...' : 'Initialize AI Connection'}
          </button>
        </form>

        <a href="#" className="reset-link">Reset Neural Network?</a>
        <div className="divider"></div>
        <div className="social-icons">
          <span className="social-icon">🤖</span>
          <span className="social-icon">🧠</span>
          <span className="social-icon">⚡️</span>
        </div>
      </div>
    </div>
  );
}

export default NLogin;