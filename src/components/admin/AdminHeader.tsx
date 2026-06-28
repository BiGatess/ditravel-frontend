import React, { useState, useRef, useEffect } from 'react';
import { Bell, Search, Globe, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';

export default function AdminHeader() {
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
    <header className="h-[60px] bg-white border-b border-slate-200 sticky top-0 z-40 flex items-center justify-between px-6">
      <div className="flex-1 flex items-center">

      </div>
      
      <div className="flex items-center gap-3">
        <Link to="/" target="_blank" className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 text-[12px] font-bold rounded-full transition-colors mr-1 group">
          <Globe className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#ff5b00] transition-colors" />
          Xem website
        </Link>
        <button className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors group mr-2">
          <Bell className="w-5 h-5 group-hover:animate-bounce" />
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
