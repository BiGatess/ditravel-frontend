import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, KeyRound, Mail, RotateCcw } from 'lucide-react';
import axiosClient from '../api/axios';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [otpDigits, setOtpDigits] = useState<string[]>(Array(6).fill(''));
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);
  const otpCode = otpDigits.join('');

  useEffect(() => {
    if (step === 2) {
      window.setTimeout(() => otpRefs.current[0]?.focus(), 0);
    }
  }, [step]);

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

    if (otpDigits.some((digit) => !digit) || newPassword.length < 6) {
      setError('Vui lòng nhập đủ 6 số OTP và mật khẩu mới tối thiểu 6 ký tự.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Mật khẩu mới và xác nhận mật khẩu không khớp.');
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
      setOtpDigits(Array(6).fill(''));
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Không thể đặt lại mật khẩu. Vui lòng kiểm tra OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateOtpAt = (index: number, value: string) => {
    const digits = value.replace(/\D/g, '');
    setOtpDigits((prev) => {
      const next = [...prev];
      next[index] = digits.slice(-1);
      return next;
    });
    if (digits && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!otpDigits[index] && index > 0) {
        otpRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    e.preventDefault();
    const next = Array(6).fill('');
    pasted.split('').forEach((digit, idx) => {
      next[idx] = digit;
    });
    setOtpDigits(next);
    const focusIndex = Math.min(pasted.length, 5);
    window.setTimeout(() => otpRefs.current[focusIndex]?.focus(), 0);
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
            {step === 1 ? 'Nhập email để nhận mã OTP đặt lại mật khẩu.' : 'Nhập mã OTP 6 số đã gửi đến email của bạn, sau đó nhập mật khẩu mới.'}
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
            <div onPaste={handleOtpPaste} className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <label className="text-[13px] font-semibold text-slate-700">Mã OTP 6 số</label>
                <span className="text-[12px] text-slate-500">{otpDigits.filter(Boolean).length}/6</span>
              </div>
              <div className="grid grid-cols-6 gap-2">
                {Array.from({ length: 6 }).map((_, index) => (
                  <input
                    key={index}
                    ref={(el) => { otpRefs.current[index] = el; }}
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={1}
                    value={otpDigits[index] || ''}
                    onChange={(e) => updateOtpAt(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="h-[52px] rounded-lg border border-slate-200 bg-white text-center text-[18px] font-bold text-slate-800 outline-none transition-colors focus:border-[#ff5b00] focus:ring-2 focus:ring-[#ff5b00]/10"
                  />
                ))}
              </div>
              <p className="text-[12px] text-slate-500">Nhập từng số hoặc dán nguyên mã OTP vào một ô bất kỳ.</p>
            </div>
            <div className="space-y-3">
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Mật khẩu mới"
                className="w-full h-[48px] border border-slate-200 rounded-[6px] px-4 text-sm outline-none focus:border-[#ff5b00] focus:ring-1 focus:ring-[#ff5b00]"
              />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Xác nhận mật khẩu mới"
                className="w-full h-[48px] border border-slate-200 rounded-[6px] px-4 text-sm outline-none focus:border-[#ff5b00] focus:ring-1 focus:ring-[#ff5b00]"
              />
            </div>
            <button disabled={isLoading} className="w-full h-[48px] rounded-[6px] bg-[#ff5b00] text-white font-bold hover:bg-[#e05000] disabled:opacity-60">
              {isLoading ? 'Đang đổi mật khẩu...' : 'Đổi mật khẩu'}
            </button>
            <div className="flex flex-col gap-2 pt-1">
              <button type="button" onClick={handleSendOtp} disabled={isLoading} className="w-full h-[44px] rounded-[6px] border border-slate-200 text-[13px] font-semibold text-slate-700 hover:border-[#ff5b00] hover:text-[#ff5b00] disabled:opacity-60 inline-flex items-center justify-center gap-2">
                <RotateCcw className="w-4 h-4" />
                Gửi lại mã OTP
              </button>
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setOtpDigits(Array(6).fill(''));
                  setNewPassword('');
                  setConfirmPassword('');
                  setMessage('');
                  setError('');
                }}
                className="w-full text-[13px] text-slate-500 hover:text-[#0084ff]"
              >
                Đổi email khác
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
