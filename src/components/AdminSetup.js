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
          <h2>✅ Admin Address Already Set</h2>
          <p className="admin-address-display">{existingAdmin}</p>
          <div className="button-group">
            <button onClick={handleSkip} className="btn-continue">
              Continue
            </button>
            <button 
              onClick={() => {
                localStorage.removeItem('adminAddress');
                window.location.reload();
              }} 
              className="btn-reset"
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
            <h2>🔧 Initial Setup Required</h2>
            <p>Set the admin wallet address for this voting system.</p>
            
            <div className="setup-instructions">
              <h3>Steps:</h3>
              <ol>
                <li>Open <strong>Ganache</strong></li>
                <li>Copy the <strong>first account address</strong></li>
                <li>Paste it below</li>
              </ol>
            </div>

            <div className="form-group">
              <label htmlFor="adminAddress">Admin Wallet Address</label>
              <input
                type="text"
                id="adminAddress"
                value={adminAddress}
                onChange={(e) => setAdminAddress(e.target.value)}
                placeholder="0x..."
                className="admin-input"
              />
            </div>

            <div className="button-group">
              <button onClick={handleSave} className="btn-save">
                Save Admin Address
              </button>
              <button onClick={handleSkip} className="btn-skip">
                Skip (set in console later)
              </button>
            </div>

            <div className="console-help">
              <p><strong>Alternative:</strong> Set via browser console (F12):</p>
              <code>localStorage.setItem('adminAddress', 'YOUR_ADDRESS')</code>
            </div>
          </>
        ) : (
          <>
            <h2>✅ Admin Address Saved!</h2>
            <p className="admin-address-display">{adminAddress}</p>
            <p className="success-message">Redirecting...</p>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminSetup;
