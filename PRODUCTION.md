# Production Deployment Guide

## ⚠️ Important Security Considerations

This guide covers deploying the Decentralized Voting System to a production environment. Please review all security considerations before deployment.

---

## Prerequisites for Production

### 1. Infrastructure
- [ ] Domain name and SSL certificate
- [ ] Cloud hosting (AWS, Azure, DigitalOcean, etc.)
- [ ] Database for backend services
- [ ] Email/SMS service provider
- [ ] CDN for frontend assets

### 2. Blockchain
- [ ] Ethereum testnet account (Goerli, Sepolia)
- [ ] ETH for gas fees
- [ ] Infura or Alchemy account for node access
- [ ] Etherscan API key for verification

### 3. Security
- [ ] Aadhar API credentials (from UIDAI)
- [ ] OAuth/Auth0 setup
- [ ] Rate limiting service
- [ ] DDoS protection
- [ ] WAF (Web Application Firewall)

---

## Backend Setup

### 1. Create Express Backend

\`\`\`bash
mkdir backend
cd backend
npm init -y
npm install express cors dotenv axios helmet rate-limit
\`\`\`

### 2. Implement Aadhar Verification API

Create `backend/routes/aadhar.js`:

\`\`\`javascript
const express = require('express');
const router = express.Router();
const axios = require('axios');

// Real Aadhar API integration
router.post('/send-otp', async (req, res) => {
  const { aadharNumber } = req.body;
  
  try {
    // Call actual UIDAI API
    const response = await axios.post(
      process.env.UIDAI_API_URL + '/send-otp',
      { aadhaar_number: aadharNumber },
      { headers: { 'Authorization': \`Bearer \${process.env.UIDAI_API_KEY}\` }}
    );
    
    res.json({ success: true, txnId: response.data.txn_id });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Failed to send OTP' });
  }
});

router.post('/verify-otp', async (req, res) => {
  const { txnId, otp } = req.body;
  
  try {
    // Verify OTP with UIDAI
    const response = await axios.post(
      process.env.UIDAI_API_URL + '/verify-otp',
      { txn_id: txnId, otp: otp },
      { headers: { 'Authorization': \`Bearer \${process.env.UIDAI_API_KEY}\` }}
    );
    
    res.json({ 
      success: true, 
      verified: response.data.status === 'success',
      uid_hash: response.data.uid_hash
    });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Invalid OTP' });
  }
});

module.exports = router;
\`\`\`

### 3. Environment Variables

Create `backend/.env`:

\`\`\`env
# Server
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com

# Aadhar API (UIDAI)
UIDAI_API_URL=https://api.uidai.gov.in/v2
UIDAI_API_KEY=your_actual_api_key
UIDAI_LICENSE_KEY=your_license_key

# Blockchain
INFURA_API_KEY=your_infura_key
PRIVATE_KEY=your_deployment_private_key
CONTRACT_ADDRESS=deployed_contract_address

# Database
DATABASE_URL=postgresql://user:password@host:5432/dbname

# Security
JWT_SECRET=your_jwt_secret_key
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
\`\`\`

---

## Smart Contract Deployment to Testnet

### 1. Update Hardhat Config

\`\`\`javascript
require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

module.exports = {
  solidity: "0.8.19",
  networks: {
    goerli: {
      url: \`https://goerli.infura.io/v3/\${process.env.INFURA_API_KEY}\`,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 5
    },
    sepolia: {
      url: \`https://sepolia.infura.io/v3/\${process.env.INFURA_API_KEY}\`,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 11155111
    },
    mainnet: {
      url: \`https://mainnet.infura.io/v3/\${process.env.INFURA_API_KEY}\`,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 1
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  }
};
\`\`\`

### 2. Deploy to Testnet

\`\`\`bash
# Deploy to Goerli
npx hardhat run scripts/deploy.js --network goerli

# Deploy to Sepolia
npx hardhat run scripts/deploy.js --network sepolia
\`\`\`

### 3. Verify Contract on Etherscan

\`\`\`bash
npx hardhat verify --network goerli DEPLOYED_CONTRACT_ADDRESS
\`\`\`

---

## Frontend Production Build

### 1. Update Environment Variables

Create `src/config/production.js`:

\`\`\`javascript
export const config = {
  apiUrl: 'https://api.yourdomain.com',
  contractAddress: 'YOUR_DEPLOYED_CONTRACT_ADDRESS',
  networkId: 5, // Goerli
  networkName: 'Goerli Test Network',
  rpcUrl: 'https://goerli.infura.io/v3/YOUR_INFURA_KEY',
  blockExplorer: 'https://goerli.etherscan.io'
};
\`\`\`

### 2. Build for Production

\`\`\`bash
npm run build
\`\`\`

### 3. Deploy to CDN/Hosting

#### Option A: AWS S3 + CloudFront
\`\`\`bash
aws s3 sync dist/ s3://your-bucket-name
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
\`\`\`

#### Option B: Netlify
\`\`\`bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
\`\`\`

#### Option C: Vercel
\`\`\`bash
npm install -g vercel
vercel --prod
\`\`\`

---

## Security Hardening

### 1. Smart Contract Security Audit

Before mainnet deployment:
- [ ] Run Slither static analyzer
- [ ] Run Mythril security scanner
- [ ] Professional audit by certified firm
- [ ] Bug bounty program

\`\`\`bash
# Install security tools
npm install -g @crytic/mythril slither-analyzer

# Run analysis
slither contracts/VotingSystem.sol
myth analyze contracts/VotingSystem.sol
\`\`\`

### 2. Frontend Security

Add security headers in `webpack.config.js`:

\`\`\`javascript
devServer: {
  headers: {
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';",
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin'
  }
}
\`\`\`

### 3. Backend Security

Implement in `backend/server.js`:

\`\`\`javascript
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
\`\`\`

---

## Monitoring and Analytics

### 1. Contract Events Monitoring

\`\`\`javascript
// Monitor blockchain events
contract.on('VoteCast', (voter, nomineeId) => {
  console.log(\`Vote cast: \${voter} voted for \${nomineeId}\`);
  // Send to analytics
  analytics.track('vote_cast', { voter, nomineeId });
});
\`\`\`

### 2. Error Tracking

\`\`\`bash
npm install @sentry/react @sentry/tracing
\`\`\`

### 3. Performance Monitoring

- Google Analytics / Mixpanel
- Blockchain explorer integration
- Real-time dashboard for admin

---

## Backup and Recovery

### 1. Contract State Backup

Create regular snapshots of:
- All nominees
- Registered voters
- Vote counts
- Transaction history

### 2. Database Backups

\`\`\`bash
# Automated daily backups
0 2 * * * pg_dump votingdb > backup_$(date +\%Y\%m\%d).sql
\`\`\`

---

## Compliance and Legal

### Required Documentation

1. **Privacy Policy**
   - Data collection and usage
   - Blockchain data permanence
   - User rights (GDPR compliance)

2. **Terms of Service**
   - Voting eligibility
   - Account responsibilities
   - Dispute resolution

3. **Aadhar Data Handling**
   - Compliance with UIDAI guidelines
   - Data minimization
   - Secure storage requirements

---

## Cost Estimation

### Monthly Costs (Approximate)

- **Hosting (AWS/Azure)**: $50-200
- **Infura/Alchemy**: $50-100
- **SSL Certificate**: $0-100
- **Aadhar API**: Variable (based on usage)
- **Monitoring Tools**: $0-50
- **Gas Fees (Testnet)**: ~$0
- **Gas Fees (Mainnet)**: $500-2000/month

**Total Estimated**: $650-2500/month

---

## Maintenance Checklist

### Daily
- [ ] Monitor transaction success rate
- [ ] Check error logs
- [ ] Verify API uptime

### Weekly
- [ ] Review gas usage
- [ ] Audit access logs
- [ ] Check for security vulnerabilities

### Monthly
- [ ] Smart contract upgrade review
- [ ] Performance optimization
- [ ] Cost analysis and optimization
- [ ] Backup verification

---

## Emergency Procedures

### Contract Pause Mechanism

Add to smart contract:

\`\`\`solidity
bool public paused = false;

modifier whenNotPaused() {
    require(!paused, "Contract is paused");
    _;
}

function pause() public onlyAdmin {
    paused = true;
}

function unpause() public onlyAdmin {
    paused = false;
}
\`\`\`

### Incident Response Plan

1. Detect issue
2. Pause contract if necessary
3. Notify stakeholders
4. Investigate root cause
5. Deploy fix
6. Resume operations
7. Post-mortem report

---

## Support and Maintenance

### User Support Channels
- Email: support@yourdomain.com
- Help Center: help.yourdomain.com
- Live Chat: During voting periods

### Technical Support
- DevOps on-call rotation
- 24/7 monitoring
- Automated alerts for critical issues

---

## Next Steps After Production

1. ✅ Monitor initial voting cycle
2. ✅ Gather user feedback
3. ✅ Optimize gas usage
4. ✅ Scale infrastructure based on load
5. ✅ Plan feature enhancements
6. ✅ Consider mainnet migration

---

**Remember**: Never rush production deployment. Test thoroughly on testnet first!
