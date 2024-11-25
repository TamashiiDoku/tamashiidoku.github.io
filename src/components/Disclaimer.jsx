import React from 'react';

function Disclaimer({ onAccept }) {
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
      textAlign: 'center',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '600px',
        backgroundColor: 'rgba(50, 50, 50, 0.9)',
        padding: '30px',
        borderRadius: '10px'
      }}>
        <h2>⚠️ Work in Progress Disclaimer ⚠️</h2>
        <p style={{ marginBottom: '20px', lineHeight: '1.6' }}>
          Please be aware that this website is currently under active development. 
          You may encounter:
        </p>
        <ul style={{ 
          textAlign: 'left', 
          marginBottom: '20px',
          listStyle: 'none'
        }}>
          <li>• Bugs or technical issues</li>
          <li>• Incomplete features</li>
          <li>• Performance inconsistencies</li>
          <li>• Unexpected behavior</li>
        </ul>
        <p style={{ marginBottom: '30px' }}>
          By clicking "I Understand", you acknowledge that you're accessing a work in progress 
          and accept that some features may not function as intended.
        </p>
        <button 
          onClick={onAccept}
          style={{
            padding: '12px 24px',
            margin: '0 10px',
            cursor: 'pointer',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            fontSize: '16px'
          }}
        >
          I Understand
        </button>
      </div>
    </div>
  );
}

export default Disclaimer; 