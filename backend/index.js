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
import adminRoutes from "./routes/admin.routes.js"

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use("/auth", userRoutes);
app.use("/product", productRoutes);
app.use("/order", orderRoutes);
app.use("/admin", adminRoutes);

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
        image_url: `https://jersey-blitz-ecommerce.onrender.com/images/${req.file.filename}`
    });
});


app._router.stack.forEach((r) => {
  if (r.route && r.route.path) {
    console.log("📦 Route:", r.route.path, Object.keys(r.route.methods));
  }
});
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
