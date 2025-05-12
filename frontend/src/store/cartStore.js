import { create } from "zustand";
import { axiosInstance } from "./axiosInstance";

export const useCartStore = create((set,get) => ({
  cart: [],
  cartCount: () => get().cart.length,

  getCart: async () => {
    try {
      const res = await axiosInstance.get("/carts/getCart");
      set({ cart: res.data.cart });
    } catch (err) {
      console.error("Fetch cart failed:", err);
    }
  },

  addToCart: async (productId) => {
    try {
      const res = await axiosInstance.post("/carts/add", { productId });
      set({ cart: res.data.cart });
    } catch (err) {
      console.error("Add to cart failed:", err);
    }
  },

  decreaseQuantity: async (productId) => {
    try {
      const res = await axiosInstance.post("/carts/decrease", { productId });
      set({ cart: res.data.cart });
    } catch (err) {
      console.error("Decrease quantity failed:", err);
    }
  },

  deleteProduct: async (productId) => {
    set((state) => ({
      cart: state.cart.filter((item) => item.product._id !== productId),
    }));
    try {
      const res = await axiosInstance.delete("/carts/remove", {
        data: { productId },
      });
      set({ cart: res.data.cart });
    } catch (err) {
      console.error("Delete product failed:", err);
    }
  },

  clearCart: async () => {
    set({ cart: [] });
    try {
      const res = await axiosInstance.delete("/carts/clear");
      set({ cart: res.data.cart });
    } catch (err) {
      console.error("Clear cart failed:", err);
    }
  },
}));
