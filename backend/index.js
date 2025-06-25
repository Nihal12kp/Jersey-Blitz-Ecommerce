const port = 4000;
import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier"
import cors from "cors";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import userRoutes from "./routes/user.routes.js";
import productRoutes from "./routes/product.routes.js";
import orderRoutes from "./routes/order.routes.js";
import adminRoutes from "./routes/admin.routes.js";

dotenv.config();
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const app = express();

app.use(express.json());
app.use(cors());
app.use("/auth", userRoutes);
app.use("/product", productRoutes);
app.use("/order", orderRoutes);
app.use("/admin", adminRoutes);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Database Connection with MongoDB
mongoose
  .connect(process.env.MONGO)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.log(err);
  });

// API Creation
app.get("/", (req, res) => {
  res.send("Express app is running 😎");
});

// Image storage engine
// const storage = multer.diskStorage({
//     destination: './uploads/images',
//     filename: (req, file, cb) => {
//         cb(null, `${Date.now()}_${file.originalname}`);
//     }
// });

// const upload = multer({ storage: storage });

// Static path to serve images
// app.use('/images', express.static('uploads/images'));

// Endpoint for image uploads
// app.post("/upload", upload.single('product'), async (req, res) => {
//     if (!req.file) {
//         return res.status(400).json({ success: 0, message: "No file uploaded." });
//     }
//     res.json({
//         success: 1,
//         image_url: `https://jersey-blitz-ecommerce.onrender.com/images/${req.file.filename}`
//     });
// });

const upload = multer(); // memory storage (no disk writes)

app.post("/upload", upload.single("product"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: 0, message: "No file uploaded." });
  }

  try {
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "jersey",
          transformation: [
            { width: 1000, crop: "scale" },
            { quality: "auto" },
            { fetch_format: "auto" },
          ],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });

    console.log("Optimized image uploaded to:", result.secure_url);
    res.json({
      success: 1,
      image_url: result.secure_url,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ success: 0, message: "Upload failed", error: error.message });
  }
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
