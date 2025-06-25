import express from "express";
import { login, signup,forgotPassword,resetPassword } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;
