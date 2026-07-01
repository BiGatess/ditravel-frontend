import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';

export default function AdminProtectedRoute() {
  const { isAuthenticated, user, isInitializing } = useAdminAuth();
  const userType = String(user?.user_type || user?.userType || '').toUpperCase();

  if (isInitializing) {
    return (
      <div className="min-h-screen grid place-items-center bg-slate-50 text-slate-500">
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-[#ff5b00]" />
          <span className="text-[13px] font-medium">Đang kiểm tra đăng nhập...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page and replace the history state
    return <Navigate to="/admin/login" replace />;
  }

  if (user && userType !== 'ADMIN') {
    // Redirect standard users to home page
    return <Navigate to="/" replace />;
  }

  // If authenticated and is admin, render the child routes
  return <Outlet />;
}
