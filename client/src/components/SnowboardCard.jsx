import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ProductCard.css';

const SnowboardCard = ({ snowboard }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/snowboard/${snowboard._id}`);
  };

  // Determine the flex value and map it to a percentage
  const getFlexBarWidth = (flex) => {
    switch (flex) {
      case 'soft':
        return '25%'; // Unfilled
      case 'medium':
        return '60%'; // Half-filled
      case 'stiff':
        return '90%'; // Fully filled
      default:
        return '0%'; // Default if flex is not provided
    }
  };

  useEffect(() => {
    console.log(snowboard);
  }, [snowboard]);

  return (
    <div className="product-card" onClick={handleCardClick}>
      <div className="product-image-container">
        {snowboard?.pictures && (
          <img
            src={snowboard.pictures[0]} // Image URL for the snowboard item
            alt={snowboard.name} // Name as alt text for image
            className="product-image"
          />
        )}
      </div>
      <div className="product-details">
        <h1 className="product-name">{snowboard?.name}</h1>
        <div className="specs-container">
          <p className="snowboard-shape specs">{`${snowboard?.shape || 'N/A'}`}</p>
          {/* <p className="snowboard-flex specs">{`Flex - ${snowboard?.flex || 'N/A'}`}</p> */}
          <p className="snowboard-construction specs">{`${snowboard?.boardConstruction || 'N/A'}`}</p>
          <p className="snowboard-flex specs">Flex</p>

          {/* Flex Bar with Labels */}
          <div className="flex-bar-container">
            <div
              className="flex-bar"
              style={{ width: getFlexBarWidth(snowboard?.flex) }}
            />
          </div>
          <div className="flex-labels">
            <span>Soft</span>
            <span>Medium</span>
            <span>Stiff</span>
          </div>

          <p className="product-price">${snowboard?.price || 'N/A'}</p>
        </div>
      </div>
    </div>
  );
};

export default SnowboardCard;
