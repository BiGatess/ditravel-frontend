import React, { useState } from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProfileSidebar from '../components/profile/ProfileSidebar';
import ProfileInfo from '../components/profile/ProfileInfo';
import BookingHistory from '../components/profile/BookingHistory';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('info');
  const navigate = useNavigate();
  const { user, isInitializing, logout } = useAdminAuth();

  useEffect(() => {
    if (!isInitializing && !user) {
      navigate('/', { replace: true });
    }
  }, [isInitializing, navigate, user]);

  return (
    <div className="bg-slate-50 min-h-screen pb-16 pt-8 font-sans">
      <div className="container mx-auto px-2 max-w-[1100px]">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[13px] text-[#0084ff] mb-6">
          <Link to="/" className="hover:underline">Trang chủ</Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-500">Tài khoản của tôi</span>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-2 lg:hidden">
          <button
            type="button"
            onClick={() => setActiveTab('info')}
            className={`rounded-xl border px-4 py-3 text-[14px] font-semibold transition-colors ${activeTab === 'info' ? 'border-[#ff5b00] bg-orange-50 text-[#ff5b00]' : 'border-slate-200 bg-white text-slate-600'}`}
          >
            Thông tin
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`rounded-xl border px-4 py-3 text-[14px] font-semibold transition-colors ${activeTab === 'history' ? 'border-[#ff5b00] bg-orange-50 text-[#ff5b00]' : 'border-slate-200 bg-white text-slate-600'}`}
          >
            Lịch sử
          </button>
          <button
            type="button"
            onClick={() => {
              logout();
              navigate('/', { replace: true });
            }}
            className="col-span-2 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-[14px] font-semibold text-rose-600"
          >
            Đăng xuất
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="hidden lg:block">
            <ProfileSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
          
          {activeTab === 'info' && <ProfileInfo />}
          {activeTab === 'history' && <BookingHistory />}
        </div>
      </div>
    </div>
  );
}
