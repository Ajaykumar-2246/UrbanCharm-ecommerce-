import Stripe from "stripe";
import dotenv from "dotenv";
import { Order } from "../models/orderModel.js";
import { Product } from "../models/productModel.js";
import { User } from "../models/userModel.js";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      totalPrice,
      currency = "INR",
    } = req.body;

    if (!orderItems?.length || !shippingAddress || !totalPrice) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const shippingPrice = totalPrice > 1000 ? 0 : 50;
    const totalAmount = totalPrice + shippingPrice;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: orderItems.map((item) => ({
        price_data: {
          currency: currency.toLowerCase(),
          product_data: {
            name: item.name,
            images: [item.image],
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
      customer_email: shippingAddress.email,
      metadata: {
        orderItems: JSON.stringify(orderItems),
        shippingAddress: JSON.stringify(shippingAddress),
        totalPrice: totalPrice.toString(),
        shippingPrice: shippingPrice.toString(),
      },
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const createOrder = async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ message: "Session ID is required" });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    const orderItems = JSON.parse(session.metadata.orderItems);
    const shippingAddress = JSON.parse(session.metadata.shippingAddress);
    const totalPrice = parseFloat(session.metadata.totalPrice);
    const shippingPrice = parseFloat(session.metadata.shippingPrice);

    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      totalPrice,
      shippingPrice,
      stripeId: session.id,
      isPaid: session.payment_status === "paid",
      paidAt: session.payment_status === "paid" ? new Date() : null,
      paymentMethod: "Stripe",
    });

    await order.save();
    res.status(201).json(order);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const LoggedInUserOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId) return res.status(401).json({ message: "Not authenticated" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const userOrders = await Order.find({ user: userId }).sort({
      createdAt: -1,
    });
    res.status(200).json(userOrders);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getOwnerOrders = async (req, res) => {
  try {
    const adminId = req.user._id;

    const ownedProducts = await Product.find({ user: adminId }).select("_id");
    const ownedProductIds = ownedProducts.map((p) => p._id);

    const orders = await Order.find({
      "orderItems.product": { $in: ownedProductIds },
    })
      .populate("user", "name email")
      .populate("orderItems.product", "name image price");

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching admin orders:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    if (!orderId || !status) {
      return res
        .status(400)
        .json({ message: "Order ID and status are required" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    await order.save();

    return res.status(200).json(order);
  } catch (error) {
    console.error("Error updating order status:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
