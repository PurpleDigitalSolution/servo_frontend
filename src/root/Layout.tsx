import { Outlet } from "react-router-dom";
import SessionChecker from "../hooks/Session";

const Layout = () => {
  return (
    <div>
      <SessionChecker />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
