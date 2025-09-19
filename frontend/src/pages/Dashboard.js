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
      const apiUrl = process.env.REACT_APP_API_URL || '';
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
      const apiUrl = process.env.REACT_APP_API_URL || '';
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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.username}!
          </h1>
          <p className="text-gray-600">
            Keep up the great work building your habits
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Habits</p>
                <p className="text-2xl font-bold text-gray-900">{total_habits}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed Today</p>
                <p className="text-2xl font-bold text-gray-900">{completed_today}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Points</p>
                <p className="text-2xl font-bold text-gray-900">{total_points}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Current Level</p>
                <p className="text-2xl font-bold text-gray-900">{current_level}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Level Progress */}
        <div className="card mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Level Progress</h3>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Level {current_level}</span>
                <span>{level_progress.current}/{level_progress.needed} points</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(level_progress.percentage, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Today's Habits */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Today's Habits</h3>
              <Link to="/habits" className="btn btn-outline btn-sm">
                <Plus className="h-4 w-4 mr-1" />
                Add Habit
              </Link>
            </div>
            
            {habits.length === 0 ? (
              <div className="text-center py-8">
                <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No habits yet</p>
                <Link to="/habits" className="btn btn-primary">
                  Create Your First Habit
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {habits.map((habit) => (
                  <div key={habit.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        habit.is_completed_today ? 'bg-green-500' : 'bg-gray-300'
                      }`}></div>
                      <div>
                        <p className="font-medium text-gray-900">{habit.name}</p>
                        <p className="text-sm text-gray-600">
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
          <div className="card">
            <div className="flex items-center mb-6">
              <Calendar className="h-5 w-5 text-gray-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            </div>
            
            {recent_completions.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No recent activity</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recent_completions.map((completion) => (
                  <div key={completion.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{completion.habit_name}</p>
                      <p className="text-sm text-gray-600">
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
