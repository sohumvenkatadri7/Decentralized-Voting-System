import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './Voting.css';

const Voting = ({ contract, account }) => {
  const [nominees, setNominees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [votingOpen, setVotingOpen] = useState(false);
  const [selectedNominee, setSelectedNominee] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (contract && account) {
      loadBlockchainData();
    }
  }, [contract, account]);

  const loadBlockchainData = async () => {
    try {
      setLoading(true);
      
      // Get voting status
      const status = await contract.getVotingStatus();
      setVotingOpen(status);

      // Get voter info
      const voterInfo = await contract.getVoterInfo(account);
      setHasVoted(voterInfo[0]); // hasVoted
      
      // Check if voter is registered
      const isRegistered = voterInfo[2]; // isRegistered
      if (!isRegistered) {
        setError('⚠️ REGISTRATION REQUIRED: Your wallet address is not registered. Please contact the admin to register before voting. Your address: ' + account);
      }

      // Get all nominees
      const allNominees = await contract.getAllNominees();
      const formattedNominees = allNominees.map(nominee => ({
        id: Number(nominee.id),
        name: nominee.name,
        description: nominee.description
        // Hide vote count from voters for privacy
      }));
      
      setNominees(formattedNominees);
      setLoading(false);
    } catch (err) {
      console.error('Error loading blockchain data:', err);
      setError('Failed to load voting data');
      setLoading(false);
    }
  };

  const handleVote = async (nomineeId) => {
    if (!votingOpen) {
      setError('Voting is currently closed');
      return;
    }

    if (hasVoted) {
      setError('You have already cast your vote');
      return;
    }

    try {
      setVoting(true);
      setError('');
      
      const tx = await contract.vote(nomineeId);
      await tx.wait();
      
      alert('Vote cast successfully!');
      setHasVoted(true);
      
      // Reload data to show updated vote counts
      await loadBlockchainData();
      setVoting(false);
    } catch (err) {
      console.error('Error casting vote:', err);
      
      // Detailed error messages
      let errorMessage = 'Failed to cast vote. ';
      
      if (err.reason) {
        errorMessage += err.reason;
      } else if (err.message) {
        if (err.message.includes('You are not registered to vote') || err.message.includes('not registered')) {
          errorMessage = '❌ You are not registered to vote. Please contact the admin to register your wallet address: ' + account;
        } else if (err.message.includes('You have already voted') || err.message.includes('already voted')) {
          errorMessage = '❌ You have already voted. Each address can only vote once.';
        } else if (err.message.includes('Voting is not open') || err.message.includes('not open')) {
          errorMessage = '❌ Voting is currently closed. Please wait for the admin to open voting.';
        } else if (err.message.includes('user rejected') || err.message.includes('rejected')) {
          errorMessage = '❌ Transaction was rejected. Please try again and confirm the transaction in MetaMask.';
        } else if (err.message.includes('insufficient funds')) {
          errorMessage = '❌ Insufficient funds for gas. Make sure you have ETH in your account.';
        } else if (err.message.includes('Nominee does not exist')) {
          errorMessage = '❌ Invalid nominee selected. Please try again.';
        } else {
          errorMessage += err.message;
        }
      } else {
        errorMessage = '❌ Registration Required: Your wallet address needs to be registered by the admin before you can vote. Please contact the admin and provide your wallet address: ' + account;
      }
      
      setError(errorMessage);
      setVoting(false);
    }
  };

  const handleLogout = () => {
    // Clear user role and navigate back to login
    navigate('/');
  };

  if (loading) {
    return (
      <div className="voting-container">
        <div className="loading">Loading voting data...</div>
      </div>
    );
  }

  return (
    <div className="voting-container">
      {/* Header */}
      <motion.header 
        className="voting-header"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Live Voting Portal
        </motion.h1>
        <motion.div 
          className="header-info"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="account-badge">
            <span>👤</span>
            <code>{account.slice(0, 6)}...{account.slice(-4)}</code>
          </div>
          <div className={`status-badge ${votingOpen ? 'active' : 'ended'}`}>
            {votingOpen ? '🟢 Voting Open' : '🔴 Voting Closed'}
          </div>
          <motion.button 
            onClick={handleLogout} 
            className="btn-logout"
            whileHover={{ scale: 1.05, x: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            Logout →
          </motion.button>
        </motion.div>
      </motion.header>

      {/* Error/Info Messages */}
      <AnimatePresence mode="wait">
      {error && (
        <motion.div 
          className="error-banner"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <span>⚠️</span>
          <div>
            <p>{error}</p>
            {error.includes('REGISTRATION REQUIRED') && (
              <motion.button
                className="copy-address-btn"
                onClick={() => {
                  navigator.clipboard.writeText(account);
                  alert('Wallet address copied to clipboard!');
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                📋 Copy Wallet Address
              </motion.button>
            )}
          </div>
        </motion.div>
      )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
      {hasVoted && (
        <motion.div 
          className="success-banner"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.4 }}
        >
          <span>✓</span>
          <p>Your vote has been successfully recorded on the blockchain</p>
        </motion.div>
      )}
      </AnimatePresence>

      {/* Nominees Grid */}
      <motion.div 
        className="nominees-grid"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        {nominees.length === 0 ? (
          <motion.div 
            className="no-nominees"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="empty-icon">📭</div>
            <h3>No Nominees Available</h3>
            <p>The admin hasn't added any nominees yet. Please check back later.</p>
          </motion.div>
        ) : (
          nominees.map((nominee, index) => (
            <motion.div 
              key={nominee.id} 
              className="nominee-card"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              whileHover={{ scale: 1.03, y: -5 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="nominee-id">#{nominee.id}</div>
              
              <h3>{nominee.name}</h3>
              <p>{nominee.description}</p>
              
              {/* Vote count hidden from voters for privacy */}

              {hasVoted ? (
                <div className="voted-badge">\n                  <span className="voted-icon">✓</span>
                  Already Voted
                </div>
              ) : (
                <motion.button
                  onClick={() => {
                    setSelectedNominee(nominee.id);
                    handleVote(nominee.id);
                  }}
                  disabled={!votingOpen || voting}
                  className="btn-vote"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {selectedNominee === nominee.id && voting 
                    ? '⏳ Processing...' 
                    : '🗳️ Vote Now'}
                </motion.button>
              )}
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Footer Info */}
      {!hasVoted && votingOpen && nominees.length > 0 && (
        <div className="voting-footer">
          <div className="info-card">
            <h3>✨ Voting Guidelines</h3>
            <ul>
              <li><strong>One Vote Only:</strong> Each wallet can vote exactly once</li>
              <li><strong>Immutable:</strong> Your vote is permanent and cannot be changed</li>
              <li><strong>Transparent:</strong> All votes are publicly verifiable on the blockchain</li>
              <li><strong>Secure:</strong> Cryptographically secured through smart contracts</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Voting;
