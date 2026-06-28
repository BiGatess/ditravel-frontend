import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Map, MapPin, Box, Ticket, CalendarDays, 
  ShoppingBag, CreditCard, Tag, Users, Star, Percent, 
  Image as ImageIcon, FileText, Settings, Plane
} from 'lucide-react';

export default function AdminSidebar() {
  const navItems = [
    { title: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { title: 'Quản lý Đơn hàng', path: '/admin/orders', icon: ShoppingBag },
    { title: 'Tỉnh/thành phố', path: '/admin/locations', icon: Map },
    { title: 'Địa điểm du lịch', path: '/admin/places', icon: MapPin },
    { title: 'Quản lý Sản phẩm', path: '/admin/products', icon: Box },
    { title: 'Quản lý Loại vé', path: '/admin/ticket-types', icon: Ticket },
    { title: 'Quản lý Lịch & Giá', path: '/admin/pricing', icon: CalendarDays },
    { title: 'Thanh toán SePay', path: '/admin/payments', icon: CreditCard },
    { title: 'Quản lý Voucher', path: '/admin/vouchers', icon: Tag },
    { title: 'Quản lý Khách hàng', path: '/admin/users', icon: Users },
    { title: 'Quản lý Đánh giá', path: '/admin/reviews', icon: Star },
    { title: 'Mã giảm giá', path: '/admin/coupons', icon: Percent },
    { title: 'Quản lý Banner', path: '/admin/banners', icon: ImageIcon },
    { title: 'Quản lý Blog', path: '/admin/blogs', icon: FileText },
    { title: 'Cài đặt hệ thống', path: '/admin/settings', icon: Settings },
  ];

  return (
    <aside className="w-[260px] bg-slate-900 text-slate-300 h-screen fixed top-0 left-0 flex flex-col z-50 overflow-y-auto">
      <div className="h-[60px] px-6 flex items-center bg-slate-950 sticky top-0 z-10 shrink-0">
        <NavLink to="/admin/dashboard" className="flex items-center gap-2 text-white hover:text-[#ff5b00] transition-colors">
          <Plane className="w-6 h-6 fill-[#ff5b00] text-[#ff5b00]" />
          <span className="font-black text-xl tracking-tighter lowercase">ditravel <span className="text-[10px] uppercase bg-[#ff5b00] text-white px-1.5 py-0.5 rounded ml-1 tracking-normal font-bold">Admin</span></span>
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
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-[14px] font-medium
                    ${isActive ? 'bg-[#ff5b00] text-white' : 'hover:bg-slate-800 hover:text-white'}`
                  }
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span className="truncate">{item.title}</span>
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
