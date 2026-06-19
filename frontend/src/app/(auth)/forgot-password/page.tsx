"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plane, Mail, ArrowLeft, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/lib/api";
import { toast } from "sonner";

const forgotSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotFormData = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotFormData>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (data: ForgotFormData) => {
    setIsLoading(true);
    try {
      await api.post("/api/auth/forgot-password/", { email: data.email });
      setIsSent(true);
      toast.success("Password reset link sent to your email.");
    } catch {
      toast.error("Failed to send reset email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-secondary-50 to-white dark:from-secondary-900 dark:to-secondary-950">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-8 group">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 shadow-lg shadow-primary-500/20 group-hover:shadow-primary-500/30 transition-all duration-300">
              <Plane className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text">FlightFare</span>
          </Link>
          <h1 className="text-3xl font-bold text-secondary-900 dark:text-white">
            Forgot password?
          </h1>
          <p className="mt-2 text-secondary-500 dark:text-secondary-400">
            {isSent
              ? "Check your email for a reset link"
              : "No worries, we'll send you reset instructions"}
          </p>
        </div>

        <div className="glass-card-strong rounded-2xl p-8">
          {isSent ? (
            <div className="text-center py-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.6 }}
              >
                <div className="w-16 h-16 rounded-2xl bg-success-100 dark:bg-success-950 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="h-8 w-8 text-success-600" />
                </div>
              </motion.div>
              <p className="text-secondary-600 dark:text-secondary-400 mb-6">
                We&apos;ve sent a password reset link to your email. Please check
                your inbox and follow the instructions.
              </p>
              <Link href="/login">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Login
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary-400 pointer-events-none" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="pl-11"
                    {...register("email")}
                    error={errors.email?.message}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
                Send Reset Link
                <Send className="ml-2 h-4 w-4" />
              </Button>

              <Link
                href="/login"
                className="flex items-center justify-center text-sm text-primary-600 hover:text-primary-500 font-medium transition-colors"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Login
              </Link>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
