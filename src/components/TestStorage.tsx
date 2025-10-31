import { uploadImage } from '../firebase';

export const TestStorage = () => {
  const testFirebaseStorage = async () => {
    console.log('🧪 Testing Firebase Storage...');

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
      console.log('✅ Test image created');

      // Upload to Firebase Storage
      const timestamp = Date.now();
      const testPath = `test/${timestamp}/test.png`;
      console.log('📤 Uploading to:', testPath);

      const downloadUrl = await uploadImage(testDataUrl, testPath);

      console.log('✅ Upload successful!');
      console.log('📥 Download URL:', downloadUrl);

      alert(`✅ Firebase Storage is working!\n\nTest image uploaded to:\n${downloadUrl}\n\nYou can click this URL in the console to view it.`);

      return downloadUrl;
    } catch (error: any) {
      console.error('❌ Firebase Storage test failed:', error);

      let errorMessage = 'Firebase Storage test failed:\n\n';

      if (error.code === 'storage/unauthorized') {
        errorMessage += '🔒 PERMISSION DENIED\n\n';
        errorMessage += 'Fix this by setting Storage Rules:\n';
        errorMessage += '1. Go to Firebase Console > Storage > Rules\n';
        errorMessage += '2. Set rules to allow read/write\n';
        errorMessage += '3. Publish the rules';
      } else if (error.code === 'storage/quota-exceeded') {
        errorMessage += '💾 Storage quota exceeded';
      } else if (error.code === 'storage/unauthenticated') {
        errorMessage += '🔑 Authentication required';
      } else {
        errorMessage += error.message || 'Unknown error';
      }

      alert(errorMessage);
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
        style={{
          width: '100%',
          padding: '12px',
          border: '2px solid #2196F3',
          borderRadius: '8px',
          background: 'white',
          color: '#2196F3',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '500',
        }}
      >
        🧪 Test Firebase Storage
      </button>
      <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#666' }}>
        Uploads a test image to verify Storage is configured correctly. Check console for details.
      </p>
    </div>
  );
};
