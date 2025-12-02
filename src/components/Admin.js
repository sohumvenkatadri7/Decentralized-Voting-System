
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './Admin.css';

const Admin = ({ contract, account }) => {
  const [nominees, setNominees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [votingOpen, setVotingOpen] = useState(false);
  const [totalVotes, setTotalVotes] = useState(0);
  const [error, setError] = useState('');
  
  // Form states
  const [nomineeName, setNomineeName] = useState('');
  const [nomineeDescription, setNomineeDescription] = useState('');
  const [adding, setAdding] = useState(false);
  
  // Voter registration states
  const [voterAddress, setVoterAddress] = useState('');
  const [aadharHash, setAadharHash] = useState('');
  const [registering, setRegistering] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    if (contract && account) {
      checkAdminStatus();
      loadBlockchainData();
    }
  }, [contract, account]);

  const checkAdminStatus = async () => {
    try {
      const isAdmin = await contract.isAdmin(account);
      if (!isAdmin) {
        alert('You are not authorized to access this page');
        navigate('/voting');
      }
    } catch (err) {
      console.error('Error checking admin status:', err);
    }
  };

  const loadBlockchainData = async () => {
    try {
      setLoading(true);
      
      // Get voting status
      const status = await contract.getVotingStatus();
      setVotingOpen(status);

      // Get total votes
      const votes = await contract.getTotalVotes();
      setTotalVotes(Number(votes));

      // Get all nominees
      const allNominees = await contract.getAllNominees();
      const formattedNominees = allNominees.map(nominee => ({
        id: Number(nominee.id),
        name: nominee.name,
        description: nominee.description,
        voteCount: Number(nominee.voteCount)
      }));
      
      // Sort by vote count
      formattedNominees.sort((a, b) => b.voteCount - a.voteCount);
      
      setNominees(formattedNominees);
      setLoading(false);
    } catch (err) {
      console.error('Error loading blockchain data:', err);
      setError('Failed to load data');
      setLoading(false);
    }
  };

  const handleAddNominee = async (e) => {
    e.preventDefault();
    
    if (!nomineeName.trim() || !nomineeDescription.trim()) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setAdding(true);
      setError('');
      
      const tx = await contract.addNominee(nomineeName, nomineeDescription);
      await tx.wait();
      
      alert('Nominee added successfully!');
      setNomineeName('');
      setNomineeDescription('');
      
      await loadBlockchainData();
      setAdding(false);
    } catch (err) {
      console.error('Error adding nominee:', err);
      setError(err.reason || 'Failed to add nominee');
      setAdding(false);
    }
  };

  const handleToggleVoting = async () => {
    try {
      setError('');
      const tx = await contract.toggleVoting();
      await tx.wait();
      
      alert(`Voting ${votingOpen ? 'closed' : 'opened'} successfully!`);
      await loadBlockchainData();
    } catch (err) {
      console.error('Error toggling voting:', err);
      setError(err.reason || 'Failed to toggle voting status');
    }
  };

  const handleRegisterVoter = async (e) => {
    e.preventDefault();
    
    if (!voterAddress.trim() || !aadharHash.trim()) {
      setError('Please fill in all voter registration fields');
      return;
    }

    // Basic Ethereum address validation
    if (!/^0x[a-fA-F0-9]{40}$/.test(voterAddress)) {
      setError('Invalid Ethereum address');
      return;
    }

    try {
      setRegistering(true);
      setError('');
      
      const tx = await contract.registerVoter(voterAddress, aadharHash);
      await tx.wait();
      
      alert('Voter registered successfully!');
      setVoterAddress('');
      setAadharHash('');
      setRegistering(false);
    } catch (err) {
      console.error('Error registering voter:', err);
      setError(err.reason || 'Failed to register voter');
      setRegistering(false);
    }
  };

  const handleLogout = () => {
    navigate('/');
  };

  const getVotePercentage = (voteCount) => {
    if (totalVotes === 0) return 0;
    return ((voteCount / totalVotes) * 100).toFixed(1);
  };

  if (loading) {
    return (
      <div className="admin-container">
        <div className="loading">Loading admin panel...</div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      {/* Header */}
      <motion.header 
        className="admin-header"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Admin Control Panel
        </motion.h1>
        <motion.p 
          className="subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Manage voting process and nominees
        </motion.p>
        <motion.div 
          className="header-info"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="account-badge">
            <span>👑</span>
            <code>{account.slice(0, 6)}...{account.slice(-4)}</code>
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

      <AnimatePresence mode="wait">
        {error && (
          <motion.div 
            className="status-message error"
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            ⚠️ {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Dashboard */}
      <motion.div 
        className="admin-stats"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        {[
          { label: 'Total Votes Cast', value: totalVotes },
          { label: 'Total Nominees', value: nominees.length },
          { label: 'Voting Status', value: votingOpen ? 'Open' : 'Closed', color: votingOpen ? '#22c55e' : '#ef4444' }
        ].map((stat, index) => (
          <motion.div 
            key={stat.label}
            className="stat-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <div className="stat-label">{stat.label}</div>
            <div className="stat-value" style={stat.color ? { color: stat.color } : {}}>
              {stat.value}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Content */}
      <div className="admin-sections">
        {/* Voting Control */}
        <motion.div 
          className="admin-section"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <h2>🗳️ Voting Control</h2>
          <p style={{ color: '#64748b', marginBottom: '20px', fontSize: '15px' }}>
            {votingOpen ? 'Voting is currently open. Close it to prevent new votes.' : 'Voting is currently closed. Open it to allow users to vote.'}
          </p>
          <motion.button 
            onClick={handleToggleVoting} 
            className={votingOpen ? 'btn-danger' : 'btn-success'}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {votingOpen ? '🔒 Close Voting Now' : '🔓 Open Voting Now'}
          </motion.button>
        </motion.div>

        {/* Add Nominee */}
        <motion.div 
          className="admin-section"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <h2>➕ Add New Nominee</h2>
          <form onSubmit={handleAddNominee}>
            <div className="form-group">
              <label>Nominee Name</label>
              <input
                type="text"
                value={nomineeName}
                onChange={(e) => setNomineeName(e.target.value)}
                placeholder="Enter candidate name"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={nomineeDescription}
                onChange={(e) => setNomineeDescription(e.target.value)}
                placeholder="Enter candidate description and qualifications"
                rows="4"
                required
              />
            </div>
            
            <motion.button 
              type="submit" 
              disabled={adding} 
              className="btn-primary"
              whileHover={{ scale: adding ? 1 : 1.05 }}
              whileTap={{ scale: adding ? 1 : 0.95 }}
            >
              {adding ? '⏳ Adding Nominee...' : '✓ Add Nominee'}
            </motion.button>
          </form>
        </motion.div>

        {/* Register Voter */}
        <motion.div 
          className="admin-section"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
        >
          <h2>👤 Register New Voter</h2>
          <form onSubmit={handleRegisterVoter}>
            <div className="form-group">
              <label>Wallet Address</label>
              <input
                type="text"
                value={voterAddress}
                onChange={(e) => setVoterAddress(e.target.value)}
                placeholder="0x..."
                required
              />
            </div>
            
            <div className="form-group">
              <label>Aadhar Hash</label>
              <input
                type="text"
                value={aadharHash}
                onChange={(e) => setAadharHash(e.target.value)}
                placeholder="Hashed Aadhar number"
                required
              />
            </div>
            
            <motion.button 
              type="submit" 
              disabled={registering} 
              className="btn-primary"
              whileHover={{ scale: registering ? 1 : 1.05 }}
              whileTap={{ scale: registering ? 1 : 0.95 }}
            >
              {registering ? '⏳ Registering...' : '✓ Register Voter'}
            </motion.button>
          </form>
        </motion.div>

        {/* Live Results */}
        <motion.div 
          className="admin-section"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.0, duration: 0.5 }}
        >
          <h2>📊 Live Results</h2>
          {nominees.length === 0 ? (
            <motion.div 
              className="no-results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              No nominees have been added yet. Add nominees using the form above.
            </motion.div>
          ) : (
            <div className="results-grid">
              {nominees.map((nominee, index) => {
                const percentage = getVotePercentage(nominee.voteCount);
                const isWinner = index === 0 && nominee.voteCount > 0;
                
                return (
                  <motion.div 
                    key={nominee.id} 
                    className="result-item"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 + index * 0.1, duration: 0.4 }}
                    whileHover={{ scale: 1.02, y: -3 }}
                  >
                    <div className="result-header">
                      <h3>
                        {index + 1}. {nominee.name}
                        {isWinner && <span className="winner-badge">Winner</span>}
                      </h3>
                      <div className="result-votes">
                        <div className="vote-number">{nominee.voteCount}</div>
                        <div className="vote-label">Votes</div>
                      </div>
                    </div>
                    <p className="result-details">{nominee.description}</p>
                    <div className="progress-bar-container">
                      <motion.div 
                        className="progress-bar" 
                        style={{ width: `${percentage}%` }}
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ delay: 1.4 + index * 0.1, duration: 0.8 }}
                      />
                    </div>
                    <div style={{ 
                      textAlign: 'right', 
                      color: '#64748b', 
                      fontSize: '13px', 
                      fontWeight: '700',
                      marginTop: '8px'
                    }}>
                      {percentage}%
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Admin;
