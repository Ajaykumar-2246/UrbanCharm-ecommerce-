import React from "react";
import { XCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Cancel = () => {
   return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-base-200 rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-error/10 p-6 flex flex-col items-center">
          <XCircle className="w-16 h-16 text-error animate-bounce mb-4" />
          <h1 className="text-3xl font-bold text-error-content">
            Payment Cancelled
          </h1>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="text-center">
            <p className="text-lg text-base-content">
              Your payment was not completed. No charges have been made to your
              account.
            </p>
            <p className="mt-2 text-sm text-base-content/70">
              If this was a mistake, you can try again below.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 bg-base-300 flex flex-col sm:flex-row gap-3">
          <Link to="/cart" className="btn btn-error flex-1">
            Try Again
          </Link>
          <Link to="/" className="btn btn-outline flex-1">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cancel;
