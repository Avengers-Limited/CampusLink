# 📱 Automatic Network Connection - How It Works

## ✨ What You Asked For

**"On phone, I want it to work automatically when both systems are on the same network"**

## ✅ How It Works Now

### Step 1: Backend Detects Its IP

When you start the backend:

```bash
cd Backend
npm run dev
```

The backend automatically:

1. Detects your computer's LAN IP (e.g., `192.168.0.100`)
2. Writes it to `server-config.json` in BOTH folders:
   - `Backend/server-config.json`
   - `CampusLink-main/server-config.json`
3. Prints it in console: `📱 Frontend should use: http://192.168.0.100:4000`

### Step 2: Frontend Reads the Config Automatically

When you start the frontend:

```bash
cd CampusLink-main
npm start
```

Then scan the QR code on your phone. The app automatically:

1. **Reads `server-config.json`**
   - Gets the IP: `http://192.168.0.100:4000`
2. **Uses that IP for all API calls**
   - No manual configuration needed!
3. **Logs it:**
   ```
   [API] Loaded server-config.json
   [API] Using server-config.json: http://192.168.0.100:4000
   [API] ✅ Backend connection successful
   ```

## 🎯 Priority Order (Automatic!)

The app checks in this order:

1. **Manual Config** (if you set it in Settings → API Configuration)
2. **`server-config.json`** ← This is the automatic one! ⭐
3. Environment variable (`EXPO_PUBLIC_API_BASE`)
4. `app.json` config
5. Platform defaults (localhost, 10.0.2.2, etc.)

**So if both are on same network and you started backend first, it just works!**

## 📝 Usage Instructions

### For Same Network (Home/University Wi-Fi)

**Simple 3-step process:**

1. **Start Backend:**

   ```bash
   cd Backend
   npm run dev
   ```

   Wait for: `📱 Frontend should use: http://192.168.0.100:4000`

2. **Start Frontend:**

   ```bash
   cd CampusLink-main
   npm start
   ```

3. **Scan QR Code on Phone**
   - Open Expo Go
   - Scan the QR code
   - App loads and connects automatically! ✨

**That's it!** No manual configuration needed.

### How to Verify It's Working

Check the Expo logs on your computer - you should see:

```
[API] Loaded server-config.json: {...}
[API] Using server-config.json: http://192.168.0.100:4000
[API] ✅ Backend connection successful
```

If you see `✅ Backend connection successful`, you're good to go!

## 🔄 When You Switch Networks

### Scenario: You're at home, then go to university

**What happens:**

1. Your laptop gets a new IP (e.g., `192.168.1.50` → `10.20.30.40`)
2. Old `server-config.json` has the old IP

**How to fix:**

1. Restart backend: `npm run dev`
   - Detects new IP automatically
   - Writes new config file
2. Reload app on phone
   - Reads new config
   - Connects to new IP automatically!

**That's it!** No manual editing needed.

## 🛠️ Manual Override (If Needed)

If automatic doesn't work (firewall, different network, etc.):

1. Open app on phone
2. Go to **Settings → API Configuration**
3. Enter backend URL (from backend console)
4. Test → Save → Restart

But **you shouldn't need this** if on same network! ✅

## 🎓 For University Demo

### Easiest Approach:

**Option 1: Same Wi-Fi (Most Impressive)**

1. Connect laptop and phone to same university Wi-Fi
2. Start backend (shows IP)
3. Start frontend
4. Scan QR code
5. **Works automatically!** Show teacher it's detecting the IP

**Option 2: Web Browser (Most Reliable)**

```bash
npm run web
```

No network issues at all!

**Option 3: Tunnel Mode (If Wi-Fi is restricted)**

```bash
npm run start:tunnel
```

Works even on restricted networks!

## 🧠 Technical Details (For Teacher)

**How backend detects IP:**

```javascript
// Backend/src/utils/network.js
export function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "localhost";
}
```

**How frontend reads it:**

```javascript
// CampusLink-main/lib/api.js
let serverConfig = null;
try {
  serverConfig = require("../server-config.json");
  if (serverConfig?.apiBase) {
    return serverConfig.apiBase; // Auto-detected IP!
  }
} catch (e) {
  // Falls back to other methods
}
```

**Why this is smart:**

- ✅ No hardcoded IPs
- ✅ Works on any network
- ✅ Adapts automatically
- ✅ Professional deployment practice
- ✅ Demonstrates problem-solving skills

## ✅ Summary

| Scenario                      | What Happens     | Action Needed                |
| ----------------------------- | ---------------- | ---------------------------- |
| Same network, backend running | ✅ Auto-connects | None!                        |
| Switch networks               | ⚠️ Old IP cached | Restart backend              |
| Different networks            | ❌ Can't reach   | Manual config OR tunnel mode |
| Web browser demo              | ✅ Always works  | None!                        |

**The key:** Start backend FIRST, then frontend. The config file gets created automatically and your phone reads it!

---

**You're all set!** Just make sure both devices are on the same Wi-Fi, start backend first, and it will work automatically. 🎉
