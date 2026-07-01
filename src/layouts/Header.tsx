import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ChevronDown,
  CircleHelp,
  CircleUserRound,
  LogIn,
  LogOut,
  MapPinned,
  Menu,
  Plane,
  ShieldCheck,
  ShoppingCart,
  X,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAdminAuth } from '../context/AdminAuthContext';

export default function Header() {
  const [isDestModalOpen, setIsDestModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartBadgeCount } = useCart();
  const { isAuthenticated, user, logout } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleOpen = () => setIsDestModalOpen(true);
    window.addEventListener('open-dest-modal', handleOpen);
    return () => window.removeEventListener('open-dest-modal', handleOpen);
  }, []);

  const closeDestModal = () => setIsDestModalOpen(false);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const navIconClass = 'h-[18px] w-[18px] shrink-0';

  return (
    <>
      <header className="bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)] sticky top-0 z-50">
        <div className="container mx-auto max-w-[1300px] px-2 h-[60px] flex items-center justify-between">
          <div className="flex items-center gap-5">
            <Link to="/" className="group flex items-center">
              <span className="text-[#ff5b00] font-black text-3xl tracking-normal lowercase flex items-center gap-2">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#ff5b00] text-white shadow-sm transition-colors group-hover:bg-[#e55300]">
                  <Plane className="h-5 w-5" strokeWidth={2.5} />
                </span>
                ditravel
              </span>
            </Link>
            
            <button 
              onClick={() => setIsDestModalOpen(true)}
              className="hidden md:flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm text-slate-600 hover:bg-orange-50 hover:text-[#ff5b00] transition-colors"
            >
              <MapPinned className="h-[17px] w-[17px]" strokeWidth={2.2} />
              Chọn điểm đến <ChevronDown className="w-3.5 h-3.5" strokeWidth={2.4} />
            </button>
          </div>

          <div className="hidden md:flex items-center gap-4 text-sm text-slate-600">
            <Link to="/cart" className="group flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-orange-50 hover:text-[#ff5b00] transition-colors">
              <div className="relative inline-flex items-center">
                <ShoppingCart className={navIconClass} strokeWidth={2.2} />
                {cartBadgeCount > 0 && (
                  <span className="absolute -top-2.5 -right-3 bg-[#ff5b00] text-white text-[10px] font-bold rounded-full h-[16px] min-w-[16px] flex items-center justify-center">
                    {cartBadgeCount}
                  </span>
                )}
              </div>
              <span>Giỏ hàng</span>
            </Link>
            <div className="relative group cursor-pointer">
              <div className="flex items-center gap-1.5 rounded-md px-2 py-1.5 hover:bg-orange-50 hover:text-[#ff5b00] transition-colors">
                <CircleHelp className={navIconClass} strokeWidth={2.2} />
                <span>Hỗ trợ</span> 
                <ChevronDown className="w-3.5 h-3.5" strokeWidth={2.4} />
              </div>
            </div>
            <div className="flex items-center gap-4 border-l border-slate-200 pl-6">
              {isAuthenticated ? (
                <div className="flex items-center gap-4">
                  <Link to="/profile" className="flex items-center gap-1.5 font-medium hover:text-[#ff5b00] transition-colors">
                    <CircleUserRound className={navIconClass} strokeWidth={2.2} /> {user?.full_name || user?.email}
                  </Link>
                  {user?.user_type === 'ADMIN' && (
                    <Link to="/admin" className="flex items-center gap-1.5 text-sm font-medium hover:text-[#ff5b00] transition-colors text-blue-600">
                      <ShieldCheck className={navIconClass} strokeWidth={2.2} />
                      Quản trị
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      navigate('/', { replace: true });
                    }}
                    className="flex items-center gap-1.5 hover:text-[#ff5b00] transition-colors"
                  >
                    <LogOut className={navIconClass} strokeWidth={2.2} /> Đăng xuất
                  </button>
                </div>
              ) : (
                <>
                  <Link to="/register" className="flex items-center gap-1.5 hover:text-[#ff5b00] transition-colors">
                    <CircleUserRound className={navIconClass} strokeWidth={2.2} /> Đăng ký
                  </Link>
                  <Link to="/login" className="flex items-center gap-1.5 hover:text-[#ff5b00] transition-colors">
                    <LogIn className={navIconClass} strokeWidth={2.2} /> Đăng nhập
                  </Link>
                </>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-4 md:hidden">
            <Link to="/cart" className="grid h-10 w-10 place-items-center rounded-lg bg-slate-100 text-slate-700 relative hover:bg-orange-50 hover:text-[#ff5b00] transition-colors">
              <ShoppingCart className="h-5 w-5" strokeWidth={2.25} />
              {cartBadgeCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#ff5b00] text-white text-[10px] font-bold rounded-full h-[16px] min-w-[16px] flex items-center justify-center px-1">
                  {cartBadgeCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="grid h-10 w-10 place-items-center rounded-lg bg-slate-100 text-slate-700 hover:bg-orange-50 hover:text-[#ff5b00] transition-colors"
              aria-label="Mở menu"
            >
              <Menu className="h-5 w-5" strokeWidth={2.25} />
            </button>
          </div>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[110] md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            aria-label="Đóng menu"
            onClick={closeMobileMenu}
          />
          <div className="absolute right-0 top-0 flex h-full w-[88%] max-w-[360px] flex-col overflow-y-auto bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4">
              <div>
                <div className="text-[12px] font-semibold uppercase tracking-wide text-slate-500">DiTravel</div>
                <div className="text-[16px] font-bold text-slate-800">Menu nhanh</div>
              </div>
              <button
                type="button"
                onClick={closeMobileMenu}
                className="grid h-9 w-9 place-items-center rounded-lg bg-slate-100 text-slate-600"
                aria-label="Đóng menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="border-b border-slate-100 px-4 py-4">
              <button
                onClick={() => {
                  closeMobileMenu();
                  setIsDestModalOpen(true);
                }}
                className="flex w-full items-center justify-between rounded-xl bg-orange-50 px-4 py-3 text-left text-[14px] font-semibold text-[#ff5b00]"
              >
                Chọn điểm đến
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>

            <nav className="flex-1 px-4 py-4">
              <div className="space-y-2">
                <Link to="/cart" onClick={closeMobileMenu} className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-[14px] font-medium text-slate-700">
                  <span className="flex items-center gap-3">
                    <ShoppingCart className={navIconClass} strokeWidth={2.2} />
                    Giỏ hàng
                  </span>
                  {cartBadgeCount > 0 && <span className="rounded-full bg-[#ff5b00] px-2 py-0.5 text-[11px] font-bold text-white">{cartBadgeCount}</span>}
                </Link>

                <Link to="/search" onClick={closeMobileMenu} className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-[14px] font-medium text-slate-700">
                  <CircleHelp className={navIconClass} strokeWidth={2.2} />
                  Tìm kiếm tour / vé
                </Link>

                <Link to="/help" onClick={closeMobileMenu} className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-[14px] font-medium text-slate-700">
                  <CircleHelp className={navIconClass} strokeWidth={2.2} />
                  Hỗ trợ khách hàng
                </Link>
              </div>

              <div className="mt-5 border-t border-slate-100 pt-5">
                {isAuthenticated ? (
                  <div className="space-y-2">
                    <Link to="/profile" onClick={closeMobileMenu} className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3 text-[14px] font-semibold text-slate-800">
                      <CircleUserRound className={navIconClass} strokeWidth={2.2} />
                      {user?.full_name || user?.email || 'Tài khoản của tôi'}
                    </Link>
                    {user?.user_type === 'ADMIN' && (
                      <Link to="/admin" onClick={closeMobileMenu} className="flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-[14px] font-semibold text-blue-700">
                        <ShieldCheck className={navIconClass} strokeWidth={2.2} />
                        Quản trị
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        closeMobileMenu();
                        logout();
                        navigate('/', { replace: true });
                      }}
                      className="flex w-full items-center gap-3 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-left text-[14px] font-semibold text-rose-600"
                    >
                      <LogOut className={navIconClass} strokeWidth={2.2} />
                      Đăng xuất
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Link to="/login" onClick={closeMobileMenu} className="flex items-center justify-center gap-2 rounded-xl bg-[#0084ff] px-4 py-3 text-[14px] font-semibold text-white">
                      <LogIn className={navIconClass} strokeWidth={2.2} />
                      Đăng nhập
                    </Link>
                    <Link to="/register" onClick={closeMobileMenu} className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-[14px] font-semibold text-slate-700">
                      <CircleUserRound className={navIconClass} strokeWidth={2.2} />
                      Đăng ký
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}

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
