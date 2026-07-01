import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock3, KeyRound, Mail, RefreshCcw, ShieldCheck } from 'lucide-react';
import axiosClient from '../api/axios';

const OTP_LENGTH = 6;
const OTP_TTL_SECONDS = 60;

function formatSeconds(seconds: number) {
  const safeSeconds = Math.max(seconds, 0);
  const minutes = Math.floor(safeSeconds / 60)
    .toString()
    .padStart(2, '0');
  const secs = (safeSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${secs}`;
}

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState('');
  const [otpDigits, setOtpDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);

  const otpCode = otpDigits.join('');
  const otpComplete = otpDigits.every((digit) => digit);

  useEffect(() => {
    if (step !== 2 || otpVerified || secondsLeft <= 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setSecondsLeft((current) => Math.max(current - 1, 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [step, otpVerified, secondsLeft]);

  useEffect(() => {
    if (step === 2) {
      window.setTimeout(() => otpRefs.current[0]?.focus(), 0);
    }
  }, [step]);

  const resetOtpState = () => {
    setOtpDigits(Array(OTP_LENGTH).fill(''));
    setSecondsLeft(0);
    setResetToken('');
    setOtpVerified(false);
  };

  const resetPasswordFields = () => {
    setNewPassword('');
    setConfirmPassword('');
  };

  const startOtpFlow = () => {
    setStep(2);
    setMessage('Mã OTP đã được gửi. Mã có hiệu lực trong 60 giây.');
    setError('');
    setOtpDigits(Array(OTP_LENGTH).fill(''));
    setSecondsLeft(OTP_TTL_SECONDS);
    setResetToken('');
    setOtpVerified(false);
    resetPasswordFields();
    window.setTimeout(() => otpRefs.current[0]?.focus(), 0);
  };

  const sendOtpRequest = async () => {
    setError('');
    setMessage('');

    if (!email.trim()) {
      setError('Vui lòng nhập email.');
      return;
    }

    setIsSendingOtp(true);
    try {
      const res = await axiosClient.post('/auth/forgot-password', { email: email.trim() });
      startOtpFlow();
      setMessage(res.data?.message || 'Mã OTP đã được gửi tới email của bạn.');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Không thể gửi OTP. Vui lòng thử lại.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendOtpRequest();
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (secondsLeft <= 0) {
      setError('Mã OTP đã hết hạn. Vui lòng gửi lại mã mới.');
      return;
    }

    if (!otpComplete) {
      setError('Vui lòng nhập đủ 6 chữ số OTP.');
      return;
    }

    setIsVerifyingOtp(true);
    try {
      const res = await axiosClient.post('/auth/verify-reset-otp', {
        email: email.trim(),
        otp_code: otpCode,
      });

      const token = res.data?.reset_token;
      if (!token) {
        throw new Error('Thiếu mã xác minh đặt lại mật khẩu.');
      }

      setResetToken(token);
      setOtpVerified(true);
      setStep(3);
      setMessage(res.data?.message || 'OTP hợp lệ. Bạn có thể nhập mật khẩu mới.');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'OTP không đúng hoặc đã hết hạn.');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!otpVerified || !resetToken) {
      setError('Bạn cần xác minh OTP trước khi đổi mật khẩu.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Mật khẩu mới phải có ít nhất 6 ký tự.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Mật khẩu mới và xác nhận mật khẩu không khớp.');
      return;
    }

    setIsResettingPassword(true);
    try {
      const res = await axiosClient.post('/auth/reset-password', {
        reset_token: resetToken,
        new_password: newPassword,
      });

      setMessage(res.data?.message || 'Đổi mật khẩu thành công.');
      setStep(1);
      resetOtpState();
      resetPasswordFields();
      window.setTimeout(() => {
        navigate('/');
      }, 800);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Không thể đặt lại mật khẩu. Vui lòng thử lại.');
    } finally {
      setIsResettingPassword(false);
    }
  };

  const updateOtpAt = (index: number, value: string) => {
    const digits = value.replace(/\D/g, '');
    setOtpDigits((prev) => {
      const next = [...prev];
      next[index] = digits.slice(-1);
      return next;
    });

    if (digits && index < OTP_LENGTH - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowLeft' && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowRight' && index < OTP_LENGTH - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!pasted) {
      return;
    }

    e.preventDefault();
    const next = Array(OTP_LENGTH).fill('');
    pasted.split('').forEach((digit, index) => {
      next[index] = digit;
    });
    setOtpDigits(next);
    const focusIndex = Math.min(pasted.length, OTP_LENGTH - 1);
    window.setTimeout(() => otpRefs.current[focusIndex]?.focus(), 0);
  };

  const goBackToEmailStep = () => {
    setStep(1);
    setMessage('');
    setError('');
    setResetToken('');
    setOtpVerified(false);
    resetOtpState();
    resetPasswordFields();
  };

  return (
    <div className="min-h-[calc(100vh-60px)] bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-[460px] rounded-[12px] border border-slate-100 bg-white p-8 shadow-[0_5px_30px_rgba(0,0,0,0.05)]">
        <Link to="/login" className="mb-6 inline-flex items-center gap-2 text-[13px] text-slate-500 hover:text-[#ff5b00]">
          <ArrowLeft className="h-4 w-4" />
          Quay lại đăng nhập
        </Link>

        <div className="mb-6">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-50 text-[#ff5b00]">
            {step === 1 ? <Mail className="h-6 w-6" /> : step === 2 ? <KeyRound className="h-6 w-6" /> : <ShieldCheck className="h-6 w-6" />}
          </div>
          <h1 className="text-[24px] font-bold text-slate-800">Quên mật khẩu</h1>
          <p className="mt-1 text-[14px] text-slate-500">
            {step === 1
              ? 'Nhập email để nhận mã OTP đặt lại mật khẩu.'
              : step === 2
                ? 'Nhập đúng 6 chữ số OTP trong 60 giây để mở bước đổi mật khẩu.'
                : 'OTP đã được xác minh. Nhập mật khẩu mới để hoàn tất.'}
          </p>
        </div>

        {message && <div className="mb-4 rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3 text-[13px] text-emerald-700">{message}</div>}
        {error && <div className="mb-4 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-[13px] text-red-600">{error}</div>}

        {step === 1 && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email tài khoản"
              className="h-[48px] w-full rounded-[6px] border border-slate-200 px-4 text-sm outline-none focus:border-[#ff5b00] focus:ring-1 focus:ring-[#ff5b00]"
            />
            <button
              disabled={isSendingOtp}
              className="h-[48px] w-full rounded-[6px] bg-[#ff5b00] font-bold text-white hover:bg-[#e05000] disabled:opacity-60"
            >
              {isSendingOtp ? 'Đang gửi...' : 'Gửi mã OTP'}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-[13px] text-slate-600">
              <div className="flex items-center gap-2 text-slate-700">
                <Mail className="h-4 w-4" />
                <span className="font-semibold">{email}</span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <Clock3 className="h-4 w-4" />
                <span>Mã OTP còn hiệu lực: {formatSeconds(secondsLeft)}</span>
              </div>
            </div>

            <div onPaste={handleOtpPaste} className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <label className="text-[13px] font-semibold text-slate-700">Mã OTP 6 số</label>
                <span className="text-[12px] text-slate-500">{otpDigits.filter(Boolean).length}/6</span>
              </div>
              <div className="grid grid-cols-6 gap-2">
                {Array.from({ length: OTP_LENGTH }).map((_, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      otpRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    autoComplete={index === 0 ? 'one-time-code' : 'off'}
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

            <button
              disabled={isVerifyingOtp || secondsLeft <= 0 || !otpComplete}
              className="h-[48px] w-full rounded-[6px] bg-[#ff5b00] font-bold text-white hover:bg-[#e05000] disabled:opacity-60"
            >
              {isVerifyingOtp ? 'Đang xác minh...' : secondsLeft <= 0 ? 'OTP đã hết hạn' : 'Xác minh OTP'}
            </button>

            <div className="flex flex-col gap-2 pt-1">
              <button
                type="button"
                onClick={sendOtpRequest}
                disabled={isSendingOtp}
                className="inline-flex h-[44px] w-full items-center justify-center gap-2 rounded-[6px] border border-slate-200 text-[13px] font-semibold text-slate-700 hover:border-[#ff5b00] hover:text-[#ff5b00] disabled:opacity-60"
              >
                <RefreshCcw className="h-4 w-4" />
                Gửi lại mã OTP
              </button>
              <button
                type="button"
                onClick={goBackToEmailStep}
                className="w-full text-[13px] text-slate-500 hover:text-[#0084ff]"
              >
                Đổi email khác
              </button>
            </div>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3 text-[13px] text-emerald-700">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" />
                <span>OTP đã được xác minh cho {email}.</span>
              </div>
            </div>

            <div className="space-y-3">
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Mật khẩu mới"
                className="h-[48px] w-full rounded-[6px] border border-slate-200 px-4 text-sm outline-none focus:border-[#ff5b00] focus:ring-1 focus:ring-[#ff5b00]"
              />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Xác nhận mật khẩu mới"
                className="h-[48px] w-full rounded-[6px] border border-slate-200 px-4 text-sm outline-none focus:border-[#ff5b00] focus:ring-1 focus:ring-[#ff5b00]"
              />
            </div>

            <button
              disabled={isResettingPassword}
              className="h-[48px] w-full rounded-[6px] bg-[#ff5b00] font-bold text-white hover:bg-[#e05000] disabled:opacity-60"
            >
              {isResettingPassword ? 'Đang đổi mật khẩu...' : 'Đổi mật khẩu'}
            </button>

            <div className="flex flex-col gap-2 pt-1">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="inline-flex h-[44px] w-full items-center justify-center gap-2 rounded-[6px] border border-slate-200 text-[13px] font-semibold text-slate-700 hover:border-[#ff5b00] hover:text-[#ff5b00]"
              >
                <ArrowLeft className="h-4 w-4" />
                Quay lại OTP
              </button>
              <button
                type="button"
                onClick={goBackToEmailStep}
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
