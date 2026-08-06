import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

interface MustChangePasswordRouteProps {
  children: React.ReactNode;
}

const MustChangePasswordRoute: React.FC<MustChangePasswordRouteProps> = ({
  children
}) => {
  const { user, mustChangePassword } = useAuthStore();

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }


  if (!mustChangePassword) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default MustChangePasswordRoute;