
import {
  BarChart,
  ClipboardClock,
  Fuel,
  Gauge,
  Package,
  Settings,
  Truck,
  User,
  Users,
  UserStar,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  LogOut,
} from "lucide-react";
import React, { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
  role?: string;
  children?: NavItem[];
}

interface SideBarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  isMobile?: boolean;
  onClose?: () => void;
}

const AdminSidebar = ({
  isCollapsed = false,
  onToggleCollapse,
  isMobile = false,
  onClose,
}: SideBarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    Users: true,
  });

  const navItems: NavItem[] = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: <Gauge size={20} />,
    },
    {
      name: "Orders",
      href: "/orders",
      icon: <Package size={20} />,
    },
    {
      name: "Stations",
      href: "/stations",
      icon: <Fuel size={20} />,
    },
    {
      name: "Users",
      href: "/customers",
      icon: <User size={20} />,
      children: [
        {
          name: "All Customers",
          href: "/customers",
          icon: <Users size={18} />,
        },
        { name: "Agents", href: "/agents", icon: <UserStar size={18} /> },
        { name: "Drivers", href: "/drivers", icon: <Truck size={18} /> },
      ],
    },
    {
      name: "Analytics",
      href: "/analytics",
      icon: <BarChart size={20} />,
      badge: "soon",
    },
    {
      name: "Logs",
      href: "/logs",
      icon: <ClipboardClock size={20} />,
      role: "admin",
    },
    {
      name: "Settings",
      href: "/settings",
      icon: <Settings size={20} />,
    },
  ];

  const toggleExpand = (itemName: string, e: React.MouseEvent) => {
    e.preventDefault();
    setExpandedItems((prev) => ({
      ...prev,
      [itemName]: !prev[itemName],
    }));
  };

  const isChildActive = (children: NavItem[]) => {
    return children.some(
      (child) =>
        location.pathname === child.href ||
        location.pathname.startsWith(child.href + "/"),
    );
  };

  // Close mobile sidebar when a link is clicked
  const handleLinkClick = () => {
    if (isMobile && onClose) {
      onClose();
    }
  };

  const handleLogout = async () => {
    try {
     const res = await logout();
      if(!res.success) {
        toast.error(res.message);
        return;
      }
      navigate("/");
    } catch (error: unknown) {
      toast.error(`Failed to logout: ${error}`);
    }
  };

  const renderNavItem = (item: NavItem, depth: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems[item.name] || false;
    const isParentActive = hasChildren && isChildActive(item.children!);

    // Role-based visibility check
    if (item.role === "admin") {
      const currentUserRole = user?.role || "user";
      if (currentUserRole !== "admin") return null;
    }

    // Don't show children or text when collapsed (except for mobile)
    if (isCollapsed && !isMobile && depth === 0) {
      if (hasChildren) {
        return (
          <div key={item.name} className="w-full relative group">
            <NavLink
              to={item.href}
              className={({ isActive }) => `
                flex items-center justify-center px-3 py-2.5 rounded-lg transition-all duration-200
                ${
                  isActive || isParentActive
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "text-text-secondary hover:bg-surface-secondary hover:text-text-primary"
                }
                group relative
              `}
              title={item.name}
              onClick={handleLinkClick}
            >
              {({ isActive }) => (
                <span
                  className={`${isActive || isParentActive ? "text-white" : "text-text-secondary group-hover:text-text-primary"} transition-colors`}
                >
                  {item.icon}
                </span>
              )}
            </NavLink>
          </div>
        );
      }

      return (
        <NavLink
          key={item.name}
          to={item.href}
          className={({ isActive }) => `
            flex items-center justify-center px-3 py-2.5 rounded-lg transition-all duration-200
            ${
              isActive
                ? "bg-primary text-white shadow-md shadow-primary/20"
                : "text-text-secondary hover:bg-surface-secondary hover:text-text-primary"
            }
            group relative
          `}
          title={item.name}
          onClick={handleLinkClick}
        >
          {({ isActive }) => (
            <span
              className={`${isActive ? "text-white" : "text-text-secondary group-hover:text-text-primary"} transition-colors`}
            >
              {item.icon}
            </span>
          )}
        </NavLink>
      );
    }

    if (hasChildren) {
      return (
        <div key={item.name} className="w-full">
          <button
            onClick={(e) => toggleExpand(item.name, e)}
            className={`
              flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 w-full
              ${depth > 0 ? "ml-6" : ""}
              ${
                isParentActive
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "text-text-secondary hover:bg-surface-secondary hover:text-text-primary"
              }
              group relative
            `}
          >
            <span
              className={`${isParentActive ? "text-white" : "text-text-secondary group-hover:text-text-primary"} transition-colors`}
            >
              {item.icon}
            </span>
            <span className="flex-1 text-sm font-medium text-left">
              {item.name}
            </span>

            {item.badge && (
              <span
                className={`
                text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase
                ${
                  isParentActive
                    ? "bg-white/20 text-white"
                    : "bg-primary/10 text-primary"
                }
              `}
              >
                {item.badge}
              </span>
            )}

            <span className="ml-auto">
              {isExpanded ? (
                <ChevronDown
                  size={16}
                  className={`${isParentActive ? "text-white" : "text-text-secondary"}`}
                />
              ) : (
                <ChevronRight
                  size={16}
                  className={`${isParentActive ? "text-white" : "text-text-secondary"}`}
                />
              )}
            </span>
          </button>

          {isExpanded && (
            <div className="mt-1 space-y-1">
              {item.children!.map((child) => renderNavItem(child, depth + 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <NavLink
        key={item.name}
        to={item.href}
        className={({ isActive }) => `
          flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
          ${depth > 0 ? "ml-6" : ""}
          ${
            isActive
              ? "bg-primary text-white shadow-md shadow-primary/20"
              : "text-text-secondary hover:bg-surface-secondary hover:text-text-primary"
          }
          group relative
        `}
        onClick={handleLinkClick}
      >
        {({ isActive }) => (
          <>
            <span
              className={`${isActive ? "text-white" : "text-text-secondary group-hover:text-text-primary"} transition-colors`}
            >
              {item.icon}
            </span>
            <span className="flex-1 text-sm font-medium">{item.name}</span>

            {item.badge && (
              <span
                className={`
                text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase
                ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-primary/10 text-primary"
                }
              `}
              >
                {item.badge}
              </span>
            )}
          </>
        )}
      </NavLink>
    );
  };

  return (
    <aside
      className={`
      h-screen bg-surface border-r border-border flex flex-col
      ${isMobile ? "w-72" : isCollapsed ? "w-20" : "w-64"}
      transition-all duration-300
    `}
    >
      {/* Logo/Brand Section */}
      <div
        className={`
        p-4 border-b border-border flex items-center
        ${isCollapsed && !isMobile ? "justify-center" : "justify-between"}
      `}
      >
        <NavLink
          to="/dashboard"
          className={`flex items-center gap-2 group ${isCollapsed && !isMobile ? "justify-center" : ""}`}
          onClick={handleLinkClick}
        >
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center transition-transform group-hover:scale-105 flex-shrink-0">
            <Fuel size={20} className="text-white" />
          </div>
          {(!isCollapsed || isMobile) && (
            <h1 className="text-lg font-bold text-text-primary">Servo</h1>
          )}
        </NavLink>

        {/* Collapse Toggle Button (Desktop only) */}
        {!isMobile && onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="p-1 rounded-lg hover:bg-surface-secondary transition-colors"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRightIcon size={20} className="text-text-secondary" />
            ) : (
              <ChevronLeft size={20} className="text-text-secondary" />
            )}
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {navItems.map((item) => renderNavItem(item))}
      </nav>

      {/* Footer Section */}
      <div className="p-3 border-t border-border">
        {!isCollapsed || isMobile ? (
          <div className="space-y-2">
            {/* User Info */}
            <NavLink
              to="/profile"
              className="flex items-center gap-3 px-3 py-2 rounded-lg bg-surface-secondary hover:bg-surface-secondary/80 transition-colors"
              onClick={handleLinkClick}
            >
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <User size={16} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">
                  {`${user?.userProfile?.firstName} ${user?.userProfile?.lastName}`}
                </p>
                <p className="text-xs text-text-secondary truncate">
                  {user?.role?.replace("_", " ").toLowerCase() || "User"}
                </p>
              </div>
            </NavLink>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-text-secondary hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors"
            >
              <LogOut size={18} />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        ) : (
          /* Collapsed Logout Button */
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-3 py-2.5 rounded-lg text-text-secondary hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        )}
      </div>
    </aside>
  );
};

export default AdminSidebar;