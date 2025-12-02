import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
    // Update wallet connected state when account changes
    if (account) {
      setWalletConnected(true);
    } else {
      setWalletConnected(false);
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

    // For development: If no admin address is set, set current wallet as admin
    const adminAddress = localStorage.getItem('adminAddress')?.toLowerCase();
    
    if (!adminAddress) {
      // Auto-set the current wallet as admin for development
      localStorage.setItem('adminAddress', account.toLowerCase());
      console.log('Admin address set to:', account);
    } else if (account.toLowerCase() !== adminAddress) {
      // Update admin address to current wallet for development flexibility
      localStorage.setItem('adminAddress', account.toLowerCase());
      console.log('Admin address updated to:', account);
    }

    // Login successful
    setUserRole('admin');
    navigate('/admin');
  };

  return (
    <div className={`admin-login-page ${darkMode ? 'dark' : 'light'}`}>
      {/* Navigation Bar */}
      <motion.nav 
        className="navbar"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="navbar-container">
          <motion.div 
            className="navbar-brand"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div 
              className="navbar-logo"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              🗳️
            </motion.div>
            <span className="navbar-title">VoteChain Admin</span>
          </motion.div>
          <div className="navbar-actions">
            <motion.button 
              className="theme-toggle" 
              onClick={toggleTheme} 
              aria-label="Toggle theme"
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
            >
              {darkMode ? '☀️' : '🌙'}
            </motion.button>
            <motion.button 
              className="voter-login-btn"
              onClick={() => navigate('/')}
              whileHover={{ scale: 1.05, x: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              Voter Login →
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.section 
        className="hero-section"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.7 }}
      >
        <div className="hero-content">
          <motion.div 
            className="admin-badge"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              delay: 0.5, 
              type: 'spring', 
              stiffness: 200,
              damping: 12
            }}
            whileHover={{ 
              scale: 1.1, 
              rotate: [0, -5, 5, -5, 0],
              transition: { duration: 0.5 }
            }}
          >
            <motion.span 
              className="shield-icon"
              animate={{ 
                rotateY: [0, 360],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{ display: 'inline-block' }}
            >
              🛡️
            </motion.span>
            <span>Administrator Portal</span>
          </motion.div>
          <motion.h1 
            className="hero-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            Admin Control Center
          </motion.h1>
          <motion.p 
            className="hero-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            Manage voting system, register voters, and control election processes
          </motion.p>
        </div>
      </motion.section>

      {/* Main Content */}
      <main className="main-content">
        <motion.div 
          className="auth-container"
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <div className="auth-header">
            <h2>Admin Authentication</h2>
            <p>Secure access for administrators only</p>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                className="error-message"
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <span className="error-icon">⚠️</span>
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="auth-form">
            <AnimatePresence mode="wait">
              {!walletConnected ? (
                <motion.div
                  key="connect"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="info-box">
                    <span className="info-icon">ℹ️</span>
                    <p>Connect your admin wallet to proceed</p>
                  </div>

                  <motion.button 
                    onClick={handleMetaMaskConnect} 
                    className="btn-connect" 
                    disabled={loading}
                    whileHover={!loading ? { 
                      scale: 1.05,
                      boxShadow: "0 0 30px rgba(147, 51, 234, 0.5)",
                      background: "linear-gradient(135deg, #a855f7 0%, #9333ea 100%)"
                    } : {}}
                    whileTap={!loading ? { scale: 0.95 } : {}}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.4 }}
                  >
                    <motion.span
                      animate={{ 
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      style={{ display: 'inline-block' }}
                    >
                      🦊
                    </motion.span>
                    {' '}{loading ? '⏳ Connecting...' : 'Connect Admin Wallet'}
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.4 }}
                >
                  <motion.div 
                    className="wallet-badge success"
                    initial={{ scale: 0.9, rotateX: 90 }}
                    animate={{ scale: 1, rotateX: 0 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <motion.span
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      style={{ display: 'inline-block' }}
                    >
                      ✓
                    </motion.span>
                    <span>Admin Wallet Connected</span>
                    <code>{account.slice(0, 6)}...{account.slice(-4)}</code>
                  </motion.div>

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

                    <motion.button 
                      type="submit" 
                      disabled={loading} 
                      className="btn-login"
                      whileHover={!loading ? { 
                        scale: 1.05,
                        boxShadow: "0 0 30px rgba(147, 51, 234, 0.5)"
                      } : {}}
                      whileTap={!loading ? { 
                        scale: 0.95,
                        rotate: [0, -2, 2, -2, 0]
                      } : {}}
                    >
                      {loading ? '⏳ Verifying...' : '🔓 Access Dashboard'}
                    </motion.button>
                  </form>

                  <div className="security-notice">
                    
                    <p>All admin actions are recorded on the blockchain</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Admin Features */}
          <motion.div 
            className="admin-features"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            {[
              { icon: '👥', text: 'Register Voters' },
              { icon: '📋', text: 'Manage Nominees' },
              { icon: '⚙️', text: 'Control Voting' },
              { icon: '📊', text: 'View Results' }
            ].map((feature, index) => (
              <motion.div 
                key={feature.text}
                className="feature-item"
                initial={{ opacity: 0, y: 10, rotateX: 90 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ 
                  delay: 0.9 + index * 0.1,
                  type: 'spring',
                  stiffness: 150
                }}
                whileHover={{ 
                  scale: 1.1, 
                  y: -8,
                  rotateY: 10,
                  boxShadow: "0 10px 30px rgba(147, 51, 234, 0.3)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.span 
                  className="feature-icon"
                  whileHover={{ 
                    scale: 1.3,
                    rotate: 360,
                    transition: { duration: 0.6 }
                  }}
                  style={{ display: 'inline-block' }}
                >
                  {feature.icon}
                </motion.span>
                <span>{feature.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
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
