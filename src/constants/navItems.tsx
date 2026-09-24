import {
  BarChart,
  ClipboardClock,
  Fuel,
  Gauge,
  Package,
  Settings,
  Truck,
  User,
  UserLock,
  Users,
  UserStar,
} from "lucide-react";
import type React from "react";

export interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  badgeKey?: string; // dynamic — pulled from backend map
  badgeLabel?: string; // static  — "soon", "new", etc.
  roles?: string[];
  children?: NavItem[];
}

export type BadgeMap = Record<string, number | string>;

export const superAdminNavItems: NavItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: <Gauge size={20} /> },
  {
    name: "Orders",
    href: "/orders",
    icon: <Package size={20} />,
    badgeKey: "orders",
  },
  { name: "Stations", href: "/stations", icon: <Fuel size={20} /> },
  {
    name: "Users",
    href: "/customers",
    icon: <User size={20} />,
    children: [
      { name: "All Customers", href: "/customers", icon: <Users size={18} /> },
      { name: "Agents", href: "/agents", icon: <UserStar size={18} /> },
      { name: "Admins", href: "/admins", icon: <UserLock size={18} /> },
      { name: "Drivers", href: "/drivers", icon: <Truck size={18} /> },
    ],
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: <BarChart size={20} />,
    badgeLabel: "soon",
  },
  {
    name: "Logs",
    href: "/logs",
    icon: <ClipboardClock size={20} />,
    roles: ["ADMIN", "SUPER_ADMIN"],
    badgeKey: "logs",
  },
  { name: "Settings", href: "/settings", icon: <Settings size={20} /> },
];

export const agentNavItems: NavItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: <Gauge size={20} /> },
  {
    name: "Orders",
    href: "/orders",
    icon: <Package size={20} />,
    badgeKey: "pendingOrders",
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: <BarChart size={20} />,
    badgeLabel: "soon",
  },
  {
    name: "Logs",
    href: "/logs",
    icon: <ClipboardClock size={20} />,
    roles: ["admin", "SUPER_ADMIN"],
    badgeKey: "logs",
  },
  { name: "Settings", href: "/settings", icon: <Settings size={20} /> },
];
