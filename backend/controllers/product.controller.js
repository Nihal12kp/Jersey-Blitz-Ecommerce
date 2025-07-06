import Product from "../models/productSchema.js";
import User from "../models/userScema.js";

// API to get all products
export const allproduct = async (req, res) => {
  const products = await Product.find({ inStock: true });
  res.send(products);
};

// creating end point for newcollection data
export const newcollection = async (req, res) => {
  let products = await Product.find({});
  let newcollection = products.slice(1).slice(-8);
  // console.log("New collection fetched");
  res.send(newcollection);
};

// creating end point for popular in classic
export const popular = async (req, res) => {
  try {
    let products = await Product.find({ category: "classickit" });
    let popular_in_classickit = products.slice(0, 4);
    // console.log("Popular in classickit fetched");
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

    // console.log("Random related products fetched");
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

// ************************* play ********************************************

// Endpoint for adding products to cart
// export const addCart = async (req, res) => {
//   // console.log("added", req.body.itemId);
//   let userData = await User.findOne({ _id: req.user.id });
//   userData.cartData[req.body.itemId] += 1;
//   await User.findOneAndUpdate(
//     { _id: req.user.id },
//     { cartData: userData?.cartData }
//   );
//   res.send("Added");
// };

export const addCart = async (req, res) => {
  const { itemId, size } = req.body;

  const user = await User.findById(req.user.id);

  // Initialize if item doesn't exist
  const currentItem = user.cartData[itemId] || { quantity: 0, sizes: [] };

  // Add unique size
  if (size && !currentItem.sizes.includes(size)) {
    currentItem.sizes.push(size);
  }

  // Increase quantity
  currentItem.quantity += 1;

  // Save back to cartData
  user.cartData[itemId] = currentItem;

  // Tell Mongoose the nested object changed
  user.markModified('cartData');

  await user.save();

  res.json({ success: true, message: "Added to cart" });
};



// *********************************************************************



//   endpoint for removing product
export const removecart = async (req, res) => {
  const { itemId } = req.body;

  const user = await User.findById(req.user.id);

  if (user.cartData[itemId]) {
    delete user.cartData[itemId];
  user.markModified('cartData');
     // Remove the entire item from cartData
    await user.save();
    return res.json({ message: "Item removed from cart" });
  }

  return res.status(404).json({ message: "Item not found in cart" });
};


//  creating endpoint to get cartdata
export const getcart = async (req, res) => {
  // console.log("GetCart");
  let userData = await User.findOne({ _id: req.user.id });
  res.json(userData?.cartData);
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
