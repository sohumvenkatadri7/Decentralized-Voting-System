# Setting Admin Address - Complete Guide

## 🎯 Quick Answer

You have **TWO OPTIONS** to set the admin address:

---

## Option 1: Using Browser Console (Manual) ⌨️

### Steps:

1. **Get Admin Address from Ganache**
   - Open Ganache
   - Copy the **first account address** (e.g., `0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1`)

2. **Open Browser Console**
   - Press **F12** on your keyboard
   - OR Right-click → Inspect → Console tab

3. **Run This Command**
   ```javascript
   localStorage.setItem('adminAddress', '0xYourAddressHere')
   ```
   
   **Example:**
   ```javascript
   localStorage.setItem('adminAddress', '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1')
   ```

4. **Verify It Worked**
   ```javascript
   localStorage.getItem('adminAddress')
   ```
   Should return your address.

5. **Refresh the page** (F5)

---

## Option 2: Using Setup Screen (Automatic) 🖱️

**NEW!** The app now shows a setup screen automatically!

### Steps:

1. **Start the App**
   ```bash
   npm start
   ```

2. **Setup Screen Appears**
   - A popup will appear asking for admin address
   - No need to open console!

3. **Enter Admin Address**
   - Copy from Ganache (first account)
   - Paste into the input field
   - Click "Save Admin Address"

4. **Done!**
   - Address is saved automatically
   - App redirects to login

---

## 📸 Visual Guide

### Step 1: Find Address in Ganache
```
┌─────────────────────────────────────────────────┐
│ Ganache - Accounts                              │
├─────────────────────────────────────────────────┤
│ (0) 0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1 │  ← COPY THIS
│     Balance: 100.00 ETH                   🔑    │
│                                                 │
│ (1) 0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65 │
│     Balance: 100.00 ETH                   🔑    │
└─────────────────────────────────────────────────┘
```

### Step 2: Open Browser Console (F12)
```
┌─────────────────────────────────────────────────┐
│ Elements  Console  Sources  Network  ...       │
├─────────────────────────────────────────────────┤
│ >                                               │  ← Type here
│                                                 │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Step 3: Paste Command
```javascript
> localStorage.setItem('adminAddress', '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1')
< undefined  ✓ Success

> localStorage.getItem('adminAddress')
< "0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1"  ✓ Verified
```

---

## 🔧 Troubleshooting

### "I don't see the console"
- **Chrome/Edge**: Press `F12` or `Ctrl + Shift + J`
- **Firefox**: Press `F12` or `Ctrl + Shift + K`
- **Mac**: Press `Cmd + Option + J`

### "Nothing happens when I paste"
1. Make sure you're in the **Console** tab (not Elements)
2. Click inside the console area first
3. Paste and press **Enter**

### "I made a mistake in the address"
```javascript
// Remove the old one
localStorage.removeItem('adminAddress')

// Set the correct one
localStorage.setItem('adminAddress', '0xCorrectAddress')
```

### "How do I know which address is admin?"
- Use the **first account** from Ganache
- This is the account that deployed the contract
- You'll import this into MetaMask as your admin wallet

---

## 🎯 Complete Setup Flow

### 1️⃣ Ganache Setup
```bash
1. Open Ganache
2. Click "Quickstart"
3. Copy FIRST account address: 0x123...abc
```

### 2️⃣ MetaMask Setup
```bash
1. Open MetaMask
2. Import Account
3. Paste private key from Ganache (click 🔑)
4. Repeat for 2nd account (voter)
```

### 3️⃣ Set Admin Address
```bash
Option A: Browser Console
   F12 → Console → localStorage.setItem('adminAddress', '0x123...abc')

Option B: Setup Screen (Automatic)
   Just paste when app prompts you
```

### 4️⃣ Test
```bash
1. Login with Aadhar (123456789012)
2. OTP (123456)
3. Connect MetaMask (admin account)
4. Should go to Admin Dashboard ✓
```

---

## 📋 Quick Reference Commands

### Set Admin
```javascript
localStorage.setItem('adminAddress', '0xYourAddress')
```

### Get Current Admin
```javascript
localStorage.getItem('adminAddress')
```

### Clear Admin (Reset)
```javascript
localStorage.removeItem('adminAddress')
```

### Check if Set
```javascript
localStorage.getItem('adminAddress') ? 'Set ✓' : 'Not Set ✗'
```

---

## 🔄 Changing Admin Address Later

If you need to change the admin address:

### Method 1: Console
```javascript
localStorage.setItem('adminAddress', '0xNewAddress')
location.reload()  // Refresh page
```

### Method 2: Setup Screen
1. Open console
2. Run: `localStorage.removeItem('adminAddress')`
3. Refresh page (F5)
4. Setup screen appears again

---

## 🆘 Still Having Issues?

### Check These:

1. **Is Ganache running?**
   ```
   Ganache should show: RPC Server http://127.0.0.1:7545
   ```

2. **Is the address valid?**
   - Must start with `0x`
   - Must be 42 characters total
   - Only hex characters (0-9, a-f)

3. **Is MetaMask connected to Ganache?**
   - Network: Ganache (Chain ID: 1337)
   - RPC URL: http://127.0.0.1:7545

4. **Did you import the account?**
   - The address in localStorage must match
   - The account imported in MetaMask

---

## ✅ Verification Checklist

Before proceeding, verify:

- [ ] Ganache is running
- [ ] Admin address is copied from Ganache
- [ ] Admin address is set in localStorage
- [ ] Same address is imported in MetaMask
- [ ] MetaMask is on Ganache network
- [ ] Page is refreshed after setting

---

## 🎓 Why Do We Need This?

The admin address determines who can:
- ✅ Add nominees
- ✅ Register voters
- ✅ Open/close voting
- ✅ View all results

Without setting it:
- ❌ Everyone would be treated as a voter
- ❌ No one could add nominees
- ❌ Voting system wouldn't work

---

## 📞 Example Session

```javascript
// Step 1: Check if admin is set
> localStorage.getItem('adminAddress')
< null

// Step 2: Set admin address
> localStorage.setItem('adminAddress', '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1')
< undefined

// Step 3: Verify
> localStorage.getItem('adminAddress')
< "0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1"

// Step 4: Check if it matches your wallet
> ethereum.selectedAddress
< "0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1"

// ✓ They match! You're ready to go!
```

---

**That's it! You're all set!** 🎉

Choose either Option 1 (Console) or Option 2 (Setup Screen) and you'll be ready to use your Decentralized Voting System!
