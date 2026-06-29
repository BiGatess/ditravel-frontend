import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  CalendarDays,
  KeyRound,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Save,
  ShieldCheck,
  UserRound,
} from 'lucide-react';
import axiosClient from '../../api/axios';
import { useAdminAuth } from '../../context/AdminAuthContext';

type ProfileForm = {
  full_name: string;
  phone: string;
  email: string;
  address: string;
  gender: string;
  birth_date: string;
};

type PasswordForm = {
  current_password: string;
  new_password: string;
  confirm_password: string;
};

const genderOptions = [
  { value: 'male', label: 'Nam' },
  { value: 'female', label: 'Nữ' },
  { value: 'other', label: 'Khác' },
];

const inputClass =
  'h-11 w-full rounded-lg border border-slate-200 bg-white px-3 pl-10 text-[14px] text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-[#ff5b00] focus:ring-2 focus:ring-[#ff5b00]/15';

const passwordInputClass =
  'h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-[14px] text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-[#ff5b00] focus:ring-2 focus:ring-[#ff5b00]/15';

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
    gender: user?.gender || '',
    birth_date: user?.birth_date || '',
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
        gender: user.gender || '',
        birth_date: user.birth_date || '',
      }));
    }
  }, [user]);

  const displayName = profile.full_name.trim() || user?.full_name || 'Người dùng';
  const avatarLabel = displayName.trim().charAt(0).toUpperCase() || 'U';

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
        gender: profile.gender || null,
        birth_date: profile.birth_date || null,
      });
      await refreshUser();
      setProfileMessage('Đã lưu thông tin cá nhân.');
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
      className="flex-1 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
    >
      <div className="border-b border-slate-100 bg-[linear-gradient(135deg,#fff7ed_0%,#ffffff_48%,#eff6ff_100%)] px-5 py-5 md:px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-[#ff5b00] text-2xl font-bold text-white shadow-sm">
              {avatarLabel}
            </div>
            <div className="min-w-0">
              <h2 className="truncate text-[22px] font-bold leading-tight text-slate-900">{displayName}</h2>
              <div className="mt-1 flex min-w-0 items-center gap-2 text-[13px] text-slate-500">
                <Mail className="h-4 w-4 shrink-0 text-[#0084ff]" />
                <span className="truncate">{profile.email || user?.email || 'Chưa có email'}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[13px] font-semibold text-emerald-700">
            <ShieldCheck className="h-4 w-4" />
            <span>Đã đăng nhập</span>
          </div>
        </div>
      </div>

      <div className="p-5 md:p-6">
        <form onSubmit={handleProfileSubmit}>
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h3 className="text-[18px] font-bold text-slate-900">Hồ sơ cá nhân</h3>
            </div>
          </div>

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

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-slate-700">Họ và tên</label>
              <div className="relative">
                <UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={profile.full_name}
                  onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                  className={inputClass}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-slate-700">Email</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className={inputClass}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-slate-700">Số điện thoại</label>
              <div className="relative">
                <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="tel"
                  value={profile.phone}
                  className={`${inputClass} cursor-not-allowed bg-slate-50 text-slate-500`}
                  placeholder="Chưa cập nhật"
                  disabled
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-[13px] font-semibold text-slate-700">Ngày sinh</label>
                <div className="relative">
                  <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="date"
                    value={profile.birth_date}
                    onChange={(e) => setProfile({ ...profile, birth_date: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[13px] font-semibold text-slate-700">Giới tính</label>
                <div className="grid h-11 grid-cols-3 gap-1 rounded-lg bg-slate-100 p-1">
                  {genderOptions.map((option) => {
                    const isSelected = profile.gender === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setProfile({ ...profile, gender: option.value })}
                        className={`rounded-md px-2 text-[13px] font-semibold transition-all ${
                          isSelected
                            ? 'bg-white text-[#ff5b00] shadow-sm ring-1 ring-slate-200'
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="space-y-1.5 lg:col-span-2">
              <label className="text-[13px] font-semibold text-slate-700">Địa chỉ mặc định</label>
              <div className="relative">
                <MapPin className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                <textarea
                  value={profile.address}
                  onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                  rows={3}
                  className="min-h-[96px] w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-3 pl-10 text-[14px] text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-[#ff5b00] focus:ring-2 focus:ring-[#ff5b00]/15"
                  placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end border-t border-slate-100 pt-5">
            <button
              type="submit"
              disabled={profileSaving}
              className="inline-flex h-11 min-w-[150px] items-center justify-center gap-2 rounded-lg bg-[#ff5b00] px-5 text-[14px] font-bold text-white shadow-sm transition-all hover:bg-[#e05000] disabled:cursor-wait disabled:bg-[#ff8a45]"
            >
              {profileSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {profileSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>

        <form onSubmit={handlePasswordSubmit} className="mt-8 border-t border-slate-200 pt-6">
          <div className="mb-5 flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-[#0084ff]" />
            <h3 className="text-[18px] font-bold text-slate-900">Đổi mật khẩu</h3>
          </div>

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

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-slate-700">Mật khẩu hiện tại</label>
              <input
                type="password"
                value={password.current_password}
                onChange={(e) => setPassword({ ...password, current_password: e.target.value })}
                className={passwordInputClass}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-slate-700">Mật khẩu mới</label>
              <input
                type="password"
                value={password.new_password}
                onChange={(e) => setPassword({ ...password, new_password: e.target.value })}
                className={passwordInputClass}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-slate-700">Nhập lại mật khẩu mới</label>
              <input
                type="password"
                value={password.confirm_password}
                onChange={(e) => setPassword({ ...password, confirm_password: e.target.value })}
                className={passwordInputClass}
                required
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={passwordSaving}
              className="inline-flex h-11 min-w-[150px] items-center justify-center gap-2 rounded-lg bg-slate-900 px-5 text-[14px] font-bold text-white shadow-sm transition-all hover:bg-slate-800 disabled:cursor-wait disabled:bg-slate-500"
            >
              {passwordSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
              {passwordSaving ? 'Đang đổi...' : 'Đổi mật khẩu'}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
