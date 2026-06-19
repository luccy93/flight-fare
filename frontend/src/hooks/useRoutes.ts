"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api, { API_ENDPOINTS } from "@/lib/api";

interface SavedRoute {
  id: number;
  source: string;
  destination: string;
  airline: string;
  created_at: string;
  is_active: boolean;
}

export function useRoutes() {
  const queryClient = useQueryClient();

  const getRoutes = useQuery({
    queryKey: ["routes"],
    queryFn: async () => {
      const response = await api.get(API_ENDPOINTS.ROUTES.LIST);
      return response.data as SavedRoute[];
    },
  });

  const createRoute = useMutation({
    mutationFn: async (data: Omit<SavedRoute, "id" | "created_at" | "is_active">) => {
      const response = await api.post(API_ENDPOINTS.ROUTES.CREATE, data);
      return response.data as SavedRoute;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routes"] });
    },
  });

  const deleteRoute = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(API_ENDPOINTS.ROUTES.DELETE(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routes"] });
    },
  });

  return {
    routes: getRoutes.data || [],
    isLoading: getRoutes.isLoading,
    error: getRoutes.error,
    createRoute,
    deleteRoute,
    isCreating: createRoute.isPending,
  };
}
