import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { UPDATE_CART_QUANTITY } from '../utils/mutations';
import { GET_CART } from '../utils/queries';
import { REMOVE_FROM_CART } from '../utils/mutations';
import '../styles/CartPage.css';

const CartPage = () => {
  const [quantity, setQuantity] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);  // State to control modal visibility
  const { data, loading, error, refetch } = useQuery(GET_CART);
  const [updateCartQuantity] = useMutation(UPDATE_CART_QUANTITY);
  const [removeFromCart] = useMutation(REMOVE_FROM_CART);

  const handleQuantityChange = async (productId, newQuantity) => {
    setQuantity((prev) => ({ ...prev, [productId]: newQuantity }));
    try {
      await updateCartQuantity({
        variables: {
          input: { productId, quantity: newQuantity },
        },
      });
      refetch();
    } catch (error) {
      console.error('Error updating item quantity:', error);
    }
  };

  // Automatically refetch data when the component is mounted
  useEffect(() => {
    refetch();
  }, [refetch]);

  // Remove item from the cart
  const handleRemoveItem = async (productId) => {
    try {
      await removeFromCart({
        variables: {
          input: { productId },
        },
      });
      refetch();
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  // Handle checkout button click
  const handleCheckoutClick = () => {
    setIsModalOpen(true);  // Open the modal when checkout is clicked
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);  // Close the modal
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const cartItems = data ? data.getCart.items : [];

  // Calculate total cost of the cart
  const totalCost = cartItems.reduce((total, item) => {
    const itemQuantity = quantity[item.productId] || item.quantity;
    return total + item.price * itemQuantity;
  }, 0);

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>
      <div className="cart-items">
        {cartItems.map((item) => {
          const itemQuantity = quantity[item.productId] || item.quantity;
          const itemTotal = item.price * itemQuantity;

          return (
            <div key={item.productId} className="cart-item">
              <div className="cart-item-details">
                <img src={item.picture} alt={item.name} />
                <p>{item.name}</p>
                <p>${item.price} per unit</p>
                <p>Total: ${itemTotal.toFixed(2)}</p>
                <div className="cart-item-quantity">
                  <button
                    onClick={() =>
                      handleQuantityChange(item.productId, Math.max(1, itemQuantity - 1))
                    }
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={itemQuantity}
                    onChange={(e) => handleQuantityChange(item.productId, parseInt(e.target.value, 10))}
                    min="1"
                  />
                  <button
                    onClick={() => handleQuantityChange(item.productId, itemQuantity + 1)}
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => handleRemoveItem(item.productId)}
                  className="remove-item-button"
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <div className="cart-total">
        <h3>Total Cost: ${totalCost.toFixed(2)}</h3>
      </div>
      <button onClick={handleCheckoutClick} className="checkout-button">
        Checkout
      </button>

      {/* Modal Popup for Checkout */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Checkout Information</h2>
            <p>
              These are not real items and this is not a real site. However, if you are interested in talking with me more about job opportunities or projects, please email me at{' '}
              <a href="mailto:christopher.ferraro34@gmail.com">christopher.ferraro34@gmail.com</a>
            </p>
            <button onClick={closeModal} className="close-modal-button">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
