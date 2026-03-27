import express from "express";
import {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} from "../controller/product.controller.js";

import { protect, authorize } from "../middleware/userMiddleware.js";

const router = express.Router();

// public
router.get("/", getAllProducts);
router.get("/:id", getProduct);

// admin
router.post("/", protect, authorize("admin"), createProduct);
router.put("/:id", protect, authorize("admin"), updateProduct);
router.delete("/:id", protect, authorize("admin"), deleteProduct);

export default router;
