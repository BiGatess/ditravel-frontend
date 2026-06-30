import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import axiosClient from '../../api/axios';
import { useAdminAuth } from '../../context/AdminAuthContext';

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();
  const { login } = useAdminAuth();

  const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email) {
      newErrors.email = 'Vui lòng nhập email của bạn.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
       newErrors.email = 'Email không hợp lệ.';
    }

    if (!password) {
      newErrors.password = 'Vui lòng nhập mật khẩu.';
    } else if (password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setApiError('');
    setIsLoading(true);
    setIsSuccess(false);

    try {
      const formDataObj = new URLSearchParams();
      formDataObj.append('username', email);
      formDataObj.append('password', password);

      const res = await axiosClient.post('/auth/login', formDataObj, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      
      const currentUser = await login(res.data.access_token);
      setIsSuccess(true);
      await wait(650);
      navigate(currentUser?.user_type === 'ADMIN' ? '/admin/dashboard' : '/', { replace: true });
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.detail) {
        setApiError(err.response.data.detail);
      } else {
        setApiError('Đăng nhập thất bại. Vui lòng kiểm tra lại email hoặc mật khẩu.');
      }
      setIsLoading(false);
      setIsSuccess(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {apiError && (
        <div className="bg-red-50 text-red-500 p-4 rounded-[6px] text-[13px] font-medium border border-red-100">
          {apiError}
        </div>
      )}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-2">
           Email
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Mail className="h-5 w-5" />
          </div>
          <input 
            name="email"
            type="email" 
            className={`pl-10 w-full h-[48px] border ${errors.email ? 'border-red-500' : 'border-slate-200 focus:border-[#ff5b00] focus:ring-[#ff5b00]'} rounded-[6px] focus:outline-none focus:ring-1 bg-slate-50 focus:bg-white transition-colors text-sm`}
            placeholder="example@email.com"
          />
        </div>
        {errors.email && <p className="text-red-500 text-xs mt-1.5">{errors.email}</p>}
      </div>

      <div>
        <div className="flex justify-between items-center mb-1.5">
          <label className="block text-sm font-semibold text-slate-700 flex items-center gap-2">
             Mật khẩu
          </label>
          <Link to="/forgot-password" className="text-sm font-medium text-[#0084ff] hover:underline">Quên mật khẩu?</Link>
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Lock className="h-5 w-5" />
          </div>
          <input 
            name="password"
            type={showPassword ? "text" : "password"} 
            className={`pl-10 pr-10 w-full h-[48px] border ${errors.password ? 'border-red-500' : 'border-slate-200 focus:border-[#ff5b00] focus:ring-[#ff5b00]'} rounded-[6px] focus:outline-none focus:ring-1 bg-slate-50 focus:bg-white transition-colors text-sm`}
            placeholder="••••••••"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        {errors.password && <p className="text-red-500 text-xs mt-1.5">{errors.password}</p>}
      </div>

      <button 
        type="submit"
        disabled={isLoading}
        className="w-full bg-[#ff5b00] hover:bg-[#e05000] disabled:bg-[#ff8a45] disabled:cursor-wait text-white font-bold h-[48px] rounded-[6px] transition-all duration-200 mt-6 flex items-center justify-center gap-2 group shadow-sm hover:shadow-md active:scale-[0.98]"
      >
        {isSuccess ? (
          <>
            Đăng nhập thành công
          </>
        ) : isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Đang đăng nhập...
          </>
        ) : (
          <>
            Đăng nhập
          </>
        )}
      </button>

      <div className="mt-6 text-center text-sm">
        <p className="text-slate-600">
          Bạn chưa có tài khoản? <Link to="/register" className="text-[#0084ff] font-semibold hover:underline">Đăng ký ngay</Link>
        </p>
      </div>
    </form>
  );
}
