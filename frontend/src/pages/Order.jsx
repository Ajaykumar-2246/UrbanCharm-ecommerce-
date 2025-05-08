import React, { useEffect, useState } from "react";
import { useOrderStore } from "../store/orderStore";
import {
  Truck,
  Package,
  CheckCircle2,
  Clock,
  XCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Link } from "react-router-dom";

const OrderPage = () => {
  const { userOrders, fetchUserOrders } = useOrderStore();
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    fetchUserOrders();
  }, [fetchUserOrders]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "delivered":
        return <CheckCircle2 className="text-success" size={18} />;
      case "shipped":
        return <Truck className="text-info" size={18} />;
      case "processing":
        return <Package className="text-warning" size={18} />;
      case "cancelled":
        return <XCircle className="text-error" size={18} />;
      default:
        return <Clock className="text-neutral" size={18} />;
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const toggleOrder = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  return (
    <div className="min-h-screen bg-base-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Your Orders</h1>
          <p className="mt-1 text-sm text-base-content/70">
            View and track all your orders
          </p>
        </div>

        {userOrders.length === 0 ? (
          <div className="card bg-base-200 shadow-sm p-8 text-center">
            <Package className="mx-auto h-12 w-12 text-base-content/30" />
            <h3 className="mt-2 text-lg font-medium">No orders yet</h3>
            <p className="mt-1 text-sm text-base-content/70">
              You haven't placed any orders. Start shopping now!
            </p>
            <div className="mt-6">
              <Link to="/collections" className="btn btn-primary">
                Browse Products
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {userOrders.map((order) => (
              <div
                key={order._id}
                className="card bg-base-100 shadow-sm border border-base-200"
              >
                {/* Order Summary Header */}
                <div
                  className="px-4 py-4 sm:px-6 flex justify-between items-center cursor-pointer hover:bg-base-200"
                  onClick={() => toggleOrder(order._id)}
                >
                  <div className="flex items-center gap-4">
                    <div>
                      {expandedOrder === order._id ? (
                        <ChevronUp className="h-5 w-5 text-base-content/70" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-base-content/70" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">
                        Order #{order._id.slice(-6).toUpperCase()}
                      </h3>
                      <p className="text-xs text-base-content/70">
                        {formatDate(order.createdAt)} •{" "}
                        {order.orderItems.length} item(s)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(order.status)}
                      <span className="text-sm font-medium capitalize">
                        {order.status}
                      </span>
                    </div>
                    <div className="text-sm font-medium">
                      ₹{(order.totalPrice + order.shippingPrice).toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Expanded Order Details */}
                {expandedOrder === order._id && (
                  <div className="border-t border-base-200">
                    {/* Order Items Preview */}
                    <div className="px-4 py-4">
                      <h4 className="text-xs font-medium text-base-content/70 mb-2">
                        ITEMS ORDERED
                      </h4>
                      <div className="space-y-3">
                        {order.orderItems.slice(0, 2).map((item) => (
                          <div
                            key={item.product}
                            className="flex items-center gap-3"
                          >
                            <div className="flex-shrink-0 w-12 h-12 rounded-md overflow-hidden bg-base-200">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h5 className="text-sm font-medium truncate">
                                {item.name}
                              </h5>
                              <p className="text-xs text-base-content/70">
                                Qty: {item.quantity} • ₹{item.price.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        ))}
                        {order.orderItems.length > 2 && (
                          <p className="text-xs text-base-content/70">
                            +{order.orderItems.length - 2} more items
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Shipping and Payment Summary */}
                    <div className="px-4 py-4 bg-base-200 grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <h4 className="font-medium text-base-content/70 mb-1">
                          SHIPPING
                        </h4>
                        <p>
                          {order.shippingAddress.firstName}{" "}
                          {order.shippingAddress.lastName}
                        </p>
                        <p className="text-base-content/70 text-xs mt-1">
                          {order.shippingAddress.city},{" "}
                          {order.shippingAddress.state}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium text-base-content/70 mb-1">
                          PAYMENT
                        </h4>
                        <p>{order.isPaid ? "Paid" : "Not Paid"}</p>
                        <p className="text-base-content/70 text-xs mt-1">
                          {order.paymentMethod}
                        </p>
                      </div>
                    </div>

                   
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderPage;
