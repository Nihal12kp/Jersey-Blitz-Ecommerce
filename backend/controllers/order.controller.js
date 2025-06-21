import Order from "../models/orderSchema.js";

// Endpoint to place an order
export const placeorder = async (req, res) => {
  const { userDetails, cartItems } = req.body;

  try {
    // Fetch the user's cart data from the userId in the token
    let userData = await User.findOne({ _id: req.user.id });
    if (!userData) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
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
          price: product.new_price * quantity,
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
      status: "Pending",
    });

    await newOrder.save();
    res.json({
      success: true,
      message: "Order placed successfully!",
      orderId: newOrder._id,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error placing the order." });
  }
};