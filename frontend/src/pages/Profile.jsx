import React, { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { useOrderStore } from "../store/orderStore";
import { Link } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  ShoppingBag,
  Heart,
  Edit,
  ChevronRight,
  LogOut,
  X,
  Camera,
  Package,
  DollarSign,
  UserCircle,
  MailCheck,
  PhoneCall,
} from "lucide-react";
import { Dialog } from "@headlessui/react";

const Profile = () => {
  const { userProfile, usersWishlist, logout, updateProfile } = useAuthStore();
  const { userOrders } = useOrderStore();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: userProfile?.name || "",
    email: userProfile?.email || "",
    phone: userProfile?.phone || "",
    profilePic: userProfile?.profilePic || "",
    profilePicFile: null,
  });

  const totalSpent = userOrders.reduce(
    (acc, order) => acc + order.totalPrice,
    0
  );

  const handleEditOpen = () => {
    setFormData({
      name: userProfile?.name || "",
      email: userProfile?.email || "",
      phone: userProfile?.phone || "",
      profilePic: userProfile?.profilePic || "",
      profilePicFile: null,
    });
    setIsEditOpen(true);
  };

  const handleSave = async () => {
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("phone", formData.phone);
      if (formData.profilePicFile) {
        data.append("profilePic", formData.profilePicFile);
      }

      await updateProfile(data);
      setIsEditOpen(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewURL = URL.createObjectURL(file);
      setFormData({
        ...formData,
        profilePic: previewURL,
        profilePicFile: file,
      });
    }
  };

  return (
    <div className="min-h-screen bg-base-100 py-8 px-4 sm:px-6 lg:px-8">
      {/* Edit Profile Modal */}
      <Dialog
        open={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md rounded-box bg-base-100 p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <Dialog.Title className="text-xl font-bold flex items-center gap-2">
                <Edit size={20} />
                Edit Profile
              </Dialog.Title>
              <button
                onClick={() => setIsEditOpen(false)}
                className="btn btn-ghost btn-sm btn-circle"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5">
              {/* Profile Picture Upload */}
              <div className="flex flex-col items-center">
                <div className="relative group mb-4">
                  {formData.profilePic ? (
                    <img
                      src={formData.profilePic}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover border-2 border-base-300"
                    />
                  ) : (
                    <UserCircle className="w-24 h-24 text-base-300" />
                  )}
                  <label className="absolute bottom-0 right-0 bg-base-100 p-2 rounded-full shadow-md cursor-pointer hover:bg-base-200">
                    <Camera size={16} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Name Field */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text flex items-center gap-2">
                    <User size={16} />
                    Full Name
                  </span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                />
              </div>

              {/* Email Field */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text flex items-center gap-2">
                    <Mail size={16} />
                    Email Address
                  </span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                />
              </div>

              {/* Phone Field */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text flex items-center gap-2">
                    <Phone size={16} />
                    Phone Number
                  </span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  onClick={() => setIsEditOpen(false)}
                  className="btn btn-ghost"
                >
                  Cancel
                </button>
                <button onClick={handleSave} className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-base-100 rounded-box shadow-sm overflow-hidden border border-base-200">
            <div className="relative bg-gradient-to-r from-primary to-secondary h-32">
              <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
                <div className="relative">
                  {userProfile?.profilePic ? (
                    <img
                      src={userProfile.profilePic}
                      alt="Profile"
                      className="w-32 h-32 rounded-full border-4 border-base-100 object-cover shadow-lg"
                    />
                  ) : (
                    <UserCircle className="w-32 h-32 text-base-300 border-4 border-base-100 rounded-full bg-base-200 p-2 shadow-lg" />
                  )}
                </div>
              </div>
            </div>

            <div className="pt-20 pb-6 px-6 text-center">
              <h1 className="text-2xl font-bold text-base-content mb-1 flex items-center justify-center gap-2">
                <UserCircle size={20} />
                {userProfile?.name || "Customer"}
              </h1>
              <p className="text-base-content/60 mb-4 flex items-center justify-center gap-2">
                <Mail size={16} />
                {userProfile?.email || "user@example.com"}
              </p>

              <button
                onClick={handleEditOpen}
                className="btn btn-primary btn-sm"
              >
                <Edit size={16} className="mr-2" />
                Edit Profile
              </button>
            </div>

            <div className="border-t border-base-200 px-6 py-4">
              <div className="grid grid-cols-3 divide-x divide-base-200 text-center">
                <div className="px-3">
                  <div className="text-xl font-bold text-base-content flex items-center justify-center gap-1">
                    <Package size={18} />
                    {userOrders.length || 0}
                  </div>
                  <div className="text-sm text-base-content/60">Orders</div>
                </div>
                <div className="px-3">
                  <div className="text-xl font-bold text-base-content flex items-center justify-center gap-1">
                    <Heart size={18} />
                    {usersWishlist.length || 0}
                  </div>
                  <div className="text-sm text-base-content/60">Wishlist</div>
                </div>
                <div className="px-3">
                  <div className="text-xl font-bold text-base-content flex items-center justify-center gap-1">
                    <DollarSign size={18} />₹{totalSpent.toFixed(2) || 0}
                  </div>
                  <div className="text-sm text-base-content/60">Spent</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-base-100 rounded-box shadow-sm overflow-hidden border border-base-200">
            <div className="px-6 py-4 border-b border-base-200">
              <h3 className="font-semibold text-base-content flex items-center gap-2">
                <User size={18} />
                Account
              </h3>
            </div>
            <div className="divide-y divide-base-200">
              <Link
                to="/orders"
                className="block px-6 py-4 hover:bg-base-200 transition-colors flex items-center"
              >
                <ShoppingBag size={20} className="text-base-content/60 mr-3" />
                <span className="font-medium">My Orders</span>
                <ChevronRight
                  size={20}
                  className="ml-auto text-base-content/40"
                />
              </Link>
              <Link
                to="/wishlist"
                className="block px-6 py-4 hover:bg-base-200 transition-colors flex items-center"
              >
                <Heart size={20} className="text-base-content/60 mr-3" />
                <span className="font-medium">Wishlist</span>
                <ChevronRight
                  size={20}
                  className="ml-auto text-base-content/40"
                />
              </Link>
              <button
                onClick={logout}
                className="w-full px-6 py-4 hover:bg-base-200 transition-colors flex items-center text-left text-error"
              >
                <LogOut size={20} className="mr-3" />
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Profile Details */}
        <div className="lg:col-span-2">
          <div className="bg-base-100 rounded-box shadow-sm overflow-hidden border border-base-200">
            <div className="px-6 py-5 border-b border-base-200">
              <h2 className="text-xl font-bold text-base-content flex items-center gap-2">
                <UserCircle size={20} />
                Profile Information
              </h2>
            </div>

            <div className="divide-y divide-base-200">
              {/* Name Field */}
              <div className="p-6 flex items-start gap-4">
                <div className="p-2 rounded-full bg-primary/10 text-primary">
                  <User size={18} />
                </div>
                <div>
                  <h3 className="font-medium text-base-content">Full Name</h3>
                  <p className="text-sm text-base-content/60">
                    {userProfile?.name || "Not provided"}
                  </p>
                </div>
              </div>

              {/* Email Field */}
              <div className="p-6 flex items-start gap-4">
                <div className="p-2 rounded-full bg-secondary/10 text-secondary">
                  <MailCheck size={18} />
                </div>
                <div>
                  <h3 className="font-medium text-base-content">Email</h3>
                  <p className="text-sm text-base-content/60">
                    {userProfile?.email || "Not provided"}
                  </p>
                </div>
              </div>

              {/* Phone Field */}
              <div className="p-6 flex items-start gap-4">
                <div className="p-2 rounded-full bg-accent/10 text-accent">
                  <PhoneCall size={18} />
                </div>
                <div>
                  <h3 className="font-medium text-base-content">Phone</h3>
                  <p className="text-sm text-base-content/60">
                    {userProfile?.phone || "Not provided"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
