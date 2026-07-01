import React, { useState, useRef, useEffect } from 'react';
import { Bell, ExternalLink, LogOut, Menu } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';

export default function AdminHeader({ onOpenSidebar }: { onOpenSidebar: () => void }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <header className="h-[60px] bg-white border-b border-slate-200 sticky top-0 z-40 flex items-center justify-between px-4 sm:px-6">
      <div className="flex-1 flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="md:hidden grid h-9 w-9 place-items-center rounded-lg bg-slate-50 text-slate-600 hover:bg-slate-100"
          aria-label="Mở menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>
      
      <div className="flex items-center gap-3">
        <Link to="/" target="_blank" className="hidden sm:flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-[12px] font-bold text-slate-700 transition-colors hover:bg-orange-50 hover:text-[#ff5b00] group">
          <ExternalLink className="h-4 w-4 text-slate-400 transition-colors group-hover:text-[#ff5b00]" strokeWidth={2.2} />
          Xem website
        </Link>
        <button className="relative grid h-9 w-9 place-items-center rounded-lg bg-slate-50 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 mr-2" aria-label="Thông báo">
          <Bell className="h-[18px] w-[18px]" strokeWidth={2.2} />
          <span className="absolute top-1 right-1.5 w-2.5 h-2.5 bg-[#ff5b00] rounded-full border-2 border-white"></span>
        </button>
        
        <div className="relative" ref={profileRef}>
          <div 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2.5 pl-4 border-l border-slate-200 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#0084ff] to-[#005bb5] text-white flex items-center justify-center font-bold text-[13px] shadow-sm uppercase">
              {user?.full_name ? user.full_name.substring(0, 2) : 'AD'}
            </div>
            <div className="hidden sm:block">
              <div className="text-[13px] font-bold text-slate-800 leading-tight group-hover:text-[#0084ff] transition-colors">{user?.full_name || 'Admin'}</div>
              <div className="text-[11px] text-slate-500">{user?.email || 'admin@ditravel.vn'}</div>
            </div>
          </div>

          {isProfileOpen && (
            <div className="absolute top-full right-0 mt-3 w-[160px] bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-50 animate-in fade-in zoom-in-95">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-red-600 hover:bg-red-50 font-bold transition-colors"
              >
                <LogOut className="w-4 h-4" /> Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
