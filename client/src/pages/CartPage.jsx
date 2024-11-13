import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { REMOVE_FROM_CART } from '../utils/mutations';
import '../styles/CartPage.css';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [quantity, setQuantity] = useState({});
  const [removeFromCart] = useMutation(REMOVE_FROM_CART);

  // Load cart items from local storage when component mounts
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(storedCart);
  }, []);

  const handleRemoveItem = (productId) => {
    const updatedCart = cartItems.filter(item => item.productId !== productId);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const handleQuantityChange = (productId, newQuantity) => {
    setQuantity((prev) => ({ ...prev, [productId]: newQuantity }));

    const updatedCart = cartItems.map(item =>
      item.productId === productId ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  if (!cartItems.length) {
    return (
      <div className="cart-page">
        <h2>Your Cart</h2>
        <p>Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>
      <div className="cart-items">
        {cartItems.map((item) => (
          <div key={item.productId} className="cart-item">
            <img src={item.onModel} alt={item.productId} className="cart-item-image" />
            <div className="cart-item-details">
              <p>{item.name}</p>
              <div className="cart-item-quantity">
                <button
                  onClick={() =>
                    handleQuantityChange(item.productId, Math.max(1, (quantity[item.productId] || item.quantity) - 1))
                  }
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity[item.productId] || item.quantity}
                  onChange={(e) => handleQuantityChange(item.productId, parseInt(e.target.value))}
                  min="1"
                />
                <button
                  onClick={() =>
                    handleQuantityChange(item.productId, (quantity[item.productId] || item.quantity) + 1)
                  }
                >
                  +
                </button>
              </div>
              <button
                className="remove-item"
                onClick={() => handleRemoveItem(item.productId)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-total">
        <h3>
          Total: $
          {cartItems.reduce((total, item) => total + (item.price || 0) * item.quantity, 0)}
        </h3>
      </div>

      <button className="checkout-button">Checkout</button>
    </div>
  );
};

export default CartPage;
