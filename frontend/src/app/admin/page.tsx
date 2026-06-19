"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Users,
  Plane,
  Activity,
  Brain,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import FareTrendChart from "@/components/charts/FareTrendChart";
import { useAdmin } from "@/hooks/useAdmin";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const recentUsers = [
  { id: 1, name: "Rahul Sharma", email: "rahul@example.com", role: "User", status: "active", date: "2024-03-15", initials: "RS" },
  { id: 2, name: "Priya Patel", email: "priya@example.com", role: "User", status: "active", date: "2024-03-14", initials: "PP" },
  { id: 3, name: "Amit Kumar", email: "amit@example.com", role: "Admin", status: "active", date: "2024-03-13", initials: "AK" },
  { id: 4, name: "Sneha Reddy", email: "sneha@example.com", role: "User", status: "inactive", date: "2024-03-12", initials: "SR" },
  { id: 5, name: "Vikram Singh", email: "vikram@example.com", role: "User", status: "active", date: "2024-03-11", initials: "VS" },
];

const recentPredictions = [
  { id: 1, route: "DEL → BOM", fare: 5245, confidence: 94.7, date: "2 min ago" },
  { id: 2, route: "BOM → DEL", fare: 4890, confidence: 92.3, date: "15 min ago" },
  { id: 3, route: "DEL → BLR", fare: 6120, confidence: 91.8, date: "1 hour ago" },
  { id: 4, route: "MAA → DEL", fare: 5580, confidence: 93.1, date: "2 hours ago" },
  { id: 5, route: "BOM → BLR", fare: 3760, confidence: 95.2, date: "3 hours ago" },
];

export default function AdminDashboardPage() {
  const { dashboard, isDashboardLoading } = useAdmin();

  const statsCards = [
    {
      title: "Total Users",
      value: dashboard?.total_users ?? 12543,
      change: "+12%",
      trend: "up",
      icon: Users,
      color: "from-primary-500 to-primary-600",
    },
    {
      title: "Total Predictions",
      value: dashboard?.total_predictions ?? 87342,
      change: "+8%",
      trend: "up",
      icon: Plane,
      color: "from-accent-500 to-accent-600",
    },
    {
      title: "Active Today",
      value: dashboard?.recent_predictions ?? 1247,
      change: "+3%",
      trend: "up",
      icon: Activity,
      color: "from-success-500 to-success-600",
    },
    {
      title: "Avg Confidence",
      value: dashboard?.avg_confidence ? `${dashboard.avg_confidence}%` : "93.5%",
      change: "+0.5%",
      trend: "up",
      icon: Brain,
      color: "from-warning-500 to-warning-600",
    },
  ];

  if (isDashboardLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-secondary-200 dark:bg-secondary-700 rounded-lg" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-secondary-200 dark:bg-secondary-700 rounded-xl" />
          ))}
        </div>
        <div className="h-80 bg-secondary-200 dark:bg-secondary-700 rounded-xl" />
      </div>
    );
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">Admin Dashboard</h1>
        <p className="text-sm text-secondary-500 mt-1">Overview of your platform metrics</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat) => (
          <motion.div key={stat.title} variants={item}>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <Badge variant={stat.trend === "up" ? "success" : "destructive"} className="flex items-center gap-1">
                    {stat.trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {stat.change}
                  </Badge>
                </div>
                <p className="text-sm font-medium text-secondary-500 dark:text-secondary-400">{stat.title}</p>
                <p className="text-2xl font-bold text-secondary-900 dark:text-white mt-1">
                  {typeof stat.value === "number" ? stat.value.toLocaleString() : stat.value}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div variants={item}>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Fare Trends</CardTitle>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <ArrowUpRight className="h-3 w-3" />
                  This Year
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <FareTrendChart height={300} />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Users</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar size="sm" fallback={user.initials} />
                          <div>
                            <p className="font-medium text-secondary-900 dark:text-white text-sm">{user.name}</p>
                            <p className="text-xs text-secondary-500">{user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.role === "Admin" ? "default" : "secondary"} className="text-xs">
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.status === "active" ? "success" : "destructive"} className="text-xs">
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-xs text-secondary-500">{user.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div variants={item}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Predictions</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Route</TableHead>
                  <TableHead>Predicted Fare</TableHead>
                  <TableHead>Confidence</TableHead>
                  <TableHead className="text-right">Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentPredictions.map((pred) => (
                  <TableRow key={pred.id}>
                    <TableCell className="font-medium text-secondary-900 dark:text-white">{pred.route}</TableCell>
                    <TableCell>₹{pred.fare.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-secondary-200 dark:bg-secondary-700 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-primary-600"
                            style={{ width: `${pred.confidence}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-secondary-600 dark:text-secondary-400">
                          {pred.confidence}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-xs text-secondary-500">{pred.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
