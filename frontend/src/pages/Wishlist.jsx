import React from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { Heart, ShoppingCart, ArrowRight } from "lucide-react";
import { useCartStore } from "../store/cartStore";

const Wishlist = () => {
  const { addToCart } = useCartStore();
  const { usersWishlist, addOrRemoveWishlist } = useAuthStore();

  return (
    <div className="min-h-screen bg-base-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 text-center flex justify-center sm:text-left">
          <h1 className="text-xl font-mono sm:text-2xl font-bold mb-1">
            Your Wishlist
          </h1>
        </div>

        {usersWishlist.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {usersWishlist.map(({ product }) => (
              <div
                key={product._id}
                className="card bg-base-100 shadow-sm hover:shadow-md transition-shadow  group relative border border-base-200 rounded-lg h-full"
              >
                {/* Remove from wishlist button */}
                <button
                  onClick={() => addOrRemoveWishlist(product._id)}
                  className="absolute top-2 right-2 z-10 btn btn-circle btn-xs btn-ghost bg-white "
                  aria-label="Remove from wishlist"
                >
                  <Heart size={14} className="fill-red-500 text-red-500 " />
                </button>

                {/* Product Image */}
                <div className="relative aspect-square">
                  <img
                    src={product.image || "/placeholder-product.jpg"}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                  {/* Badges */}
                  <div className="absolute top-1 left-1 flex gap-1">
                    {product.isFeatured && (
                      <span className="badge badge-primary  badge-xs">
                        FEATURED
                      </span>
                    )}
                  </div>
                </div>

                {/* Product Info - Compact */}
                <div className="card-body p-3 ">
                  <Link to={`/product/${product._id}`} className="hover:link">
                    <h2 className="text-xs sm:text-sm font-medium line-clamp-2 mb-1">
                      {product.name}
                    </h2>
                  </Link>

                  <div className="flex items-center justify-between mt-1">
                    <span className="font-bold text-sm sm:text-base">
                      ₹{product.price}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="card-actions mt-2">
                    <button
                      onClick={() => addToCart(product._id)}
                      className="btn btn-primary btn-xs sm:btn-sm w-full gap-1"
                    >
                      <ShoppingCart size={12} className="sm:size-4" />
                      <span className="text-xs sm:text-sm">Add to Cart</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[40vh]">
            <Heart size={60} className="text-primary mb-3" />
            <h2 className="text-xl font-bold mb-1">Your wishlist is empty</h2>
            <p className="text-sm text-base-content/70 mb-4">
              Save your favorite items here for later
            </p>
            <Link to="/collections" className="btn btn-primary btn-sm gap-1">
              Browse Products <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
