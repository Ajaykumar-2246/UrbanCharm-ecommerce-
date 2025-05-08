import { create } from "zustand";
import { toast } from "react-hot-toast";
import { axiosInstance } from "./axiosInstance";

export const useAuthStore = create((set) => ({
  user: null,
  userProfile: null,
  isCheckingAuth: true,
  usersWishlist: [],

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const res = await axiosInstance.get("/auth/checkAuth");
      set({ user: res.data, isCheckingAuth: false });
      return res.data.user;
    } catch (err) {
      console.error("Auth check failed:", err);
      set({ user: null, isCheckingAuth: false });
      return null;
    }
  },

  signup: async (formData) => {
    try {
      const res = await axiosInstance.post("/auth/signup", formData);
      set({ user: res.data });
      toast.success("Signup successful!");
      return res.data.user;
    } catch (err) {
      const msg = err?.response?.data?.message || "Signup failed.";
      toast.error(msg);
      throw new Error(msg);
    }
  },

  login: async (formData) => {
    try {
      const res = await axiosInstance.post("/auth/login", formData);
      set({ user: res.data });
      toast.success("Login successful!");
      return res.data.user;
    } catch (err) {
      const msg = err?.response?.data?.message || "Login failed.";
      toast.error(msg);
      throw new Error(msg);
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ user: null });
      toast.success("Logged out successfully.");
    } catch (err) {
      toast.error("Logout failed.");
    }
  },

  fetchProfile: async () => {
    try {
      const res = await axiosInstance.get("/auth/profile");
      set({ userProfile: res.data.user });
    } catch (error) {
      console.log(error);
    }
  },

  addOrRemoveWishlist: async (productId) => {
    try {
      const res = await axiosInstance.put(`/auth/likeUnlike/${productId}`);
      set({ user: res.data });
      return res.data.user;
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to add to wishlist.";
      toast.error(msg);
      throw new Error(msg);
    }
  },

  fetchUserWishlist: async () => {
    try {
      const res = await axiosInstance.get("/auth/userWishlist");
      set({ usersWishlist: res.data.wishlist });
    } catch (error) {
      console.log(error);
    }
  },

  updateProfile: async (formData) => {
    try {
      const res = await axiosInstance.put("/auth/updateProfile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      set({ userProfile: res.data.user, user: res.data });
      toast.success("Profile updated successfully.");
      return res.data.user;
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to update profile.";
      toast.error(msg);
      throw new Error(msg);
    }
  },
}));
