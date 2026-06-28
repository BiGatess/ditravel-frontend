import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Save } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

export default function ProfileInfo() {
  const { user } = useAdminAuth();
  const [info, setInfo] = useState({
    name: user?.full_name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    gender: 'male',
    dob: '1995-05-15'
  });

  useEffect(() => {
    if (user) {
      setInfo(prev => ({
        ...prev,
        name: user.full_name || '',
        phone: user.phone || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h2 className="text-xl font-bold text-slate-800 mb-6 pb-4 border-b border-slate-100">Thông tin cá nhân</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
        <div className="space-y-1.5">
          <label className="text-[13px] font-semibold text-slate-700">Họ và tên</label>
          <input 
            type="text" 
            value={info.name}
            onChange={(e) => setInfo({...info, name: e.target.value})}
            className="w-full border border-slate-300 rounded-lg p-3 text-[14px] outline-none focus:border-[#ff5b00] focus:ring-1 focus:ring-[#ff5b00] transition-shadow"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[13px] font-semibold text-slate-700">Số điện thoại</label>
          <input 
            type="tel" 
            value={info.phone}
            onChange={(e) => setInfo({...info, phone: e.target.value})}
            className="w-full border border-slate-300 rounded-lg p-3 text-[14px] outline-none focus:border-[#ff5b00] focus:ring-1 focus:ring-[#ff5b00] transition-shadow bg-slate-50"
            disabled
          />
          <p className="text-[11px] text-slate-500">Số điện thoại không thể thay đổi</p>
        </div>

        <div className="space-y-1.5">
          <label className="text-[13px] font-semibold text-slate-700">Email</label>
          <input 
            type="email" 
            value={info.email}
            onChange={(e) => setInfo({...info, email: e.target.value})}
            className="w-full border border-slate-300 rounded-lg p-3 text-[14px] outline-none focus:border-[#ff5b00] focus:ring-1 focus:ring-[#ff5b00] transition-shadow"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[13px] font-semibold text-slate-700">Ngày sinh</label>
          <input 
            type="date" 
            value={info.dob}
            onChange={(e) => setInfo({...info, dob: e.target.value})}
            className="w-full border border-slate-300 rounded-lg p-3 text-[14px] outline-none focus:border-[#ff5b00] focus:ring-1 focus:ring-[#ff5b00] transition-shadow"
          />
        </div>

        <div className="space-y-1.5 md:col-span-2">
          <label className="text-[13px] font-semibold text-slate-700 block mb-2">Giới tính</label>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="gender" 
                value="male"
                checked={info.gender === 'male'}
                onChange={(e) => setInfo({...info, gender: e.target.value})}
                className="text-[#ff5b00] focus:ring-[#ff5b00] cursor-pointer"
              />
              <span className="text-[14px] text-slate-700">Nam</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="gender" 
                value="female"
                checked={info.gender === 'female'}
                onChange={(e) => setInfo({...info, gender: e.target.value})}
                className="text-[#ff5b00] focus:ring-[#ff5b00] cursor-pointer"
              />
              <span className="text-[14px] text-slate-700">Nữ</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="gender" 
                value="other"
                checked={info.gender === 'other'}
                onChange={(e) => setInfo({...info, gender: e.target.value})}
                className="text-[#ff5b00] focus:ring-[#ff5b00] cursor-pointer"
              />
              <span className="text-[14px] text-slate-700">Khác</span>
            </label>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
        <button className="bg-[#ff5b00] hover:bg-[#e05000] text-white font-bold py-2.5 px-6 rounded-lg transition-colors flex items-center gap-2 shadow-sm">
          <Save className="w-4 h-4" />
          Lưu thay đổi
        </button>
      </div>
    </motion.div>
  );
}
