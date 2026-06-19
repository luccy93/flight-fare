"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plane,
  Menu,
  X,
  ChevronDown,
  BarChart3,
  History,
  Route,
  Settings,
  User,
  LogOut,
  Shield,
  Moon,
  Sun,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

const dashboardLinks = [
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/dashboard/predict", label: "Predict", icon: Plane },
  { href: "/dashboard/history", label: "History", icon: History },
  { href: "/dashboard/routes", label: "Saved Routes", icon: Route },
];

export default function Header() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  const isDashboard = pathname.startsWith("/dashboard") || pathname.startsWith("/admin");
  const isAdmin = pathname.startsWith("/admin");

  if (isDashboard) return null;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-secondary-200/50 dark:border-secondary-700/50 bg-white/70 dark:bg-secondary-900/70 backdrop-blur-2xl shadow-sm shadow-black/5">
      <div className="container-custom flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 shadow-lg shadow-primary-500/20 group-hover:shadow-primary-500/30 transition-all duration-300">
            <Plane className="h-5 w-5 text-white" />
          </div>
          <span className="hidden sm:inline-block text-xl font-bold gradient-text">
            FlightFare
          </span>
        </Link>

        <nav className="hidden lg:flex items-center space-x-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200",
                pathname === link.href
                  ? "text-primary-600 bg-primary-50 dark:bg-primary-950/50 shadow-sm"
                  : "text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-secondary-100 dark:hover:bg-secondary-800/50"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-2">
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-secondary-100 dark:hover:bg-secondary-800/50 transition-all duration-200 border border-transparent hover:border-secondary-200 dark:hover:border-secondary-700"
              >
                <Avatar
                  size="sm"
                  fallback={user?.username || user?.email || "U"}
                />
                <span className="hidden md:inline-block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                  {user?.username || user?.email?.split("@")[0]}
                </span>
                <ChevronDown className="h-4 w-4 text-secondary-400 hidden md:block" />
              </button>

              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-56 rounded-2xl border border-secondary-200/50 dark:border-secondary-700/50 bg-white/80 dark:bg-secondary-800/80 backdrop-blur-2xl shadow-2xl shadow-black/10 py-2"
                  >
                    <div className="px-4 py-3 border-b border-secondary-200 dark:border-secondary-700">
                      <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100">
                        {user?.username || "User"}
                      </p>
                      <p className="text-xs text-secondary-500">{user?.email}</p>
                    </div>
                    {dashboardLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center space-x-2 px-4 py-2.5 text-sm text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700/50 transition-colors"
                      >
                        <link.icon className="h-4 w-4" />
                        <span>{link.label}</span>
                      </Link>
                    ))}
                    {user?.is_staff && (
                      <Link
                        href="/admin"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center space-x-2 px-4 py-2.5 text-sm text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700/50 transition-colors"
                      >
                        <Shield className="h-4 w-4" />
                        <span>Admin Panel</span>
                      </Link>
                    )}
                    <div className="border-t border-secondary-200 dark:border-secondary-700 mt-1 pt-1">
                      <Link
                        href="/dashboard/settings"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center space-x-2 px-4 py-2.5 text-sm text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700/50 transition-colors"
                      >
                        <Settings className="h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setShowUserMenu(false);
                          router.push("/login");
                        }}
                        className="flex items-center space-x-2 w-full px-4 py-2.5 text-sm text-danger-600 hover:bg-danger-50 dark:hover:bg-danger-950/50 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Log In
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">
                  <Sparkles className="mr-1.5 h-4 w-4" />
                  Sign Up
                </Button>
              </Link>
            </div>
          )}

          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-xl hover:bg-secondary-100 dark:hover:bg-secondary-800/50 transition-colors border border-transparent hover:border-secondary-200 dark:hover:border-secondary-700"
              title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5 text-secondary-600 dark:text-secondary-400" />
              ) : (
                <Moon className="h-5 w-5 text-secondary-600" />
              )}
            </button>
          )}

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-xl hover:bg-secondary-100 dark:hover:bg-secondary-800/50 transition-colors"
          >
            {isOpen ? (
              <X className="h-5 w-5 text-secondary-600" />
            ) : (
              <Menu className="h-5 w-5 text-secondary-600" />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-secondary-200 dark:border-secondary-700 bg-white/80 dark:bg-secondary-900/80 backdrop-blur-xl"
          >
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "block px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                    pathname === link.href
                      ? "text-primary-600 bg-primary-50 dark:bg-primary-950/50"
                      : "text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-800"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              {isAuthenticated && (
                <>
                  <div className="border-t border-secondary-200 dark:border-secondary-700 my-2" />
                  <Link
                    href="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-2.5 rounded-xl text-sm font-medium text-primary-600 bg-primary-50 dark:bg-primary-950/50"
                  >
                    Dashboard
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
