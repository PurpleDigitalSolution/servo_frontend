import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import { useOrderStore } from "../store/ordertStore";
import type { Order } from "../interface/order.interface";
import {
  ArrowLeft,
  Package,
  MapPin,
  Clock,
  Fuel,
  Truck,
  CheckCircle,
  XCircle,
  AlertCircle,
  Building,
  Download,
  Printer,
} from "lucide-react";
import Loader from "../components/Loader";

const OrderDetails = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { getOrderById, loading, error } = useOrderStore();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchOrder = async () => {
    setIsLoading(true);
    try {
      const result = await getOrderById(orderId!);
      if (result) {
        setOrder(result);
      }
    } catch (err) {
      console.error("Error fetching order:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      setTimeout(() => {
        fetchOrder();
      }, 0);
    }
  }, [orderId]);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING_PAYMENT:
        "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      CONFIRMED:
        "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      PROCESSING:
        "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
      DELIVERED:
        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      CANCELLED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    };
    return (
      colors[status] ||
      "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
    );
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, React.ReactNode> = {
      PENDING_PAYMENT: <Clock size={16} />,
      CONFIRMED: <CheckCircle size={16} />,
      PROCESSING: <Package size={16} />,
      DELIVERED: <Truck size={16} />,
      CANCELLED: <XCircle size={16} />,
    };
    return icons[status] || <AlertCircle size={16} />;
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "NGN",
    }).format(parseFloat(amount));
  };

  if (isLoading || loading) {
    return (
      <MainLayout>
        <div className="p-6">
          <Loader />
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="p-6">
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center space-x-2 text-red-700 dark:text-red-400">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
            <button
              onClick={fetchOrder}
              className="mt-2 text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 underline"
            >
              Retry
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!order) {
    return (
      <MainLayout>
        <div className="p-6">
          <div className="text-center py-12 bg-surface rounded-lg border border-border">
            <Package className="w-12 h-12 text-text-secondary mx-auto mb-3" />
            <div className="text-text-secondary mb-2">Order not found</div>
            <button
              onClick={() => navigate("/orders")}
              className="text-primary hover:text-primary-hover text-sm font-medium"
            >
              Back to orders
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/orders")}
                className="p-2 hover:bg-surface-secondary rounded-lg transition-colors text-text-secondary hover:text-text-primary"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-text-primary">
                  Order Details
                </h1>
                <p className="text-text-secondary mt-1">
                  Order #{order.id.slice(0, 8)}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 mt-4 lg:mt-0">
              <button className="flex items-center space-x-2 bg-surface border border-border text-text-secondary px-4 py-2 rounded-lg hover:bg-surface-secondary transition-colors">
                <Printer size={18} />
                <span>Print</span>
              </button>
              <button className="flex items-center space-x-2 bg-surface border border-border text-text-secondary px-4 py-2 rounded-lg hover:bg-surface-secondary transition-colors">
                <Download size={18} />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Order Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-surface p-4 rounded-lg border border-border">
            <p className="text-xs text-text-secondary">Order Status</p>
            <div className="flex items-center space-x-2 mt-1">
              {getStatusIcon(order.status)}
              <span
                className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}
              >
                {order.status.replace("_", " ")}
              </span>
            </div>
          </div>
          <div className="bg-surface p-4 rounded-lg border border-border">
            <p className="text-xs text-text-secondary">Total Amount</p>
            <p className="text-xl font-bold text-text-primary mt-1">
              {formatCurrency(order.price)}
            </p>
          </div>
          <div className="bg-surface p-4 rounded-lg border border-border">
            <p className="text-xs text-text-secondary">Fuel Type</p>
            <p className="text-sm font-medium text-text-primary mt-1 flex items-center space-x-2">
              <Fuel size={16} className="text-primary" />
              <span>{order.fuelType}</span>
            </p>
          </div>
          <div className="bg-surface p-4 rounded-lg border border-border">
            <p className="text-xs text-text-secondary">Quantity</p>
            <p className="text-sm font-medium text-text-primary mt-1">
              {order.quantity} Liters
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Information */}
            <div className="bg-surface rounded-lg border border-border p-6">
              <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center space-x-2">
                <Package size={18} className="text-primary" />
                <span>Order Information</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-text-secondary">Order ID</p>
                  <p className="text-sm font-mono text-text-primary mt-1">
                    {order.id}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-text-secondary">Status</p>
                  <span
                    className={`px-2 py-1 text-xs rounded-full inline-block mt-1 ${getStatusColor(order.status)}`}
                  >
                    {order.status.replace("_", " ")}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-text-secondary">Fuel Type</p>
                  <p className="text-sm font-medium text-text-primary mt-1">
                    {order.fuelType}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-text-secondary">Quantity</p>
                  <p className="text-sm font-medium text-text-primary mt-1">
                    {order.quantity} Liters
                  </p>
                </div>
                <div>
                  <p className="text-xs text-text-secondary">Price per Liter</p>
                  <p className="text-sm font-medium text-text-primary mt-1">
                    {formatCurrency(
                      (
                        parseFloat(order.price) / parseFloat(order.quantity)
                      ).toString(),
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-text-secondary">Total Price</p>
                  <p className="text-sm font-bold text-text-primary mt-1">
                    {formatCurrency(order.price)}
                  </p>
                </div>
              </div>
            </div>

            {/* Station Information */}
            {order.station && (
              <div className="bg-surface rounded-lg border border-border p-6">
                <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center space-x-2">
                  <Building size={18} className="text-primary" />
                  <span>Station Information</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-text-secondary">Station Name</p>
                    <p className="text-sm font-medium text-text-primary mt-1">
                      {order.station.name}
                    </p>
                  </div>
                  {order.station.addressCity && (
                    <div>
                      <p className="text-xs text-text-secondary">City</p>
                      <p className="text-sm text-text-primary mt-1">
                        {order.station.addressCity}
                      </p>
                    </div>
                  )}
                  {order.station.addressState && (
                    <div>
                      <p className="text-xs text-text-secondary">State</p>
                      <p className="text-sm text-text-primary mt-1">
                        {order.station.addressState}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Delivery Address */}
            <div className="bg-surface rounded-lg border border-border p-6">
              <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center space-x-2">
                <MapPin size={18} className="text-primary" />
                <span>Delivery Address</span>
              </h3>
              <div className="flex items-start space-x-3">
                <MapPin size={20} className="text-text-secondary mt-0.5" />
                <p className="text-sm text-text-primary">
                  {order.deliveryAddress}
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Timeline */}
            <div className="bg-surface rounded-lg border border-border p-6">
              <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center space-x-2">
                <Clock size={18} className="text-primary" />
                <span>Order Timeline</span>
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                    <CheckCircle
                      size={16}
                      className="text-green-600 dark:text-green-400"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">
                      Order Created
                    </p>
                    <p className="text-xs text-text-secondary">
                      {formatDateTime(order.createdAt)}
                    </p>
                  </div>
                </div>
                {order.status === "CONFIRMED" && (
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                      <CheckCircle
                        size={16}
                        className="text-blue-600 dark:text-blue-400"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">
                        Order Confirmed
                      </p>
                      <p className="text-xs text-text-secondary">
                        {formatDateTime(order.updatedAt)}
                      </p>
                    </div>
                  </div>
                )}
                {order.status === "COMPLETED" && (
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                      <Truck
                        size={16}
                        className="text-green-600 dark:text-green-400"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">
                        Delivered
                      </p>
                      <p className="text-xs text-text-secondary">
                        {formatDateTime(order.updatedAt)}
                      </p>
                    </div>
                  </div>
                )}
                {order.status === "CANCELLED" && (
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                      <XCircle
                        size={16}
                        className="text-red-600 dark:text-red-400"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">
                        Order Cancelled
                      </p>
                      <p className="text-xs text-text-secondary">
                        {formatDateTime(order.updatedAt)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-surface rounded-lg border border-border p-6">
              <h3 className="text-sm font-semibold text-text-primary mb-4">
                Quick Actions
              </h3>
              <div className="space-y-2">
                {order.status === "PENDING_PAYMENT" && (
                  <button className="w-full text-left px-3 py-2 text-sm text-text-secondary hover:bg-surface-secondary rounded-lg transition-colors">
                    Confirm Payment
                  </button>
                )}
                {order.status === "CONFIRMED" && (
                  <button className="w-full text-left px-3 py-2 text-sm text-text-secondary hover:bg-surface-secondary rounded-lg transition-colors">
                    Mark as Processing
                  </button>
                )}
                {order.status === "IN_TRANSIT" && (
                  <button className="w-full text-left px-3 py-2 text-sm text-text-secondary hover:bg-surface-secondary rounded-lg transition-colors">
                    Mark as Delivered
                  </button>
                )}
                {(order.status === "PENDING_PAYMENT" ||
                  order.status === "CONFIRMED") && (
                  <button className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                    Cancel Order
                  </button>
                )}
                <button className="w-full text-left px-3 py-2 text-sm text-text-secondary hover:bg-surface-secondary rounded-lg transition-colors">
                  Contact Customer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default OrderDetails;
