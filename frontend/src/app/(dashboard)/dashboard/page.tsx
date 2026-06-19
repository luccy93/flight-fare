"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Plane,
  TrendingDown,
  Route,
  Brain,
  ArrowRight,
  Clock,
  BarChart3,
  Target,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";
import { usePredictions } from "@/hooks/usePredictions";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const priceCategoryVariant = (category: string) => {
  switch (category?.toLowerCase()) {
    case "low":
      return "success";
    case "medium":
      return "warning";
    case "high":
      return "destructive";
    default:
      return "secondary";
  }
};

export default function DashboardPage() {
  const { user } = useAuth();
  const { getPredictionHistory } = usePredictions();
  const history = getPredictionHistory.data || [];
  const recentPredictions = history.slice(0, 5);

  const totalPredictions = history.length;
  const savedRoutes = 0;
  const avgConfidence =
    history.length > 0
      ? (
          history.reduce(
            (sum: number, p: { confidence_score: number }) =>
              sum + p.confidence_score,
            0
          ) / history.length
        ).toFixed(1)
      : "N/A";

  const stats = [
    {
      label: "Total Predictions",
      value: totalPredictions,
      icon: Brain,
      gradient: "from-primary-500 to-primary-600",
      shadow: "shadow-primary-500/20",
    },
    {
      label: "Saved Routes",
      value: savedRoutes,
      icon: Route,
      gradient: "from-accent-500 to-accent-600",
      shadow: "shadow-accent-500/20",
    },
    {
      label: "Avg Confidence",
      value: typeof avgConfidence === "string" ? avgConfidence : `${avgConfidence}%`,
      icon: Target,
      gradient: "from-success-500 to-success-600",
      shadow: "shadow-success-500/20",
    },
    {
      label: "Active Predictions",
      value: totalPredictions,
      icon: BarChart3,
      gradient: "from-warning-500 to-warning-600",
      shadow: "shadow-warning-500/20",
    },
  ];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-secondary-900 dark:text-white">
            Welcome back,{" "}
            <span className="gradient-text">
              {user?.first_name || user?.username || "User"}
            </span>
          </h1>
          <p className="text-secondary-500 dark:text-secondary-400 mt-1">
            Here&apos;s your flight fare prediction overview
          </p>
        </div>
        <Link href="/dashboard/predict">
          <Button size="lg" className="w-full sm:w-auto group">
            <Sparkles className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
            New Prediction
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-0.5 transition-transform" />
          </Button>
        </Link>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, i) => (
          <motion.div key={stat.label} custom={i} variants={fadeInUp}>
            <Card className="hover-lift">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg ${stat.shadow}`}
                  >
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-secondary-900 dark:text-white mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-secondary-500 dark:text-secondary-400">
                  {stat.label}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Recent Predictions</CardTitle>
              <Link
                href="/dashboard/history"
                className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center group"
              >
                View All
                <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </CardHeader>
            <CardContent>
              {recentPredictions.length > 0 ? (
                <div className="space-y-3">
                  {recentPredictions.map(
                    (
                      pred: {
                        id: number;
                        airline: string;
                        source: string;
                        destination: string;
                        predicted_price: number;
                        price_category: string;
                        created_at: string;
                      },
                      idx: number
                    ) => (
                      <motion.div
                        key={pred.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="flex items-center justify-between p-3 rounded-xl bg-secondary-50 dark:bg-secondary-800/50 hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-all cursor-pointer border border-transparent hover:border-secondary-200 dark:hover:border-secondary-700"
                      >
                        <div className="flex items-center space-x-3 min-w-0">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                            <Plane className="h-5 w-5 text-white" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-secondary-900 dark:text-white truncate">
                              {pred.source} → {pred.destination}
                            </p>
                            <p className="text-xs text-secondary-500">
                              {pred.airline} •{" "}
                              {new Date(pred.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0 ml-4">
                          <p className="text-sm font-bold text-primary-600">
                            ₹{pred.predicted_price.toLocaleString()}
                          </p>
                          <Badge
                            variant={priceCategoryVariant(pred.price_category)}
                            className="text-[10px]"
                          >
                            {pred.price_category}
                          </Badge>
                        </div>
                      </motion.div>
                    )
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-secondary-100 to-secondary-200 dark:from-secondary-800 dark:to-secondary-700 flex items-center justify-center mx-auto mb-4">
                    <Plane className="h-8 w-8 text-secondary-400" />
                  </div>
                  <p className="text-secondary-500 dark:text-secondary-400 mb-4 font-medium">
                    No predictions yet
                  </p>
                  <Link href="/dashboard/predict">
                    <Button variant="outline" size="sm">
                      Make your first prediction
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start space-x-3 p-4 rounded-xl bg-gradient-to-r from-accent-50 to-transparent dark:from-accent-950/30 dark:to-transparent border border-accent-200/50 dark:border-accent-800/30">
                <div className="w-9 h-9 rounded-lg bg-accent-100 dark:bg-accent-950 flex items-center justify-center flex-shrink-0">
                  <Clock className="h-5 w-5 text-accent-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-secondary-900 dark:text-white">
                    Best Booking Window
                  </p>
                  <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-0.5">
                    Book domestic flights 3-6 weeks in advance for the best prices.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-4 rounded-xl bg-gradient-to-r from-primary-50 to-transparent dark:from-primary-950/30 dark:to-transparent border border-primary-200/50 dark:border-primary-800/30">
                <div className="w-9 h-9 rounded-lg bg-primary-100 dark:bg-primary-950 flex items-center justify-center flex-shrink-0">
                  <TrendingDown className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-secondary-900 dark:text-white">
                    Price Drop Alerts
                  </p>
                  <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-0.5">
                    Save your favorite routes to get notified when prices drop.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-4 rounded-xl bg-gradient-to-r from-success-50 to-transparent dark:from-success-950/30 dark:to-transparent border border-success-200/50 dark:border-success-800/30">
                <div className="w-9 h-9 rounded-lg bg-success-100 dark:bg-success-950 flex items-center justify-center flex-shrink-0">
                  <Target className="h-5 w-5 text-success-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-secondary-900 dark:text-white">
                    High Confidence Predictions
                  </p>
                  <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-0.5">
                    Predictions with &gt;85% confidence are most reliable for planning.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
