import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_APPAREL } from '../../../utils/mutations';
import React from 'react';

const AddApparelForm = ({ closeForm }) => {
  const [newApparel, setNewApparel] = useState({
    pictures: [],
    name: '',
    style: '',
    sizes: [
      { size: 'XS', inStock: 0 },
      { size: 'S', inStock: 0 },
      { size: 'M', inStock: 0 },
      { size: 'L', inStock: 0 },
      { size: 'XL', inStock: 0 },
      { size: 'XXL', inStock: 0 },
    ], // Initialize with all sizes
    price: '',
    featured: false, // Initial value of featured is false
  });

  const [createApparel] = useMutation(CREATE_APPAREL);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update the stock values if it's a size or stock input
    if (name.startsWith('stock_')) {
      const index = parseInt(name.split('_')[1], 10);
      const updatedSizes = [...newApparel.sizes];
      updatedSizes[index] = { 
        ...updatedSizes[index], 
        inStock: value === "" ? 0 : parseInt(value, 10) // Default to 0 if stock is empty
      };
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
      pictures: files.map((file) => URL.createObjectURL(file))
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure all sizes are included with default stock values
    const sizesWithDefaults = newApparel.sizes.map((sizeStock) => ({
      size: sizeStock.size, // Size is always included
      inStock: sizeStock.inStock || 0, // Default to 0 if no stock value is given
    }));

    try {
      await createApparel({
        variables: {
          pictures: newApparel.pictures,
          name: newApparel.name,
          style: newApparel.style,
          sizes: sizesWithDefaults, // Pass all sizes to the backend
          price: parseFloat(newApparel.price),
          featured: newApparel.featured === "Yes", // Pass boolean value for featured
        },
      });
      closeForm();
      setNewApparel({
        pictures: [],
        name: '',
        style: '',
        sizes: [
          { size: 'XS', inStock: 0 },
          { size: 'S', inStock: 0 },
          { size: 'M', inStock: 0 },
          { size: 'L', inStock: 0 },
          { size: 'XL', inStock: 0 },
          { size: 'XXL', inStock: 0 },
        ], // Reset sizes to default
        price: '',
        featured: 'No', // Reset featured to "No" after submission
      });
    } catch (error) {
      console.error("Error creating apparel:", error);
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Add New Apparel</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Pictures (Upload multiple files):</label>
            <input
              type="file"
              name="pictures"
              accept="image/*"
              multiple
              onChange={handlePicturesChange}
            />
          </div>
          <div>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={newApparel.name}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Style:</label>
            <select
              name="style"
              value={newApparel.style}
              onChange={handleChange}
            >
              <option value="">Select Style</option>
              <option value="Hoodie">Hoodie</option>
              <option value="T-Shirt">T-Shirt</option>
            </select>
          </div>
          <div>
            <label>Price:</label>
            <input
              type="number"
              name="price"
              value={newApparel.price}
              onChange={handleChange}
              placeholder="Enter price"
            />
          </div>

          <div>
            <h4>Sizes and Stock:</h4>
            {newApparel.sizes.map((sizeStock, index) => (
              <div key={index} className="size-stock-pair">
                <div className="size">{sizeStock.size}</div> {/* Display the static size */}
                <input
                  type="number"
                  name={`stock_${index}`}
                  value={sizeStock.inStock || 0} // Default to 0 if no stock is entered
                  onChange={handleChange}
                  placeholder="Stock quantity"
                />
              </div>
            ))}
          </div>

          <div>
            <label>Featured:</label>
            <select
              name="featured"
              value={newApparel.featured}
              onChange={handleChange}
            >
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>

          <button type="submit">Submit</button>
          <button type="button" onClick={closeForm}>Cancel</button>
        </form>
        </div>
    </div>
  );
};

export default AddApparelForm;
