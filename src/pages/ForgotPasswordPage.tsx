import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, KeyRound, Mail } from 'lucide-react';
import axiosClient from '../api/axios';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!email.trim()) {
      setError('Vui lòng nhập email.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await axiosClient.post('/auth/forgot-password', { email: email.trim() });
      setMessage(res.data?.message || 'Nếu email hợp lệ, mã OTP đã được gửi.');
      setStep(2);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Không thể gửi OTP. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!otpCode.trim() || newPassword.length < 6) {
      setError('Vui lòng nhập OTP và mật khẩu mới tối thiểu 6 ký tự.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await axiosClient.post('/auth/reset-password', {
        email: email.trim(),
        otp_code: otpCode.trim(),
        new_password: newPassword,
      });
      setMessage(res.data?.message || 'Đổi mật khẩu thành công.');
      setOtpCode('');
      setNewPassword('');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Không thể đặt lại mật khẩu. Vui lòng kiểm tra OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-60px)] bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-[460px] w-full bg-white rounded-[12px] shadow-[0_5px_30px_rgba(0,0,0,0.05)] p-8 border border-slate-100">
        <Link to="/login" className="inline-flex items-center gap-2 text-[13px] text-slate-500 hover:text-[#ff5b00] mb-6">
          <ArrowLeft className="w-4 h-4" /> Quay lại đăng nhập
        </Link>

        <div className="mb-6">
          <div className="w-12 h-12 rounded-full bg-orange-50 text-[#ff5b00] flex items-center justify-center mb-4">
            {step === 1 ? <Mail className="w-6 h-6" /> : <KeyRound className="w-6 h-6" />}
          </div>
          <h1 className="text-[24px] font-bold text-slate-800">Quên mật khẩu</h1>
          <p className="text-[14px] text-slate-500 mt-1">
            {step === 1 ? 'Nhập email để nhận mã OTP đặt lại mật khẩu.' : 'Nhập OTP đã nhận và mật khẩu mới.'}
          </p>
        </div>

        {message && <div className="mb-4 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-[13px] text-blue-700">{message}</div>}
        {error && <div className="mb-4 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-[13px] text-red-600">{error}</div>}

        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email tài khoản"
              className="w-full h-[48px] border border-slate-200 rounded-[6px] px-4 text-sm outline-none focus:border-[#ff5b00] focus:ring-1 focus:ring-[#ff5b00]"
            />
            <button disabled={isLoading} className="w-full h-[48px] rounded-[6px] bg-[#ff5b00] text-white font-bold hover:bg-[#e05000] disabled:opacity-60">
              {isLoading ? 'Đang gửi...' : 'Gửi mã OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <input
              type="text"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="Mã OTP 6 số"
              className="w-full h-[48px] border border-slate-200 rounded-[6px] px-4 text-sm outline-none focus:border-[#ff5b00] focus:ring-1 focus:ring-[#ff5b00]"
            />
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Mật khẩu mới"
              className="w-full h-[48px] border border-slate-200 rounded-[6px] px-4 text-sm outline-none focus:border-[#ff5b00] focus:ring-1 focus:ring-[#ff5b00]"
            />
            <button disabled={isLoading} className="w-full h-[48px] rounded-[6px] bg-[#ff5b00] text-white font-bold hover:bg-[#e05000] disabled:opacity-60">
              {isLoading ? 'Đang đổi mật khẩu...' : 'Đổi mật khẩu'}
            </button>
            <button type="button" onClick={() => setStep(1)} className="w-full text-[13px] text-slate-500 hover:text-[#0084ff]">
              Gửi lại OTP bằng email khác
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
