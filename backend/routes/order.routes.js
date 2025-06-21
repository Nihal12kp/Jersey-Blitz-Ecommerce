import express, { Router } from "express";
import fetchUser from "../middleware/fetchUser.middleware.js";
import { placeorder } from "../controllers/order.controller.js";

const router = express.Router();

router.post("/placeorder", fetchUser,placeorder);
// router.post('/signup',signup)

export default router;
