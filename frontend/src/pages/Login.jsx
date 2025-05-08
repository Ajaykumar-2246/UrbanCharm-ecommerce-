import React, { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Eye, EyeOff, Loader2, Mail, Lock, ArrowRight } from "lucide-react";
import { useAuthStore } from "../store/authStore";

const Login = () => {
  const {  login } = useAuthStore();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!formData.email || !formData.password) {
        return toast.error("All fields are required");
      }

      await login(formData);
      toast.success("Logged in successfully!");
    } catch (error) {
      toast.error(error.message || "Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-base-100 rounded-box shadow-lg overflow-hidden border border-base-300">
          <div className="p-6 sm:p-8">
            <div className="text-center mb-6">
              <div className="mx-auto w-12 h-12 rounded-xl bg-gradient-to-r from-primary to-secondary flex items-center justify-center shadow-md mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-base-100"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>

              <h2 className="text-xl font-bold text-base-content mb-1">
                Welcome back
              </h2>
              <p className="text-base-content/70 text-sm">
                Sign in to your account to continue
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-control">
                <div className="flex items-center gap-2 mb-1">
                  <Mail className="w-4 h-4 text-base-content/70" />
                  <label
                    htmlFor="email"
                    className="label-text text-base-content"
                  >
                    Email Address
                  </label>
                </div>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="john@example.com"
                  className="input input-bordered w-full focus:ring-2 focus:ring-primary"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-control">
                <div className="flex items-center gap-2 mb-1">
                  <Lock className="w-4 h-4 text-base-content/70" />
                  <label
                    htmlFor="password"
                    className="label-text text-base-content"
                  >
                    Password
                  </label>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="••••••••"
                    className="input input-bordered w-full pr-10 focus:ring-2 focus:ring-primary"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-base-content/50 hover:text-base-content transition-colors" />
                    ) : (
                      <Eye className="w-4 h-4 text-base-content/50 hover:text-base-content transition-colors" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className={`btn btn-primary w-full mt-4 ${
                  isLoading ? "loading" : ""
                }`}
                disabled={isLoading}
              >
                {!isLoading && (
                  <>
                    Sign In <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </button>
            </form>

            <div className="text-sm text-base-content/50 my-6 text-center">
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary underline">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
