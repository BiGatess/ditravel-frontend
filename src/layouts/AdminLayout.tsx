import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      <AdminSidebar />
      
      {/* Main Content Area - padded left by sidebar width */}
      <div className="flex-1 flex flex-col min-w-0 pl-[260px]">
        <AdminHeader />
        
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
