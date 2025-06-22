import express, { Router } from "express";
import fetchUser from "../middleware/fetchUser.middleware.js";
import {
  allproduct,
  newcollection,
  popular,
  relatedproduct,
  searchproduct,
  addCart,
  removecart,
  getcart,
  slugproduct,
} from "../controllers/product.controller.js";

const router = express.Router();

router.get("/allproducts", allproduct);
router.get("/newcollection", newcollection);
router.get("/popularinclassickit", popular);
router.get("/relatedproduct", relatedproduct);
router.get("/searchproducts", searchproduct);

// router.post("/upload", upload.single("product"),imgupload);
router.post("/addtocart", fetchUser, addCart);
router.post("/removecart", fetchUser, removecart);
router.post("/getcart", fetchUser, getcart);
router.get("/getproduct/:slug/:productId", slugproduct);

export default router;
