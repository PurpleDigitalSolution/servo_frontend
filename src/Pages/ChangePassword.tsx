import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useAuthStore } from "../store/authStore";

const ChangePassword = () => {
  const navigate = useNavigate();
  const { changeDefaultPassword, user } = useAuthStore();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one number";
    }
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!newPassword) {
      setError("New password is required");
      return;
    }

    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      // Call the changeDefaultPassword function from the store
     const res = await changeDefaultPassword(user?.id || "", newPassword);
     if(res.success){
       setSuccess(true);

      setTimeout(() => {
        navigate("/admin/dashboard", { replace: true });
      }, 2000);
     }
    } catch (err: any) {
      setError(err?.message || "Failed to change password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Warning Banner */}
        <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl flex items-center gap-3">
          <AlertCircle
            size={20}
            className="text-yellow-600 dark:text-yellow-400 flex-shrink-0"
          />
          <div>
            <p className="text-sm text-yellow-700 dark:text-yellow-300 font-medium">
              You must change your password before proceeding.
            </p>
            <p className="text-xs text-yellow-600 dark:text-yellow-400">
              For security reasons, please set a new password.
            </p>
          </div>
        </div>

        <div className="bg-surface dark:bg-surface-dark rounded-2xl border border-border dark:border-border-dark p-8 shadow-sm">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock size={28} className="text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-text-primary dark:text-text-primary-dark">
              Set New Password
            </h1>
            <p className="text-text-secondary dark:text-text-secondary-dark text-sm mt-1">
              Please set a new password to secure your account
            </p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl flex items-center gap-3">
              <CheckCircle
                size={20}
                className="text-green-600 dark:text-green-400 flex-shrink-0"
              />
              <div>
                <p className="text-sm text-green-700 dark:text-green-300 font-medium">
                  Password set successfully!
                </p>
                <p className="text-xs text-green-600 dark:text-green-400">
                  Redirecting to dashboard...
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3">
              <AlertCircle
                size={20}
                className="text-red-600 dark:text-red-400 flex-shrink-0"
              />
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-1.5">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2.5 pr-12 border border-border dark:border-border-dark rounded-xl bg-surface dark:bg-surface-dark focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-primary dark:text-text-primary-dark placeholder:text-text-secondary dark:placeholder:text-text-secondary-dark transition-all"
                  placeholder="Enter new password"
                  disabled={isLoading || success}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary dark:text-text-secondary-dark hover:text-text-primary dark:hover:text-text-primary-dark transition-colors"
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {newPassword && (
                <div className="mt-2 space-y-1">
                  <p className="text-xs text-text-secondary dark:text-text-secondary-dark">
                    Password must contain:
                  </p>
                  <ul className="text-xs space-y-0.5">
                    <li
                      className={
                        newPassword.length >= 8
                          ? "text-green-600 dark:text-green-400"
                          : "text-text-secondary dark:text-text-secondary-dark"
                      }
                    >
                      • At least 8 characters {newPassword.length >= 8 && "✓"}
                    </li>
                    <li
                      className={
                        /[A-Z]/.test(newPassword)
                          ? "text-green-600 dark:text-green-400"
                          : "text-text-secondary dark:text-text-secondary-dark"
                      }
                    >
                      • One uppercase letter {/[A-Z]/.test(newPassword) && "✓"}
                    </li>
                    <li
                      className={
                        /[a-z]/.test(newPassword)
                          ? "text-green-600 dark:text-green-400"
                          : "text-text-secondary dark:text-text-secondary-dark"
                      }
                    >
                      • One lowercase letter {/[a-z]/.test(newPassword) && "✓"}
                    </li>
                    <li
                      className={
                        /[0-9]/.test(newPassword)
                          ? "text-green-600 dark:text-green-400"
                          : "text-text-secondary dark:text-text-secondary-dark"
                      }
                    >
                      • One number {/[0-9]/.test(newPassword) && "✓"}
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-1.5">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2.5 pr-12 border border-border dark:border-border-dark rounded-xl bg-surface dark:bg-surface-dark focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-primary dark:text-text-primary-dark placeholder:text-text-secondary dark:placeholder:text-text-secondary-dark transition-all"
                  placeholder="Confirm new password"
                  disabled={isLoading || success}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary dark:text-text-secondary-dark hover:text-text-primary dark:hover:text-text-primary-dark transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
              {confirmPassword &&
                newPassword &&
                confirmPassword !== newPassword && (
                  <p className="mt-1 text-xs text-red-500 dark:text-red-400">
                    Passwords do not match
                  </p>
                )}
              {confirmPassword &&
                newPassword &&
                confirmPassword === newPassword && (
                  <p className="mt-1 text-xs text-green-600 dark:text-green-400">
                    ✓ Passwords match
                  </p>
                )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={
                isLoading || success || !newPassword || !confirmPassword
              }
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl hover:bg-primary-hover dark:hover:bg-primary-hover-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Setting Password...</span>
                </>
              ) : success ? (
                <>
                  <CheckCircle size={18} />
                  <span>Set!</span>
                </>
              ) : (
                <>
                  <Lock size={18} />
                  <span>Set New Password</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
