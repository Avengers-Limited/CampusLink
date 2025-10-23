# CampusLink - Auto IP Configuration

## 🎯 Problem Solved

When your computer's IP address changes (e.g., switching Wi-Fi networks), the frontend used to fail to connect to the backend. This solution **automatically detects and uses the correct IP** every time you start the backend.

## 🚀 How It Works

1. **Backend detects IP**: When you run `npm run dev` in the Backend folder, it:

   - Detects your machine's current LAN IP address
   - Writes it to `server-config.json` in both Backend and Frontend folders
   - Displays the IP in the console

2. **Frontend reads IP**: The frontend automatically reads `server-config.json` and uses the detected IP

3. **No manual updates needed**: Even if your IP changes daily, just restart the backend and frontend - they'll sync automatically!

## 📋 Setup Instructions

### First Time Setup

1. **Install backend dependencies**:

   ```bash
   cd Backend
   npm install
   ```

2. **Install frontend dependencies**:

   ```bash
   cd CampusLink-main
   npm install
   ```

3. **Configure backend environment** (one-time):
   - Copy `Backend/.env.example` to `Backend/.env` (if needed)
   - Update MongoDB URI and JWT secret

### Running the App

**IMPORTANT**: Always start the backend FIRST, then the frontend.

#### Option 1: Using the provided scripts (Windows)

1. **Start Backend**:

   ```bash
   cd Backend
   npm run dev
   ```

   Look for output like:

   ```
   📝 Server config written to server-config.json
   📱 Frontend should use: http://10.249.242.176:4000
   Accessible on your LAN at:
     http://10.249.242.176:4000
   ```

2. **Start Frontend** (in a new terminal):
   ```bash
   cd CampusLink-main
   start.bat
   ```
   OR:
   ```bash
   npm start
   ```

#### Option 2: Manual start

1. Start backend: `cd Backend && npm run dev`
2. Wait for "Server config written" message
3. Start frontend: `cd CampusLink-main && npm start`

### Testing on Your Phone (Expo Go)

1. **Ensure same Wi-Fi**: Your phone and computer must be on the same Wi-Fi network

2. **Allow firewall** (Windows - run as Administrator):

   ```bash
   netsh advfirewall firewall add rule name="CampusLink Backend 4000" dir=in action=allow protocol=TCP localport=4000
   ```

3. **Scan QR code** in Expo Go app on your phone

4. **Check logs**: You should see:
   ```
   [API] Loaded server-config.json: {...}
   [API] Using server-config.json: http://10.249.242.176:4000
   [API] ✓ Backend connection successful
   ```

### Testing on Android Emulator

The backend auto-detection works with real devices. For Android Emulator, you may need to manually set in `app.json`:

```json
{
  "expo": {
    "extra": {
      "apiBase": "http://10.0.2.2:4000"
    }
  }
}
```

## 🔧 Troubleshooting

### "Cannot connect to backend"

1. **Check backend is running**: Look for "Server config written" message
2. **Check server-config.json exists**: Should be in both `Backend/` and `CampusLink-main/`
3. **Check IP in logs**: Frontend should show `[API] Using server-config.json: http://...`
4. **Test from browser**: Open `http://<IP>:4000/api/test` in your phone's browser

### "IP still wrong after restart"

1. **Delete old config**: Remove `server-config.json` from both folders
2. **Restart backend**: It will create a new config with the current IP
3. **Reload frontend**: Restart Expo or reload the app

### "Firewall blocking connection"

Run as Administrator:

```bash
netsh advfirewall firewall add rule name="CampusLink Backend 4000" dir=in action=allow protocol=TCP localport=4000
```

Or temporarily disable Windows Firewall to test.

## 📁 Files Modified

- ✅ `Backend/src/server.js` - Auto-detects IP and writes config
- ✅ `Backend/src/utils/network.js` - IP detection utilities
- ✅ `CampusLink-main/lib/api.js` - Reads server-config.json automatically
- ✅ `Backend/.gitignore` - Ignores server-config.json (machine-specific)
- ✅ `CampusLink-main/.gitignore` - Ignores server-config.json
- ✅ `CampusLink-main/start.bat` - Convenience script for Windows

## 🎓 How to Explain This to Your Teacher

**What the problem was:**

- The mobile app needs to connect to the backend server running on my computer
- When my computer's IP address changes (switching Wi-Fi networks), the hardcoded IP in the frontend breaks
- Users would have to manually find the new IP and update the code every time

**How I solved it:**

1. **Backend IP detection**: When the backend starts, it uses Node.js's `os.networkInterfaces()` to detect the current LAN IP address
2. **Shared configuration**: The backend writes this IP to a JSON file that both backend and frontend can access
3. **Frontend auto-configuration**: The frontend reads this JSON file on startup and uses the detected IP automatically
4. **Priority system**: The frontend checks multiple sources in order: server-config.json → environment variables → platform defaults

**Technologies used:**

- Node.js `os` module for network interface detection
- File system operations to share config between backend/frontend
- React Native platform detection for web vs. mobile differences

**Benefits:**

- ✅ No manual IP updates needed
- ✅ Works across different Wi-Fi networks automatically
- ✅ Developer-friendly: just start backend, then frontend
- ✅ Production-ready: can override with environment variables if needed

## 📝 Notes

- `server-config.json` is auto-generated and should NOT be committed to git
- The backend must be started first to generate the config
- If you deploy to production, use environment variables instead of auto-detection
