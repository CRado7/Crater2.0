import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_ALL_APPAREL } from '../../utils/queries'; // Adjust path to your queries file
import DeleteApparelForm from '../admin/delete/DeleteApparelForm'; // Adjust path as needed
import UpdateApparelForm from '../admin/update/UpdateApparelForm'; // Adjust path as needed

const AdminApparelCard = React.memo(() => {
  const { loading, error, data } = useQuery(GET_ALL_APPAREL);
  const [showDeletePopup, setShowDeletePopup] = useState(null); // Track which item to delete
  const [showUpdatePopup, setShowUpdatePopup] = useState(null); // Track which item to update

  if (loading) return <p>Loading Apparel...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="apparel-cards-container">
      {data.getAllApparel.map((apparel) => (
        <div key={apparel._id} className="apparel-card">
          <img
            src={apparel.pictures[0]} // Assuming the first picture is the main image
            alt={apparel.name}
            className="apparel-picture"
          />
          <h3>{apparel.name}</h3>

          <div className="sizes-container">
            <ul>
              {apparel.sizes.map((size, index) => (
                <li key={index} className="size-item">
                  <span className="size-stock">{size.inStock || 'N/A'}</span>
                  <span>{size.size}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Buttons to trigger delete and update popups */}
          <button onClick={() => setShowDeletePopup(apparel)}>Delete</button>
          <button onClick={() => setShowUpdatePopup(apparel)}>Update Stock</button>
        </div>
      ))}

      {/* Conditional rendering for DeletePopup */}
      {showDeletePopup && (
        <DeleteApparelForm
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
        <UpdateApparelForm
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
});

export default AdminApparelCard;
