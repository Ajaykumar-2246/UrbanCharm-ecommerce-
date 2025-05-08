import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useProductStore } from "../store/productStore";
import { Heart, ShoppingCart, ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const DisplayProductDetails = () => {
  const { singleProduct, productDetails, isLoading } = useProductStore();
  const { usersWishlist, addOrRemoveWishlist } = useAuthStore();
  const { id } = useParams();

  useEffect(() => {
    singleProduct(id);
  }, [id, singleProduct]);

  if (isLoading || !productDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-100">
        <div className="text-center space-y-4">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="text-lg text-base-content">
            Loading product details...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Back Button */}
        <Link
          to="/collections"
          className="flex items-center text-base-content/70 hover:text-primary mb-6 transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
          <span className="ml-1">Back to Products</span>
        </Link>

        {/* Product Card */}
        <div className="bg-base-200 rounded-xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
            {/* Product Image */}
            <div className="relative">
              <div className="aspect-square bg-base-300 rounded-lg overflow-hidden">
                <img
                  src={productDetails.image}
                  alt={productDetails.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {productDetails.isFeatured && (
                <div className="absolute top-4 left-4 badge badge-primary text-primary-content">
                  Featured
                </div>
              )}
              <button
                onClick={() => addOrRemoveWishlist(productDetails._id)}
                className="absolute top-4 right-4 btn btn-circle btn-sm btn-ghost bg-base-100/90 hover:bg-base-100"
                aria-label={
                  usersWishlist.some(
                    (item) => item.product._id === productDetails._id
                  )
                    ? "Remove from wishlist"
                    : "Add to wishlist"
                }
              >
                <Heart
                  className={`h-5 w-5 ${
                    usersWishlist.some(
                      (item) => item.product._id === productDetails._id
                    )
                      ? "text-error fill-error"
                      : "text-base-content hover:text-error"
                  }`}
                />
              </button>
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl md:text-3xl font-bold text-base-content">
                    {productDetails.name}
                  </h1>
                </div>

                <div className="mt-6">
                  <p className="text-base-content/80">
                    {productDetails.description ||
                      "Premium quality product with excellent craftsmanship."}
                  </p>
                </div>

                <div className="mt-6">
                  <h2 className="sr-only">Product information</h2>
                  <p className="text-3xl font-bold text-primary">
                    ₹{productDetails.price.toFixed(2)}
                  </p>
                  <p className="mt-2 text-sm text-base-content/50">
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

              <div className="mt-8 border-t border-base-300 pt-6">
                <h3 className="text-sm font-medium text-base-content">
                  Details
                </h3>
                <div className="mt-4 space-y-2">
                  <p className="text-sm text-base-content/80">
                    <span className="font-medium">Brand:</span>{" "}
                    {productDetails.brand || "Not specified"}
                  </p>
                  <p className="text-sm text-base-content/80">
                    <span className="font-medium">Category:</span>{" "}
                    {productDetails.category || "Not specified"}
                  </p>
                  <p className="text-sm text-base-content/80">
                    <span className="font-medium">Subcategory:</span>{" "}
                    {productDetails.subcategory || "Not specified"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section - You can implement this later */}
        {/* <div className="mt-12">
          <h2 className="text-xl font-bold text-base-content mb-6">You may also like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default DisplayProductDetails;
