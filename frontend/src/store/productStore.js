import { create } from "zustand";
import { axiosInstance } from "./axiosInstance";

export const useProductStore = create((set) => ({
  products: [],
  newArivals: [],
  allProducts: [],
  productDetails: null,
  totalCount: 0,
  currentPage: 1, 
  totalPages: 1, 

  // Method to fetch products with pagination
  getProducts: async (page = 1, limit =20) => {
    try {
      const res = await axiosInstance.get("/products/allProducts", {
        params: { page, limit },
      });

      set({
        allProducts: res.data.products,
        totalCount: res.data.totalCount,
        currentPage: res.data.currentPage,
        totalPages: res.data.totalPages,
      });
    } catch (error) {
      console.log(error);
    }
  },

  // Admin methods
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
