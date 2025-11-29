import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = ({ web3Handler, account, setUserRole }) => {
  const [aadharNumber, setAadharNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [isAadharVerified, setIsAadharVerified] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Load theme preference
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

  useEffect(() => {
    // If both wallet connected and Aadhar verified, check role
    if (account && isAadharVerified) {
      checkUserRole();
    }
  }, [account, isAadharVerified]);

  const checkUserRole = async () => {
    try {
      // This would check against the smart contract
      // For demo purposes, we'll use a simple check
      // In production, call contract's isAdmin() function
      const adminAddress = localStorage.getItem('adminAddress')?.toLowerCase();
      if (account.toLowerCase() === adminAddress) {
        setUserRole('admin');
        navigate('/admin');
      } else {
        setUserRole('voter');
        navigate('/voting');
      }
    } catch (err) {
      console.error('Error checking user role:', err);
    }
  };

  const validateAadhar = (number) => {
    // Aadhar number is 12 digits
    const aadharRegex = /^\d{12}$/;
    return aadharRegex.test(number);
  };

  const handleAadharSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateAadhar(aadharNumber)) {
      setError('Please enter a valid 12-digit Aadhar number');
      return;
    }

    setLoading(true);
    
    // Simulate API call to send OTP
    // In production, this would call your backend to send OTP via Aadhar API
    setTimeout(() => {
      setShowOtpInput(true);
      setLoading(false);
      alert('OTP sent to your registered mobile number');
    }, 1500);
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);

    // Simulate OTP verification
    // In production, verify OTP with backend
    setTimeout(() => {
      setLoading(false);
      setIsAadharVerified(true);
      console.log('Aadhar verified successfully!');
    }, 1500);
  };

  const handleMetaMaskConnect = async () => {
    try {
      setError('');
      setLoading(true);
      await web3Handler();
      setLoading(false);
      // walletConnected state will be updated by the useEffect when account changes
    } catch (err) {
      setLoading(false);
      if (err.code === 4001) {
        setError('Please connect your wallet to continue');
      } else {
        setError('Failed to connect MetaMask wallet');
      }
      console.error(err);
    }
  };

  const handleDisconnectWallet = () => {
    // Reset all states
    setWalletConnected(false);
    setIsAadharVerified(false);
    setAadharNumber('');
    setOtp('');
    setShowOtpInput(false);
    setError('');
    // Reload page to clear wallet connection
    window.location.reload();
  };

  return (
    <div className={`login-page ${darkMode ? 'dark' : 'light'}`}>
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-brand">
            <div className="navbar-logo">🗳️</div>
            <span className="navbar-title">VoteChain</span>
          </div>
          <div className="navbar-actions">
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
              {darkMode ? '☀️' : '🌙'}
            </button>
            <button 
              className="admin-login-btn"
              onClick={() => navigate('/admin-login')}
            >
              🛡️ Admin Login
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Secure Blockchain Voting</h1>
          <p className="hero-subtitle">
            Experience the future of democratic participation with our decentralized voting platform. 
            Built on Ethereum with Aadhar-verified authentication for maximum security and transparency.
          </p>
          <div className="contract-hash">
            <span className="hash-label">Contract:</span>
            <code className="hash-value">0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb</code>
          </div>
          <div className="hero-badges">
            <div className="hero-badge">
              <span className="hero-badge-icon security-icon">🔐</span>
              <span className="hero-badge-text">Bank-Level Security</span>
            </div>
            <div className="hero-badge">
              <span className="hero-badge-icon lightning-icon">⚡</span>
              <span className="hero-badge-text">Instant Results</span>
            </div>
            <div className="hero-badge">
              <span className="hero-badge-icon verified-badge-gold">✓</span>
              <span className="hero-badge-text">Verified Identity</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content - Centered Login */}
      <main className="main-content">
        <div className="login-wrapper">
          <div className="auth-container">
          <div className="auth-header">
            <h2>Access Portal</h2>
            <p>Secure authentication to cast your vote</p>
          </div>

          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          {/* Step 1: Connect Wallet First */}
          {!walletConnected ? (
            <div className="auth-form">
              <div className="form-group">
                <label>Aadhar Number</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    value={aadharNumber}
                    onChange={(e) => setAadharNumber(e.target.value)}
                    placeholder="Enter 12-digit Aadhar"
                    maxLength="12"
                    disabled
                  />
                  
                </div>
              </div>

              <div className="divider">
                <span>Connect Wallet First</span>
              </div>

              <button onClick={handleMetaMaskConnect} className="btn-login">
                🦊 Connect MetaMask Wallet
              </button>

              <div className="security-badge">
                <span className="security-icon">🛡️</span>
                Blockchain-secured voting system
              </div>
            </div>
          ) : !isAadharVerified ? (
            /* Step 2: Aadhar Verification After Wallet Connected */
            <div className="auth-form">
              <div className="wallet-badge">
                <span>✓</span>
                <span>Wallet Connected</span>
                <code>{account.slice(0, 6)}...{account.slice(-4)}</code>
                <button onClick={handleDisconnectWallet} className="btn-disconnect" title="Disconnect Wallet">
                  ✕
                </button>
              </div>

              {!showOtpInput ? (
                <form onSubmit={handleAadharSubmit}>
                  <div className="form-group">
                    <label>Aadhar Number</label>
                    <div className="input-wrapper">
                      <input
                        type="text"
                        value={aadharNumber}
                        onChange={(e) => setAadharNumber(e.target.value)}
                        placeholder="Enter 12-digit Aadhar"
                        maxLength="12"
                        required
                      />
                      
                    </div>
                  </div>

                  <button type="submit" disabled={loading} className="btn-login">
                    {loading ? '⏳ Sending OTP...' : '📱 Send OTP'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleOtpSubmit}>
                  <div className="form-group">
                    <label>One-Time Password</label>
                    <div className="input-wrapper">
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter 6-digit OTP"
                        maxLength="6"
                        required
                        autoFocus
                      />
                      
                    </div>
                  </div>

                  <button type="submit" disabled={loading} className="btn-login">
                    {loading ? '⏳ Verifying...' : '✓ Verify & Continue'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowOtpInput(false)}
                    className="btn-secondary"
                  >
                    ← Change Aadhar Number
                  </button>
                </form>
              )}

              <div className="security-badge">
                <span className="security-icon">🔐</span>
                OTP sent to registered mobile
              </div>
            </div>
          ) : (
            /* Both Verified - Redirect happening */
            <div className="success-wrapper">
              <div className="success-icon">✓</div>
              <h2>Authentication Complete!</h2>
              <div className="success-items">
                <div className="success-item">
                  <span>✓</span>
                  <span>Wallet Verified</span>
                </div>
                <div className="success-item">
                  <span>✓</span>
                  <span>Identity Verified</span>
                </div>
              </div>
              <div className="loading-bar">
                <div className="loading-progress"></div>
              </div>
              <p>Redirecting to voting portal...</p>
            </div>
          )}
          
          {/* Tech Stack Badges */}
          <div className="tech-stack">
            <div className="tech-badge">
              <img src="https://cryptologos.cc/logos/ethereum-eth-logo.svg" alt="Ethereum" className="tech-badge-icon" />
              <div className="tech-badge-name">Ethereum</div>
            </div>
            <div className="tech-badge">
              <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" alt="MetaMask" className="tech-badge-icon" />
              <div className="tech-badge-name">MetaMask</div>
            </div>
            <div className="tech-badge">
              <img src="https://trufflesuite.com/img/ganache-logo-dark.svg" alt="Ganache" className="tech-badge-icon" />
              <div className="tech-badge-name">Ganache</div>
            </div>
            <div className="tech-badge">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/hardhat/hardhat-original.svg" alt="Hardhat" className="tech-badge-icon" />
              <div className="tech-badge-name">Hardhat</div>
            </div>
            <div className="tech-badge">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" alt="React" className="tech-badge-icon" />
              <div className="tech-badge-name">React</div>
            </div>
            <div className="tech-badge">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/solidity/solidity-original.svg" alt="Solidity" className="tech-badge-icon" />
              <div className="tech-badge-name">Solidity</div>
            </div>
          </div>
        </div>
        </div>
      </main>

      {/* Web3 Status Indicator */}
      <div className="web3-status">
        <div className="web3-status-dot"></div>
        <div className="web3-status-text">Web3 Connected</div>
      </div>

      {/* Footer - Features */}
      <footer className="footer">
        <div className="footer-content">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔐</div>
              <h3>Blockchain Secured</h3>
              <p>Immutable & transparent voting records on Ethereum</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Instant Results</h3>
              <p>Real-time vote counting with zero manipulation</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🛡️</div>
              <h3>Verified Identity</h3>
              <p>Aadhar-based authentication for legitimate voters</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌐</div>
              <h3>Decentralized</h3>
              <p>No central authority, truly democratic system</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2025 VoteChain. Built on Ethereum blockchain.</p>
            <p className="footer-credit">Made by <span>DeltDevz</span></p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Login;
