"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plane, Mail, Lock, Eye, EyeOff, ArrowRight, TrendingUp, Users, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const floatingIcons = [
  { icon: TrendingUp, delay: 0, top: "15%", left: "10%" },
  { icon: Users, delay: 0.5, top: "70%", left: "85%" },
  { icon: Award, delay: 1, top: "80%", left: "15%" },
];

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      toast.success("Welcome back! Login successful.");
      router.push("/dashboard");
    } catch {
      toast.error("Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-secondary-50 to-white dark:from-secondary-900 dark:to-secondary-950">
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
              Welcome back
            </h1>
            <p className="mt-2 text-secondary-500 dark:text-secondary-400">
              Sign in to your account to continue
            </p>
          </div>

          <div className="glass-card-strong rounded-2xl p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
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

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary-400 pointer-events-none" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="pl-11 pr-11"
                    {...register("password")}
                    error={errors.password?.message}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    className="rounded border-secondary-300 dark:border-secondary-600 text-primary-600 focus:ring-primary-500/30 h-4 w-4"
                  />
                  <span className="text-sm text-secondary-600 dark:text-secondary-400">
                    Remember me
                  </span>
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-primary-600 hover:text-primary-500 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
                Sign In
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </form>
          </div>

          <p className="text-center mt-6 text-sm text-secondary-500 dark:text-secondary-400">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-primary-600 hover:text-primary-500 transition-colors"
            >
              Create one
            </Link>
          </p>
        </motion.div>
      </div>

      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white/10 rounded-full filter blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white/5 rounded-full filter blur-3xl animate-pulse" style={{ animationDuration: '6s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent-500/10 rounded-full filter blur-3xl" />
        </div>
        {floatingIcons.map((item) => (
          <motion.div
            key={item.left}
            className="absolute z-10"
            style={{ top: item.top, left: item.left }}
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, delay: item.delay, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
              <item.icon className="h-7 w-7 text-white/80" />
            </div>
          </motion.div>
        ))}
        <div className="relative z-10 text-center max-w-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-20 h-20 rounded-3xl bg-white/15 backdrop-blur-sm flex items-center justify-center mx-auto mb-8 border border-white/20">
              <Plane className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">
              Smart Flight Predictions
            </h2>
            <p className="text-primary-100 text-lg leading-relaxed">
              Join thousands of travelers saving money with AI-powered fare predictions.
              Know the best time to book and never overpay again.
            </p>
          </motion.div>
          <div className="mt-10 grid grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10"
            >
              <div className="text-3xl font-bold text-white">95%</div>
              <div className="text-primary-200 text-sm mt-1">Accuracy Rate</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10"
            >
              <div className="text-3xl font-bold text-white">50K+</div>
              <div className="text-primary-200 text-sm mt-1">Happy Users</div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
