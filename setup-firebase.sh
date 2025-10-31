#!/bin/bash

echo "🔥 Firebase Setup for Ink.winy.ai"
echo "=================================="
echo ""

# Check if firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "📦 Firebase CLI not found. Installing..."
    npm install -g firebase-tools
    echo "✅ Firebase CLI installed!"
else
    echo "✅ Firebase CLI already installed"
fi

echo ""
echo "🔐 Logging in to Firebase..."
echo "    (This will open your browser)"
firebase login

echo ""
echo "✅ Setup complete!"
echo ""
echo "🚀 You can now deploy with:"
echo "   npm run deploy"
echo ""
echo "📱 Your app will be live at:"
echo "   https://ink-winy-ai.web.app"
echo ""
