// Order.jsx
import { useEffect, useState, useMemo } from "react";
import MainLayout from "../layout/MainLayout";
import { useOrderStore } from "../store/ordertStore";
import { Search, RefreshCw, AlertCircle, Download } from "lucide-react";
import Loader from "../components/Loader";
import { useAuthStore } from "../store/authStore";
import OrderStats from "../components/OrderStats";
import OrderTable from "../components/OrderTable";
const Order = () => {
  const { records, error, fetchOrders } = useOrderStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [assignedFilter, setAssignedFilter] = useState<string>("all");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const user = useAuthStore((state) => state.user);

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "PENDING_PAYMENT", label: "Pending Payment" },
    { value: "PENDING_CONFIRMATION", label: "Pending Confirmation" },
    { value: "CONFIRMED", label: "Confirmed" },
    { value: "PROCESSING", label: "Processing" },
    { value: "DELIVERED", label: "Delivered" },
    { value: "CANCELLED", label: "Cancelled" },
  ];

  const assignedOptions = [
    { value: "all", label: "All Orders" },
    { value: "assigned", label: "Assigned" },
    { value: "unassigned", label: "Unassigned" },
  ];

  // Fetch orders on mount
  useEffect(() => {
    const fetchOrdersData = async () => {
      setIsLoading(true);
      try {
        await fetchOrders(currentPage, itemsPerPage);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrdersData();
  }, [currentPage, itemsPerPage]);

  // Get orders from store
  const orders = records?.orders || [];

  // Apply filters and search
  const filteredOrders = useMemo(() => {
    let result = orders;

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(
        (order) =>
          order.id?.toLowerCase().includes(term) ||
          order.fuelType?.toLowerCase().includes(term) ||
          order.deliveryAddress?.toLowerCase().includes(term) ||
          order.customer?.userProfile?.firstName
            ?.toLowerCase()
            .includes(term) ||
          order.customer?.userProfile?.lastName?.toLowerCase().includes(term) ||
          order.customer?.email?.toLowerCase().includes(term) ||
          order.station?.name?.toLowerCase().includes(term),
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((order) => order.status === statusFilter);
    }

    if (assignedFilter === "assigned") {
      result = result.filter((order) => order.assignedAgentId);
    } else if (assignedFilter === "unassigned") {
      result = result.filter((order) => !order.assignedAgentId);
    }

    return result;
  }, [orders, searchTerm, statusFilter, assignedFilter]);

  // Pagination logic
  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredOrders.slice(startIndex, endIndex);
  }, [filteredOrders, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const totalOrders = records?.total || 0;

  // Reset to first page when filters change
  useEffect(() => {
    setTimeout(() => {
      setCurrentPage(1);
    }, 0);
  }, [searchTerm, statusFilter, assignedFilter, itemsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      await fetchOrders(currentPage, itemsPerPage, true);
    } catch (err) {
      console.error("Error refreshing orders:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setAssignedFilter("all");
  };

  // Helper functions
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING_PAYMENT:
        "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      PENDING_CONFIRMATION:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      PROCESSING:
        "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
      DELIVERED:
        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      COMPLETED:
        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      ASSIGNED:
        "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
      CANCELLED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    };
    return (
      colors[status] ||
      "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
    );
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number | string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "NGN",
    }).format(Number(amount));
  };

  // Loading state
  if (isLoading && !records) {
    return (
      <MainLayout>
        <div className="p-6">
          <Loader />
        </div>
      </MainLayout>
    );
  }

  // Get assignment stats
  const assignedCount = orders.filter((o) => o.assignedAgentId).length;
  const unassignedCount = orders.filter((o) => !o.assignedAgentId).length;

  return (
    <MainLayout>
      <div className="p-6">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-text-primary">Orders</h1>
              <p className="text-text-secondary mt-1">
                Manage and track all fuel orders
              </p>
            </div>
            <div className="flex items-center space-x-3 mt-4 lg:mt-0">
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="flex items-center space-x-2 bg-surface border border-border text-text-secondary px-4 py-2 rounded-lg hover:bg-surface-secondary transition-colors disabled:opacity-50"
              >
                <RefreshCw
                  size={18}
                  className={isLoading ? "animate-spin" : ""}
                />
                <span>{isLoading ? "Refreshing..." : "Refresh"}</span>
              </button>
              <button className="flex items-center space-x-2 bg-surface border border-border text-text-secondary px-4 py-2 rounded-lg hover:bg-surface-secondary transition-colors">
                <Download size={18} />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center space-x-2 text-red-700 dark:text-red-400">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
            <button
              onClick={handleRefresh}
              className="mt-2 text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* Stats Component */}
        <OrderStats orders={orders} totalOrders={totalOrders} />

        {/* Filters and Search */}
        <div className="bg-surface rounded-lg border border-border p-4 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="relative flex-1 sm:w-64">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary"
                />
                <input
                  type="text"
                  placeholder="Search by user, station, fuel type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-primary placeholder-text-secondary"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <select
                value={assignedFilter}
                onChange={(e) => setAssignedFilter(e.target.value)}
                className="px-4 py-2 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                {assignedOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                }}
                className="px-4 py-2 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
                <option value={25}>25 per page</option>
                <option value={50}>50 per page</option>
              </select>
            </div>

            <div className="flex items-center space-x-4">
              {(searchTerm ||
                statusFilter !== "all" ||
                assignedFilter !== "all") && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-primary hover:text-primary-hover"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Table Component */}
        <OrderTable
          paginatedOrders={paginatedOrders}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          formatDate={formatDate}
          formatCurrency={formatCurrency}
          getStatusColor={getStatusColor}
        />

        {/* Footer */}
        {user && (user.role === "ADMIN" || user.role === "SUPER_ADMIN") && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-text-secondary">
              Showing {filteredOrders.length} of {totalOrders} orders
            </div>
            <div className="text-sm text-text-secondary">
              <span className="text-green-600 dark:text-green-400">
                ● {assignedCount} assigned
              </span>
              <span className="ml-3 text-red-600 dark:text-red-400">
                ● {unassignedCount} unassigned
              </span>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Order;
