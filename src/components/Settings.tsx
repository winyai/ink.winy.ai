import { useState, useEffect } from 'react';
import { TestStorage } from './TestStorage';

interface SettingsProps {
  onWebhookChange: (url: string) => void;
}

export const Settings = ({ onWebhookChange }: SettingsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [tempUrl, setTempUrl] = useState('');

  useEffect(() => {
    // Load webhook URL from localStorage
    const saved = localStorage.getItem('webhookUrl');
    if (saved) {
      setWebhookUrl(saved);
      setTempUrl(saved);
      onWebhookChange(saved);
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('webhookUrl', tempUrl);
    setWebhookUrl(tempUrl);
    onWebhookChange(tempUrl);
    setIsOpen(false);
  };

  const handleClear = () => {
    localStorage.removeItem('webhookUrl');
    setWebhookUrl('');
    setTempUrl('');
    onWebhookChange('');
    setIsOpen(false);
  };

  return (
    <>
      {/* Settings Button */}
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          border: webhookUrl ? '2px solid #4CAF50' : '2px solid #ddd',
          background: 'white',
          cursor: 'pointer',
          fontSize: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          zIndex: 1001,
          transition: 'all 0.2s',
        }}
        title="Settings"
      >
        ⚙️
      </button>

      {/* Settings Modal */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setIsOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              zIndex: 10000,
            }}
          />

          {/* Modal */}
          <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'white',
              borderRadius: '16px',
              padding: '32px',
              maxWidth: '500px',
              width: '90%',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
              zIndex: 10001,
            }}
          >
            <h2 style={{ margin: '0 0 24px 0', fontSize: '24px', fontWeight: '600' }}>
              Settings
            </h2>

            <div style={{ marginBottom: '24px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#333',
                }}
              >
                Webhook URL
              </label>
              <input
                type="url"
                value={tempUrl}
                onChange={(e) => setTempUrl(e.target.value)}
                placeholder="https://your-webhook.com/endpoint"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontFamily: 'monospace',
                  boxSizing: 'border-box',
                }}
              />
              <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#666' }}>
                Your notes will be sent to this webhook endpoint. Images will be uploaded to Firebase
                Storage first and URLs will be included in the payload.
              </p>
            </div>

            {webhookUrl && (
              <div
                style={{
                  marginBottom: '24px',
                  padding: '12px',
                  background: '#f0f9ff',
                  border: '1px solid #bae6fd',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              >
                ✅ Currently configured: <code style={{ color: '#0ea5e9' }}>{webhookUrl}</code>
              </div>
            )}

            {/* Test Storage */}
            <TestStorage />

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              {webhookUrl && (
                <button
                  onClick={handleClear}
                  style={{
                    padding: '10px 20px',
                    border: '2px solid #ef4444',
                    borderRadius: '8px',
                    background: 'white',
                    color: '#ef4444',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                  }}
                >
                  Clear
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  padding: '10px 20px',
                  border: '2px solid #ddd',
                  borderRadius: '8px',
                  background: 'white',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!tempUrl}
                style={{
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '8px',
                  background: tempUrl ? '#4CAF50' : '#ddd',
                  color: 'white',
                  cursor: tempUrl ? 'pointer' : 'not-allowed',
                  fontSize: '14px',
                  fontWeight: '500',
                }}
              >
                Save
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};
