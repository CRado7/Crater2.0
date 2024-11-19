import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ALL_APPAREL } from '../../utils/queries'; // Adjust path as needed
import { DELETE_APPAREL } from '../../utils/mutations'; // Adjust path as needed
import DeleteApparelForm from '../admin/delete/DeleteApparelForm'; // Adjust path as needed
import UpdateApparelForm from '../admin/update/UpdateApparelForm'; // Adjust path as needed
import '../../styles/ProductCard.css'; // Import styles

const AdminApparelCard = React.memo(() => {
  const { loading, error, data } = useQuery(GET_ALL_APPAREL);
  const [showDeletePopup, setShowDeletePopup] = useState(null); // Track which item to delete
  const [showUpdatePopup, setShowUpdatePopup] = useState(null); // Track which item to update

  // Set up DELETE_APPAREL mutation
  const [deleteApparel] = useMutation(DELETE_APPAREL, {
    refetchQueries: [{ query: GET_ALL_APPAREL }], // Refetch apparel after deletion
    onCompleted: () => {
      console.log("Apparel item deleted successfully");
      setShowDeletePopup(null); // Close the delete popup
    },
    onError: (error) => {
      console.error("Error deleting apparel:", error);
    },
  });

  if (loading) return <p>Loading Apparel...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const handleDelete = async () => {
    try {
      await deleteApparel({ variables: { id: showDeletePopup._id } });
    } catch (error) {
      console.error("Error deleting apparel:", error);
    }
  };

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
                  <span>{size.size}: </span>
                  <span className="size-stock">{size.inStock || 0}</span>
                </li>
              ))}
            </ul>
          </div>
          <h3>${apparel.price}</h3>
          <p>Featured: {apparel.featured ? "Yes" : "No"}</p>

          {/* Buttons to trigger delete and update popups */}
          <button onClick={() => setShowDeletePopup(apparel)}>Delete</button>
          <button onClick={() => setShowUpdatePopup(apparel)}>Update Item</button>
        </div>
      ))}

      {/* Conditional rendering for DeletePopup */}
      {showDeletePopup && (
        <DeleteApparelForm
          itemName={showDeletePopup.name}
          onDelete={handleDelete} // Call delete function
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
