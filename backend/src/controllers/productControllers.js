import { Product } from "../models/productModel.js";

// @desc Create a new product
export const create = async (req, res) => {
  try {
    const user = req.user;
    const { name, description, price, category, subcategory, brand } = req.body;

    if (!name || !price || !category || !subcategory || !brand) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const product = await Product.create({
      user: user._id,
      name,
      description,
      price,
      category,
      subcategory,
      brand,
      image: req.file.path,
    });

    res.status(201).json({ message: "Product created", product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get all products
export const AllProducts = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get products for a specific user
export const getUserProducts = async (req, res) => {
  try {
    const products = await Product.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update product's featured status
export const updateIsFeatured = async (req, res) => {
  try {
    const user = req.user;
    const { productId, isFeatured } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (!user.isAdmin) {
      return res.status(401).json({ message: "Not authorized" });
    }

    product.isFeatured = isFeatured;
    await product.save();

    res.json({ message: "Product updated", product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete a product
export const deleteProduct = async (req, res) => {
  try {
    const user = req.user;
    const { id } = req.params;

    if (!user?.isAdmin) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.deleteOne();

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get all featured products
export const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ isFeatured: true }).sort({
      createdAt: -1,
    });
    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get a single product's details
export const singleProductDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
