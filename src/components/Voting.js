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
      <header className="voting-header">
        <h1>🗳️ Cast Your Vote</h1>
        <div className="header-info">
          <span className="account-badge">
            {account.slice(0, 6)}...{account.slice(-4)}
          </span>
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </div>
      </header>

      <div className="voting-status">
        <div className={`status-badge ${votingOpen ? 'open' : 'closed'}`}>
          {votingOpen ? '✓ Voting Open' : '✗ Voting Closed'}
        </div>
        {hasVoted && (
          <div className="voted-badge">
            ✓ You have already voted
          </div>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      {!votingOpen && (
        <div className="info-message">
          Voting is currently closed. Please wait for the admin to open voting.
        </div>
      )}

      <div className="nominees-grid">
        {nominees.length === 0 ? (
          <div className="no-nominees">
            No nominees available yet. Please check back later.
          </div>
        ) : (
          nominees.map((nominee) => (
            <div key={nominee.id} className="nominee-card">
              <div className="nominee-header">
                <h3>{nominee.name}</h3>
                <div className="vote-count">
                  <span className="count">{nominee.voteCount}</span>
                  <span className="label">votes</span>
                </div>
              </div>
              <p className="nominee-description">{nominee.description}</p>
              
              <button
                onClick={() => {
                  setSelectedNominee(nominee.id);
                  handleVote(nominee.id);
                }}
                disabled={!votingOpen || hasVoted || voting}
                className={`btn-vote ${selectedNominee === nominee.id && voting ? 'voting' : ''}`}
              >
                {selectedNominee === nominee.id && voting 
                  ? 'Processing...' 
                  : hasVoted 
                  ? 'Already Voted' 
                  : 'Vote'}
              </button>
            </div>
          ))
        )}
      </div>

      <div className="voting-info">
        <h3>Important Information:</h3>
        <ul>
          <li>You can only vote once</li>
          <li>Your vote is recorded on the blockchain and cannot be changed</li>
          <li>All transactions are transparent and verifiable</li>
          <li>Make sure you're connected to the correct network (Ganache)</li>
        </ul>
      </div>
    </div>
  );
};

export default Voting;
