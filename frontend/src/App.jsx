import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, Spinner } from '@chakra-ui/react';
import Login from './components/Login';
// import NLogin from './components/NLogin';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import { useAuth } from './context/AuthContext';
import './index.css';

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Spinner size="xl" />
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If user is not in an allowed role, redirect to their default page
    return user.role === 'admin' ? <Navigate to="/admin" /> : <Navigate to="/" />;
  }

  return children;
};


function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />

      {/* User Dashboard */}
      <Route
        path="/"
        element={<PrivateRoute allowedRoles={['user']}><Dashboard /></PrivateRoute>}
      />

      {/* Admin Dashboard */}
      <Route
        path="/admin/*" // Note the wildcard for nested admin routes
        element={<PrivateRoute allowedRoles={['admin']}><AdminDashboard /></PrivateRoute>}
      />

      {/* Default redirect for logged-in users */}
      <Route path="*" element={<Navigate to={user?.role === 'admin' ? '/admin' : '/'} />} />
    </Routes>
  );
}

export default App;