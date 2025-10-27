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
      <header className="admin-header">
        <h1>⚙️ Admin Dashboard</h1>
        <div className="header-info">
          <span className="account-badge">
            Admin: {account.slice(0, 6)}...{account.slice(-4)}
          </span>
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </div>
      </header>

      {error && <div className="error-message">{error}</div>}

      {/* Stats Section */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <div className="stat-value">{totalVotes}</div>
            <div className="stat-label">Total Votes</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <div className="stat-value">{nominees.length}</div>
            <div className="stat-label">Nominees</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🗳️</div>
          <div className="stat-info">
            <div className="stat-value">{votingOpen ? 'Open' : 'Closed'}</div>
            <div className="stat-label">Voting Status</div>
          </div>
        </div>
      </div>

      {/* Voting Control */}
      <div className="control-section">
        <h2>Voting Control</h2>
        <button 
          onClick={handleToggleVoting} 
          className={`btn-toggle ${votingOpen ? 'close' : 'open'}`}
        >
          {votingOpen ? '🔒 Close Voting' : '🔓 Open Voting'}
        </button>
      </div>

      {/* Add Nominee Form */}
      <div className="form-section">
        <h2>Add New Nominee</h2>
        <form onSubmit={handleAddNominee}>
          <div className="form-group">
            <label htmlFor="nomineeName">Nominee Name</label>
            <input
              type="text"
              id="nomineeName"
              value={nomineeName}
              onChange={(e) => setNomineeName(e.target.value)}
              placeholder="Enter nominee name"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="nomineeDescription">Description</label>
            <textarea
              id="nomineeDescription"
              value={nomineeDescription}
              onChange={(e) => setNomineeDescription(e.target.value)}
              placeholder="Enter nominee description"
              rows="3"
              required
            />
          </div>
          
          <button type="submit" disabled={adding} className="btn-primary">
            {adding ? 'Adding...' : 'Add Nominee'}
          </button>
        </form>
      </div>

      {/* Register Voter Form */}
      <div className="form-section">
        <h2>Register New Voter</h2>
        <form onSubmit={handleRegisterVoter}>
          <div className="form-group">
            <label htmlFor="voterAddress">Voter Wallet Address</label>
            <input
              type="text"
              id="voterAddress"
              value={voterAddress}
              onChange={(e) => setVoterAddress(e.target.value)}
              placeholder="0x..."
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="aadharHash">Aadhar Hash</label>
            <input
              type="text"
              id="aadharHash"
              value={aadharHash}
              onChange={(e) => setAadharHash(e.target.value)}
              placeholder="Enter Aadhar hash"
              required
            />
          </div>
          
          <button type="submit" disabled={registering} className="btn-primary">
            {registering ? 'Registering...' : 'Register Voter'}
          </button>
        </form>
      </div>

      {/* Nominees and Results */}
      <div className="results-section">
        <h2>Current Results</h2>
        {nominees.length === 0 ? (
          <div className="no-data">No nominees added yet</div>
        ) : (
          <div className="nominees-list">
            {nominees.map((nominee, index) => (
              <div key={nominee.id} className="nominee-result">
                <div className="nominee-rank">#{index + 1}</div>
                <div className="nominee-info">
                  <h3>{nominee.name}</h3>
                  <p>{nominee.description}</p>
                  <div className="vote-bar">
                    <div 
                      className="vote-bar-fill" 
                      style={{ width: `${getVotePercentage(nominee.voteCount)}%` }}
                    />
                  </div>
                  <div className="vote-stats">
                    <span>{nominee.voteCount} votes</span>
                    <span>{getVotePercentage(nominee.voteCount)}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
