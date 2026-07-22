import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

type ProtectedProps = {
  children?: React.ReactNode;
  requiredRole?: string | string[];
};

const Protected = ({ children, requiredRole }: ProtectedProps) => {
  const { user, loading, authenticated, mustChangePassword } = useAuthStore();
  const location = useLocation();
  if (loading) {
    return <div>Loading...</div>;
  }
  console.log(mustChangePassword, "mustChangePassword");

  if (!user && !authenticated) {
    // alert("You must be logged in to access this page.");
    console.log(
      "Redirecting to login page from:",
      location.pathname + location.search,
    );
    sessionStorage.setItem("redirect_to", location.pathname + location.search);
    return (
      <Navigate
        to="/auth/login"
        replace
        state={{
          from: location,
          message: "Please sign in to access this page",
        }}
      />
    );
  }

  if (mustChangePassword) {
    return (
      <Navigate
        to="/auth/change-password"
        replace
        state={{
          from: location,
          message: "You must change your password to access this page",
        }}
      />
    );
  }

  if (requiredRole) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    const accountRole = user?.role;

    if (!accountRole || !roles.includes(accountRole)) {
      return <Navigate to="/unauthorized" replace state={{ from: location }} />;
    }
  }

  {
    /* 👇 If children props exist, render them, otherwise render the nested matching Route via Outlet */
  }
  return children ? <>{children}</> : <Outlet />;
};

export default Protected;
