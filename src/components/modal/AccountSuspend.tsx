import { Shield, Clock } from "lucide-react";

interface AccountSuspendedModalProps {
  reason?: string;
  suspendedAt?: string;
  onContactSupport?: () => void;
}

const AccountSuspendedModal = ({
  reason = "Violation of our terms of service",
  suspendedAt = new Date().toLocaleDateString(),
  onContactSupport,
}: AccountSuspendedModalProps) => {


  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <div
          className="relative bg-surface rounded-xl shadow-xl max-w-md w-full p-6"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <Shield size={32} className="text-red-600 dark:text-red-400" />
            </div>
          </div>

          {/* Content */}
          <div className="text-center">
            <h2 className="text-xl font-bold text-text-primary mb-2">
              Account Suspended
            </h2>

            <p className="text-text-secondary text-sm mb-2">
              Your account has been suspended.
            </p>

            {reason && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-4">
                <p className="text-sm text-red-700 dark:text-red-300">
                  <span className="font-medium">Reason:</span> {reason}
                </p>
              </div>
            )}

            <div className="flex items-center justify-center gap-2 text-xs text-text-secondary mb-4">
              <Clock size={14} />
              <span>Suspended on: {suspendedAt}</span>
            </div>

            <p className="text-xs text-text-secondary mb-4">
              If you believe this is a mistake, please contact admin.
            </p>

            {/* Buttons */}
            <div className="flex flex-col gap-2">
              {onContactSupport && (
                <button
                  onClick={onContactSupport}
                  className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors font-medium"
                >
                  Contact Support
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSuspendedModal;
