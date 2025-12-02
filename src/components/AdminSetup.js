import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
      <motion.div 
        className="admin-setup-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div 
          className="admin-setup-card"
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 50 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        >
          <motion.div 
            className="check-icon"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            ✓
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Admin Already Configured
          </motion.h2>
          <motion.div 
            className="saved-address"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label>Current Admin Address</label>
            <code>{existingAdmin}</code>
          </motion.div>
          <motion.div 
            className="button-group"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.button 
              onClick={handleSkip} 
              className="btn-continue"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Continue to App →
            </motion.button>
            <motion.button 
              onClick={() => {
                localStorage.removeItem('adminAddress');
                window.location.reload();
              }} 
              className="btn-change"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Change Admin
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="admin-setup-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="admin-setup-card"
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 50 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        <AnimatePresence mode="wait">
          {!saved ? (
            <motion.div
              key="setup"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="setup-icon"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              >
                🔧
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Admin Setup Required
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Configure the administrator wallet address for your voting system
              </motion.p>
              
              <motion.div 
                className="setup-steps"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {[
                  'Launch Ganache blockchain',
                  'Copy first account address',
                  'Paste address below'
                ].map((step, index) => (
                  <motion.div 
                    key={index}
                    className="step-item"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    whileHover={{ x: 5 }}
                  >
                    <span className="step-number">{index + 1}</span>
                    <span>{step}</span>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div 
                className="form-group"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                <label>Administrator Wallet Address</label>
                <input
                  type="text"
                  value={adminAddress}
                  onChange={(e) => setAdminAddress(e.target.value)}
                  placeholder="0x..."
                  className="admin-input"
                />
              </motion.div>

              <motion.div 
                className="button-group"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
              >
                <motion.button 
                  onClick={handleSave} 
                  className="btn-save"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ✓ Save & Continue
                </motion.button>
                <motion.button 
                  onClick={handleSkip} 
                  className="btn-skip"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Skip for Now →
                </motion.button>
              </motion.div>

              <motion.div 
                className="info-box"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
              >
                <strong>💡 Developer Tip:</strong> You can also set this via console:
                <code>localStorage.setItem('adminAddress', 'YOUR_ADDRESS')</code>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="success-icon"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                ✓
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Setup Complete!
              </motion.h2>
              <motion.div 
                className="saved-address"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label>Admin Address</label>
                <code>{adminAddress}</code>
              </motion.div>
              <motion.div 
                className="loading-spinner"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="spinner"></div>
                <p>Launching application...</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default AdminSetup;
