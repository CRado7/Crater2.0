import { useQuery } from '@apollo/client';
import { GET_ALL_APPAREL } from '../../utils/queries'; // Adjust path to your queries file
import React from 'react';

const AdminApparelCard = React.memo(() => {
  const { loading, error, data } = useQuery(GET_ALL_APPAREL);

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
                  <span className="size-stock">{size.inStock ? size.inStock : 'N/A'}</span> {/* Stock value per size */}
                  <span>{size.size}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
});

export default AdminApparelCard;

