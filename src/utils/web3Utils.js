import { ethers } from 'ethers';

// Contract imports will be generated after deployment
let contractAddress;
let contractABI;

// Dynamically import contract files if they exist
const loadContractData = () => {
  try {
    // Use dynamic import to avoid webpack warnings
    contractAddress = require('../contracts/contract-address.json').VotingSystem;
    contractABI = require('../contracts/VotingSystem.json').abi;
    return true;
  } catch (error) {
    // Contract not deployed yet - this is normal before running deploy script
    return false;
  }
};

// Try to load contract data
loadContractData();

export const connectWallet = async () => {
  if (typeof window.ethereum === 'undefined') {
    throw new Error('MetaMask is not installed. Please install MetaMask to use this application.');
  }

  try {
    // Request account access
    const accounts = await window.ethereum.request({ 
      method: 'eth_requestAccounts' 
    });

    // Create provider
    const provider = new ethers.BrowserProvider(window.ethereum);
    
    // Get signer
    const signer = await provider.getSigner();
    
    // Get network
    const network = await provider.getNetwork();
    
    // Check if connected to Ganache (chainId 1337)
    if (Number(network.chainId) !== 1337) {
      throw new Error('Please connect to Ganache network (localhost:7545)');
    }

    return {
      provider,
      signer,
      account: accounts[0]
    };
  } catch (error) {
    console.error('Error connecting wallet:', error);
    throw error;
  }
};

export const getContract = (signer) => {
  if (!contractAddress || !contractABI) {
    throw new Error('Contract not deployed. Please run deployment script first.');
  }

  return new ethers.Contract(contractAddress, contractABI, signer);
};

export const switchToGanacheNetwork = async () => {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x539' }], // 1337 in hex
    });
  } catch (switchError) {
    // This error code indicates that the chain has not been added to MetaMask
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: '0x539',
              chainName: 'Ganache',
              rpcUrls: ['http://127.0.0.1:7545'],
              nativeCurrency: {
                name: 'Ethereum',
                symbol: 'ETH',
                decimals: 18
              }
            }
          ]
        });
      } catch (addError) {
        console.error('Error adding Ganache network:', addError);
        throw addError;
      }
    } else {
      throw switchError;
    }
  }
};

export const hashAadhar = (aadharNumber) => {
  // Create a simple hash of Aadhar number for privacy
  return ethers.keccak256(ethers.toUtf8Bytes(aadharNumber));
};

export const listenToAccountChanges = (callback) => {
  if (window.ethereum) {
    window.ethereum.on('accountsChanged', (accounts) => {
      callback(accounts[0] || null);
    });
  }
};

export const listenToChainChanges = (callback) => {
  if (window.ethereum) {
    window.ethereum.on('chainChanged', (chainId) => {
      callback(chainId);
    });
  }
};

export { contractAddress, contractABI };
