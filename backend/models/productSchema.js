const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    new_price: {
      type: Number,
      required: true,
    },
    old_price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    productId: {
      type: String, // Optional field
      required: false, // Not required
    },
    sizes: [
      {
        size: {
          type: String,
          required: true,
        },
        stock: {
          type: Number,
          required: true,
        },
      },
    ],
    date: {
      type: Date,
      default: Date.now, // Automatically sets to current date
    },
  },
  { timestamps: true }
);

// Create a model using the schema
const Product = mongoose.model("Product", productSchema);

module.exports = Product;
