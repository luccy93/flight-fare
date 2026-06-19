"use client";

import { useQuery } from "@tanstack/react-query";
import api, { API_ENDPOINTS } from "@/lib/api";

interface AdminDashboard {
  total_users: number;
  total_predictions: number;
  active_models: number;
  avg_confidence: number;
  recent_predictions: number;
  accuracy_rate: number;
}

interface AdminUser {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  is_staff: boolean;
  date_joined: string;
  predictions_count: number;
}

interface ModelInfo {
  id: number;
  name: string;
  version: string;
  accuracy: number;
  is_active: boolean;
  created_at: string;
  last_trained: string;
  predictions_count: number;
}

interface AdminAnalytics {
  daily_predictions: { date: string; count: number }[];
  popular_routes: { source: string; destination: string; count: number }[];
  airline_distribution: { airline: string; count: number }[];
  price_distribution: { range: string; count: number }[];
  monthly_trend: { month: string; avg_price: number }[];
}

interface LogEntry {
  id: number;
  user: string;
  action: string;
  details: string;
  ip_address: string;
  created_at: string;
}

export function useAdmin() {
  const getDashboard = useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: async () => {
      const response = await api.get(API_ENDPOINTS.ADMIN.DASHBOARD);
      return response.data as AdminDashboard;
    },
  });

  const getUsers = useQuery({
    queryKey: ["admin", "users"],
    queryFn: async () => {
      const response = await api.get(API_ENDPOINTS.ADMIN.USERS);
      return response.data as AdminUser[];
    },
  });

  const getModels = useQuery({
    queryKey: ["admin", "models"],
    queryFn: async () => {
      const response = await api.get(API_ENDPOINTS.ADMIN.MODELS);
      return response.data as ModelInfo[];
    },
  });

  const getAnalytics = useQuery({
    queryKey: ["admin", "analytics"],
    queryFn: async () => {
      const response = await api.get(API_ENDPOINTS.ADMIN.ANALYTICS);
      return response.data as AdminAnalytics;
    },
  });

  const getLogs = useQuery({
    queryKey: ["admin", "logs"],
    queryFn: async () => {
      const response = await api.get(API_ENDPOINTS.ADMIN.LOGS);
      return response.data as LogEntry[];
    },
  });

  return {
    dashboard: getDashboard.data,
    isDashboardLoading: getDashboard.isLoading,
    users: getUsers.data || [],
    isUsersLoading: getUsers.isLoading,
    models: getModels.data || [],
    isModelsLoading: getModels.isLoading,
    analytics: getAnalytics.data,
    isAnalyticsLoading: getAnalytics.isLoading,
    logs: getLogs.data || [],
    isLogsLoading: getLogs.isLoading,
  };
}
