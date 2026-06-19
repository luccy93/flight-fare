"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Plane,
  Brain,
  TrendingDown,
  Route,
  Users,
  Star,
  Shield,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  Zap,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

const features = [
  {
    icon: Brain,
    title: "AI Predictions",
    description:
      "Our advanced machine learning models analyze historical data, seasonality, and market trends to predict flight fares with 95% accuracy.",
    color: "from-primary-500 to-primary-600",
  },
  {
    icon: TrendingDown,
    title: "Price History",
    description:
      "Track fare trends over time with detailed charts and analytics. Know when prices are at their lowest and book at the perfect moment.",
    color: "from-accent-500 to-accent-600",
  },
  {
    icon: Route,
    title: "Save Routes",
    description:
      "Save your favorite routes and get instant alerts when prices drop. Never miss a deal on your most traveled routes.",
    color: "from-success-500 to-success-600",
  },
];

const steps = [
  {
    number: "01",
    title: "Enter Your Trip Details",
    description:
      "Fill in your origin, destination, travel dates, and preferences. Our simple form makes it easy to get started.",
  },
  {
    number: "02",
    title: "AI Analyzes the Data",
    description:
      "Our machine learning engine processes millions of data points including historical fares, seasonality, and market trends.",
  },
  {
    number: "03",
    title: "Get Your Prediction",
    description:
      "Receive an accurate fare prediction, confidence score, and smart recommendations on when to book.",
  },
];

const stats = [
  { value: "100K+", label: "Predictions Made", icon: Zap },
  { value: "95%", label: "Accuracy Rate", icon: Brain },
  { value: "50K+", label: "Active Users", icon: Users },
  { value: "40%", label: "Avg. Savings", icon: TrendingDown },
];

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Frequent Traveler",
    content:
      "FlightFare has saved me thousands on my monthly work trips. The predictions are scarily accurate!",
    rating: 5,
  },
  {
    name: "Rahul Verma",
    role: "Travel Blogger",
    content:
      "I recommend FlightFare to all my followers. The AI predictions are a game-changer for budget travel.",
    rating: 5,
  },
  {
    name: "Ananya Patel",
    role: "Business Executive",
    content:
      "The route saving feature is brilliant. I get alerts when prices drop for my frequently traveled routes.",
    rating: 5,
  },
];

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      <section className="relative min-h-[90vh] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-secondary-900 dark:via-secondary-900 dark:to-primary-950" />
        <div className="absolute inset-0 opacity-30 dark:opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-300 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
          <div className="absolute top-40 right-10 w-96 h-96 bg-accent-300 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000" />
          <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-2000" />
        </div>

        <div className="container-custom px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300 mb-6">
                <Zap className="h-4 w-4 mr-1" />
                AI-Powered Flight Predictions
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-secondary-900 dark:text-white leading-tight mb-6">
                Know the Best Time to{" "}
                <span className="gradient-text">Book Your Flight</span>
              </h1>
              <p className="text-lg text-secondary-600 dark:text-secondary-400 mb-8 max-w-xl leading-relaxed">
                Stop overpaying for flights. Our AI analyzes millions of data points
                to predict fare trends with 95% accuracy, helping you book at the
                perfect time.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register">
                  <Button size="lg" className="w-full sm:w-auto">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/dashboard/predict">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Try a Prediction
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-6 mt-8 text-sm text-secondary-500">
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4 text-success-500" />
                  No credit card
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4 text-success-500" />
                  Free predictions
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4 text-success-500" />
                  Cancel anytime
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden lg:block"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary-600 to-accent-500 rounded-3xl opacity-10 blur-2xl" />
                <Card className="relative bg-white/80 dark:bg-secondary-800/80 backdrop-blur-xl border-white/20 dark:border-secondary-700/30 shadow-2xl">
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-2">
                        <Plane className="h-5 w-5 text-primary-600" />
                        <span className="font-semibold text-secondary-900 dark:text-white">
                          Live Prediction
                        </span>
                      </div>
                      <span className="text-xs text-primary-600 bg-primary-100 dark:bg-primary-950 px-2 py-1 rounded-full font-medium">
                        AI Powered
                      </span>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center pb-4 border-b border-secondary-200 dark:border-secondary-700">
                        <span className="text-secondary-600 dark:text-secondary-400">Delhi → Mumbai</span>
                        <span className="text-secondary-600 dark:text-secondary-400">30 Jun 2024</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-secondary-600 dark:text-secondary-400">Predicted Fare</span>
                        <span className="text-3xl font-bold text-primary-600">₹5,245</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-secondary-600 dark:text-secondary-400">Confidence</span>
                        <span className="text-success-600 font-semibold">94.7%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-secondary-600 dark:text-secondary-400">Best Time to Book</span>
                        <span className="font-medium text-secondary-900 dark:text-white">Within 7 days</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-secondary-50 dark:bg-secondary-800/50">
        <div className="container-custom">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-secondary-900 dark:text-white mb-4">
              Why Choose{" "}
              <span className="gradient-text">FlightFare</span>
            </h2>
            <p className="text-lg text-secondary-600 dark:text-secondary-400 max-w-2xl mx-auto">
              Our AI-powered platform gives you everything you need to make
              informed flight booking decisions.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
              >
                <Card className="h-full hover-lift">
                  <CardContent className="p-8">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg`}
                    >
                      <feature.icon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-secondary-900 dark:text-white">
                      {feature.title}
                    </h3>
                    <p className="text-secondary-600 dark:text-secondary-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-secondary-900 dark:text-white mb-4">
              How It{" "}
              <span className="gradient-text">Works</span>
            </h2>
            <p className="text-lg text-secondary-600 dark:text-secondary-400 max-w-2xl mx-auto">
              Get accurate flight fare predictions in three simple steps.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500" />
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                className="relative text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-500 flex items-center justify-center mx-auto mb-6 shadow-lg relative z-10">
                  <span className="text-2xl font-bold text-white">
                    {step.number}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-secondary-900 dark:text-white">
                  {step.title}
                </h3>
                <p className="text-secondary-600 dark:text-secondary-400 leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-gradient-to-br from-primary-600 to-primary-800 dark:from-primary-900 dark:to-primary-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full filter blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full filter blur-3xl" />
        </div>
        <div className="container-custom relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                custom={i}
                variants={fadeInUp}
                className="text-center"
              >
                <div className="flex justify-center mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                    <stat.icon className="h-7 w-7 text-white" />
                  </div>
                </div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-primary-200 text-sm font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-secondary-50 dark:bg-secondary-800/50">
        <div className="container-custom">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-secondary-900 dark:text-white mb-4">
              Trusted by Travelers{" "}
              <span className="gradient-text">Worldwide</span>
            </h2>
            <p className="text-lg text-secondary-600 dark:text-secondary-400 max-w-2xl mx-auto">
              See what our users have to say about their experience with FlightFare.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={testimonial.name}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
              >
                <Card className="h-full hover-lift">
                  <CardContent className="p-8">
                    <div className="flex mb-4">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star
                          key={i}
                          className="h-5 w-5 text-warning-500 fill-warning-500"
                        />
                      ))}
                    </div>
                    <p className="text-secondary-600 dark:text-secondary-400 mb-6 leading-relaxed italic">
                      &ldquo;{testimonial.content}&rdquo;
                    </p>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-semibold text-sm">
                        {testimonial.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <p className="font-medium text-secondary-900 dark:text-white text-sm">
                          {testimonial.name}
                        </p>
                        <p className="text-xs text-secondary-500">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600 p-8 md:p-16 text-center"
          >
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full filter blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full filter blur-3xl" />
            </div>
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to Save on Your Next Flight?
              </h2>
              <p className="text-primary-100 text-lg mb-8">
                Join 50,000+ smart travelers who never overpay for flights.
                Get started for free today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register">
                  <Button
                    size="lg"
                    className="bg-white text-primary-700 hover:bg-primary-50 w-full sm:w-auto"
                  >
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/about">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white/30 text-white hover:bg-white/10 w-full sm:w-auto"
                  >
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
