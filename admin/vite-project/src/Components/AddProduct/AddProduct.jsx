import React, { useState } from "react";
import "./AddProduct.css";
import upload_area from "../../assets/upload_area.svg";

const AddProduct = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  console.log(apiUrl)
  const [image, setImage] = useState(null);
  const [productDetails, setProductDetails] = useState({
    name: "",
    category: "",
    new_price: "",
    old_price: "",
    image: "", // To store the image URL after uploading
  });

  const imageHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const changeHandler = (e) => {
    setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
  };

  const Add_Product = async () => {
    try {
      // Validate that all fields are filled
      if (
        !productDetails.name ||
        !productDetails.category ||
        !productDetails.new_price ||
        !productDetails.old_price ||
        !image
      ) {
        alert("Please fill all fields and upload an image.");
        return;
      }

      // Upload image first
      const formData = new FormData();
      formData.append("product", image);

      const uploadResponse = await fetch(`${apiUrl}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorResponse = await uploadResponse.json();
        throw new Error(`Image upload failed: ${errorResponse.message}`);
      }

      const uploadData = await uploadResponse.json();

      // Prepare product details
      const updatedProductDetails = {
        ...productDetails,
        image: uploadData.image_url, // Set image URL from response
      };

      // Send product details to backend
      const addResponse = await fetch(
        `${apiUrl}/admin/addproduct`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedProductDetails),
        }
      );

      if (!addResponse.ok) {
        const errorData = await addResponse.json();
        throw new Error(`Failed to add product: ${errorData.error}`);
      }

      const addData = await addResponse.json();
      if (addData.success) {
        alert("Product Added Successfully!");
        // Reset form fields after successful product addition
        setProductDetails({
          name: "",
          category: "awaykit",
          new_price: "",
          old_price: "",
          image: "",
        });
        setImage(null); // Clear the image preview
      } else {
        alert("Failed to add product.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred: " + error.message);
    }
  };

  return (
    <div className="addproduct">
      <div className="addproduct-itemfield">
        <p>Product Title</p>
        <input
          value={productDetails.name}
          onChange={changeHandler}
          type="text"
          name="name"
          placeholder="Type here"
        />
      </div>
      <div className="addproduct-price">
        <div className="addproduct-itemfield">
          <p>Price</p>
          <input
            value={productDetails.old_price}
            onChange={changeHandler}
            type="text"
            name="old_price"
            placeholder="Type here"
          />
        </div>
        <div className="addproduct-itemfield">
          <p>Offer Price</p>
          <input
            value={productDetails.new_price}
            onChange={changeHandler}
            type="text"
            name="new_price"
            placeholder="Type here"
          />
        </div>
      </div>

      <div className="addproduct-itemfield">
        <p>Product Category</p>
        <select
          value={productDetails.category}
          onChange={changeHandler}
          name="category"
          className="add-product-selector"
        >
          <option value="homekit">Home Kit</option>
          <option value="awaykit">Away Kit</option>
          <option value="classickit">Classic Kit</option>
        </select>
      </div>

      <div className="addproduct-itemfield">
        <label htmlFor="file-input">
          <img
            src={image ? URL.createObjectURL(image) : upload_area}
            className="addproduct-thumbnail-img"
            alt=""
          />
        </label>
        <input
          onChange={imageHandler}
          type="file"
          name="image"
          id="file-input"
          hidden
        />
      </div>

      <button onClick={Add_Product} className="addproduct-btn">
        Add
      </button>
    </div>
  );
};

export default AddProduct;
