# 🤖 GitHub Actions Auto-Deploy Setup

Follow these steps to enable automatic deployment to Firebase when you push to `main`.

## Step 1: Add GitHub Secret

You have your Firebase service account JSON. Now add it to GitHub:

### Option A: Using GitHub Web Interface (Easiest)

1. Go to your repository secrets page:
   ```
   https://github.com/winyai/ink.winy.ai/settings/secrets/actions
   ```

2. Click **"New repository secret"**

3. Fill in:
   - **Name:** `FIREBASE_SERVICE_ACCOUNT`
   - **Value:** Paste your entire service account JSON (the one you just shared)

4. Click **"Add secret"**

### Option B: Using GitHub CLI

If you have `gh` CLI installed:

```bash
# Save your service account JSON to a file first
gh secret set FIREBASE_SERVICE_ACCOUNT < service-account.json
```

## Step 2: Trigger Deployment

Once the secret is added, you have 3 options to deploy:

### Option 1: Merge to Main (Automatic)

```bash
# Merge your branch to main
git checkout main
git merge claude/ink-winy-ai-mvp-011CUejufednK3uv64zobhyk
git push origin main
```

GitHub Actions will automatically build and deploy! ✨

### Option 2: Manual Workflow Trigger

1. Go to: https://github.com/winyai/ink.winy.ai/actions/workflows/firebase-deploy.yml
2. Click **"Run workflow"**
3. Select branch: `claude/ink-winy-ai-mvp-011CUejufednK3uv64zobhyk`
4. Click **"Run workflow"**

### Option 3: Push to Main Directly

```bash
# Push your current branch to main
git push origin claude/ink-winy-ai-mvp-011CUejufednK3uv64zobhyk:main
```

## Step 3: Monitor Deployment

1. Go to Actions tab: https://github.com/winyai/ink.winy.ai/actions
2. You'll see your deployment running
3. Wait ~2 minutes for completion
4. Your app will be live at: **https://ink-winy-ai.web.app** 🚀

## Verification

After deployment completes, verify:

```bash
curl https://ink-winy-ai.web.app
```

Or just open it in your browser!

## What Happens Next

- ✅ Every push to `main` = Auto-deploy
- ✅ No manual commands needed
- ✅ Build + deploy in ~2 minutes
- ✅ Automatic rollback if build fails

## Troubleshooting

### Secret not working?

Make sure you pasted the **entire JSON** including the curly braces:
```json
{
  "type": "service_account",
  ...
}
```

### Workflow not running?

1. Check if workflow file exists: `.github/workflows/firebase-deploy.yml`
2. Make sure you're pushing to `main` or `master` branch
3. Check Actions tab for error messages

### Deployment failing?

1. Check Actions logs for specific error
2. Verify the secret name is exactly: `FIREBASE_SERVICE_ACCOUNT`
3. Make sure service account has Firebase Hosting permissions

---

## Alternative: Local Deploy

If you prefer to deploy locally instead:

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login with your Google account (not service account)
firebase login

# Deploy
npm run deploy
```

The local method uses your personal Google account, not the service account.
