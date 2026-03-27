import express from "express";
import { getDashboardStats } from "../controllers/dashboard.controller.js";
import { protect, authorize } from "../middleware/userMiddleware.js";

const router = express.Router();

// admin only
router.get("/stats", protect, authorize("admin"), getDashboardStats);

export default router;
