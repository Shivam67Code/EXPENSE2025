import React, { useState, useEffect } from "react";
import CustomPieChart from "../Charts/CustomPieChart";

const RecentIncomeWithChart = ({ data, totalIncome }) => {
  const [chartData, setChartData] = useState([]);
  const [calculatedTotal, setCalculatedTotal] = useState(0);

  useEffect(() => {
    try {
      console.log("RecentIncomeWithChart received data:", data);
      console.log("Total income value:", totalIncome);
      
      // Check if data exists and has transactions
      if (data && data.transactions && Array.isArray(data.transactions)) {
        console.log("Income transactions found:", data.transactions.length);
        
        // Calculate total from transactions
        const total = data.transactions.reduce((sum, transaction) => 
          sum + (Number(transaction.amount) || 0), 0);
        setCalculatedTotal(total);
        console.log("Calculated total from transactions:", total);
        
        // Process the transactions for the chart - group by title/source
        const groupedData = data.transactions.reduce((acc, transaction) => {
          const source = transaction.title || "Other";
          
          if (!acc[source]) {
            acc[source] = {
              name: source,
              amount: 0
            };
          }
          
          acc[source].amount += Number(transaction.amount) || 0;
          return acc;
        }, {});
        
        // Convert grouped data to array
        const formattedData = Object.values(groupedData);
        console.log("Formatted chart data:", formattedData);
        
        setChartData(formattedData);
      } else {
        console.log("No transactions data available");
        setChartData([]);
        setCalculatedTotal(0);
      }
    } catch (error) {
      console.error("Error processing income chart data:", error);
      setChartData([]);
      setCalculatedTotal(0);
    }
  }, [data, totalIncome]);

  // Define pie chart colors
  const COLORS = ["#8b5cf6", "#ef4444", "#f97316", "#10b981", "#3b82f6", "#ec4899"];

  // Prioritize the calculated total from transactions
  const incomeValue = calculatedTotal > 0 ? calculatedTotal : totalIncome;
  
  // Format the income value as a string with the "Rs" prefix
  const formattedTotalIncome = `Rs ${incomeValue.toLocaleString()}`;

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h5 className="text-lg font-semibold">Last 60 Days Income</h5>
        <p className="text-sm text-gray-500">
          Total: <span className="font-medium">Rs {incomeValue.toLocaleString()}</span>
        </p>
      </div>
      
      <div className="mt-4">
        {chartData && chartData.length > 0 ? (
          <CustomPieChart 
            data={chartData} 
            label="Total Income"
            totalAmount={formattedTotalIncome}
            colors={COLORS}
            showTextAnchor={true}
          />
        ) : (
          <div className="flex justify-center items-center h-64 text-gray-400">
            No income data available for the last 60 days
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentIncomeWithChart;