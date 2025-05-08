import React, { useState, useRef, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useProductStore } from "../store/productStore";

const AddProducts = () => {
  const { addProduct, AdminProducts, products } = useProductStore();

  const fileInputRef = useRef(null);
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: 0,
    category: "Men",
    subcategory: "Shirt",
    brand: "",
  });

  useEffect(() => {
    AdminProducts();
  }, [AdminProducts, products]);

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const categories = ["Men", "Women", "Kids", "Unisex"];
  const subcategories = {
    Men: ["Shirt", "T-shirt", "Jeans", "Jacket", "Sweater"],
    Women: ["Dress", "Shirt", "Jeans", "Skirt", "Coat"],
    Kids: ["Shirt", "T-shirt", "Jeans", "Jacket", "Sweater"],
    Unisex: ["Shirt", "T-shirt", "Jeans", "Jacket", "Sweater"],
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/webp","image/jpg","image/gif","image/avif"];
      const maxSize = 5 * 1024 * 1024;

      if (!validTypes.includes(file.type)) {
        toast.error("Invalid file type. Only JPG, PNG, WEBP , GIF,JPEG and AVIF allowed.");
        return;
      }
      if (file.size > maxSize) {
        toast.error("File too large. Max 5MB allowed.");
        return;
      }

      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
      setImage(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (
        !productData.name ||
        productData.price <= 0 ||
        !productData.brand ||
        !image
      ) {
        throw new Error("Please fill all required fields");
      }

      const formData = new FormData();
      Object.entries(productData).forEach(([key, value]) =>
        formData.append(key, value)
      );
      formData.append("productImage", image);

      await addProduct(formData);
      toast.success("Product added successfully!");

      setProductData({
        name: "",
        description: "",
        price: 0,
        category: "Men",
        subcategory: "Shirt",
        brand: "",
      });
      setImage(null);
      setImagePreview(null);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-100 p-6">
      <div className="max-w-xl mx-auto bg-base-200 rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Add New Product</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Product Name*</span>
            </label>
            <input
              type="text"
              name="name"
              value={productData.name}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Product Description</span>
            </label>
            <textarea
              name="description"
              value={productData.description}
              onChange={handleChange}
              className="textarea textarea-bordered w-full resize-none"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Product Price*</span>
            </label>
            <input
              type="number"
              name="price"
              min="0"
              step="0.01"
              value={productData.price}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Category*</span>
              </label>
              <select
                name="category"
                value={productData.category}
                onChange={handleChange}
                className="select select-bordered w-full"
              >
                {categories.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Subcategory*</span>
              </label>
              <select
                name="subcategory"
                value={productData.subcategory}
                onChange={handleChange}
                className="select select-bordered w-full"
              >
                {subcategories[productData.category]?.map((subcat) => (
                  <option key={subcat}>{subcat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Brand*</span>
            </label>
            <input
              type="text"
              name="brand"
              value={productData.brand}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Product Image*</span>
            </label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="file-input file-input-bordered w-full"
              accept="image/jpeg, image/png, image/webp"
            />
            {imagePreview && (
              <div className="mt-4">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-40 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="mt-2 btn btn-error"
                >
                  Remove Image
                </button>
              </div>
            )}
          </div>

          <div className="flex justify-end mt-6">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner" />
              ) : (
                "Add Product"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProducts;
