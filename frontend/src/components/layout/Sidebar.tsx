"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Plane,
  LayoutDashboard,
  History,
  Route,
  User,
  Settings,
  Shield,
  BarChart3,
  Users,
  Brain,
  FileText,
  LogOut,
  Moon,
  Sun,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { Avatar } from "@/components/ui/avatar";

const userLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/predict", label: "Predict Fare", icon: Plane },
  { href: "/dashboard/history", label: "History", icon: History },
  { href: "/dashboard/routes", label: "Saved Routes", icon: Route },
  { href: "/dashboard/profile", label: "Profile", icon: User },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

const adminLinks = [
  { href: "/admin", label: "Admin Dashboard", icon: Shield },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/models", label: "Models", icon: Brain },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/logs", label: "Logs", icon: FileText },
];

export default function Sidebar() {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const isAdmin = pathname.startsWith("/admin");

  useEffect(() => setMounted(true), []);

  const links = isAdmin ? adminLinks : userLinks;

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white/80 dark:bg-secondary-800/80 backdrop-blur-2xl border-r border-secondary-200/50 dark:border-secondary-700/50 z-30">
      <div className="flex items-center space-x-2 px-6 h-16 border-b border-secondary-200/50 dark:border-secondary-700/50">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 shadow-md shadow-primary-500/20">
          {isAdmin ? (
            <Shield className="h-4 w-4 text-white" />
          ) : (
            <Plane className="h-4 w-4 text-white" />
          )}
        </div>
        <span className="text-lg font-bold gradient-text">
          {isAdmin ? "Admin Panel" : "FlightFare"}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-thin">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-gradient-to-r from-primary-50 to-primary-50/50 dark:from-primary-950/50 dark:to-primary-950/30 text-primary-700 dark:text-primary-300 shadow-sm border border-primary-200/50 dark:border-primary-800/30"
                  : "text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-700/50 hover:text-secondary-900 dark:hover:text-secondary-200 border border-transparent"
              )}
            >
              <link.icon className={cn(
                "h-5 w-5 flex-shrink-0 transition-colors",
                isActive && "text-primary-600 dark:text-primary-400"
              )} />
              <span>{link.label}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-5 rounded-full bg-gradient-to-b from-primary-500 to-primary-600" />
              )}
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-secondary-200/50 dark:border-secondary-700/50">
        <div className="flex items-center space-x-3 mb-3">
          <Avatar size="sm" fallback={user?.username || "U"} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100 truncate">
              {user?.username || "User"}
            </p>
            <p className="text-xs text-secondary-500 truncate">{user?.email}</p>
          </div>
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-700/50 transition-colors"
              title={theme === "dark" ? "Light mode" : "Dark mode"}
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4 text-secondary-500" />
              ) : (
                <Moon className="h-4 w-4 text-secondary-500" />
              )}
            </button>
          )}
        </div>
        <button
          onClick={() => { logout(); router.push("/login"); }}
          className="flex items-center space-x-2 w-full px-3 py-2.5 rounded-xl text-sm text-danger-600 hover:bg-danger-50 dark:hover:bg-danger-950/50 transition-colors border border-transparent hover:border-danger-200 dark:hover:border-danger-900/50"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
