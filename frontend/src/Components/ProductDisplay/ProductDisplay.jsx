import React, { useContext, useState } from "react";
import "./ProductDisplay.css";
import toast from "react-hot-toast";

import { ShopContext } from "../../Context/ShopContext";
import star_icon from "../Assets/star_icon.png";
import star_dull_icon from "../Assets/star_dull_icon.png";

const ProductDisplay = ({ product }) => {
  const { addToCart } = useContext(ShopContext);
  const [selectedSize, setSelectedSize] = useState(null); // State to track the selected size

 const handleAddToCart = () => {
  if (!selectedSize) {
    toast.error("Please select a size before adding to the cart.");
    return;
  }

  if (product && product.id) {
    if (product.inStock) {
      addToCart(product.id, selectedSize); // Call context function
      // alert("Product added to cart."); 
      toast.success("Product added to cart.")
    } else {
      toast.error("This product is out of stock and cannot be added to the cart.");
    }
  } else {
    console.error("Product or Product ID is not available");
  }
};


  const handleSizeSelection = (size) => {
    setSelectedSize(size); // Update the selected size state
  };

  if (!product) {
    return <div>Loading product details...</div>; // Loading message if product is undefined
  }

  return (
    <div className="productdisplay">
      <div className="productdisplay-left">
        <div className="productdisplay-img-list">
          {Array(4)
            .fill(product.image)
            .map((img, index) => (
              <img key={index} src={img} alt={`Thumbnail ${index + 1}`} />
            ))}
        </div>
        <div className="productdisplay-img">
          <img
            className="productdisplay-main-img"
            src={product.image}
            alt="Main Product"
          />
        </div>
      </div>
      <div className="productdisplay-right">
        <h1>{product.name}</h1>
        <div className="productdisplay-right-star">
          <img src={star_icon} alt="Star Icon" />
          <img src={star_icon} alt="Star Icon" />
          <img src={star_icon} alt="Star Icon" />
          <img src={star_icon} alt="Star Icon" />
          <img src={star_dull_icon} alt="Dull Star Icon" />
          <p>(122)</p>
        </div>
        <div className="productdisplay-right-prices">
          <div className="productdisplay-right-price-old">
            INR {product.old_price}
          </div>
          <div className="productdisplay-right-price-new">
            INR {product.new_price}
          </div>
        </div>
        <div className="productdisplay-right-description">
          Nike Dri-FIT technology moves sweat away from your skin for quicker
          evaporation, helping you stay dry and comfortable. Replica design
          gives you details modeled after what the pros wear.
        </div>
        <div className="productdisplay-right-size">
          <h1>Select size</h1>
          <div className="productdisplay-right-sizes">
            {["S", "M", "L", "XL", "XXL"].map((size) => (
              <div
                key={size}
                className={`size-option ${
                  selectedSize === size ? "selected" : ""
                }`}
                onClick={() => handleSizeSelection(size)}
                style={{
                  cursor: product.inStock ? "pointer" : "not-allowed", // Disable size selection if out of stock
                  opacity: product.inStock ? 1 : 0.5, // Dim the options if out of stock
                }}
              >
                {size}
              </div>
            ))}
          </div>
        </div>

        {/* Show out of stock message if product is unavailable */}
        {!product.inStock && (
          <p className="out-of-stock-message">This product is out of stock</p>
        )}

        {/* Disable Add to Cart button if out of stock */}
        <button
          onClick={handleAddToCart}
          disabled={!product.inStock || !selectedSize} // Disable if out of stock or no size selected
        >
          ADD TO CART
        </button>

        <p className="productdisplay-right-category">
          <span>Category:</span> sports Wear {product.category}
        </p>
        <p className="productdisplay-right-category">
          <span>Tags:</span> Football {product.tags}
        </p>
      </div>
    </div>
  );
};

export default ProductDisplay;
