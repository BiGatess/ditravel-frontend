import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  CalendarDays,
  CreditCard,
  FileText,
  Gift,
  Image as ImageIcon,
  LayoutDashboard,
  Map,
  MapPinned,
  MessageSquareText,
  PackageSearch,
  Plane,
  Settings2,
  ShoppingBag,
  Tickets,
  UsersRound,
} from 'lucide-react';

export default function AdminSidebar() {
  const navItems = [
    { title: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { title: 'Quản lý Đơn hàng', path: '/admin/orders', icon: ShoppingBag },
    { title: 'Tỉnh/thành phố', path: '/admin/locations', icon: Map },
    { title: 'Địa điểm du lịch', path: '/admin/places', icon: MapPinned },
    { title: 'Quản lý Sản phẩm', path: '/admin/products', icon: PackageSearch },
    { title: 'Quản lý Loại vé', path: '/admin/ticket-types', icon: Tickets },
    { title: 'Quản lý Lịch & Giá', path: '/admin/pricing', icon: CalendarDays },
    { title: 'Thanh toán SePay', path: '/admin/payments', icon: CreditCard },
    { title: 'Quản lý Voucher', path: '/admin/vouchers', icon: Gift },
    { title: 'Quản lý Khách hàng', path: '/admin/users', icon: UsersRound },
    { title: 'Quản lý Đánh giá', path: '/admin/reviews', icon: MessageSquareText },
    { title: 'Quản lý Banner', path: '/admin/banners', icon: ImageIcon },
    { title: 'Quản lý Blog', path: '/admin/blogs', icon: FileText },
    { title: 'Cài đặt hệ thống', path: '/admin/settings', icon: Settings2 },
  ];

  return (
    <aside className="w-[260px] bg-slate-900 text-slate-300 h-screen fixed top-0 left-0 flex flex-col z-50 overflow-y-auto">
      <div className="h-[60px] px-5 flex items-center bg-slate-950 sticky top-0 z-10 shrink-0">
        <NavLink to="/admin/dashboard" className="group flex items-center gap-3 text-white">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#ff5b00] text-white shadow-[0_8px_20px_rgba(255,91,0,0.24)] transition-colors group-hover:bg-[#e55300]">
            <Plane className="h-5 w-5" strokeWidth={2.5} />
          </span>
          <span className="font-black text-xl tracking-normal lowercase">ditravel <span className="text-[10px] uppercase bg-[#ff5b00] text-white px-1.5 py-0.5 rounded ml-1 tracking-normal font-bold">Admin</span></span>
        </NavLink>
      </div>

      <nav className="flex-1 py-4">
        <ul className="space-y-1 px-3">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <li key={index}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => 
                    `group flex items-center gap-3 px-2.5 py-2 rounded-lg transition-all text-[14px] font-medium
                    ${isActive ? 'bg-[#ff5b00] text-white shadow-sm' : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'}`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg border transition-colors ${
                        isActive
                          ? 'border-white/20 bg-white/15 text-white'
                          : 'border-slate-700/70 bg-slate-900/70 text-slate-400 group-hover:border-slate-600 group-hover:bg-slate-700/60 group-hover:text-white'
                      }`}>
                        <Icon className="h-[18px] w-[18px]" strokeWidth={2.25} />
                      </span>
                      <span className="truncate">{item.title}</span>
                    </>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-slate-800 text-[12px] text-slate-500 text-center shrink-0">
        &copy; 2026 DITRAVEL Admin v1.0
      </div>
    </aside>
  );
}
