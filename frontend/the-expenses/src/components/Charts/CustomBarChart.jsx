import React from 'react';
import {
  BarChart,
  Bar,
  Cell, 
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const CustomBarChart = ({ data }) => {
  // Safety check for data
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-400">
        No chart data available
      </div>
    );
  }

  // Function to get the color of the bar based on the index
  const getBarColor = (index) => {
    // More eye-pleasing, professional color palette
    const colors = [
      "#3b82f6", // Medium blue
      "#10b981", // Emerald green
      "#8b5cf6", // Medium purple
      "#f97316", // Medium orange
      "#0ea5e9", // Sky blue
      "#14b8a6"  // Teal
    ];
    
    return colors[index % colors.length];
  };

  // Define CustomTooltip component here
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white shadow-md rounded-lg p-2 border border-gray-300">
          <p className="text-xs font-semibold text-green-800 mb-1">
            {payload[0].payload.month}
          </p>
          <p className="text-sm text-gray-600">
            Amount: <span className="text-sm font-medium text-gray-900">
              Rs {payload[0].value}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white mt-6">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" /> {/* Lighter grid */}
          <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#374151" }} stroke="none" />
          <YAxis tick={{ fontSize: 12, fill: "#374151" }} stroke="none" />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="amount" 
            fill="#8884d8" 
            radius={[10, 10, 0, 0]} 
            animationDuration={1200}
            animationEasing="ease-out"
            activeDot={{ r: 6, fill: "#fde047" }} 
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={getBarColor(index)} 
                strokeWidth={0}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomBarChart;