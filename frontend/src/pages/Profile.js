import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { 
  User, 
  Award, 
  Target, 
  Calendar, 
  TrendingUp,
  Star,
  Trophy
} from 'lucide-react';

function Profile() {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || '';
      const response = await axios.get(`${apiUrl}/api/habits/dashboard/`);
      setProfileData(response.data);
    } catch (error) {
      console.error('Error fetching profile data:', error);
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading profile...</div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">Failed to load profile</div>
      </div>
    );
  }

  const { 
    total_habits, 
    completed_today, 
    total_points, 
    current_level, 
    level_progress, 
    habits 
  } = profileData;

  const completionRate = total_habits > 0 ? (completed_today / total_habits) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="card mb-8">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-2xl">
                {user?.username?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">{user?.username}</h1>
              <p className="text-gray-600">{user?.email}</p>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-1">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span className="font-semibold">Level {current_level}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Award className="h-5 w-5 text-purple-500" />
                  <span className="font-semibold">{total_points} points</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
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
                <TrendingUp className="h-6 w-6 text-green-600" />
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
                <Trophy className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {completionRate.toFixed(0)}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Level Progress */}
        <div className="card mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Level Progress</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Current Level: {current_level}</span>
              <span className="text-sm text-gray-600">
                {level_progress.current}/{level_progress.needed} points
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-4 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(level_progress.percentage, 100)}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600">
              {level_progress.needed - level_progress.current} more points to reach level {current_level + 1}
            </p>
          </div>
        </div>

        {/* Habit Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Habit Streaks */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Habit Streaks</h3>
            {habits.length === 0 ? (
              <div className="text-center py-8">
                <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No habits to display</p>
              </div>
            ) : (
              <div className="space-y-3">
                {habits
                  .filter(habit => habit.streak > 0)
                  .sort((a, b) => b.streak - a.streak)
                  .map((habit) => (
                    <div key={habit.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{habit.name}</p>
                        <p className="text-sm text-gray-600">{habit.frequency}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">{habit.streak} days</p>
                        <p className="text-sm text-gray-600">streak</p>
                      </div>
                    </div>
                  ))}
                {habits.filter(habit => habit.streak > 0).length === 0 && (
                  <div className="text-center py-4">
                    <p className="text-gray-600">No active streaks yet</p>
                    <p className="text-sm text-gray-500">Complete habits consistently to build streaks!</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-600">Member since</span>
                <span className="font-medium">
                  {new Date(user?.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-600">Current level</span>
                <span className="font-medium">Level {current_level}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-600">Total points earned</span>
                <span className="font-medium">{total_points}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-600">Habits created</span>
                <span className="font-medium">{total_habits}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Today's completion rate</span>
                <span className="font-medium">{completionRate.toFixed(0)}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
