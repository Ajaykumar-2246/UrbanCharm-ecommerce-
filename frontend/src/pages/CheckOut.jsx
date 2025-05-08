import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { axiosInstance } from "../store/axiosInstance";
import { ArrowLeft, Truck } from "lucide-react";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart = [], total = 0 } = location.state || {};

  // Redirect immediately if cart is empty
  useEffect(() => {
    if (cart.length === 0 || total === 0) {
      navigate("/cart");
    }
  }, [cart, total, navigate]);

  // Don't render anything if cart is empty
  if (cart.length === 0 || total === 0) {
    return null;
  }

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

  const onSubmit = async (formData) => {
    try {
      const shippingPrice = total > 1000 ? 0 : 50;
      const totalPrice = parseFloat(total) + shippingPrice;

      const response = await axiosInstance.post(
        `/checkout/create-checkout-session`,
        {
          orderItems: cart.map((item) => ({
            name: item.product.name,
            quantity: item.quantity,
            image: item.product.image,
            price: parseFloat(item.product.price),
            brand: item.product.brand,
            product: item.product._id,
          })),
          shippingAddress: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            address: formData.address,
            city: formData.city,
            zipCode: formData.zip,
            state: formData.state,
            country: formData.country,
            phone: formData.phone,
            email: formData.email,
          },
          totalPrice: parseFloat(total),
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const { id } = response.data;
      const stripe = await stripePromise;

      const { error } = await stripe.redirectToCheckout({
        sessionId: id,
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert(`Payment failed: ${error.message}`);
    }
  };

  const shippingPrice = total > 1000 ? 0 : 50;
  const totalPrice = parseFloat(total) + shippingPrice;

  return (
    <div className="min-h-screen bg-base-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Link to="/cart" className="flex items-center text-primary mb-6">
          <ArrowLeft size={18} className="mr-1" /> Back to Cart
        </Link>

        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="card bg-base-100 shadow-md border border-base-300 p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Truck size={20} /> Shipping Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">
                      <span className="label-text">First Name*</span>
                    </label>
                    <input
                      type="text"
                      {...register("firstName", {
                        required: "First name is required",
                        minLength: {
                          value: 2,
                          message: "Minimum 2 characters required",
                        },
                      })}
                      className="input input-bordered w-full"
                    />
                    {errors.firstName && (
                      <span className="text-error text-sm">
                        {errors.firstName.message}
                      </span>
                    )}
                  </div>
                  <div>
                    <label className="label">
                      <span className="label-text">Last Name*</span>
                    </label>
                    <input
                      type="text"
                      {...register("lastName", {
                        required: "Last name is required",
                        minLength: {
                          value: 2,
                          message: "Minimum 2 characters required",
                        },
                      })}
                      className="input input-bordered w-full"
                    />
                    {errors.lastName && (
                      <span className="text-error text-sm">
                        {errors.lastName.message}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <label className="label">
                    <span className="label-text">Email*</span>
                  </label>
                  <input
                    type="email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                    className="input input-bordered w-full"
                  />
                  {errors.email && (
                    <span className="text-error text-sm">
                      {errors.email.message}
                    </span>
                  )}
                </div>

                <div className="mt-4">
                  <label className="label">
                    <span className="label-text">Address*</span>
                  </label>
                  <input
                    type="text"
                    {...register("address", {
                      required: "Address is required",
                      minLength: {
                        value: 5,
                        message: "Address is too short",
                      },
                    })}
                    className="input input-bordered w-full"
                  />
                  {errors.address && (
                    <span className="text-error text-sm">
                      {errors.address.message}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <label className="label">
                      <span className="label-text">City*</span>
                    </label>
                    <input
                      type="text"
                      {...register("city", {
                        required: "City is required",
                        minLength: {
                          value: 2,
                          message: "Minimum 2 characters required",
                        },
                      })}
                      className="input input-bordered w-full"
                    />
                    {errors.city && (
                      <span className="text-error text-sm">
                        {errors.city.message}
                      </span>
                    )}
                  </div>
                  <div>
                    <label className="label">
                      <span className="label-text">State*</span>
                    </label>
                    <input
                      type="text"
                      {...register("state", {
                        required: "State is required",
                        minLength: {
                          value: 2,
                          message: "Minimum 2 characters required",
                        },
                      })}
                      className="input input-bordered w-full"
                    />
                    {errors.state && (
                      <span className="text-error text-sm">
                        {errors.state.message}
                      </span>
                    )}
                  </div>
                  <div>
                    <label className="label">
                      <span className="label-text">ZIP Code*</span>
                    </label>
                    <input
                      type="text"
                      {...register("zip", {
                        required: "ZIP code is required",
                        pattern: {
                          value: /^\d{5,10}$/,
                          message: "Invalid ZIP code format",
                        },
                      })}
                      className="input input-bordered w-full"
                    />
                    {errors.zip && (
                      <span className="text-error text-sm">
                        {errors.zip.message}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <label className="label">
                    <span className="label-text">Country*</span>
                  </label>
                  <select
                    {...register("country", {
                      required: "Country is required",
                    })}
                    className="select select-bordered w-full"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select Country
                    </option>
                    <option value="US">United States</option>
                    <option value="IN">India</option>
                    <option value="UK">United Kingdom</option>
                  </select>
                  {errors.country && (
                    <span className="text-error text-sm">
                      {errors.country.message}
                    </span>
                  )}
                </div>

                <div className="mt-4">
                  <label className="label">
                    <span className="label-text">Phone*</span>
                  </label>
                  <input
                    type="tel"
                    {...register("phone", {
                      required: "Phone is required",
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: "Please enter a valid 10-digit phone number",
                      },
                    })}
                    className="input input-bordered w-full"
                  />
                  {errors.phone && (
                    <span className="text-error text-sm">
                      {errors.phone.message}
                    </span>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className={`btn btn-primary w-full mt-6 ${
                  isSubmitting ? "loading" : ""
                }`}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : "Pay with Stripe"}
              </button>
            </form>
          </div>

          <div className="lg:col-span-1">
            <div className="card bg-base-100 shadow-md border border-base-300 p-6 sticky top-6">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>

              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {cart.map((item) => (
                  <div key={item.product._id} className="flex gap-4">
                    <div className="w-16 h-16 bg-base-200 rounded-lg overflow-hidden">
                      <img
                        src={item.product.image || "/placeholder-product.jpg"}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{item.product.name}</h3>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="font-medium">
                      ₹{(item.product.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="divider"></div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>
                    {shippingPrice === 0
                      ? "FREE"
                      : `₹${shippingPrice.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₹{totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
