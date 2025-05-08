import React, { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  ShoppingBag,
  Home,
  ArrowRight,
  HandHeart,
} from "lucide-react";
import axios from "axios";
import { useCartStore } from "../store/cartStore";
import Confetti from "react-confetti";

const Success= () => {
  const { clearCart , cart } = useCartStore();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("session_id");

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  
  

  if (!sessionId) {
    navigate("/cart");
    
  }

  useEffect(() => {
    // Validate session ID format
    if (!sessionId || !sessionId.startsWith("cs_")) {
      console.error("Invalid session ID format:", sessionId);
      setError("Invalid session ID. Please check your order history.");
      setLoading(false);
      return;
    }

    const handleCheckoutSuccess = async () => {
      try {
        setLoading(true);
        const response = await axios.post(
          "http://localhost:5000/api/checkout/create-order",
          {
            sessionId,
          }
        );

        if (!response.data) {
          throw new Error("No data received from server");
        }

        setOrder(response.data);
        clearCart();
      } catch (err) {
        console.error("Order processing error:", {
          message: err.message,
          response: err.response?.data,
          stack: err.stack,
        });

        setError(
          err.response?.data?.message ||
            "Failed to process your order. Please check your order history later."
        );
      } finally {
        setLoading(false);
      }
    };

    handleCheckoutSuccess();

    return () => {
      // Cleanup if component unmounts
    };
  }, [sessionId, clearCart]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card bg-base-200 shadow-xl w-full max-w-md">
          <div className="card-body text-center">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <p className="mt-4">Finalizing your order...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-base-100 flex items-center justify-center px-4">
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        gravity={0.1}
        style={{ zIndex: 99 }}
        numberOfPieces={700}
        recycle={false}
      />

      <div className="card bg-base-100 shadow-xl w-full max-w-md">
        <div className="card-body text-center">
          <CheckCircle2 className="w-16 h-16 text-success mx-auto mb-4 animate-bounce" />
          <h2 className="card-title justify-center text-2xl">
            Payment Successful!
          </h2>
          <p>Thank you for your order. We're processing it now.</p>
          <div className="bg-base-200 rounded-box p-4 my-4">
            <div className="flex justify-between">
              <span className="text-base-content/70">Order number</span>
              <span className="font-semibold">
                {order?._id ? `#${order._id.slice(-6)}` : "#------"}
              </span>
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-base-content/70">Delivery estimate</span>
              <span className="font-semibold">3-5 business days</span>
            </div>
          </div>

          <div className="card-actions justify-center mt-4">
            <button className="btn btn-success w-full">
              <HandHeart className="mr-2" size={18} />
              Thanks for shopping with us!
            </button>

            <div className="flex gap-2 w-full">
              <Link to="/" className="btn btn-outline flex-1">
                <Home className="mr-2" size={18} />
                Home
              </Link>
              <Link to="/shop" className="btn btn-outline flex-1">
                <ShoppingBag className="mr-2" size={18} />
                Shop
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Success
