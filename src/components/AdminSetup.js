import React, { useState } from 'react';
import './AdminSetup.css';

const AdminSetup = ({ onComplete }) => {
  const [adminAddress, setAdminAddress] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (adminAddress && /^0x[a-fA-F0-9]{40}$/.test(adminAddress)) {
      localStorage.setItem('adminAddress', adminAddress.toLowerCase());
      setSaved(true);
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 1500);
    } else {
      alert('Please enter a valid Ethereum address');
    }
  };

  const handleSkip = () => {
    if (onComplete) onComplete();
  };

  // Check if already set
  const existingAdmin = localStorage.getItem('adminAddress');
  if (existingAdmin && !saved) {
    return (
      <div className="admin-setup-overlay">
        <div className="admin-setup-card">
          <div className="check-icon">✓</div>
          <h2>Admin Already Configured</h2>
          <div className="saved-address">
            <label>Current Admin Address</label>
            <code>{existingAdmin}</code>
          </div>
          <div className="button-group">
            <button onClick={handleSkip} className="btn-continue">
              Continue to App →
            </button>
            <button 
              onClick={() => {
                localStorage.removeItem('adminAddress');
                window.location.reload();
              }} 
              className="btn-change"
            >
              Change Admin
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-setup-overlay">
      <div className="admin-setup-card">
        {!saved ? (
          <>
            <div className="setup-icon">🔧</div>
            <h2>Admin Setup Required</h2>
            <p>Configure the administrator wallet address for your voting system</p>
            
            <div className="setup-steps">
              <div className="step-item">
                <span className="step-number">1</span>
                <span>Launch Ganache blockchain</span>
              </div>
              <div className="step-item">
                <span className="step-number">2</span>
                <span>Copy first account address</span>
              </div>
              <div className="step-item">
                <span className="step-number">3</span>
                <span>Paste address below</span>
              </div>
            </div>

            <div className="form-group">
              <label>Administrator Wallet Address</label>
              <input
                type="text"
                value={adminAddress}
                onChange={(e) => setAdminAddress(e.target.value)}
                placeholder="0x..."
                className="admin-input"
              />
            </div>

            <div className="button-group">
              <button onClick={handleSave} className="btn-save">
                ✓ Save & Continue
              </button>
              <button onClick={handleSkip} className="btn-skip">
                Skip for Now →
              </button>
            </div>

            <div className="info-box">
              <strong>💡 Developer Tip:</strong> You can also set this via console:
              <code>localStorage.setItem('adminAddress', 'YOUR_ADDRESS')</code>
            </div>
          </>
        ) : (
          <>
            <div className="success-icon">✓</div>
            <h2>Setup Complete!</h2>
            <div className="saved-address">
              <label>Admin Address</label>
              <code>{adminAddress}</code>
            </div>
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Launching application...</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminSetup;
