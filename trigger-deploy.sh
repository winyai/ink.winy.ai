#!/bin/bash

echo "🚀 Triggering deployment to Firebase..."
echo ""

# Check if gh CLI is available
if command -v gh &> /dev/null; then
    echo "Using GitHub CLI..."
    gh workflow run firebase-deploy.yml \
        --ref claude/ink-winy-ai-mvp-011CUejufednK3uv64zobhyk \
        --repo winyai/ink.winy.ai

    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Deployment triggered successfully!"
        echo ""
        echo "📊 Watch progress at:"
        echo "   https://github.com/winyai/ink.winy.ai/actions"
        echo ""
        echo "🌐 App will be live in ~2 minutes at:"
        echo "   https://ink-winy-ai.web.app"
    else
        echo "❌ Failed to trigger workflow"
        echo "Please trigger manually at:"
        echo "https://github.com/winyai/ink.winy.ai/actions/workflows/firebase-deploy.yml"
    fi
else
    echo "⚠️  GitHub CLI (gh) not found"
    echo ""
    echo "Please trigger the deployment manually:"
    echo ""
    echo "1. Go to: https://github.com/winyai/ink.winy.ai/actions/workflows/firebase-deploy.yml"
    echo "2. Click 'Run workflow'"
    echo "3. Select branch: claude/ink-winy-ai-mvp-011CUejufednK3uv64zobhyk"
    echo "4. Click 'Run workflow'"
    echo ""
    echo "Or install gh CLI:"
    echo "  Mac: brew install gh"
    echo "  Linux: See https://github.com/cli/cli/blob/trunk/docs/install_linux.md"
    echo ""
    echo "Then run: gh auth login"
    echo "Then run: ./trigger-deploy.sh"
fi
