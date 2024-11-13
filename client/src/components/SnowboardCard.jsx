import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ProductCard.css';

const SnowboardCard = ({ snowboard }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/snowboard/${snowboard._id}`);
  };

  useEffect(() => {
    console.log(snowboard);
  }, [snowboard]);

  return (
    <div className="product-card" onClick={handleCardClick}>
      <div className="product-image-container">
        {snowboard?.picture && (
          <img
            src={snowboard.picture} // Image URL for the snowboard item
            alt={snowboard.name} // Name as alt text for image
            className="product-image"
          />
        )}
      </div>
      <div className="product-details">
        <h3 className="product-name">{snowboard?.name}</h3>
        <div className="specs-container">
          <p className="snowboard-shape specs">{`${snowboard?.shape || 'N/A'}`}</p>
          <p className="snowboard-flex specs">{`Flex - ${snowboard?.flex || 'N/A'}`}</p>
          <p className="snowboard-construction specs">{`${snowboard?.boardConstruction || 'N/A'}`}</p>
          <p className="product-price">${snowboard?.price || 'N/A'}</p>
        </div>
      </div>
    </div>
  );
};

export default SnowboardCard;
