import { User } from "../models/userModel.js";
import { Product } from "../models/productModel.js";
import generateToken from "../config/generateToken.js";

// @desc    Register new user
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ name, email, password });

    if (user) {
      generateToken(res, user._id); // Generate JWT token and set in cookie
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        phone: user.phone,
        profilePic: user.profilePic,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (user && (await user.matchPassword(password))) {
      generateToken(res, user._id); // Generate JWT token and set in cookie
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        phone: user.phone,
        profilePic: user.profilePic,
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Logout user
export const logoutUser = async (req, res) => {
  try {
    res.cookie("jwt", "", { httpOnly: true, expires: new Date(0) });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Check authentication status
export const checkAuth = async (req, res) => {
  try {
    const user = req.user;
    if (user) {
      res.json({
        message: "User is authenticated",
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          phone: user.phone,
          profilePic: user.profilePic,
        },
      });
    } else {
      res.status(401).json({ message: "Not authenticated" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
export const profile = async (req, res) => {
  try {
    const user = req.user;
    const userProfile = await User.findById(user._id);
    if (userProfile) {
      res.json({
        message: "User is authenticated",
        user: {
          _id: userProfile._id,
          name: userProfile.name,
          email: userProfile.email,
          isAdmin: userProfile.isAdmin,
          profilePic: userProfile.profilePic,
          phone: userProfile.phone,
          cartItems: userProfile.cartItems,

          wishlist: userProfile.wishlist,
          createdAt: userProfile.createdAt,
        },
      });
    } else {
      res.status(401).json({ message: "Not authenticated" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle product in wishlist
export const wishlistProduct = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const {id} = req.params;

    if (!user) return res.status(404).json({ message: "User not found" });
    if (!id)
      return res.status(400).json({ message: "Product id is required" });

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const existingItem = user.wishlist.find(
      (wishlistItem) => wishlistItem.product.toString() === id
    );

    if (existingItem) {
      await User.findByIdAndUpdate(req.user._id, {
        $pull: { wishlist: { product: id } },
      });
    } else {
      user.wishlist.push({ product: product._id });
      await user.save();
    }

    const updatedUser = await User.findById(req.user._id)
      .populate("wishlist.product")
      .select("wishlist");

    res.status(200).json({
      message: existingItem ? "Removed from wishlist" : "Added to wishlist",
      wishlist: updatedUser.wishlist,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user wishlist
export const getUserWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("wishlist.product")
      .select("wishlist");

    res.status(200).json({ wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, email, phone } = req.body;
    const image = req.file;

    if (!userId) return res.status(404).json({ message: 'User not found' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Set fields only if provided
    if (name) user.name = name;
    if (email) user.email = email;

    // Ensure 'phone' is initialized
    if (!user.phone && !phone) {
      user.phone = ""; // Default initialization if both are missing
    } else if (phone) {
      user.phone = phone;
    }

    if (image) user.profilePic = image.path;

    const updatedUser = await user.save();

    res.status(200).json({ message: 'Profile updated', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};



