import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { KeyRound, Loader2, MapPin, Save } from 'lucide-react';
import axiosClient from '../../api/axios';
import { useAdminAuth } from '../../context/AdminAuthContext';

type ProfileForm = {
  full_name: string;
  phone: string;
  email: string;
  address: string;
  gender: string;
  dob: string;
};

type PasswordForm = {
  current_password: string;
  new_password: string;
  confirm_password: string;
};

const getErrorMessage = (err: any, fallback: string) => {
  const detail = err?.response?.data?.detail;
  return typeof detail === 'string' ? detail : fallback;
};

export default function ProfileInfo() {
  const { user, refreshUser } = useAdminAuth();
  const [profile, setProfile] = useState<ProfileForm>({
    full_name: user?.full_name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    address: user?.address || '',
    gender: 'male',
    dob: '1995-05-15',
  });
  const [password, setPassword] = useState<PasswordForm>({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState('');
  const [profileError, setProfileError] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    if (user) {
      setProfile((prev) => ({
        ...prev,
        full_name: user.full_name || '',
        phone: user.phone || '',
        email: user.email || '',
        address: user.address || '',
      }));
    }
  }, [user]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMessage('');
    setProfileError('');

    try {
      await axiosClient.patch('/auth/me', {
        full_name: profile.full_name.trim(),
        email: profile.email.trim(),
        address: profile.address.trim() || null,
      });
      await refreshUser();
      setProfileMessage('Đã lưu thông tin cá nhân và địa chỉ.');
    } catch (err) {
      setProfileError(getErrorMessage(err, 'Không thể lưu thông tin. Vui lòng thử lại sau.'));
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSaving(true);
    setPasswordMessage('');
    setPasswordError('');

    if (password.new_password.length < 6) {
      setPasswordError('Mật khẩu mới phải có ít nhất 6 ký tự.');
      setPasswordSaving(false);
      return;
    }

    if (password.new_password !== password.confirm_password) {
      setPasswordError('Mật khẩu xác nhận không khớp.');
      setPasswordSaving(false);
      return;
    }

    try {
      await axiosClient.post('/auth/change-password', {
        current_password: password.current_password,
        new_password: password.new_password,
      });
      setPassword({ current_password: '', new_password: '', confirm_password: '' });
      setPasswordMessage('Đã đổi mật khẩu thành công.');
    } catch (err) {
      setPasswordError(getErrorMessage(err, 'Không thể đổi mật khẩu. Vui lòng thử lại sau.'));
    } finally {
      setPasswordSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 p-6"
    >
      <form onSubmit={handleProfileSubmit}>
        <h2 className="text-xl font-bold text-slate-800 mb-6 pb-4 border-b border-slate-100">Thông tin cá nhân</h2>

        {profileMessage && (
          <div className="mb-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-[13px] font-medium text-emerald-700">
            {profileMessage}
          </div>
        )}
        {profileError && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-medium text-red-600">
            {profileError}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
          <div className="space-y-1.5">
            <label className="text-[13px] font-semibold text-slate-700">Họ và tên</label>
            <input
              type="text"
              value={profile.full_name}
              onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
              className="w-full border border-slate-300 rounded-lg p-3 text-[14px] outline-none focus:border-[#ff5b00] focus:ring-1 focus:ring-[#ff5b00] transition-shadow"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-semibold text-slate-700">Số điện thoại</label>
            <input
              type="tel"
              value={profile.phone}
              className="w-full border border-slate-300 rounded-lg p-3 text-[14px] outline-none bg-slate-50 text-slate-500"
              disabled
            />
            <p className="text-[11px] text-slate-500">Số điện thoại không thể thay đổi</p>
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="text-[13px] font-semibold text-slate-700">Email</label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="w-full border border-slate-300 rounded-lg p-3 text-[14px] outline-none focus:border-[#ff5b00] focus:ring-1 focus:ring-[#ff5b00] transition-shadow"
              required
            />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="text-[13px] font-semibold text-slate-700 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#ff5b00]" />
              Địa chỉ mặc định
            </label>
            <textarea
              value={profile.address}
              onChange={(e) => setProfile({ ...profile, address: e.target.value })}
              rows={3}
              className="w-full border border-slate-300 rounded-lg p-3 text-[14px] outline-none focus:border-[#ff5b00] focus:ring-1 focus:ring-[#ff5b00] transition-shadow resize-none"
              placeholder="Nhập địa chỉ để tự điền khi thanh toán"
            />
            <p className="text-[11px] text-slate-500">Địa chỉ này sẽ tự điền ở bước thanh toán sau khi bạn đăng nhập.</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-semibold text-slate-700">Ngày sinh</label>
            <input
              type="date"
              value={profile.dob}
              onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
              className="w-full border border-slate-300 rounded-lg p-3 text-[14px] outline-none focus:border-[#ff5b00] focus:ring-1 focus:ring-[#ff5b00] transition-shadow"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-semibold text-slate-700 block mb-2">Giới tính</label>
            <div className="flex flex-wrap gap-5 pt-2">
              {[
                { value: 'male', label: 'Nam' },
                { value: 'female', label: 'Nữ' },
                { value: 'other', label: 'Khác' },
              ].map((option) => (
                <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value={option.value}
                    checked={profile.gender === option.value}
                    onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                    className="text-[#ff5b00] focus:ring-[#ff5b00] cursor-pointer"
                  />
                  <span className="text-[14px] text-slate-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={profileSaving}
            className="bg-[#ff5b00] hover:bg-[#e05000] disabled:bg-[#ff8a45] disabled:cursor-wait text-white font-bold py-2.5 px-6 rounded-lg transition-colors flex items-center gap-2 shadow-sm"
          >
            {profileSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {profileSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </div>
      </form>

      <form onSubmit={handlePasswordSubmit} className="mt-10 pt-8 border-t border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
          <KeyRound className="w-5 h-5 text-[#ff5b00]" />
          Đổi mật khẩu
        </h3>

        {passwordMessage && (
          <div className="mb-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-[13px] font-medium text-emerald-700">
            {passwordMessage}
          </div>
        )}
        {passwordError && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-medium text-red-600">
            {passwordError}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-3xl">
          <div className="space-y-1.5">
            <label className="text-[13px] font-semibold text-slate-700">Mật khẩu hiện tại</label>
            <input
              type="password"
              value={password.current_password}
              onChange={(e) => setPassword({ ...password, current_password: e.target.value })}
              className="w-full border border-slate-300 rounded-lg p-3 text-[14px] outline-none focus:border-[#ff5b00] focus:ring-1 focus:ring-[#ff5b00] transition-shadow"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[13px] font-semibold text-slate-700">Mật khẩu mới</label>
            <input
              type="password"
              value={password.new_password}
              onChange={(e) => setPassword({ ...password, new_password: e.target.value })}
              className="w-full border border-slate-300 rounded-lg p-3 text-[14px] outline-none focus:border-[#ff5b00] focus:ring-1 focus:ring-[#ff5b00] transition-shadow"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[13px] font-semibold text-slate-700">Nhập lại mật khẩu mới</label>
            <input
              type="password"
              value={password.confirm_password}
              onChange={(e) => setPassword({ ...password, confirm_password: e.target.value })}
              className="w-full border border-slate-300 rounded-lg p-3 text-[14px] outline-none focus:border-[#ff5b00] focus:ring-1 focus:ring-[#ff5b00] transition-shadow"
              required
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={passwordSaving}
            className="bg-slate-800 hover:bg-slate-700 disabled:bg-slate-500 disabled:cursor-wait text-white font-bold py-2.5 px-6 rounded-lg transition-colors flex items-center gap-2 shadow-sm"
          >
            {passwordSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
            {passwordSaving ? 'Đang đổi...' : 'Đổi mật khẩu'}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
