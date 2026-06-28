import React from 'react';
import { motion } from 'motion/react';
import { Download, Eye, MapPin, CalendarDays, Ticket } from 'lucide-react';

export default function BookingHistory() {
  const MOCK_ORDERS: any[] = [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="bg-green-100 text-green-700 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider">Đã xác nhận</span>;
      case 'used':
        return <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider">Đã sử dụng</span>;
      case 'cancelled':
        return <span className="bg-red-100 text-red-600 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider">Đã hủy</span>;
      default:
        return null;
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800">Lịch sử đặt vé</h2>
      </div>

      <div className="p-6">
        {MOCK_ORDERS.length === 0 ? (
          <div className="text-center py-10">
            <Ticket className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 mb-4">Bạn chưa có đơn hàng nào.</p>
            <a href="/" className="inline-block bg-[#ff5b00] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#e05000] transition-colors">
              Khám phá ngay
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {MOCK_ORDERS.map((order) => (
              <div key={order.id} className="border border-slate-200 rounded-xl p-4 sm:p-5 flex flex-col md:flex-row gap-5 hover:shadow-md transition-shadow bg-white">
                <img src={order.product.image} alt={order.product.name} className="w-full md:w-[160px] h-[120px] object-cover rounded-lg shrink-0" />
                
                <div className="flex-1 flex flex-col">
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                    <div className="text-[12px] text-slate-500 font-medium">Mã đơn: <span className="text-slate-800">{order.id}</span></div>
                    {getStatusBadge(order.status)}
                  </div>
                  
                  <h3 className="font-bold text-slate-800 text-[15px] mb-2 leading-snug line-clamp-2">
                    {order.product.name}
                  </h3>
                  
                  <div className="flex flex-wrap gap-4 text-[12px] text-slate-500 mb-4">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{order.product.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CalendarDays className="w-3.5 h-3.5" />
                      <span>SD: {order.product.dateOfUse}</span>
                    </div>
                  </div>
                  
                  <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100">
                    <div className="font-bold text-[#ff5b00] text-[16px]">
                      {order.total.toLocaleString('vi-VN')} <span className="text-[12px] underline font-normal">đ</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <button className="px-3 py-1.5 border border-slate-200 text-slate-600 rounded-lg text-[13px] font-medium hover:bg-slate-50 transition-colors flex items-center gap-1.5">
                        <Eye className="w-4 h-4" /> Chi tiết
                      </button>
                      {order.status === 'completed' && (
                        <button className="px-3 py-1.5 bg-[#0084ff] text-white rounded-lg text-[13px] font-medium hover:bg-[#0070d9] transition-colors flex items-center gap-1.5 shadow-sm">
                          <Download className="w-4 h-4" /> E-Ticket
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
