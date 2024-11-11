import React, { useState } from 'react';

const DeleteApparelForm = ({ itemName, onDelete, onClose }) => {
  const [confirmText, setConfirmText] = useState('');

  const handleDelete = () => {
    if (confirmText === itemName) {
      onDelete(); // Execute the deletion
      setConfirmText(''); // Clear input field after deletion
      onClose(); // Close the popup after deletion
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Delete {itemName}</h2>
        <p>Type <strong>{itemName}</strong> below to confirm deletion.</p>
        <input
          type="text"
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          placeholder={`Type "${itemName}"`}
        />
        <button
          onClick={handleDelete}
          disabled={confirmText !== itemName}
          className="delete-button"
        >
          Delete
        </button>
        <button onClick={onClose} className="cancel-button">Cancel</button>
      </div>
    </div>
  );
};

export default DeleteApparelForm;
