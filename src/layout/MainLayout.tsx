import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import SideBar from "../components/SideBar";
import { useAuthStore } from "../store/authStore";
// import ThemeToggle from "../util/Theme";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { user } = useAuthStore();

  const handleToggleCollapse = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // Determine user role for display
  const getUserRole = () => {
    if (user?.role === "ADMIN" || user?.role === "SUPER_ADMIN") return "Administrator";
    if (user?.role === "STAFF") return "Staff";
    return "User";
  };

  const getUserInitial = () => {
    const name = user?.userProfile?.firstName || "User";
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <SideBar
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={handleToggleCollapse}
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
          />

          {/* Mobile Sidebar */}
          <div className="fixed top-0 left-0 bottom-0 z-50 md:hidden">
            <SideBar
              isMobile={true}
              onClose={() => setIsMobileMenuOpen(false)}
            />
          </div>
        </>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header Bar */}
        <header className="bg-surface border-b border-border px-4 py-3 md:px-6 md:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden p-2 rounded-lg text-text-primary hover:bg-surface-secondary transition-colors"
                aria-label="Toggle menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Mobile Close Button when menu is open */}
              {isMobileMenuOpen && (
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="md:hidden p-2 rounded-lg text-text-primary hover:bg-surface-secondary transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              )}

              <h1 className="text-lg md:text-xl font-semibold text-text-primary">
                {user?.role === "ADMIN" ? "Admin Dashboard" : "Staff Dashboard"}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              {/* <ThemeToggle /> */}

              {/* User Menu */}
              <div className="flex items-center gap-2 md:gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-text-primary">
                    {user?.userProfile?.firstName || "User"}
                  </p>
                  <p className="text-xs text-text-secondary">{getUserRole()}</p>
                </div>
                <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary">
                    {getUserInitial()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-2 md:p-6 lg:p-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
