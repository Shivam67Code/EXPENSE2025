import React from 'react'
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const CustomLineChart = ({data}) => {
  // Safety check for data
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-400">
        No chart data available
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      try {
        return (
          <div className="bg-white shadow-md rounded-lg p-2 border border-gray-300">
            <p className='text-xs font-semibold text-green-800 mb-1'>
              {payload[0]?.payload?.category || "Category"}
            </p>
            <p className='text-sm text-gray-600'>
              Amount: <span className='text-sm font-medium text-gray-900'>
                Rs {payload[0]?.value || 0}
              </span>
            </p>
          </div>
        );
      } catch (error) {
        console.error("Error rendering tooltip:", error);
        return null;
      }
    }
    return null;
  };

  return (
    <div className='bg-white'>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="incomeGradient" x1="0%" y1="0%" x2="0%" y2="1">
              <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#4CAF50" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid stroke="none" />
          <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#555" }} stroke="none" />
          <YAxis tick={{ fontSize: 12, fill: "#555" }} stroke="none" />
          <Tooltip content={<CustomTooltip />} />

          <Area 
            type="monotone" 
            dataKey="amount" 
            stroke="#4CAF50" 
            fill="url(#incomeGradient)" 
            strokeWidth={3} 
            dot={{r: 3, fill: "#4CAF50"}} 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export default CustomLineChart