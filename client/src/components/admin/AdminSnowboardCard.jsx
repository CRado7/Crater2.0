import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ALL_SNOWBOARDS } from '../../utils/queries'; // Adjust path as needed
import { DELETE_SNOWBOARD } from '../../utils/mutations'; // Adjust path as needed
import DeleteSnowboardForm from '../admin/delete/DeleteSnowboardForm'; // Adjust path as needed
import UpdateSnowboardForm from '../admin/update/UpdateSnowboardForm'; // Adjust path as needed
import '../../styles/ProductCard.css'; // Import styles

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
            src={snowboard.pictures[0]}
            alt={snowboard.name}
            className="snowboard-picture"
          />
          <h3>{snowboard.name}</h3>

          <div className="sizes-container">
            <ul>
              {snowboard.sizes.map((size, index) => (
                <li key={index} className="size-item">
                  <span>{size.size}: </span>
                  <span className="size-stock">{size.inStock || 0}</span>
                </li>
              ))}
            </ul>
          </div>
          <h3>${snowboard.price}</h3>
          <p>Featured: {snowboard.featured ? "Yes" : "No"}</p>

          {/* Buttons to trigger delete and update popups */}
          <button onClick={() => setShowDeletePopup(snowboard)}>Delete</button>
          <button onClick={() => setShowUpdatePopup(snowboard)}>Update Board</button>
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
