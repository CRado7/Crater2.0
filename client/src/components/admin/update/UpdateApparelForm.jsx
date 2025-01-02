import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { UPDATE_APPAREL } from '../../../utils/mutations'; // Adjust path as needed
import SuccessPopup from '../../SuccessPopup'; // Import SuccessPopup component
import '../../../styles/UpdateStockPopup.css';

const UpdateStockPopup = ({ item, onUpdate, onClose }) => {
  const [stockUpdates, setStockUpdates] = useState(
    item.sizes.map((size) => ({ size: size.size, inStock: size.inStock }))
  );

  const [featuredStatus, setFeaturedStatus] = useState(item.featured ? "Yes" : "No"); // Handle featured status
  const [showSuccessPopup, setShowSuccessPopup] = useState(false); // State for success popup
  const [isPopupClosed, setIsPopupClosed] = useState(false); // Track if the popup is closed manually

  // Initialize the mutation
  const [updateApparel, { loading, error }] = useMutation(UPDATE_APPAREL);

  const handleStockChange = (index, newStock) => {
    const updatedStocks = [...stockUpdates];
    updatedStocks[index].inStock = newStock;
    setStockUpdates(updatedStocks);
  };

  const handleFeaturedChange = (e) => {
    setFeaturedStatus(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      console.log("Submitting update...");
  
      await updateApparel({
        variables: {
          id: item._id,
          input: stockUpdates,
          featured: featuredStatus === "Yes",
        },
      });
  
      console.log("Update successful!");
      setShowSuccessPopup(true);
  
      // Wait for success popup to show, then close form
      setTimeout(() => {
        if (!isPopupClosed) {
          console.log("Closing form...");
          onClose(); // Close the form if the popup wasn't closed manually
        }
      }, 2500);
    } catch (err) {
      console.error("Failed to update apparel stock:", err);
    }
  };

  const handlePopupClose = () => {
    setIsPopupClosed(true); // Manually close the popup and prevent timeout from triggering
    onClose(); // Close the form
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Update Stock and Featured Status for {item.name}</h2>
        {error && <p className="error-message">Error: {error.message}</p>}
        {loading ? (
          <p>Updating...</p>
        ) : (
          <>
            {stockUpdates.map((size, index) => (
              <div key={index} className="size-stock-item">
                <label>{size.size}:</label>
                <input
                  type="number"
                  value={size.inStock}
                  onChange={(e) => handleStockChange(index, parseInt(e.target.value))}
                  min="0"
                />
              </div>
            ))}

            <div className="featured-status">
              <label>Featured:</label>
              <select value={featuredStatus} onChange={handleFeaturedChange}>
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>
          </>
        )}

        <button onClick={handleSubmit} className="update-button" disabled={loading}>
          Update
        </button>
        <button onClick={onClose} className="cancel-button" disabled={loading}>
          Cancel
        </button>

        {/* Show success popup */}
        {showSuccessPopup && (
          <SuccessPopup
            message={`${item.name} has been updated!`}
            onClose={handlePopupClose} // Close the popup and form when manually closed
          />
        )}
      </div>
    </div>
  );
};

export default UpdateStockPopup;
