# Ink.winy.ai

> Write, snap, swipe — and your thoughts flow into your system.

A zero-friction input surface designed for iPad (also usable on web) that lets you handwrite with Apple Pencil, snap photos, and send everything to your system with a simple swipe gesture.

## 🚀 Quick Deploy (2 minutes)

Ready to deploy? Run these commands:

```bash
# Mac/Linux
./setup-firebase.sh

# Or manually
npm install -g firebase-tools
firebase login
npm run deploy
```

**Windows:** Double-click `setup-firebase.bat` or run `npm run deploy`

Your app will be live at: **https://ink-winy-ai.web.app** 🎉

📖 **Detailed instructions:** See [DEPLOYMENT.md](./DEPLOYMENT.md)

## Features

- ✏️ **Natural Drawing** - Powered by Perfect Freehand for smooth, pressure-sensitive strokes
- 📸 **Photo Capture** - Snap and stack photos that become part of your note
- 🚀 **Swipe to Send** - Fast upward swipe gesture to submit your note
- 🎨 **Minimal Interface** - Clean, distraction-free canvas with auto-hiding toolbar
- 📱 **PWA Ready** - Install on iPad as a native app
- 🔥 **Firebase Hosting** - Fast, global CDN deployment

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Test on iPad

1. Make sure your iPad is on the same network
2. Find your local IP address (e.g., `192.168.1.x`)
3. Open `http://YOUR_IP:5173` in Safari on iPad
4. Test drawing with Apple Pencil

## How to Use

1. **Draw** - Start writing or drawing immediately on the canvas
2. **Change Colors** - Tap the color circle to pick a different pen color
3. **Erase** - Tap the eraser icon to switch to eraser mode
4. **Add Photos** - Tap camera icon to capture or upload images
5. **Send** - Swipe up fast from bottom to send your note
6. **Clear** - Tap trash icon to start fresh

## Firebase Deployment

### Automatic Deployment via GitHub Actions

The project is configured for automatic deployment to Firebase Hosting when you push to `main` or `master` branch.

**Setup (one-time):**

1. Create a Firebase service account:
```bash
firebase login
firebase projects:list
firebase init hosting:github
```

Or manually:
- Go to [Firebase Console](https://console.firebase.google.com/project/ink-winy-ai/settings/serviceaccounts)
- Generate a new private key
- Copy the JSON content

2. Add GitHub Secret:
- Go to your GitHub repo → Settings → Secrets → Actions
- Click "New repository secret"
- Name: `FIREBASE_SERVICE_ACCOUNT`
- Value: Paste the entire service account JSON

3. Push to trigger deployment:
```bash
git push origin main
```

Your app will automatically deploy to: **https://ink-winy-ai.web.app**

### Manual Deployment (Alternative)

If you prefer to deploy manually:

```bash
npm install -g firebase-tools
firebase login
npm run build
firebase deploy --only hosting
```

### Custom Domain (Optional)

1. Go to Firebase Console → Hosting
2. Add custom domain
3. Follow DNS configuration instructions
4. Use `ink.winy.ai` or your preferred domain

## Project Structure

```
ink.winy.ai/
├── src/
│   ├── components/
│   │   ├── InkCanvas.tsx      # Main drawing canvas with Perfect Freehand
│   │   ├── Toolbar.tsx         # Color picker, eraser, camera controls
│   │   ├── PhotoStack.tsx      # Photo attachment previews
│   │   └── SwipeAnimation.tsx  # Send animation
│   ├── App.tsx                 # Main app component
│   └── main.tsx                # App entry point
├── public/
│   └── manifest.json           # PWA manifest for iPad installation
├── firebase.json               # Firebase hosting config
└── package.json
```

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **Perfect Freehand** - Natural drawing strokes
- **Firebase Hosting** - Static site hosting
- **PWA** - Installable on iPad

## Next Steps (Backend Integration)

To connect this prototype to your backend:

1. Export canvas as image on swipe:
```typescript
const canvas = canvasRef.current;
const imageData = canvas.toDataURL('image/png');
```

2. Send to your API endpoint:
```typescript
await fetch('https://your-api.com/notes', {
  method: 'POST',
  body: JSON.stringify({
    image: imageData,
    photos: photos,
    timestamp: Date.now()
  })
});
```

3. Process with your AnyDone backend:
   - OCR/handwriting recognition
   - AI summarization
   - Notion API integration

## Development Tips

- **iPad Testing**: Use Safari's Web Inspector (connect iPad via USB)
- **Performance**: Canvas is optimized for 60fps drawing
- **Gestures**: Swipe detection requires minimum 100px vertical movement
- **PWA Install**: Safari → Share → Add to Home Screen

## License

MIT
