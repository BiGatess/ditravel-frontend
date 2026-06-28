import React from 'react';
import { User, ShoppingBag, Heart, LogOut } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

interface ProfileSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function ProfileSidebar({ activeTab, setActiveTab }: ProfileSidebarProps) {
  const { user, logout } = useAdminAuth();
  
  const tabs = [
    { id: 'info', label: 'Thông tin cá nhân', icon: User },
    { id: 'history', label: 'Lịch sử đặt vé', icon: ShoppingBag },
  ];

  return (
    <aside className="w-full lg:w-[260px] shrink-0">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center gap-3 bg-slate-50">
          <div className="w-12 h-12 rounded-full bg-[#ff5b00]/10 text-[#ff5b00] flex items-center justify-center font-bold text-xl shrink-0 uppercase">
            {user?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
          </div>
          <div className="overflow-hidden">
            <div className="font-bold text-slate-800 text-[15px] truncate" title={user?.full_name || 'Người dùng'}>{user?.full_name || 'Người dùng'}</div>
            <div className="text-[12px] text-slate-500 mt-0.5 truncate" title={user?.email}>{user?.email}</div>
          </div>
        </div>
        
        <div className="py-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-5 py-3.5 text-[14px] transition-colors ${
                activeTab === tab.id 
                  ? 'text-[#ff5b00] font-semibold bg-orange-50/50 border-r-2 border-[#ff5b00]' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
          
          <button
            onClick={() => {
              logout();
              window.location.href = '/login';
            }}
            className="w-full flex items-center gap-3 px-5 py-3.5 text-[14px] text-red-500 hover:bg-red-50 transition-colors mt-2 border-t border-slate-100"
          >
            <LogOut className="w-4 h-4" />
            Đăng xuất
          </button>
        </div>
      </div>
    </aside>
  );
}
