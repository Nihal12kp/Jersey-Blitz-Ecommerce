import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./CartItems.css";
import { ShopContext } from "../../Context/ShopContext";
import remove_icon from "../Assets/cart_cross_icon.png";

const CartItems = () => {
  const {
    getTotalCartAmount,
    all_product,
    cartItems,
    removeFromCart,
    increaseCartQuantity,
    decreaseCartQuantity,
  } = useContext(ShopContext);

  const navigate = useNavigate();

  return (
    <div className="cartitems">
      <div className="cartitems-format-main">
        <p>Product</p>
        <p>Title</p>
        <p>Price</p>
        <p>Sizes</p>
        <p>Quantity</p>
        <p>Total</p>
        <p>Remove</p>
      </div>
      <hr />

      {Object.entries(cartItems).map(([itemId, cartItem]) => {
        const product = all_product.find(
          (product) => product.id === parseInt(itemId)
        );

        if (!product) return null;

        return (
          <div key={itemId}>
            <div className="cartitems-format cartitems-format-main">
              <img
                src={product.image}
                alt={product.name}
                className="carticon-product-icon"
              />
              <p>{product.name}</p>
              <p>INR {product.new_price}</p>
              <p>{cartItem.sizes.join(", ")}</p> {/* Display sizes */}
              <div className="cartitems-quantity">
                {/* <button onClick={() => decreaseCartQuantity(itemId)}>-</button> */}
                <span>{cartItem.quantity}</span>
                {/* <button onClick={() => increaseCartQuantity(itemId)}>+</button> */}
              </div>
              <p>INR {(product.new_price * cartItem.quantity).toFixed(2)}</p>
              <img
                className="cartitems-remove-icon"
                src={remove_icon}
                onClick={() => {
                  removeFromCart(itemId);
                  console.log("Removed item with id:", itemId);
                }}
                alt="Remove"
              />
            </div>
            <hr />
          </div>
        );
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
          <button onClick={() => navigate("/checkout")}>
            PROCEED TO CHECKOUT
          </button>
        </div>
        <div className="cartitems-promocode">
          <p>
            <b>If you have a promo code, enter it here</b>
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
