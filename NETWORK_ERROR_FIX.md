# How to Fix "Network error - cannot reach server"

## Quick Fix Steps:

### Step 1: Start Backend Server

Open a **NEW terminal** window and run:

```bash
cd Backend
npm run dev
```

**OR** double-click `Backend/start.bat` (Windows) or `Backend/start.sh` (Mac/Linux)

You should see:

```
[DB] ✓ MongoDB connected successfully
CampusLink backend listening on http://localhost:4000
```

### Step 2: Verify Backend is Running

Open another terminal and test:

```bash
curl http://localhost:4000/health
```

Should return: `{"ok":true,"uptime":...}`

### Step 3: Restart Frontend

```bash
cd CampusLink-main
npx expo start --clear
```

Then press:

- `w` for Web browser (uses localhost:4000)
- `a` for Android emulator (uses 10.0.2.2:4000)
- `i` for iOS simulator (uses localhost:4000)

## Platform-Specific Fixes:

### Testing on WEB (Browser):

✅ Backend URL: `http://localhost:4000`
✅ Works automatically - no changes needed

### Testing on ANDROID Emulator:

✅ Backend URL: `http://10.0.2.2:4000` (maps to your PC's localhost)
✅ Works automatically - no changes needed

### Testing on iOS Simulator:

✅ Backend URL: `http://localhost:4000`
✅ Works automatically - no changes needed

### Testing on PHYSICAL DEVICE:

⚠️ Requires your computer's IP address

1. Find your IP:

   ```bash
   # Windows
   ipconfig
   # Look for "IPv4 Address" (e.g., 192.168.1.100)

   # Mac/Linux
   ifconfig
   # Look for "inet" address
   ```

2. Update `CampusLink-main/app.json`:

   ```json
   "extra": {
     "apiBase": "http://YOUR_IP_HERE:4000"
   }
   ```

3. Restart Expo:
   ```bash
   npx expo start --clear
   ```

## Common Issues:

### Issue 1: "Port 4000 already in use"

```bash
# Windows
netstat -ano | findstr :4000
taskkill /PID [PID_NUMBER] /F

# Mac/Linux
lsof -ti:4000 | xargs kill -9
```

### Issue 2: MongoDB not running

```bash
# Windows
net start MongoDB

# Mac
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### Issue 3: Firewall blocking connection

- Windows: Allow Node.js through Windows Firewall
- Mac: System Preferences > Security > Firewall > Allow Node
- Antivirus: Temporarily disable or add exception for localhost:4000

## Verify Everything is Working:

1. **Backend logs show**:

   ```
   [DB] ✓ MongoDB connected successfully
   CampusLink backend listening on http://localhost:4000
   ```

2. **Frontend logs show** (in Metro bundler):

   ```
   [API] Using API base URL: http://localhost:4000
   [API] Platform: web (or android/ios)
   [API] ✓ Backend connection successful
   ```

3. **When you try to register**, backend logs show:
   ```
   [Auth] Registration request received
   [Auth] Step 1: Checking if user exists
   [Auth] Step 2: Hashing password
   [Auth] Step 3: Creating user document
   [Auth] ✓ Registration completed successfully in XXXms
   ```

## Still Not Working?

1. Make sure BOTH terminals are open:

   - Terminal 1: `cd Backend && npm run dev` (MUST keep running)
   - Terminal 2: `cd CampusLink-main && npx expo start`

2. Check both terminal outputs for errors

3. Try registration again and watch BOTH terminals

4. The error message in the app will now tell you exactly what's wrong:
   - "Network error - cannot reach server at http://localhost:4000" = Backend not running
   - "Request timeout" = Backend too slow (check MongoDB)
   - "Email already registered" = User exists (success! backend is working)

## Test Connection Manually:

In the frontend, before registering, check the console logs:

- Should see: `[API] Using API base URL: http://localhost:4000`
- Should see: `[API] ✓ Backend connection successful`

If you see: `[API] ✗ Cannot connect to backend` - Backend is not running!
