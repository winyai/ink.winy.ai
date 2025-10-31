import { useState } from 'react';

interface ToolbarProps {
  onColorChange: (color: string) => void;
  onEraserToggle: (isErasing: boolean) => void;
  onCameraClick: () => void;
  onClearCanvas: () => void;
  currentColor: string;
  isErasing: boolean;
}

const COLORS = ['#000000', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'];

export const Toolbar = ({
  onColorChange,
  onEraserToggle,
  onCameraClick,
  onClearCanvas,
  currentColor,
  isErasing,
}: ToolbarProps) => {
  const [showColorPicker, setShowColorPicker] = useState(false);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '16px',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        padding: '12px 20px',
        borderRadius: '24px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        zIndex: 1000,
      }}
    >
      {/* Pen/Color Picker */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => {
            setShowColorPicker(!showColorPicker);
            if (isErasing) onEraserToggle(false);
          }}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: isErasing ? '2px solid #ddd' : '3px solid #000',
            background: currentColor,
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          title="Pen"
        />

        {showColorPicker && (
          <div
            style={{
              position: 'absolute',
              bottom: '50px',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: '8px',
              background: 'white',
              padding: '8px',
              borderRadius: '12px',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
            }}
          >
            {COLORS.map((color) => (
              <button
                key={color}
                onClick={() => {
                  onColorChange(color);
                  setShowColorPicker(false);
                }}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  border: color === currentColor ? '3px solid #000' : '2px solid #eee',
                  background: color,
                  cursor: 'pointer',
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Eraser */}
      <button
        onClick={() => onEraserToggle(!isErasing)}
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          border: isErasing ? '3px solid #000' : '2px solid #ddd',
          background: isErasing ? '#f0f0f0' : 'white',
          cursor: 'pointer',
          fontSize: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s',
        }}
        title="Eraser"
      >
        ⌫
      </button>

      {/* Camera */}
      <button
        onClick={onCameraClick}
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          border: '2px solid #ddd',
          background: 'white',
          cursor: 'pointer',
          fontSize: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s',
        }}
        title="Camera"
      >
        📸
      </button>

      {/* Clear */}
      <button
        onClick={onClearCanvas}
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          border: '2px solid #ddd',
          background: 'white',
          cursor: 'pointer',
          fontSize: '18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s',
        }}
        title="Clear Canvas"
      >
        🗑️
      </button>
    </div>
  );
};
