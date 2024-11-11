import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_ALL_SNOWBOARDS } from '../../utils/queries'; // Adjust path as needed
import DeleteSnowboardForm from '../admin/delete/DeleteSnowboardForm'; // Adjust path as needed
import UpdateSnowboardForm from '../admin/update/UpdateSnowboardForm'; // Adjust path as needed

const AdminSnowboardCard = () => {
  const { loading, error, data } = useQuery(GET_ALL_SNOWBOARDS);
  const [showDeletePopup, setShowDeletePopup] = useState(null); // Track which snowboard to delete
  const [showUpdatePopup, setShowUpdatePopup] = useState(null); // Track which snowboard to update

  if (loading) return <p>Loading Snowboards...</p>;
  if (error) return <p>Error: {error.message}</p>;

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
          onDelete={() => {
            // Implement your delete functionality here
            setShowDeletePopup(null); // Close popup after deletion
          }}
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
