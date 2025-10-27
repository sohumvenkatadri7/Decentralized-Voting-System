import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Voting from './components/Voting';
import Admin from './components/Admin';
import AdminSetup from './components/AdminSetup';
import { connectWallet, getContract, listenToAccountChanges, listenToChainChanges } from './utils/web3Utils';
import './App.css';

function App() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState(null); // 'admin' or 'voter'
  const [showAdminSetup, setShowAdminSetup] = useState(false);

  useEffect(() => {
    // Check if admin address is set
    const adminAddress = localStorage.getItem('adminAddress');
    if (!adminAddress) {
      setShowAdminSetup(true);
    }

    // Listen to account changes
    listenToAccountChanges((newAccount) => {
      if (newAccount) {
        setAccount(newAccount);
      } else {
        // User disconnected wallet
        setAccount(null);
        setContract(null);
        setUserRole(null);
      }
    });

    // Listen to chain changes
    listenToChainChanges((chainId) => {
      // Reload page on network change
      window.location.reload();
    });
  }, []);

  const web3Handler = async () => {
    try {
      setLoading(true);
      
      const { signer, account: walletAccount } = await connectWallet();
      setAccount(walletAccount);
      
      const contractInstance = getContract(signer);
      setContract(contractInstance);
      
      setLoading(false);
    } catch (error) {
      console.error('Error connecting to wallet:', error);
      alert(error.message);
      setLoading(false);
    }
  };

  return (
    <Router>
      <div className="App">
        {showAdminSetup && (
          <AdminSetup onComplete={() => setShowAdminSetup(false)} />
        )}
        
        <Routes>
          <Route 
            path="/" 
            element={
              <Login 
                web3Handler={web3Handler} 
                account={account} 
                setUserRole={setUserRole}
              />
            } 
          />
          <Route 
            path="/voting" 
            element={
              account && contract ? (
                <Voting contract={contract} account={account} />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          <Route 
            path="/admin" 
            element={
              account && contract ? (
                <Admin contract={contract} account={account} />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
