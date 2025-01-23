import React, { createContext, useEffect, useState } from 'react';

export const ShopContext = createContext(null);

const getDefaultCart = () => {
  let cart = {};
  for (let i= 0; i < 300+1; i++) {
    cart[i] = 0;
  }
  return cart;
}

const ShopContextProvider = (props) => {
  const [cartItems, setCartItems] = useState(getDefaultCart());
  const [all_product, setAll_product] = useState([]);


  useEffect(()=>{
    fetch("http://localhost:4000/allproducts")
    .then((res)=>res.json()).then((data)=>setAll_product(data))

    if(localStorage.getItem('auth-token')){
      fetch('http://localhost:4000/getcart',{
        method:'POST',
        headers:{
          Accept:'application/form-data',
          'auth-token': `${localStorage.getItem('auth-token')}`,
          'Content-Type': 'application/json',
        },
        body:"",
      }).then((response)=>response.json())
      .then((data)=>setCartItems(data));
    }
  }, [])

  const addToCart = (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: prev[itemId] + 1,
    }));
  
    if (localStorage.getItem('auth-token')) {
      fetch('http://localhost:4000/addtocart', {
        method: "POST",
        headers: {
          Accept: 'application/form-data',
          'auth-token': `${localStorage.getItem('auth-token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({"itemId": itemId }),
      })
      .then((response) => response.json())
       .then((data)=>console.log(data))
    }
  }
  const increaseCartQuantity = (itemId) => {
    addToCart(itemId);
  };

  const decreaseCartQuantity = (itemId) => {
    setCartItems((prev) => {
      const newQuantity = (prev[itemId] || 0) - 1;
      if (newQuantity <= 0) {
        const { [itemId]: _, ...rest } = prev;
        return rest;
      }
      return {
        ...prev,
        [itemId]: newQuantity,
      };
    });
  };

  const removeFromCart = (itemId) => {
  setCartItems((prev) => ({...prev,[itemId]:prev[itemId]-1}));
   
  if (localStorage.getItem('auth-token')) {
    fetch('http://localhost:4000/removecart', {
      method: "POST",
      headers: {
        Accept: 'application/json',
        'auth-token': `${localStorage.getItem('auth-token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ "itemId": itemId }),
    })
    .then((response) =>response.json())
    .then((data)=>console.log(data));
  }
}
     
  
  
  

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        // Ensure `item` is parsed as an integer if `product.id` is an integer
        let itemInfo = all_product.find((product) => product.id === parseInt(item));
        
        // Check if `itemInfo` is found before accessing `new_price`
        if (itemInfo) {
          totalAmount += itemInfo.new_price * cartItems[item];
        } else {
          console.warn(`Item with ID ${item} not found in all_product`);
        }
      }
    }
    return totalAmount;
  };
  
  const getTotalCartItems = () => {
    let totalItem = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        totalItem += cartItems[item];
      }
    }
    return totalItem;
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
