import { Outlet } from "react-router-dom";
import SessionChecker from "../hooks/Session";
import AccountSuspendedModal from "../components/modal/AccountSuspend";
import { useAuthStore } from "../store/authStore";

const Layout = () => {
  const user = useAuthStore((state) => state.user);
  return (
    <div>
      <SessionChecker />
      <main>
        {user?.accountStatus === "SUSPENDED" && (
          <AccountSuspendedModal
            reason={user.suspensionReason || "Violation of our terms of service"}
            suspendedAt={user.suspendedAt || new Date().toLocaleDateString()}
            // onContactSupport={() => {
            //   // Handle contact support action
            //   window.location.href = "mailto:support@servo.sbs";
            // }}
          />
        )}
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
