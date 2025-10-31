import { useState } from 'react';
import { uploadImage } from '../firebase';

export const TestStorage = () => {
  const [testResult, setTestResult] = useState<{
    status: 'idle' | 'testing' | 'success' | 'error';
    message: string;
    url?: string;
  }>({ status: 'idle', message: '' });

  const testFirebaseStorage = async () => {
    setTestResult({ status: 'testing', message: 'Testing Firebase Storage...' });

    try {
      // Create a simple test image (1x1 red pixel)
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'red';
        ctx.fillRect(0, 0, 1, 1);
      }

      const testDataUrl = canvas.toDataURL('image/png');

      // Upload to Firebase Storage
      const timestamp = Date.now();
      const testPath = `test/${timestamp}/test.png`;

      const downloadUrl = await uploadImage(testDataUrl, testPath);

      setTestResult({
        status: 'success',
        message: '✅ Firebase Storage is working!\n\nTest image uploaded successfully.',
        url: downloadUrl,
      });

      return downloadUrl;
    } catch (error: any) {
      let errorMessage = '❌ Firebase Storage test failed\n\n';

      if (error.code === 'storage/unauthorized') {
        errorMessage += '🔒 PERMISSION DENIED\n\n';
        errorMessage += 'Firebase Storage is not initialized or rules are blocking uploads.\n\n';
        errorMessage += 'To fix:\n';
        errorMessage += '1. Go to Firebase Console\n';
        errorMessage += '2. Click Storage in left menu\n';
        errorMessage += '3. Click "Get Started" if needed\n';
        errorMessage += '4. Set rules to allow read/write\n';
        errorMessage += '5. Publish the rules';
      } else if (error.code === 'storage/quota-exceeded') {
        errorMessage += '💾 Storage quota exceeded';
      } else if (error.code === 'storage/unauthenticated') {
        errorMessage += '🔑 Authentication required';
      } else {
        errorMessage += error.message || 'Unknown error';
        errorMessage += '\n\nError code: ' + (error.code || 'none');
      }

      setTestResult({
        status: 'error',
        message: errorMessage,
      });

      throw error;
    }
  };

  return (
    <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #eee' }}>
      <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600' }}>
        Debug Tools
      </h3>

      <button
        onClick={testFirebaseStorage}
        disabled={testResult.status === 'testing'}
        style={{
          width: '100%',
          padding: '12px',
          border: '2px solid #2196F3',
          borderRadius: '8px',
          background: testResult.status === 'testing' ? '#eee' : 'white',
          color: testResult.status === 'testing' ? '#999' : '#2196F3',
          cursor: testResult.status === 'testing' ? 'not-allowed' : 'pointer',
          fontSize: '14px',
          fontWeight: '500',
        }}
      >
        {testResult.status === 'testing' ? '⏳ Testing...' : '🧪 Test Firebase Storage'}
      </button>

      <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#666' }}>
        Uploads a test image to verify Storage is configured correctly.
      </p>

      {/* Test Result Display */}
      {testResult.status !== 'idle' && testResult.status !== 'testing' && (
        <div
          style={{
            marginTop: '16px',
            padding: '16px',
            borderRadius: '8px',
            background: testResult.status === 'success' ? '#f0fdf4' : '#fef2f2',
            border: `2px solid ${testResult.status === 'success' ? '#86efac' : '#fca5a5'}`,
          }}
        >
          <div
            style={{
              fontSize: '13px',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              color: testResult.status === 'success' ? '#166534' : '#991b1b',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              lineHeight: '1.5',
            }}
          >
            {testResult.message}
          </div>

          {testResult.url && (
            <div style={{ marginTop: '12px' }}>
              <a
                href={testResult.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  padding: '8px 12px',
                  background: '#22c55e',
                  color: 'white',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  fontSize: '12px',
                  fontWeight: '500',
                }}
              >
                🔗 View Test Image
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
