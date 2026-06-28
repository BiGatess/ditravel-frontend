import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ProfileSidebar from '../components/profile/ProfileSidebar';
import ProfileInfo from '../components/profile/ProfileInfo';
import BookingHistory from '../components/profile/BookingHistory';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('info');

  return (
    <div className="bg-slate-50 min-h-screen pb-16 pt-8 font-sans">
      <div className="container mx-auto px-2 max-w-[1100px]">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[13px] text-[#0084ff] mb-6">
          <Link to="/" className="hover:underline">Trang chủ</Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-500">Tài khoản của tôi</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <ProfileSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          
          {activeTab === 'info' && <ProfileInfo />}
          {activeTab === 'history' && <BookingHistory />}
        </div>
      </div>
    </div>
  );
}
