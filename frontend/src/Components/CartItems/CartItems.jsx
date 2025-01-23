import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './CartItems.css';
import { ShopContext } from '../../Context/ShopContext';
import remove_icon from '../Assets/cart_cross_icon.png';

const CartItems = () => {
  const {
    getTotalCartAmount,
    all_product,
    cartItems,
    removeFromCart,
    increaseCartQuantity,
    decreaseCartQuantity,
  } = useContext(ShopContext);
  
  const navigate = useNavigate(); // React Router's navigation hook

  return (
    <div className="cartitems">
    <div className="cartitems-format-main">
      <p>Products</p>
      <p>Title</p>
      <p>Price</p>
      <p>Size</p> {/* Add a column for Size */}
      <p>Quantity</p>
      <p>Total</p>
      <p>Remove</p>
    </div>
    <hr />
    {all_product.map((e) => {
      if (cartItems[e.id] > 0) {
        return (
          <div key={e.id}>
            <div className="cartitems-format cartitems-format-main">
              <img src={e.image} alt="" className="carticon-product-icon" />
              <p>{e.name}</p>
              <p>INR {e.new_price}</p>
              <p>{e.size || 'N/A'}</p> {/* Display size here */}
              <div className="cartitems-quantity">
                <button onClick={() => decreaseCartQuantity(e.id)}>-</button>
                <span>{cartItems[e.id]}</span>
                <button onClick={() => increaseCartQuantity(e.id)}>+</button>
              </div>
              <p>INR {(e.new_price * cartItems[e.id]).toFixed(2)}</p>
              <img
                className="cartitems-remove-icon"
                src={remove_icon}
                onClick={() => {
                  removeFromCart(e.id);
                  console.log("Removed item with id:", e.id);
                }}
                alt="Remove item"
              />
            </div>
            <hr />
          </div>
        );
      }
      return null;
    })}
    <div className="cartitems-down">
      <div className="cartitems-total">
        <h1>Cart Totals</h1>
        <div>
          <div className="cartitems-total-item">
            <p>Subtotal</p>
            <p>INR {getTotalCartAmount().toFixed(2)}</p>
          </div>
          <hr />
          <div className="cartitems-total-item">
            <p>Shipping fee</p>
            <p>Free</p>
          </div>
          <hr />
          <div className="cartitems-total-item">
            <h3>Total</h3>
            <h3>INR {getTotalCartAmount().toFixed(2)}</h3>
          </div>
        </div>
        <button onClick={() => navigate("/checkout")}>PROCEED TO CHECKOUT</button>
      </div>
      <div className="cartitems-promocode">
        <p>
          <b>If you have a promo code, Enter it here</b>
        </p>
        <div className="cartitems-promobox">
          <input type="text" placeholder="Promo code" />
          <button>Submit</button>
        </div>
      </div>
    </div>
  </div>
  
  );
};

export default CartItems;
