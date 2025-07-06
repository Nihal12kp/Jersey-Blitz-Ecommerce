import React, { createContext, useEffect, useState } from "react";

export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const [all_product, setAll_product] = useState([]);

  // Fetch products and cart on mount
  useEffect(() => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/product/allproducts`)
      .then((res) => res.json())
      .then((data) => setAll_product(data));

    if (localStorage.getItem("auth-token")) {
      fetch(`${process.env.REACT_APP_SERVER_URL}/product/getcart`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "auth-token": localStorage.getItem("auth-token"),
          "Content-Type": "application/json",
        },
        body: "",
      })
        .then((res) => res.json())
        .then((data) => setCartItems(data));
    }
  }, []);

  // Add to cart with size
  const addToCart = (itemId, selectedSize) => {
    setCartItems((prev) => {
      const existing = prev[itemId] || { quantity: 0, sizes: [] };
      return {
        ...prev,
        [itemId]: {
          quantity: existing.quantity + 1,
          sizes: [...new Set([...existing.sizes, selectedSize])], // unique sizes
        },
      };
    });

    if (localStorage.getItem("auth-token")) {
      fetch(`${process.env.REACT_APP_SERVER_URL}/product/addtocart`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "auth-token": localStorage.getItem("auth-token"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemId, size: selectedSize }),
      })
        .then((res) => res.json())
        .then((data) => console.log("Cart:", data.message));
    }
  };

  // Increase quantity (no size added)
  const increaseCartQuantity = (itemId) => {
    setCartItems((prev) => {
      const existing = prev[itemId] || { quantity: 0, sizes: [] };
      return {
        ...prev,
        [itemId]: {
          ...existing,
          quantity: existing.quantity + 1,
        },
      };
    });
  };

  // Decrease quantity or remove
  const decreaseCartQuantity = (itemId) => {
    setCartItems((prev) => {
      const current = prev[itemId];
      if (!current || current.quantity <= 1) {
        const { [itemId]: _, ...rest } = prev;
        return rest;
      }
      return {
        ...prev,
        [itemId]: {
          ...current,
          quantity: current.quantity - 1,
        },
      };
    });
  };

  // Remove item entirely
  const removeFromCart = (itemId) => {
    setCartItems((prev) => {
      const { [itemId]: _, ...rest } = prev;
      return rest;
    });

    if (localStorage.getItem("auth-token")) {
      fetch(`${process.env.REACT_APP_SERVER_URL}/product/removecart`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "auth-token": localStorage.getItem("auth-token"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemId }),
      })
        .then((res) => res.json())
        .then((data) => console.log(data));
    }
  };

  // Total price
  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const itemId in cartItems) {
      const itemInfo = all_product.find(
        (product) => product.id === parseInt(itemId)
      );
      if (itemInfo) {
        totalAmount += itemInfo.new_price * cartItems[itemId].quantity;
      }
    }
    return totalAmount;
  };

  // Total items
  const getTotalCartItems = () => {
    let total = 0;
    for (const itemId in cartItems) {
      total += cartItems[itemId].quantity || 0;
    }
    return total;
  };

  const contextValue = {
    getTotalCartItems,
    getTotalCartAmount,
    all_product,
    cartItems,
    addToCart,
    increaseCartQuantity,
    decreaseCartQuantity,
    removeFromCart,
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
