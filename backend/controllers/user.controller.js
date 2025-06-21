import User from "../models/userScema.js";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.json({ errors: "User doesn't Exist" });
  }
  if (user.isBanned) {
    return res.json({ errors: "You are banned from logging in." });
  }
  if (user) {
    const passVerify = req.body.password === user.password;
    if (passVerify) {
      const data = {
        user: {
          id: user.id,
        },
      };
      const token = jwt.sign(data, "secret_ecom");
      res.json({ success: true, token });
    } else {
      res.json({ success: false, errors: "Wrong password" });
    }
  } else {
    res.json({ success: false, errors: "Wrong email id" });
  }
};

// Creating end points for registering the user
export const signup = async (req, res) => {
  let check = await User.findOne({ email: req.body.email });
  if (check) {
    return res
      .status(400)
      .json({ success: false, error: "existing user found with same email" });
  }
  let cart = {};
  for (let i = 0; i < 300; i++) {
    cart[i] = 0;
  }
  const user = new User({
    name: req.body.username,
    email: req.body.email,
    password: req.body.password,
    cartData: cart,
  });
  await user.save();

  const data = {
    user: {
      id: user.id,
    },
  };

  const token = jwt.sign(data, "secret_ecom");
  res.json({ success: true, token });
};

// Toggle user banned status (admin only)
export const userban = async (req, res) => {
  try {
    const { isBanned } = req.body;
    await User.findByIdAndUpdate(req.params.id, { isBanned });
    res.json({
      success: true,
      message: `User ${isBanned ? "banned" : "unbanned"} successfully`,
    });
  } catch (err) {
    res.status(500).json({ error: "Error updating user ban status" });
  }
};

//   to get all users
export const allusers = async (req, res) => {
  try {
    const users = await User.find(
      {},
      { name: 1, email: 1, cartData: 1, banned: 1 }
    ); // Include banned status
    res.json({ success: true, users });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error retrieving users." });
  }
};
