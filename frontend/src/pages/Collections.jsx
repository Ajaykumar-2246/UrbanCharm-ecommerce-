import React, { useEffect, useState } from "react";
import { useProductStore } from "../store/productStore";
import {
  Heart,
  ShoppingCart,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useCartStore } from "../store/cartStore";
import { useAuthStore } from "../store/authStore";
import { Link } from "react-router-dom";

const Collections = () => {
  const { allProducts, getProducts, currentPage, totalPages } =
    useProductStore();
  const { addToCart } = useCartStore();
  const { usersWishlist, addOrRemoveWishlist } = useAuthStore();

  const [page, setPage] = useState(1);
  const [visiblePages, setVisiblePages] = useState([]);

  useEffect(() => {
    getProducts(page);
  }, [getProducts, page]);

  useEffect(() => {
    const generateVisiblePages = () => {
      const pages = [];
      const maxVisible = 5;
      let start = Math.max(1, page - Math.floor(maxVisible / 2));
      let end = Math.min(totalPages, start + maxVisible - 1);

      if (end - start + 1 < maxVisible) {
        start = Math.max(1, end - maxVisible + 1);
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      return pages;
    };

    setVisiblePages(generateVisiblePages());
  }, [page, totalPages]);

  const handleAddCart = async (productId) => {
    await addToCart(productId);
  };

  const handleWishlist = async (productId) => {
    await addOrRemoveWishlist(productId);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-base-100 p-4 md:p-8 flex flex-col">
      {/* Products Grid */}
      <div className="max-w-7xl mx-auto flex-grow w-full">
        {allProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {allProducts.map((product) => (
                <div
                  key={product._id}
                  className="card bg-base-100 shadow-sm hover:shadow-md transition-shadow group flex flex-col h-full border border-base-200 rounded-lg"
                >
                  <figure className="relative aspect-square">
                    <img
                      src={product.image || "/placeholder-product.jpg"}
                      alt={product.name}
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                    {product.isFeatured && (
                      <div className="absolute top-2 left-2 badge badge-primary badge-sm">
                        FEATURED
                      </div>
                    )}
                    <button
                      onClick={() => handleWishlist(product._id)}
                      className="absolute top-2 right-2 btn btn-circle btn-sm btn-ghost bg-white"
                    >
                      <Heart
                        size={16}
                        className={
                          usersWishlist.some(
                            (item) => item.product._id === product._id
                          )
                            ? "fill-red-500 text-red-500"
                            : "text-gray-700 hover:text-red-500"
                        }
                      />
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

                    <div className="mt-auto space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-lg">
                          ₹{product.price}
                        </span>
                        {product.rating && (
                          <div className="badge badge-sm badge-outline">
                            <Star
                              size={12}
                              className="mr-1 fill-yellow-400 text-yellow-400"
                            />
                            {product.rating.toFixed(1)}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => handleAddCart(product._id)}
                        className="btn btn-primary btn-sm gap-2 w-full mt-2"
                      >
                        <ShoppingCart size={16} />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <h2 className="text-xl font-medium mb-2">No products available</h2>
            <p className="text-base-content/70">
              Check back later for new arrivals
            </p>
          </div>
        )}
      </div>

      {/* Enhanced Pagination - Positioned at bottom */}
      {allProducts.length > 0 && totalPages > 1 && (
        <div className="max-w-7xl mx-auto w-full mt-8 pb-8">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="join shadow-sm">
              <button
                className="join-item btn btn-sm md:btn-md border-base-300 bg-base-100 hover:bg-base-200"
                disabled={page === 1}
                onClick={() => handlePageChange(1)}
              >
                «
              </button>
              <button
                className="join-item btn btn-sm md:btn-md border-base-300 bg-base-100 hover:bg-base-200"
                disabled={page === 1}
                onClick={() => handlePageChange(page - 1)}
              >
                <ChevronLeft size={16} />
              </button>

              {visiblePages[0] > 1 && (
                <button className="join-item btn btn-sm md:btn-md border-base-300 bg-base-100 pointer-events-none">
                  ...
                </button>
              )}

              {visiblePages.map((pageNum) => (
                <button
                  key={pageNum}
                  className={`join-item btn btn-sm md:btn-md ${
                    page === pageNum
                      ? "btn-active border-primary bg-primary text-primary-content hover:bg-primary-focus"
                      : "border-base-300 bg-base-100 hover:bg-base-200"
                  }`}
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </button>
              ))}

              {visiblePages[visiblePages.length - 1] < totalPages && (
                <button className="join-item btn btn-sm md:btn-md border-base-300 bg-base-100 pointer-events-none">
                  ...
                </button>
              )}

              <button
                className="join-item btn btn-sm md:btn-md border-base-300 bg-base-100 hover:bg-base-200"
                disabled={page === totalPages}
                onClick={() => handlePageChange(page + 1)}
              >
                <ChevronRight size={16} />
              </button>
              <button
                className="join-item btn btn-sm md:btn-md border-base-300 bg-base-100 hover:bg-base-200"
                disabled={page === totalPages}
                onClick={() => handlePageChange(totalPages)}
              >
                »
              </button>
            </div>

            <div className="text-sm text-base-content/70">
              Page {page} of {totalPages}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Collections;
