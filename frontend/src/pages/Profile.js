import React, { useState, useEffect } from 'react';
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
  Avatar,
  LinearProgress,
  Divider,
  Chip,
  Paper,
  CircularProgress,
} from '@mui/material';
import {
  Person as UserIcon,
  EmojiEvents as AwardIcon,
  Assignment as TargetIcon,
  TrendingUp as TrendingUpIcon,
  Star as StarIcon,
  MilitaryTech as TrophyIcon,
  LocalFireDepartment as FireIcon,
} from '@mui/icons-material';

function Profile() {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const response = await api.get('habits/dashboard/');
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
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress size={40} />
      </Box>
    );
  }

  if (!profileData) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography variant="h6" color="error">
          Failed to load profile
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
    habits 
  } = profileData;

  const completionRate = total_habits > 0 ? (completed_today / total_habits) * 100 : 0;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Profile Header */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: 'primary.main',
                fontSize: '2rem',
                fontWeight: 'bold',
              }}
            >
              {user?.username?.charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
                {user?.username}
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                {user?.email}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Chip
                  icon={<StarIcon />}
                  label={`Level ${current_level}`}
                  color="warning"
                  variant="outlined"
                />
                <Chip
                  icon={<AwardIcon />}
                  label={`${total_points} points`}
                  color="secondary"
                  variant="outlined"
                />
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
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
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                  <TrendingUpIcon />
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
          <Card>
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
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                  <TrophyIcon />
                </Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 600 }}>
                    Completion Rate
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
                    {completionRate.toFixed(0)}%
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
          <Typography variant="h5" component="h3" sx={{ mb: 3, fontWeight: 600 }}>
            Level Progress
          </Typography>
          <Box sx={{ mb: 3 }}>
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
            <Typography variant="body2" color="text.secondary">
              {level_progress.needed - level_progress.current} more points to reach level {current_level + 1}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Habit Statistics */}
      <Grid container spacing={4}>
        {/* Habit Streaks */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="h3" sx={{ mb: 3, fontWeight: 600 }}>
                Habit Streaks
              </Typography>
              {habits.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <TargetIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                  <Typography variant="body1" color="text.secondary">
                    No habits to display
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {habits
                    .filter(habit => habit.streak > 0)
                    .sort((a, b) => b.streak - a.streak)
                    .map((habit) => (
                      <Paper
                        key={habit.id}
                        sx={{
                          p: 2,
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          bgcolor: 'background.paper',
                        }}
                      >
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {habit.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {habit.frequency}
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="h6" color="success.main" sx={{ fontWeight: 600 }}>
                            {habit.streak} days
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            streak
                          </Typography>
                        </Box>
                      </Paper>
                    ))}
                  {habits.filter(habit => habit.streak > 0).length === 0 && (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <Typography variant="body1" color="text.secondary">
                        No active streaks yet
                      </Typography>
                      <Typography variant="body2" color="text.disabled">
                        Complete habits consistently to build streaks!
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Account Information */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="h3" sx={{ mb: 3, fontWeight: 600 }}>
                Account Information
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Member since
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {new Date(user?.created_at).toLocaleDateString()}
                  </Typography>
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Current level
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Level {current_level}
                  </Typography>
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Total points earned
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {total_points}
                  </Typography>
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Habits created
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {total_habits}
                  </Typography>
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Today's completion rate
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {completionRate.toFixed(0)}%
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Profile;
