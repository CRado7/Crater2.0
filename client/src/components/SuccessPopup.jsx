// SuccessPopup.js
import React from 'react';
import '../styles/SuccessPopup.css'; // Import styles

const SuccessPopup = ({ message, onClose }) => (
  <div className="popup-overlay">
    <div className="popup-content">
      <p>{message}</p>
      <button onClick={onClose} className="close-button">
        OK
      </button>
    </div>
  </div>
);

export default SuccessPopup;
