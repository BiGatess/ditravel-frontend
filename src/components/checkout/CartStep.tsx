import React from 'react';
import { Link } from 'react-router-dom';
import { ScanLine, Trash2, Minus, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { formatVnd } from '../../utils/currency';

interface CartStepProps {
  cartItems: any[];
  totalItems: number;
  totalPrice: number;
  removeRow: (id: string | number) => void;
  updateQuantity: (id: string | number, delta: number) => void;
  onNextStep: () => void;
}

export default function CartStep({ 
  cartItems, 
  totalItems, 
  totalPrice, 
  removeRow, 
  updateQuantity, 
  onNextStep 
}: CartStepProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Giỏ hàng của bạn</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-5 items-start">
        {/* Cart Items */}
        <div className="flex-1 space-y-4 w-full">
        {cartItems.map(item => (
          <div 
            key={item.id} 
            className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-4 sm:p-5 flex gap-4 sm:gap-6 mb-4 hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all group"
          >
            <div className="w-[90px] h-[90px] sm:w-[120px] sm:h-[120px] rounded-xl overflow-hidden shrink-0 border border-slate-100 relative">
               <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            
            <div className="flex-1 flex flex-col min-w-0 py-0.5">
              <div className="flex justify-between items-start gap-4">
                <h3 className="font-bold text-slate-800 text-[15px] sm:text-[17px] leading-snug line-clamp-2 group-hover:text-[#ff5b00] transition-colors">{item.name}</h3>
                <button 
                  onClick={() => removeRow(item.id)} 
                  className="text-slate-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors -mt-1.5 -mr-1.5 shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[12px] font-medium bg-blue-50 text-blue-600 border border-blue-100">
                  SD: {item.date}
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[12px] font-medium bg-slate-50 text-slate-600 border border-slate-100">
                  {item.type}
                </span>
              </div>
              
              <div className="mt-auto flex flex-col sm:flex-row sm:items-end justify-between items-start gap-4 flex-wrap pt-4">
                <div className="text-[17px] sm:text-[19px] font-bold text-[#ff5b00]">
                  {formatVnd(item.price).replace(' đ', '')} <span className="text-[14px] font-medium underline relative -top-0.5 ml-0.5 text-slate-500">đ</span>
                </div>
                
                <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden h-9 bg-slate-50/50 shadow-sm">
                  <button onClick={() => updateQuantity(item.id, -1)} className="w-9 h-full flex items-center justify-center hover:bg-slate-100 hover:text-slate-800 text-slate-500 transition-colors disabled:opacity-30 disabled:hover:bg-transparent" disabled={item.quantity <= 1}>
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center text-[13px] font-bold text-slate-800 bg-white h-full flex items-center justify-center border-x border-slate-200">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)} className="w-9 h-full flex items-center justify-center hover:bg-slate-100 hover:text-slate-800 text-slate-500 transition-colors">
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {cartItems.length === 0 && (
          <div className="text-center py-8 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
              <ScanLine className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-medium text-slate-800 mb-2">Giỏ hàng của bạn đang trống</h3>
            <p className="text-slate-500 mb-6 text-[14px]">Hãy tìm thêm những trải nghiệm thú vị nhé</p>
            <Link to="/" className="inline-block bg-[#ff5b00] text-white font-medium px-6 py-2.5 rounded-xl hover:bg-[#e05000] transition-colors shadow-sm">
              Khám phá ngay
            </Link>
          </div>
        )}
      </div>

      {/* Cart Summary */}
      <div className="w-full lg:w-[360px] xl:w-[400px] shrink-0">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xl sticky top-24 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#ff5b00] to-[#ffa066]"></div>
          
          <div className="p-6">
            <h2 className="font-bold text-[18px] text-slate-800 mb-6 flex items-center gap-2">
               Chi tiết thanh toán
            </h2>
            
            <div className="space-y-4 text-[14px] mb-6">
              <div className="flex justify-between items-baseline">
                <span className="text-slate-500 font-medium">Tạm tính ({totalItems} sản phẩm)</span>
                <span className="font-bold text-slate-700">{totalPrice.toLocaleString('vi-VN')} đ</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Khuyến mãi</span>
                <span className="font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 flex items-center h-[26px]">0 đ</span>
              </div>
            </div>
          </div>

          <div className="relative">
             <div className="absolute top-0 left-0 w-full border-t-2 border-dashed border-slate-200"></div>
             <div className="absolute -top-3 -left-3 w-6 h-6 bg-slate-50 rounded-full border-r-2 border-dashed border-slate-200"></div>
             <div className="absolute -top-3 -right-3 w-6 h-6 bg-slate-50 rounded-full border-l-2 border-dashed border-slate-200"></div>
          </div>

          <div className="p-6 bg-slate-50/50">
            <div className="flex justify-between items-end mb-6">
              <span className="font-bold text-slate-800">Tổng tiền</span>
              <div className="text-right">
                 <div className="text-[26px] font-bold text-[#ff5b00] leading-none mb-1">
                   {totalPrice.toLocaleString('vi-VN')} <span className="text-[16px] underline font-medium">đ</span>
                 </div>
                 <div className="text-[11px] text-slate-500">Đã bao gồm VAT</div>
              </div>
            </div>

            <button 
              onClick={onNextStep}
              disabled={cartItems.length === 0}
              className="w-full bg-gradient-to-r from-[#ff5b00] to-[#ff7a33] hover:from-[#e65200] hover:to-[#ff5b00] text-white font-bold py-3.5 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-lg border border-[#e65200]"
            >
              {cartItems.length === 0 ? 'Giỏ hàng trống' : 'Tiến hành Thanh toán'}
            </button>
          </div>
        </div>
      </div>
      </div>
    </motion.div>
  );
}
