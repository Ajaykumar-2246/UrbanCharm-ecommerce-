import express from "express";
import {
  addToCart,
  decreaseQuantity,
  deleteProduct,
  getCart,
  clearCart,
} from "../controllers/cartControllers.js";
import { protect } from "../middleware/protectRoutes.js";

const router = express.Router();

// Cart routes (user protected routes)
router.post("/add", protect, addToCart); // Add a product to the cart
router.get("/getCart", protect, getCart); // Get the user's cart
router.post("/decrease", protect, decreaseQuantity); // Decrease the quantity of a product in the cart
router.delete("/remove", protect, deleteProduct); // Remove a product from the cart
router.delete("/clear", protect, clearCart); // Clear the cart

export default router;
