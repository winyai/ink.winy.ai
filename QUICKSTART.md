# ⚡ Quick Start - Deploy in 3 Steps

You have your Firebase service account ready. Here's what to do next:

## Step 1: Add Secret to GitHub (1 minute)

Go to this URL and add your secret:
### 👉 https://github.com/winyai/ink.winy.ai/settings/secrets/actions

1. Click **"New repository secret"**
2. Name: `FIREBASE_SERVICE_ACCOUNT`
3. Value: **Paste your entire service account JSON**
4. Click **"Add secret"**

![Add Secret](https://docs.github.com/assets/cb-48662/images/help/repository/actions-secrets-add-secret.png)

## Step 2: Deploy (Choose One Method)

### Method A: Push to Main
```bash
git push origin claude/ink-winy-ai-mvp-011CUejufednK3uv64zobhyk:main
```

### Method B: Merge to Main
```bash
git checkout main
git pull
git merge claude/ink-winy-ai-mvp-011CUejufednK3uv64zobhyk
git push
```

### Method C: Manual Trigger
Go to: https://github.com/winyai/ink.winy.ai/actions
- Click "Deploy to Firebase Hosting"
- Click "Run workflow"
- Select your branch
- Click "Run workflow"

## Step 3: Watch it Deploy

1. Go to: https://github.com/winyai/ink.winy.ai/actions
2. Wait ~2 minutes
3. Open: **https://ink-winy-ai.web.app** 🎉

---

## Visual Guide

### Adding the Secret:

1. **Navigate to secrets page**
   ```
   Your Repo → Settings → Secrets and variables → Actions
   ```

2. **Click "New repository secret"**

3. **Fill in the form:**
   ```
   Name: FIREBASE_SERVICE_ACCOUNT

   Value: {
     "type": "service_account",
     "project_id": "ink-winy-ai",
     ...paste entire JSON here...
   }
   ```

4. **Click "Add secret"**

### Triggering Deployment:

After the secret is added, simply push to `main` and GitHub Actions handles everything!

---

## What Happens After?

✅ **Automatic**: Every push to `main` → Auto-deploy
✅ **Fast**: Builds and deploys in ~2 minutes
✅ **Reliable**: Fails gracefully if something breaks
✅ **Live**: https://ink-winy-ai.web.app

---

## Need Help?

- **Full guide**: See [GITHUB_ACTIONS_SETUP.md](./GITHUB_ACTIONS_SETUP.md)
- **Troubleshooting**: Check the Actions tab for logs
- **Local deploy**: See [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## Alternative: Deploy Locally

Don't want to use GitHub Actions? Deploy from your computer:

```bash
npm install -g firebase-tools
firebase login
npm run deploy
```

This uses your personal Google account instead of the service account.
