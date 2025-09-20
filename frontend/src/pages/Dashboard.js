import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../api';
import { toast } from 'react-toastify';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  LinearProgress,
  Chip,
  Avatar,
  IconButton,
  CircularProgress,
  Paper,
} from '@mui/material';
import {
  Assignment as TargetIcon,
  CheckCircle as CheckCircleIcon,
  EmojiEvents as AwardIcon,
  Add as PlusIcon,
  CalendarToday as CalendarIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';

function Dashboard() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('habits/dashboard/');
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
      await api.post(`habits/${habitId}/complete/`);
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
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress size={40} />
      </Box>
    );
  }

  if (!dashboardData) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography variant="h6" color="error">
          Failed to load dashboard
        </Typography>
      </Box>
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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
          Welcome back, {user?.username}! 🌱
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Keep up the great work building your habits
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <TargetIcon />
                </Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 600 }}>
                    Total Habits
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    {total_habits}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                  <CheckCircleIcon />
                </Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 600 }}>
                    Completed Today
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                    {completed_today}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                  <AwardIcon />
                </Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 600 }}>
                    Total Points
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'secondary.main' }}>
                    {total_points}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                  <StarIcon />
                </Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 600 }}>
                    Current Level
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
                    {current_level}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Level Progress */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" component="h3" sx={{ textAlign: 'center', mb: 3, fontWeight: 600 }}>
            Level Progress
          </Typography>
          <Box sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Level {current_level}</Typography>
              <Typography variant="h6">
                {level_progress.current}/{level_progress.needed} points
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={Math.min(level_progress.percentage, 100)}
              sx={{ height: 10, borderRadius: 5, mb: 2 }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
              {Math.round(level_progress.percentage)}% complete
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <Grid container spacing={4}>
        {/* Today's Habits */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" component="h3" sx={{ fontWeight: 600 }}>
                  Today's Habits
                </Typography>
                <Button
                  component={Link}
                  to="/habits"
                  variant="outlined"
                  size="small"
                  startIcon={<PlusIcon />}
                >
                  Add Habit
                </Button>
              </Box>
              
              {habits.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <Avatar sx={{ width: 80, height: 80, mx: 'auto', mb: 2, bgcolor: 'primary.main' }}>
                    <TargetIcon sx={{ fontSize: 40 }} />
                  </Avatar>
                  <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
                    No habits yet
                  </Typography>
                  <Button
                    component={Link}
                    to="/habits"
                    variant="contained"
                    color="primary"
                  >
                    Create Your First Habit
                  </Button>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {habits.map((habit) => (
                    <Paper
                      key={habit.id}
                      sx={{
                        p: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        bgcolor: habit.is_completed_today ? 'success.50' : 'background.paper',
                        border: 1,
                        borderColor: habit.is_completed_today ? 'success.200' : 'divider',
                      }}
                    >
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
                          <Typography variant="body2" color="text.secondary">
                            {habit.frequency} • {habit.points_per_completion} pts
                            {habit.streak > 0 && ` • ${habit.streak} day streak`}
                          </Typography>
                        </Box>
                      </Box>
                      {!habit.is_completed_today && (
                        <Button
                          onClick={() => completeHabit(habit.id)}
                          variant="contained"
                          color="success"
                          size="small"
                        >
                          Complete
                        </Button>
                      )}
                    </Paper>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                  <CalendarIcon />
                </Avatar>
                <Typography variant="h5" component="h3" sx={{ fontWeight: 600 }}>
                  Recent Activity
                </Typography>
              </Box>
              
              {recent_completions.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <Avatar sx={{ width: 80, height: 80, mx: 'auto', mb: 2, bgcolor: 'secondary.main' }}>
                    <CalendarIcon sx={{ fontSize: 40 }} />
                  </Avatar>
                  <Typography variant="h6" color="text.secondary">
                    No recent activity
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {recent_completions.map((completion) => (
                    <Paper
                      key={completion.id}
                      sx={{
                        p: 2,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        bgcolor: 'success.50',
                        border: 1,
                        borderColor: 'success.200',
                      }}
                    >
                      <Avatar sx={{ bgcolor: 'success.main' }}>
                        <CheckCircleIcon />
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {completion.habit_name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(completion.completed_at).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Paper>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Dashboard;
