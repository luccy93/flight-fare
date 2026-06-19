import React from "react";
import Link from "next/link";
import { Plane, Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";

const footerLinks = {
  company: [
    { href: "/about", label: "About Us" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
    { href: "/faq", label: "FAQ" },
  ],
  product: [
    { href: "/dashboard/predict", label: "Price Prediction" },
    { href: "/dashboard/history", label: "Price History" },
    { href: "/dashboard/routes", label: "Saved Routes" },
    { href: "/dashboard", label: "Dashboard" },
  ],
  legal: [
    { href: "/terms", label: "Terms of Service" },
    { href: "/privacy", label: "Privacy Policy" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-secondary-900 to-secondary-950 border-t border-secondary-800/50">
      <div className="container-custom px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4 group">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 shadow-lg shadow-primary-500/20">
                <Plane className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">FlightFare</span>
            </Link>
            <p className="text-secondary-400 text-sm mb-6 max-w-sm leading-relaxed">
              AI-powered flight fare predictions that help you save money on every trip.
              Our machine learning models analyze millions of data points to predict
              the best time to book your flights.
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-secondary-400">
                <div className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center">
                  <Mail className="h-4 w-4 text-primary-500" />
                </div>
                <span className="text-sm">support@flightfare.com</span>
              </div>
              <div className="flex items-center space-x-3 text-secondary-400">
                <div className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center">
                  <Phone className="h-4 w-4 text-primary-500" />
                </div>
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3 text-secondary-400">
                <div className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-primary-500" />
                </div>
                <span className="text-sm">San Francisco, CA 94105</span>
              </div>
            </div>
          </div>

          {Object.entries(footerLinks).map(([key, links]) => (
            <div key={key}>
              <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-secondary-400 hover:text-primary-400 text-sm transition-colors inline-flex items-center group/link"
                    >
                      {link.label}
                      <ArrowUpRight className="h-3 w-3 ml-1 opacity-0 group-hover/link:opacity-100 transition-all -translate-y-0.5 group-hover/link:translate-y-0" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-secondary-800/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-secondary-500 text-sm">
            &copy; {new Date().getFullYear()} FlightFare. All rights reserved.
          </p>
          <div className="flex items-center space-x-6">
            <Link
              href="/terms"
              className="text-secondary-500 hover:text-secondary-400 text-xs transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="text-secondary-500 hover:text-secondary-400 text-xs transition-colors"
            >
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
