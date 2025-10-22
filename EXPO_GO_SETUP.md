# 📱 Setup CampusLink for Physical Phone (Expo Go)

## Your Setup Details:

- **Computer IP**: `192.168.0.100`
- **Backend URL**: `http://192.168.0.100:4000`
- **Expo Metro**: Will run on `exp://192.168.0.100:19000`

## Prerequisites:

1. ✅ Computer and phone on **SAME WiFi network**
2. ✅ Expo Go app installed on your phone
   - Android: [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)

## Setup Steps:

### Step 1: Allow Firewall Access (Windows Only)

**Option A - Automatic (Recommended):**

1. Right-click `Backend/allow-firewall.bat`
2. Select "Run as Administrator"
3. Click "Yes" when prompted

**Option B - Manual:**

1. Open Windows Defender Firewall
2. Click "Advanced settings"
3. Click "Inbound Rules" → "New Rule"
4. Select "Port" → Next
5. Select "TCP" → Specific local ports: `4000` → Next
6. Select "Allow the connection" → Next
7. Check all profiles → Next
8. Name: "CampusLink Backend" → Finish

### Step 2: Start Backend Server

Open Terminal/CMD in Backend folder:

```bash
cd Backend
npm run dev
```

**Important**: Keep this running! You should see:

```
[DB] ✓ MongoDB connected successfully
CampusLink backend listening on http://localhost:4000
```

### Step 3: Start Expo with Tunnel

Open NEW Terminal/CMD in CampusLink-main folder:

```bash
cd CampusLink-main
npx expo start --clear
```

You'll see a QR code in the terminal.

### Step 4: Connect Your Phone

**Method 1 - QR Code (Easiest):**

1. Open Expo Go app on your phone
2. Tap "Scan QR code"
3. Scan the QR code from the terminal
4. Wait for app to load

**Method 2 - Manual URL:**

1. In terminal, note the URL like: `exp://192.168.0.100:19000`
2. Open Expo Go app
3. Tap "Enter URL manually"
4. Type the URL and Go

### Step 5: Verify Connection

When app loads on your phone:

1. Check the Metro bundler logs
2. Should see: `[API] Using API base URL: http://192.168.0.100:4000`
3. Should see: `[API] ✓ Backend connection successful`

## Troubleshooting:

### Problem: "Unable to connect to Expo"

**Solution:**

1. Make sure computer and phone on same WiFi
2. Try using tunnel mode:
   ```bash
   npx expo start --tunnel
   ```
3. This is slower but works across different networks

### Problem: "Network error - cannot reach server"

**Solution:**

1. Verify backend is running
2. Test from your computer's browser: `http://192.168.0.100:4000/health`
3. Check Windows Firewall (run allow-firewall.bat as Admin)
4. Temporarily disable antivirus to test

### Problem: "Connection refused"

**Solution:**

1. Your IP might have changed. Run in terminal:
   ```bash
   ipconfig
   ```
2. Look for "IPv4 Address" under your WiFi adapter
3. Update `CampusLink-main/app.json`:
   ```json
   "extra": {
     "apiBase": "http://YOUR_NEW_IP:4000"
   }
   ```
4. Restart Expo with `--clear` flag

### Problem: App loads but can't register/login

**Solution:**

1. Check Metro bundler logs for `[API]` messages
2. If you see wrong IP, update app.json and restart
3. Make sure backend shows incoming requests
4. Watch backend terminal for `[Auth]` logs

## Testing Backend from Phone's Browser:

1. Open browser on your phone
2. Go to: `http://192.168.0.100:4000/health`
3. Should see: `{"ok":true,"uptime":...}`
4. If this works, your firewall and network are configured correctly

## Quick Test Checklist:

- [ ] Both computer and phone connected to same WiFi
- [ ] Backend running (Terminal 1 shows "listening on http://localhost:4000")
- [ ] Expo running (Terminal 2 shows QR code)
- [ ] Expo Go app installed on phone
- [ ] Firewall rule added (Windows)
- [ ] Scanned QR code in Expo Go
- [ ] App loaded on phone
- [ ] Can see connection logs in Metro bundler
- [ ] Backend shows: `[CORS] Request from origin: exp://192.168.0.100:19000`

## Important Notes:

1. **Keep Both Terminals Open**: Backend and Expo must stay running
2. **Same WiFi**: Computer and phone must be on the same network
3. **IP Can Change**: If you restart WiFi, your IP might change - update app.json
4. **Hot Reload Works**: Changes will auto-reload on your phone
5. **Shake Phone**: To access Expo developer menu

## For Development:

- **Fast Refresh**: Edit code → Auto updates on phone
- **Debug Menu**: Shake phone → Tap "Debug Remote JS"
- **Logs**: Check Metro bundler terminal for console.logs
- **Reload**: Shake phone → Tap "Reload"

## Switch Back to Computer Testing:

To test on browser/emulator again, you have two options:

**Option 1 - Change app.json back:**

```json
"extra": {
  "apiBase": "http://10.0.2.2:4000"  // For Android emulator
}
```

**Option 2 - Use environment variable:**
Create `.env` with:

```
EXPO_PUBLIC_API_BASE=http://localhost:4000
```

The app will automatically use localhost for web and the IP for phone!

## Current Configuration Status:

✅ API Base URL updated to: `http://192.168.0.100:4000`
✅ CORS configured for mobile access
✅ Smart platform detection (web uses localhost, phone uses IP)
✅ Firewall helper script created

You're all set! 🚀
