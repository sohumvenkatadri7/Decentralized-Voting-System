import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';

const AdminLogin = ({ web3Handler, account, setUserRole }) => {
  const [adminPassword, setAdminPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setDarkMode(savedTheme === 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  useEffect(() => {
    if (account) {
      setWalletConnected(true);
    }
  }, [account]);

  const handleMetaMaskConnect = async () => {
    try {
      setError('');
      setLoading(true);
      await web3Handler();
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError('');

    // Check if wallet is connected
    if (!walletConnected || !account) {
      setError('Please connect your MetaMask wallet first');
      return;
    }

    // Verify admin password (you can change this to your desired password)
    const ADMIN_PASSWORD = 'admin123'; // Change this to your secure password
    
    if (adminPassword !== ADMIN_PASSWORD) {
      setError('Invalid admin password');
      return;
    }

    // Check if connected wallet is the admin address
    const adminAddress = localStorage.getItem('adminAddress')?.toLowerCase();
    
    if (!adminAddress) {
      setError('No admin address configured. Please set admin address first.');
      return;
    }

    if (account.toLowerCase() !== adminAddress) {
      setError('Connected wallet is not the admin address');
      return;
    }

    // Login successful
    setUserRole('admin');
    navigate('/admin');
  };

  return (
    <div className={`admin-login-page ${darkMode ? 'dark' : 'light'}`}>
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-brand">
            <div className="navbar-logo">🗳️</div>
            <span className="navbar-title">VoteChain Admin</span>
          </div>
          <div className="navbar-actions">
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
              {darkMode ? '☀️' : '🌙'}
            </button>
            <button 
              className="voter-login-btn"
              onClick={() => navigate('/')}
            >
              Voter Login →
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="admin-badge">
            <span className="shield-icon">🛡️</span>
            <span>Administrator Portal</span>
          </div>
          <h1 className="hero-title">Admin Control Center</h1>
          <p className="hero-subtitle">
            Manage voting system, register voters, and control election processes
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="main-content">
        <div className="auth-container">
          <div className="auth-header">
            <h2>Admin Authentication</h2>
            <p>Secure access for administrators only</p>
          </div>

          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <div className="auth-form">
            {!walletConnected ? (
              <>
                <div className="info-box">
                  <span className="info-icon">ℹ️</span>
                  <p>Connect your admin wallet to proceed</p>
                </div>

                <button onClick={handleMetaMaskConnect} className="btn-connect" disabled={loading}>
                  {loading ? '⏳ Connecting...' : '🦊 Connect Admin Wallet'}
                </button>
              </>
            ) : (
              <>
                <div className="wallet-badge success">
                  <span>✓</span>
                  <span>Admin Wallet Connected</span>
                  <code>{account.slice(0, 6)}...{account.slice(-4)}</code>
                </div>

                <form onSubmit={handleAdminLogin}>
                  <div className="form-group">
                    <label>Admin Password</label>
                    <div className="input-wrapper">
                      <input
                        type="password"
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        placeholder="Enter admin password"
                        required
                      />
                      <span className="input-icon">🔐</span>
                    </div>
                  </div>

                  <button type="submit" disabled={loading} className="btn-login">
                    {loading ? '⏳ Verifying...' : '🔓 Access Dashboard'}
                  </button>
                </form>

                <div className="security-notice">
                  <span className="lock-icon">🔒</span>
                  <p>All admin actions are recorded on the blockchain</p>
                </div>
              </>
            )}
          </div>

          {/* Admin Features */}
          <div className="admin-features">
            <div className="feature-item">
              <span className="feature-icon">👥</span>
              <span>Register Voters</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📋</span>
              <span>Manage Nominees</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">⚙️</span>
              <span>Control Voting</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📊</span>
              <span>View Results</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <p>© 2025 VoteChain Admin Portal. Secured by Ethereum blockchain.</p>
          <p className="footer-credit">Made by <span>DeltDevz</span></p>
        </div>
      </footer>
    </div>
  );
};

export default AdminLogin;
