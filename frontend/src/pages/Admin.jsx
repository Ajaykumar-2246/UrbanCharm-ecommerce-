import React, { useEffect, useState } from "react";
import AddProducts from "../components/AddProducts";
import AdminProducts from "../components/AdminProducts";
import AdminProductOrder from "../components/AdminProductOrder";
import { LayoutDashboard, Plus, Package, ShoppingCart } from "lucide-react";
import { useOrderStore } from "../store/orderStore";

const Admin = () => {
  const {fetchOwnerOrders}=useOrderStore();

  const [activeTab, setActiveTab] = useState("addProducts");

  useEffect(() => {
    fetchOwnerOrders();
  }, []);

  const tabs = [
    {
      id: "addProducts",
      label: "Add Products",
      icon: <Plus className="h-4 w-4" />,
      component: <AddProducts />,
    },
    {
      id: "adminProducts",
      label: "Manage Products",
      icon: <Package className="h-4 w-4" />,
      component: <AdminProducts />,
    },
    {
      id: "adminProductOrder",
      label: "Product Orders",
      icon: <ShoppingCart className="h-4 w-4" />,
      component: <AdminProductOrder />,
    },
  ];

  return (
    <div className="min-h-screen bg-base-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <LayoutDashboard className="text-primary h-8 w-8" />
          <h1 className="text-2xl font-bold text-base-content">
            Admin Dashboard
          </h1>
        </div>

        {/* Tabs */}
        <div className="tabs tabs-boxed bg-base-200 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`tab flex items-center gap-2 ${
                activeTab === tab.id ? "tab-active" : ""
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-base-100 rounded-lg p-4 md:p-6 shadow-sm border border-base-300">
          {tabs.find((tab) => tab.id === activeTab)?.component}
        </div>
      </div>
    </div>
  );
};

export default Admin;
