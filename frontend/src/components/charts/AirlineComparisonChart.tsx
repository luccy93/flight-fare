"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const data = [
  { airline: "IndiGo", avgFare: 4500, predictedFare: 4200 },
  { airline: "Air India", avgFare: 5800, predictedFare: 5500 },
  { airline: "SpiceJet", avgFare: 4200, predictedFare: 3900 },
  { airline: "Vistara", avgFare: 6200, predictedFare: 5900 },
  { airline: "GoAir", avgFare: 4000, predictedFare: 3800 },
  { airline: "AirAsia", avgFare: 3800, predictedFare: 3600 },
];

interface AirlineComparisonChartProps {
  height?: number;
}

export default function AirlineComparisonChart({ height = 300 }: AirlineComparisonChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis
          dataKey="airline"
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
        <Bar
          dataKey="avgFare"
          fill="#94a3b8"
          name="Average Fare"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="predictedFare"
          fill="#2563eb"
          name="Predicted Fare"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
