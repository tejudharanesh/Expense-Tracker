const API_URL = import.meta.env.VITE_API_URL;

export const api = {
  // Auth APIs
  auth: {
    login: async (mobile, password) => {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mobile, password }),
      });
      return response.json();
    },

    register: async (userData) => {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      return response.json();
    },
  },

  // Expense APIs
  expenses: {
    add: async (expenseData) => {
      const response = await fetch(`${API_URL}/api/expenses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify(expenseData),
      });
      return response.json();
    },

    getDaily: async () => {
      const response = await fetch(`${API_URL}/api/expenses/daily`, {
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        },
      });
      return response.json();
    },

    getWeekly: async () => {
      const response = await fetch(`${API_URL}/api/expenses/weekly`, {
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        },
      });
      return response.json();
    },

    getMonthly: async () => {
      const response = await fetch(`${API_URL}/api/expenses/monthly`, {
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        },
      });
      return response.json();
    },

    getReport: async (type) => {
      const response = await fetch(`${API_URL}/api/expenses/report/${type}`, {
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        },
      });
      return response.json();
    },
  },
};
