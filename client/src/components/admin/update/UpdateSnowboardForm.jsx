import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { UPDATE_SNOWBOARD } from '../../../utils/mutations'; // Adjust the path if necessary

const UpdateSnowboardForm = ({ item, onUpdate, onClose }) => {
  const [sizes, setSizes] = useState(item.sizes);

  // Set up the mutation
  const [updateSnowboard, { error }] = useMutation(UPDATE_SNOWBOARD);

  const handleSizeChange = (index, newInStock) => {
    const updatedSizes = sizes.map((size, i) =>
      i === index ? { ...size, inStock: newInStock } : size
    );
    setSizes(updatedSizes);
  };

  const handleUpdate = async () => {
    try {
      // Call the mutation with the updated sizes
      const { data } = await updateSnowboard({
        variables: {
          id: item._id,
          input: sizes.map(({ size, inStock }) => ({ size, inStock })), // Ensure the input structure matches the mutation requirements
        },
      });

      if (data) {
        onUpdate(sizes); // Pass updated sizes to parent component
      }
      onClose(); // Close the popup after updating
    } catch (err) {
      console.error("Failed to update snowboard stock:", error || err);
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Update Stock for {item.name}</h2>
        <ul>
          {sizes.map((size, index) => (
            <li key={index}>
              <span>{size.size}:</span>
              <input
                type="number"
                value={size.inStock}
                onChange={(e) => handleSizeChange(index, parseInt(e.target.value))}
              />
            </li>
          ))}
        </ul>
        <button onClick={handleUpdate}>Update</button>
        <button onClick={onClose}>Cancel</button>
        {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
      </div>
    </div>
  );
};

export default UpdateSnowboardForm;
