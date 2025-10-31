interface Photo {
  id: string;
  url: string;
}

interface PhotoStackProps {
  photos: Photo[];
  onPhotoRemove: (id: string) => void;
}

export const PhotoStack = ({ photos, onPhotoRemove }: PhotoStackProps) => {
  if (photos.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        zIndex: 1000,
      }}
    >
      {photos.map((photo, index) => (
        <div
          key={photo.id}
          style={{
            position: 'relative',
            width: '80px',
            height: '80px',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            transform: `rotate(${index * 2}deg)`,
            transition: 'transform 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'rotate(0deg) scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = `rotate(${index * 2}deg)`;
          }}
        >
          <img
            src={photo.url}
            alt="capture"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
          <button
            onClick={() => onPhotoRemove(photo.id)}
            style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              border: 'none',
              background: 'rgba(255, 0, 0, 0.8)',
              color: 'white',
              cursor: 'pointer',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
            }}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};
