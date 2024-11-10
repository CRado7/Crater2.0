import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_APPAREL } from '../../utils/mutations'; // Import the CREATE_APPAREL mutation

const AddApparelForm = ({ closeForm }) => {
  const [newApparel, setNewApparel] = useState({
    pictures: [],
    style: '',
    size: '',
  });

  const [createApparel] = useMutation(CREATE_APPAREL);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewApparel({
      ...newApparel,
      [name]: value
    });
  };

  const handlePicturesChange = (e) => {
    const files = Array.from(e.target.files);
    setNewApparel({
      ...newApparel,
      pictures: files.map((file) => URL.createObjectURL(file)) // Generate local object URLs for preview
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createApparel({
        variables: {
          pictures: newApparel.pictures, // Assuming pictures is an array of URLs (or paths to uploaded images)
          style: newApparel.style,
          size: newApparel.size,
        }
      });
      // Close the form after successful creation
      closeForm();
      setNewApparel({
        pictures: [],
        style: '',
        size: '',
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
        <div>
          <label>Size:</label>
          <input
            type="text"
            name="size"
            value={newApparel.size}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Submit</button>
        <button type="button" onClick={closeForm}>Cancel</button>
      </form>

      {/* Optional: Display selected pictures as thumbnails */}
      <div className="preview-images">
        {newApparel.pictures.length > 0 && (
          <h4>Preview:</h4>
        )}
        {newApparel.pictures.map((picture, index) => (
          <img key={index} src={picture} alt={`Preview ${index}`} width="100" height="100" />
        ))}
      </div>
    </div>
  );
};

export default AddApparelForm;
