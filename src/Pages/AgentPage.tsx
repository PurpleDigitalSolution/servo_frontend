import React, { useState, useMemo, useEffect } from "react";
import MainLayout from "../layout/MainLayout";
import {
  Search,
  RefreshCw,
  AlertCircle,
  User,
  Mail,
  Phone,
  Calendar,
  Download,
  Eye,
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react";
import Loader from "../components/Loader";
import { useUserStore } from "../store/userStore";
import { useAuthStore } from "../store/authStore";
import AddAgentModal from "../components/modal/AddAgent";

const AgentPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [loading, setLoading] = useState(false);
  const [error] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const { user } = useAuthStore()
  const {
    agentRecords,
    getAgentRecords,
    loading: storeLoading,
    error: storeError,
  } = useUserStore();

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch agents on mount and when page/limit changes
  useEffect(() => {
    const fetchAgents = async () => {
      setLoading(true);
      try {
        await getAgentRecords(currentPage, itemsPerPage);
      } catch (err) {
        console.error("Error fetching agents:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAgents();
  }, [currentPage, itemsPerPage]);

  // Get agents from store
  const agents = agentRecords?.users || [];
  const totalAgents = agentRecords?.pagination?.totalAgents || 0;
  const totalPages = agentRecords?.pagination?.totalPages || 1;

  // Apply filters and search
  const filteredAgents = useMemo(() => {
    let result = agents;

    // Apply search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(
        (agent) =>
          agent.email?.toLowerCase().includes(term) ||
          agent.userProfile?.firstName?.toLowerCase().includes(term) ||
          agent.userProfile?.lastName?.toLowerCase().includes(term) ||
          agent.userProfile?.phoneNumber?.includes(term) ||
          agent.id?.toLowerCase().includes(term),
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((agent) => agent.accountStatus === statusFilter);
    }

    return result;
  }, [agents, searchTerm, statusFilter]);

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "ACTIVE", label: "Active" },
    { value: "INACTIVE", label: "Inactive" },
    { value: "SUSPENDED", label: "Suspended" },
    { value: "BANNED", label: "Banned" },
  ];

  const itemsPerPageOptions = [
    { value: 5, label: "5 per page" },
    { value: 10, label: "10 per page" },
    { value: 25, label: "25 per page" },
    { value: 50, label: "50 per page" },
  ];

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      ACTIVE:
        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      INACTIVE:
        "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
      SUSPENDED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      BANNED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    };
    return (
      colors[status] ||
      "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
    );
  };

  const formatDate = (dateValue: string | Date) => {
    return new Date(dateValue).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      await getAgentRecords(currentPage, itemsPerPage);
    } catch (err) {
      console.error("Error refreshing agents:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  // Show loader while fetching data
  if (loading || storeLoading) {
    return (
      <MainLayout>
        <div className="p-6">
          <Loader />
        </div>
      </MainLayout>
    );
  }

  // Show error if any
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

  return (
    <MainLayout>
      <div className="p-6">

         <AddAgentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-text-primary">Agents</h1>
              <p className="text-text-secondary mt-1">
                Manage all registered agents and their details
              </p>
            </div>
            <div className="flex items-center space-x-3 mt-4 lg:mt-0">
              {user && user.role === "ADMIN" ||
                (user && user.role === "SUPER_ADMIN" && (
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center space-x-2 bg-primary text-text-primary px-4 py-2 rounded-lg hover:bg-primary-hover transition-colors"
                  >
                    <Plus size={18} />
                    <span>Add agent</span>
                  </button>
                ))}
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
                <Download size={18} />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-surface p-4 rounded-lg border border-border">
            <p className="text-sm text-text-secondary">Total Agents</p>
            <p className="text-2xl font-bold text-text-primary">
              {totalAgents}
            </p>
          </div>
          <div className="bg-surface p-4 rounded-lg border border-border">
            <p className="text-sm text-text-secondary">Active</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {
                agents.filter((agent) => agent.accountStatus === "ACTIVE")
                  .length
              }
            </p>
          </div>
          <div className="bg-surface p-4 rounded-lg border border-border">
            <p className="text-sm text-text-secondary">Banned</p>
            <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">
              {
                agents.filter((agent) => agent.accountStatus === "BANNED")
                  .length
              }
            </p>
          </div>
          <div className="bg-surface p-4 rounded-lg border border-border">
            <p className="text-sm text-text-secondary">Suspended</p>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
              {
                agents.filter((agent) => agent.accountStatus === "SUSPENDED")
                  .length
              }
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
                  placeholder="Search by name, email, phone..."
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

        {/* Agents Table */}
        {filteredAgents.length > 0 ? (
          <div className="bg-surface rounded-lg border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-surface-secondary">
                  <tr>
                    <th className="px-3 py-2 text-left text-[10px] font-medium text-text-secondary uppercase tracking-wider">
                      Agent
                    </th>
                    <th className="px-3 py-2 text-left text-[10px] font-medium text-text-secondary uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-3 py-2 text-left text-[10px] font-medium text-text-secondary uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-3 py-2 text-left text-[10px] font-medium text-text-secondary uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-3 py-2 text-left text-[10px] font-medium text-text-secondary uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-3 py-2 text-left text-[10px] font-medium text-text-secondary uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-3 py-2 text-left text-[10px] font-medium text-text-secondary uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredAgents.map((agent) => (
                    <tr
                      key={agent.id}
                      className="hover:bg-surface-secondary transition-colors"
                    >
                      <td className="px-3 py-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-medium flex-shrink-0">
                            {getInitials(
                              agent.userProfile?.firstName || "",
                              agent.userProfile?.lastName || "",
                            )}
                          </div>
                          <div>
                            <p className="text-[11px] font-medium text-text-primary leading-tight">
                              {agent.userProfile?.firstName || "N/A"}{" "}
                              {agent.userProfile?.lastName || ""}
                            </p>
                            <p className="text-[10px] text-text-secondary leading-tight">
                              ID: {agent.id.slice(0, 8)}...
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-2 text-[11px] text-text-secondary">
                        <div className="flex items-center space-x-1">
                          <Mail
                            size={12}
                            className="text-text-secondary flex-shrink-0"
                          />
                          <span>{agent.email}</span>
                        </div>
                      </td>
                      <td className="px-3 py-2 text-[11px] text-text-secondary">
                        <div className="flex items-center space-x-1">
                          <Phone
                            size={12}
                            className="text-text-secondary flex-shrink-0"
                          />
                          <span>{agent.userProfile?.phoneNumber || "N/A"}</span>
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                          {agent.role}
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        <span
                          className={`px-1.5 py-0.5 text-[10px] rounded-full ${getStatusColor(agent.accountStatus)}`}
                        >
                          {agent.accountStatus}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-[11px] text-text-secondary">
                        <div className="flex items-center space-x-1">
                          <Calendar
                            size={12}
                            className="text-text-secondary flex-shrink-0"
                          />
                          <span>{formatDate(agent.createdAt)}</span>
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <button
                          className="p-1 hover:bg-surface-secondary rounded-lg transition-colors text-text-secondary hover:text-primary"
                          title="View agent"
                        >
                          <Eye size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 border-t border-border gap-4">
              <div className="text-sm text-text-secondary">
                Showing {filteredAgents.length} of {totalAgents} agents
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
          </div>
        ) : (
          <div className="text-center py-12 bg-surface rounded-lg border border-border">
            <User className="w-12 h-12 text-text-secondary mx-auto mb-3" />
            <div className="text-text-secondary mb-2">No agents found</div>
            <div className="text-sm text-text-secondary mb-4">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filter criteria"
                : "No agents available."}
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
      </div>


    </MainLayout>
  );
};

export default AgentPage;
