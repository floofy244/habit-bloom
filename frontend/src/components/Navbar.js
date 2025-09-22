import React, { memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Chip,
  Container,
} from '@mui/material';
import {
  Home as HomeIcon,
  Assignment as HabitsIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Spa as LogoIcon,
} from '@mui/icons-material';

const Navbar = memo(function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };


  return (
    <AppBar position="sticky" elevation={1}>
      <Container maxWidth="lg">
        <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
          <Box component={Link} to="/" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
            <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
              <LogoIcon />
            </Avatar>
            <Typography variant="h5" component="div" sx={{ fontWeight: 600, color: 'text.primary' }}>
              HabitBloom
            </Typography>
          </Box>

          {user ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Chip
                label={`Level ${user.current_level}`}
                color="primary"
                variant="outlined"
                size="small"
              />
              <Chip
                label={`${user.total_points} pts`}
                color="secondary"
                size="small"
              />
              
              <Button
                component={Link}
                to="/dashboard"
                startIcon={<HomeIcon />}
                sx={{ color: 'text.secondary' }}
              >
                Dashboard
              </Button>
              
              <Button
                component={Link}
                to="/habits"
                startIcon={<HabitsIcon />}
                sx={{ color: 'text.secondary' }}
              >
                Habits
              </Button>
              
              <Button
                component={Link}
                to="/profile"
                startIcon={<PersonIcon />}
                sx={{ color: 'text.secondary' }}
              >
                Profile
              </Button>
              
              <Button
                onClick={handleLogout}
                startIcon={<LogoutIcon />}
                color="error"
              >
                Logout
              </Button>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button
                component={Link}
                to="/login"
                color="inherit"
                sx={{ color: 'text.secondary' }}
              >
                Login
              </Button>
              <Button
                component={Link}
                to="/register"
                variant="contained"
                color="primary"
              >
                Sign Up
              </Button>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
});

export default Navbar;
