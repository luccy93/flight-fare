"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const data = [
  { month: "Jan", bookings: 1200, avgPrice: 5200 },
  { month: "Feb", bookings: 980, avgPrice: 4800 },
  { month: "Mar", bookings: 1500, avgPrice: 5500 },
  { month: "Apr", bookings: 1800, avgPrice: 6200 },
  { month: "May", bookings: 2100, avgPrice: 6800 },
  { month: "Jun", bookings: 2500, avgPrice: 7500 },
  { month: "Jul", bookings: 2800, avgPrice: 8200 },
  { month: "Aug", bookings: 2600, avgPrice: 7900 },
  { month: "Sep", bookings: 1900, avgPrice: 6500 },
  { month: "Oct", bookings: 1600, avgPrice: 5800 },
  { month: "Nov", bookings: 1300, avgPrice: 5400 },
  { month: "Dec", bookings: 2400, avgPrice: 7200 },
];

interface MonthlyTrendChartProps {
  height?: number;
}

export default function MonthlyTrendChart({ height = 300 }: MonthlyTrendChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis
          dataKey="month"
          stroke="#94a3b8"
          fontSize={12}
          tickLine={false}
        />
        <YAxis
          stroke="#94a3b8"
          fontSize={12}
          tickLine={false}
          yAxisId="left"
          tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
        />
        <YAxis
          stroke="#94a3b8"
          fontSize={12}
          tickLine={false}
          yAxisId="right"
          orientation="right"
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
          }}
        />
        <Legend />
        <Area
          yAxisId="left"
          type="monotone"
          dataKey="avgPrice"
          stroke="#2563eb"
          fill="#2563eb"
          fillOpacity={0.1}
          strokeWidth={2}
          name="Average Price (₹)"
        />
        <Area
          yAxisId="right"
          type="monotone"
          dataKey="bookings"
          stroke="#06b6d4"
          fill="#06b6d4"
          fillOpacity={0.1}
          strokeWidth={2}
          name="Total Bookings"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
