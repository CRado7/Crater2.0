import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ProductCard.css';

const SnowboardCard = ({ snowboard, className = '' }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/snowboard/${snowboard._id}`);
  };

  useEffect(() => {
    console.log(snowboard);
  }, [snowboard]);

  return (
    <div className={ `product-card ${className}`} onClick={handleCardClick}>
      <div className="product-image-container">
        {snowboard?.pictures && (
          <img
            src={snowboard.pictures[0]} // Image URL for the snowboard item
            alt={snowboard.name} // Name as alt text for image
            className="product-image"
          />
        )}
      </div>
      <div className="product-card-details">
        <h1 className="product-name">{snowboard?.name}</h1>
          <p className="price">${snowboard?.price || 'N/A'}</p>
      </div>
    </div>
  );
};

export default SnowboardCard;
