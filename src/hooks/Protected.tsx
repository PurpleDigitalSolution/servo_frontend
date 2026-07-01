import { Navigate, useLocation, Outlet } from "react-router-dom"; // 👈 Add Outlet here
import { useAuthStore } from "../store/authStore";

type ProtectedProps = {
  children?: React.ReactNode;
  requiredRole?: string | string[];
};

const Protected = ({ children, requiredRole }: ProtectedProps) => {
  const { user, authenticating, authenticated } = useAuthStore();
  const location = useLocation();

  if (authenticating) {
    return <div>Loading...</div>;
  }

  if (!user && !authenticated) {
    return (
      <Navigate
        to="/"
        replace
        state={{
          from: location,
          message: "Please sign in to access this page",
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

  {/* 👇 If children props exist, render them, otherwise render the nested matching Route via Outlet */}
  return children ? <>{children}</> : <Outlet />;
};

export default Protected;