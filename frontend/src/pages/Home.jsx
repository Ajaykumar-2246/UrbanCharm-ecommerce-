import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Heart,
  ShoppingCart,
} from "lucide-react";
import { useProductStore } from "../store/productStore";
import { useCartStore } from "../store/cartStore";
import { useAuthStore } from "../store/authStore";

const Home = () => {
  const { FeaturedProducts, newArivals } = useProductStore();
  const { addToCart } = useCartStore();
  const { usersWishlist, addOrRemoveWishlist } = useAuthStore();

  const scrollLeft = () => {
    document
      .getElementById("product-carousel")
      ?.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    document
      .getElementById("product-carousel")
      ?.scrollBy({ left: 300, behavior: "smooth" });
  };

  useEffect(() => {
    FeaturedProducts();
  }, [FeaturedProducts]);

  const handleAddCart = async (productId) => {
    await addToCart(productId);
  };

  const handleWishlist = async (productId) => {
    await addOrRemoveWishlist(productId);
  };

  const filterNewArrivals = newArivals.slice(0, 10) || [];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[70vh] md:h-[80vh] overflow-hidden">
        <img
          src="https://images.pexels.com/photos/5868272/pexels-photo-5868272.jpeg"
          className="w-full h-full object-cover brightness-75"
          alt="Happy shoppers"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
            Welcome to Our Store
          </h1>
          <p className="text-lg md:text-xl text-white mb-8 max-w-2xl drop-shadow-md">
            Discover amazing products at unbeatable prices. Quality you can
            trust, service you can rely on.
          </p>
          <Link to="/collections">
            <button className="btn btn-primary btn-lg group">
              Shop Now{" "}
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="py-12 px-4 md:px-8 max-w-7xl mx-auto relative">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">New Arrivals</h2>
          <p className="text-base-content/70 max-w-2xl mx-auto">
            Check out our latest products just added to the collection
          </p>
        </div>

        <div className="relative group">
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/3 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-md hidden md:block transition-all -left-4"
          >
            <ChevronLeft className="h-6 w-6 text-gray-800" />
          </button>

          <div
            id="product-carousel"
            className="flex overflow-x-auto scrollbar-hide gap-4 pb-6 -mx-4 px-4"
          >
            {filterNewArrivals.map((product) => (
              <div key={product._id} className="flex-shrink-0 w-64">
                <div className="card bg-base-100 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full border border-base-200 rounded-lg">
                  <figure className="relative aspect-square">
                    <img
                      src={product.image || "/placeholder-product.jpg"}
                      alt={product.name}
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                    {product.isFeatured && (
                      <div className="absolute top-2 left-2 rounded-full badge badge-primary badge-xs">
                        FEATURED
                      </div>
                    )}
                    <button
                      onClick={() => handleWishlist(product._id)}
                      className="absolute top-2 right-2 btn btn-circle btn-sm btn-ghost bg-white/90 hover:bg-white"
                    >
                      {usersWishlist.some(
                        (item) => item.product._id === product._id
                      ) ? (
                        <Heart
                          size={16}
                          className="fill-red-500 text-red-500"
                        />
                      ) : (
                        <Heart
                          size={16}
                          className="text-gray-700 hover:text-red-500"
                        />
                      )}
                    </button>
                  </figure>

                  <div className="p-4 flex flex-col h-[136px]">
                    <Link
                      to={`/product/${product._id}`}
                      className="hover:underline mb-2"
                    >
                      <h3 className="text-sm font-medium line-clamp-2 h-12">
                        {product.name}
                      </h3>
                    </Link>

                    <div className="mt-auto space-y-2">
                      <div className="font-bold text-md">₹{product.price}</div>
                      <button
                        onClick={() => handleAddCart(product._id)}
                        className="btn btn-primary btn-sm gap-2 w-full mb-1 "
                      >
                        <ShoppingCart className="h-4 w-4" />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/3 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-md hidden md:block transition-all -right-4"
          >
            <ChevronRight className="h-6 w-6 text-gray-800" />
          </button>
        </div>

        <div className="text-center mt-12">
          <Link to="/collections" className="btn btn-outline btn-wide">
            View All Products
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-base-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-primary mb-4">
                <svg
                  className="w-10 h-10 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Products</h3>
              <p className="text-base-content/70">
                We source only the highest quality items from trusted suppliers.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-primary mb-4">
                <svg
                  className="w-10 h-10 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Shipping</h3>
              <p className="text-base-content/70">
                Get your orders delivered quickly with our reliable shipping
                partners.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-primary mb-4">
                <svg
                  className="w-10 h-10 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Payments</h3>
              <p className="text-base-content/70">
                Your transactions are protected with industry-standard
                encryption.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
