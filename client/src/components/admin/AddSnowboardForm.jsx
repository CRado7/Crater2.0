import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_SNOWBOARD } from '../../utils/mutations'; // Import the mutation

const AddSnowboardForm = ({ closeForm }) => {
  const [newBoard, setNewBoard] = useState({
    picture: '',
    name: '',
    shape: '',
    sizes: [],
    flex: '',
    boardConstruction: ''
  });

  const [createSnowboard] = useMutation(CREATE_SNOWBOARD);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewBoard({
      ...newBoard,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createSnowboard({
        variables: {
          picture: newBoard.picture,
          name: newBoard.name,
          shape: newBoard.shape,
          sizes: newBoard.sizes.split(','),
          flex: newBoard.flex,
          boardConstruction: newBoard.boardConstruction
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
          <input
            type="text"
            name="shape"
            value={newBoard.shape}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Sizes (comma separated):</label>
          <input
            type="text"
            name="sizes"
            value={newBoard.sizes}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Flex:</label>
          <input
            type="text"
            name="flex"
            value={newBoard.flex}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Board Construction:</label>
          <input
            type="text"
            name="boardConstruction"
            value={newBoard.boardConstruction}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Submit</button>
        <button type="button" onClick={closeForm}>Cancel</button>
      </form>
    </div>
  );
};

export default AddSnowboardForm;
