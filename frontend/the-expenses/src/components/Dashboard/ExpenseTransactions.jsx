import moment from "moment";
import React from "react";
import { LuArrowRight } from "react-icons/lu";
import TransactionsInfoCard from "../Cards/TransactionInfoCard";

const ExpenseTransactions = ({ transactions, onSeeMore }) => {
  // Add this safety check
  const validTransactions = Array.isArray(transactions) ? transactions : [];
  
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Expenses</h5>
        <button className="card-btn" onClick={onSeeMore}>
          See All <LuArrowRight className="text-base" />
        </button>
      </div>
      <div className="mt-6">
        {validTransactions.length > 0 ? (
          validTransactions.slice(0, 6).map((expense) => (
            <TransactionsInfoCard
              key={expense._id}
              title={expense.category}
              icon={expense.icon}
              date={moment(expense.date).format("Do MMM YYYY")}
              amount={expense.amount}
              type="expense"
              hideDeleteBtn
            />
          ))
        ) : (
          <div className="text-center text-gray-400 py-8">No expense transactions found</div>
        )}
      </div>
    </div>
  );
};

export default ExpenseTransactions;