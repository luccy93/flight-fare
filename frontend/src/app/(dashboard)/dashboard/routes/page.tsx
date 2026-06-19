"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Route,
  Plus,
  Trash2,
  MapPin,
  Building2,
  Calendar,
  Plane,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useRoutes } from "@/hooks/useRoutes";
import { toast } from "sonner";

const airlines = [
  { value: "IndiGo", label: "IndiGo" },
  { value: "Air India", label: "Air India" },
  { value: "SpiceJet", label: "SpiceJet" },
  { value: "Vistara", label: "Vistara" },
  { value: "GoAir", label: "GoAir" },
  { value: "AirAsia", label: "AirAsia" },
  { value: "Akasa Air", label: "Akasa Air" },
  { value: "any", label: "Any Airline" },
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

const routeSchema = z
  .object({
    source: z.string().min(1, "Source is required"),
    destination: z.string().min(1, "Destination is required"),
    airline: z.string().min(1, "Airline is required"),
  })
  .refine((data) => data.source !== data.destination, {
    message: "Source and destination must be different",
    path: ["destination"],
  });

type RouteFormData = z.infer<typeof routeSchema>;

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4 },
  }),
};

export default function RoutesPage() {
  const [showForm, setShowForm] = useState(false);
  const { routes, isLoading, createRoute, deleteRoute, isCreating } =
    useRoutes();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RouteFormData>({
    resolver: zodResolver(routeSchema),
    defaultValues: {
      source: "",
      destination: "",
      airline: "",
    },
  });

  const onSubmit = async (data: RouteFormData) => {
    try {
      await createRoute.mutateAsync(data);
      toast.success("Route saved successfully");
      setShowForm(false);
      reset();
    } catch {
      toast.error("Failed to save route");
    }
  };

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
            Saved Routes
          </h1>
          <p className="text-secondary-500 dark:text-secondary-400 mt-1">
            Manage your frequently traveled routes
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-5 w-5" />
          {showForm ? "Cancel" : "Save New Route"}
        </Button>
      </motion.div>

      <motion.div
        initial={false}
        animate={{
          height: showForm ? "auto" : 0,
          opacity: showForm ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Plus className="h-5 w-5 text-primary-600 mr-2" />
              New Route
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="source">
                    <MapPin className="h-4 w-4 inline mr-1.5 text-primary-600" />
                    Source
                  </Label>
                  <Select
                    id="source"
                    placeholder="Select source"
                    options={cities}
                    error={errors.source?.message}
                    {...register("source")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="destination">
                    <MapPin className="h-4 w-4 inline mr-1.5 text-danger-600" />
                    Destination
                  </Label>
                  <Select
                    id="destination"
                    placeholder="Select destination"
                    options={cities}
                    error={errors.destination?.message}
                    {...register("destination")}
                  />
                </div>
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
              </div>
              <div className="flex justify-end">
                <Button type="submit" isLoading={isCreating}>
                  <Plus className="mr-2 h-4 w-4" />
                  Save Route
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-40 rounded-xl bg-secondary-100 dark:bg-secondary-800 animate-pulse"
            />
          ))}
        </div>
      ) : routes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {routes.map(
            (
              route: {
                id: number;
                source: string;
                destination: string;
                airline: string;
                created_at: string;
              },
              idx: number
            ) => (
              <motion.div
                key={route.id}
                custom={idx}
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
              >
                <Card className="hover-lift h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg">
                        <Route className="h-6 w-6 text-white" />
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          deleteRoute.mutate(route.id);
                        }}
                        className="text-danger-600 hover:text-danger-700 hover:bg-danger-50 dark:hover:bg-danger-950/50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-1">
                      {route.source} → {route.destination}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-secondary-500 mb-3">
                      <Building2 className="h-3.5 w-3.5" />
                      <span>{route.airline}</span>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-secondary-200 dark:border-secondary-700">
                      <div className="flex items-center text-xs text-secondary-400">
                        <Calendar className="h-3.5 w-3.5 mr-1" />
                        {new Date(route.created_at).toLocaleDateString()}
                      </div>
                      <Badge variant="secondary" className="text-[10px]">
                        Active
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          )}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="w-20 h-20 rounded-full bg-secondary-100 dark:bg-secondary-800 flex items-center justify-center mx-auto mb-6">
            <Route className="h-10 w-10 text-secondary-400" />
          </div>
          <h3 className="text-xl font-semibold text-secondary-900 dark:text-white mb-2">
            No saved routes
          </h3>
          <p className="text-secondary-500 dark:text-secondary-400 mb-6 max-w-md mx-auto">
            Save your frequently traveled routes to get quick access to price
            predictions and alerts.
          </p>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-5 w-5" />
            Save Your First Route
          </Button>
        </div>
      )}
    </div>
  );
}
