import React from "react";

import { Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "../store/authStore";

const GuestRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, authenticating } = useAuthStore();
  const location = useLocation();

  // Show loading state
  if (authenticating) {
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

  // Redirect authenticated users to appropriate dashboard
  if (user) {
    const from = location.state?.from?.pathname;
    let dashboardRoute = "/dashboard";

    if (user.role === "ADMIN") {
      dashboardRoute = "/admin/dashboard";
    }

    // Use the original intended route or fallback to dashboard
    const targetRoute = from || dashboardRoute;

    return (
      <Navigate
        to={targetRoute}
        replace
        state={{
          from: location,
          message: `Welcome back! Redirecting to your dashboard`,
        }}
      />
    );
  }

  // Render children for guest users
  return <>{children}</>;
};

export default GuestRoute;
