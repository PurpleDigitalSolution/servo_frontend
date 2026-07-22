import { useState, useMemo, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import {
  Search,
  RefreshCw,
  AlertCircle,
  ArrowLeft,
  CreditCard,
  Calendar,
  Copy,
  Check,
  // Eye,
  Download,
  Printer,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Loader from "../components/Loader";
import { useTransactionStore } from "../store/transactionStore";

interface Transaction {
  id: string;
  orderId: string;
  amount: string;
  currency: string;
  paymentMethod: string;
  status: string;
  reference: string;
  gatewayReference: string | null;
  authorizationUrl: string | null;
  accessCode: string | null;
  paidAt: string | null;
  gatewayResponse: string | null;
  createdAt: string;
  updatedAt: string;
}

const Transactions = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const {
    getOrderTransaction,
    transactions,
    loading: storeLoading,
    error: storeError,
  } = useTransactionStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [copied, setCopied] = useState<string | null>(null);

  // Fetch transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      if (!orderId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await getOrderTransaction(orderId);
        if (!response?.success) {
          setError(response?.message || "Failed to fetch transactions");
        }
      } catch (err) {
        setError("Failed to fetch transactions");
        console.error("Error fetching transactions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [orderId, getOrderTransaction]);

  // Get transactions from store - handle both array and single object
  const transactionData = transactions || [];

  // Ensure transactionData is always an array
  const transactionList = Array.isArray(transactionData) ? transactionData : [];

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    let result = transactionList;

    // Apply search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(
        (t: Transaction) =>
          t.reference?.toLowerCase().includes(term) ||
          t.id?.toLowerCase().includes(term) ||
          t.orderId?.toLowerCase().includes(term) ||
          t.paymentMethod?.toLowerCase().includes(term) ||
          t.gatewayReference?.toLowerCase().includes(term)
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((t: Transaction) => t.status === statusFilter);
    }

    // Apply payment method filter
    if (paymentMethodFilter !== "all") {
      result = result.filter((t: Transaction) => t.paymentMethod === paymentMethodFilter);
    }

    return result;
  }, [transactionList, searchTerm, statusFilter, paymentMethodFilter]);

  // Pagination
  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredTransactions.slice(startIndex, endIndex);
  }, [filteredTransactions, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const totalTransactions = filteredTransactions.length;

  // Reset to first page when filters change
  useEffect(() => {
    setTimeout(()=>{
      setCurrentPage(1);
    },0)
  }, [searchTerm, statusFilter, paymentMethodFilter, itemsPerPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const handleRefresh = async () => {
    if (!orderId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await getOrderTransaction(orderId);
      if (!response?.success) {
        setError(response?.message || "Failed to refresh transactions");
      }
    } catch (err) {
      setError("Failed to refresh transactions");
      console.error("Error refreshing transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setPaymentMethodFilter("all");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 2000);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      SUCCESS:
        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      PENDING:
        "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      FAILED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    };
    return (
      colors[status] ||
      "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
    );
  };

  const getPaymentMethodColor = (method: string) => {
    const colors: Record<string, string> = {
      PAYSTACK:
        "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
      FLUTTERWAVE:
        "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      BANK_TRANSFER:
        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    };
    return (
      colors[method] ||
      "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
    );
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: string) => {
    const amountInNaira = parseFloat(amount) / 100;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "NGN",
    }).format(amountInNaira);
  };

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "SUCCESS", label: "Success" },
    { value: "PENDING", label: "Pending" },
    { value: "FAILED", label: "Failed" },
  ];

  const paymentMethodOptions = [
    { value: "all", label: "All Methods" },
    { value: "PAYSTACK", label: "Paystack" },
    { value: "FLUTTERWAVE", label: "Flutterwave" },
    { value: "BANK_TRANSFER", label: "Bank Transfer" },
  ];

  const itemsPerPageOptions = [
    { value: 5, label: "5 per page" },
    { value: 10, label: "10 per page" },
    { value: 25, label: "25 per page" },
    { value: 50, label: "50 per page" },
  ];

  // Show loading state
  if (loading || storeLoading) {
    return (
      <MainLayout>
        <div className="p-6">
          <Loader />
        </div>
      </MainLayout>
    );
  }

  // Show error state
  const displayError = error || storeError;
  if (displayError) {
    return (
      <MainLayout>
        <div className="p-6">
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center space-x-2 text-red-700 dark:text-red-400">
              <AlertCircle size={20} />
              <span>{displayError}</span>
            </div>
            <button
              onClick={handleRefresh}
              className="mt-2 text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 underline"
            >
              Retry
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Show no transactions message when no orderId
  if (!orderId) {
    return (
      <MainLayout>
        <div className="p-6">
          <div className="text-center py-12 bg-surface rounded-lg border border-border">
            <CreditCard className="w-12 h-12 text-text-secondary mx-auto mb-3" />
            <div className="text-text-secondary mb-2">No Order Selected</div>
            <div className="text-sm text-text-secondary mb-4">
              Please select an order to view its transactions.
            </div>
            <button
              onClick={() => navigate("/orders")}
              className="text-primary hover:text-primary-hover text-sm font-medium"
            >
              Go to Orders
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
                onClick={() => navigate(`/orders/${orderId}`)}
                className="p-2 hover:bg-surface-secondary rounded-lg transition-colors text-text-secondary hover:text-text-primary"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-text-primary">
                  Order Transactions
                </h1>
                <p className="text-text-secondary mt-1">
                  Transactions for order #{orderId.slice(0, 8)}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 mt-4 lg:mt-0">
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="flex items-center space-x-2 bg-surface border border-border text-text-secondary px-4 py-2 rounded-lg hover:bg-surface-secondary transition-colors disabled:opacity-50"
              >
                <RefreshCw
                  size={18}
                  className={loading ? "animate-spin" : ""}
                />
                <span>{loading ? "Refreshing..." : "Refresh"}</span>
              </button>
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-surface p-4 rounded-lg border border-border">
            <p className="text-xs text-text-secondary">Total Transactions</p>
            <p className="text-2xl font-bold text-text-primary">
              {transactionList.length}
            </p>
          </div>
          <div className="bg-surface p-4 rounded-lg border border-border">
            <p className="text-xs text-text-secondary">Successful</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {transactionList.filter((t: Transaction) => t.status === "SUCCESS").length}
            </p>
          </div>
          <div className="bg-surface p-4 rounded-lg border border-border">
            <p className="text-xs text-text-secondary">Pending</p>
            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {transactionList.filter((t: Transaction) => t.status === "PENDING").length}
            </p>
          </div>
          <div className="bg-surface p-4 rounded-lg border border-border">
            <p className="text-xs text-text-secondary">Failed</p>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
              {transactionList.filter((t: Transaction) => t.status === "FAILED").length}
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
                  placeholder="Search by reference, ID..."
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
                value={paymentMethodFilter}
                onChange={(e) => setPaymentMethodFilter(e.target.value)}
                className="px-4 py-2 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                {paymentMethodOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <select
                value={itemsPerPage}
                onChange={(e) =>
                  handleItemsPerPageChange(Number(e.target.value))
                }
                className="px-4 py-2 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                {itemsPerPageOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-4">
              {(searchTerm ||
                statusFilter !== "all" ||
                paymentMethodFilter !== "all") && (
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

        {/* Transactions Table */}
        {filteredTransactions.length > 0 ? (
          <div className="bg-surface rounded-lg border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-surface-secondary">
                  <tr>
                    <th className="px-3 py-2 text-left text-[10px] font-medium text-text-secondary uppercase tracking-wider">
                      Reference
                    </th>
                    <th className="px-3 py-2 text-left text-[10px] font-medium text-text-secondary uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-3 py-2 text-left text-[10px] font-medium text-text-secondary uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-3 py-2 text-left text-[10px] font-medium text-text-secondary uppercase tracking-wider">
                      Method
                    </th>
                    <th className="px-3 py-2 text-left text-[10px] font-medium text-text-secondary uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-3 py-2 text-left text-[10px] font-medium text-text-secondary uppercase tracking-wider">
                      Created
                    </th>
                    {/* <th className="px-3 py-2 text-left text-[10px] font-medium text-text-secondary uppercase tracking-wider">
                      Actions
                    </th> */}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {paginatedTransactions.map((transaction: Transaction) => (
                    <tr
                      key={transaction.id}
                      className="hover:bg-surface-secondary transition-colors"
                    >
                      <td className="px-3 py-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-[11px] font-mono text-text-primary">
                            {transaction.reference.slice(0, 12)}...
                          </span>
                          <button
                            onClick={() =>
                              copyToClipboard(transaction.reference)
                            }
                            className="p-1 hover:bg-surface-secondary rounded transition-colors"
                          >
                            {copied === transaction.reference ? (
                              <Check size={12} className="text-green-500" />
                            ) : (
                              <Copy size={12} className="text-text-secondary" />
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="px-3 py-2 text-[11px] font-mono text-text-secondary">
                        {transaction.orderId.slice(0, 8)}...
                      </td>
                      <td className="px-3 py-2 text-[11px] font-medium text-text-primary">
                        {formatCurrency(transaction.amount)}
                      </td>
                      <td className="px-3 py-2">
                        <span
                          className={`px-1.5 py-0.5 text-[10px] rounded-full ${getPaymentMethodColor(transaction.paymentMethod)}`}
                        >
                          {transaction.paymentMethod}
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        <span
                          className={`px-1.5 py-0.5 text-[10px] rounded-full ${getStatusColor(transaction.status)}`}
                        >
                          {transaction.status}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-[11px] text-text-secondary">
                        <div className="flex items-center space-x-1">
                          <Calendar
                            size={12}
                            className="text-text-secondary flex-shrink-0"
                          />
                          <span>{formatDateTime(transaction.createdAt)}</span>
                        </div>
                      </td>
                      {/* <td className="px-3 py-2">
                        <button
                          onClick={() =>
                            navigate(`/transactions/${transaction.id}`)
                          }
                          className="p-1 hover:bg-surface-secondary rounded-lg transition-colors text-text-secondary hover:text-primary"
                          title="View transaction"
                        >
                          <Eye size={14} />
                        </button>
                      </td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 border-t border-border gap-4">
                <div className="text-sm text-text-secondary">
                  Showing {paginatedTransactions.length} of {totalTransactions}{" "}
                  transactions
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 border border-border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-secondary transition-colors"
                  >
                    <ChevronLeft size={16} className="text-text-secondary" />
                  </button>
                  <span className="text-sm text-text-secondary px-3">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 border border-border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-secondary transition-colors"
                  >
                    <ChevronRight size={16} className="text-text-secondary" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 bg-surface rounded-lg border border-border">
            <CreditCard className="w-12 h-12 text-text-secondary mx-auto mb-3" />
            <div className="text-text-secondary mb-2">
              No transactions found
            </div>
            <div className="text-sm text-text-secondary mb-4">
              {searchTerm ||
              statusFilter !== "all" ||
              paymentMethodFilter !== "all"
                ? "Try adjusting your search or filter criteria"
                : "No transactions available for this order."}
            </div>
            {(searchTerm ||
              statusFilter !== "all" ||
              paymentMethodFilter !== "all") && (
              <button
                onClick={clearFilters}
                className="text-primary hover:text-primary-hover text-sm font-medium"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Transactions;