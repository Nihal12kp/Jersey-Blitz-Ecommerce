import Product from "../models/productSchema.js";
import User from "../models/userScema.js"
import mongoose from "mongoose";
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

// API to remove product
export const removeproduct = async (req, res) => {
  try {
    const { productId } = req.body; // Expecting productId here

    // Validate that productId is a valid ObjectId (string)
    if (productId && mongoose.Types.ObjectId.isValid(productId)) {
      const removedProduct = await productsModel.findByIdAndDelete(productId);

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

// API to get all products
export const allproduct = async (req, res) => {
  let products = await Product.find({});
  console.log("All product fetched");
  // console.log(products);
  res.send(products);
};

// creating end point for newcollection data
export const newcollection = async (req, res) => {
  let products = await Product.find({});
  let newcollection = products.slice(1).slice(-8);
  console.log("New collection fetched");
  res.send(newcollection);
};

// creating end point for popular in classic
export const popular = async (req, res) => {
  try {
    let products = await Product.find({ category: "classickit" });
    let popular_in_classickit = products.slice(0, 4);
    console.log("Popular in classickit fetched");
    res.send(popular_in_classickit);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send("Server error");
  }
};

// to get related products
export const relatedproduct = async (req, res) => {
  try {
    // Fetch 4 random products
    const relatedProducts = await Product.aggregate([{ $sample: { size: 4 } }]);

    console.log("Random related products fetched");
    res.json(relatedProducts); // Send the products as JSON response
  } catch (error) {
    console.error("Error fetching related products:", error);
    res.status(500).send("Server error");
  }
};

//  api to get search
export const searchproduct = async (req, res) => {
  const { query } = req.query; // Get the search query from the URL

  try {
    if (!query || query.trim() === "") {
      return res
        .status(400)
        .json({ success: false, message: "Search query cannot be empty" });
    }

    const searchRegex = new RegExp(query, "i"); // Case-insensitive search
    const products = await Product.find({
      $or: [{ name: searchRegex }, { category: searchRegex }],
    });

    if (products.length === 0) {
      return res.json({
        success: true,
        products: [],
        message: "No products found",
      });
    }

    res.json({ success: true, products });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error searching for products" });
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

// // Image storage engine
// const storage = multer.diskStorage({
//   destination: "./uploads/images",
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}_${file.originalname}`);
//   },
// });

// const upload = multer({ storage: storage });
// // Endpoint for image uploads
// export const imgupload = async (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ success: 0, message: "No file uploaded." });
//   }
//   res.json({
//     success: 1,
//     image_url: `http://localhost:${port}/images/${req.file.filename}`,
//   });
// };

// Endpoint for adding products to cart
export const addCart = async (req, res) => {
  console.log("added", req.body.itemId);
  let userData = await User.findOne({ _id: req.user.id });
  userData.cartData[req.body.itemId] += 1;
  await User.findOneAndUpdate(
    { _id: req.user.id },
    { cartData: userData.cartData }
  );
  res.send("Added");
};

//   endpoint for removing product
export const removecart = async (req, res) => {
  console.log("removed", req.body.itemId);
  let userData = await User.findOne({ _id: req.user.id });

  if (userData.cartData[req.body.itemId] > 0)
    userData.cartData[req.body.itemId] -= 1;
  await User.findOneAndUpdate(
    { _id: req.user.id },
    { cartData: userData.cartData }
  );
  res.send("Removed");
};

//  creating endpoint to get cartdata
export const getcart = async (req, res) => {
  console.log("GetCart");
  let userData = await User.findOne({ _id: req.user.id });
  res.json(userData.cartData);
};

export const slugproduct = async (req, res) => {
  const { slug, productId } = req.params;

  try {
    // Find the product by productId or slug
    const product = await Product.findOne({
      $or: [{ _id: productId }, { slug: slug }], // Use $or to search by either _id or slug
    });

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, product });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error retrieving the product." });
  }
};
