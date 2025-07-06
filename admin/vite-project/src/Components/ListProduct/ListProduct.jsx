import React, { useEffect, useState } from "react";
import "./ListProduct.css";
import cross_icon from "../../assets/cross_icon.png";

const ListProduct = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [allproducts, setAllproducts] = useState([]);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [updatedProduct, setUpdatedProduct] = useState({
    name: "",
    old_price: "",
    new_price: "",
    category: "",
    sizes: [],
  });

  const fetchInfo = async () => {
    const res = await fetch(`${apiUrl}/admin/allproducts`);
    const data = await res.json();
    // console.log(data);
    if (res.ok) {
      setAllproducts(data);
    }
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  // Toggle stock for a specific product
  const toggleProductStock = async (productId) => {
    try {
      const res = await fetch(`${apiUrl}/admin/${productId}/toggle-stock`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const toggled = await res.json();

      // Update local state (just update the toggled product)
      setAllproducts((prev) =>
        prev.map((p) => (p._id === toggled._id ? toggled : p))
      );
      fetchInfo();
    } catch (err) {
      console.error("Error updating stock:", err);
    }
  };

  const remove_product = async (productId) => {
    // console.log("deleted");
    await fetch(`${apiUrl}/admin/removeproduct`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId }),
    });
    fetchInfo();
  };
  const handleSizeChange = (size) => {
    const currentSizes = updatedProduct.sizes || [];

    const updatedSizes = currentSizes.includes(size)
      ? currentSizes.filter((s) => s !== size)
      : [...currentSizes, size];

    setUpdatedProduct((prev) => ({
      ...prev,
      sizes: updatedSizes,
    }));
  };
  const handleUpdateProduct = (product) => {
    setSelectedProduct(product);
    setUpdatedProduct({
      name: product.name,
      old_price: product.old_price,
      new_price: product.new_price,
      category: product.category,
      sizes: product.sizes,
    });
  };

  const updateProduct = async () => {
    const res = await fetch(`${apiUrl}/admin/updateproduct`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId: selectedProduct._id,
        updatedProduct,
      }),
    });

    if (res.ok) {
      fetchInfo();
      setSelectedProduct(null);
    } else {
      alert("Failed to update product");
    }
  };

  return (
    <div className="listproduct">
      <h1>All Product List - Total : {allproducts.length}</h1>
      <div className="listproduct-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Old Price</p>
        <p>New Price</p>
        <p>Category</p>
        <p>Stock</p>
        <p>Remove</p>
        <p>Update</p>
      </div>
      <div className="listproduct-allproducts">
        <hr />
        {allproducts.map((product) => (
          <div
            key={product._id}
            className="listproduct-format-main listproduct-format"
          >
            <img
              src={product.image}
              alt=""
              className="listproduct-product-icon"
            />
            <p>{product.name}</p>
            <p>${product.old_price}</p>
            <p>${product.new_price}</p>
            <p>{product.category}</p>
            <p>
              {product.inStock ? "In Stock" : "Out of Stock"}
              <br />
              <label className="switch">
                <input
                  type="checkbox"
                  checked={product.inStock}
                  onChange={() => toggleProductStock(product._id)}
                />
                <span className="slider round"></span>
              </label>
            </p>
            {/* Display Out of Stock for unavailable products */}
            {/* <p>
              {!product.inStock && <span style={{ color: 'red', fontWeight: 'bold' }}>Out of Stock</span>}
            </p> */}
            <img
              onClick={() => {
                remove_product(product._id);
              }}
              className="listproduct-remove-icon"
              src={cross_icon}
              alt="Remove"
            />
            {/* Disable the "Update" button if the product is out of stock */}
            <button
              onClick={() => handleUpdateProduct(product)}
              disabled={!product.inStock}
            >
              Update
            </button>
            <hr />
          </div>
        ))}
      </div>

      {/* Update Product Modal */}
      {selectedProduct && (
        <div className="update-modal">
          <div className="update-modal-content">
            <h2>Update Product</h2>
            <label>Name:</label>
            <input
              type="text"
              value={updatedProduct.name}
              onChange={(e) =>
                setUpdatedProduct({ ...updatedProduct, name: e.target.value })
              }
            />
            <label>Old Price:</label>
            <input
              type="number"
              value={updatedProduct.old_price}
              onChange={(e) =>
                setUpdatedProduct({
                  ...updatedProduct,
                  old_price: e.target.value,
                })
              }
            />
            <label>New Price:</label>
            <input
              type="number"
              value={updatedProduct.new_price}
              onChange={(e) =>
                setUpdatedProduct({
                  ...updatedProduct,
                  new_price: e.target.value,
                })
              }
            />
            <label>Category:</label>
            <input
              type="text"
              value={updatedProduct.category}
              onChange={(e) =>
                setUpdatedProduct({
                  ...updatedProduct,
                  category: e.target.value,
                })
              }
            />
            <label>Sizes:</label>
            {["S", "M", "L", "XL", "XXL"].map((size) => (
              <label key={size}>
                <input
                  type="checkbox"
                  checked={updatedProduct.sizes?.includes(size)}
                  onChange={() => handleSizeChange(size)}
                />
                {size}
              </label>
            ))}

            <button onClick={updateProduct}>Update</button>
            <button onClick={() => setSelectedProduct(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListProduct;
