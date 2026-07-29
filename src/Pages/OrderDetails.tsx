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
  Calendar,
  Users,
  Eye,
  Receipt,
  Truck as DeliveryTruck,
  ShoppingCart,
  Loader2,
  CreditCard,
  Flag,
} from "lucide-react";
import Loader from "../components/Loader";
import { useTransactionStore } from "../store/transactionStore";

const OrderDetails = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { getOrderById, loading, error, updateOrderStatus } = useOrderStore();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { verifyTransaction } = useTransactionStore();

  const handleUpdateStatus = async (status: string) => {
    if (!order) return;
    setIsUpdating(true);
    try {
      const result = await updateOrderStatus(orderId!, status);
      if (result) {
        setOrder(result);
      }
    } catch (err) {
      console.error("Error updating order status:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleVerifyPayment = async () => {
    if (!order) return;
    setIsUpdating(true);
    try {
      const res = await verifyTransaction(orderId!);

      if (res.status) {
        const result = await updateOrderStatus(orderId!, "PENDING_CONFIRMATION");
        if (result) {
          setOrder(result);
        }
      }
    } catch (err) {
      console.error("Error verifying payment:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleMarkAsInTransit = async () => {
    if (!order) return;
    setIsUpdating(true);
    try {
      const result = await updateOrderStatus(orderId!, "IN_TRANSIT");
      if (result) {
        setOrder(result);
      }
    } catch (err) {
      console.error("Error marking order as in transit:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleMarkAsCompleted = async () => {
    if (!order) return;
    setIsUpdating(true);
    try {
      const result = await updateOrderStatus(orderId!, "COMPLETED");
      if (result) {
        setOrder(result);
      }
    } catch (err) {
      console.error("Error marking order as completed:", err);
    } finally {
      setIsUpdating(false);
    }
  };

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
      IN_TRANSIT:
        "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
      DELIVERED:
        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      COMPLETED:
        "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
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
      IN_TRANSIT: <Truck size={16} />,
      DELIVERED: <CheckCircle size={16} />,
      COMPLETED: <Flag size={16} />,
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

  const formatCurrency = (amount: string | number) => {
    const amountInNaira =
      typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amountInNaira);
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
              {order.status === "PENDING_PAYMENT" && (
                <button
                  onClick={handleVerifyPayment}
                  disabled={isUpdating}
                  className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                  {isUpdating ? (
                    <Loader2 className="animate-spin h-4 w-4" />
                  ) : (
                    <CreditCard size={18} />
                  )}
                  <span>{isUpdating ? "Verifying..." : "Verify Payment"}</span>
                </button>
              )}
              {order.status === "PENDING_CONFIRMATION" && (
                <button
                  onClick={() => handleUpdateStatus("PROCESSING")}
                  className="flex items-center space-x-2 bg-surface border border-border text-text-secondary px-4 py-2 rounded-lg hover:bg-surface-secondary transition-colors"
                >
                  <span className="flex gap-2">
                    {isUpdating ? (
                      <Loader2 className="animate-spin h-4 w-4" />
                    ) : (
                      <CheckCircle size={18} />
                    )}
                    <span>Start Processing Order</span>
                  </span>
                </button>
              )}
              {order.status === "PROCESSING" && (
                <button
                  onClick={handleMarkAsInTransit}
                  disabled={isUpdating}
                  className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                  {isUpdating ? (
                    <Loader2 className="animate-spin h-4 w-4" />
                  ) : (
                    <Truck size={18} />
                  )}
                  <span>{isUpdating ? "Updating..." : "Mark as In Transit"}</span>
                </button>
              )}
              {order.status === "IN_TRANSIT" && (
                <button
                  onClick={handleMarkAsCompleted}
                  disabled={isUpdating}
                  className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                  {isUpdating ? (
                    <Loader2 className="animate-spin h-4 w-4" />
                  ) : (
                    <Flag size={18} />
                  )}
                  <span>{isUpdating ? "Updating..." : "Mark as Completed"}</span>
                </button>
              )}
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
              {formatCurrency(order.totalAmount)}
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
          {/* Left Column */}
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
                  <p className="text-xs text-text-secondary">Customer ID</p>
                  <p className="text-sm font-mono text-text-primary mt-1">
                    {order.customerId}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-text-secondary">Assigned Agent</p>
                  <p className="text-sm font-mono text-text-primary mt-1">
                    {order.assignedAgentId || "Not Assigned"}
                  </p>
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
                  <p className="text-xs text-text-secondary">Unit Price</p>
                  <p className="text-sm font-medium text-text-primary mt-1">
                    {formatCurrency(order.unitPrice)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-text-secondary">Fuel Subtotal</p>
                  <p className="text-sm font-medium text-text-primary mt-1 flex items-center space-x-1">
                    <ShoppingCart size={14} className="text-text-secondary" />
                    <span>{formatCurrency(order.fuelSubtotal)}</span>
                  </p>
                </div>
                <div>
                  <p className="text-xs text-text-secondary">VAT</p>
                  <p className="text-sm font-medium text-text-primary mt-1 flex items-center space-x-1">
                    <Receipt size={14} className="text-text-secondary" />
                    <span>{formatCurrency(order.VAT || "0")}</span>
                  </p>
                </div>
                <div>
                  <p className="text-xs text-text-secondary">Delivery Fee</p>
                  <p className="text-sm font-medium text-text-primary mt-1 flex items-center space-x-1">
                    <DeliveryTruck size={14} className="text-text-secondary" />
                    <span>{formatCurrency(order.deliveryFee || "0")}</span>
                  </p>
                </div>
                <div className="md:col-span-2">
                  <div className="border-t border-border pt-3 mt-1">
                    <p className="text-xs text-text-secondary">
                      Total Amount (Incl. VAT & Delivery)
                    </p>
                    <p className="text-base font-bold text-primary mt-1">
                      {formatCurrency(order.totalAmount)}
                    </p>
                    <p className="text-[10px] text-text-secondary mt-0.5">
                      Includes VAT and delivery fee
                    </p>
                  </div>
                </div>
                {order.completedById && (
                  <div>
                    <p className="text-xs text-text-secondary">Completed By</p>
                    <p className="text-sm font-mono text-text-primary mt-1">
                      {order.completedById}
                    </p>
                  </div>
                )}
                {order.cancelledById && (
                  <div>
                    <p className="text-xs text-text-secondary">Cancelled By</p>
                    <p className="text-sm font-mono text-text-primary mt-1">
                      {order.cancelledById}
                    </p>
                  </div>
                )}
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
                    <p className="text-xs text-text-secondary">Station ID</p>
                    <p className="text-sm font-mono text-text-primary mt-1">
                      {order.station.id}
                    </p>
                  </div>
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
            {/* Order Timeline */}
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
                {(order.status === "CONFIRMED" || order.status === "PROCESSING" || order.status === "IN_TRANSIT" || order.status === "COMPLETED") && (
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
                {(order.status === "PROCESSING" || order.status === "IN_TRANSIT" || order.status === "COMPLETED") && (
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                      <Package
                        size={16}
                        className="text-purple-600 dark:text-purple-400"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">
                        Processing
                      </p>
                      <p className="text-xs text-text-secondary">
                        {formatDateTime(order.updatedAt)}
                      </p>
                    </div>
                  </div>
                )}
                {(order.status === "IN_TRANSIT" || order.status === "COMPLETED") && (
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
                      <Truck
                        size={16}
                        className="text-indigo-600 dark:text-indigo-400"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">
                        In Transit
                      </p>
                      <p className="text-xs text-text-secondary">
                        {formatDateTime(order.updatedAt)}
                      </p>
                    </div>
                  </div>
                )}
                {order.status === "COMPLETED" && (
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                      <Flag
                        size={16}
                        className="text-emerald-600 dark:text-emerald-400"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">
                        Completed
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

            {/* Admin Actions */}
            <div className="bg-surface rounded-lg border border-border p-6">
              <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center space-x-2">
                <Users size={18} className="text-primary" />
                <span>Admin Actions</span>
              </h3>
              <div className="space-y-2">
                {order.status === "PENDING_PAYMENT" && (
                  <>
                    <button
                      onClick={handleVerifyPayment}
                      disabled={isUpdating}
                      className="w-full text-left px-3 py-2 text-sm bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors flex items-center space-x-2"
                    >
                      {isUpdating ? (
                        <Loader2 className="animate-spin h-4 w-4" />
                      ) : (
                        <CreditCard size={16} />
                      )}
                      <span>
                        {isUpdating ? "Verifying..." : "Verify Payment"}
                      </span>
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                      Cancel Order
                    </button>
                  </>
                )}
                {order.status === "CONFIRMED" && (
                  <button
                    onClick={() => handleUpdateStatus("PROCESSING")}
                    className="w-full text-left px-3 py-2 text-sm text-text-secondary hover:bg-surface-secondary rounded-lg transition-colors"
                  >
                    Mark as Processing
                  </button>
                )}
                {order.status === "PROCESSING" && (
                  <button
                    onClick={handleMarkAsInTransit}
                    disabled={isUpdating}
                    className="w-full text-left px-3 py-2 text-sm bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 rounded-lg transition-colors flex items-center space-x-2"
                  >
                    {isUpdating ? (
                      <Loader2 className="animate-spin h-4 w-4" />
                    ) : (
                      <Truck size={16} />
                    )}
                    <span>{isUpdating ? "Updating..." : "Mark as In Transit"}</span>
                  </button>
                )}
                {order.status === "IN_TRANSIT" && (
                  <button
                    onClick={handleMarkAsCompleted}
                    disabled={isUpdating}
                    className="w-full text-left px-3 py-2 text-sm bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 rounded-lg transition-colors flex items-center space-x-2"
                  >
                    {isUpdating ? (
                      <Loader2 className="animate-spin h-4 w-4" />
                    ) : (
                      <Flag size={16} />
                    )}
                    <span>{isUpdating ? "Updating..." : "Mark as Completed"}</span>
                  </button>
                )}
                {order.status !== "CANCELLED" &&
                  order.status !== "COMPLETED" &&
                  order.status !== "PENDING_PAYMENT" && (
                    <button className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                      Cancel Order
                    </button>
                  )}
                <button className="w-full text-left px-3 py-2 text-sm text-text-secondary hover:bg-surface-secondary rounded-lg transition-colors">
                  Assign Agent
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-text-secondary hover:bg-surface-secondary rounded-lg transition-colors">
                  Contact Customer
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-text-secondary hover:bg-surface-secondary rounded-lg transition-colors">
                  View Customer Profile
                </button>
                <button
                  onClick={() => navigate(`/orders/${order.id}/transactions`)}
                  className="w-full text-left px-3 py-2 text-sm text-text-secondary hover:bg-surface-secondary rounded-lg transition-colors flex items-center space-x-2"
                >
                  <Eye size={16} />
                  <span>View Transactions</span>
                </button>
              </div>
            </div>

            {/* Order Metadata */}
            <div className="bg-surface rounded-lg border border-border p-6">
              <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center space-x-2">
                <Calendar size={18} className="text-primary" />
                <span>Metadata</span>
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-text-secondary">Created At</p>
                  <p className="text-sm text-text-primary mt-1">
                    {formatDateTime(order.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-text-secondary">Last Updated</p>
                  <p className="text-sm text-text-primary mt-1">
                    {formatDateTime(order.updatedAt)}
                  </p>
                </div>
                {order.completedById && (
                  <div>
                    <p className="text-xs text-text-secondary">Completed By</p>
                    <p className="text-sm font-mono text-text-primary mt-1">
                      {order.completedById.slice(0, 12)}...
                    </p>
                  </div>
                )}
                {order.cancelledById && (
                  <div>
                    <p className="text-xs text-text-secondary">Cancelled By</p>
                    <p className="text-sm font-mono text-text-primary mt-1">
                      {order.cancelledById.slice(0, 12)}...
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default OrderDetails;