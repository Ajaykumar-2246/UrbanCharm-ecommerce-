import express from "express";
import {
  AllProducts,
  create,
  deleteProduct,
  getFeaturedProducts,
  getUserProducts,
  singleProductDetails,
  updateIsFeatured,
} from "../controllers/productControllers.js";
import { upload } from "../config/cloudinary_multer.js";
import { protect, AdminProtect } from "../middleware/protectRoutes.js";

const router = express.Router();

// Product routes (admin protected routes)
router.post(
  "/create",
  protect,
  AdminProtect,
  upload.single("productImage"),
  create
); // Admin creates a product
router.get("/allProducts", AllProducts); // Get all products (public route)
router.get("/getUserProducts", protect, AdminProtect, getUserProducts); // Admin gets their products
router.put("/isFeatured", protect, AdminProtect, updateIsFeatured); // Admin marks a product as featured
router.delete("/deleteProduct/:id", protect, AdminProtect, deleteProduct); // Admin deletes a product
router.get("/featuredProducts", getFeaturedProducts); // Get featured products (public route)
router.get("/productDetails/:id", singleProductDetails); // Get details of a single product by ID (public route)

export default router;
