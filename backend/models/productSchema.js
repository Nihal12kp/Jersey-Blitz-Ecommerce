import mongoose from "mongoose";
//TODO
import slug from "mongoose-slug-generator";
mongoose.plugin(slug);

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
    slug: {
      type: String,
      slug: "name",
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
      type: String,
      required: false,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    sizes: [
      {
        size: {
          type: String,
          required: true,
        },
      },
    ],
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
