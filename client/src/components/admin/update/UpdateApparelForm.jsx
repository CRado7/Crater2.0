import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { UPDATE_APPAREL } from '../../../utils/mutations'; // Adjust path as needed

const UpdateStockPopup = ({ item, onUpdate, onClose }) => {
  const [stockUpdates, setStockUpdates] = useState(
    item.sizes.map((size) => ({ size: size.size, inStock: size.inStock }))
  );

  // Initialize the mutation
  const [updateApparel, { loading, error }] = useMutation(UPDATE_APPAREL);

  const handleStockChange = (index, newStock) => {
    const updatedStocks = [...stockUpdates];
    updatedStocks[index].inStock = newStock;
    setStockUpdates(updatedStocks);
  };

  const handleSubmit = async () => {
    try {
      await updateApparel({
        variables: {
          id: item._id,
          input: stockUpdates, // Pass the array of sizes and stock
        },
      });
      onUpdate(stockUpdates);
      onClose();
    } catch (err) {
      console.error("Failed to update apparel stock:", err);
    }
  };
  

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Update Stock for {item.name}</h2>
        {error && <p className="error-message">Error: {error.message}</p>}
        {loading ? (
          <p>Updating...</p>
        ) : (
          stockUpdates.map((size, index) => (
            <div key={index} className="size-stock-item">
              <label>{size.size}:</label>
              <input
                type="number"
                value={size.inStock}
                onChange={(e) => handleStockChange(index, parseInt(e.target.value))}
                min="0"
              />
            </div>
          ))
        )}
        <button onClick={handleSubmit} className="update-button" disabled={loading}>
          Update
        </button>
        <button onClick={onClose} className="cancel-button" disabled={loading}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default UpdateStockPopup;
