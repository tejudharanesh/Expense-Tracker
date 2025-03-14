import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

const CATEGORIES = [
  "Food",
  "Entertainment",
  "Cigarette",
  "Fuel",
  "Travel",
  "EMI",
  "Savings",
  "Shopping",
  "Rent",
  "Others",
];

// Subcategories mapped to categories
const SUBCATEGORIES = {
  Food: ["Breakfast", "Lunch", "Dinner", "Party", "Snacks"],
  Entertainment: ["Movies", "Games", "Concerts", "Events"],
  Cigarette: ["Regular", "Premium", "Other"],
  Fuel: ["Petrol", "Diesel", "CNG"],
  Travel: ["Flight", "Train", "Bus", "Cab", "Hotel"],
  EMI: ["Home Loan", "Car Loan", "Education Loan", "Other"],
  Savings: ["Fixed Deposit", "Mutual Funds", "Stocks", "Other"],
  Shopping: ["Clothes", "Electronics", "Groceries", "Other"],
  Rent: ["Apartment", "Office", "Storage", "Other"],
  Others: ["Miscellaneous"],
};

function AddExpense() {
  const [formData, setFormData] = useState({
    category: "",
    subCategory: "",
    amount: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // Handle category change
  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setFormData({
      ...formData,
      category: selectedCategory,
      subCategory: "", // Reset subcategory when category changes
    });
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.category) {
      setError("Please select a category.");
      return;
    }

    if (!formData.subCategory) {
      setError("Please select a subcategory.");
      return;
    }

    if (!formData.amount || formData.amount <= 0) {
      setError("Please enter a valid amount.");
      return;
    }

    try {
      const data = await api.expenses.add(formData);

      if (data.message) {
        throw new Error(data.message);
      }

      setSuccess("Expense added successfully!");
      setFormData({
        category: "",
        subCategory: "",
        amount: "",
      });

      // Navigate to daily expenses after 1 second
      setTimeout(() => {
        navigate("/daily");
      }, 1000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 mb-16">
      <h1 className="text-2xl font-bold mb-6">Add New Expense</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        {/* Category Dropdown */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="category"
          >
            Category
          </label>
          <select
            id="category"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={formData.category}
            onChange={handleCategoryChange}
            required
          >
            <option value="">Select a category</option>
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Subcategory Dropdown (Only Show if Category is Selected) */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="subCategory"
          >
            Sub Category
          </label>
          <select
            id="subCategory"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={formData.subCategory}
            onChange={(e) =>
              setFormData({ ...formData, subCategory: e.target.value })
            }
            required
          >
            <option value="">Select a subcategory</option>
            {SUBCATEGORIES[formData.category]?.map((subCategory) => (
              <option key={subCategory} value={subCategory}>
                {subCategory}
              </option>
            ))}
          </select>
        </div>

        {/* Amount Input */}
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="amount"
          >
            Amount (₹)
          </label>
          <input
            type="number"
            id="amount"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter amount"
            value={formData.amount}
            onChange={(e) =>
              setFormData({ ...formData, amount: e.target.value })
            }
            required
          />
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          >
            Add Expense
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddExpense;
