@echo off
echo ============================================
echo CampusLink - Start for Phone Testing
echo ============================================
echo.
echo Computer IP: 192.168.0.100
echo Backend will run on: http://192.168.0.100:4000
echo.
echo Make sure:
echo  1. Your phone is on the same WiFi
echo  2. Expo Go app is installed on your phone
echo  3. Firewall is configured (run allow-firewall.bat as Admin)
echo.
echo ============================================
echo Starting Backend Server...
echo ============================================
cd Backend
start "CampusLink Backend" cmd /k npm run dev

timeout /t 5

echo.
echo ============================================
echo Starting Expo Metro...
echo ============================================
cd ..\CampusLink-main
start "CampusLink Expo" cmd /k npx expo start --clear

echo.
echo ============================================
echo Setup Complete!
echo ============================================
echo.
echo Two windows opened:
echo  1. Backend Server (port 4000)
echo  2. Expo Metro (will show QR code)
echo.
echo Next Steps:
echo  1. Wait for QR code to appear in Expo window
echo  2. Open Expo Go app on your phone
echo  3. Scan the QR code
echo  4. Wait for app to load on your phone
echo.
echo Press any key to close this window...
pause > nul
