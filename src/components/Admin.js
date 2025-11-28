
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
      <header className="admin-header">
        <h1>Admin Control Panel</h1>
        <p className="subtitle">Manage voting process and nominees</p>
        <div className="header-info">
          <div className="account-badge">
            <span>👑</span>
            <code>{account.slice(0, 6)}...{account.slice(-4)}</code>
          </div>
          <button onClick={handleLogout} className="btn-logout">
            Logout →
          </button>
        </div>
      </header>

      {error && (
        <div className="status-message error">
          ⚠️ {error}
        </div>
      )}

      {/* Stats Dashboard */}
      <div className="admin-stats">
        <div className="stat-card">
          <div className="stat-label">Total Votes Cast</div>
          <div className="stat-value">{totalVotes}</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-label">Total Nominees</div>
          <div className="stat-value">{nominees.length}</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-label">Voting Status</div>
          <div className="stat-value" style={{ color: votingOpen ? '#22c55e' : '#ef4444' }}>
            {votingOpen ? 'Open' : 'Closed'}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="admin-sections">
        {/* Voting Control */}
        <div className="admin-section">
          <h2>🗳️ Voting Control</h2>
          <p style={{ color: '#64748b', marginBottom: '20px', fontSize: '15px' }}>
            {votingOpen ? 'Voting is currently open. Close it to prevent new votes.' : 'Voting is currently closed. Open it to allow users to vote.'}
          </p>
          <button 
            onClick={handleToggleVoting} 
            className={votingOpen ? 'btn-danger' : 'btn-success'}
          >
            {votingOpen ? '🔒 Close Voting Now' : '🔓 Open Voting Now'}
          </button>
        </div>

        {/* Add Nominee */}
        <div className="admin-section">
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
            
            <button type="submit" disabled={adding} className="btn-primary">
              {adding ? '⏳ Adding Nominee...' : '✓ Add Nominee'}
            </button>
          </form>
        </div>

        {/* Register Voter */}
        <div className="admin-section">
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
            
            <button type="submit" disabled={registering} className="btn-primary">
              {registering ? '⏳ Registering...' : '✓ Register Voter'}
            </button>
          </form>
        </div>

        {/* Live Results */}
        <div className="admin-section">
          <h2>📊 Live Results</h2>
          {nominees.length === 0 ? (
            <div className="no-results">
              No nominees have been added yet. Add nominees using the form above.
            </div>
          ) : (
            <div className="results-grid">
              {nominees.map((nominee, index) => {
                const percentage = getVotePercentage(nominee.voteCount);
                const isWinner = index === 0 && nominee.voteCount > 0;
                
                return (
                  <div key={nominee.id} className="result-item">
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
                      <div 
                        className="progress-bar" 
                        style={{ width: `${percentage}%` }}
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
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
