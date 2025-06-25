import User from "../models/userScema.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";

const fdUrl = process.env.FD_URL || "";
const JWT_SECRET = process.env.JWT_SECRET || "secret_ecom";

export const login = async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.json({ errors: "User doesn't Exist" });
  }
  if (user.isBanned) {
    return res.json({ errors: "You are banned from logging in." });
  }
  if (user) {
    const passVerify = await bcrypt.compare(req.body.password, user.password);
    if (!passVerify) {
      return res.json({ message: "Username or Password is Incorrect! " });
    }
    if (passVerify) {
      const data = {
        user: {
          id: user.id,
        },
      };
      const token = jwt.sign(data, "secret_ecom");
      res.json({ success: true, token });
    } else {
      res.json({ success: false, errors: "Email or Password is incorrect" });
    }
  } else {
    res.json({ success: false, errors: "Email or Password is incorrect" });
  }
};

// Creating end points for registering the user
export const signup = async (req, res) => {
  const password = req.body.password;
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
  if(password < 8){
    return res
      .status(400)
      .json({ success: false, error: "Password should be atleast 8 character!" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    name: req.body.username,
    email: req.body.email,
    password: hashedPassword,
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

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "10m" });
    const resetLink = `${fdUrl}/password-verify/${token}`;
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_EMAIL,
      to: email,
      subject: "Password Reset - Jersey Blitz",
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password. Link expires in 10 minutes.</p>`,
    });

    res.json({ message: "Reset link sent to email." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong." });
  }
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log(decoded);
    const user = await User.findOne({ email: decoded.email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password updated. Please login." });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Invalid or expired token." });
  }
};
