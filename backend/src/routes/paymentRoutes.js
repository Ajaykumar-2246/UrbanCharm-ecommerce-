import express from "express";
import {
  createCheckoutSession,
  createOrder,
  getOwnerOrders,
  LoggedInUserOrder,
  updateOrderStatus,
} from "../controllers/paymentsControllers.js";
import { protect, AdminProtect } from "../middleware/protectRoutes.js";

const router = express.Router();

// Order routes
router.post("/create-checkout-session", protect, createCheckoutSession); // Create Stripe checkout session
router.post("/create-order", protect, createOrder); // Create an order
router.get("/userOrder", protect, LoggedInUserOrder); // Get orders for the logged-in user
router.get("/ownerOrder", protect, AdminProtect, getOwnerOrders); // Get orders for the admin
router.put("/updateStatus", protect, AdminProtect, updateOrderStatus); // Admin updates order status

export default router;
