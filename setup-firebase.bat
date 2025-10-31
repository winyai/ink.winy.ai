@echo off
echo.
echo 🔥 Firebase Setup for Ink.winy.ai
echo ==================================
echo.

REM Check if firebase CLI is installed
where firebase >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo 📦 Firebase CLI not found. Installing...
    call npm install -g firebase-tools
    echo ✅ Firebase CLI installed!
) else (
    echo ✅ Firebase CLI already installed
)

echo.
echo 🔐 Logging in to Firebase...
echo     (This will open your browser)
call firebase login

echo.
echo ✅ Setup complete!
echo.
echo 🚀 You can now deploy with:
echo    npm run deploy
echo.
echo 📱 Your app will be live at:
echo    https://ink-winy-ai.web.app
echo.
pause
