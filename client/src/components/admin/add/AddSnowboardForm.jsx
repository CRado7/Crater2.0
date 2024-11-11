import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_SNOWBOARD } from '../../../utils/mutations'; // Adjust path to your mutation

const AddSnowboardForm = ({ closeForm }) => {
  const [newBoard, setNewBoard] = useState({
    picture: [''], // Initialize with one empty image URL
    name: '',
    shape: '',
    sizes: [{ size: '', inStock: '' }], // Initialize with one size and stock pair
    flex: '',
    boardConstruction: '',
    price: ''
  });

  const [createSnowboard] = useMutation(CREATE_SNOWBOARD);

  // Schema-enforced enums
  const shapes = ['twin', 'directional-twin', 'directional', 'directional-powder'];
  const flexTypes = ['soft', 'medium', 'stiff'];
  const boardConstructions = ['traditional', 'hybrid', 'rocker', 'camber'];

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith('size') || name.startsWith('inStock')) {
      const [field, index] = name.split('_');
      const updatedSizes = [...newBoard.sizes];
      updatedSizes[index][field] = value;
      setNewBoard({ ...newBoard, sizes: updatedSizes });
    } else if (name === 'picture') {
      const updatedPictures = [...newBoard.picture];
      updatedPictures[e.target.dataset.index] = value;
      setNewBoard({ ...newBoard, picture: updatedPictures });
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
      sizes: [...newBoard.sizes, { size: '', inStock: '' }]
    });
  };

  // Remove a size and stock pair
  const handleRemoveSizeStock = (index) => {
    const updatedSizes = newBoard.sizes.filter((_, i) => i !== index);
    setNewBoard({ ...newBoard, sizes: updatedSizes });
  };

  // Add a new picture URL input
  const handleAddPicture = () => {
    setNewBoard({
      ...newBoard,
      picture: [...newBoard.picture, '']
    });
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
          sizes: newBoard.sizes.map(({ size, inStock }) => ({ size, inStock: parseInt(inStock, 10) })),
          flex: newBoard.flex,
          boardConstruction: newBoard.boardConstruction,
          price: parseFloat(newBoard.price)
        }
      });
      closeForm();
      setNewBoard({
        picture: [''],
        name: '',
        shape: '',
        sizes: [{ size: '', inStock: '' }],
        flex: '',
        boardConstruction: '',
        price: ''
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
          <label>Picture URLs:</label>
          {newBoard.picture.map((pic, index) => (
            <div key={index}>
              <input
                type="text"
                name="picture"
                data-index={index}
                value={pic}
                onChange={handleChange}
                placeholder="Enter image URL"
              />
            </div>
          ))}
          <button type="button" onClick={handleAddPicture}>Add Another Picture</button>
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
          <select name="shape" value={newBoard.shape} onChange={handleChange}>
            <option value="">Select Shape</option>
            {shapes.map((shape, index) => (
              <option key={index} value={shape}>{shape}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Flex:</label>
          <select name="flex" value={newBoard.flex} onChange={handleChange}>
            <option value="">Select Flex</option>
            {flexTypes.map((flex, index) => (
              <option key={index} value={flex}>{flex}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Board Construction:</label>
          <select name="boardConstruction" value={newBoard.boardConstruction} onChange={handleChange}>
            <option value="">Select Construction</option>
            {boardConstructions.map((construction, index) => (
              <option key={index} value={construction}>{construction}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Price:</label>
          <input
            type="number"
            name="price"
            value={newBoard.price}
            onChange={handleChange}
            min="0"
            step="0.01"
          />
        </div>
        <div>
          <h4>Sizes and Stock:</h4>
          {newBoard.sizes.map((sizeStock, index) => (
            <div key={index} className="size-stock-pair">
              <input
                type="text"
                name={`size_${index}`}
                value={sizeStock.size}
                onChange={handleChange}
                placeholder="Enter size"
              />
              <input
                type="number"
                name={`inStock_${index}`}
                value={sizeStock.inStock}
                onChange={handleChange}
                placeholder="Stock quantity"
                min="0"
              />
              <button type="button" onClick={() => handleRemoveSizeStock(index)}>Remove</button>
            </div>
          ))}
          <button type="button" onClick={handleAddSizeStock}>Add Size/Stock</button>
        </div>
        <button type="submit">Submit</button>
        <button type="button" onClick={closeForm}>Cancel</button>
      </form>
    </div>
  );
};

export default AddSnowboardForm;
