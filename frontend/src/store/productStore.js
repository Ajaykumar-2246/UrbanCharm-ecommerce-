// src/store/productStore.js
import { create } from "zustand";
import { axiosInstance } from "./axiosInstance";

export const useProductStore = create((set) => ({
  products: [],
  newArivals: [],
  allProducts: [],
  productDetails: null,

  addProduct: async (productData) => {
    try {
      const res = await axiosInstance.post("/products/create", productData);
      // Optionally update state if needed
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  getProducts: async () => {
    try {
      const res = await axiosInstance.get("/products/allProducts");
      set({
        allProducts: res.data.products,
      });
    } catch (error) {
      console.log(error);
    }
  },

  AdminProducts: async () => {
    try {
      const res = await axiosInstance.get("/products/getUserProducts");
      set({
        products: res.data.products,
      });
    } catch (error) {
      console.log(error);
    }
  },

  toggleFeatured: async (productId, isFeatured) => {
    try {
      await axiosInstance.put("/products/isFeatured", {
        productId,
        isFeatured,
      });
      set((state) => ({
        products: state.products.map((product) =>
          product._id === productId ? { ...product, isFeatured } : product
        ),
      }));
    } catch (error) {
      console.log(error);
    }
  },

  deleteAdminProduct: async (productId) => {
    try {
      await axiosInstance.delete(`/products/deleteProduct/${productId}`);
      set((state) => ({
        products: state.products.filter((product) => product._id !== productId),
      }));
    } catch (error) {
      console.log(error);
    }
  },

  FeaturedProducts: async () => {
    try {
      const res = await axiosInstance.get("/products/featuredProducts");
      set({
        newArivals: res.data.products,
      });
    } catch (error) {
      console.log(error);
    }
  },

  singleProduct: async (productId) => {
    try {
      const res = await axiosInstance.get(
        `/products/productDetails/${productId}`
      );
      set({
        productDetails: res.data.product,
      });
    } catch (error) {
      console.log(error);
    }
  },
}));
