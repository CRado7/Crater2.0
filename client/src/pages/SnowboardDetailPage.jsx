import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { GET_SNOWBOARD } from '../utils/queries';
import { ADD_TO_CART } from '../utils/mutations'; // Import the mutation
import { INCREMENT_SNOWBOARD_VIEWS } from '../utils/mutations';
import '../styles/ProductDetailsPage.css';

const SnowboardDetailPage = () => {
  const { id } = useParams();
  const { loading, error, data } = useQuery(GET_SNOWBOARD, { variables: { id } });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState('');
  const [incrementSnowboardViews] = useMutation(INCREMENT_SNOWBOARD_VIEWS);
  const [addToCart] = useMutation(ADD_TO_CART); // Use the ADD_TO_CART mutation

  useEffect(() => {
    incrementSnowboardViews({ variables: { id } })
      .then((response) => {
        console.log('Views incremented:', response);
      })
      .catch((err) => {
        console.error('Error incrementing views:', err);
      });
  }, [id, incrementSnowboardViews]);

  const handleImageNavigation = (direction) => {
    setCurrentImageIndex((prevIndex) => {
      if (direction === 'next') {
        return (prevIndex + 1) % data.getSnowboard.pictures.length;
      }
      if (direction === 'prev') {
        return (prevIndex - 1 + data.getSnowboard.pictures.length) % data.getSnowboard.pictures.length;
      }
    });
  };

  // Handle add to cart with mutation
  const handleAddToCart = async () => {
    if (!size) {
      alert('Please select a size!');
      return;
    }
  
    const type = 'snowboard';
    const selectedSize = data.getSnowboard.sizes.find((s) => s.size === size);
  
    if (selectedSize && selectedSize.inStock < quantity) {
      alert('Sorry, not enough stock for this size!');
      return;
    }
  
    try {
      // Wrap the input data in an "input" object as expected by the mutation
      await addToCart({
        variables: {
          input: {
            productId: id,
            name: data.getSnowboard.name,
            price: data.getSnowboard.price,
            quantity,
            size,
            type,
            image: data.getSnowboard.picture[0], // Use the first image
          },
        },
      });
  
      alert('Item added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };
  

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const snowboard = data.getSnowboard;

  return (
    <div className="product-details-container">
      <div className="image-container">
        {snowboard.picture.length > 1 && (
          <>
            <button className="nav-button prev" onClick={() => handleImageNavigation('prev')}>
              &#8592;
            </button>
            <button className="nav-button next" onClick={() => handleImageNavigation('next')}>
              &#8594;
            </button>
          </>
        )}
        <img
          src={snowboard.picture[currentImageIndex]}
          alt={snowboard.name}
          className="product-image"
        />
      </div>

      <div className="product-info">
        <h1>{snowboard.name}</h1>
        <p className="product-price">${snowboard.price}</p>
        <p>Shape: {snowboard.shape}</p>
        <p>Flex: {snowboard.flex}</p>
        <p>Construction: {snowboard.boardConstruction}</p>

        {/* Quantity and Size Selection */}
        <div className="quantity">
          <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
          <span>{quantity}</span>
          <button onClick={() => setQuantity(quantity + 1)}>+</button>
        </div>

        {/* Size Selection */}
        <div className="size-selection">
          <label htmlFor="size">Size: </label>
          <div className="size-buttons">
            {snowboard.sizes.map((sizeOption, index) => (
              <button
                key={index}
                className={`size-button ${sizeOption.inStock === 0 ? 'out-of-stock' : ''} ${size === sizeOption.size ? 'selected' : ''}`}
                onClick={() => setSize(sizeOption.size)}
                disabled={sizeOption.inStock === 0} // Disable out-of-stock sizes
              >
                {sizeOption.size} {sizeOption.inStock === 0 && '(Out of Stock)'}
              </button>
            ))}
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className={`add-to-cart-button ${size ? 'active' : ''}`}
        >
          {size ? 'Add to Cart' : 'Select a Size'}
        </button>
      </div>
    </div>
  );
};

export default SnowboardDetailPage;
