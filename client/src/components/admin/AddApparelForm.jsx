import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_APPAREL } from '../../utils/mutations'; // Import the mutation
import React from 'react';

const AddApparelForm = ({ closeForm }) => {
  const [newApparel, setNewApparel] = useState({
    pictures: [],
    style: '',
    sizes: [], // Array of size-stock pairs
  });

  const [createApparel] = useMutation(CREATE_APPAREL);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith('size_')) {
      const index = name.split('_')[1]; // Extract the index of the size-stock pair
      const updatedSizes = [...newApparel.sizes];
      updatedSizes[index].size = value; // Update the size at that index
      setNewApparel({ ...newApparel, sizes: updatedSizes });
    } else if (name.startsWith('stock_')) {
      const index = name.split('_')[1]; // Extract the index of the size-stock pair
      const updatedSizes = [...newApparel.sizes];
      updatedSizes[index].stock = value; // Update the stock at that index
      setNewApparel({ ...newApparel, sizes: updatedSizes });
    } else {
      setNewApparel({
        ...newApparel,
        [name]: value
      });
    }
  };

  const handlePicturesChange = (e) => {
    const files = Array.from(e.target.files);
    setNewApparel({
      ...newApparel,
      pictures: files.map((file) => URL.createObjectURL(file)) // Generate local object URLs for preview
    });
  };

  const handleAddSizeStock = () => {
    setNewApparel({
      ...newApparel,
      sizes: [...newApparel.sizes, { size: '', stock: '' }]
    });
  };

  const handleRemoveSizeStock = (index) => {
    const updatedSizes = newApparel.sizes.filter((_, i) => i !== index);
    setNewApparel({ ...newApparel, sizes: updatedSizes });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createApparel({
        variables: {
          pictures: newApparel.pictures, // Assuming pictures is an array of URLs (or paths to uploaded images)
          style: newApparel.style,
          sizes: newApparel.sizes, // Pass the sizes array as it is
        }
      });
      // Close the form after successful creation
      closeForm();
      setNewApparel({
        pictures: [],
        style: '',
        sizes: [],
      });
    } catch (error) {
      console.error("Error creating apparel:", error);
    }
  };

  return (
    <div className="add-apparel-form">
      <h2>Add New Apparel</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Picture(s) (Upload multiple files):</label>
          <input
            type="file"
            name="pictures"
            accept="image/*"
            multiple
            onChange={handlePicturesChange}
          />
        </div>
        <div>
          <label>Style:</label>
          <input
            type="text"
            name="style"
            value={newApparel.style}
            onChange={handleChange}
          />
        </div>

        {/* Dynamically render size and stock input fields */}
        {newApparel.sizes.length > 0 && (
          <div>
            <h4>Sizes and Stock:</h4>
            {newApparel.sizes.map((sizeStock, index) => (
              <div key={index} className="size-stock-pair">
                <select
                  name={`size_${index}`}
                  value={sizeStock.size}
                  onChange={handleChange}
                >
                  <option value="">Select Size</option>
                  <option value="S">Small</option>
                  <option value="M">Medium</option>
                  <option value="L">Large</option>
                  <option value="XL">Extra Large</option>
                </select>
                <input
                  type="number"
                  name={`stock_${index}`}
                  value={sizeStock.stock}
                  onChange={handleChange}
                  placeholder="Stock quantity"
                />
                <button type="button" onClick={() => handleRemoveSizeStock(index)}>
                  Remove
                </button>
              </div>
            ))}
            <button type="button" onClick={handleAddSizeStock}>Add Size/Stock</button>
          </div>
        )}

        <button type="submit">Submit</button>
        <button type="button" onClick={closeForm}>Cancel</button>
      </form>
    </div>
  );
};

export default AddApparelForm;
