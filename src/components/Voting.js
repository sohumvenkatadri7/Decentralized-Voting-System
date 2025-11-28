import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

      // Get all nominees
      const allNominees = await contract.getAllNominees();
      const formattedNominees = allNominees.map(nominee => ({
        id: Number(nominee.id),
        name: nominee.name,
        description: nominee.description,
        voteCount: Number(nominee.voteCount)
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
        if (err.message.includes('You are not registered to vote')) {
          errorMessage = '❌ You are not registered to vote. Please contact the admin to register your wallet address.';
        } else if (err.message.includes('You have already voted')) {
          errorMessage = '❌ You have already voted. Each address can only vote once.';
        } else if (err.message.includes('Voting is not open')) {
          errorMessage = '❌ Voting is currently closed. Please wait for the admin to open voting.';
        } else if (err.message.includes('user rejected')) {
          errorMessage = '❌ Transaction was rejected. Please try again and confirm the transaction in MetaMask.';
        } else if (err.message.includes('insufficient funds')) {
          errorMessage = '❌ Insufficient funds for gas. Make sure you have ETH in your account.';
        } else {
          errorMessage += err.message;
        }
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
      <header className="voting-header">
        <h1>Live Voting Portal</h1>
        <div className="header-info">
          <div className="account-badge">
            <span>👤</span>
            <code>{account.slice(0, 6)}...{account.slice(-4)}</code>
          </div>
          <div className={`status-badge ${votingOpen ? 'active' : 'ended'}`}>
            {votingOpen ? '🟢 Voting Open' : '🔴 Voting Closed'}
          </div>
          <button onClick={handleLogout} className="btn-logout">
            Logout →
          </button>
        </div>
      </header>

      {/* Error/Info Messages */}
      {error && (
        <div className="error-banner">
          <span>⚠️</span>
          <p>{error}</p>
        </div>
      )}

      {hasVoted && (
        <div className="success-banner">
          <span>✓</span>
          <p>Your vote has been successfully recorded on the blockchain</p>
        </div>
      )}

      {/* Nominees Grid */}
      <div className="nominees-grid">
        {nominees.length === 0 ? (
          <div className="no-nominees">
            <div className="empty-icon">📭</div>
            <h3>No Nominees Available</h3>
            <p>The admin hasn't added any nominees yet. Please check back later.</p>
          </div>
        ) : (
          nominees.map((nominee) => (
            <div key={nominee.id} className="nominee-card">
              <div className="nominee-id">#{nominee.id}</div>
              
              <h3>{nominee.name}</h3>
              <p>{nominee.description}</p>
              
              <div className="vote-stats">
                <div className="vote-count">{nominee.voteCount}</div>
                <div className="vote-label">Total Votes</div>
              </div>

              {hasVoted ? (
                <div className="voted-badge">
                  <span className="voted-icon">✓</span>
                  Already Voted
                </div>
              ) : (
                <button
                  onClick={() => {
                    setSelectedNominee(nominee.id);
                    handleVote(nominee.id);
                  }}
                  disabled={!votingOpen || voting}
                  className="btn-vote"
                >
                  {selectedNominee === nominee.id && voting 
                    ? '⏳ Processing...' 
                    : '🗳️ Vote Now'}
                </button>
              )}
            </div>
          ))
        )}
      </div>

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
