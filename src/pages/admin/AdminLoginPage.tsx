import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { Lock, Mail, AlertCircle } from 'lucide-react';
import axiosClient from '../../api/axios';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login, logout } = useAdminAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email.trim() || !password.trim()) {
      setError('Vui lòng nhập đầy đủ email và mật khẩu.');
      return;
    }

    setIsLoading(true);

    try {
      // API FastAPI dùng OAuth2PasswordRequestForm yêu cầu định dạng form-urlencoded
      // và key phải là 'username', 'password'
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);

      const response = await axiosClient.post('/auth/login', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      // Lấy token từ response (Backend trả về `access_token`)
      const token = response.data.access_token;
      
      // Lưu token vào Context và LocalStorage
      const currentUser = await login(token);
      if (!currentUser || currentUser.user_type !== 'ADMIN') {
        logout();
        setError('Tài khoản này chưa được cấp quyền quản trị.');
        return;
      }
      
      // Chuyển hướng vào trang Dashboard
      navigate('/admin/dashboard', { replace: true });
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.detail) {
        // FastAPI trả về mảng object lỗi nếu 422
        const detail = err.response.data.detail;
        if (Array.isArray(detail)) {
          setError(detail[0].msg || 'Dữ liệu không hợp lệ');
        } else {
          setError(detail);
        }
      } else {
        setError('Không thể kết nối đến máy chủ. Vui lòng thử lại sau.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h2 className="text-3xl font-black text-slate-800">
          Admin DiTravel
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:rounded-2xl sm:px-10 border border-slate-100">
          <form className="space-y-6" onSubmit={handleLogin} noValidate>
            
            {error && (
              <div className="bg-red-50 text-red-500 p-4 rounded-xl flex items-start gap-3 text-[13px] animate-in fade-in zoom-in-95 font-medium">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <div>
              <label className="block text-[13px] font-bold text-slate-700 mb-2 uppercase tracking-wide">
                Email quản trị
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl text-[14px] text-slate-800 focus:outline-none focus:border-[#0084ff] focus:ring-1 focus:ring-[#0084ff] transition-all shadow-sm"
                  placeholder="admin@ditravel.vn"
                />
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-bold text-slate-700 mb-2 uppercase tracking-wide">
                Mật khẩu
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl text-[14px] text-slate-800 focus:outline-none focus:border-[#0084ff] focus:ring-1 focus:ring-[#0084ff] transition-all shadow-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-[15px] font-bold text-white bg-[#0084ff] hover:bg-[#0073e6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0084ff] disabled:opacity-70 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Đăng Nhập</>
                )}
              </button>
            </div>
            
            <div className="text-center mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
               <p className="text-[12px] font-bold text-slate-500 mb-1">Hãy đăng nhập bằng Email thật của bạn</p>
               <p className="text-[13px] text-slate-700 font-mono">Mà bạn vừa đăng ký ban nãy</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
