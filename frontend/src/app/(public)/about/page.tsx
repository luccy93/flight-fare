"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Plane,
  Brain,
  Users,
  Target,
  Shield,
  TrendingDown,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const teamMembers = [
  {
    name: "Arjun Mehta",
    role: "CEO & Co-Founder",
    bio: "Former data scientist with 10+ years in travel tech. Passionate about making travel affordable.",
    initials: "AM",
  },
  {
    name: "Sonia Kapoor",
    role: "CTO & Co-Founder",
    bio: "AI/ML expert who built prediction models for Fortune 500 companies. PhD in Machine Learning.",
    initials: "SK",
  },
  {
    name: "Vikram Singh",
    role: "Head of Data Science",
    bio: "Specializes in time series forecasting and predictive analytics. Published 20+ research papers.",
    initials: "VS",
  },
  {
    name: "Priya Patel",
    role: "VP of Product",
    bio: "Product leader who has launched 5 successful SaaS products. Focused on user experience.",
    initials: "PP",
  },
];

const values = [
  {
    icon: Target,
    title: "Accuracy First",
    description: "We obsess over prediction accuracy, constantly refining our models.",
  },
  {
    icon: Users,
    title: "User-Centric",
    description: "Every feature we build starts with understanding traveler needs.",
  },
  {
    icon: Shield,
    title: "Transparent",
    description: "We show confidence scores and explain our predictions clearly.",
  },
  {
    icon: TrendingDown,
    title: "Savings Driven",
    description: "Our sole mission is helping you save money on flights.",
  },
];

export default function AboutPage() {
  return (
    <div className="overflow-hidden">
      <section className="relative py-24 bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-secondary-900 dark:via-secondary-900 dark:to-primary-950">
        <div className="container-custom px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300 mb-6">
              About Us
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-secondary-900 dark:text-white mb-6">
              Making Flight Booking{" "}
              <span className="gradient-text">Smarter</span>
            </h1>
            <p className="text-lg text-secondary-600 dark:text-secondary-400 leading-relaxed">
              FlightFare was founded with a simple mission: help travelers save
              money by predicting when flight prices will be lowest. Our AI-powered
              platform analyzes millions of data points to provide accurate fare
              predictions, empowering you to book with confidence.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-secondary-900 dark:text-white mb-6">
                Our{" "}
                <span className="gradient-text">Mission</span>
              </h2>
              <p className="text-secondary-600 dark:text-secondary-400 mb-6 leading-relaxed">
                Every year, travelers overpay billions on flight tickets simply
                because they don&apos;t know when to book. We&apos;re changing that
                by bringing the power of AI and machine learning to everyday
                travel planning.
              </p>
              <p className="text-secondary-600 dark:text-secondary-400 mb-8 leading-relaxed">
                Our platform processes over 100,000 flight data points daily,
                analyzing historical pricing patterns, seasonal trends, and market
                dynamics to predict future fares with unprecedented accuracy.
              </p>
              <Link href="/register">
                <Button size="lg">
                  Join Our Mission
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              {values.map((value) => (
                <Card key={value.title} className="hover-lift">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-950 flex items-center justify-center mx-auto mb-3">
                      <value.icon className="h-6 w-6 text-primary-600" />
                    </div>
                    <h3 className="font-semibold text-secondary-900 dark:text-white mb-2">
                      {value.title}
                    </h3>
                    <p className="text-xs text-secondary-500">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-secondary-50 dark:bg-secondary-800/50">
        <div className="container-custom px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-secondary-900 dark:text-white mb-4">
              Meet Our{" "}
              <span className="gradient-text">Team</span>
            </h2>
            <p className="text-lg text-secondary-600 dark:text-secondary-400 max-w-2xl mx-auto">
              We&apos;re a diverse team of engineers, data scientists, and travel
              enthusiasts on a mission.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="text-center hover-lift">
                  <CardContent className="p-6">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <span className="text-2xl font-bold text-white">
                        {member.initials}
                      </span>
                    </div>
                    <h3 className="font-semibold text-secondary-900 dark:text-white mb-1">
                      {member.name}
                    </h3>
                    <p className="text-sm text-primary-600 mb-3">{member.role}</p>
                    <p className="text-sm text-secondary-500">{member.bio}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 to-accent-600 p-12 text-center"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Want to Know More?
            </h2>
            <p className="text-primary-100 mb-8 max-w-lg mx-auto">
              Have questions about our technology, team, or predictions?
              We&apos;d love to hear from you.
            </p>
            <Link href="/contact">
              <Button
                size="lg"
                className="bg-white text-primary-700 hover:bg-primary-50"
              >
                Contact Us
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
