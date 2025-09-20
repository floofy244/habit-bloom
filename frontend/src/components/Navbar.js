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
    <nav className="bg-white/80 backdrop-blur-md shadow-soft border-b border-neutral-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-soft group-hover:shadow-soft-lg transition-all duration-300 group-hover:scale-105">
              <span className="text-white font-bold text-xl">🌱</span>
            </div>
            <span className="text-2xl font-bold text-primary group-hover:text-secondary-600 transition-colors duration-300">HabitBloom</span>
          </Link>

          {user ? (
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3 bg-gradient-to-r from-primary-50 to-secondary-50 px-4 py-2 rounded-xl border border-primary-200">
                <span className="text-sm font-semibold text-primary-700">Level {user.current_level}</span>
                <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center shadow-soft">
                  <span className="text-white font-bold text-sm">
                    {user.total_points}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-1">
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-2 text-neutral-600 hover:text-primary-600 px-4 py-2 rounded-lg hover:bg-primary-50 transition-all duration-200 font-medium"
                >
                  <Home size={20} />
                  <span>Dashboard</span>
                </Link>
                
                <Link
                  to="/habits"
                  className="flex items-center space-x-2 text-neutral-600 hover:text-primary-600 px-4 py-2 rounded-lg hover:bg-primary-50 transition-all duration-200 font-medium"
                >
                  <Target size={20} />
                  <span>Habits</span>
                </Link>
                
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 text-neutral-600 hover:text-primary-600 px-4 py-2 rounded-lg hover:bg-primary-50 transition-all duration-200 font-medium"
                >
                  <User size={20} />
                  <span>Profile</span>
                </Link>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-neutral-600 hover:text-error-600 px-4 py-2 rounded-lg hover:bg-error-50 transition-all duration-200 font-medium"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-neutral-600 hover:text-primary-600 px-4 py-2 rounded-lg hover:bg-primary-50 transition-all duration-200 font-medium"
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
