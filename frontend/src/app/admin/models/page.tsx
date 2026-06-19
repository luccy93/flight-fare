"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Brain,
  RefreshCw,
  CheckCircle2,
  XCircle,
  BarChart3,
  TrendingUp,
  Zap,
  Clock,
  Activity,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAdmin } from "@/hooks/useAdmin";
import { toast } from "sonner";

interface Model {
  id: number;
  name: string;
  version: string;
  accuracy: number;
  is_active: boolean;
  created_at: string;
  last_trained: string;
  predictions_count: number;
}

const mockModels: Model[] = [
  {
    id: 1,
    name: "Random Forest Regressor",
    version: "2.4.1",
    accuracy: 94.7,
    is_active: true,
    created_at: "2024-01-15",
    last_trained: "2024-03-10",
    predictions_count: 45230,
  },
  {
    id: 2,
    name: "XGBoost Ensemble",
    version: "3.1.0",
    accuracy: 95.2,
    is_active: true,
    created_at: "2024-02-01",
    last_trained: "2024-03-12",
    predictions_count: 31200,
  },
  {
    id: 3,
    name: "Neural Network (LSTM)",
    version: "1.2.3",
    accuracy: 93.8,
    is_active: false,
    created_at: "2024-02-20",
    last_trained: "2024-03-08",
    predictions_count: 18900,
  },
  {
    id: 4,
    name: "Gradient Boosting",
    version: "1.8.0",
    accuracy: 92.4,
    is_active: false,
    created_at: "2024-01-28",
    last_trained: "2024-03-05",
    predictions_count: 27450,
  },
  {
    id: 5,
    name: "LightGBM Model",
    version: "2.0.1",
    accuracy: 94.1,
    is_active: false,
    created_at: "2024-03-01",
    last_trained: "2024-03-11",
    predictions_count: 12100,
  },
  {
    id: 6,
    name: "CatBoost Regressor",
    version: "1.5.2",
    accuracy: 93.5,
    is_active: false,
    created_at: "2024-03-05",
    last_trained: "2024-03-09",
    predictions_count: 8900,
  },
];

const performanceMetrics = [
  { label: "RMSE", value: "₹1,245", description: "Root Mean Squared Error" },
  { label: "MAE", value: "₹987", description: "Mean Absolute Error" },
  { label: "R² Score", value: "0.947", description: "Coefficient of Determination" },
  { label: "MAPE", value: "4.8%", description: "Mean Absolute Percentage Error" },
];

export default function AdminModelsPage() {
  const { models: apiModels, isModelsLoading } = useAdmin();
  const [models, setModels] = useState<Model[]>(
    apiModels.length > 0 ? apiModels : mockModels
  );
  const [retraining, setRetraining] = useState(false);

  const activeModel = models.find((m) => m.is_active);

  const handleRetrain = () => {
    setRetraining(true);
    setTimeout(() => {
      setRetraining(false);
      setModels((prev) =>
        prev.map((m) =>
          m.is_active
            ? {
                ...m,
                last_trained: new Date().toISOString().split("T")[0],
                accuracy: Math.round((m.accuracy + Math.random() * 0.5) * 10) / 10,
              }
            : m
        )
      );
      toast.success("Model retraining completed successfully");
    }, 3000);
  };

  const handleToggleModel = (id: number) => {
    setModels((prev) =>
      prev.map((m) => ({ ...m, is_active: m.id === id }))
    );
    toast.success("Active model updated");
  };

  if (isModelsLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-secondary-200 dark:bg-secondary-700 rounded-lg" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-secondary-200 dark:bg-secondary-700 rounded-xl" />
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-56 bg-secondary-200 dark:bg-secondary-700 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">Model Management</h1>
          <p className="text-sm text-secondary-500 mt-1">
            {models.length} models &middot; {activeModel?.name || "No active model"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="success" className="flex items-center gap-1.5 px-3 py-1.5">
            <Activity className="h-3.5 w-3.5" />
            All Systems Operational
          </Badge>
          <Button onClick={handleRetrain} disabled={retraining}>
            <RefreshCw className={`mr-2 h-4 w-4 ${retraining ? "animate-spin" : ""}`} />
            {retraining ? "Retraining..." : "Retrain All"}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {performanceMetrics.map((metric) => (
          <Card key={metric.label}>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-950 flex items-center justify-center">
                  {metric.label === "RMSE" || metric.label === "MAE" ? (
                    <BarChart3 className="h-5 w-5 text-primary-600" />
                  ) : metric.label === "R² Score" ? (
                    <TrendingUp className="h-5 w-5 text-primary-600" />
                  ) : (
                    <Zap className="h-5 w-5 text-primary-600" />
                  )}
                </div>
              </div>
              <p className="text-sm text-secondary-500">{metric.label}</p>
              <p className="text-xl font-bold text-secondary-900 dark:text-white mt-1">{metric.value}</p>
              <p className="text-xs text-secondary-400 mt-1">{metric.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {models.map((model, i) => (
          <motion.div
            key={model.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card
              className={`relative overflow-hidden transition-all duration-300 ${
                model.is_active
                  ? "ring-2 ring-primary-500 shadow-lg"
                  : "hover:shadow-md"
              }`}
            >
              {model.is_active && (
                <div className="absolute top-0 right-0">
                  <div className="bg-primary-600 text-white text-xs font-medium px-3 py-1 rounded-bl-lg">
                    Active
                  </div>
                </div>
              )}
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      model.is_active
                        ? "bg-primary-100 dark:bg-primary-950"
                        : "bg-secondary-100 dark:bg-secondary-700"
                    }`}>
                      <Brain className={`h-5 w-5 ${
                        model.is_active
                          ? "text-primary-600"
                          : "text-secondary-500"
                      }`} />
                    </div>
                    <div>
                      <CardTitle className="text-base">{model.name}</CardTitle>
                      <p className="text-xs text-secondary-500">v{model.version}</p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-secondary-600 dark:text-secondary-400">Accuracy</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 rounded-full bg-secondary-200 dark:bg-secondary-700 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary-600"
                          style={{ width: `${model.accuracy}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-secondary-900 dark:text-white">
                        {model.accuracy}%
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-secondary-600 dark:text-secondary-400">Predictions</span>
                    <span className="font-medium text-secondary-900 dark:text-white">
                      {model.predictions_count.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-secondary-600 dark:text-secondary-400">Last Trained</span>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-secondary-400" />
                      <span className="text-secondary-900 dark:text-white">{model.last_trained}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-secondary-200 dark:border-secondary-700">
                  {model.is_active ? (
                    <div className="flex items-center gap-2 text-sm text-success-600">
                      <CheckCircle2 className="h-4 w-4" />
                      Serving predictions
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => handleToggleModel(model.id)}
                    >
                      <Zap className="mr-1.5 h-4 w-4" />
                      Set as Active
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
