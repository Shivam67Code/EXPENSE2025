import moment from "moment";
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};


export const prepareExpenseBarChartData = (data = []) => {
  const chartData = data.map((item) => ({
    category: item?.category,
    amount: item?.amount,
  }))

  return chartData;
};

export const prepareIncomeBarChartData = (data = []) => {
  if (!data || data.length === 0) return [];

  console.log("Income data for chart:", data);

  const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));

  const chartData = sortedData.map((item) => ({
    month: moment(item?.date).format("Do MMM"),
    amount: item?.amount || 0,
    source: item?.title || "", // Use title instead of source
  }));

  console.log("Prepared chart data:", chartData);
  return chartData;
};

export const prepareExpenseLineChartData = (data = []) => {
  const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));

  const chartData = sortedData.map((item) => ({
    month: moment(item?.date).format("Do MMM"),
    amount: item?.amount || 0,
    category: item?.category || "", // Use category instead of source
  }));
  return chartData;
};