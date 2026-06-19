"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Shield,
  Users,
  Brain,
  BarChart3,
  FileText,
  LayoutDashboard,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";

const sidebarLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/models", label: "Models", icon: Brain },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/logs", label: "Logs", icon: FileText },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && (!user || !user.is_admin)) {
      router.push("/dashboard");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user || !user.is_admin) {
    return (
      <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900 flex items-center justify-center">
        <div className="flex items-center space-x-2 text-secondary-500">
          <div className="w-5 h-5 rounded-full border-2 border-primary-500 border-t-transparent animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-white dark:from-secondary-900 dark:to-secondary-950">
      <div className="lg:pl-64">
        <div className="sticky top-0 z-40 lg:hidden flex items-center gap-2 px-4 h-14 bg-white/80 dark:bg-secondary-800/80 backdrop-blur-xl border-b border-secondary-200/50 dark:border-secondary-700/50">
          <Link
            href="/dashboard"
            className="flex items-center text-sm text-secondary-500 hover:text-primary-600 transition-colors"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Link>
          <div className="h-4 w-px bg-secondary-200 dark:bg-secondary-700" />
          <Shield className="h-4 w-4 text-primary-600" />
          <span className="text-sm font-semibold text-secondary-900 dark:text-white">Admin Panel</span>
        </div>
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </div>

      <aside className="fixed inset-y-0 left-0 z-50 hidden lg:flex lg:flex-col w-64 bg-white/80 dark:bg-secondary-800/80 backdrop-blur-2xl border-r border-secondary-200/50 dark:border-secondary-700/50">
        <div className="flex items-center gap-2 px-6 h-16 border-b border-secondary-200/50 dark:border-secondary-700/50">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 shadow-md shadow-primary-500/20">
            <Shield className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-bold gradient-text">
            Admin Panel
          </span>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {sidebarLinks.map((link) => {
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
                <link.icon
                  className={cn(
                    "h-5 w-5 flex-shrink-0",
                    isActive && "text-primary-600 dark:text-primary-400"
                  )}
                />
                <span>{link.label}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-5 rounded-full bg-gradient-to-b from-primary-500 to-primary-600" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-secondary-200/50 dark:border-secondary-700/50">
          <Link
            href="/dashboard"
            className="flex items-center space-x-2 text-sm text-secondary-500 hover:text-primary-600 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Link>
        </div>
      </aside>
    </div>
  );
}
