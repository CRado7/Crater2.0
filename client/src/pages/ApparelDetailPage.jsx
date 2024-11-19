import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { GET_APPAREL } from '../utils/queries'; // GraphQL query to fetch apparel data
import { ADD_TO_CART } from '../utils/mutations'; // GraphQL mutation to add items to cart
import { INCREMENT_APPAREL_VIEWS } from '../utils/mutations'; // Optional: Increment views
import '../styles/ProductDetailsPage.css';

const ApparelDetailPage = () => {
  const { id } = useParams(); // Get the product ID from the URL
  const { loading, error, data } = useQuery(GET_APPAREL, { variables: { id } });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState(''); // Initialize size state
  const [incrementApparelViews] = useMutation(INCREMENT_APPAREL_VIEWS); // Optional: Increment views
  const [addToCart] = useMutation(ADD_TO_CART); // GraphQL mutation to add item to the cart

  // Increment views for apparel item on mount
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

  // Handle add to cart with GraphQL mutation
  const handleAddToCart = async () => {
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

    try {
      // Use GraphQL mutation to add the item to the cart
      await addToCart({
        variables: {
          input: {
            productId: id,
            name: data.getApparel.name,
            price: data.getApparel.price,
            quantity,
            size,
            type,
            image: data.getApparel.pictures[0], // Use the first image
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

  const apparel = data.getApparel;

  return (
    <div className="product-details-container">
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
        <p>{apparel.style}</p>
        <h1>{apparel.name}</h1>
        <p className="product-price">${apparel.price}</p>

        {/* Add quantity selection */}
        <div className="quantity">
          <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
          <span>{quantity}</span>
          <button onClick={() => setQuantity(quantity + 1)}>+</button>
        </div>

        {/* Size Selection */}
        <div className="size-selection">
          <label htmlFor="size"></label>
          <div className="size-buttons">
            {apparel.sizes.map((sizeOption, index) => (
              <button
                key={index}
                className={`size-button ${sizeOption.inStock === 0 ? 'out-of-stock' : ''} ${size === sizeOption.size ? 'selected' : ''}`}
                onClick={() => setSize(sizeOption.size)}
                disabled={sizeOption.inStock === 0} // Disable out-of-stock sizes
              >
                {sizeOption.size}
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

export default ApparelDetailPage;
