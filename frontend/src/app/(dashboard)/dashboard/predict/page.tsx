"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Plane,
  IndianRupee,
  Target,
  Tag,
  Lightbulb,
  Clock,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Calendar,
  Clock as ClockIcon,
  MapPin,
  Building2,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useCreatePrediction } from "@/hooks/usePredictions";

const airlines = [
  { value: "IndiGo", label: "IndiGo" },
  { value: "Air India", label: "Air India" },
  { value: "SpiceJet", label: "SpiceJet" },
  { value: "Vistara", label: "Vistara" },
  { value: "GoAir", label: "GoAir" },
  { value: "AirAsia", label: "AirAsia" },
  { value: "Akasa Air", label: "Akasa Air" },
];

const cities = [
  { value: "Delhi", label: "Delhi" },
  { value: "Mumbai", label: "Mumbai" },
  { value: "Bangalore", label: "Bangalore" },
  { value: "Hyderabad", label: "Hyderabad" },
  { value: "Chennai", label: "Chennai" },
  { value: "Kolkata", label: "Kolkata" },
  { value: "Pune", label: "Pune" },
  { value: "Ahmedabad", label: "Ahmedabad" },
  { value: "Jaipur", label: "Jaipur" },
  { value: "Goa", label: "Goa" },
  { value: "Cochin", label: "Cochin" },
  { value: "Chandigarh", label: "Chandigarh" },
];

const stopsOptions = [
  { value: "0", label: "Non-stop" },
  { value: "1", label: "1 Stop" },
  { value: "2", label: "2 Stops" },
  { value: "3", label: "3 Stops" },
  { value: "4", label: "4 Stops" },
];

const cabinClasses = [
  { value: "Economy", label: "Economy" },
  { value: "Business", label: "Business" },
  { value: "First", label: "First" },
  { value: "Premium Economy", label: "Premium Economy" },
];

const predictSchema = z
  .object({
    airline: z.string().min(1, "Airline is required"),
    source: z.string().min(1, "Source is required"),
    destination: z.string().min(1, "Destination is required"),
    departure_date: z.string().min(1, "Departure date is required"),
    departure_time: z.string().min(1, "Departure time is required"),
    arrival_time: z.string().min(1, "Arrival time is required"),
    total_stops: z.string().min(1, "Number of stops is required"),
    cabin_class: z.string().min(1, "Cabin class is required"),
  })
  .refine((data) => data.source !== data.destination, {
    message: "Source and destination must be different",
    path: ["destination"],
  });

type PredictFormData = z.infer<typeof predictSchema>;

const priceCategoryVariant = (category: string) => {
  switch (category?.toLowerCase()) {
    case "low":
      return "success" as const;
    case "medium":
      return "warning" as const;
    case "high":
      return "destructive" as const;
    default:
      return "secondary" as const;
  }
};

export default function PredictPage() {
  const [showResults, setShowResults] = useState(false);
  const { createPrediction, isCreating, predictionResult } =
    useCreatePrediction();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<PredictFormData>({
    resolver: zodResolver(predictSchema),
    defaultValues: {
      airline: "",
      source: "",
      destination: "",
      departure_date: "",
      departure_time: "",
      arrival_time: "",
      total_stops: "",
      cabin_class: "",
    },
  });

  const source = watch("source");
  const destination = watch("destination");

  const swapRoutes = () => {
    const src = source;
    const dest = destination;
    if (src) setValue("source", dest);
    if (dest) setValue("destination", src);
  };

  const onSubmit = async (data: PredictFormData) => {
    await createPrediction.mutateAsync(data);
    setShowResults(true);
  };

  const handleNewPrediction = () => {
    setShowResults(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-secondary-900 dark:text-white">
          Predict Flight Fare
        </h1>
        <p className="text-secondary-500 dark:text-secondary-400 mt-1">
          Enter your flight details to get an AI-powered price prediction
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        {!showResults ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sparkles className="h-5 w-5 text-primary-600 mr-2" />
                  Flight Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="airline">
                        <Building2 className="h-4 w-4 inline mr-1.5 text-primary-600" />
                        Airline
                      </Label>
                      <Select
                        id="airline"
                        placeholder="Select airline"
                        options={airlines}
                        error={errors.airline?.message}
                        {...register("airline")}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cabin_class">Cabin Class</Label>
                      <Select
                        id="cabin_class"
                        placeholder="Select cabin class"
                        options={cabinClasses}
                        error={errors.cabin_class?.message}
                        {...register("cabin_class")}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                    <div className="space-y-2">
                      <Label htmlFor="source">
                        <MapPin className="h-4 w-4 inline mr-1.5 text-primary-600" />
                        Source
                      </Label>
                      <Select
                        id="source"
                        placeholder="Select source city"
                        options={cities}
                        error={errors.source?.message}
                        {...register("source")}
                      />
                    </div>

                    <div className="flex items-center justify-center md:pt-6">
                      <button
                        type="button"
                        onClick={swapRoutes}
                        className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-950 flex items-center justify-center hover:bg-primary-200 dark:hover:bg-primary-900 transition-colors"
                        title="Swap routes"
                      >
                        <RefreshCw className="h-4 w-4 text-primary-600" />
                      </button>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="destination">
                        <MapPin className="h-4 w-4 inline mr-1.5 text-danger-600" />
                        Destination
                      </Label>
                      <Select
                        id="destination"
                        placeholder="Select destination city"
                        options={cities}
                        error={errors.destination?.message}
                        {...register("destination")}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="departure_date">
                        <Calendar className="h-4 w-4 inline mr-1.5 text-primary-600" />
                        Departure Date
                      </Label>
                      <Input
                        id="departure_date"
                        type="date"
                        error={errors.departure_date?.message}
                        {...register("departure_date")}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="total_stops">Total Stops</Label>
                      <Select
                        id="total_stops"
                        placeholder="Select stops"
                        options={stopsOptions}
                        error={errors.total_stops?.message}
                        {...register("total_stops")}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="departure_time">
                        <ClockIcon className="h-4 w-4 inline mr-1.5 text-primary-600" />
                        Departure Time
                      </Label>
                      <Input
                        id="departure_time"
                        type="time"
                        error={errors.departure_time?.message}
                        {...register("departure_time")}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="arrival_time">
                        <ClockIcon className="h-4 w-4 inline mr-1.5 text-primary-600" />
                        Arrival Time
                      </Label>
                      <Input
                        id="arrival_time"
                        type="time"
                        error={errors.arrival_time?.message}
                        {...register("arrival_time")}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button
                      type="submit"
                      size="lg"
                      isLoading={isCreating}
                      className="w-full md:w-auto"
                    >
                      {isCreating ? (
                        "Predicting..."
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-5 w-5" />
                          Predict Price
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-secondary-900 dark:text-white">
                Prediction Results
              </h2>
              <Button variant="outline" onClick={handleNewPrediction}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                New Prediction
              </Button>
            </div>

            {predictionResult && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1, duration: 0.4 }}
                  >
                    <Card className="bg-gradient-to-br from-primary-600 to-primary-700 border-0 text-white">
                      <CardContent className="p-6 text-center">
                        <div className="flex justify-center mb-3">
                          <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                            <IndianRupee className="h-7 w-7" />
                          </div>
                        </div>
                        <p className="text-sm text-primary-100 mb-1">
                          Predicted Price
                        </p>
                        <p className="text-4xl font-bold">
                          ₹
                          {predictionResult.predicted_price?.toLocaleString()}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                  >
                    <Card>
                      <CardContent className="p-6 text-center">
                        <div className="flex justify-center mb-3">
                          <div className="w-14 h-14 rounded-2xl bg-success-100 dark:bg-success-950 flex items-center justify-center">
                            <Target className="h-7 w-7 text-success-600" />
                          </div>
                        </div>
                        <p className="text-sm text-secondary-500 mb-1">
                          Confidence Score
                        </p>
                        <p className="text-3xl font-bold text-secondary-900 dark:text-white mb-3">
                          {(predictionResult.confidence_score * 100).toFixed(1)}%
                        </p>
                        <div className="w-full bg-secondary-200 dark:bg-secondary-700 rounded-full h-2.5">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{
                              width: `${(predictionResult.confidence_score * 100).toFixed(0)}%`,
                            }}
                            transition={{ delay: 0.6, duration: 0.8 }}
                            className={`h-2.5 rounded-full ${
                              predictionResult.confidence_score >= 0.85
                                ? "bg-success-500"
                                : predictionResult.confidence_score >= 0.7
                                  ? "bg-warning-500"
                                  : "bg-danger-500"
                            }`}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                  >
                    <Card>
                      <CardContent className="p-6 text-center">
                        <div className="flex justify-center mb-3">
                          <div className="w-14 h-14 rounded-2xl bg-warning-100 dark:bg-warning-950 flex items-center justify-center">
                            <Tag className="h-7 w-7 text-warning-600" />
                          </div>
                        </div>
                        <p className="text-sm text-secondary-500 mb-1">
                          Price Category
                        </p>
                        <Badge
                          variant={priceCategoryVariant(
                            predictionResult.price_category
                          )}
                          className="text-sm px-4 py-1.5 mt-2"
                        >
                          {predictionResult.price_category}
                        </Badge>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                  >
                    <Card>
                      <CardContent className="p-6 text-center">
                        <div className="flex justify-center mb-3">
                          <div className="w-14 h-14 rounded-2xl bg-accent-100 dark:bg-accent-950 flex items-center justify-center">
                            <Lightbulb className="h-7 w-7 text-accent-600" />
                          </div>
                        </div>
                        <p className="text-sm text-secondary-500 mb-1">
                          Recommendation
                        </p>
                        <p className="text-sm font-medium text-secondary-900 dark:text-white mt-2 leading-relaxed">
                          {predictionResult.recommendation}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-950 flex items-center justify-center flex-shrink-0">
                          <Clock className="h-6 w-6 text-primary-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-1">
                            Cheapest Booking Window
                          </h3>
                          <p className="text-secondary-600 dark:text-secondary-400">
                            {predictionResult.cheapest_booking_window ||
                              "Based on historical data, booking 3-6 weeks in advance typically yields the best prices for this route."}
                          </p>
                          <div className="mt-4 flex flex-wrap gap-2">
                            <Badge variant="secondary" className="text-xs">
                              {predictionResult.airline}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {predictionResult.source} →{" "}
                              {predictionResult.destination}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {predictionResult.cabin_class}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
