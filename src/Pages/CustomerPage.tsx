import { useEffect, useState } from "react";
import MainLayout from "../layout/MainLayout";
import { useParams, useNavigate } from "react-router-dom";
import { useUserStore } from "../store/userStore";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Cake,
  UserCircle,
  Shield,
  AlertCircle,
  Edit,
  MoreVertical,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";
import Loader from "../components/Loader";
import { useAuthStore } from "../store/authStore";
import AccountSuspensionModal from "../components/modal/ActionStatus";
import { formatDate } from "../util/dateFormat";

interface UserProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dateOfBirth: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: string;
  email: string;
  role: string;
  accountStatus: string;
  userProfile: UserProfile;
  createdAt: string;
  suspensionReason?: string;
  suspendedAt?: string;
  suspendedBy?: string;
}

const CustomerPage = () => {
  const { customerId } = useParams<{ customerId: string }>();
  const navigate = useNavigate();
  const { getCustomerProfile, loading, error, records } = useUserStore();
  const { updateAccountStatus } = useAuthStore();
  const [customer, setCustomer] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showSuspensionModal, setShowSuspensionModal] = useState(false);

  const fetchCustomer = async () => {
    setIsLoading(true);
    try {
      // If we have the customer in the list, use it
      if (records?.users) {
        const found = records.users.find((user) => user.id === customerId);
        if (found) {
          setCustomer(found as unknown as User);
          setIsLoading(false);
          return;
        }
      }

      // Otherwise fetch single customer
      const result = await getCustomerProfile(customerId!);
      if (result.success) {
        setCustomer(result.data as unknown as User);
      }
    } catch (err) {
      console.error("Error fetching customer:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (
    newStatus: "SUSPENDED" | "ACTIVE",
    data: { reason: string } = { reason: "" },
  ) => {
    if (!customer) return;
    setIsUpdating(true);
    try {
      const response = await updateAccountStatus(customer.id, newStatus, data);
      if (response.success) {
        setCustomer({ ...customer, accountStatus: newStatus });
        setShowSuspensionModal(false);
      } else {
        console.error("Failed to update status:", response.message);
      }
    } catch (err) {
      console.error("Error updating status:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSuspend = () => {
    setShowSuspensionModal(true);
  };

  useEffect(() => {
    if (customerId) {
      setTimeout(() => {
        fetchCustomer();
      }, 0);
    }
  }, [customerId]);

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

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      ADMIN:
        "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
      MERCHANT:
        "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      USER: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
    };
    return (
      colors[role] ||
      "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
    );
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

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();
  };

  const getFullName = (firstName: string, lastName: string) => {
    return `${firstName || ""} ${lastName || ""}`.trim();
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
              onClick={fetchCustomer}
              className="mt-2 text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 underline"
            >
              Retry
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!customer) {
    return (
      <MainLayout>
        <div className="p-6">
          <div className="text-center py-12 bg-surface rounded-lg border border-border">
            <User className="w-12 h-12 text-text-secondary mx-auto mb-3" />
            <div className="text-text-secondary mb-2">Customer not found</div>
            <button
              onClick={() => navigate("/customers")}
              className="text-primary hover:text-primary-hover text-sm font-medium"
            >
              Back to customers
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  const profile = customer.userProfile;

  return (
    <MainLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/customers")}
                className="p-2 hover:bg-surface-secondary rounded-lg transition-colors text-text-secondary hover:text-text-primary"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-text-primary">
                  Customer Details
                </h1>
                <p className="text-text-secondary mt-1">
                  View and manage customer information
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 mt-4 lg:mt-0">
              <button className="flex items-center space-x-2 bg-surface border border-border text-text-secondary px-4 py-2 rounded-lg hover:bg-surface-secondary transition-colors">
                <Edit size={18} />
                <span>Edit</span>
              </button>
              <button className="flex items-center space-x-2 bg-surface border border-border text-text-secondary px-4 py-2 rounded-lg hover:bg-surface-secondary transition-colors">
                <MoreVertical size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Customer Profile Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Profile */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header */}
            <div className="bg-surface rounded-lg border border-border p-6">
              <div className="flex items-start space-x-4">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-medium flex-shrink-0">
                  {getInitials(
                    profile?.firstName || "",
                    profile?.lastName || "",
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h2 className="text-xl font-bold text-text-primary">
                      {getFullName(
                        profile?.firstName || "",
                        profile?.lastName || "",
                      )}
                    </h2>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${getStatusColor(customer.accountStatus)}`}
                    >
                      {customer.accountStatus}
                    </span>
                  </div>
                  <p className="text-text-secondary text-sm">
                    {customer.email}
                  </p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-xs text-text-secondary">
                      ID: {customer.id.slice(0, 8)}...
                    </span>
                    <span
                      className={`px-2 py-0.5 text-[10px] rounded-full ${getRoleColor(customer.role)}`}
                    >
                      {customer.role}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="bg-surface rounded-lg border border-border p-6">
              <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center space-x-2">
                <UserCircle size={18} className="text-primary" />
                <span>Personal Information</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-text-secondary">First Name</p>
                  <p className="text-sm font-medium text-text-primary mt-1">
                    {profile?.firstName || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-text-secondary">Last Name</p>
                  <p className="text-sm font-medium text-text-primary mt-1">
                    {profile?.lastName || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-text-secondary">Email Address</p>
                  <p className="text-sm font-medium text-text-primary mt-1 flex items-center space-x-1">
                    <Mail size={14} className="text-text-secondary" />
                    <span>{customer.email}</span>
                  </p>
                </div>
                <div>
                  <p className="text-xs text-text-secondary">Phone Number</p>
                  <p className="text-sm font-medium text-text-primary mt-1 flex items-center space-x-1">
                    <Phone size={14} className="text-text-secondary" />
                    <span>{profile?.phoneNumber || "N/A"}</span>
                  </p>
                </div>
                <div>
                  <p className="text-xs text-text-secondary">Date of Birth</p>
                  <p className="text-sm font-medium text-text-primary mt-1 flex items-center space-x-1">
                    <Cake size={14} className="text-text-secondary" />
                    <span>
                      {profile?.dateOfBirth
                        ? formatDate(profile.dateOfBirth)
                        : "N/A"}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-xs text-text-secondary">Address</p>
                  <p className="text-sm font-medium text-text-primary mt-1 flex items-center space-x-1">
                    <MapPin size={14} className="text-text-secondary" />
                    <span>{profile?.address || "N/A"}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Account Status */}
            <div className="bg-surface rounded-lg border border-border p-6">
              <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center space-x-2">
                <Shield size={18} className="text-primary" />
                <span>Account Status</span>
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-sm text-text-secondary">Status</span>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${getStatusColor(customer.accountStatus)}`}
                  >
                    {customer.accountStatus}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-sm text-text-secondary">Role</span>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${getRoleColor(customer.role)}`}
                  >
                    {customer.role}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-text-secondary">User ID</span>
                  <span className="text-sm font-mono text-text-primary">
                    {customer.id.slice(0, 12)}...
                  </span>
                </div>
              </div>
            </div>

            {/* Account Details */}
            <div className="bg-surface rounded-lg border border-border p-6">
              <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center space-x-2">
                <Calendar size={18} className="text-primary" />
                <span>Account Details</span>
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-text-secondary">Joined</p>
                  <p className="text-sm font-medium text-text-primary mt-1">
                    {formatDateTime(customer.createdAt)}
                  </p>
                </div>
                {profile?.createdAt && (
                  <div>
                    <p className="text-xs text-text-secondary">
                      Profile Created
                    </p>
                    <p className="text-sm font-medium text-text-primary mt-1">
                      {formatDateTime(profile.createdAt)}
                    </p>
                  </div>
                )}
                {profile?.updatedAt &&
                  profile.updatedAt !== profile?.createdAt && (
                    <div>
                      <p className="text-xs text-text-secondary">
                        Last Updated
                      </p>
                      <p className="text-sm font-medium text-text-primary mt-1">
                        {formatDateTime(profile.updatedAt)}
                      </p>
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
                {customer.accountStatus === "ACTIVE" ? (
                  <button
                    onClick={handleSuspend}
                    disabled={isUpdating}
                    className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex items-center gap-2"
                  >
                    {isUpdating ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <XCircle size={16} />
                    )}
                    <span>
                      {isUpdating ? "Updating..." : "Suspend Account"}
                    </span>
                  </button>
                ) : customer.accountStatus === "SUSPENDED" ? (
                  <button
                    onClick={() => handleStatusChange("ACTIVE")}
                    disabled={isUpdating}
                    className="w-full text-left px-3 py-2 text-sm text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors flex items-center gap-2"
                  >
                    {isUpdating ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <CheckCircle size={16} />
                    )}
                    <span>
                      {isUpdating ? "Updating..." : "Activate Account"}
                    </span>
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        {/* Suspension Modal */}
        {showSuspensionModal && (
          <AccountSuspensionModal
            isOpen={showSuspensionModal}
            onClose={() => setShowSuspensionModal(false)}
            onSuspend={(data) => handleStatusChange("SUSPENDED", data)}
            onReactivate={() => handleStatusChange("ACTIVE")}
            userData={{
              id: customer.id,
              name: getFullName(
                profile?.firstName || "",
                profile?.lastName || "",
              ),
              email: customer.email,
              phone: profile?.phoneNumber,
              role: customer.role,
              suspensionReason: customer.suspensionReason,
              suspendedAt: customer.suspendedAt,
              suspendedBy: customer.suspendedBy,
            }}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default CustomerPage;