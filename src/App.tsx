import { useState, useRef } from 'react';
import { InkCanvas } from './components/InkCanvas';
import { Toolbar } from './components/Toolbar';
import { PhotoStack } from './components/PhotoStack';
import { SwipeAnimation } from './components/SwipeAnimation';
import { SendButton } from './components/SendButton';
import { Settings } from './components/Settings';
import { uploadImage, sendToWebhook } from './firebase';
import './App.css';

interface Photo {
  id: string;
  url: string;
}

function App() {
  const [currentColor, setCurrentColor] = useState('#000000');
  const [isErasing, setIsErasing] = useState(false);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [showSwipeAnimation, setShowSwipeAnimation] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [isSending, setIsSending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSwipeUp = async () => {
    if (isSending) return;
    setIsSending(true);
    setShowSwipeAnimation(true);

    try {
      // Get canvas element from InkCanvas component
      const canvas = document.querySelector('canvas') as HTMLCanvasElement;
      if (!canvas) {
        console.error('Canvas not found');
        return;
      }

      // Export canvas as data URL
      const canvasDataUrl = canvas.toDataURL('image/png');

      // Upload canvas image to Firebase Storage
      const timestamp = Date.now();
      const canvasImageUrl = await uploadImage(
        canvasDataUrl,
        `notes/${timestamp}/canvas.png`
      );

      // Upload all photos to Firebase Storage
      const photoUrls = await Promise.all(
        photos.map(async (photo, index) => {
          const photoUrl = await uploadImage(
            photo.url,
            `notes/${timestamp}/photo-${index}.png`
          );
          return photoUrl;
        })
      );

      // Prepare payload
      const payload = {
        timestamp,
        canvasImage: canvasImageUrl,
        photos: photoUrls,
        metadata: {
          color: currentColor,
          photoCount: photos.length,
        },
      };

      // Send to webhook if configured
      if (webhookUrl) {
        await sendToWebhook(webhookUrl, payload);
        console.log('Successfully sent to webhook:', payload);
      } else {
        console.log('No webhook configured. Payload:', payload);
      }
    } catch (error) {
      console.error('Error sending note:', error);
      alert('Failed to send note. Check console for details.');
    } finally {
      setIsSending(false);
    }
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newPhoto: Photo = {
          id: Date.now().toString() + Math.random(),
          url: event.target?.result as string,
        };
        setPhotos((prev) => [...prev, newPhoto]);
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    e.target.value = '';
  };

  const handlePhotoRemove = (id: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  const handleClearCanvas = () => {
    if (window.confirm('Clear the canvas?')) {
      // Clear canvas by remounting it
      window.location.reload();
    }
  };

  const handleAnimationComplete = () => {
    setShowSwipeAnimation(false);
    // Clear everything after send
    setPhotos([]);
    window.location.reload();
  };

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        background: '#ffffff',
        position: 'relative',
      }}
    >
      {/* Canvas */}
      <InkCanvas
        currentColor={currentColor}
        isErasing={isErasing}
      />

      {/* Photo Stack */}
      <PhotoStack photos={photos} onPhotoRemove={handlePhotoRemove} />

      {/* Settings */}
      <Settings onWebhookChange={setWebhookUrl} />

      {/* Send Button */}
      <SendButton onSend={handleSwipeUp} />

      {/* Toolbar */}
      <Toolbar
        currentColor={currentColor}
        isErasing={isErasing}
        onColorChange={setCurrentColor}
        onEraserToggle={setIsErasing}
        onCameraClick={handleCameraClick}
        onClearCanvas={handleClearCanvas}
      />

      {/* Hidden file input for camera/photo */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        multiple
        style={{ display: 'none' }}
        onChange={handleFileSelect}
      />

      {/* Swipe Animation */}
      <SwipeAnimation
        isVisible={showSwipeAnimation}
        onComplete={handleAnimationComplete}
      />

      {/* Instructions (can remove after testing) */}
      <div
        style={{
          position: 'fixed',
          top: '20px',
          left: '20px',
          background: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          padding: '12px 16px',
          borderRadius: '8px',
          fontSize: '14px',
          maxWidth: '300px',
          zIndex: 999,
        }}
      >
        <strong>Ink.winy.ai</strong>
        <br />
        ✏️ Draw with finger/stylus
        <br />
        🔍 Pinch to zoom, 2 fingers to pan
        <br />
        🚀 Drag send button up to send
      </div>
    </div>
  );
}

export default App;
