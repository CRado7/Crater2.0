import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { UPDATE_CART_QUANTITY, REMOVE_FROM_CART } from '../utils/mutations';
import { GET_CART } from '../utils/queries';
import '../styles/CartPage.css';

const CartPage = ({ newItemAdded }) => {
  const [quantity, setQuantity] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data, loading, error, refetch } = useQuery(GET_CART);
  const [updateCartQuantity] = useMutation(UPDATE_CART_QUANTITY);
  const [removeFromCart] = useMutation(REMOVE_FROM_CART);

  // Refetch cart whenever the component loads or newItemAdded changes
  useEffect(() => {
    refetch();
  }, [newItemAdded]);

  const handleQuantityChange = async (productId, newQuantity) => {
    setQuantity((prev) => ({ ...prev, [productId]: newQuantity }));
    try {
      await updateCartQuantity({
        variables: { input: { productId, quantity: newQuantity } },
      });
      refetch();
    } catch (error) {
      console.error('Error updating item quantity:', error);
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      await removeFromCart({ variables: { input: { productId } } });
      refetch();
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  const handleCheckoutClick = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const cartItems = data ? data.getCart.items : [];
  const totalCost = cartItems.reduce(
    (total, item) =>
      total + item.price * (quantity[item.productId] || item.quantity),
    0
  );

  return (
    <div className="cart-container">
      <div className="cart-items-section">
        <h2>Items in Your Bag</h2>
        {cartItems.map((item) => {
          const itemQuantity = quantity[item.productId] || item.quantity;
          return (
            <div key={item.productId} className="cart-item">
              <img src={item.picture} alt={item.name} className="item-image" />
              <div className="item-details">
                <p className="item-name">{item.name}</p>
                <p className="item-price">${item.price}</p>
                <div className="item-quantity">
                  {/* <button
                    onClick={() =>
                      handleQuantityChange(item.productId, Math.max(1, itemQuantity - 1))
                    }
                  >
                    -
                  </button> */}
                  <input
                    type="number"
                    value={itemQuantity}
                    onChange={(e) =>
                      handleQuantityChange(item.productId, parseInt(e.target.value, 10))
                    }
                    min="1"
                  />
                  {/* <button
                    onClick={() => handleQuantityChange(item.productId, itemQuantity + 1)}
                  >
                    +
                  </button> */}
                </div>
                <button
                  onClick={() => handleRemoveItem(item.productId)}
                  className="remove-button"
                >
                  Remove
                </button>
              </div>
              <div className="item-total">
                <p>${(item.price * itemQuantity).toFixed(2)}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="cart-summary-section">
        <h3>Summary</h3>
        <div className="summary-details">
          <p>Subtotal: ${totalCost.toFixed(2)}</p>
          <p>Free Shipping</p>
          <p>Estimated Tax: $0.00</p>
          <h3>Total: ${totalCost.toFixed(2)}</h3>
        </div>
        <button onClick={handleCheckoutClick} className="checkout-button">
          Checkout
        </button>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Checkout Information</h2>
            <p>
              This is not a real site, so these are not real products. If you'd like to talk about projects or
              opportunities, email me at{' '}
              <a href="mailto:christopher.ferraro34@gmail.com">
                christopher.ferraro34@gmail.com
              </a>
            </p>
            <button onClick={closeModal} className="close-modal-button">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
