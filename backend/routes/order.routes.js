import express from "express";
import {
  placeOrder,
  verifyPayment,
  getUserOrders,
  downloadInvoice,
} from "../controllers/order.controller.js";
import fetchUser from "../middleware/fetchUser.middleware.js";

const router = express.Router();

// POST /api/order/place – Create Razorpay order
router.post("/placeorder", fetchUser, placeOrder);
router.post("/verify", fetchUser, verifyPayment);

router.get("/myorders", fetchUser, getUserOrders);
router.get("/invoice/:orderId", fetchUser, downloadInvoice);

export default router;
