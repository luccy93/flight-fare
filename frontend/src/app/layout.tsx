import type { Metadata } from "next";
import { Providers } from "@/components/layout/Providers";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Sidebar from "@/components/layout/Sidebar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Flight Fare Predictor - AI-Powered Flight Price Predictions",
  description:
    "Predict flight fares with AI-powered machine learning. Save up to 40% on your flight bookings with accurate price predictions and smart recommendations.",
  keywords: [
    "flight fare prediction",
    "airline prices",
    "cheap flights",
    "AI predictions",
    "flight price estimator",
  ],
  openGraph: {
    title: "Flight Fare Predictor - AI-Powered Flight Price Predictions",
    description:
      "Predict flight fares with AI-powered machine learning. Save up to 40% on your flight bookings.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-white dark:bg-secondary-900 font-sans antialiased scrollbar-thin">
        <Providers>
          <Header />
          <Sidebar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
