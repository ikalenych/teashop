import { Router } from "express";
import {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders, // ← НОВИЙ
} from "../controllers/order.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { adminMiddleware } from "../middleware/admin.middleware"; // ← НОВИЙ

const router = Router();

// User endpoints
router.use(authMiddleware);
router.post("/", createOrder);
router.get("/", getUserOrders);
router.get("/:id", getOrderById);
router.put("/:id/status", updateOrderStatus);

// Admin endpoints
router.get("/admin/all", adminMiddleware, getAllOrders); // ← НОВИЙ
router.put("/:id/status", adminMiddleware, updateOrderStatus); // ← ДОДАЙ adminMiddleware

export default router;
