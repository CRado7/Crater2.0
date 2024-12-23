import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_APPAREL } from '../../../utils/mutations';
import CloudinaryUploader from '../../CloudinaryUploader';
import '../../../styles/AddForm.css';

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
    ],
    price: '',
    featured: false,
  });

  const [createApparel] = useMutation(CREATE_APPAREL);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith('stock_')) {
      const index = parseInt(name.split('_')[1], 10);
      const updatedSizes = [...newApparel.sizes];
      updatedSizes[index] = {
        ...updatedSizes[index],
        inStock: value === "" ? 0 : parseInt(value, 10),
      };
      setNewApparel({ ...newApparel, sizes: updatedSizes });
    } else {
      setNewApparel({
        ...newApparel,
        [name]: value,
      });
    }
  };

  const handleCloudinaryUpload = (urls) => {
    setNewApparel({ ...newApparel, pictures: urls });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const sizesWithDefaults = newApparel.sizes.map((sizeStock) => ({
      size: sizeStock.size,
      inStock: sizeStock.inStock || 0,
    }));

    try {
      await createApparel({
        variables: {
          pictures: newApparel.pictures,
          name: newApparel.name,
          style: newApparel.style,
          sizes: sizesWithDefaults,
          price: parseFloat(newApparel.price),
          featured: newApparel.featured === "Yes",
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
        ],
        price: '',
        featured: 'No',
      });
    } catch (error) {
      console.error("Error creating apparel:", error);
    }
  };

  const folderPath = newApparel.style === 'Hoodie'
    ? 'Crater2.0/apparel/Hoodies'
    : newApparel.style === 'T-Shirt'
    ? 'Crater2.0/apparel/TShirts'
    : null;

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Add New Apparel</h2>
        <form onSubmit={handleSubmit}>
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

          {/* Conditionally Render CloudinaryUploader */}
          {folderPath ? (
            <div>
              <label>Upload Pictures:</label>
              <CloudinaryUploader
                uploadPreset="my_unsigned_preset"
                cloudName="dwp2h5cak"
                folderPath={folderPath}
                onUploadComplete={handleCloudinaryUpload}
              />
            </div>
          ) : (
            <p style={{ color: 'red' }}>Please select a style before uploading pictures.</p>
          )}

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
                <div className="size">{sizeStock.size}</div>
                <input
                  type="number"
                  name={`stock_${index}`}
                  value={sizeStock.inStock || 0}
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
