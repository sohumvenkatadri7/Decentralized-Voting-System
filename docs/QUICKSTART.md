# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 0: First Build (30 seconds)
The app will build successfully even before deploying the contract. Placeholder files prevent any warnings.

```powershell
npm start
```

You can start the dev server now to see the UI, but you'll need to deploy the contract for full functionality.

### Step 1: Install Dependencies (1 min)
\`\`\`powershell
npm install
\`\`\`

### Step 2: Start Ganache (1 min)
1. Open Ganache application
2. Click "Quickstart" or create new workspace
3. Note the RPC Server URL (should be http://127.0.0.1:7545)

### Step 3: Deploy Smart Contract (1 min)
\`\`\`powershell
npm run compile
npm run deploy
\`\`\`

**Expected Output:**
\`\`\`
Deploying VotingSystem contract...
VotingSystem deployed to: 0x... (contract address)
Contract address and ABI saved to src/contracts/
\`\`\`

### Step 4: Configure MetaMask (1 min)
1. Add Ganache Network:
   - Network Name: **Ganache**
   - RPC URL: **http://127.0.0.1:7545**
   - Chain ID: **1337**
   - Currency: **ETH**

2. Import Accounts:
   - Copy private key from Ganache (click key icon)
   - MetaMask → Import Account → Paste key
   - Import 2 accounts (admin & voter)

3. Set Admin Address:
   - Open browser console (F12)
   - Run: \`localStorage.setItem('adminAddress', 'YOUR_FIRST_ACCOUNT_ADDRESS')\`

### Step 5: Start Application (1 min)
\`\`\`powershell
npm start
\`\`\`

Application opens at: **http://localhost:3000**

---

## 🎯 Testing the Application

### Test as Admin:
1. Login with any Aadhar (e.g., 123456789012)
2. Use any OTP (e.g., 123456)
3. Connect with **admin wallet** (first imported account)
4. Add nominees and register voters
5. Open voting

### Test as Voter:
1. Logout (or use incognito window)
2. Login with different Aadhar
3. Connect with **voter wallet** (second imported account)
4. View nominees and cast vote

---

## ⚠️ Common Issues

### Issue: "Contract not deployed"
**Solution:** Run `npm run deploy` first

### Issue: "Wrong network"
**Solution:** Switch to Ganache network in MetaMask

### Issue: "Transaction failed"
**Solution:** 
- Check if voting is open (for voters)
- Verify you're using correct account (admin vs voter)
- Reset MetaMask account if needed

---

## 📝 Sample Test Data

### Nominees:
1. **Alice Johnson** - "Experienced leader with 10 years in public service"
2. **Bob Smith** - "Young innovator focused on digital transformation"
3. **Carol White** - "Community activist with grassroots support"

### Test Aadhar Numbers:
- 123456789012
- 987654321098
- 555555555555

### Test OTP:
- 123456 (any 6 digits work in demo mode)

---

## 🎉 Next Steps

After setup:
1. ✅ Register multiple voters from admin panel
2. ✅ Add several nominees
3. ✅ Open voting
4. ✅ Cast votes from different accounts
5. ✅ Check real-time results
6. ✅ Close voting

---

**Need help?** Check README.md for detailed documentation.
