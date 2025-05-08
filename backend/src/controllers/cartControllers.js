import { Product } from "../models/productModel.js";
import { User } from "../models/userModel.js";

// Add to Cart
export const addToCart = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { productId } = req.body;

    if (!userId) return res.status(401).json({ message: "Not authenticated" });
    if (!productId)
      return res.status(400).json({ message: "Product id is required" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const existingItem = user.cartItems.find(
      (cartItem) => cartItem.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      user.cartItems.push({ product: product._id, quantity: 1 });
    }

    await user.save();

    const updatedUser = await User.findById(userId)
      .populate("cartItems.product")
      .select("cartItems");

    res
      .status(200)
      .json({ message: "Cart updated", cart: updatedUser.cartItems });
  } catch (error) {
    console.error("Add to Cart Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get Cart
export const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("cartItems.product")
      .select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ cart: user.cartItems });
  } catch (error) {
    console.error("Get Cart Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Decrease Quantity
export const decreaseQuantity = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { productId } = req.body;

    if (!userId) return res.status(401).json({ message: "Not authenticated" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const existingItem = user.cartItems.find(
      (cartItem) => cartItem.product.toString() === productId
    );

    if (existingItem) {
      if (existingItem.quantity > 1) {
        existingItem.quantity -= 1;
      } else {
        user.cartItems = user.cartItems.filter(
          (cartItem) => cartItem.product.toString() !== productId
        );
      }

      await user.save();

      const updatedUser = await User.findById(userId)
        .populate("cartItems.product")
        .select("cartItems");

      res
        .status(200)
        .json({ message: "Cart updated", cart: updatedUser.cartItems });
    } else {
      res.status(404).json({ message: "Product not found in cart" });
    }
  } catch (error) {
    console.error("Decrease Quantity Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Delete Product from Cart
export const deleteProduct = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { productId } = req.body;

    if (!userId) return res.status(401).json({ message: "Not authenticated" });
    if (!productId)
      return res.status(400).json({ message: "Product id is required" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const productIndex = user.cartItems.findIndex(
      (cartItem) => cartItem.product.toString() === productId
    );

    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    user.cartItems.splice(productIndex, 1);
    await user.save();

    const updatedUser = await User.findById(userId)
      .populate("cartItems.product")
      .select("cartItems");

    res.status(200).json({
      message: "Product removed from cart",
      cart: updatedUser.cartItems,
    });
  } catch (error) {
    console.error("Delete Product Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Clear Cart
export const clearCart = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ message: "Not authenticated" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.cartItems = [];
    await user.save();

    const updatedUser = await User.findById(userId)
      .populate("cartItems.product")
      .select("cartItems");

    res
      .status(200)
      .json({ message: "Cart cleared", cart: updatedUser.cartItems });
  } catch (error) {
    console.error("Clear Cart Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
