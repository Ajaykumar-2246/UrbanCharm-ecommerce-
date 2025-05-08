// src/App.jsx
import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Cart from "./pages/Cart";
import Admin from "./pages/Admin";
import CheckOut from "./pages/CheckOut";
import Collections from "./pages/Collections";
import Wishlist from "./pages/Wishlist";
import Success from "./pages/success";
import Order from "./pages/Order";
import DisplayProductDetails from "./pages/DisplayProductDetails";
import Profile from "./pages/Profile";

import { useAuthStore } from "./store/authStore";
import { useCartStore } from "./store/cartStore";
import { useOrderStore } from "./store/orderStore";

function App() {
  const { user, isCheckingAuth, checkAuth, fetchUserWishlist, fetchProfile } =
    useAuthStore();
  const { getCart } = useCartStore();
  const { fetchUserOrders } = useOrderStore();

  // Initial auth check
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Load cart on mount
  useEffect(() => {
    getCart();
  }, [getCart]);

  // Once logged in, fetch wishlist & orders
  useEffect(() => {
    if (user) {
      fetchUserWishlist();
      fetchUserOrders();
    }
  }, [user, fetchUserWishlist, fetchUserOrders]);

  // Fetch full user profile
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Show spinner while auth status is resolving
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex flex-col" data-theme="light">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-4">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" data-theme="sunset">
      <Toaster position="top-center" />
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/product/:id" element={<DisplayProductDetails />} />

          {/* Auth pages */}
          <Route
            path="/login"
            element={!user ? <Login /> : <Navigate to="/" replace />}
          />
          <Route
            path="/signup"
            element={!user ? <Signup /> : <Navigate to="/" replace />}
          />

          {/* Protected */}
          <Route
            path="/profile"
            element={user ? <Profile /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/cart"
            element={user ? <Cart /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/checkout"
            element={user ? <CheckOut /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/success"
            element={user ? <Success /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/wishlist"
            element={user ? <Wishlist /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/orders"
            element={user ? <Order /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/admin"
            element={
              user?.user?.isAdmin ? <Admin /> : <Navigate to="/" replace />
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
