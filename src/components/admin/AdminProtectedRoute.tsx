import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';

export default function AdminProtectedRoute() {
  const { isAuthenticated, user } = useAdminAuth();

  if (!isAuthenticated) {
    // Redirect to login page and replace the history state
    return <Navigate to="/admin/login" replace />;
  }

  if (user && user.user_type !== 'ADMIN') {
    // Redirect standard users to home page
    return <Navigate to="/" replace />;
  }

  // If authenticated and is admin, render the child routes
  return <Outlet />;
}
