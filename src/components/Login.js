import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = ({ web3Handler, account, setUserRole }) => {
  const [aadharNumber, setAadharNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if already connected
    if (account && isVerified) {
      // Check if admin (this would come from smart contract)
      checkUserRole();
    }
  }, [account, isVerified]);

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
      setIsVerified(true);
      console.log('Aadhar verified! isVerified set to:', true);
      // Don't use alert, it might block state update
    }, 1500);
  };

  const handleMetaMaskConnect = async () => {
    if (!isVerified) {
      setError('Please verify your Aadhar first');
      return;
    }

    try {
      // Request account access - this will show MetaMask popup even if previously connected
      await window.ethereum.request({
        method: 'wallet_requestPermissions',
        params: [{ eth_accounts: {} }],
      });
      
      // Then connect
      await web3Handler();
    } catch (err) {
      if (err.code === 4001) {
        setError('Please connect your wallet to continue');
      } else {
        setError('Failed to connect MetaMask wallet');
      }
      console.error(err);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Decentralized Voting System</h1>
        <p className="subtitle">Secure • Transparent • Democratic</p>

        {!isVerified ? (
          <div className="verification-section">
            <h2>Step 1: Verify Your Identity</h2>
            
            {!showOtpInput ? (
              <form onSubmit={handleAadharSubmit}>
                <div className="form-group">
                  <label htmlFor="aadhar">Aadhar Number</label>
                  <input
                    type="text"
                    id="aadhar"
                    value={aadharNumber}
                    onChange={(e) => setAadharNumber(e.target.value)}
                    placeholder="Enter 12-digit Aadhar number"
                    maxLength="12"
                    required
                  />
                </div>
                <button type="submit" disabled={loading} className="btn-primary">
                  {loading ? 'Sending OTP...' : 'Send OTP'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleOtpSubmit}>
                <div className="form-group">
                  <label htmlFor="otp">Enter OTP</label>
                  <input
                    type="text"
                    id="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 6-digit OTP"
                    maxLength="6"
                    required
                  />
                </div>
                <button type="submit" disabled={loading} className="btn-primary">
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowOtpInput(false)}
                  className="btn-secondary"
                >
                  Change Aadhar Number
                </button>
              </form>
            )}
          </div>
        ) : (
          <div className="wallet-section">
            <div className="success-check">✓ Aadhar Verified Successfully!</div>
            <h2>Step 2: Connect Your Wallet</h2>
            <div className="wallet-info">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" 
                alt="MetaMask" 
                className="metamask-logo"
              />
              {!account ? (
                <>
                  <p>Connect your MetaMask wallet to proceed</p>
                  <button onClick={handleMetaMaskConnect} className="btn-wallet">
                    🦊 Connect MetaMask Wallet
                  </button>
                </>
              ) : (
                <>
                  <p className="success">✓ Wallet Connected</p>
                  <p className="wallet-address">
                    {account.slice(0, 6)}...{account.slice(-4)}
                  </p>
                  <button onClick={checkUserRole} className="btn-primary">
                    Proceed to Voting
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {error && <div className="error-message">{error}</div>}

        <div className="info-section">
          <h3>Requirements:</h3>
          <ul>
            <li>Valid Aadhar Card</li>
            <li>MetaMask Wallet installed in your browser</li>
            <li>Connected to Ganache network (localhost:7545)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Login;
