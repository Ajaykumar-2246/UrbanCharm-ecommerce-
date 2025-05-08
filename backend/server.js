import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

import connectDB from "./src/config/database.js";
import authRoutes from "./src/routes/authRoutes.js";
import productRoutes from "./src/routes/productRoutes.js";
import cartRoutes from "./src/routes/cartRoutes.js";
import paymentRoutes from "./src/routes/paymentRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Needed for __dirname to work with ES modules
const __dirname = path.resolve();

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(
  cors({
    origin: ["http://localhost:5173", "https://ecommerce-hwu4.onrender.com"], // Frontend URLs
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/checkout", paymentRoutes);

// Serve frontend for production
if (process.env.NODE_ENV === "production") {
  const staticPath = path.join(__dirname, "frontend", "dist");
  app.use(express.static(staticPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });
}

// Connect DB and Start Server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.error("❌ Database connection failed:", err));
