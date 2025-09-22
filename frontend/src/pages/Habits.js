import React, { useState, useMemo, useCallback } from 'react';
import { toast } from 'react-toastify';
import api from '../api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Avatar,
  Chip,
  Paper,
  Divider,
} from '@mui/material';
import {
  Add as PlusIcon,
  Assignment as TargetIcon,
  CheckCircle as CheckCircleIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  AccessTime as ClockIcon,
  Star as StarIcon,
  LocalFireDepartment as FireIcon,
} from '@mui/icons-material';

function Habits() {
  const [showForm, setShowForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    frequency: 'daily',
    points_per_completion: 10
  });

  const queryClient = useQueryClient();

  // cached queries
  const { data: habits = [], isLoading: habitsLoading } = useQuery(
    ['habits'],
    () => api.get('habits/').then(r => r.data.results || []),
  );

  const { data: categories = [], isLoading: categoriesLoading } = useQuery(
    ['categories'],
    () => api.get('categories/').then(r => r.data.results || []),
  );

  // mutations (invalidate cached habits after changes)
  const createHabit = useMutation((payload) => api.post('habits/', payload), {
    onSuccess: () => queryClient.invalidateQueries(['habits']),
  });
  const updateHabit = useMutation(({ id, payload }) => api.put(`habits/${id}/`, payload), {
    onSuccess: () => queryClient.invalidateQueries(['habits']),
  });
  const deleteHabit = useMutation((id) => api.delete(`habits/${id}/`), {
    onSuccess: () => queryClient.invalidateQueries(['habits']),
  });
  const completeHabitMut = useMutation((id) => api.post(`habits/${id}/complete/`), {
    onSuccess: () => queryClient.invalidateQueries(['habits']),
  });

  const loading = habitsLoading || categoriesLoading;

  const resetForm = useCallback(() => {
    setShowForm(false);
    setEditingHabit(null);
    setFormData({
      name: '',
      description: '',
      category: '',
      frequency: 'daily',
      points_per_completion: 10
    });
  }, []);

  const handleChange = useCallback((e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    try {
      if (editingHabit) {
        await updateHabit.mutateAsync({ id: editingHabit.id, payload: formData });
        toast.success('Habit updated successfully!');
      } else {
        await createHabit.mutateAsync(formData);
        toast.success('Habit created successfully!');
      }
      resetForm();
    } catch (err) {
      toast.error('Failed to save habit');
    }
  }, [editingHabit, formData, createHabit, updateHabit, resetForm]);

  const handleEdit = useCallback((habit) => {
    setEditingHabit(habit);
    setFormData({
      name: habit.name,
      description: habit.description,
      category: habit.category || '',
      frequency: habit.frequency,
      points_per_completion: habit.points_per_completion
    });
    setShowForm(true);
  }, []);

  const handleDelete = useCallback(async (habitId) => {
    if (!window.confirm('Are you sure you want to delete this habit?')) return;
    try {
      await deleteHabit.mutateAsync(habitId);
      toast.success('Habit deleted successfully!');
    } catch (err) {
      toast.error('Failed to delete habit');
    }
  }, [deleteHabit]);

  const completeHabit = useCallback(async (habitId) => {
    try {
      await completeHabitMut.mutateAsync(habitId);
      toast.success('Habit completed! Great job!');
    } catch (error) {
      if (error.response?.status === 400) {
        toast.info('Habit already completed today!');
      } else {
        toast.error('Failed to complete habit');
      }
    }
  }, [completeHabitMut]);

  const memoizedHabits = useMemo(() => habits, [habits]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress size={40} />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
            My Habits 🌱
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Track and manage your daily habits
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<PlusIcon />}
          onClick={() => setShowForm(true)}
          sx={{ px: 3, py: 1.5 }}
        >
          Add Habit
        </Button>
      </Box>

      {/* Add/Edit Form Dialog */}
      <Dialog open={showForm} onClose={resetForm} maxWidth="md" fullWidth>
        <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
          <Typography variant="h4" component="h2" sx={{ fontWeight: 600 }}>
            {editingHabit ? 'Edit Habit' : 'Add New Habit'}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="name"
                  label="Habit Name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Read for 15 minutes"
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    label="Category"
                  >
                    <MenuItem value="">Select a category</MenuItem>
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Frequency</InputLabel>
                  <Select
                    name="frequency"
                    value={formData.frequency}
                    onChange={handleChange}
                    label="Frequency"
                  >
                    <MenuItem value="daily">Daily</MenuItem>
                    <MenuItem value="weekly">Weekly</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="points_per_completion"
                  label="Points per Completion"
                  type="number"
                  value={formData.points_per_completion}
                  onChange={handleChange}
                  inputProps={{ min: 1, max: 100 }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="description"
                  label="Description (Optional)"
                  multiline
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your habit..."
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={resetForm} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            size="large"
          >
            {editingHabit ? 'Update Habit' : 'Create Habit'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Habits List */}
      {memoizedHabits.length === 0 ? (
        <Card sx={{ textAlign: 'center', py: 8 }}>
          <CardContent>
            <Avatar sx={{ width: 96, height: 96, mx: 'auto', mb: 3, bgcolor: 'primary.main' }}>
              <TargetIcon sx={{ fontSize: 48 }} />
            </Avatar>
            <Typography variant="h4" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
              No habits yet
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
              Start building your habits by creating your first one!
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={<PlusIcon />}
              onClick={() => setShowForm(true)}
              sx={{ px: 4, py: 2 }}
            >
              Create Your First Habit
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {memoizedHabits.map((habit) => (
            <Grid item xs={12} md={6} lg={4} key={habit.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  {/* Header */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box
                        sx={{
                          width: 16,
                          height: 16,
                          borderRadius: '50%',
                          bgcolor: habit.is_completed_today ? 'success.main' : 'grey.400',
                        }}
                      />
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {habit.name}
                        </Typography>
                        {habit.category_name && (
                          <Chip
                            label={habit.category_name}
                            size="small"
                            color="primary"
                            variant="outlined"
                            sx={{ mt: 0.5 }}
                          />
                        )}
                      </Box>
                    </Box>
                    <Box>
                      <IconButton
                        onClick={() => handleEdit(habit)}
                        size="small"
                        sx={{ mr: 1 }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(habit.id)}
                        size="small"
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>

                  {/* Description */}
                  {habit.description && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {habit.description}
                    </Typography>
                  )}

                  {/* Details */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Chip
                      icon={<ClockIcon />}
                      label={habit.frequency}
                      size="small"
                      variant="outlined"
                    />
                    <Chip
                      icon={<StarIcon />}
                      label={`${habit.points_per_completion} pts`}
                      size="small"
                      variant="outlined"
                      color="secondary"
                    />
                  </Box>

                  {/* Streak */}
                  {habit.streak > 0 && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <FireIcon sx={{ color: 'warning.main' }} />
                      <Typography variant="body2" color="warning.main" sx={{ fontWeight: 600 }}>
                        {habit.streak} day streak
                      </Typography>
                    </Box>
                  )}

                  <Divider sx={{ my: 2 }} />

                  {/* Action Button */}
                  {!habit.is_completed_today ? (
                    <Button
                      variant="contained"
                      color="success"
                      fullWidth
                      startIcon={<CheckCircleIcon />}
                      onClick={() => completeHabit(habit.id)}
                      sx={{ py: 1.5 }}
                    >
                      Complete Today
                    </Button>
                  ) : (
                    <Paper
                      sx={{
                        textAlign: 'center',
                        py: 2,
                        bgcolor: 'success.50',
                        border: 1,
                        borderColor: 'success.200',
                      }}
                    >
                      <Typography variant="h6" color="success.main" sx={{ fontWeight: 600 }}>
                        ✓ Completed Today
                      </Typography>
                    </Paper>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}

export default Habits;
