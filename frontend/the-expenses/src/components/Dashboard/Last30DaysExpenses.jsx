import React, { useState, useEffect } from 'react';
import CustomBarChart from '../Charts/CustomBarChart';
import { prepareExpenseBarChartData } from '../../utils/helper';

const Last30DaysExpenses = ({ data }) => {
  const [chartData, setChartData] = useState([]);
  
  useEffect(() => {
    try {
      // Check if data exists and has transactions
      console.log("Last30DaysExpenses received data:", data);
      
      const transactions = data?.transactions || [];
      if (Array.isArray(transactions) && transactions.length > 0) {
        console.log("Processing expense data for bar chart:", transactions.length);
        
        // Group expenses by category
        const groupedData = {};
        
        transactions.forEach(transaction => {
          const category = transaction.category || "Other";
          
          if (!groupedData[category]) {
            groupedData[category] = 0;
          }
          groupedData[category] += Number(transaction.amount) || 0;
        });
        
        // Format data for bar chart
        const formattedData = Object.keys(groupedData).map(category => ({
          name: category,
          amount: groupedData[category]
        }));
        
        console.log("Prepared bar chart data:", formattedData);
        setChartData(formattedData);
      } else {
        console.log("No expense data available for chart");
        setChartData([]);
      }
    } catch (error) {
      console.error("Error preparing chart data:", error);
      setChartData([]);
    }
  }, [data]);
  
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Last 30 Days Expenses</h5>
      </div>
      {chartData && chartData.length > 0 ? (
        <CustomBarChart data={chartData} />
      ) : (
        <div className="flex justify-center items-center h-64 text-gray-400">
          No chart data available
        </div>
      )}
    </div>
  );
};

export default Last30DaysExpenses;