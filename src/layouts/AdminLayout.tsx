import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      {isSidebarOpen && (
        <button
          type="button"
          aria-label="Đóng menu"
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
        />
      )}

      {/* Main Content Area - padded left by sidebar width */}
      <div className="flex-1 flex flex-col min-w-0 md:pl-[260px]">
        <AdminHeader onOpenSidebar={() => setIsSidebarOpen(true)} />
        
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
