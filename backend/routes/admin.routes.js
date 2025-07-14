import express from "express";
import {
  adminLogin,
  addproduct,
  allproduct,
  toggleProductStock,
  removeproduct,
  updateproduct,
  allusers,
  userban,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/admin.controller.js";

const router = express.Router();

router.post("/adminlogin", adminLogin)

router.post("/addproduct", addproduct);
router.get("/allproducts", allproduct);
router.put("/:id/toggle-stock", toggleProductStock);
router.post("/removeproduct", removeproduct);
router.post("/updateproduct", updateproduct);
router.get("/users", allusers);
router.get("/orders",getAllOrders)
router.put("/orders/:orderId", updateOrderStatus);

router.put("/user/:id/ban", userban);

export default router;
