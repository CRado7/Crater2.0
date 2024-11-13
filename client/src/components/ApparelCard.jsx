import React from 'react';
import { useNavigate } from 'react-router-dom'; // Use this instead of useHistory
import '../styles/productCard.css';

const ApparelCard = ({ apparel }) => {
  const navigate = useNavigate(); // This replaces useHistory

  const handleCardClick = () => {
    navigate(`/apparel/${apparel._id}`); // Navigate to the product detail page using the product ID
  };

  return (
    <div className="product-card" onClick={handleCardClick}>
      <div className="product-image-container">
        <img
          src={apparel.picture} // Image URL for the apparel item
          alt={apparel.name} // Name as alt text for image
          className="product-image"
        />
      </div>
      <div className="product-details">
        <h3 className="product-name">{apparel.name}</h3>
        <p className="product-price">${apparel.price}</p>
      </div>
    </div>
  );
};

export default ApparelCard;
