import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ALL_SNOWBOARDS } from '../../utils/queries'; // Adjust path as needed
import { DELETE_SNOWBOARD } from '../../utils/mutations'; // Adjust path as needed
import DeleteSnowboardForm from '../admin/delete/DeleteSnowboardForm'; // Adjust path as needed
import UpdateSnowboardForm from '../admin/update/UpdateSnowboardForm'; // Adjust path as needed

const AdminSnowboardCard = () => {
  const { loading, error, data } = useQuery(GET_ALL_SNOWBOARDS);
  const [showDeletePopup, setShowDeletePopup] = useState(null); // Track which snowboard to delete
  const [showUpdatePopup, setShowUpdatePopup] = useState(null); // Track which snowboard to update

  const [deleteSnowboard] = useMutation(DELETE_SNOWBOARD, {
    refetchQueries: [{ query: GET_ALL_SNOWBOARDS }], // Refetch data after deletion
    onCompleted: () => {
      console.log("Snowboard deleted successfully");
      setShowDeletePopup(null); // Close the popup
    },
    onError: (error) => {
      console.error("Error deleting snowboard:", error);
    },
  });

  if (loading) return <p>Loading Snowboards...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const handleDelete = async () => {
    try {
      await deleteSnowboard({ variables: { id: showDeletePopup._id } });
    } catch (error) {
      console.error("Error deleting snowboard:", error);
    }
  };

  return (
    <div className="snowboard-cards-container">
      {data.getAllSnowboards.map((snowboard) => (
        <div key={snowboard._id} className="snowboard-card">
          <img
            src={snowboard.picture[0]}
            alt={snowboard.name}
            className="snowboard-picture"
          />
          <h3>{snowboard.name}</h3>

          <div className="sizes-container">
            <ul>
              {snowboard.sizes.map((size, index) => (
                <li key={index} className="size-item">
                  <span className="size-stock">{size.inStock || 'N/A'}</span>
                  <span>{size.size}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Buttons to trigger delete and update popups */}
          <button onClick={() => setShowDeletePopup(snowboard)}>Delete</button>
          <button onClick={() => setShowUpdatePopup(snowboard)}>Update Stock</button>
        </div>
      ))}

      {/* Conditional rendering for DeletePopup */}
      {showDeletePopup && (
        <DeleteSnowboardForm
          itemName={showDeletePopup.name}
          onDelete={handleDelete}
          onClose={() => setShowDeletePopup(null)}
        />
      )}

      {/* Conditional rendering for UpdatePopup */}
      {showUpdatePopup && (
        <UpdateSnowboardForm
          item={showUpdatePopup}
          onUpdate={(updatedSizes) => {
            // Implement your update functionality here
            setShowUpdatePopup(null); // Close popup after updating
          }}
          onClose={() => setShowUpdatePopup(null)}
        />
      )}
    </div>
  );
};

export default AdminSnowboardCard;
