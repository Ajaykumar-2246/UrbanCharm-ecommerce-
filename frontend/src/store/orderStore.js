// src/store/orderStore.js
import { create } from "zustand";
import { axiosInstance } from "./axiosInstance";

export const useOrderStore = create((set) => ({
  userOrders: [],
  ownerOrders: [],

  fetchUserOrders: async () => {
    try {
      const response = await axiosInstance.get("/checkout/userOrder");
      set({ userOrders: response.data });
    } catch (error) {
      console.log("Error fetching user orders:", error);
    }
  },

  fetchOwnerOrders: async () => {
    try {
      const response = await axiosInstance.get("/checkout/ownerOrder");
      set({ ownerOrders: response.data });
    } catch (error) {
      console.log("Error fetching owner orders:", error);
    }
  },

  orderStatusUpdate: async (orderId, status) => {
    try {
      const res = await axiosInstance.put("/checkout/updateStatus", {
        orderId,
        status,
      });

      set((state) => ({
        userOrders: state.userOrders.map((order) =>
          order._id === orderId ? res.data : order
        ),
        ownerOrders: state.ownerOrders.map((order) =>
          order._id === orderId ? res.data : order
        ),
      }));
    } catch (error) {
      console.log("Error updating order status:", error);
    }
  },
}));
