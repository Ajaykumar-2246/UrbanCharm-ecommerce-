import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ShoppingCart,
  Heart,
  User,
  LogOut,
  LogIn,
  UserPlus,
  Menu,
  X,
  LayoutDashboard,
  Package,
  ShoppingBag,
} from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { useCartStore } from "../store/cartStore";

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const { cart } = useCartStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsAdmin(user?.user?.isAdmin || false);
  }, [user]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <nav className="bg-base-100 w-full shadow-sm sticky top-0 z-50 border-b border-base-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                UrbanCharm
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            <Link
              to="/collections"
              className={`flex items-center gap-2 px-3 py-2 rounded-btn rounded-md text-sm font-medium transition-colors ${
                isActive("/collections")
                  ? "bg-primary/10 text-primary"
                  : "text-base-content/80 hover:bg-base-200 hover:text-base-content"
              }`}
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Collections</span>
            </Link>

            {isAdmin && (
              <Link
                to="/admin"
                className={`flex items-center gap-2 px-3 py-2 rounded-btn rounded-md text-sm font-medium transition-colors ${
                  isActive("/admin")
                    ? "bg-primary/10 text-primary"
                    : "text-base-content/80 hover:bg-base-200 hover:text-base-content"
                }`}
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            )}

            {user ? (
              <>
                <Link
                  to="/cart"
                  className={`flex relative items-center gap-2 px-3 py-2 rounded-btn rounded-md text-sm font-medium transition-colors ${
                    isActive("/cart")
                      ? "bg-primary/10 text-primary"
                      : "text-base-content/80 hover:bg-base-200 hover:text-base-content"
                  }`}
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span>Cart</span>
                  {cart.length > 0 && (
                    <span className="badge absolute -top-1 -right-1 badge-xs badge-primary">
                      {cart.length}
                    </span>
                  )}
                </Link>
                <Link
                  to="/wishlist"
                  className={`flex items-center gap-2 px-3 py-2 rounded-btn rounded-md text-sm font-medium transition-colors ${
                    isActive("/wishlist")
                      ? "bg-primary/10 text-primary"
                      : "text-base-content/80 hover:bg-base-200 hover:text-base-content"
                  }`}
                >
                  <Heart className="h-4 w-4" />
                  <span>Wishlist</span>
                </Link>
                <Link
                  to="/orders"
                  className={`flex items-center gap-2 px-3 py-2 rounded-btn rounded-md text-sm font-medium transition-colors ${
                    isActive("/orders")
                      ? "bg-primary/10 text-primary"
                      : "text-base-content/80 hover:bg-base-200 hover:text-base-content"
                  }`}
                >
                  <Package className="h-4 w-4" />
                  <span>Orders</span>
                </Link>
                <Link
                  to="/profile"
                  className={`flex items-center gap-2 px-3 py-2 rounded-btn rounded-md text-sm font-medium transition-colors ${
                    isActive("/profile")
                      ? "bg-primary/10 text-primary"
                      : "text-base-content/80 hover:bg-base-200 hover:text-base-content"
                  }`}
                >
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-3 py-2 rounded-btn rounded-md text-sm font-medium text-error hover:bg-error/10 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`flex items-center gap-2 px-3 py-2 rounded-btn rounded-md text-sm font-medium transition-colors ${
                    isActive("/login")
                      ? "bg-primary/10 text-primary"
                      : "text-base-content/80 hover:bg-base-200 hover:text-base-content"
                  }`}
                >
                  <LogIn className="h-4 w-4" />
                  <span>Login</span>
                </Link>
                <Link
                  to="/signup"
                  className="flex items-center gap-2 px-3 py-2 rounded-btn rounded-md text-sm font-medium text-primary-content bg-primary hover:bg-primary-focus transition-colors"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Sign Up</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Navigation - Icons Only */}
          <div className="lg:hidden flex items-center space-x-4">
            {user && (
              <>
                <Link
                  to="/cart"
                  className="relative p-2 rounded-full hover:bg-base-200 transition-colors"
                  aria-label="Cart"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {cart.length > 0 && (
                    <span className="absolute -top-1 -right-1 badge badge-xs badge-primary">
                      {cart.length}
                    </span>
                  )}
                </Link>
                <Link
                  to="/wishlist"
                  className="p-2 rounded-full hover:bg-base-200 transition-colors"
                  aria-label="Wishlist"
                >
                  <Heart className="h-5 w-5" />
                </Link>
              </>
            )}

            <button
              onClick={toggleMenu}
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
              className="p-2 rounded-full hover:bg-base-200 transition-colors"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-base-100 shadow-lg z-40 border-t border-base-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/collections"
              onClick={toggleMenu}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium ${
                isActive("/collections")
                  ? "bg-primary/10 text-primary"
                  : "text-base-content hover:bg-base-200"
              }`}
            >
              <ShoppingBag className="h-5 w-5" />
              <span>Collections</span>
            </Link>

            {isAdmin && (
              <Link
                to="/admin"
                onClick={toggleMenu}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium ${
                  isActive("/admin")
                    ? "bg-primary/10 text-primary"
                    : "text-base-content hover:bg-base-200"
                }`}
              >
                <LayoutDashboard className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>
            )}

            {user ? (
              <>
                <Link
                  to="/orders"
                  onClick={toggleMenu}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium ${
                    isActive("/orders")
                      ? "bg-primary/10 text-primary"
                      : "text-base-content hover:bg-base-200"
                  }`}
                >
                  <Package className="h-5 w-5" />
                  <span>Orders</span>
                </Link>
                <Link
                  to="/profile"
                  onClick={toggleMenu}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium ${
                    isActive("/profile")
                      ? "bg-primary/10 text-primary"
                      : "text-base-content hover:bg-base-200"
                  }`}
                >
                  <User className="h-5 w-5" />
                  <span>Profile</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    toggleMenu();
                  }}
                  className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-error hover:bg-error/10"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={toggleMenu}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium ${
                    isActive("/login")
                      ? "bg-primary/10 text-primary"
                      : "text-base-content hover:bg-base-200"
                  }`}
                >
                  <LogIn className="h-5 w-5" />
                  <span>Login</span>
                </Link>
                <Link
                  to="/signup"
                  onClick={toggleMenu}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-primary-content bg-primary hover:bg-primary-focus"
                >
                  <UserPlus className="h-5 w-5" />
                  <span>Sign Up</span>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
