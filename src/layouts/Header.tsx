import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, ShoppingCart, HelpCircle, User, LogIn, ChevronDown, X, Plane, LogOut } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAdminAuth } from '../context/AdminAuthContext';

export default function Header() {
  const [isDestModalOpen, setIsDestModalOpen] = useState(false);
  const { cartBadgeCount } = useCart();
  const { isAuthenticated, user, logout } = useAdminAuth();

  useEffect(() => {
    const handleOpen = () => setIsDestModalOpen(true);
    window.addEventListener('open-dest-modal', handleOpen);
    return () => window.removeEventListener('open-dest-modal', handleOpen);
  }, []);

  const closeDestModal = () => setIsDestModalOpen(false);

  return (
    <>
      <header className="bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)] sticky top-0 z-50">
        <div className="container mx-auto max-w-[1300px] px-2 h-[60px] flex items-center justify-between">
          <div className="flex items-center gap-5">
            <Link to="/" className="flex items-center">
              {/* Custom Logo Ditravel */}
              <span className="text-[#ff5b00] font-black text-3xl tracking-tighter lowercase flex items-center gap-1">
                <Plane className="w-8 h-8 fill-current" />
                ditravel
              </span>
            </Link>
            
            <button 
              onClick={() => setIsDestModalOpen(true)}
              className="hidden md:flex items-center gap-1 text-sm text-slate-600 hover:text-[#ff5b00] transition-colors"
            >
              Chọn điểm đến <ChevronDown className="w-3 h-3" />
            </button>
          </div>

          <div className="hidden md:flex items-center gap-4 text-sm text-slate-600">
            <Link to="/cart" className="flex items-center gap-1.5 hover:text-[#ff5b00] transition-colors">
              <div className="relative inline-flex items-center">
                <ShoppingCart className="w-4 h-4" /> 
                {cartBadgeCount > 0 && (
                  <span className="absolute -top-2.5 -right-3 bg-[#ff5b00] text-white text-[10px] font-bold rounded-full h-[16px] min-w-[16px] flex items-center justify-center">
                    {cartBadgeCount}
                  </span>
                )}
              </div>
              <span>Giỏ hàng</span>
            </Link>
            <div className="relative group cursor-pointer">
              <div className="flex items-center gap-1 hover:text-[#ff5b00] transition-colors">
                <HelpCircle className="w-4 h-4" /> 
                <span>Hỗ trợ</span> 
                <ChevronDown className="w-3 h-3" />
              </div>
            </div>
            <div className="flex items-center gap-4 border-l border-slate-200 pl-6">
              {isAuthenticated ? (
                <div className="flex items-center gap-4">
                  <Link to="/profile" className="flex items-center gap-1.5 font-medium hover:text-[#ff5b00] transition-colors">
                    <User className="w-4 h-4" /> {user?.full_name || user?.email}
                  </Link>
                  {user?.user_type === 'ADMIN' && (
                    <Link to="/admin" className="text-sm font-medium hover:text-[#ff5b00] transition-colors text-blue-600">
                      Quản trị
                    </Link>
                  )}
                  <button onClick={logout} className="flex items-center gap-1.5 hover:text-[#ff5b00] transition-colors">
                    <LogOut className="w-4 h-4" /> Đăng xuất
                  </button>
                </div>
              ) : (
                <>
                  <Link to="/register" className="flex items-center gap-1.5 hover:text-[#ff5b00] transition-colors">
                    <User className="w-4 h-4" /> Đăng ký
                  </Link>
                  <Link to="/login" className="flex items-center gap-1.5 hover:text-[#ff5b00] transition-colors">
                    <LogIn className="w-4 h-4" /> Đăng nhập
                  </Link>
                </>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-4 md:hidden">
            <Link to="/cart" className="p-2 text-slate-600 relative">
              <ShoppingCart className="w-6 h-6" />
              {cartBadgeCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#ff5b00] text-white text-[10px] font-bold rounded-full h-[16px] min-w-[16px] flex items-center justify-center px-1">
                  {cartBadgeCount}
                </span>
              )}
            </Link>
            <button className="p-2 text-slate-600">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Destination Modal */}
      {isDestModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" onClick={closeDestModal} />
          <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative z-10 p-4 md:p-5 animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={closeDestModal}
              className="absolute top-4 right-4 text-slate-400 hover:bg-slate-100 hover:text-slate-700 p-1 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4">
              <div>
                 <div className="font-bold text-[#ff5b00] text-[15px] mb-4 pb-2 border-b border-slate-100">Miền Nam & Tây Nguyên</div>
                 <div className="flex flex-col gap-3 text-[13px] text-slate-600">
                   {['HỒ CHÍ MINH', 'VŨNG TÀU', 'TÂY NINH', 'BUÔN MA THUỘT - ĐẮK LẮK', 'ĐÀ LẠT', 'PHÚ QUỐC', 'CÔN ĐẢO', 'CẦN THƠ', 'MĂNG ĐEN'].map((dest, i) => (
                     <Link key={i} to="/search" onClick={closeDestModal} className="hover:text-[#ff5b00] transition-colors font-medium">{dest}</Link>
                   ))}
                 </div>
              </div>
              
              <div>
                 <div className="font-bold text-[#ff5b00] text-[15px] mb-4 pb-2 border-b border-slate-100">Miền Trung</div>
                 <div className="flex flex-col gap-3 text-[13px] text-slate-600">
                   {['ĐÀ NẴNG', 'HỘI AN', 'HUẾ', 'NHA TRANG', 'PHAN THIẾT', 'NINH THUẬN', 'QUY NHƠN', 'QUẢNG BÌNH', 'PHÚ YÊN'].map((dest, i) => (
                     <Link key={i} to="/search" onClick={closeDestModal} className="hover:text-[#ff5b00] transition-colors font-medium">{dest}</Link>
                   ))}
                 </div>
              </div>
              
              <div>
                 <div className="font-bold text-[#ff5b00] text-[15px] mb-4 pb-2 border-b border-slate-100">Miền Bắc</div>
                 <div className="flex flex-col gap-3 text-[13px] text-slate-600">
                   {['HÀ NỘI', 'HẠ LONG', 'SAPA', 'NINH BÌNH', 'HÀ GIANG', 'MỘC CHÂU', 'HẢI PHÒNG', 'CÁT BÀ', 'PHÚ THỌ'].map((dest, i) => (
                     <Link key={i} to="/search" onClick={closeDestModal} className="hover:text-[#ff5b00] transition-colors font-medium">{dest}</Link>
                   ))}
                 </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
