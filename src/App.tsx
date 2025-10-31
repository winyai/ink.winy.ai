import { useState, useRef } from 'react';
import { InkCanvas } from './components/InkCanvas';
import { Toolbar } from './components/Toolbar';
import { PhotoStack } from './components/PhotoStack';
import { SwipeAnimation } from './components/SwipeAnimation';
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSwipeUp = () => {
    console.log('Swiped up! Sending note...');
    setShowSwipeAnimation(true);

    // TODO: In production, this would:
    // 1. Export canvas as image
    // 2. Send to backend for OCR/processing
    // 3. Upload photos
    // 4. Create Notion page
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
        onSwipeUp={handleSwipeUp}
        currentColor={currentColor}
        isErasing={isErasing}
      />

      {/* Photo Stack */}
      <PhotoStack photos={photos} onPhotoRemove={handlePhotoRemove} />

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
        Draw with finger/stylus
        <br />
        Swipe up fast to send 🚀
      </div>
    </div>
  );
}

export default App;
