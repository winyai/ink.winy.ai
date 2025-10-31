#!/bin/bash

echo "🔐 Adding Firebase Service Account to GitHub Secrets"
echo "===================================================="
echo ""

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) is not installed."
    echo ""
    echo "📖 Please add the secret manually:"
    echo "   1. Go to: https://github.com/winyai/ink.winy.ai/settings/secrets/actions"
    echo "   2. Click 'New repository secret'"
    echo "   3. Name: FIREBASE_SERVICE_ACCOUNT"
    echo "   4. Value: Paste your service account JSON"
    echo ""
    echo "Or install gh CLI:"
    echo "   Mac: brew install gh"
    echo "   Linux: https://github.com/cli/cli/blob/trunk/docs/install_linux.md"
    exit 1
fi

# Check if user is logged in to gh
if ! gh auth status &> /dev/null; then
    echo "🔑 Please login to GitHub CLI first:"
    gh auth login
fi

echo "📄 Please provide your Firebase service account JSON file path:"
read -p "File path: " SERVICE_ACCOUNT_FILE

if [ ! -f "$SERVICE_ACCOUNT_FILE" ]; then
    echo "❌ File not found: $SERVICE_ACCOUNT_FILE"
    exit 1
fi

echo ""
echo "📤 Adding secret to GitHub..."

gh secret set FIREBASE_SERVICE_ACCOUNT < "$SERVICE_ACCOUNT_FILE" --repo winyai/ink.winy.ai

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Secret added successfully!"
    echo ""
    echo "🚀 Now you can deploy by:"
    echo "   1. Merge to main: git checkout main && git merge your-branch"
    echo "   2. Or push to main: git push origin your-branch:main"
    echo "   3. Or trigger manually: https://github.com/winyai/ink.winy.ai/actions"
    echo ""
    echo "📱 Your app will be live at: https://ink-winy-ai.web.app"
else
    echo ""
    echo "❌ Failed to add secret. Please add it manually:"
    echo "   https://github.com/winyai/ink.winy.ai/settings/secrets/actions"
fi
