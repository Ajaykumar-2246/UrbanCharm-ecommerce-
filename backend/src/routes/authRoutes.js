import express from "express";
import {
  checkAuth,
  getUserWishlist,
  loginUser,
  logoutUser,
  profile,
  registerUser,
  updateProfile,
  wishlistProduct,
} from "../controllers/authControllers.js";
import { protect } from "../middleware/protectRoutes.js";
import { upload } from "../config/cloudinary_multer.js";

const router = express.Router();

// User authentication routes
router.post("/signup", registerUser); // Register new user
router.post("/login", loginUser); // Login existing user
router.post("/logout", logoutUser); // Logout the user

// Protected routes
router.get("/checkAuth", protect, checkAuth); // Check authentication status
router.get("/profile", protect, profile); // Get user profile
router.put("/likeUnlike/:id", protect, wishlistProduct); // Add or remove product from wishlist
router.get("/userWishlist", protect, getUserWishlist); // Get user's wishlist
router.put(
  "/updateProfile",
  protect,
  upload.single("profilePic"),
  updateProfile
); // Update user profile with image

export default router;
