import React, { useState } from "react";
import {
  X,
  AlertCircle,
  CheckCircle,
  Loader2,
  Shield,
  UserX,
  Clock,
  Mail,
  Phone,
  User,
} from "lucide-react";

interface AccountSuspendedModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    role: string;
    suspensionReason?: string;
    suspendedAt?: string;
    suspendedBy?: string;
  };
  onSuspend: (data: { reason: string; duration: string }) => Promise<void>;
  onReactivate?: () => Promise<void>;
  loading?: boolean;
}

const SUSPENSION_REASONS = [
  { value: "fraud", label: "Fraudulent Activity" },
  { value: "policy_violation", label: "Policy Violation" },
  { value: "abuse", label: "Abuse of Service" },
  { value: "payment_issue", label: "Payment Issue" },
  { value: "security", label: "Security Concern" },
  { value: "other", label: "Other Reason" },
];

// const SUSPENSION_DURATIONS = [
//   { value: "24h", label: "24 Hours" },
//   { value: "7d", label: "7 Days" },
//   { value: "14d", label: "14 Days" },
//   { value: "30d", label: "30 Days" },
//   { value: "permanent", label: "Permanent" },
// ];

const AccountSuspensionModal = ({
  isOpen,
  onClose,
  userData,
  onSuspend,
  onReactivate,
  loading = false,
}: AccountSuspendedModalProps) => {
  const [reason, setReason] = useState("");
  const [duration, setDuration] = useState("7d");
  const [customReason, setCustomReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const isSuspended = userData?.suspendedAt !== undefined && userData?.suspendedAt !== null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const finalReason = reason === "other" ? customReason : reason;
    if (!finalReason) {
      setError("Please provide a reason for suspension");
      return;
    }

    if (!duration) {
      setError("Please select a suspension duration");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSuspend({
        reason: finalReason,
        duration: duration,
      });
      setSuccess(true);
      setTimeout(() => {
        onClose();
        resetForm();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to suspend account");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReactivate = async () => {
    if (!onReactivate) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await onReactivate();
      setSuccess(true);
      setTimeout(() => {
        onClose();
        resetForm();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reactivate account");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setReason("");
    setDuration("7d");
    setCustomReason("");
    setError(null);
    setSuccess(false);
  };

  const handleClose = () => {
    if (!isSubmitting && !loading) {
      resetForm();
      onClose();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <div
          className="relative bg-surface rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-surface border-b border-border z-10 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isSuspended ? "bg-green-100 dark:bg-green-900/30" : "bg-red-100 dark:bg-red-900/30"
              }`}>
                {isSuspended ? (
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                ) : (
                  <Shield className="w-5 h-5 text-red-600 dark:text-red-400" />
                )}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-text-primary">
                  {isSuspended ? "Account Reactivation" : "Suspend Account"}
                </h2>
                <p className="text-xs text-text-secondary">
                  {isSuspended
                    ? "Reactivate this account"
                    : "Suspend this account temporarily"}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              disabled={isSubmitting || loading}
              className="p-1.5 hover:bg-surface-secondary rounded-lg transition-colors disabled:opacity-50"
            >
              <X size={18} className="text-text-secondary" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6">
            {/* Success Message */}
            {success && (
              <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-2">
                <CheckCircle size={16} className="text-green-600 dark:text-green-400 flex-shrink-0" />
                <p className="text-sm text-green-700 dark:text-green-300">
                  {isSuspended ? "Account reactivated successfully!" : "Account suspended successfully!"}
                </p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2">
                <AlertCircle size={16} className="text-red-600 dark:text-red-400 flex-shrink-0" />
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              </div>
            )}

            {/* User Info */}
            <div className="mb-4 p-3 bg-surface-secondary rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <User size={18} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">
                    {userData?.name || "Unknown User"}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-text-secondary">
                    <Mail size={12} className="flex-shrink-0" />
                    <span className="truncate">{userData?.email}</span>
                  </div>
                  {userData?.phone && (
                    <div className="flex items-center gap-2 text-xs text-text-secondary">
                      <Phone size={12} className="flex-shrink-0" />
                      <span>{userData.phone}</span>
                    </div>
                  )}
                </div>
                <div className="text-right flex-shrink-0">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    userData?.role === "ADMIN"
                      ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                      : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                  }`}>
                    {userData?.role || "User"}
                  </span>
                </div>
              </div>
            </div>

            {/* Suspension Info (if suspended) */}
            {isSuspended && userData?.suspendedAt && (
              <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Clock size={14} className="text-yellow-600 dark:text-yellow-400" />
                  <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
                    Account Suspended
                  </span>
                </div>
                <p className="text-xs text-yellow-600 dark:text-yellow-400">
                  Suspended on: {formatDate(userData.suspendedAt)}
                </p>
                {userData.suspendedBy && (
                  <p className="text-xs text-yellow-600 dark:text-yellow-400">
                    By: {userData.suspendedBy}
                  </p>
                )}
                {userData.suspensionReason && (
                  <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                    Reason: {userData.suspensionReason}
                  </p>
                )}
              </div>
            )}

            {/* Suspension Form */}
            {!isSuspended ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Reason */}
                <div>
                  <label className="block text-xs font-medium text-text-primary mb-1">
                    Suspension Reason <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={reason}
                    onChange={(e) => {
                      setReason(e.target.value);
                      setError(null);
                    }}
                    className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-primary"
                    disabled={isSubmitting || loading}
                  >
                    <option value="">Select a reason</option>
                    {SUSPENSION_REASONS.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Custom Reason */}
                {reason === "other" && (
                  <div>
                    <label className="block text-xs font-medium text-text-primary mb-1">
                      Custom Reason <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={customReason}
                      onChange={(e) => {
                        setCustomReason(e.target.value);
                        setError(null);
                      }}
                      className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-primary resize-y min-h-[60px]"
                      placeholder="Please provide details..."
                      disabled={isSubmitting || loading}
                    />
                  </div>
                )}

                {/* Duration */}
                {/* <div>
                  <label className="block text-xs font-medium text-text-primary mb-1">
                    Suspension Duration <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={duration}
                    onChange={(e) => {
                      setDuration(e.target.value);
                      setError(null);
                    }}
                    className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-primary"
                    disabled={isSubmitting || loading}
                  >
                    {SUSPENSION_DURATIONS.map((d) => (
                      <option key={d.value} value={d.value}>
                        {d.label}
                      </option>
                    ))}
                  </select>
                </div> */}

                {/* Warning */}
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle size={16} className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-700 dark:text-red-300">
                        Warning: This action cannot be undone
                      </p>
                      <p className="text-xs text-red-600 dark:text-red-400 mt-0.5">
                        The user will not be able to access their account during the suspension period.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-2 justify-end pt-2">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isSubmitting || loading}
                    className="px-4 py-2 text-sm border border-border rounded-lg text-text-secondary hover:bg-surface-secondary transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || loading || !reason || (reason === "other" && !customReason)}
                    className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Suspending...
                      </>
                    ) : (
                      <>
                        <UserX size={16} />
                        Suspend Account
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              /* Reactivation Section */
              <div className="space-y-4">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <div className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                        Reactivate Account
                      </p>
                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">
                        This will restore full access to the user's account.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 justify-end pt-2">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isSubmitting || loading}
                    className="px-4 py-2 text-sm border border-border rounded-lg text-text-secondary hover:bg-surface-secondary transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReactivate}
                    disabled={isSubmitting || loading}
                    className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Reactivating...
                      </>
                    ) : (
                      <>
                        <CheckCircle size={16} />
                        Reactivate Account
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSuspensionModal;