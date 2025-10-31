import { useEffect, useState } from 'react';

interface SwipeAnimationProps {
  isVisible: boolean;
  onComplete: () => void;
}

export const SwipeAnimation = ({ isVisible, onComplete }: SwipeAnimationProps) => {
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    if (isVisible) {
      setOpacity(1);
      const timer = setTimeout(() => {
        setOpacity(0);
        setTimeout(onComplete, 500);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(255, 255, 255, 0.95)',
        opacity,
        transition: 'opacity 0.5s',
        zIndex: 9999,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          fontSize: '48px',
          animation: 'slideUp 1.5s ease-out',
        }}
      >
        🚀
      </div>
      <style>{`
        @keyframes slideUp {
          0% {
            transform: translateY(100vh);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh);
            opacity: 0;
          }
        }
      `}</style>
      <div
        style={{
          position: 'absolute',
          bottom: '40%',
          fontSize: '24px',
          fontWeight: '300',
          color: '#333',
        }}
      >
        Sent to your system
      </div>
    </div>
  );
};
