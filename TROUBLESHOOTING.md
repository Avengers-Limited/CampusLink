# CampusLink Troubleshooting Guide

## Registration Issues - "Fetching data from frontend is failing"

### Common Problems and Solutions

#### 1. **Backend Server Not Running**

**Symptom:** Network error when trying to register

**Solution:**

```bash
# Navigate to Backend folder
cd Backend

# Start the backend server
npm run dev
```

The server should display:

```
CampusLink backend listening on http://localhost:4000
```

#### 2. **MongoDB Not Running**

**Symptom:** Backend starts but crashes or shows database connection errors

**Solution:**

- Make sure MongoDB is installed and running
- Check that `MONGODB_URI` in `Backend/.env` is correct
- Default: `mongodb://localhost:27017/campuslink`

Start MongoDB:

```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
```

#### 3. **Network Connection Issues (Android Emulator)**

**Symptom:** "Cannot reach server" error on Android emulator

**Solution:**
The app uses `http://10.0.2.2:4000` for Android emulator, which maps to `localhost:4000` on your computer.

Make sure:

1. Backend is running on port 4000
2. No firewall is blocking the connection
3. You're using the correct emulator (not a physical device with different network)

For physical Android device:

1. Find your computer's IP address:

   ```bash
   # Windows
   ipconfig

   # macOS/Linux
   ifconfig
   ```

2. Update `CampusLink-main/lib/api.js` line 20:
   ```javascript
   return "http://YOUR_COMPUTER_IP:4000"; // e.g., http://192.168.1.100:4000
   ```
3. Ensure your device and computer are on the same WiFi network

#### 4. **Port Already in Use**

**Symptom:** Backend fails to start with "Port 4000 already in use"

**Solution:**

```bash
# Windows - Find and kill process on port 4000
netstat -ano | findstr :4000
taskkill /PID <PID_NUMBER> /F

# macOS/Linux
lsof -ti:4000 | xargs kill -9
```

Or change the port in `Backend/.env`:

```
PORT=4001
```

Then update API URL in `CampusLink-main/lib/api.js`

#### 5. **JWT Secret Not Set**

**Symptom:** Backend error about JWT secret

**Solution:**
Edit `Backend/.env` and set a strong secret:

```
JWT_SECRET=your-very-long-random-secret-string-here
```

#### 6. **iOS Simulator Issues**

**Symptom:** Network error on iOS simulator

**Solution:**
iOS simulator uses `localhost:4000` directly. Make sure backend is accessible:

```bash
curl http://localhost:4000/health
```

Should return: `{"ok":true,"uptime":...}`

### Testing the Connection

1. **Test Backend Health Endpoint:**

   ```bash
   curl http://localhost:4000/health
   ```

2. **Test Registration Endpoint:**
   ```bash
   curl -X POST http://localhost:4000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"Test123!@#","full_name":"Test User"}'
   ```

### Debug Logs

The app now includes comprehensive logging. Check:

1. **Frontend Logs** (Metro bundler terminal):
   - Look for `[API]`, `[AuthContext]`, `[RegisterScreen]` prefixes
2. **Backend Logs** (Backend terminal):
   - Look for `[Auth]`, `[CORS]` prefixes

### Step-by-Step Registration Test

1. **Start Backend:**

   ```bash
   cd Backend
   npm run dev
   ```

   Wait for: `CampusLink backend listening on http://localhost:4000`

2. **Start Frontend:**

   ```bash
   cd CampusLink-main
   npx expo start
   ```

3. **Open App:**

   - Press `a` for Android
   - Press `i` for iOS
   - Press `w` for web

4. **Try Registration:**

   - Email: `test@cse.bubt.edu.bd`
   - Password: `Test123!@#`
   - Full Name: `Test User`

5. **Check Logs:**
   - Frontend terminal should show: `[API] POST http://...`
   - Backend terminal should show: `[Auth] Registration request received`

### Still Having Issues?

1. **Clear all caches:**

   ```bash
   # Frontend
   cd CampusLink-main
   npx expo start --clear

   # Backend
   cd Backend
   rm -rf node_modules
   npm install
   ```

2. **Check versions:**

   - Node.js: v18 or higher
   - MongoDB: v4.4 or higher
   - Expo: ~54.0

3. **Restart everything:**

   - Stop both servers (Ctrl+C)
   - Restart MongoDB
   - Start backend first, then frontend

4. **Check the updated error messages:**
   The app now provides detailed error messages about what went wrong. Read them carefully!

### Error Message Reference

| Error Message               | Cause                            | Solution                                |
| --------------------------- | -------------------------------- | --------------------------------------- |
| "Cannot connect to server"  | Backend not running or wrong URL | Start backend, check API_BASE in api.js |
| "Email already registered"  | User exists                      | Try logging in instead                  |
| "Request timeout"           | Slow connection or backend hung  | Check backend logs, restart if needed   |
| "Network error"             | Cannot reach server              | Check firewall, network connectivity    |
| "Invalid email or password" | Bad input format                 | Check input validation                  |
