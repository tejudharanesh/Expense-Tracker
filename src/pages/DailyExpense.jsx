import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { api } from "../services/api";

function DailyExpense({ user }) {
  const [expenses, setExpenses] = useState([]);
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDailyExpenses();
  }, []);

  const fetchDailyExpenses = async () => {
    try {
      const data = await api.expenses.getDaily();
      if (data.message) {
        throw new Error(data.message);
      }
      setExpenses(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async () => {
    try {
      const data = await api.expenses.getReport("daily");
      if (data.message) {
        throw new Error(data.message);
      }
      setReport(data);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-2 md:px-4 pb-8 pt-3 mb-16">
      <p className="text-right text-blue-500 font-bold mr-1 mb-2">
        Hey {user?.name?.split(" ")[0]} how are u doing today?
      </p>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Daily Expenses</h1>
        <button
          onClick={generateReport}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Generate Report
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {report && (
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h2 className="text-xl font-bold mb-4">Daily Report</h2>
          <p className="text-lg mb-2">Total: ₹{report.total}</p>
          <h3 className="font-bold mb-2">Category Summary:</h3>
          <ul className="list-disc pl-5 mb-4">
            {Object.entries(report.categorySummary).map(
              ([category, amount]) => (
                <li key={category}>
                  {category}: ₹{amount}
                </li>
              )
            )}
          </ul>
        </div>
      )}

      <div className="bg-white shadow-md rounded overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Time
              </th>
              <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sub Category
              </th>
              <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {expenses.map((expense) => (
              <tr key={expense._id}>
                <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(new Date(expense.date), "HH:mm a")}
                </td>
                <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {expense.category}
                </td>
                <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {expense.subCategory}
                </td>
                <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ₹{expense.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DailyExpense;
