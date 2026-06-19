"use client";

import React from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Phone, MapPin, Clock, Send, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(20, "Message must be at least 20 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

const contactInfo = [
  {
    icon: Mail,
    label: "Email Us",
    value: "support@flightfare.com",
    description: "We respond within 24 hours",
    gradient: "from-primary-500 to-primary-600",
  },
  {
    icon: Phone,
    label: "Call Us",
    value: "+1 (555) 123-4567",
    description: "Mon-Fri, 9 AM - 6 PM EST",
    gradient: "from-accent-500 to-accent-600",
  },
  {
    icon: MapPin,
    label: "Visit Us",
    value: "San Francisco, CA 94105",
    description: "Book an appointment first",
    gradient: "from-success-500 to-success-600",
  },
  {
    icon: Clock,
    label: "Working Hours",
    value: "Mon - Fri: 9 AM - 6 PM",
    description: "Weekend: By appointment",
    gradient: "from-warning-500 to-warning-600",
  },
];

export default function ContactPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async () => {
    toast.success("Message sent successfully! We'll get back to you soon.");
    reset();
  };

  return (
    <div className="overflow-hidden">
      <section className="relative py-24 bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-secondary-900 dark:via-secondary-900 dark:to-primary-950">
        <div className="container-custom px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300 mb-6">
              Contact Us
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-secondary-900 dark:text-white mb-6">
              Get in <span className="gradient-text">Touch</span>
            </h1>
            <p className="text-lg text-secondary-600 dark:text-secondary-400">
              Have a question, feedback, or need help? We&apos;re here for you.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-5 gap-12 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2 space-y-6"
            >
              <h2 className="text-2xl font-bold text-secondary-900 dark:text-white">
                Contact Information
              </h2>
              <p className="text-secondary-600 dark:text-secondary-400">
                Fill out the form and our team will get back to you within 24 hours.
              </p>
              {contactInfo.map((info) => (
                <motion.div
                  key={info.label}
                  whileHover={{ x: 3 }}
                  className="flex items-start space-x-4 p-4 rounded-xl hover:bg-secondary-50 dark:hover:bg-secondary-800/50 transition-colors"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${info.gradient} flex items-center justify-center flex-shrink-0 shadow-md`}>
                    <info.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-secondary-900 dark:text-white">
                      {info.label}
                    </h3>
                    <p className="text-secondary-600 dark:text-secondary-400 text-sm">
                      {info.value}
                    </p>
                    <p className="text-secondary-500 text-xs">{info.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-3"
            >
              <div className="glass-card-strong rounded-2xl p-8">
                <div className="flex items-center space-x-2 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                    <MessageSquare className="h-4 w-4 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-secondary-900 dark:text-white">
                    Send us a message
                  </h2>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="John Doe"
                        {...register("name")}
                        error={errors.name?.message}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        {...register("email")}
                        error={errors.email?.message}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      placeholder="How can we help?"
                      {...register("subject")}
                      error={errors.subject?.message}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us more about your inquiry..."
                      rows={5}
                      {...register("message")}
                      error={errors.message?.message}
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full">
                    <Send className="mr-2 h-4 w-4" />
                    Send Message
                  </Button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
