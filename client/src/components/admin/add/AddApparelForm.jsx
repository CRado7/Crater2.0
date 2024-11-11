import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_APPAREL } from '../../../utils/mutations';
import React from 'react';

const AddApparelForm = ({ closeForm }) => {
  const [newApparel, setNewApparel] = useState({
    pictures: [],
    name: '',
    style: '',
    sizes: [],
    price: '',
  });

  const [createApparel] = useMutation(CREATE_APPAREL);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith('size_')) {
      const index = parseInt(name.split('_')[1], 10);
      const updatedSizes = [...newApparel.sizes];
      updatedSizes[index] = { ...updatedSizes[index], size: value };
      setNewApparel({ ...newApparel, sizes: updatedSizes });
    } else if (name.startsWith('stock_')) {
      const index = parseInt(name.split('_')[1], 10);
      const updatedSizes = [...newApparel.sizes];
      updatedSizes[index] = { ...updatedSizes[index], inStock: parseInt(value, 10) };
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

  const handleAddSizeStock = () => {
    setNewApparel({
      ...newApparel,
      sizes: [...newApparel.sizes, { size: '', inStock: 0 }]
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
          pictures: newApparel.pictures,
          name: newApparel.name,
          style: newApparel.style,
          sizes: newApparel.sizes,
          price: parseFloat(newApparel.price),
        }
      });
      closeForm();
      setNewApparel({
        pictures: [],
        name: '',
        style: '',
        sizes: [],
        price: '',
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
              <select
                name={`size_${index}`}
                value={sizeStock.size}
                onChange={handleChange}
              >
                <option value="">Select Size</option>
                <option value="XS">XS</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
              </select>
              <input
                type="number"
                name={`stock_${index}`}
                value={sizeStock.inStock}
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

        <button type="submit">Submit</button>
        <button type="button" onClick={closeForm}>Cancel</button>
      </form>
    </div>
  );
};

export default AddApparelForm;
