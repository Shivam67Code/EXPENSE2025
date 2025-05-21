import React, { useEffect, useState } from "react";
import { LuPlus } from "react-icons/lu";
import { prepareExpenseLineChartData } from "../../utils/helper";
import CustomLineChart from "../Charts/CustomLineChart";

const ExpenseOverview = ({ transactions, onAddExpense }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    try {
      // Add default empty array and error checking
      const validTransactions = Array.isArray(transactions) ? transactions : [];
      console.log("Processing transactions for expense chart:", validTransactions.length);
      
      if (validTransactions.length === 0) {
        console.log("No expense transactions available");
        setChartData([]);
        return;
      }
      
      const result = prepareExpenseLineChartData(validTransactions);
      setChartData(result || []);
    } catch (error) {
      console.error("Error preparing expense chart data:", error);
      setChartData([]);
    }
  }, [transactions]);

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div className="max-w-md">
          <h5 className="text-lg font-medium">Expense Overview</h5>
          <p className="text-sm text-gray-500 mt-1">
            Track Your Spending Trends over time and Gain Insights into where your Money Goes.
          </p>
        </div>
        <button 
          className="add-btn"
          onClick={onAddExpense}
        >
          <LuPlus size={18} className="text-lg"/>
          Add Expense
        </button>
      </div>
      
      <div className="mt-10">
        {chartData && chartData.length > 0 ? (
          <CustomLineChart data={chartData} />
        ) : (
          <div className="flex justify-center items-center h-48 text-gray-400">
            No expense data available to display
          </div>
        )}
      </div>      
    </div>
  );
};

export default ExpenseOverview;