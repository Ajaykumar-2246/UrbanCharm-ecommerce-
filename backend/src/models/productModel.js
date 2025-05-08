import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    name: { type: String, required: true, trim: true },
    description: { type: String },
    price: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      required: true,
      enum: ["Men", "Women", "Kids", "Unisex"],
    },
    subcategory: {
      type: String,
      required: true,
      enum: [
        "Shirt",
        "T-shirt",
        "Jeans",
        "Jacket",
        "Sweater",
        "Dress",
        "Shorts",
        "Skirt",
        "Coat",
      ],
    },
    brand: { type: String, required: true },
    image: { type: String, required: true },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);
