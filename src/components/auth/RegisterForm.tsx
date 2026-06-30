import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, Eye, EyeOff, ArrowRight } from 'lucide-react';
import axiosClient from '../../api/axios';
import { useAdminAuth } from '../../context/AdminAuthContext';

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAdminAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};
    setApiError('');

    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (!name) {
      newErrors.name = 'Vui lòng nhập họ và tên.';
    }
    if (!phone) {
      newErrors.phone = 'Vui lòng nhập số điện thoại.';
    }

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

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu.';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      await axiosClient.post('/auth/register', {
        full_name: name,
        email: email,
        password: password,
        phone: phone
      });
      
      // Auto login after register
      const formDataObj = new URLSearchParams();
      formDataObj.append('username', email);
      formDataObj.append('password', password);

      const res = await axiosClient.post('/auth/login', formDataObj, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      
      const currentUser = await login(res.data.access_token);
      navigate(currentUser?.user_type === 'ADMIN' ? '/admin/dashboard' : '/');
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.detail) {
        const detail = err.response.data.detail;
        if (Array.isArray(detail)) {
          setApiError(detail[0].msg || 'Dữ liệu không hợp lệ');
        } else {
          setApiError(detail);
        }
      } else {
        setApiError('Không thể kết nối đến máy chủ. Vui lòng thử lại sau.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {apiError && (
        <div className="bg-red-50 text-red-500 p-4 rounded-[6px] text-[13px] font-medium border border-red-100">
          {apiError}
        </div>
      )}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-2">
             Họ và tên
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <User className="h-5 w-5" />
            </div>
            <input 
              name="name"
              type="text" 
              className={`pl-10 w-full h-[48px] border ${errors.name ? 'border-red-500' : 'border-slate-200 focus:border-[#ff5b00] focus:ring-[#ff5b00]'} rounded-[6px] focus:outline-none focus:ring-1 bg-slate-50 focus:bg-white transition-colors text-sm`}
              placeholder="Nhập họ và tên của bạn"
            />
          </div>
          {errors.name && <p className="text-red-500 text-xs mt-1.5">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-2">
             Số điện thoại
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Phone className="h-5 w-5" />
            </div>
            <input 
              name="phone"
              type="tel" 
              className={`pl-10 w-full h-[48px] border ${errors.phone ? 'border-red-500' : 'border-slate-200 focus:border-[#ff5b00] focus:ring-[#ff5b00]'} rounded-[6px] focus:outline-none focus:ring-1 bg-slate-50 focus:bg-white transition-colors text-sm`}
              placeholder="Nhập số điện thoại"
            />
          </div>
          {errors.phone && <p className="text-red-500 text-xs mt-1.5">{errors.phone}</p>}
        </div>
      </div>

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
        <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-2">
           Mật khẩu
        </label>
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

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-2">
           Xác nhận mật khẩu
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Lock className="h-5 w-5" />
          </div>
          <input 
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"} 
            className={`pl-10 pr-10 w-full h-[48px] border ${errors.confirmPassword ? 'border-red-500' : 'border-slate-200 focus:border-[#ff5b00] focus:ring-[#ff5b00]'} rounded-[6px] focus:outline-none focus:ring-1 bg-slate-50 focus:bg-white transition-colors text-sm`}
            placeholder="••••••••"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        {errors.confirmPassword && <p className="text-red-500 text-xs mt-1.5">{errors.confirmPassword}</p>}
      </div>

      <button 
        type="submit"
        disabled={isLoading}
        className="w-full bg-[#ff5b00] hover:bg-[#e05000] disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold h-[48px] rounded-[6px] transition-colors mt-6 flex items-center justify-center gap-2 group"
      >
        {isLoading ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
        {!isLoading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
      </button>

      <div className="mt-6 text-center text-sm">
        <p className="text-slate-600">
          Đã có tài khoản? <Link to="/login" className="text-[#0084ff] font-semibold hover:underline">Đăng nhập</Link>
        </p>
      </div>

      <p className="mt-6 text-center text-[13px] text-slate-500">
        Bằng việc đăng ký, bạn đồng ý với <a href="#" className="text-[#0084ff] hover:underline">Điều khoản sử dụng</a> và <a href="#" className="text-[#0084ff] hover:underline">Chính sách bảo mật</a> của chúng tôi.
      </p>
    </form>
  );
}
