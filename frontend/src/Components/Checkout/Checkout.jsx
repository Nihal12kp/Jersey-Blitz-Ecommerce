import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../../Context/ShopContext";
import "./Checkout.css";
import Footer from "../Footer/Footer";
import Navbar from "../Navbar/Navbar";

const Checkout = () => {
  const { cartItems, all_product, getTotalCartAmount } =
    useContext(ShopContext);
  const [userDetails, setUserDetails] = useState({
    fullName: "",
    phone: "",
    country: "",
    city: "",
    state: "",
    zip: "",
  });

  const [cartTotal, setCartTotal] = useState(0);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate(); // Create navigate object for navigation

  useEffect(() => {
    // Update the total amount when cart items change
    setCartTotal(getTotalCartAmount());
  }, [cartItems, getTotalCartAmount]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails({ ...userDetails, [name]: value });
  };

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    // Validate required fields
    if (!userDetails.fullName) {
      formErrors.fullName = "Full Name is required";
      isValid = false;
    }

    if (!userDetails.phone) {
      formErrors.phone = "Phone number is required";
      isValid = false;
    } else if (!/^\d{10}$/.test(userDetails.phone)) {
      formErrors.phone = "Phone number should be 10 digits";
      isValid = false;
    }

    if (!userDetails.country) {
      formErrors.country = "Country is required";
      isValid = false;
    }

    if (!userDetails.city) {
      formErrors.city = "City is required";
      isValid = false;
    }

    if (!userDetails.state) {
      formErrors.state = "State is required";
      isValid = false;
    }

    if (!userDetails.zip) {
      formErrors.zip = "Zip Code is required";
      isValid = false;
    } else if (!/^\d{6}$/.test(userDetails.zip)) {
      formErrors.zip = "Zip Code should be 6 digits";
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    const token = localStorage.getItem("auth-token");
    if (!token) {
      alert("Please log in to continue.");
      navigate("/login");
      return;
    }

    const orderData = { userDetails, cartItems };

    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/order/placeorder`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
          },
          body: JSON.stringify(orderData),
        }
      );

      const result = await response.json();
      if (result.success) {
        alert("Order placed successfully!");
        navigate("/myorders", { state: { userDetails, cartItems } }); // Navigate to success page
      } else {
        alert("Error placing order:", result.message);
      }
    } catch (err) {
      console.error("Error placing order:", err);
      alert("Something went wrong, please try again later.");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="checkout-container">
        {cartTotal > 0 ? (
          <>
            <div className="checkout-form">
              <h2>CHECKOUT</h2>
              <h3>Shipping Information</h3>
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={userDetails.fullName}
                onChange={handleChange}
              />
              {errors.fullName && <p className="error">{errors.fullName}</p>}

              <input
                type="tel"
                name="phone"
                placeholder="Phone"
                value={userDetails.phone}
                onChange={handleChange}
              />
              {errors.phone && <p className="error">{errors.phone}</p>}

              <input
                type="text"
                name="country"
                placeholder="Country"
                value={userDetails.country}
                onChange={handleChange}
              />
              {errors.country && <p className="error">{errors.country}</p>}

              <input
                type="text"
                name="city"
                placeholder="City"
                value={userDetails.city}
                onChange={handleChange}
              />
              {errors.city && <p className="error">{errors.city}</p>}

              <input
                type="text"
                name="state"
                placeholder="State"
                value={userDetails.state}
                onChange={handleChange}
              />
              {errors.state && <p className="error">{errors.state}</p>}

              <input
                type="text"
                name="zip"
                placeholder="Zip Code"
                value={userDetails.zip}
                onChange={handleChange}
              />
              {errors.zip && <p className="error">{errors.zip}</p>}

              <button className="checkout-button" onClick={handlePlaceOrder}>
                Pay Now
              </button>
            </div>

            <div className="checkout-order-summary">
              <h3>Review your cart</h3>
              <div className="checkout-items">
                {all_product.map(
                  (item) =>
                    cartItems[item.id] > 0 && (
                      <div key={item.id} className="checkout-item">
                        <div className="item-image">
                          <img
                            src={item.image}
                            alt={item.name}
                            style={{ width: "100px", borderRadius: "8px" }}
                          />
                        </div>
                        <div className="item-info">
                          <p>
                            {item.name} × {cartItems[item.id]}
                          </p>
                          <p>INR {item.new_price * cartItems[item.id]}</p>
                        </div>
                      </div>
                    )
                )}
              </div>
              <div className="checkout-summary">
                <p>
                  Subtotal: <span>INR {cartTotal}</span>
                </p>
                <p>
                  Shipping: <span>INR 5.00</span>
                </p>
                <p>
                  Discount: <span>-INR 10.00</span>
                </p>
                <h4>
                  Total: <span>INR {(cartTotal + 5 - 10).toFixed(2)}</span>
                </h4>
              </div>
              <div className="secure-checkout">
                <p>🔒 Secure Checkout – SSL Encrypted</p>
                <small>
                  Ensuring your financial and personal details are secure during
                  every transaction.
                </small>
              </div>
            </div>
          </>
        ) : (
          <div className="empty-cart-message">
            <h2>Your cart is empty</h2>
            <p>Please return to the shop to add items to your cart.</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;
