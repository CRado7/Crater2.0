import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_SNOWBOARD } from "../../../utils/mutations"; // Adjust the path if needed
import CloudinaryUploader from "../../CloudinaryUploader"; // Import CloudinaryUploader
import "../../../styles/AddForm.css"; 

const AddSnowboardForm = ({ closeForm }) => {
  const [newBoard, setNewBoard] = useState({
    pictures: [],
    name: "",
    shape: "",
    sizes: [{ size: "", inStock: 0 }], // Initialize with one size-stock pair
    flex: "",
    boardConstruction: "",
    price: "",
    featured: "No", // String to match the select options
  });

  const [createSnowboard] = useMutation(CREATE_SNOWBOARD);

  // Options for the select fields
  const shapes = ["twin", "directional-twin", "directional", "directional-powder"];
  const flexTypes = ["soft", "medium", "stiff"];
  const boardConstructions = ["traditional", "hybrid", "rocker", "camber"];

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("stock_") || name.startsWith("size_")) {
      const index = parseInt(name.split("_")[1], 10);
      const field = name.startsWith("stock_") ? "inStock" : "size";
      const updatedSizes = [...newBoard.sizes];
      updatedSizes[index] = { ...updatedSizes[index], [field]: value || 0 };
      setNewBoard({ ...newBoard, sizes: updatedSizes });
    } else {
      setNewBoard({
        ...newBoard,
        [name]: value,
      });
    }
  };

  // Handle picture uploads from CloudinaryUploader
  const handleCloudinaryUpload = (urls) => {
    setNewBoard({ ...newBoard, pictures: urls });
  };

  // Add new size-stock pair to the sizes array
  const handleAddSizeStock = () => {
    setNewBoard({
      ...newBoard,
      sizes: [...newBoard.sizes, { size: "", inStock: 0 }],
    });
  };

  // Remove a size-stock pair from the sizes array
  const handleRemoveSizeStock = (index) => {
    const updatedSizes = newBoard.sizes.filter((_, i) => i !== index);
    setNewBoard({ ...newBoard, sizes: updatedSizes });
  };

  // Submit form to create snowboard
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createSnowboard({
        variables: {
          pictures: newBoard.pictures,
          name: newBoard.name,
          shape: newBoard.shape,
          sizes: newBoard.sizes.map(({ size, inStock }) => ({
            size,
            inStock: parseInt(inStock, 10),
          })),
          flex: newBoard.flex,
          boardConstruction: newBoard.boardConstruction,
          price: parseFloat(newBoard.price),
          featured: newBoard.featured === "Yes",
        },
      });

      closeForm(); // Close the form after submitting
      setNewBoard({
        pictures: [],
        name: "",
        shape: "",
        sizes: [{ size: "", inStock: 0 }],
        flex: "",
        boardConstruction: "",
        price: "",
        featured: "No",
      }); // Reset form fields
    } catch (error) {
      console.error("Error creating snowboard:", error);
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Add New Snowboard</h2>
        <form onSubmit={handleSubmit}>
          {/* Snowboard Name */}
          <div>
            <label>Snowboard Name:</label>
            <input
              type="text"
              name="name"
              value={newBoard.name}
              onChange={handleChange}
              placeholder="Enter snowboard name"
            />
          </div>

          {/* Cloudinary Image Upload */}
          <div>
            <label>Upload Pictures:</label>
            <CloudinaryUploader
              uploadPreset="my_unsigned_preset" // Replace with your Cloudinary preset
              cloudName="dwp2h5cak" // Replace with your Cloudinary cloud name
              folderPath="Crater2.0/snowboards" // Folder path for the images
              onUploadComplete={handleCloudinaryUpload}
            />
          </div>

          {/* Snowboard Shape */}
          <div>
            <label>Shape:</label>
            <select name="shape" value={newBoard.shape} onChange={handleChange}>
              <option value="">Select Shape</option>
              {shapes.map((shape, index) => (
                <option key={index} value={shape}>
                  {shape}
                </option>
              ))}
            </select>
          </div>

          {/* Flex Type */}
          <div>
            <label>Flex:</label>
            <select name="flex" value={newBoard.flex} onChange={handleChange}>
              <option value="">Select Flex</option>
              {flexTypes.map((flex, index) => (
                <option key={index} value={flex}>
                  {flex}
                </option>
              ))}
            </select>
          </div>

          {/* Board Construction */}
          <div>
            <label>Board Construction:</label>
            <select
              name="boardConstruction"
              value={newBoard.boardConstruction}
              onChange={handleChange}
            >
              <option value="">Select Construction</option>
              {boardConstructions.map((construction, index) => (
                <option key={index} value={construction}>
                  {construction}
                </option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div>
            <label>Price:</label>
            <input
              type="number"
              name="price"
              value={newBoard.price}
              onChange={handleChange}
              min="0"
              step="0.01"
              placeholder="Enter price"
            />
          </div>

          {/* Sizes and Stock */}
          <div>
            <h4>Sizes and Stock:</h4>
            {newBoard.sizes.map((sizeStock, index) => (
              <div key={index} className="size-stock-container">
                <div className="size-stock-field">
                  <input
                    type="text"
                    name={`size_${index}`}
                    value={sizeStock.size}
                    onChange={handleChange}
                    placeholder="Size"
                  />
                  <input
                    type="number"
                    name={`stock_${index}`}
                    value={sizeStock.inStock || 0}
                    onChange={handleChange}
                    placeholder="Stock"
                    min="0"
                  />
                </div>
                <button type="button" onClick={() => handleRemoveSizeStock(index)} className="remove">
                  Remove
                </button>
              </div>
            ))}
            <button type="button" onClick={handleAddSizeStock}>
              Add Size/Stock
            </button>
          </div>

          {/* Featured */}
          <div>
            <label>Featured:</label>
            <select
              name="featured"
              value={newBoard.featured}
              onChange={handleChange}
            >
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>

          {/* Submit and Cancel Buttons */}
          <button type="submit">Add Snowboard</button>
          <button type="button" onClick={closeForm}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddSnowboardForm;
