import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { UPDATE_SNOWBOARD } from '../../../utils/mutations'; // Adjust the path if necessary
import SuccessPopup from '../../SuccessPopup';
import '../../../styles/UpdateStockPopup.css';

const UpdateSnowboardForm = ({ item, onUpdate, onClose }) => {
  const [sizes, setSizes] = useState(item.sizes);
  const [featuredStatus, setFeaturedStatus] = useState(item.featured ? "Yes" : "No"); // Handle featured status
  const [showSuccessPopup, setShowSuccessPopup] = useState(false); // State for success popup
  const [isPopupClosed, setIsPopupClosed] = useState(false); // Track if the popup is closed manually
  
  // Set up the mutation
  const [updateSnowboard, { error }] = useMutation(UPDATE_SNOWBOARD);

  const handleSizeChange = (index, newInStock) => {
    const updatedSizes = sizes.map((size, i) =>
      i === index ? { ...size, inStock: newInStock } : size
    );
    setSizes(updatedSizes);
  };

  const handleFeaturedChange = (e) => {
    setFeaturedStatus(e.target.value);
  };

  const handleUpdate = async () => {
    try {
      // Call the mutation with the updated sizes
      const { data } = await updateSnowboard({
        variables: {
          id: item._id,
          input: sizes.map(({ size, inStock }) => ({ size, inStock })), // Ensure the input structure matches the mutation requirements
          featured: featuredStatus === "Yes",
        },
      });

      setShowSuccessPopup(true); // Show the success popup

      // Set a timeout to automatically close the popup and the form after 2.5 seconds
      setTimeout(() => {
        if (!isPopupClosed) {
          onClose(); // Close the form if the popup wasn't closed manually
        }
      }, 2500);
    } catch (err) {
      console.error("Failed to update snowboard stock:", err);
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
        <ul>
          {sizes.map((size, index) => (
            <li key={index} className="size-stock-item">
              <label>{size.size}:</label>
              <input
                type="number"
                value={size.inStock}
                onChange={(e) => handleSizeChange(index, parseInt(e.target.value))}
                min="0"
              />
            </li>
          ))}
        </ul>
        <div className="featured-status">
          <label>Featured:</label>
          <select value={featuredStatus} onChange={handleFeaturedChange}>
            <option value="No">No</option>
            <option value="Yes">Yes</option>
          </select>
        </div>
        <button onClick={handleUpdate}>Update</button>
        <button onClick={onClose}>Cancel</button>
        {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}

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

export default UpdateSnowboardForm;
