import Product from "../models/productSchema.js";
import User from "../models/userScema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Order from "../models/orderSchema.js";

export const adminLogin = async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.json({ errors: "User doesn't Exist" });
  }
  if (!user.isAdmin) {
    return res.json({ errors: "You are not an admin, You can't login." });
  }
  if (user) {
    const passVerify = await bcrypt.compare(req.body.password, user.password);
    if (!passVerify) {
      return res.json({ message: "Username or Password is Incorrect! " });
    }
    if (passVerify) {
      const data = {
        user: {
          id: user.id,
          admin: user.isAdmin,
        },
      };
      const token = jwt.sign(data, "secret_ecom");
      res.json({ success: true, token });
    } else {
      res.json({ success: false, errors: "Email or Password is incorrect" });
    }
  } else {
    res.json({ success: false, errors: "Email or Password is incorrect" });
  }
};

// API to add product
export const addproduct = async (req, res) => {
  try {
    let products = await Product.find({});
    let id;

    if (products.length > 0) {
      let last_product_array = products.slice(-1);
      let last_product = last_product_array[0];
      id =
        (typeof last_product.id === "number"
          ? last_product.id
          : parseInt(last_product.id, 10)) + 1;
      if (isNaN(id)) id = 1; // Fallback if parsing fails
    } else {
      id = 1;
    }

    const product = new Product({
      id: id,
      name: req.body.name,
      image: req.body.image,
      category: req.body.category,
      new_price: req.body.new_price,
      old_price: req.body.old_price,
    });

    // console.log(product);

    const saved = await product.save();

    res.json({ success: true, name: req.body.name });
  } catch (error) {
    console.log(error.message);
    res
      .status(500)
      .json({ success: false, message: "Product validation failed." });
  }
};

// API to get all products
export const allproduct = async (req, res) => {
  const products = await Product.find({});
  res.send(products);
};

// Toggle stock
export const toggleProductStock = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.inStock = !product.inStock;
    await product.save();

    res.send(product);
  } catch (error) {
    console.error("Toggle error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// API to remove product
export const removeproduct = async (req, res) => {
  try {
    const { productId } = req.body; // Expecting productId here

    // Validate that productId is a valid ObjectId (string)
    if (productId && mongoose.Types.ObjectId.isValid(productId)) {
      const removedProduct = await Product.findByIdAndDelete(productId);

      if (removedProduct) {
        console.log("Product Removed");
        res.json({
          success: true,
          message: "Product removed successfully",
        });
      } else {
        res.status(404).json({ success: false, message: "Product not found" });
      }
    } else {
      res.status(400).json({ success: false, message: "Invalid productId" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

// API to update product
export const updateproduct = async (req, res) => {
  try {
    // Extract the productId and updated product data from the request body
    const { productId, updatedProduct } = req.body;
    const { name, old_price, new_price, category, sizes } = updatedProduct;

    // Validate productId
    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid productId" });
    }

    // Find the product by its ID
    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // Update product fields with the provided data
    product.name = name || product.name;
    product.old_price = old_price || product.old_price;
    product.new_price = new_price || product.new_price;
    product.category = category || product.category;
    product.sizes = sizes || product.sizes;

    // Save the updated product to the database
    await product.save();

    // Respond with the updated product details
    res.json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error updating product" });
  }
};

//   to get all non-admin users
export const allusers = async (req, res) => {
  try {
    const users = await User.find(
      { isAdmin: false }, // Only non-admin users
      { name: 1, email: 1, cartData: 1, isBanned: 1 }
    );
    res.json({ success: true, users });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error retrieving users." });
  }
};

// Toggle user banned status (admin only)
export const userban = async (req, res) => {
  try {
    const { isBanned } = req.body;
    await User.findByIdAndUpdate(req.params.id, { isBanned });
    res.json({
      success: true,
      message: `User ${isBanned ? "banned" : "unbanned"} successfully`,
    });
  } catch (err) {
    res.status(500).json({ error: "Error updating user ban status" });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate({
      path: "userId",
      select: "-password",
    });
    res.json({ success: true, orders });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error retrieving orders." });
  }
};

// PUT /admin/orders/:orderId
export const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { shoppingStatus } = req.body;

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { shoppingStatus },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Status updated", order: updatedOrder });
  } catch (error) {
    console.error("Failed to update order status", error);
    res.status(500).json({ message: "Server error" });
  }
};
