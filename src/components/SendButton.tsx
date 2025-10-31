import { useState, useRef } from 'react';

interface SendButtonProps {
  onSend: () => void;
}

export const SendButton = ({ onSend }: SendButtonProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragY, setDragY] = useState(0);
  const buttonRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);

  const SEND_THRESHOLD = -150; // Pixels to drag up before sending

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    startY.current = e.clientY;
    setDragY(0);

    if (buttonRef.current) {
      buttonRef.current.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    const deltaY = e.clientY - startY.current;
    // Only allow upward movement
    if (deltaY < 0) {
      setDragY(deltaY);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    if (buttonRef.current) {
      buttonRef.current.releasePointerCapture(e.pointerId);
    }

    // Check if dragged far enough to send
    if (dragY < SEND_THRESHOLD) {
      onSend();
    }

    setIsDragging(false);
    setDragY(0);
  };

  const progress = Math.min(Math.abs(dragY) / Math.abs(SEND_THRESHOLD), 1);
  const isReadyToSend = progress >= 1;

  return (
    <>
      {/* Track/Trail */}
      {isDragging && (
        <div
          style={{
            position: 'fixed',
            bottom: '90px',
            right: '32px',
            width: '4px',
            height: `${Math.abs(dragY)}px`,
            background: isReadyToSend
              ? 'linear-gradient(to top, #4CAF50, #8BC34A)'
              : 'linear-gradient(to top, rgba(66, 165, 245, 0.5), rgba(66, 165, 245, 0.8))',
            borderRadius: '2px',
            transition: isReadyToSend ? 'background 0.2s' : 'none',
            boxShadow: '0 0 10px rgba(66, 165, 245, 0.5)',
          }}
        />
      )}

      {/* Send Button */}
      <div
        ref={buttonRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{
          position: 'fixed',
          bottom: `${30 + Math.abs(dragY)}px`,
          right: '20px',
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: isReadyToSend
            ? 'linear-gradient(135deg, #4CAF50, #8BC34A)'
            : 'linear-gradient(135deg, #42A5F5, #478ED1)',
          boxShadow: isDragging
            ? '0 8px 24px rgba(66, 165, 245, 0.4)'
            : '0 4px 12px rgba(66, 165, 245, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: isDragging ? 'grabbing' : 'grab',
          touchAction: 'none',
          zIndex: 10000,
          transition: isDragging ? 'none' : 'all 0.3s ease',
          transform: isDragging ? 'scale(1.1)' : 'scale(1)',
        }}
      >
        {/* Up Arrow Icon */}
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transform: isReadyToSend ? 'translateY(-2px)' : 'none',
            transition: 'transform 0.2s',
          }}
        >
          <line x1="12" y1="19" x2="12" y2="5" />
          <polyline points="5 12 12 5 19 12" />
        </svg>

        {/* Pulse ring when ready to send */}
        {isReadyToSend && (
          <div
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              border: '3px solid #4CAF50',
              animation: 'pulse 1s infinite',
            }}
          />
        )}
      </div>

      {/* Instruction text */}
      {isDragging && !isReadyToSend && (
        <div
          style={{
            position: 'fixed',
            bottom: `${110 + Math.abs(dragY)}px`,
            right: '20px',
            background: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: '500',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            zIndex: 9999,
          }}
        >
          {progress < 0.5 ? 'Swipe up to send' : 'Keep going...'}
        </div>
      )}

      {/* Success text */}
      {isDragging && isReadyToSend && (
        <div
          style={{
            position: 'fixed',
            bottom: `${110 + Math.abs(dragY)}px`,
            right: '20px',
            background: 'rgba(76, 175, 80, 0.9)',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: '600',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            zIndex: 9999,
          }}
        >
          Release to send! 🚀
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(1.3);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
};
