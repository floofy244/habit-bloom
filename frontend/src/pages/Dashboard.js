import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { 
  Target, 
  CheckCircle, 
  TrendingUp, 
  Award, 
  Plus,
  Calendar,
  Star
} from 'lucide-react';

function Dashboard() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
      const response = await axios.get(`${apiUrl}/api/habits/dashboard/`);
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const completeHabit = async (habitId) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
      await axios.post(`${apiUrl}/api/habits/${habitId}/complete/`);
      toast.success('Habit completed! Great job!');
      fetchDashboardData(); // Refresh data
    } catch (error) {
      if (error.response?.status === 400) {
        toast.info('Habit already completed today!');
      } else {
        toast.error('Failed to complete habit');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading your dashboard...</div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">Failed to load dashboard</div>
      </div>
    );
  }

  const { 
    total_habits, 
    completed_today, 
    total_points, 
    current_level, 
    level_progress, 
    habits, 
    recent_completions 
  } = dashboardData;

  return (
    <div className="min-h-screen bg-gradient-soft">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-primary mb-2">
            Welcome back, {user?.username}! 🌱
          </h1>
          <p className="text-lg text-neutral-600">
            Keep up the great work building your habits
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card shadow-soft hover:shadow-soft-lg transition-all duration-300">
            <div className="flex items-center">
              <div className="p-4 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl shadow-soft">
                <Target className="h-7 w-7 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-semibold text-neutral-600 uppercase tracking-wide">Total Habits</p>
                <p className="text-3xl font-bold text-primary">{total_habits}</p>
              </div>
            </div>
          </div>

          <div className="card shadow-soft hover:shadow-soft-lg transition-all duration-300">
            <div className="flex items-center">
              <div className="p-4 bg-gradient-to-br from-success-100 to-success-200 rounded-xl shadow-soft">
                <CheckCircle className="h-7 w-7 text-success-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-semibold text-neutral-600 uppercase tracking-wide">Completed Today</p>
                <p className="text-3xl font-bold text-success-600">{completed_today}</p>
              </div>
            </div>
          </div>

          <div className="card shadow-soft hover:shadow-soft-lg transition-all duration-300">
            <div className="flex items-center">
              <div className="p-4 bg-gradient-to-br from-secondary-100 to-secondary-200 rounded-xl shadow-soft">
                <Award className="h-7 w-7 text-secondary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-semibold text-neutral-600 uppercase tracking-wide">Total Points</p>
                <p className="text-3xl font-bold text-secondary-600">{total_points}</p>
              </div>
            </div>
          </div>

          <div className="card shadow-soft hover:shadow-soft-lg transition-all duration-300">
            <div className="flex items-center">
              <div className="p-4 bg-gradient-to-br from-accent-100 to-accent-200 rounded-xl shadow-soft">
                <Star className="h-7 w-7 text-accent-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-semibold text-neutral-600 uppercase tracking-wide">Current Level</p>
                <p className="text-3xl font-bold text-accent-600">{current_level}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Level Progress */}
        <div className="card shadow-soft mb-8">
          <h3 className="text-xl font-bold text-primary mb-6 text-center">Level Progress</h3>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="flex justify-between text-sm font-semibold text-neutral-600 mb-3">
                <span className="text-lg">Level {current_level}</span>
                <span className="text-lg">{level_progress.current}/{level_progress.needed} points</span>
              </div>
              <div className="w-full bg-neutral-200 rounded-full h-4 shadow-inner">
                <div 
                  className="bg-gradient-primary h-4 rounded-full transition-all duration-500 shadow-soft"
                  style={{ width: `${Math.min(level_progress.percentage, 100)}%` }}
                ></div>
              </div>
              <div className="text-center mt-2">
                <span className="text-sm text-neutral-500">
                  {Math.round(level_progress.percentage)}% complete
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Today's Habits */}
          <div className="card shadow-soft">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-primary">Today's Habits</h3>
              <Link to="/habits" className="btn btn-outline btn-sm">
                <Plus className="h-4 w-4 mr-1" />
                Add Habit
              </Link>
            </div>
            
            {habits.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-float">
                  <Target className="h-10 w-10 text-primary-500" />
                </div>
                <p className="text-neutral-600 mb-6 text-lg">No habits yet</p>
                <Link to="/habits" className="btn btn-primary">
                  Create Your First Habit
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {habits.map((habit) => (
                  <div key={habit.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-neutral-50 to-primary-50 rounded-xl border border-neutral-200 hover:shadow-soft transition-all duration-300">
                    <div className="flex items-center space-x-4">
                      <div className={`w-4 h-4 rounded-full shadow-soft ${
                        habit.is_completed_today ? 'bg-gradient-to-r from-success-400 to-success-500' : 'bg-gradient-to-r from-neutral-300 to-neutral-400'
                      }`}></div>
                      <div>
                        <p className="font-semibold text-neutral-900 text-lg">{habit.name}</p>
                        <p className="text-sm text-neutral-600">
                          {habit.frequency} • {habit.points_per_completion} pts
                          {habit.streak > 0 && ` • ${habit.streak} day streak`}
                        </p>
                      </div>
                    </div>
                    {!habit.is_completed_today && (
                      <button
                        onClick={() => completeHabit(habit.id)}
                        className="btn btn-success btn-sm"
                      >
                        Complete
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="card shadow-soft">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-gradient-to-br from-secondary-100 to-secondary-200 rounded-lg mr-3">
                <Calendar className="h-6 w-6 text-secondary-600" />
              </div>
              <h3 className="text-xl font-bold text-primary">Recent Activity</h3>
            </div>
            
            {recent_completions.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-br from-secondary-100 to-primary-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-float">
                  <Calendar className="h-10 w-10 text-secondary-500" />
                </div>
                <p className="text-neutral-600 text-lg">No recent activity</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recent_completions.map((completion) => (
                  <div key={completion.id} className="flex items-center space-x-4 p-4 bg-gradient-to-r from-success-50 to-primary-50 rounded-xl border border-success-200 hover:shadow-soft transition-all duration-300">
                    <div className="p-2 bg-gradient-to-br from-success-100 to-success-200 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-success-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-neutral-900 text-lg">{completion.habit_name}</p>
                      <p className="text-sm text-neutral-600">
                        {new Date(completion.completed_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
