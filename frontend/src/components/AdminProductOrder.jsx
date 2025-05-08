import React, { useState } from "react";
import { useOrderStore } from "../store/orderStore";
import {
  ChevronDown,
  ChevronUp,
  Truck,
  Package,
  CheckCircle2,
  Clock,
  MapPin,
  User,
  Phone,
  Home,
  Navigation,
  Mail,
  CreditCard,
} from "lucide-react";

const AdminProductOrder = () => {
  const { ownerOrders, orderStatusUpdate } = useOrderStore();
  const [expandedOrders, setExpandedOrders] = useState({});
  const [updatingOrder, setUpdatingOrder] = useState(null);

  const toggleOrder = (orderId) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdatingOrder(orderId);
    try {
      await orderStatusUpdate(orderId, newStatus);
    } catch (error) {
      console.error("Failed to update order status:", error);
    } finally {
      setUpdatingOrder(null);
    }
  };

  const statusOptions = [
    { value: "processing", label: "Processing", icon: <Package size={16} /> },
    { value: "shipped", label: "Shipped", icon: <Truck size={16} /> },
    {
      value: "delivered",
      label: "Delivered",
      icon: <CheckCircle2 size={16} />,
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "processing":
        return "badge-warning";
      case "shipped":
        return "badge-info";
      case "delivered":
        return "badge-success";
      default:
        return "badge-neutral";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <h1 className="text-xl font-bold mb-4">Order Management</h1>

      {ownerOrders.length === 0 ? (
        <div className="text-center py-8 bg-base-100 rounded-box shadow-sm border border-base-200">
          <Clock className="mx-auto h-8 w-8 text-base-content/50 mb-2" />
          <p className="text-base-content/70">No orders found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {ownerOrders.map((order) => (
            <div
              key={order._id}
              className="bg-base-100 rounded-box shadow-sm border border-base-200"
            >
              {/* Order Summary Header */}
              <div
                className="px-4 py-3 flex justify-between items-center cursor-pointer hover:bg-base-200 transition-colors"
                onClick={() => toggleOrder(order._id)}
              >
                <div className="flex items-center space-x-3">
                  {expandedOrders[order._id] ? (
                    <ChevronUp className="h-5 w-5 text-base-content/70" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-base-content/70" />
                  )}
                  <div>
                    <h2 className="text-sm font-medium">
                      Order #{order._id.substring(0, 8).toUpperCase()}
                    </h2>
                    <p className="text-xs text-base-content/50">
                      {formatDate(order.createdAt)} • {order.orderItems.length}{" "}
                      item(s)
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className={`badge ${getStatusColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </span>
                  <span className="text-sm font-medium">
                    ${order.totalPrice?.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Expanded Order Details */}
              {expandedOrders[order._id] && (
                <div className="border-t border-base-200 p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    {/* Customer Info */}
                    <div className="bg-base-200 p-3 rounded-box text-sm">
                      <h3 className="font-medium mb-2 flex items-center">
                        <User className="h-4 w-4 mr-2 text-primary" />
                        Customer Information
                      </h3>
                      <div className="space-y-1">
                        <p className="flex items-center">
                          <span className="font-medium">Name:</span>{" "}
                          <span className="ml-1">
                            {order.user?.name || "Unknown"}
                          </span>
                        </p>
                        <p className="flex items-center">
                          <Mail className="h-4 w-4 mr-1 text-secondary" />
                          {order.user?.email}
                        </p>
                        <p className="flex items-center">
                          <Phone className="h-4 w-4 mr-1 text-accent" />
                          {order.user?.phone || order.shippingAddress?.phone || "Not provided"}
                        </p>
                      </div>
                    </div>

                    {/* Shipping Address - Enhanced */}
                    <div className="bg-base-200 p-3 rounded-box text-sm">
                      <h3 className="font-medium mb-2 flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-info" />
                        Shipping Details
                      </h3>
                      <div className="space-y-2">
                        <div className="flex items-start">
                          <Home className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-success" />
                          <div>
                            <p className="font-medium">
                              {order.shippingAddress?.recipientName ||
                                order.user?.name}
                            </p>
                            <p>{order.shippingAddress?.address}</p>
                            <p>
                              {order.shippingAddress?.city},{" "}
                              {order.shippingAddress?.state}
                            </p>
                            <p>
                              {order.shippingAddress?.country},{" "}
                              {order.shippingAddress?.zipCode}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2 text-accent" />
                          {order.shippingAddress?.phone ||
                            order.user?.phone ||
                            "Not provided"}
                        </div>
                        {order.shippingAddress?.additionalInfo && (
                          <div className="flex items-start">
                            <Navigation className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-warning" />
                            <p className="text-base-content/70">
                              {order.shippingAddress.additionalInfo}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Status Update */}
                    <div className="bg-base-200 p-3 rounded-box text-sm">
                      <h3 className="font-medium mb-2 flex items-center">
                        <CreditCard className="h-4 w-4 mr-2 text-primary" />
                        Order Status
                      </h3>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <select
                            value={order.status}
                            onChange={(e) =>
                              handleStatusUpdate(order._id, e.target.value)
                            }
                            disabled={updatingOrder === order._id}
                            className="select select-bordered select-sm w-full"
                          >
                            {statusOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.icon} {option.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        {updatingOrder === order._id && (
                          <p className="text-xs text-base-content/50">
                            Updating status...
                          </p>
                        )}
                        <div className="pt-2 border-t border-base-300">
                          <p className="text-xs">
                            <span className="font-medium">Payment:</span>{" "}
                            {order.isPaid ? (
                              <span className="text-success">Paid</span>
                            ) : (
                              <span className="text-error">Not Paid</span>
                            )}
                          </p>
                          <p className="text-xs">
                            <span className="font-medium">Method:</span>{" "}
                            {order.paymentMethod || "Unknown"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div>
                    <h3 className="font-medium text-sm mb-2">Order Items</h3>
                    <div className="space-y-2">
                      {order.orderItems.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center p-2 bg-base-200 rounded-box"
                        >
                          <div className="w-12 h-12 bg-base-300 rounded-box mr-3 overflow-hidden">
                            {item.image && (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{item.name}</p>
                            {item.brand && (
                              <p className="text-xs text-base-content/70">
                                Brand: {item.brand}
                              </p>
                            )}
                            <p className="text-xs text-base-content/70">
                              Qty: {item.quantity} × ${item.price?.toFixed(2)}
                            </p>
                          </div>
                          <div className="text-sm font-medium">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminProductOrder;
