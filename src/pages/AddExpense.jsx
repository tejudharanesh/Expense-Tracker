import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

const CATEGORIES = [
  "Food",
  "Entertainment",
  "Fuel",
  "Sports",
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
  Entertainment: ["Movies", "Games", "Concerts", "Events", "OTT"],
  Fuel: ["Petrol", "Diesel", "CNG"],
  Sports: ["Gym", "Fitness", "Sports Equipment", "Sports Events"],
  Travel: ["Flight", "Train", "Bus", "Cab", "Hotel"],
  EMI: ["Home Loan", "Car Loan", "Education Loan", "Other"],
  Savings: ["Fixed Deposit", "Mutual Funds", "Stocks", "Other"],
  Shopping: ["Clothes", "Electronics", "Groceries", "Other"],
  Rent: ["Apartment", "Office", "Storage", "Other"],
  Others: ["Miscellaneous"],
};

function AddExpense({ user }) {
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

  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="container mx-auto px-4 pb-8 pt-3 mb-16">
      <p className="text-right text-blue-500 font-bold mr-1">
        Hey {user?.name?.split(" ")[0]}!
      </p>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Add New Expense</h1>
        <h2 className="font-bold mr-1">{formattedDate}</h2>
      </div>
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
            className="block text-gray-800 font-bold mb-1 ml-1"
            htmlFor="category"
          >
            Category
          </label>
          <select
            id="category"
            className="appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline cursor-pointer"
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
            className="block text-gray-800 font-bold mb-1 ml-1"
            htmlFor="subCategory"
          >
            Sub Category
          </label>
          <select
            id="subCategory"
            className="appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline cursor-pointer"
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
            className="block text-gray-800 font-bold mb-1 ml-1"
            htmlFor="amount"
          >
            Amount (₹)
          </label>
          <input
            type="number"
            id="amount"
            className="appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter amount"
            value={formData.amount}
            onChange={(e) =>
              setFormData({
                ...formData,
                amount: e.target.value < 0 ? 0 : e.target.value,
              })
            }
            required
            min="0"
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
