import React, { useState } from 'react';

const DeleteSnowboardForm = ({ itemName, onDelete, onClose }) => {
  const [input, setInput] = useState("");

  const handleDelete = () => {
    onDelete();
    setInput("");
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Delete {itemName}</h2>
        <p>Type "{itemName}" below to delete this item.</p>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Type ${itemName}`}
        />
        <button 
          onClick={handleDelete} 
          disabled={input !== itemName}
          className="delete-button"
          >
          Delete
        </button>
        <button onClick={onClose} className="cancel-button">Cancel</button>
      </div>
    </div>
  );
};

export default DeleteSnowboardForm;
