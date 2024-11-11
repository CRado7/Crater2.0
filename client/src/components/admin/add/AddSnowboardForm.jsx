import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_SNOWBOARD } from '../../../utils/mutations'; // Import the mutation
import React from 'react';

const AddSnowboardForm = ({ closeForm }) => {
  const [newBoard, setNewBoard] = useState({
    picture: '',
    name: '',
    shape: '',
    sizes: [], // This will now be an array of objects, each having a size and stock
    flex: '',
    boardConstruction: ''
  });

  const [createSnowboard] = useMutation(CREATE_SNOWBOARD);

  // Assuming these are your possible enum values from the schema
  const shapes = ['Freestyle', 'All-Mountain', 'Powder', 'Freeride']; // Example values
  const flexTypes = ['Soft', 'Medium', 'Stiff']; // Example values
  const boardConstructions = ['Wood', 'Fiberglass', 'Carbon', 'Aluminum']; // Example values

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'sizes') {
      const selectedSizes = value.split(',').map(size => size.trim());
      setNewBoard({
        ...newBoard,
        sizes: selectedSizes.map(size => ({ size, stock: '' })) // Initialize stock for each size
      });
    } else if (name.includes('stock')) {
      const [action, index] = name.split('_');
      const updatedSizes = [...newBoard.sizes];
      updatedSizes[index].stock = value; // Update stock for specific size
      setNewBoard({ ...newBoard, sizes: updatedSizes });
    } else {
      setNewBoard({
        ...newBoard,
        [name]: value
      });
    }
  };

  // Add a new size and stock pair
  const handleAddSizeStock = () => {
    setNewBoard({
      ...newBoard,
      sizes: [...newBoard.sizes, { size: '', stock: '' }]
    });
  };

  // Remove a size and stock pair
  const handleRemoveSizeStock = (index) => {
    const updatedSizes = newBoard.sizes.filter((_, i) => i !== index);
    setNewBoard({ ...newBoard, sizes: updatedSizes });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createSnowboard({
        variables: {
          picture: newBoard.picture,
          name: newBoard.name,
          shape: newBoard.shape,
          sizes: newBoard.sizes.map(item => item.size), // Only pass sizes
          flex: newBoard.flex,
          boardConstruction: newBoard.boardConstruction,
          stock: newBoard.sizes.reduce((acc, item) => {
            acc[item.size] = item.stock; // Map sizes to stock values
            return acc;
          }, {}) // Convert sizes and stock into a key-value pair for stock
        }
      });
      // Close the form after successful creation
      closeForm();
      setNewBoard({
        picture: '',
        name: '',
        shape: '',
        sizes: [],
        flex: '',
        boardConstruction: ''
      });
    } catch (error) {
      console.error("Error creating snowboard:", error);
    }
  };

  return (
    <div className="add-snowboard-form">
      <h2>Add New Snowboard</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Picture URL:</label>
          <input
            type="text"
            name="picture"
            value={newBoard.picture}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={newBoard.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Shape:</label>
          <select
            name="shape"
            value={newBoard.shape}
            onChange={handleChange}
          >
            <option value="">Select Shape</option>
            {shapes.map((shape, index) => (
              <option key={index} value={shape}>{shape}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Flex:</label>
          <select
            name="flex"
            value={newBoard.flex}
            onChange={handleChange}
          >
            <option value="">Select Flex</option>
            {flexTypes.map((flex, index) => (
              <option key={index} value={flex}>{flex}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Board Construction:</label>
          <select
            name="boardConstruction"
            value={newBoard.boardConstruction}
            onChange={handleChange}
          >
            <option value="">Select Board Construction</option>
            {boardConstructions.map((construction, index) => (
              <option key={index} value={construction}>{construction}</option>
            ))}
          </select>
        </div>

        {/* Dynamically render size and stock input fields */}
        {newBoard.sizes.length > 0 && (
          <div>
            <h4>Sizes and Stock:</h4>
            {newBoard.sizes.map((sizeStock, index) => (
              <div key={index} className="size-stock-pair">
                <input
                  type="text"
                  name={`size_${index}`}
                  value={sizeStock.size}
                  onChange={e => handleChange(e)}
                  placeholder="Enter size"
                />
                <input
                  type="number"
                  name={`stock_${index}`}
                  value={sizeStock.stock}
                  onChange={e => handleChange(e)}
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

export default AddSnowboardForm;
