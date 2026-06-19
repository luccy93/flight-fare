"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const data = [
  { month: "Jan", avgFare: 5200, predictedFare: 5100 },
  { month: "Feb", avgFare: 4800, predictedFare: 4700 },
  { month: "Mar", avgFare: 5500, predictedFare: 5400 },
  { month: "Apr", avgFare: 6200, predictedFare: 6000 },
  { month: "May", avgFare: 6800, predictedFare: 6500 },
  { month: "Jun", avgFare: 7500, predictedFare: 7200 },
  { month: "Jul", avgFare: 8200, predictedFare: 7800 },
  { month: "Aug", avgFare: 7900, predictedFare: 7600 },
  { month: "Sep", avgFare: 6500, predictedFare: 6300 },
  { month: "Oct", avgFare: 5800, predictedFare: 5600 },
  { month: "Nov", avgFare: 5400, predictedFare: 5200 },
  { month: "Dec", avgFare: 7200, predictedFare: 6900 },
];

interface FareTrendChartProps {
  height?: number;
}

export default function FareTrendChart({ height = 300 }: FareTrendChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
          tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
          }}
          formatter={(value: number) => [`₹${value.toLocaleString()}`, undefined]}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="avgFare"
          stroke="#94a3b8"
          strokeWidth={2}
          dot={false}
          name="Average Fare"
        />
        <Line
          type="monotone"
          dataKey="predictedFare"
          stroke="#2563eb"
          strokeWidth={3}
          dot={{ fill: "#2563eb", strokeWidth: 2 }}
          name="Predicted Fare"
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
