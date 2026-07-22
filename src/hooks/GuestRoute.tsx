import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "../store/authStore";

const GuestRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isCheckingAuth, mustChangePassword } = useAuthStore();
  const location = useLocation();

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-surface-secondary flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-text-primary mb-2">
            Checking Access
          </h2>
          <p className="text-text-secondary">Verifying your session...</p>
        </div>
      </div>
    );
  }
if(mustChangePassword && !location.pathname.includes("/auth/change-password")) {
    return <Navigate to="/auth/change-password" replace />;
  }
  if (user) {
    // 1. Safely extract location state route
    const statePathname = location.state?.from?.pathname;
    const validStatePath =
      typeof statePathname === "string" && statePathname.startsWith("/")
        ? statePathname
        : null;

    // 2. Read and clear sessionStorage redirect
    const savedRedirect = sessionStorage.getItem("redirect_to");
    if (savedRedirect) {
      sessionStorage.removeItem("redirect_to");
    }

    // 3. Role-based fallback route
    const defaultDashboard =
      user.role === "ADMIN" || user.role === "SUPER_ADMIN" ? "/dashboard" : "/dashboard";

    // 4. Fallback hierarchy: statePath -> savedRedirect -> defaultDashboard
    const targetRoute = validStatePath || savedRedirect || defaultDashboard;

    return <Navigate to={targetRoute} replace />;
  }

  return <>{children}</>;
};

export default GuestRoute;