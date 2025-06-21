import jwt from "jsonwebtoken";

// Middleware to fetch user
const fetchUser = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    return res
      .status(401)
      .json({ success: false, error: "Access denied. No token provided." });
  }

  try {
    const data = jwt.verify(token, "secret_ecom"); // You can replace with process.env.JWT_SECRET
    req.user = data.user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, error: "Invalid token" });
  }
};

export default fetchUser;
