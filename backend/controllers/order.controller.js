import Order from "../models/orderSchema.js";
import User from "../models/userScema.js";
import Product from "../models/productSchema.js";
import { generateInvoicePDF } from "../utils/generateInvoicePDF.js";
import { sendOrderConfirmation } from "../utils//sendOrderConfirmation.js";
import crypto from "crypto";
import Razorpay from "razorpay";
import dotenv from "dotenv";
dotenv.config();
// Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});
// TEMPORARY DEBUG LOGS
// console.log("✅ RAZORPAY_KEY_ID:", process.env.RAZORPAY_KEY_ID);
// console.log("✅ RAZORPAY_KEY_SECRET:", process.env.RAZORPAY_SECRET);

export const placeOrder = async (req, res) => {
  const { userDetails: userDetails } = req.body;

  try {
    // Step 1: Get user cart
    const user = await User.findById(req.user.id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    let items = [];
    let totalAmount = 0;

    for (const itemId in user.cartData) {
      const product = await Product.findOne({ id: itemId });
      const cartEntry = user.cartData[itemId];

      if (product && cartEntry.quantity > 0) {
        const itemTotal = product.new_price * cartEntry.quantity;
        items.push({
          productId: product._id,
          quantity: cartEntry.quantity,
          sizes: cartEntry.sizes, // optional: store sizes in order
          price: itemTotal,
        });
        totalAmount += itemTotal;
      }
    }

    if (totalAmount === 0 || items.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Cart is empty or invalid." });
    }

    // Step 2: Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: totalAmount * 100, // In paise
      currency: "INR",
      receipt: "receipt_" + Date.now(),
      payment_capture: 1,
    });

    // Step 3: Save order in DB
    const newOrder = new Order({
      userId: req.user.id,
      userDetails,
      cartItems: items,
      totalAmount,
      status: "Pending",
      razorpayOrderId: razorpayOrder.id,
    });

    await newOrder.save();

    // Step 4: Respond with payment info
    res.json({
      success: true,
      message: "Order created, proceed to payment.",
      orderId: newOrder._id,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      razorpayKey: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Place order error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error while placing order." });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      orderId, // our DB order ID
    } = req.body;

    // Step 1: Verify signature
    const body = `${razorpayOrderId}|${razorpayPaymentId}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpaySignature) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid signature" });
    }

    // Step 2: Mark order as paid
    const order = await Order.findById(orderId)
      .populate("cartItems.productId")
      .populate({
        path: "userId",
        select: "email",
      });
    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });

    order.razorpayPaymentId = razorpayPaymentId;
    order.razorpaySignature = razorpaySignature;
    order.isPaid = true;
    order.status = "Paid";
    order.paidAt = new Date();
    await order.save();

    console.log(order.userId?.email);
    if (order.userId?.email?.trim()) {
      await sendOrderConfirmation(order.userId?.email, order);
      res.json({
        success: true,
        message: "Payment verified and Sent Mail Successfully",
        order,
      });
    } else {
      res.status(400).json({ success: false, message: "User email not found" });
    }
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to load orders" });
  }
};

export const downloadInvoice = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate("cartItems.productId")
      .populate({ path: "userId", select: "name email" });

    if (!order || order.userId?._id?.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized or order not found" });
    }

    // Generate the PDF as a Buffer using html-pdf
    const pdfBuffer = await generateInvoicePDF(order);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice_${order._id}.pdf`
    );

    res.end(pdfBuffer); // Send the buffer as the response
  } catch (err) {
    console.error("Invoice generation failed:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to generate invoice." });
  }
};
