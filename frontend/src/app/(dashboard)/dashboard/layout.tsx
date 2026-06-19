"use client";

import React from "react";
import { motion } from "framer-motion";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-gradient-to-br from-secondary-50 to-white dark:from-secondary-900 dark:to-secondary-950 lg:pl-64"
    >
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {children}
      </div>
    </motion.div>
  );
}
