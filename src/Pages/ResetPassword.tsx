import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Lock, CheckCircle, AlertCircle, Eye, EyeOff } from "lucide-react";
import Loader from "../components/Loader";
import ThemeToggle from "../util/Theme";
import { useAuthStore } from "../store/authStore";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { resetPassword } = useAuthStore();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      navigate("/request-otp");
    }
  }, [token, navigate]);

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
    setValidationError("");
    setError(null);
    setSuccess(false);

    if (!newPassword || !confirmPassword) {
      setValidationError("All fields are required");
      return;
    }

    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setValidationError(passwordError);
      return;
    }

    if (newPassword !== confirmPassword) {
      setValidationError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      if (!token) {
        setError("Token not provided");
        return;
      }
      const res = await resetPassword(newPassword, token);

      // Redirect after success
      if (res.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/auth/login");
        }, 2000);
      }
    } catch {
      setError("Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-background dark:bg-background-dark min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="bg-background relative dark:bg-background-dark min-h-screen">
      <div className="w-40 p-4 absolute z-20">
        <ThemeToggle />
      </div>
      <div className="max-w-md mx-auto py-12">
        <div className="bg-surface rounded-xl border border-border p-8 shadow-sm">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-text-primary">
              Create New Password
            </h1>
            <p className="text-text-secondary mt-2 text-sm">
              Your new password must be different from your previous password
            </p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                <div>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Password reset successfully!
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                    Redirecting to login...
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {(error || validationError) && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                <p className="text-sm text-red-700 dark:text-red-300">
                  {validationError || error}
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setError(null);
                    setValidationError("");
                  }}
                  className="w-full px-4 py-2.5 pr-12 border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-primary placeholder-text-secondary"
                  placeholder="Enter new password"
                  disabled={loading || success}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="mt-2 space-y-1">
                <p className="text-xs text-text-secondary">
                  Password must contain at least:
                </p>
                <ul className="text-xs text-text-secondary space-y-0.5">
                  <li
                    className={newPassword.length >= 8 ? "text-green-500" : ""}
                  >
                    • 8 characters
                  </li>
                  <li
                    className={
                      /[A-Z]/.test(newPassword) ? "text-green-500" : ""
                    }
                  >
                    • One uppercase letter
                  </li>
                  <li
                    className={
                      /[a-z]/.test(newPassword) ? "text-green-500" : ""
                    }
                  >
                    • One lowercase letter
                  </li>
                  <li
                    className={
                      /[0-9]/.test(newPassword) ? "text-green-500" : ""
                    }
                  >
                    • One number
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setError(null);
                    setValidationError("");
                  }}
                  className="w-full px-4 py-2.5 pr-12 border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-primary placeholder-text-secondary"
                  placeholder="Confirm your new password"
                  disabled={loading || success}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="mt-1 text-xs text-red-500">
                  Passwords do not match
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || success || !newPassword || !confirmPassword}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Resetting Password...
                </>
              ) : success ? (
                <>
                  <CheckCircle size={18} />
                  Password Reset!
                </>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-text-secondary">
              Remember your password?{" "}
              <button
                onClick={() => navigate("/auth/login")}
                className="text-primary hover:text-primary-hover font-medium transition-colors"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
