import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, ArrowRight, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import ThemeToggle from "../util/Theme";
import { useAuthStore } from "../store/authStore";

const ForgetPassword = () => {
  const navigate = useNavigate();
  const [formEmail, setFormEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {requestPasswordReset} = useAuthStore();
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");
    setError(null);
    setSuccess(false);

    if (!formEmail.trim()) {
      setValidationError("Email is required");
      return;
    }

    if (!validateEmail(formEmail)) {
      setValidationError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
     const response = await requestPasswordReset(formEmail);
      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/auth/verify-otp", { state: { email: formEmail } });
        }, 2000);
      } else {
        setError(response.message || "Failed to send OTP. Please try again.");
      }
    } catch {
      setError("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="bg-background relative dark:bg-background-dark min-h-screen">
      <div className="w-40 p-4 absolute z-20">
        <ThemeToggle />
      </div>
      <div className="max-w-md mx-auto py-12">
        <div className="bg-surface rounded-xl border border-border p-8 shadow-sm">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-text-primary">
              Reset Password
            </h1>
            <p className="text-text-secondary mt-2 text-sm">
              Enter your email address and we'll send you a verification code
            </p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                <div>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    OTP sent successfully!
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                    Please check your email for the verification code
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
                Email Address
              </label>
              <input
                type="email"
                value={formEmail}
                onChange={(e) => {
                  setFormEmail(e.target.value);
                  setError(null);
                  setValidationError("");
                }}
                className="w-full px-4 py-2.5 border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-primary placeholder-text-secondary"
                placeholder="Enter your email address"
                disabled={loading}
              />
              <p className="mt-1 text-xs text-text-secondary">
                We'll send a 6-digit verification code to this email
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4 text-white" />
                  Sending OTP...
                </>
              ) : (
                <>
                  Send OTP
                  <ArrowRight size={18} />
                </>
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

export default ForgetPassword;
