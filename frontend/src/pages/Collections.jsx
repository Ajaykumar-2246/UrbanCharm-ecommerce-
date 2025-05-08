import React, { useEffect } from "react";
import { useProductStore } from "../store/productStore";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { useCartStore } from "../store/cartStore";
import { useAuthStore } from "../store/authStore";
import { Link } from "react-router-dom";

const Collections = () => {
  const { allProducts, getProducts } = useProductStore();
  const { addToCart } = useCartStore();
  const { usersWishlist, addOrRemoveWishlist } = useAuthStore();

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  const handleAddCart = async (productId) => {
    await addToCart(productId);
  };

  const handleWishlist = async (productId) => {
    await addOrRemoveWishlist(productId);
  };

  return (
    <div className="min-h-screen bg-base-100 p-4 md:p-8">
      {/* Products Grid */}
      <div className="max-w-7xl mx-auto">
        {allProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {allProducts.map((product) => (
              <div
                key={product._id}
                className="card bg-base-100 shadow-sm hover:shadow-md transition-shadow group flex flex-col h-full"
              >
                <figure className="relative aspect-square">
                  <img
                    src={product.image || "/placeholder-product.jpg"}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                  {product.isFeatured && (
                    <div className="absolute top-2 left-2 btn rounded-full badge badge-primary  badge-xs">
                      FEATURED
                    </div>
                  )}
                  {/* Wishlist Button */}
                  <button
                    onClick={() => handleWishlist(product._id)}
                    className="absolute top-2 right-2 btn btn-circle btn-sm btn-ghost bg-white/90 hover:bg-white"
                  >
                    {usersWishlist.some(
                      (item) => item.product._id === product._id
                    ) ? (
                      <Heart size={16} className="fill-red-500 text-red-500" />
                    ) : (
                      <Heart
                        size={16}
                        className="text-gray-700 hover:text-red-500"
                      />
                    )}
                  </button>
                </figure>

                <div className="card-body p-4 flex flex-col">
                  <Link
                    to={`/product/${product._id}`}
                    className="hover:underline flex-grow"
                  >
                    <h3 className="text-sm font-medium line-clamp-2 mb-2 min-h-[40px]">
                      {product.name}
                    </h3>
                  </Link>

                  <div className="mt-auto">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-lg">
                        ₹{product.price}
                      </span>
                    </div>

                    <button
                      onClick={() => handleAddCart(product._id)}
                      className="btn btn-primary btn-sm gap-2 w-full"
                    >
                      <ShoppingCart size={16} />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <h2 className="text-xl font-medium mb-2">No products available</h2>
            <p className="text-gray-500">Check back later for new arrivals</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Collections;
