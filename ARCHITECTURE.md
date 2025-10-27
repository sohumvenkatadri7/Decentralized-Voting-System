# System Architecture

## Overview Diagram

\`\`\`
┌─────────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE LAYER                         │
│                         (React Frontend)                             │
├──────────────┬───────────────────┬──────────────────┬───────────────┤
│  Login Page  │   Voting Page     │   Admin Page     │   Routing     │
│              │                   │                  │               │
│ - Aadhar     │ - View Nominees   │ - Add Nominees   │ - Protected   │
│   Verify     │ - Cast Vote       │ - Register       │   Routes      │
│ - MetaMask   │ - View Results    │   Voters         │ - Role-based  │
│   Connect    │                   │ - Control Voting │   Access      │
└──────────────┴───────────────────┴──────────────────┴───────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       WEB3 INTEGRATION LAYER                         │
│                         (Ethers.js v6)                               │
├──────────────────────────────────────────────────────────────────────┤
│  • Wallet Connection (MetaMask)                                      │
│  • Contract Instance Creation                                        │
│  • Transaction Signing                                               │
│  • Event Listening                                                   │
│  • Network Management                                                │
└──────────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      BLOCKCHAIN LAYER                                │
│                  (Ethereum Smart Contract)                           │
├──────────────────────────────────────────────────────────────────────┤
│  VotingSystem.sol                                                    │
│                                                                      │
│  State Variables:                                                    │
│  • admin (address)                                                   │
│  • nominees (mapping)                                                │
│  • voters (mapping)                                                  │
│  • votingOpen (bool)                                                 │
│  • totalVotes (uint256)                                              │
│                                                                      │
│  Functions:                                                          │
│  • addNominee()                                                      │
│  • registerVoter()                                                   │
│  • vote()                                                            │
│  • toggleVoting()                                                    │
│  • getAllNominees()                                                  │
│  • getVoterInfo()                                                    │
└──────────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      ETHEREUM NETWORK                                │
│                     (Ganache / Testnet)                              │
├──────────────────────────────────────────────────────────────────────┤
│  • RPC Server: http://127.0.0.1:7545                                 │
│  • Chain ID: 1337                                                    │
│  • Gas Price: 20 Gwei                                                │
│  • Block Time: ~0s (instant)                                         │
└──────────────────────────────────────────────────────────────────────┘
\`\`\`

---

## User Flow Diagrams

### Admin Flow

\`\`\`
┌─────────────┐
│   Start     │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│ Login Page      │
│ • Enter Aadhar  │
│ • Verify OTP    │
└──────┬──────────┘
       │
       ▼
┌────────────────────┐
│ Connect MetaMask   │
│ • Select Admin A/C │
└──────┬─────────────┘
       │
       ▼
┌────────────────────┐      ┌──────────────────┐
│ Admin Dashboard    │──────▶│ Add Nominee      │
│                    │      │ • Name           │
│ • View Stats       │      │ • Description    │
│ • Manage Voting    │      └──────────────────┘
│ • View Results     │
└──────┬─────────────┘      ┌──────────────────┐
       │                    │ Register Voter   │
       └────────────────────▶│ • Wallet Address │
                             │ • Aadhar Hash    │
                             └──────────────────┘
                             
                             ┌──────────────────┐
                             │ Control Voting   │
                             │ • Open Voting    │
                             │ • Close Voting   │
                             └──────────────────┘
\`\`\`

### Voter Flow

\`\`\`
┌─────────────┐
│   Start     │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│ Login Page      │
│ • Enter Aadhar  │
│ • Verify OTP    │
└──────┬──────────┘
       │
       ▼
┌────────────────────┐
│ Connect MetaMask   │
│ • Select Voter A/C │
└──────┬─────────────┘
       │
       ▼
┌────────────────────┐
│ Voting Page        │
│                    │
│ Check Status:      │
│ • Voting Open?     │
│ • Already Voted?   │
└──────┬─────────────┘
       │
       ▼
┌────────────────────┐
│ View Nominees      │
│ • Name             │
│ • Description      │
│ • Current Votes    │
└──────┬─────────────┘
       │
       ▼
┌────────────────────┐
│ Cast Vote          │
│ • Select Nominee   │
│ • Confirm TX       │
└──────┬─────────────┘
       │
       ▼
┌────────────────────┐
│ Vote Recorded      │
│ • Transaction Hash │
│ • Block Number     │
└────────────────────┘
\`\`\`

---

## Component Interaction

\`\`\`
┌──────────────────────────────────────────────────────────────┐
│                         App.js                                │
│  • Manages Web3 Connection                                    │
│  • Holds Contract Instance                                    │
│  • Manages User Account                                       │
│  • Handles Routing                                            │
└──────────┬───────────────────────────┬───────────────────────┘
           │                           │
           ▼                           ▼
┌──────────────────┐      ┌──────────────────┐
│   Login.js       │      │  web3Utils.js    │
│                  │      │                  │
│ Props:           │      │ Functions:       │
│ • web3Handler    │◀─────┤ • connectWallet  │
│ • account        │      │ • getContract    │
│ • setUserRole    │      │ • switchNetwork  │
└──────────────────┘      └──────────────────┘
           │
           │ (after login)
           │
     ┌─────┴──────┐
     │            │
     ▼            ▼
┌─────────┐  ┌─────────┐
│Voting.js│  │Admin.js │
│         │  │         │
│Props:   │  │Props:   │
│• contract│  │• contract│
│• account│  │• account│
└─────────┘  └─────────┘
\`\`\`

---

## Data Flow

### Vote Casting Flow

\`\`\`
User Action                  Frontend                Smart Contract           Blockchain
     │                          │                          │                      │
     │  Click "Vote"            │                          │                      │
     ├─────────────────────────▶│                          │                      │
     │                          │  contract.vote(id)       │                      │
     │                          ├─────────────────────────▶│                      │
     │                          │                          │  Validate:           │
     │                          │                          │  • Voting open?      │
     │                          │                          │  • Registered?       │
     │                          │                          │  • Not voted?        │
     │                          │                          │  • Valid nominee?    │
     │                          │                          │                      │
     │  MetaMask Popup          │                          │                      │
     │◀─────────────────────────┤                          │                      │
     │                          │                          │                      │
     │  Confirm Transaction     │                          │                      │
     ├─────────────────────────▶│                          │                      │
     │                          │  Send Transaction        │                      │
     │                          ├─────────────────────────▶│                      │
     │                          │                          │  Update State:       │
     │                          │                          │  • Mark voted        │
     │                          │                          │  • Increment count   │
     │                          │                          │  • Emit event        │
     │                          │                          ├─────────────────────▶│
     │                          │                          │                      │
     │                          │  Transaction Receipt     │  Block Mined         │
     │                          │◀─────────────────────────┤◀─────────────────────┤
     │  Success Message         │                          │                      │
     │◀─────────────────────────┤                          │                      │
     │                          │                          │                      │
\`\`\`

---

## State Management

### Contract State

\`\`\`
VotingSystem Contract State
├── admin: address
│   └── Immutable after deployment
│
├── nominees: mapping(uint256 => Nominee)
│   ├── nominee[1]: { id, name, description, voteCount, exists }
│   ├── nominee[2]: { id, name, description, voteCount, exists }
│   └── ...
│
├── voters: mapping(address => Voter)
│   ├── voter[0x123...]: { hasVoted, votedNomineeId, isRegistered, aadharHash }
│   ├── voter[0x456...]: { hasVoted, votedNomineeId, isRegistered, aadharHash }
│   └── ...
│
├── nomineeCount: uint256
│   └── Increments with each new nominee
│
├── totalVotes: uint256
│   └── Increments with each vote cast
│
└── votingOpen: bool
    └── Toggles on/off by admin
\`\`\`

### Frontend State (React)

\`\`\`
App.js State
├── account: string | null
│   └── Current connected wallet address
│
├── contract: Contract | null
│   └── Ethers.js contract instance
│
├── loading: boolean
│   └── Web3 connection status
│
└── userRole: 'admin' | 'voter' | null
    └── Current user's role

Login.js State
├── aadharNumber: string
├── otp: string
├── showOtpInput: boolean
├── isVerified: boolean
└── error: string

Voting.js State
├── nominees: Nominee[]
├── loading: boolean
├── voting: boolean
├── hasVoted: boolean
├── votingOpen: boolean
└── error: string

Admin.js State
├── nominees: Nominee[]
├── loading: boolean
├── votingOpen: boolean
├── totalVotes: number
├── nomineeName: string
├── nomineeDescription: string
├── voterAddress: string
└── aadharHash: string
\`\`\`

---

## Security Architecture

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                    Security Layers                           │
└─────────────────────────────────────────────────────────────┘

Layer 1: User Authentication
├── Aadhar Verification (OTP)
└── MetaMask Wallet Signature

Layer 2: Smart Contract Security
├── Access Control (onlyAdmin modifier)
├── State Validation (votingIsOpen modifier)
├── Input Validation (require statements)
└── Reentrancy Protection (state changes before external calls)

Layer 3: Blockchain Security
├── Immutable Transactions
├── Transparent Ledger
├── Decentralized Consensus
└── Cryptographic Signatures

Layer 4: Network Security
├── HTTPS/TLS Encryption
├── MetaMask Secure Connection
└── RPC Endpoint Protection
\`\`\`

---

## Development Workflow

\`\`\`
┌──────────────┐
│ Write Code   │
│ • Solidity   │
│ • React      │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Compile      │
│ npx hardhat  │
│ compile      │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Test         │
│ npx hardhat  │
│ test         │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Deploy       │
│ Local/       │
│ Testnet      │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Build        │
│ Frontend     │
│ npm run      │
│ build        │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Test E2E     │
│ Manual/      │
│ Automated    │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Deploy       │
│ Production   │
└──────────────┘
\`\`\`

---

## Technology Stack

\`\`\`
Frontend
├── React 18.2.0
├── React Router 6.20.0
├── Ethers.js 6.9.0
├── Webpack 5.89.0
└── Babel 7.23.5

Smart Contract
├── Solidity 0.8.19
├── Hardhat 2.19.2
└── OpenZeppelin (optional)

Blockchain
├── Ganache (Development)
├── Goerli/Sepolia (Testing)
└── Ethereum Mainnet (Production)

Development Tools
├── Node.js 16+
├── npm/yarn
├── MetaMask
└── VS Code
\`\`\`

---

This architecture provides:
✅ Scalability
✅ Security
✅ Maintainability
✅ User-friendly Experience
✅ Transparent Voting Process
