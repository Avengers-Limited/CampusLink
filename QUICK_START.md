# 🎯 Quick Start Guide - Auto IP Detection

## ✅ FIXED: IP Changes No Longer Break the App!

### How It Works Now

```
┌─────────────────────────────────────────────────────────────┐
│  1. Start Backend                                            │
│     cd Backend && npm run dev                                │
│                                                               │
│     ✓ Detects your current IP (e.g., 10.240.6.176)         │
│     ✓ Writes to server-config.json                          │
│     ✓ Shows: "Frontend should use: http://10.240.6.176:4000"│
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  2. Start Frontend                                           │
│     cd CampusLink-main && npm start                          │
│                                                               │
│     ✓ Reads server-config.json automatically                │
│     ✓ Uses detected IP                                       │
│     ✓ Shows: "[API] Using server-config.json: http://..."   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  3. Done! ✨                                                 │
│                                                               │
│     • Works on any Wi-Fi network                             │
│     • IP changes are handled automatically                   │
│     • No manual configuration needed                         │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Steps to Run (Every Time)

### Step 1: Start Backend

Open a terminal and run:

```bash
cd Backend
npm run dev
```

**Wait for this message:**

```
📝 Server config written to server-config.json
📱 Frontend should use: http://10.240.6.176:4000
```

### Step 2: Start Frontend

Open **another terminal** and run:

```bash
cd CampusLink-main
npm start
```

**Look for this message:**

```
[API] Loaded server-config.json: {...}
[API] Using server-config.json: http://10.240.6.176:4000
[API] ✓ Backend connection successful
```

### Step 3: Open on Phone

1. Make sure your phone is on the **same Wi-Fi** as your computer
2. Open Expo Go app
3. Scan the QR code
4. ✅ App should connect automatically!

## 🔥 What Changed

### Before (Manual IP Updates)

```
❌ IP hardcoded in app.json
❌ When Wi-Fi changes, IP changes
❌ Had to manually update IP in code
❌ Had to restart everything
```

### After (Auto IP Detection)

```
✅ Backend detects IP automatically
✅ Writes to shared config file
✅ Frontend reads config automatically
✅ Works even when IP changes
```

## 📋 First Time Setup Only

### 1. Allow Firewall (Windows - Run as Admin)

```bash
netsh advfirewall firewall add rule name="CampusLink Backend 4000" dir=in action=allow protocol=TCP localport=4000
```

### 2. Install Dependencies (if not done)

```bash
# Backend
cd Backend
npm install

# Frontend
cd CampusLink-main
npm install
```

## ❓ Troubleshooting

### "Cannot connect to backend"

1. ✅ Check backend is running (Step 1)
2. ✅ Check for "Server config written" message
3. ✅ Check frontend shows "Using server-config.json"
4. ✅ Both devices on same Wi-Fi?

### "IP changed and app stopped working"

1. Stop backend (Ctrl+C)
2. Restart backend: `npm run dev`
3. Restart frontend: `npm start`
4. Done! New IP is auto-detected

### "server-config.json not found"

- Make sure you started the **backend first**
- Backend must show "Server config written" message
- File should be in both `Backend/` and `CampusLink-main/` folders

## 🎓 Technical Details (For Teacher)

**Problem**: Mobile app needs backend IP, but IP changes with different Wi-Fi networks

**Solution**:

1. Backend uses Node.js `os.networkInterfaces()` to detect LAN IP
2. Writes IP to `server-config.json` (shared config file)
3. Frontend reads this file on startup
4. Frontend uses detected IP automatically

**Benefits**:

- ✅ No manual IP updates
- ✅ Works across networks
- ✅ Production-ready (can override with env vars)
- ✅ Developer-friendly

## 📁 Files Created/Modified

### New Files

- ✅ `Backend/src/utils/network.js` - IP detection utilities
- ✅ `Backend/server-config.json` - Auto-generated (gitignored)
- ✅ `CampusLink-main/server-config.json` - Auto-generated (gitignored)
- ✅ `AUTO_IP_SETUP.md` - Full documentation
- ✅ `QUICK_START.md` - This file
- ✅ `CampusLink-main/start.bat` - Windows convenience script

### Modified Files

- ✅ `Backend/src/server.js` - Added auto-detection
- ✅ `CampusLink-main/lib/api.js` - Reads server-config.json
- ✅ `Backend/.gitignore` - Ignores server-config.json
- ✅ `CampusLink-main/.gitignore` - Ignores server-config.json

## 💡 Pro Tips

1. **Always start backend first** - it creates the config file
2. **Check the console logs** - they show which IP is being used
3. **Same Wi-Fi is a must** - computer and phone need to be on same network
4. **Use the scripts** - `start.bat` checks config and shows helpful messages

---

**Need more help?** Check `AUTO_IP_SETUP.md` for detailed documentation.
