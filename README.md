# Ink.winy.ai

> Write, snap, swipe — and your thoughts flow into your system.

A zero-friction input surface designed for iPad (also usable on web) that lets you handwrite with Apple Pencil, snap photos, and send everything to your system with a simple swipe gesture.

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

### Initial Setup

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Create a new Firebase project at [console.firebase.google.com](https://console.firebase.google.com)

4. Update `.firebaserc` with your project ID:
```json
{
  "projects": {
    "default": "your-project-id-here"
  }
}
```

### Deploy

Build and deploy to Firebase Hosting:

```bash
# Build the production app
npm run build

# Deploy to Firebase
firebase deploy --only hosting
```

Your app will be live at: `https://your-project-id.web.app`

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
