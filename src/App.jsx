import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext"; // Import useAuth hook
import Login from "./pages/Login";
import AddExpense from "./pages/AddExpense";
import DailyExpense from "./pages/DailyExpense";
import WeeklyExpense from "./pages/WeeklyExpense";
import MonthlyExpense from "./pages/MonthlyExpense";
import BottomNavbar from "./components/BottomNavbar";
import ProtectedRoute from "./components/ProtectedRoute";

function AppContent() {
  const { user } = useAuth(); // Get the authenticated user

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/add-expense" replace />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/add-expense" element={<AddExpense />} />
          <Route path="/daily" element={<DailyExpense />} />
          <Route path="/weekly" element={<WeeklyExpense />} />
          <Route path="/monthly" element={<MonthlyExpense />} />
        </Route>
      </Routes>

      {/* Show BottomNavbar only if user is logged in */}
      {user && <BottomNavbar />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
