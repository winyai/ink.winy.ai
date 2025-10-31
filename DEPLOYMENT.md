# 🚀 Deployment Guide for Ink.winy.ai

Your app is ready to deploy! Follow these simple steps.

## Quick Deploy (2 minutes)

### Step 1: Install Firebase CLI (one-time)

```bash
npm install -g firebase-tools
```

### Step 2: Login to Firebase

```bash
firebase login
```

This will open your browser. Login with the Google account that has access to the `ink-winy-ai` Firebase project.

### Step 3: Deploy!

```bash
npm run deploy
```

That's it! Your app will be live at: **https://ink-winy-ai.web.app** 🎉

---

## Automatic Deployment via GitHub Actions

Want every push to `main` to automatically deploy? Follow these steps:

### Step 1: Generate Firebase Service Account

```bash
firebase login
```

Then visit this URL:
👉 https://console.firebase.google.com/project/ink-winy-ai/settings/serviceaccounts/adminsdk

1. Click **"Generate new private key"**
2. Click **"Generate key"** in the popup
3. Save the downloaded JSON file
4. Open it in a text editor and copy the **entire contents**

### Step 2: Add GitHub Secret

Visit your GitHub repository secrets page:
👉 https://github.com/winyai/ink.winy.ai/settings/secrets/actions

1. Click **"New repository secret"**
2. Name: `FIREBASE_SERVICE_ACCOUNT`
3. Value: Paste the entire JSON contents from Step 1
4. Click **"Add secret"**

### Step 3: Done!

Now whenever you push to the `main` or `master` branch, GitHub Actions will automatically:
- Build your app
- Deploy to Firebase Hosting
- Your app will be live in ~2 minutes

---

## Deployment URLs

- **Production:** https://ink-winy-ai.web.app
- **Alternative:** https://ink-winy-ai.firebaseapp.com

## Troubleshooting

### "Failed to authenticate"
Run `firebase login` again and make sure you're logged in with the correct Google account.

### "Permission denied"
Make sure your Google account has Owner or Editor role in the Firebase project.
Check at: https://console.firebase.google.com/project/ink-winy-ai/settings/iam

### "Build failed"
```bash
npm install
npm run build
```
Check for any TypeScript or build errors.

### GitHub Actions not working
1. Verify the `FIREBASE_SERVICE_ACCOUNT` secret is added
2. Check the Actions tab in GitHub for error logs
3. Make sure the service account JSON is complete (should be ~2400 characters)

---

## Manual Build & Deploy

If you want more control:

```bash
# Build the app
npm run build

# Preview the build locally
npm run preview

# Deploy to Firebase
firebase deploy --only hosting
```

---

## Custom Domain (Optional)

Want to use `ink.winy.ai` instead of the Firebase URL?

1. Go to: https://console.firebase.google.com/project/ink-winy-ai/hosting/sites
2. Click **"Add custom domain"**
3. Enter `ink.winy.ai`
4. Follow the DNS configuration instructions
5. Wait 24-48 hours for DNS propagation

---

## Need Help?

- Firebase Console: https://console.firebase.google.com/project/ink-winy-ai
- Firebase Docs: https://firebase.google.com/docs/hosting
- GitHub Actions: https://github.com/winyai/ink.winy.ai/actions
