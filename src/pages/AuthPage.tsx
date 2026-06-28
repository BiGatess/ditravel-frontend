import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Plane } from 'lucide-react';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';

export default function AuthPage({ defaultType = 'login' }: { defaultType?: 'login' | 'register' }) {
  const [type, setType] = useState(defaultType);

  useEffect(() => {
    setType(defaultType);
  }, [defaultType]);

  return (
    <div className="min-h-[calc(100vh-60px)] bg-slate-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-[480px] w-full bg-white rounded-[12px] shadow-[0_5px_30px_rgba(0,0,0,0.05)] p-8 sm:p-10 border border-slate-100"
      >
        <div className="text-center mb-8">
          <Link to="/" className="text-[#ff5b00] font-black text-3xl tracking-tighter lowercase inline-flex items-center justify-center gap-1 mb-2">
            <Plane className="w-8 h-8 fill-current" />
            ditravel
          </Link>
          <h2 className="text-xl font-bold text-[#242424]">
             {type === 'login' ? 'Đăng nhập vào tài khoản' : 'Tạo tài khoản mới'}
          </h2>
          <p className="text-slate-500 text-sm mt-2">
             {type === 'login' ? 'Chào mừng bạn quay lại với DITRAVEL.' : 'Khám phá thế giới cùng DITRAVEL hôm nay.'}
          </p>
        </div>

        {type === 'login' ? <LoginForm /> : <RegisterForm />}

      </motion.div>
    </div>
  );
}
