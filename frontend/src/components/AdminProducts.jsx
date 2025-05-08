import React from "react";
import { useProductStore } from "../store/productStore";
import { Edit2, Trash2, Star, StarOff } from "lucide-react";

const AdminProducts = () => {
  const { products, deleteAdminProduct, toggleFeatured } = useProductStore();

  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await deleteAdminProduct(productId);
    }
  };

  const handleToggleFeatured = async (productId, currentStatus) => {
    await toggleFeatured(productId, !currentStatus);
  };

  return (
    <div className="p-6">
      <div className="overflow-x-auto">
        {products && products.length > 0 ? (
          <table className="table w-full">
            {/* Table Header */}
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Category</th>
                <th>Subcategory</th>
                <th>Featured</th>
                <th>Actions</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="hover">
                  <td>
                    <div className="flex items-center space-x-3">
                      <div className="avatar">
                        <div className="mask mask-squircle w-12 h-12">
                          <img src={product.image} alt={product.name} />
                        </div>
                      </div>
                      <div>
                        <div className="font-bold">{product.name}</div>
                        <div className="text-sm opacity-50">
                          {product.brand}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>₹{product.price.toFixed(2)}</td>
                  <td>{product.category}</td>
                  <td>{product.subcategory}</td>
                  <td>
                    <button
                      onClick={() =>
                        handleToggleFeatured(product._id, product.isFeatured)
                      }
                      className={`btn btn-sm btn-ghost ${
                        product.isFeatured ? "text-yellow-500" : "text-gray-400"
                      }`}
                    >
                      {product.isFeatured ? (
                        <Star className="w-5 h-5 fill-current" />
                      ) : (
                        <StarOff className="w-5 h-5" />
                      )}
                    </button>
                  </td>
                  <td>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="btn btn-sm btn-outline btn-error"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <h1 className="text-2xl font-bold mb-4">No products found</h1>
            <p className="text-gray-500">Add some products to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;
