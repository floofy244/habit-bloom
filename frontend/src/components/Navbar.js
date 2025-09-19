import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User, Target, Home } from 'lucide-react';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">H</span>
            </div>
            <span className="text-xl font-bold text-gray-800">HabitBloom</span>
          </Link>

          {user ? (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Level {user.current_level}</span>
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-sm">
                    {user.total_points}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md"
                >
                  <Home size={18} />
                  <span>Dashboard</span>
                </Link>
                
                <Link
                  to="/habits"
                  className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md"
                >
                  <Target size={18} />
                  <span>Habits</span>
                </Link>
                
                <Link
                  to="/profile"
                  className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md"
                >
                  <User size={18} />
                  <span>Profile</span>
                </Link>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-600 hover:text-red-600 px-3 py-2 rounded-md"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="btn btn-primary"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
