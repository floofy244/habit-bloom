import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { 
  Plus, 
  Target, 
  CheckCircle, 
  Edit, 
  Trash2, 
  Calendar,
  Star,
  Clock
} from 'lucide-react';

function Habits() {
  const [habits, setHabits] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    frequency: 'daily',
    points_per_completion: 10
  });

  useEffect(() => {
    fetchHabits();
    fetchCategories();
  }, []);

  const fetchHabits = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || '';
      const response = await axios.get(`${apiUrl}/api/habits/`);
      setHabits(response.data);
    } catch (error) {
      console.error('Error fetching habits:', error);
      toast.error('Failed to load habits');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || '';
      const response = await axios.get(`${apiUrl}/api/categories/`);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const apiUrl = process.env.REACT_APP_API_URL || '';
      if (editingHabit) {
        await axios.put(`${apiUrl}/api/habits/${editingHabit.id}/`, formData);
        toast.success('Habit updated successfully!');
      } else {
        await axios.post(`${apiUrl}/api/habits/`, formData);
        toast.success('Habit created successfully!');
      }
      
      setShowForm(false);
      setEditingHabit(null);
      setFormData({
        name: '',
        description: '',
        category: '',
        frequency: 'daily',
        points_per_completion: 10
      });
      fetchHabits();
    } catch (error) {
      toast.error('Failed to save habit');
    }
  };

  const handleEdit = (habit) => {
    setEditingHabit(habit);
    setFormData({
      name: habit.name,
      description: habit.description,
      category: habit.category || '',
      frequency: habit.frequency,
      points_per_completion: habit.points_per_completion
    });
    setShowForm(true);
  };

  const handleDelete = async (habitId) => {
    if (window.confirm('Are you sure you want to delete this habit?')) {
      try {
        const apiUrl = process.env.REACT_APP_API_URL || '';
        await axios.delete(`${apiUrl}/api/habits/${habitId}/`);
        toast.success('Habit deleted successfully!');
        fetchHabits();
      } catch (error) {
        toast.error('Failed to delete habit');
      }
    }
  };

  const completeHabit = async (habitId) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || '';
      await axios.post(`${apiUrl}/api/habits/${habitId}/complete/`);
      toast.success('Habit completed! Great job!');
      fetchHabits();
    } catch (error) {
      if (error.response?.status === 400) {
        toast.info('Habit already completed today!');
      } else {
        toast.error('Failed to complete habit');
      }
    }
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingHabit(null);
    setFormData({
      name: '',
      description: '',
      category: '',
      frequency: 'daily',
      points_per_completion: 10
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading habits...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Habits</h1>
            <p className="text-gray-600">Track and manage your daily habits</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="btn btn-primary"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Habit
          </button>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="card mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingHabit ? 'Edit Habit' : 'Add New Habit'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Habit Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="e.g., Read for 15 minutes"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Frequency</label>
                  <select
                    name="frequency"
                    value={formData.frequency}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Points per Completion</label>
                  <input
                    type="number"
                    name="points_per_completion"
                    value={formData.points_per_completion}
                    onChange={handleChange}
                    className="form-input"
                    min="1"
                    max="100"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description (Optional)</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="form-textarea"
                  placeholder="Describe your habit..."
                />
              </div>

              <div className="flex space-x-4">
                <button type="submit" className="btn btn-primary">
                  {editingHabit ? 'Update Habit' : 'Create Habit'}
                </button>
                <button type="button" onClick={cancelForm} className="btn btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Habits List */}
        {habits.length === 0 ? (
          <div className="card text-center py-12">
            <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No habits yet</h3>
            <p className="text-gray-600 mb-6">Start building your habits by creating your first one!</p>
            <button
              onClick={() => setShowForm(true)}
              className="btn btn-primary"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Your First Habit
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {habits.map((habit) => (
              <div key={habit.id} className="card">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      habit.is_completed_today ? 'bg-green-500' : 'bg-gray-300'
                    }`}></div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{habit.name}</h3>
                      {habit.category_name && (
                        <p className="text-sm text-gray-600">{habit.category_name}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(habit)}
                      className="text-gray-400 hover:text-blue-600"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(habit.id)}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {habit.description && (
                  <p className="text-sm text-gray-600 mb-4">{habit.description}</p>
                )}

                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{habit.frequency}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4" />
                      <span>{habit.points_per_completion} pts</span>
                    </div>
                  </div>
                  {habit.streak > 0 && (
                    <div className="text-green-600 font-medium">
                      {habit.streak} day streak
                    </div>
                  )}
                </div>

                {!habit.is_completed_today ? (
                  <button
                    onClick={() => completeHabit(habit.id)}
                    className="btn btn-success w-full"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Complete Today
                  </button>
                ) : (
                  <div className="text-center py-2 text-green-600 font-medium">
                    ✓ Completed Today
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Habits;
