const port = 4000;
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const productsModel = require("./models/productSchema"); 
const User = require("./models/userScema");
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv");
const Product = require("./models/productSchema");
const Order =require("./models/orderSchema")
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

// Database Connection with MongoDB
mongoose.connect(process.env.MONGO)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => {
        console.log(err);
    });
    

// API Creation
app.get("/", (req, res) => {
    res.send("Express app is running");
});



// Image storage engine
const storage = multer.diskStorage({
    destination: './uploads/images',
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    }
});

const upload = multer({ storage: storage });


// Static path to serve images
app.use('/images', express.static('uploads/images'));



// Endpoint for image uploads
app.post("/upload", upload.single('product'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: 0, message: "No file uploaded." });
    }
    res.json({
        success: 1,
        image_url: `http://localhost:${port}/images/${req.file.filename}`
    });
});

// API to add product
app.post('/addproduct', async (req, res) => {
    try {
        let products = await Product.find({});
        let id;

        if (products.length > 0) {
            let last_product_array = products.slice(-1);
            let last_product = last_product_array[0];
            id = (typeof last_product.id === 'number' ? last_product.id : parseInt(last_product.id, 10)) + 1;
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
            old_price: req.body.old_price
        });

        console.log(product);
        const saved = await product.save();

        res.json({ success: true, name: req.body.name });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: "Product validation failed." });
    }
});


// API to remove product
app.post('/removeproduct', async (req, res) => {
    try {
        const { productId } = req.body; // Expecting productId here

        // Validate that productId is a valid ObjectId (string)
        if (productId && mongoose.Types.ObjectId.isValid(productId)) {
            const removedProduct = await productsModel.findByIdAndDelete(productId);

            if (removedProduct) {
                console.log("Product Removed");
                res.json({
                    success: true,
                    message: "Product removed successfully"
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
});


// API to get all products
app.get('/allproducts', async (req, res) => {
    let products = await Product.find({});
    console.log('All product fetched');
    console.log(products)
    res.send(products)
});


// Creating end points for registering the user
app.post('/signup', async (req, res) => {
    let check = await User.findOne({ email: req.body.email });
    if (check) {
        return res.status(400).json({ success: false, error: "existing user found with same email" })
    }
    let cart = {};
    for (let i = 0; i < 300; i++) {
        cart[i] = 0;
    }
    const user = new User({
        name: req.body.username,
        email: req.body.email,
        password: req.body.password,
        cartData: cart
    })
    await user.save();

    const data = {
        user: {
            id: user.id
        }
    }

    const token = jwt.sign(data, 'secret_ecom');
    res.json({ success: true, token })

});


// Creating end points for login
app.post('/login', async (req, res) => {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
        const passVerify = req.body.password === user.password;
        if (passVerify) {
            const data = {
                user: {
                    id: user.id
                }
            }
            const token = jwt.sign(data, 'secret_ecom');
            res.json({ success: true, token });
        }
        else {
            res.json({ success: false, errors: "Wrong password" });
        }

    }
    else {
        res.json({ success: false, errors: "Wrong email id" });
    }
});


// Toggle user banned status (admin only)
app.post('/toggleban', async (req, res) => {
    const { userId } = req.body;
  
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
  
      user.banned = !user.banned;  // Toggle the banned status
      await user.save();
  
      res.json({ success: true, message: `User ${user.banned ? 'banned' : 'unbanned'} successfully` });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Error toggling banned status' });
    }
  });

  
//   to get all users
 app.get('/users', async (req, res) => {
    try {
      const users = await User.find({}, { name: 1, email: 1, cartData: 1, banned: 1 }); // Include banned status
      res.json({ success: true, users });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Error retrieving users.' });
    }
  });
  
  
// creating end point for newcollection data
app.get('/newcollection', async (req, res) => {
    let products = await Product.find({});
    let newcollection = products.slice(1).slice(-8);
    console.log("New collection fetched");
    res.send(newcollection);
})


// creating end point for popular in classic
app.get('/popularinclassickit', async (req, res) => {
    try {
        let products = await Product.find({ category: "classickit" });
        let popular_in_classickit = products.slice(0, 4);
        console.log("Popular in classickit fetched");
        res.send(popular_in_classickit);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).send("Server error");
    }
});


// to get related products
app.get('/relatedproduct', async (req, res) => {
    try {
        // Fetch 4 random products
        const relatedProducts = await Product.aggregate([{ $sample: { size: 4 } }]);

        console.log("Random related products fetched");
        res.json(relatedProducts); // Send the products as JSON response
    } catch (error) {
        console.error("Error fetching related products:", error);
        res.status(500).send("Server error");
    }
});


// Middleware to fetch user
const fetchUser = async (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send({ error: "Please authenticate using a valid token" });
    } else {
        try {
            const data = jwt.verify(token, 'secret_ecom');
            req.user = data.user;
            next();

        } catch (error) {
            res.status(401).send({ error: "Please authenticate using a valid token" });
        }
    }
};


// Endpoint for adding products to cart
app.post('/addtocart', fetchUser, async (req, res) => {
    console.log("added", req.body.itemId);
    let userData = await User.findOne({ _id: req.user.id });
    userData.cartData[req.body.itemId] += 1;
    await User.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
    res.send("Added")

});


//   endpoint for removing product
app.post('/removecart', fetchUser, async (req, res) => {
    console.log("removed", req.body.itemId);
    let userData = await User.findOne({ _id: req.user.id });

    if (userData.cartData[req.body.itemId] > 0)
        userData.cartData[req.body.itemId] -= 1;
    await User.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
    res.send("Removed")
});


//  creating endpoint to get cartdata
app.post('/getcart', fetchUser, async (req, res) => {
    console.log("GetCart");
    let userData = await User.findOne({ _id: req.user.id });
    res.json(userData.cartData);
});


// Endpoint to place an order
app.post('/placeorder', fetchUser, async (req, res) => {
    const { userDetails, cartItems } = req.body;
  
    try {
      // Fetch the user's cart data from the userId in the token
      let userData = await User.findOne({ _id: req.user.id });
      if (!userData) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
  
      // Create an array of cart items with product details
      let items = [];
      let totalAmount = 0;
  
      for (let itemId in userData.cartData) {
        const product = await Product.findOne({ id: itemId });
        const quantity = userData.cartData[itemId];
  
        if (quantity > 0) {
          items.push({
            productId: product._id,
            quantity,
            price: product.new_price * quantity
          });
          totalAmount += product.new_price * quantity;
        }
      }
  
      // Create a new order
      const newOrder = new Order({
        userId: req.user.id,
        userDetails,
        cartItems: items,
        totalAmount,
        status: 'Pending'
      });
  
      await newOrder.save();
      res.json({ success: true, message: 'Order placed successfully!', orderId: newOrder._id });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Error placing the order.' });
    }
  });


//   Endpoint to get order
app.get('/getproduct/:productId', async (req, res) => {
    const { productId } = req.params;
  
    try {
      // Find the product by productId
      const product = await Product.findOne({ _id: productId });
  
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
  
      res.json({ success: true, product });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Error retrieving the product.' });
    }
  });

//  api to get search 
app.get('/searchproducts', async (req, res) => {
    const { query } = req.query; // Get the search query from the URL

    try {
        if (!query || query.trim() === "") {
            return res.status(400).json({ success: false, message: "Search query cannot be empty" });
        }

        const searchRegex = new RegExp(query, "i"); // Case-insensitive search
        const products = await Product.find({
            $or: [
                { name: searchRegex }, 
                { category: searchRegex }
            ]
        });

        if (products.length === 0) {
            return res.json({ success: true, products: [], message: "No products found" });
        }

        res.json({ success: true, products });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error searching for products" });
    }
});


// API to update product
app.post('/updateproduct', async (req, res) => {
    try {
        // Extract the productId and updated product data from the request body
        const { productId, updatedProduct } = req.body;
        const { name, old_price, new_price, category, sizes } = updatedProduct;

        // Validate productId
        if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ success: false, message: "Invalid productId" });
        }

        // Find the product by its ID
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
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
        res.json({ success: true, message: "Product updated successfully", product });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error updating product" });
    }
});



// Start the server 
app.listen(port, (error) => {
    if (!error) {
        console.log(`Server running on port ${port}`);
    } else if (error.code === 'EADDRINUSE') {
        console.log(`Port ${port} is already in use. Please try a different port.`);
    } else {
        console.log("Error: " + error);
    }
});


