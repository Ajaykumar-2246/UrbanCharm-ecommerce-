import React from "react";
import { Link } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import { ShoppingCart, Trash2, ArrowRight } from "lucide-react";

const Cart = () => {
  const { cart, deleteProduct, decreaseQuantity, addToCart } = useCartStore();

  const calculateTotal = () => {
    return cart.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  const Shipping = calculateTotal() > 1000 ? 0 : 50;

  return (
    <div className="min-h-screen bg-base-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>

        {cart && cart.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => {
                const { product, quantity } = item;
                return (
                  <div
                    key={product._id}
                    className="card card-side bg-base-100 shadow-md border border-base-300"
                  >
                    <figure className="w-34 h-34 p-4">
                      <img
                        src={product.image || "/placeholder-product.jpg"}
                        alt={product.name}
                        className="w-full h-full object-contain"
                      />
                    </figure>
                    <div className="card-body p-4 flex flex-col md:flex-row justify-between">
                      <div className="flex-1">
                        <Link
                          to={`/product/${product._id}`}
                          className="card-title hover:link line-clamp-2"
                        >
                          {product.name}
                        </Link>
                        <p className="text-sm text-gray-500">{product.brand}</p>

                        <div className="flex items-center mt-2">
                          <button
                            onClick={() => decreaseQuantity(product._id)}
                            disabled={quantity <= 1}
                            className="btn btn-sm btn-square btn-ghost"
                          >
                            -
                          </button>
                          <span className="mx-2">{quantity}</span>
                          <button
                            onClick={() => addToCart(product._id)}
                            className="btn btn-sm btn-square btn-ghost"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-col items-end justify-between">
                        <div className="text-md font-bold">
                          ₹{product.price * quantity}
                        </div>
                        <button
                          onClick={() => deleteProduct(product._id)}
                          className="btn btn-sm btn-ghost text-error"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Cart Total */}
            <div className="lg:col-span-1">
              <div className="card bg-base-100 shadow-md border border-base-300 p-6">
                <h2 className="text-xl font-bold mb-4">Cart Total</h2>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal ({cart.length} items)</span>
                    <span className="font-medium">
                      ₹{calculateTotal().toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="font-medium"> ₹{Shipping}</span>
                  </div>

                  <div className="divider"></div>

                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>₹{(calculateTotal() + Shipping).toFixed(2)}</span>
                  </div>

                  <Link
                    to={"/checkout"}
                    state={{ cart, total: calculateTotal() }}
                    className="btn btn-primary w-full mt-4"
                  >
                    Proceed to Checkout
                    <ArrowRight size={18} className="ml-2" />
                  </Link>
                  <div className="divider">OR</div>
                  <Link to="/collections" className="btn btn-ghost w-full mt-2">
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <ShoppingCart size={80} className="text-primary mb-4" />
            <h1 className="text-3xl font-bold mb-4 text-primary">
              Your Cart is Empty
            </h1>
            <p className="text-lg text-gray-500 mb-6">
              Add some products to your cart to checkout
            </p>
            <Link to="/collections" className="btn btn-primary gap-2">
              Start Shopping <ArrowRight size={18} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
