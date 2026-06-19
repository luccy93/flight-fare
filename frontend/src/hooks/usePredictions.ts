"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api, { API_ENDPOINTS } from "@/lib/api";

interface PredictionInput {
  airline: string;
  source: string;
  destination: string;
  departure_date: string;
  departure_time: string;
  arrival_time: string;
  total_stops: string | number;
  cabin_class: string;
}

interface PredictionResult {
  id: number;
  predicted_price: number;
  confidence_score: number;
  price_category: string;
  recommendation: string;
  cheapest_booking_window: string;
  created_at: string;
  airline: string;
  source: string;
  destination: string;
  departure_date: string;
  total_stops: string | number;
  cabin_class: string;
}

export function usePredictions() {
  const queryClient = useQueryClient();

  const getPredictionHistory = useQuery({
    queryKey: ["predictions", "history"],
    queryFn: async () => {
      const response = await api.get(API_ENDPOINTS.PREDICTIONS.HISTORY);
      return (response.data.predictions || []) as PredictionResult[];
    },
  });

  const getPredictionDetail = (id: number) =>
    useQuery({
      queryKey: ["predictions", id],
      queryFn: async () => {
        const response = await api.get(API_ENDPOINTS.PREDICTIONS.DETAIL(id));
        return response.data as PredictionResult;
      },
      enabled: !!id,
    });

  const createPrediction = useMutation({
    mutationFn: async (data: PredictionInput) => {
      const response = await api.post(API_ENDPOINTS.PREDICTIONS.CREATE, data);
      return response.data as PredictionResult;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["predictions", "history"] });
    },
  });

  return {
    getPredictionHistory,
    getPredictionDetail,
    createPrediction,
    isCreating: createPrediction.isPending,
    createError: createPrediction.error,
    predictionResult: createPrediction.data,
  };
}

export function useCreatePrediction() {
  const { createPrediction, isCreating, createError, predictionResult } =
    usePredictions();
  return { createPrediction, isCreating, createError, predictionResult };
}
