import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Shield,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import Loader from "../components/Loader";
import ThemeToggle from "../util/Theme";
import { useAuthStore } from "../store/authStore";

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { email: string } | undefined;
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timer, setTimer] = useState(600);
  const [email] = useState(state?.email);
  const { verifyOTP } = useAuthStore();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer countdown
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleOtpChange = (index: number, value: string) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(0, 1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    // Move to previous input on backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      const otpArray = pastedData.split("");
      const newOtp = [...otp];
      otpArray.forEach((digit, index) => {
        if (index < 6) {
          newOtp[index] = digit;
        }
      });
      setOtp(newOtp);
      // Focus last filled input
      const lastIndex = Math.min(otpArray.length, 5);
      inputRefs.current[lastIndex]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      if (!email) {
        setError("Email not found. Please go back and enter your email.");
        setLoading(false);
        return;
      }
      const res = await verifyOTP(email, otpCode, "FORGET_PASSWORD");
      if (res.success) {
        setSuccess(true);
       
      } else {
        setError(res.message || "Invalid OTP. Please try again.");
      }
    } catch {
      setError("Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError(null);
    setTimer(300);
    // Simulate resend
    await new Promise((resolve) => setTimeout(resolve, 500));
    // Show success message for resend
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="flex bg-background dark:bg-background-dark items-center justify-center min-h-screen">
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
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-text-primary">Verify OTP</h1>
            <p className="text-text-secondary mt-2 text-sm">
              Enter the 6-digit code sent to{" "}
              <span className="font-medium text-text-primary">{email}</span>
            </p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                <p className="text-sm text-green-700 dark:text-green-300">
                  OTP verified successfully! Use the link send to your email to reset your password...
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                <p className="text-sm text-red-700 dark:text-red-300">
                  {error}
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-3 text-center">
                Enter 6-digit code
              </label>
              <div className="flex justify-center gap-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    className="w-12 h-14 text-center text-xl font-bold border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-primary"
                    disabled={loading}
                    autoFocus={index === 0}
                  />
                ))}
              </div>
              {otp.join("").length !== 6 && otp.some((d) => d !== "") && (
                <p className="mt-2 text-center text-xs text-red-500">
                  Please enter all 6 digits
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || otp.join("").length !== 6}
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
                  Verifying...
                </>
              ) : (
                <>
                  Verify OTP
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-secondary">
                Code expires in:{" "}
                <span className="font-mono font-medium text-text-primary">
                  {formatTime(timer)}
                </span>
              </span>
              <button
                onClick={handleResendOTP}
                disabled={timer > 0 || loading}
                className="text-primary hover:text-primary-hover font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Resend OTP
              </button>
            </div>

            <div className="text-center">
              <button
                onClick={() => navigate("/auth/forgot-password")}
                className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary transition-colors"
              >
                <ArrowLeft size={16} />
                Back to email
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
