import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation} from '@apollo/client';
import { GET_APPAREL } from '../utils/queries';
import { INCREMENT_APPAREL_VIEWS } from '../utils/mutations';
import '../styles/ApparelDetailPage.css';

const ApparelDetailPage = () => {
  const { id } = useParams(); // Get the product ID from the URL
  const { loading, error, data } = useQuery(GET_APPAREL, { variables: { id } });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState(''); // Initialize size state
  const [incrementApparelViews] = useMutation(INCREMENT_APPAREL_VIEWS);

  useEffect(() => {
    incrementApparelViews({ variables: { id } })
      .then((response) => {
        console.log('Views incremented:', response);
      })
      .catch((err) => {
        console.error('Error incrementing views:', err);
      });
  }, [id, incrementApparelViews]);

  // Handle image navigation
  const handleImageNavigation = (direction) => {
    setCurrentImageIndex((prevIndex) => {
      if (direction === 'next') {
        return (prevIndex + 1) % data.getApparel.pictures.length;
      }
      if (direction === 'prev') {
        return (prevIndex - 1 + data.getApparel.pictures.length) % data.getApparel.pictures.length;
      }
    });
  };

  // Handle add to cart
  const handleAddToCart = () => {
    if (!size) {
      alert('Please select a size!');
      return;
    }

    const type = 'apparel';
    const selectedSize = data.getApparel.sizes.find((s) => s.size === size);

    if (selectedSize && selectedSize.inStock < quantity) {
      alert('Sorry, not enough stock for this size!');
      return;
    }

    // Retrieve cart from local storage or initialize an empty array
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Check if item with same ID and size is already in the cart
    const existingItemIndex = cart.findIndex((item) => item.productId === id && item.size === size);

    if (existingItemIndex >= 0) {
      // If item already exists, update its quantity
      cart[existingItemIndex].quantity += quantity;
    } else {
      // Otherwise, add new item to cart
      cart.push({
        productId: id,
        name: data.getApparel.name,
        price: data.getApparel.price,
        quantity,
        size,
        type,
        image: data.getApparel.pictures[0],
      });
    }

    // Save updated cart to local storage
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Item added to cart!');
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const apparel = data.getApparel;

  return (
    <div className="apparel-detail-container">
      <div className="image-container">
        {apparel.pictures.length > 1 && (
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
          src={apparel.pictures[currentImageIndex]}
          alt={apparel.name}
          className="product-image"
        />
      </div>

      <div className="product-info">
        <h1>{apparel.name}</h1>
        <p className="product-price">${apparel.price}</p>
        <p>{apparel.style}</p>

        {/* Add quantity and size selection */}
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
            onChange={(e) => setSize(e.target.value)} // Update size state
            value={size} // Controlled input
          >
            <option value="">Select Size</option> {/* Default option */}
            {apparel.sizes.map((sizeOption, index) => (
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

        {/* Add to Cart Button */}
        <button onClick={handleAddToCart} className="add-to-cart-button">
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ApparelDetailPage;
