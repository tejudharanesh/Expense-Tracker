import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PlusCircle, Calendar, CalendarDays, Calendar as CalendarMonth } from 'lucide-react';

function BottomNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/add-expense', icon: PlusCircle, label: 'Add' },
    { path: '/daily', icon: Calendar, label: 'Daily' },
    { path: '/weekly', icon: CalendarDays, label: 'Weekly' },
    { path: '/monthly', icon: CalendarMonth, label: 'Monthly' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="grid grid-cols-4 h-16">
        {navItems.map(({ path, icon: Icon, label }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={`flex flex-col items-center justify-center ${
              isActive(path) ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            <Icon className="w-6 h-6" />
            <span className="text-xs mt-1">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

export default BottomNavbar;