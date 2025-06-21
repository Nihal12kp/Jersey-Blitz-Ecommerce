const port = 4000;
import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import userRoutes from "./routes/user.routes.js";
import productRoutes from "./routes/product.routes.js";
import orderRoutes from "./routes/order.routes.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use("/auth", userRoutes);
app.use("/product", productRoutes);
app.use("/order", orderRoutes);

// Database Connection with MongoDB
mongoose
  .connect(process.env.MONGO)
  .then(() => console.log("MongoDB connected"))
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



//   Endpoint to get order
// app.get('/getproduct//:slug/:productId', async (req, res) => {
//     const { productId } = req.params;

//     try {
//       // Find the product by productId
//       const product = await Product.findOne({ _id: productId });

//       if (!product) {
//         return res.status(404).json({ success: false, message: 'Product not found' });
//       }

//       res.json({ success: true, product });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ success: false, message: 'Error retrieving the product.' });
//     }
//   });

// Start the server
app.listen(port, (error) => {
  if (!error) {
    console.log(`Server running on port ${port}`);
  } else if (error.code === "EADDRINUSE") {
    console.log(`Port ${port} is already in use. Please try a different port.`);
  } else {
    console.log("Error: " + error);
  }
});
