import React from 'react';

function AgeVerification({ onVerified }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      color: 'white',
      textAlign: 'center'
    }}>
      <h2>Age Verification Required</h2>
      <p>You must be 18 years or older to enter this website.</p>
      <div style={{ marginTop: '20px' }}>
        <button 
          onClick={onVerified}
          style={{
            padding: '10px 20px',
            margin: '0 10px',
            cursor: 'pointer'
          }}
        >
          I am 18 or older
        </button>
      </div>
    </div>
  );
}

export default AgeVerification; 