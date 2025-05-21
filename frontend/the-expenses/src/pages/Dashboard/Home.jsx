import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import useUserAuth from "../../hooks/useUserAuth";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { LuHandCoins, LuWalletMinimal } from "react-icons/lu";
import RecentTransactions from "../../components/Dashboard/RecentTransactions";
import FinanceOverview from "../../components/Dashboard/FinanceOverview";
import ExpenseTransactions from "../../components/Dashboard/ExpenseTransactions";
import Last30DaysExpenses from "../../components/Dashboard/Last30DaysExpenses";
import RecentIncomeWithChart from "../../components/Dashboard/RecentIncomeWithChart";
import RecentIncome from "../../components/Dashboard/RecentIncome";

const Home = () => {
  useUserAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchDashboardData = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await axiosInstance.get(API_PATHS.DASHBOARD.GET_DATA);
      console.log("Dashboard API response:", response.data); // Add this log
      if (response.data) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.log("Something went wrong. Please try again.", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Memoize balance calculation with proper number handling
  const balance = useMemo(() => {
    if (!dashboardData?.summary) return 0;
    const income = Number(dashboardData.summary.totalIncome) || 0;
    const expense = Number(dashboardData.summary.totalExpenses) || 0;
    return (income - expense).toFixed(2);
  }, [dashboardData]);

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="my-8 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl xs:text-3xl sm:text-4xl font-extrabold mb-6 sm:mb-8 tracking-tight animate-gradient-text bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
          Dashboard
        </h1>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {[...Array(3)].map((_, index) => (
              <div
                key={`skeleton_${index}`}
                className="bg-white/5 rounded-2xl p-4 sm:p-6 animate-pulse"
              >
                <div className="h-6 w-20 sm:w-24 bg-white/10 rounded mb-4"></div>
                <div className="h-8 w-28 sm:w-32 bg-white/10 rounded"></div>
              </div>
            ))}
          </div>
        ) : dashboardData ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {/* Total Income Card */}
            <div
              className="relative rounded-2xl p-4 sm:p-6 shadow-lg overflow-hidden animate-slide-up animate-shimmer animate-float"
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.1), 0 8px 24px rgba(0, 0, 0, 0.2)",
                animationDelay: "0s",
              }}
              role="region"
              aria-label="Total Income"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/30 to-transparent animate-gradient"></div>
              <div className="relative flex items-center gap-3 sm:gap-4">
                <div className="p-2 sm:p-3 rounded-full bg-green-500/30 hover:scale-110 hover:bounce transition-all duration-300 animate-glow-pulse">
                  <LuHandCoins className="text-xl sm:text-2xl text-green-400" />
                </div>
                <div>
                  <h2 className="text-green-700/80 text-xs sm:text-sm uppercase tracking-wider mb-2 font-medium">
                    Total Income
                  </h2>
                  <p className="text-xl sm:text-2xl font-semibold text-green-400 animate-number-flip">
                    Rs {dashboardData.summary?.totalIncome?.toFixed(2) || 0}
                  </p>
                </div>
              </div>
              <div
                className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 ripple-effect"
                style={{
                  background:
                    "radial-gradient(circle at center, rgba(255, 255, 255, 0.3) 0%, transparent 70%)",
                }}
              ></div>
            </div>

            {/* Total Expense Card */}
            <div
              className="relative rounded-2xl p-4 sm:p-6 shadow-lg overflow-hidden animate-slide-up animate-shimmer animate-float"
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.1), 0 8px 24px rgba(0, 0, 0, 0.2)",
                animationDelay: "0.2s",
              }}
              role="region"
              aria-label="Total Expense"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/30 to-transparent animate-gradient"></div>
              <div className="relative flex items-center gap-3 sm:gap-4">
                <div className="p-2 sm:p-3 rounded-full bg-red-500/30 hover:scale-110 hover:bounce transition-all duration-300 animate-glow-pulse">
                  <LuWalletMinimal className="text-xl sm:text-2xl text-red-400" />
                </div>
                <div>
                  <h2 className="text-red-700/80 text-xs sm:text-sm uppercase tracking-wider mb-2 font-medium">
                    Total Expense
                  </h2>
                  <p className="text-xl sm:text-2xl font-semibold text-red-400 animate-number-flip">
                    Rs {dashboardData.summary?.totalExpenses?.toFixed(2) || 0}
                  </p>
                </div>
              </div>
              <div
                className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 ripple-effect"
                style={{
                  background:
                    "radial-gradient(circle at center, rgba(255, 255, 255, 0.3) 0%, transparent 70%)",
                }}
              ></div>
            </div>

            {/* Balance Card */}
            <div
              className="relative rounded-2xl p-4 sm:p-6 shadow-lg overflow-hidden animate-slide-up animate-shimmer animate-float"
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.1), 0 8px 24px rgba(0, 0, 0, 0.2)",
                animationDelay: "0.4s",
              }}
              role="region"
              aria-label="Balance"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-transparent animate-gradient"></div>
              <div className="relative flex items-center gap-3 sm:gap-4">
                <div className="p-2 sm:p-3 rounded-full bg-blue-500/30 hover:scale-110 hover:bounce transition-all duration-300 animate-glow-pulse">
                  <LuHandCoins className="text-xl sm:text-2xl text-blue-400" />
                </div>
                <div>
                  <h2 className="text-blue-600/80 text-xs sm:text-sm uppercase tracking-wider mb-2 font-medium">
                    Balance
                  </h2>
                  <p className="text-xl sm:text-2xl font-semibold text-blue-400 animate-number-flip">
                    Rs {balance}
                  </p>
                </div>
              </div>
              <div
                className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 ripple-effect"
                style={{
                  background:
                    "radial-gradient(circle at center, rgba(255, 255, 255, 0.3) 0%, transparent 70%)",
                }}
              ></div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 sm:py-10 text-white/70 animate-fade-in text-sm sm:text-base">
            No dashboard data available
          </div>
        )}
      </div>

      {/* Custom CSS */}
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }

        .animate-slide-up {
          animation: slideUp 0.6s ease-out forwards;
        }

        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .animate-gradient {
          animation: gradientShift 5s ease-in-out infinite;
        }

        .animate-shimmer {
          animation: shimmer 1.5s ease-in-out forwards;
        }

        .animate-number-flip {
          animation: numberFlip 0.8s ease-out forwards;
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        .animate-glow-pulse {
          animation: glowPulse 2s ease-in-out infinite;
        }

        .hover\\:bounce {
          animation: bounce 0.5s ease-in-out;
        }

        .ripple-effect {
          position: absolute;
          background: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.4) 0%,
            transparent 70%
          );
          animation: ripple 0.6s ease-out forwards;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        @keyframes gradientShift {
          0% {
            opacity: 0.4;
            transform: translateX(-10%);
          }
          50% {
            opacity: 0.8;
            transform: translateX(10%);
          }
          100% {
            opacity: 0.4;
            transform: translateX(-10%);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -200%;
          }
          100% {
            background-position: 200%;
          }
        }

        @keyframes numberFlip {
          0% {
            transform: rotateX(90deg);
            opacity: 0;
          }
          100% {
            transform: rotateX(0deg);
            opacity: 1;
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes bounce {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.15);
          }
        }

        @keyframes glowPulse {
          0%,
          100% {
            box-shadow: 0 0 8px rgba(255, 255, 255, 0.2);
          }
          50% {
            box-shadow: 0 0 16px rgba(255, 255, 255, 0.5);
          }
        }

        @keyframes ripple {
          0% {
            transform: scale(0);
            opacity: 1;
          }
          100% {
            transform: scale(3);
            opacity: 0;
          }
        }

        div[role="region"] {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        div[role="region"]:hover {
          transform: scale(1.03) translateY(-4px);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3),
            0 0 20px rgba(255, 255, 255, 0.2);
        }

        .animate-shimmer {
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.3) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          background-size: 200%;
        }

        .animate-gradient-text {
          animation: gradientText 3s ease-in-out infinite;
        }

        @keyframes gradientText {
          0% {
            background-position: 0%;
          }
          50% {
            background-position: 100%;
          }
          100% {
            background-position: 0%;
          }
        }

        /* Responsive Adjustments */
        @media (max-width: 640px) {
          .max-w-7xl {
            padding-left: 3vw;
            padding-right: 3vw;
          }

          div[role="region"] {
            padding: 3vw;
          }

          .gap-4 {
            gap: 2vw;
          }

          .text-xl {
            font-size: 4.5vw;
          }

          .text-xs {
            font-size: 3vw;
          }
        }

        @media (min-width: 640px) and (max-width: 768px) {
          .max-w-7xl {
            padding-left: 4vw;
            padding-right: 4vw;
          }

          .grid-cols-2 {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          div[role="region"] {
            padding: 2.5vw;
          }

          .text-3xl {
            font-size: 5vw;
          }
        }

        @media (min-width: 768px) {
          .max-w-7xl {
            padding-left: 5vw;
            padding-right: 5vw;
          }

          .grid-cols-3 {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }

          div[role="region"] {
            padding: 2vw;
          }
        }
      `}</style>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <RecentTransactions
          transactions={dashboardData?.recentTransactions}
          onSeeMore={() => navigate("/expense")}
        />
        <FinanceOverview
          totalBalance={dashboardData?.summary?.totalBalance || 0}
          totalIncome={dashboardData?.summary?.totalIncome || 0}
          totalExpense={dashboardData?.summary?.totalExpenses || 0}
        />
        <ExpenseTransactions
          transactions={dashboardData?.last30DaysExpenses?.transactions || []}
          onSeeMore={() => navigate("/expense")}
        />
        <Last30DaysExpenses
          data={dashboardData?.last30DaysExpenses || {}}
        />
        <RecentIncomeWithChart
          data={dashboardData?.last60Days?.income || {}}
          totalIncome={dashboardData?.summary?.totalIncome || 0} // Fix here - use summary.totalIncome
        />
        <RecentIncome
          transactions={dashboardData?.last60Days?.income?.transactions || []}
          onSeeMore={() => navigate("/income")}
        />
      </div>
    </DashboardLayout>
  );
};

export default Home;