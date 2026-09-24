import React, { useState, useMemo } from "react";
import { Menu, X, Wifi, WifiOff } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import ThemeToggle from "../util/Theme";
import { Sidebar } from "../components/SideBar";
import {
  superAdminNavItems,
  agentNavItems,
  type NavItem,
} from "../constants/navItems";
import { useBadgeStream } from "../util/badgeStream";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const user = useAuthStore((s) => s.user);

  const handleToggleCollapse = () => setIsSidebarCollapsed((v) => !v);
  const role = user?.role || "";

  const navItems: NavItem[] = useMemo(() => {
    switch (role) {
      case "SUPER_ADMIN":
        return superAdminNavItems;
      case "AGENT":
        return agentNavItems;
      default:
        return [];
    }
  }, [role]);

  const stationId = user?.stationId;
  const agentId = user?.id;

  const { isConnected } = useBadgeStream(
    role === "AGENT" ? stationId : undefined,
    role === "AGENT" ? agentId : undefined,
  );

  const getUserRole = () => {
    if (role === "ADMIN" || role === "SUPER_ADMIN") return "Administrator";
    if (role === "AGENT") return "Staff";
    return "User";
  };

  const getUserInitial = () => {
    const name = user?.userProfile?.firstName || "User";
    return name.charAt(0).toUpperCase();
  };

  const dashboardTitle =
    role === "ADMIN" || role === "SUPER_ADMIN"
      ? "Admin Dashboard"
      : role === "AGENT"
        ? "Staff Dashboard"
        : "Dashboard";

  const hasSidebar = navItems.length > 0;

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      {hasSidebar && (
        <div className="hidden md:block">
          <Sidebar
            navItems={navItems}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={handleToggleCollapse}
          />
        </div>
      )}

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && hasSidebar && (
        <>
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
          />
          <div className="fixed top-0 left-0 bottom-0 z-50 md:hidden">
            <Sidebar
              navItems={navItems}
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
              {hasSidebar && (
                <button
                  onClick={() => setIsMobileMenuOpen((v) => !v)}
                  className="md:hidden p-2 rounded-lg text-text-primary hover:bg-surface-secondary transition-colors"
                  aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                >
                  {isMobileMenuOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </button>
              )}

              <h1 className="text-lg md:text-xl font-semibold text-text-primary">
                {dashboardTitle}
              </h1>

              {/* SSE Live Connection Status Indicator for Staff/Agents */}
              {role === "AGENT" && (
                <div
                  className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                    isConnected
                      ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400"
                      : "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400"
                  }`}
                >
                  {isConnected ? (
                    <>
                      <Wifi size={14} className="animate-pulse" />
                      Live Updates
                    </>
                  ) : (
                    <>
                      <WifiOff size={14} />
                      Connecting...
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <ThemeToggle />

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