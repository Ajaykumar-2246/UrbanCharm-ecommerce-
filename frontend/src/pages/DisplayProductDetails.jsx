import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useProductStore } from "../store/productStore";
import { Star, Heart, ShoppingCart, ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const DisplayProductDetails = () => {
  const { singleProduct, productDetails } = useProductStore();
  const { usersWishlist, addOrRemoveWishlist } = useAuthStore();
  const { id } = useParams();

  useEffect(() => {
    singleProduct(id);
  }, [id, singleProduct]);

  if (!productDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg"></div>
          <p className="mt-4 text-lg">Loading product details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Back Button */}
        <Link
          to="/collections"
          className="flex items-center text-gray-600 hover:text-primary mb-6"
        >
          <ChevronLeft className="h-5 w-5" />
          <span className="ml-1">Back to Products</span>
        </Link>

        {/* Product Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
            {/* Product Image */}
            <div className="relative">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={productDetails.image}
                  alt={productDetails.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {productDetails.isFeatured && (
                <div className="absolute top-4 left-4 badge badge-primary text-white">
                  Featured
                </div>
              )}
              <button
                onClick={() => addOrRemoveWishlist(productDetails._id)}
                className="absolute top-4 right-4 btn btn-circle btn-sm btn-ghost bg-white/90 hover:bg-white"
              >
                {usersWishlist.some(
                  (item) => item.product._id === productDetails._id
                ) ? (
                  <Heart className="h-5 w-5 text-red-500 fill-red-500 hover:text-red-500" />
                ) : (
                    <Heart className="h-5 w-5 text-gray-700 hover:text-red-500" />
                )}
              </button>
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                    {productDetails.name}
                  </h1>
                </div>

                <div className="mt-6">
                  <p className="text-gray-700">
                    {productDetails.description ||
                      "Premium quality product with excellent craftsmanship."}
                  </p>
                </div>

                <div className="mt-6">
                  <h2 className="sr-only">Product information</h2>
                  <p className="text-3xl font-bold text-gray-900">
                    ₹{productDetails.price.toFixed(2)}
                  </p>
                  <p className="mt-2 text-sm text-gray-500">
                    Inclusive of all taxes
                  </p>
                </div>
              </div>

              <div className="mt-8">
                <div className="flex space-x-4">
                  <button className="btn btn-primary flex-1 gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    Add to Cart
                  </button>
                </div>
              </div>

              <div className="mt-8 border-t border-gray-200 pt-6">
                <h3 className="text-sm font-medium text-gray-900">Details</h3>
                <div className="mt-4 space-y-2">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Brand:</span>{" "}
                    {productDetails.brand}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Category:</span>{" "}
                    {productDetails.category}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Subcategory:</span>{" "}
                    {productDetails.subcategory}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900">Customer Reviews</h2>
          <div className="mt-6 space-y-8">
            {[1, 2, 3].map((review) => (
              <div
                key={review}
                className="border-b border-gray-200 pb-6 last:border-0"
              >
                <div className="flex items-center">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < 4
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <h3 className="ml-2 text-sm font-medium">
                    Excellent product!
                  </h3>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  This is one of the best purchases I've made. The quality is
                  outstanding and it fits perfectly.
                </p>
                <p className="mt-2 text-xs text-gray-500">
                  - John D. • 2 days ago
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisplayProductDetails;
