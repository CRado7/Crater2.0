import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SnowboardCard.css';

const SnowboardCard = ({ snowboard }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/snowboard/${snowboard._id}`);
  };

  useEffect(() => {
    console.log(snowboard);
  }, [snowboard]);

  return (
    <div className="snowboard-card" onClick={handleCardClick}>
      <div className="snowboard-image-container">
        {snowboard?.picture && (
          <img
            src={snowboard.picture} // Image URL for the snowboard item
            alt={snowboard.name} // Name as alt text for image
            className="snowboard-image"
          />
        )}
      </div>
      <div className="snowboard-details">
        <h3 className="snowboard-name">{snowboard?.name}</h3>
        <p className="snowboard-shape">{`Shape: ${snowboard?.shape || 'N/A'}`}</p>
        <p className="snowboard-flex">{`Flex: ${snowboard?.flex || 'N/A'}`}</p>
        <p className="snowboard-construction">{`Construction: ${snowboard?.boardConstruction || 'N/A'}`}</p>
        <p className="snowboard-price">${snowboard?.price || 'N/A'}</p>
        {snowboard?.size && <p className="snowboard-size">{`Size: ${snowboard.size}`}</p>}
        {snowboard?.color && <p className="snowboard-color">{`Color: ${snowboard.color}`}</p>}
      </div>
    </div>
  );
};

export default SnowboardCard;
