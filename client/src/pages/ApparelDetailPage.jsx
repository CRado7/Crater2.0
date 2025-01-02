import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { GET_APPAREL } from '../utils/queries';
import { ADD_TO_CART, INCREMENT_APPAREL_VIEWS } from '../utils/mutations';
import '../styles/ProductDetailsPage.css';

const ApparelDetailPage = () => {
  const { id } = useParams();
  const { loading, error, data } = useQuery(GET_APPAREL, { variables: { id } });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState('');
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0, show: false });

  const [incrementApparelViews] = useMutation(INCREMENT_APPAREL_VIEWS);
  const [addToCart] = useMutation(ADD_TO_CART);

  useEffect(() => {
    incrementApparelViews({ variables: { id } });
  }, [id, incrementApparelViews]);

  const handleImageNavigation = (direction) => {
    setCurrentImageIndex((prevIndex) => {
      if (direction === 'next') {
        return (prevIndex + 1) % data.getApparel.pictures.length;
      }
      return (prevIndex - 1 + data.getApparel.pictures.length) % data.getApparel.pictures.length;
    });
  };

  const handleZoom = (e) => {
    const { offsetX, offsetY, target } = e.nativeEvent;
    const { offsetWidth, offsetHeight } = target;

    const x = (offsetX / offsetWidth) * 100;
    const y = (offsetY / offsetHeight) * 100;

    setZoomPosition({ x, y, show: true });
  };

  const handleZoomOut = () => {
    setZoomPosition({ ...zoomPosition, show: false });
  };

  const handleAddToCart = async () => {
    if (!size) {
      alert('Please select a size!');
      return;
    }
    const type = 'apparel';
    try {
      await addToCart({
        variables: {
          input: {
            productId: id,
            name: data.getApparel.name,
            price: data.getApparel.price,
            quantity,
            size,
            type,
            picture: data.getApparel.pictures[0],
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
        <div
          className="image-zoom-container"
          onMouseMove={handleZoom}
          onMouseLeave={handleZoomOut}
        >
          <h1 className="mobile-heading">{apparel.name}</h1>
          <img
            src={apparel.pictures[currentImageIndex]}
            alt={apparel.name}
            className="product-image"
          />
          {zoomPosition.show && (
            <div
              className="zoom-box"
              style={{
                backgroundImage: `url(${apparel.pictures[currentImageIndex]})`,
                backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
              }}
            ></div>
          )}
        </div>
      </div>

      <div className="product-info">
        <h1 className="desktop-heading">{apparel.name}</h1>
        <p className="product-price">${apparel.price}</p>


        {/* Add quantity selection */}
        <div className="quantity">
          <label htmlFor="quantity">Quantity:</label>
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
