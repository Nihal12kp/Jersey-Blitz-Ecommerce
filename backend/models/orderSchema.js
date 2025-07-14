import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userDetails: { type: Object, required: true },

    cartItems: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: Number,
        price: Number,
        sizes: [String]
      },
    ],

    totalAmount: { type: Number, required: true },
    // Razorpay integration fields
    razorpayOrderId: { type: String }, // Generated when order is created
    razorpayPaymentId: { type: String }, // Captured on payment success
    razorpaySignature: { type: String }, // For verification

    isPaid: { type: Boolean, default: false }, // Marks payment completion
    paidAt: { type: Date }, // Timestamp when paid

    status: { type: String, default: "Pending" }, // Optional: Pending, Paid, Failed
    shoppingStatus: {type: String, default:"Order Picked"},
  },

  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
