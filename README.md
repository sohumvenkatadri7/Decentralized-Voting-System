# Decentralized Voting System

A blockchain-based voting application built with React, Solidity, and Ethereum. This system provides secure, transparent, and tamper-proof voting with Aadhar verification and MetaMask wallet integration.

## Features

### 🔐 Security
- **Aadhar Card Verification**: Two-factor authentication with OTP
- **MetaMask Wallet**: Blockchain-based identity verification
- **Smart Contract**: Immutable voting records on Ethereum blockchain

### 👥 User Roles
- **Voters**: Can view nominees and cast one vote
- **Admin**: Can add nominees, register voters, and control voting status

### ⚡ Functionality
- Add and manage nominees
- Register voters with Aadhar verification
- Real-time vote counting
- Transparent results display
- Open/Close voting periods

## Tech Stack

- **Frontend**: React 18, React Router
- **Blockchain**: Ethereum, Solidity 0.8.19
- **Web3**: Ethers.js v6
- **Development**: Hardhat, Ganache
- **Build Tools**: Webpack 5, Babel

## Prerequisites

Before you begin, ensure you have the following installed:

1. **Node.js** (v16 or higher)
   - Download from: https://nodejs.org/

2. **MetaMask Browser Extension**
   - Chrome: https://chrome.google.com/webstore
   - Firefox: https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/

3. **Ganache** (Ethereum Local Blockchain)
   - Download from: https://trufflesuite.com/ganache/

## Installation

### 1. Clone the Repository
\`\`\`bash
git clone https://github.com/sohumvenkatadri7/Decentralized-Voting-System.git
cd Decentralized-Voting-System
\`\`\`

### 2. Install Dependencies
\`\`\`bash
npm install
\`\`\`

## Setup Instructions

### 1. Configure Ganache

1. Open Ganache and create a new workspace
2. Configure the following settings:
   - **Server**: HTTP://127.0.0.1:7545
   - **Port**: 7545
   - **Network ID**: 1337
   - **Gas Limit**: 6721975
   - **Gas Price**: 20000000000

3. Save and start the workspace

### 2. Configure Hardhat

Edit `hardhat.config.js` and add your Ganache account private keys:

\`\`\`javascript
networks: {
  development: {
    url: "http://127.0.0.1:7545",
    accounts: [
      "YOUR_GANACHE_PRIVATE_KEY_1",
      "YOUR_GANACHE_PRIVATE_KEY_2",
      // Add more accounts as needed
    ],
    chainId: 1337
  }
}
\`\`\`

**To get private keys from Ganache:**
- Click on the key icon next to any account
- Copy the private key

### 3. Configure MetaMask

1. Open MetaMask and click on the network dropdown
2. Select "Add Network" or "Custom RPC"
3. Enter the following details:
   - **Network Name**: Ganache
   - **New RPC URL**: http://127.0.0.1:7545
   - **Chain ID**: 1337
   - **Currency Symbol**: ETH

4. Import Ganache accounts into MetaMask:
   - Click on account icon → Import Account
   - Paste the private key from Ganache
   - Import at least 2 accounts (one for admin, one for voter)

### 4. Set Admin Address

After importing accounts, set the admin address in localStorage:

1. Open browser console (F12)
2. Run: `localStorage.setItem('adminAddress', 'YOUR_ADMIN_WALLET_ADDRESS')`
3. Replace with the first account address from MetaMask

## Deployment

### 1. Compile Smart Contract
\`\`\`bash
npm run compile
\`\`\`

### 2. Deploy to Ganache
\`\`\`bash
npm run deploy
\`\`\`

This will:
- Deploy the VotingSystem contract to Ganache
- Save the contract address and ABI to `src/contracts/`
- Display the deployed contract address

**Important**: Keep the contract address safe. You'll need it for interacting with the contract.

### 3. Start the Development Server
\`\`\`bash
npm start
\`\`\`

The application will open at `http://localhost:3000`

## Usage Guide

### For Admin

1. **Login**
   - Enter Aadhar number (12 digits)
   - Enter OTP (6 digits)
   - Connect MetaMask wallet (use admin account)

2. **Register Voters**
   - Go to Admin Dashboard
   - Enter voter's wallet address
   - Enter Aadhar hash
   - Click "Register Voter"

3. **Add Nominees**
   - Enter nominee name
   - Enter description
   - Click "Add Nominee"

4. **Control Voting**
   - Click "Open Voting" to start
   - Click "Close Voting" to end
   - View real-time results

### For Voters

1. **Login**
   - Enter Aadhar number
   - Verify with OTP
   - Connect MetaMask wallet (use voter account)

2. **Vote**
   - View all nominees
   - Click "Vote" on your preferred nominee
   - Confirm transaction in MetaMask
   - Vote is recorded on blockchain

## Project Structure

\`\`\`
Decentralized-Voting-System/
├── contracts/
│   └── VotingSystem.sol          # Solidity smart contract
├── scripts/
│   └── deploy.js                 # Deployment script
├── src/
│   ├── components/
│   │   ├── Login.js              # Login page component
│   │   ├── Login.css
│   │   ├── Voting.js             # Voting page component
│   │   ├── Voting.css
│   │   ├── Admin.js              # Admin dashboard component
│   │   └── Admin.css
│   ├── utils/
│   │   └── web3Utils.js          # Web3 utility functions
│   ├── contracts/                # Generated contract files
│   │   ├── contract-address.json
│   │   └── VotingSystem.json
│   ├── App.js                    # Main app component
│   ├── App.css
│   └── index.js                  # Entry point
├── public/
│   └── index.html
├── hardhat.config.js             # Hardhat configuration
├── webpack.config.js             # Webpack configuration
├── package.json
└── README.md
\`\`\`

## Smart Contract Functions

### Admin Functions
- `addNominee(name, description)`: Add a new nominee
- `toggleVoting()`: Open/close voting
- `registerVoter(address, aadharHash)`: Register a voter

### Voter Functions
- `vote(nomineeId)`: Cast a vote

### View Functions
- `getNominee(id)`: Get nominee details
- `getAllNominees()`: Get all nominees
- `getVoterInfo(address)`: Get voter information
- `isAdmin(address)`: Check if address is admin
- `getVotingStatus()`: Check if voting is open
- `getTotalVotes()`: Get total votes cast

## Troubleshooting

### MetaMask Connection Issues
- Ensure you're connected to Ganache network
- Check that Ganache is running on port 7545
- Try resetting MetaMask account (Settings → Advanced → Reset Account)

### Contract Deployment Failed
- Check Ganache is running
- Verify private keys in hardhat.config.js
- Ensure you have enough ETH in the deploying account

### Transaction Failed
- Check if voting is open (for voters)
- Verify you're using the admin account (for admin functions)
- Ensure you haven't voted already
- Check gas settings in MetaMask

### React App Not Loading
- Run `npm install` again
- Delete `node_modules` and `package-lock.json`, then reinstall
- Check browser console for errors

## Security Considerations

⚠️ **Important**: This is a demonstration project. For production use:

1. Implement real Aadhar API integration
2. Add proper backend authentication
3. Use environment variables for sensitive data
4. Implement rate limiting
5. Add comprehensive error handling
6. Conduct security audits
7. Use testnets before mainnet deployment

## Future Enhancements

- [ ] Real Aadhar API integration
- [ ] Email/SMS notifications
- [ ] Vote receipt generation
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Mobile responsive improvements
- [ ] IPFS integration for nominee data
- [ ] Zero-knowledge proofs for voter privacy

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

ISC License

## Contact

For questions or support, please open an issue on GitHub.

---

**Built with ❤️ for transparent and secure voting**
