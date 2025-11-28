# Port Already in Use - Quick Fix

## Error Message
```
Error: listen EADDRINUSE: address already in use :::3000
```

## What This Means
Port 3000 is already being used by another process (usually a previous instance of the dev server).

---

## ✅ Quick Fix (Windows PowerShell)

### Option 1: Kill All Node Processes
```powershell
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
```

Then restart:
```powershell
npm start
```

### Option 2: Kill Specific Port
```powershell
# Find what's using port 3000
netstat -ano | findstr :3000

# Kill the process (replace PID with the number from above)
taskkill /PID <PID> /F
```

### Option 3: Use Different Port
Edit `webpack.config.js` and change the port:
```javascript
devServer: {
  port: 3001,  // Change from 3000 to 3001
  // ... rest of config
}
```

---

## ✅ Quick Fix (Mac/Linux)

### Option 1: Kill Process on Port 3000
```bash
# Find and kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Option 2: Kill All Node Processes
```bash
killall node
```

Then restart:
```bash
npm start
```

---

## Prevention

Always stop the dev server properly:
- Press `Ctrl + C` in the terminal
- Wait for "Server stopped" message
- Then close the terminal

---

## Verification

After running the fix, you should see:
```
✔ webpack-dev-server: Project is running at:
✔ http://localhost:3000/
```

Your browser should automatically open to `http://localhost:3000`

---

**Issue Resolved!** ✅
