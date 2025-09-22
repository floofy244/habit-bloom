import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box, CircularProgress } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import theme from './theme';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';

// lazy-load Dashboard (code-split)
const Dashboard = lazy(() => import('./pages/Dashboard'));
// keep other pages as normal (or lazy-load them too)
const Habits = lazy(() => import('./pages/Habits'));
const Profile = lazy(() => import('./pages/Profile'));

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
        bgcolor="background.default"
      >
        <CircularProgress size={40} />
      </Box>
    );
  }
  
  return user ? children : <Navigate to="/login" />;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
        bgcolor="background.default"
      >
        <CircularProgress size={40} />
      </Box>
    );
  }
  
  return user ? <Navigate to="/dashboard" /> : children;
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            <Navbar />
            <Box component="main" sx={{ flexGrow: 1, pt: 2 }}>
              <Suspense fallback={
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                  <CircularProgress />
                </Box>
              }>
                <Routes>
                  <Route path="/login" element={
                    <PublicRoute>
                      <Login />
                    </PublicRoute>
                  } />
                  <Route path="/register" element={
                    <PublicRoute>
                      <Register />
                    </PublicRoute>
                  } />
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/habits" element={
                    <ProtectedRoute>
                      <Habits />
                    </ProtectedRoute>
                  } />
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } />
                  <Route path="/" element={<Navigate to="/dashboard" />} />
                </Routes>
              </Suspense>
            </Box>
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
          </Box>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
