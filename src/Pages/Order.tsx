import { useEffect, useState, useMemo } from 'react';
import MainLayout from '../layout/MainLayout';
import { useOrderStore } from '../store/ordertStore';
import {
  Search,
  RefreshCw,
  AlertCircle,
  Download,
  Eye,
  MapPin,
  Calendar,
} from 'lucide-react';
import Loader from '../components/Loader';
import { useNavigate } from 'react-router-dom';

const Order = () => {
  const { records, error, fetchOrders } = useOrderStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'PENDING_PAYMENT', label: 'Pending Payment' },
    { value: 'CONFIRMED', label: 'Confirmed' },
    { value: 'PROCESSING', label: 'Processing' },
    { value: 'DELIVERED', label: 'Delivered' },
    { value: 'CANCELLED', label: 'Cancelled' },
  ];

  // Fetch orders on mount
  useEffect(() => {
    const fetchOrdersData = async () => {
      setIsLoading(true);
      try {
        await fetchOrders(currentPage, itemsPerPage);
      } catch (err) {
        console.error('Error fetching orders:', err);
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

    // Apply search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(
        (order) =>
          order.id?.toLowerCase().includes(term) ||
          order.fuelType?.toLowerCase().includes(term) ||
          order.deliveryAddress?.toLowerCase().includes(term) ||
          order.customer?.userProfile?.firstName?.toLowerCase().includes(term) ||
          order.customer?.userProfile?.lastName?.toLowerCase().includes(term) ||
          order.customer?.email?.toLowerCase().includes(term) ||
          order.station?.name?.toLowerCase().includes(term)
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(
        (order) => order.status === statusFilter
      );
    }

    return result;
  }, [orders, searchTerm, statusFilter]);

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
  setTimeout(()=>{
      setCurrentPage(1);
  },0)
  }, [searchTerm, statusFilter, itemsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      await fetchOrders(currentPage, itemsPerPage, true);
    } catch (err) {
      console.error('Error refreshing orders:', err);
    } finally {
      setIsLoading(false);
    }
  };
const navigate = useNavigate()
  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING_PAYMENT: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      CONFIRMED: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      PROCESSING: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      DELIVERED: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      CANCELLED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    };
    return colors[status] || 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'NGN',
    }).format(parseFloat(amount));
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-surface p-4 rounded-lg border border-border">
            <p className="text-sm text-text-secondary">Total Orders</p>
            <p className="text-2xl font-bold text-text-primary">
              {totalOrders}
            </p>
          </div>
          <div className="bg-surface p-4 rounded-lg border border-border">
            <p className="text-sm text-text-secondary">Pending Payment</p>
            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {orders.filter((order) => order.status === 'PENDING_PAYMENT').length}
            </p>
          </div>
          <div className="bg-surface p-4 rounded-lg border border-border">
            <p className="text-sm text-text-secondary">Confirmed</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {orders.filter((order) => order.status === 'CONFIRMED').length}
            </p>
          </div>
          <div className="bg-surface p-4 rounded-lg border border-border">
            <p className="text-sm text-text-secondary">Delivered</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {orders.filter((order) => String(order.status) === 'DELIVERED').length}
            </p>
          </div>
        </div>

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
              {(searchTerm || statusFilter !== "all") && (
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

        {/* Orders Table */}
        {filteredOrders.length > 0 ? (
          <div className="bg-surface rounded-lg border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-surface-secondary">
                  <tr>
                    <th className="px-3 py-2 text-left text-[10px] font-medium text-text-secondary uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-3 py-2 text-left text-[10px] font-medium text-text-secondary uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-3 py-2 text-left text-[10px] font-medium text-text-secondary uppercase tracking-wider">
                      Station
                    </th>
                    <th className="px-3 py-2 text-left text-[10px] font-medium text-text-secondary uppercase tracking-wider">
                      Fuel
                    </th>
                    <th className="px-3 py-2 text-left text-[10px] font-medium text-text-secondary uppercase tracking-wider">
                      Qty
                    </th>
                    <th className="px-3 py-2 text-left text-[10px] font-medium text-text-secondary uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-3 py-2 text-left text-[10px] font-medium text-text-secondary uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-3 py-2 text-left text-[10px] font-medium text-text-secondary uppercase tracking-wider">
                      Address
                    </th>
                    <th className="px-3 py-2 text-left text-[10px] font-medium text-text-secondary uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-3 py-2 text-left text-[10px] font-medium text-text-secondary uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {paginatedOrders.map((order) => {
                    return(
                    <tr key={order.id} className="hover:bg-surface-secondary transition-colors">
                      <td className="px-3 py-2 text-[11px] font-medium text-text-primary">
                        <span className="font-mono text-[10px]">{order.id.slice(0, 8)}...</span>
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center space-x-2">

                          <div>
                            <p className="text-[11px] font-medium text-text-primary leading-tight">
                              {order.customer?.userProfile?.firstName} {order.customer?.userProfile?.lastName}
                            </p>
                          
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-2 text-[11px] text-text-primary">
                        {order.station?.name || 'N/A'}
                      </td>
                      <td className="px-3 py-2">
                        <span className="px-1.5 py-0.5 text-[10px] bg-primary/10 text-primary rounded-full">
                          {order.fuelType}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-[11px] text-text-secondary">
                        {order.quantity}L
                      </td>
                      <td className="px-3 py-2 text-[11px] font-medium text-text-primary">
                        {formatCurrency(order.totalAmount)}
                      </td>
                      <td className="px-3 py-2">
                        <span
                          className={`px-1.5 py-0.5 text-[10px] rounded-full ${getStatusColor(order.status)}`}
                        >
                          {order.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-[11px] text-text-secondary">
                        <div className="flex items-center space-x-1">
                          <MapPin size={12} className="text-text-secondary flex-shrink-0" />
                          <span className="truncate max-w-[120px] text-[10px]">
                            {order.deliveryAddress}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-2 text-[11px] text-text-secondary">
                        <div className="flex items-center space-x-1">
                          <Calendar size={12} className="text-text-secondary flex-shrink-0" />
                          <span className="text-[10px]">{formatDate(order.createdAt)}</span>
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <button
                        onClick={()=>{
                          navigate(`/orders/${order.id}`)
                        }}
                          className="p-1 hover:bg-surface-secondary rounded-lg transition-colors text-text-secondary hover:text-primary"
                          title="View Order"
                        >
                          <Eye size={14} />
                        </button>
                      </td>
                    </tr>
                  )})}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-border">
                <div className="text-sm text-text-secondary">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm border border-border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-secondary transition-colors text-text-secondary"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-sm border border-border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-secondary transition-colors text-text-secondary"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 bg-surface rounded-lg border border-border">
            <div className="text-text-secondary mb-2">No orders found</div>
            <div className="text-sm text-text-secondary mb-4">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filter criteria"
                : "No orders available."}
            </div>
            {(searchTerm || statusFilter !== "all") && (
              <button
                onClick={clearFilters}
                className="text-primary hover:text-primary-hover text-sm font-medium"
              >
                Clear filters
              </button>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-text-secondary">
            Showing {filteredOrders.length} of {totalOrders} orders
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Order;