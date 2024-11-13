import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { GET_SNOWBOARD } from '../utils/queries';
import { INCREMENT_SNOWBOARD_VIEWS } from '../utils/mutations';
import '../styles/SnowboardDetailPage.css';

const SnowboardDetailPage = () => {
  const { id } = useParams();
  const { loading, error, data } = useQuery(GET_SNOWBOARD, { variables: { id } });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState(''); // Initialize size state
  const [incrementSnowboardViews] = useMutation(INCREMENT_SNOWBOARD_VIEWS);

  useEffect(() => {
    incrementSnowboardViews({ variables: { id } })
      .then((response) => {
        console.log('Views incremented:', response);
      })
      .catch((err) => {
        console.error('Error incrementing views:', err);
      });
  }, [id, incrementSnowboardViews]);

    // Handle image navigation
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

  // Handle add to cart
  const handleAddToCart = () => {
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

    // Retrieve cart from local storage or initialize an empty array
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Check if item with same ID and size is already in the cart
    const existingItemIndex = cart.findIndex((item) => item.productId === id && item.size === size);

    if (existingItemIndex >= 0) {
      cart[existingItemIndex].quantity += quantity;
    } else {
      cart.push({
        productId: id,
        name: data.getSnowboard.name,
        price: data.getSnowboard.price,
        quantity,
        size,
        type,
        image: data.getSnowboard.picture[0], // Use single image field
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Item added to cart!');
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const snowboard = data.getSnowboard;

  return (
    <div className="snowboard-detail-container">
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
          <select
            id="size"
            onChange={(e) => setSize(e.target.value)}
            value={size}
          >
            <option value="">Select Size</option>
            {snowboard.sizes.map((sizeOption, index) => (
              <option 
                key={index} 
                value={sizeOption.size} 
                disabled={sizeOption.inStock === 0} // Disable out-of-stock sizes
              >
                {sizeOption.size} {sizeOption.inStock === 0 && '(Out of Stock)'}
              </option>
            ))}
          </select>
        </div>

        <button onClick={handleAddToCart} className="add-to-cart-button">
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default SnowboardDetailPage;
