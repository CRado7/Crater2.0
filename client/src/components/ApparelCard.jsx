import React from 'react';
import { useNavigate } from 'react-router-dom'; // Use this instead of useHistory
import '../styles/ApparelCard.css';

const ApparelCard = ({ apparel }) => {
  const navigate = useNavigate(); // This replaces useHistory

  const handleCardClick = () => {
    navigate(`/apparel/${apparel._id}`); // Navigate to the product detail page using the product ID
  };

  return (
    <div className="apparel-card" onClick={handleCardClick}>
      <div className="apparel-image-container">
        <img
          src={apparel.picture} // Image URL for the apparel item
          alt={apparel.name} // Name as alt text for image
          className="apparel-image"
        />
      </div>
      <div className="apparel-details">
        <h3 className="apparel-name">{apparel.name}</h3>
        <p className="apparel-price">${apparel.price}</p>
        {apparel.size && <p className="apparel-size">{`Size: ${apparel.size}`}</p>}
        {apparel.color && <p className="apparel-color">{`Color: ${apparel.color}`}</p>}
      </div>
    </div>
  );
};

export default ApparelCard;
