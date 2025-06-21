import express, { Router } from "express";
import {
  login,
  signup,
  userban,
  allusers,
} from "../controllers/user.controller.js";

const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);
router.put("/users/:id/ban", userban);
router.get("/users", allusers);

export default router;
