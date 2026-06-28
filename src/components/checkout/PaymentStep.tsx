import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ChevronLeft, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

interface PaymentStepProps {
  contactInfo: { name: string; phone: string; email: string };
  setContactInfo: (info: any) => void;
  errors: { name: string; phone: string; email: string };
  cartItems: any[];
  totalPrice: number;
  isProcessing: boolean;
  onPrevStep: () => void;
  onNextStep: () => void;
  setIsPaid: (paid: boolean) => void;
}

export default function PaymentStep({
  contactInfo,
  setContactInfo,
  errors,
  cartItems,
  totalPrice,
  isProcessing,
  onPrevStep,
  onNextStep,
  setIsPaid
}: PaymentStepProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <button onClick={onPrevStep} className="inline-flex items-center gap-1 text-slate-500 hover:text-[#ff5b00] mb-6 transition-colors font-medium">
        <ChevronLeft className="w-4 h-4" />
        <span>Quay lại giỏ hàng</span>
      </button>
      
      <div className="flex flex-col lg:flex-row gap-5">
        <div className="flex-1 space-y-6">
          
          <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-200 flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-[#ff5b00] text-white flex items-center justify-center font-bold text-[13px]">1</div>
              <h2 className="text-[16px] font-bold text-slate-800">Thông tin khách hàng</h2>
            </div>
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">Họ và tên *</label>
                <input 
                  type="text" 
                  value={contactInfo.name}
                  onChange={(e) => setContactInfo({...contactInfo, name: e.target.value})}
                  className={`w-full border ${errors.name ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:border-[#ff5b00] focus:ring-[#ff5b00]'} rounded-lg p-3 text-[14px] outline-none focus:ring-1 transition-shadow`} 
                  placeholder="VD: NGUYEN VAN A" 
                />
                {errors.name && <p className="text-red-500 text-[12px] mt-1.5">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">Số điện thoại *</label>
                <input 
                  type="tel" 
                  value={contactInfo.phone}
                  onChange={(e) => setContactInfo({...contactInfo, phone: e.target.value})}
                  className={`w-full border ${errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:border-[#ff5b00] focus:ring-[#ff5b00]'} rounded-lg p-3 text-[14px] outline-none focus:ring-1 transition-shadow`} 
                  placeholder="VD: 0987654321" 
                />
                {errors.phone && <p className="text-red-500 text-[12px] mt-1.5">{errors.phone}</p>}
              </div>
              <div className="md:col-span-2">
                <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">Email nhận vé/voucher *</label>
                <input 
                  type="email" 
                  value={contactInfo.email}
                  onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
                  className={`w-full border ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:border-[#ff5b00] focus:ring-[#ff5b00]'} rounded-lg p-3 text-[14px] outline-none focus:ring-1 transition-shadow`} 
                  placeholder="VD: hotro@ditravel.com" 
                />
                {errors.email ? (
                  <p className="text-red-500 text-[12px] mt-1.5">{errors.email}</p>
                ) : (
                  <p className="text-[12px] text-slate-500 mt-2 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> E-voucher/Vé sẽ được gửi đến email này của bạn
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Section 2: Kiểm tra giỏ hàng */}
          <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mt-6">
            <div className="bg-slate-50/80 px-6 py-4 flex items-center gap-3 border-b border-slate-200">
              <div className="w-6 h-6 rounded-full bg-[#ff5b00] text-white flex items-center justify-center font-bold text-[13px]">2</div>
              <h2 className="text-[16px] font-bold text-slate-800">Kiểm tra giỏ hàng</h2>
            </div>
            
            <div className="p-4">
              <div className="space-y-4 pb-5 border-b border-slate-100 mb-5">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <img src={item.image} alt={item.name} className="w-[80px] h-[80px] rounded-lg object-cover" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-[#0084ff] text-[15px] mb-1">{item.name}</h3>
                      <div className="text-[13px] text-slate-600 mb-0.5">{item.date}</div>
                      <div className="text-[13px] text-slate-600 mb-1">{item.type}</div>
                      <div className="text-[13px] text-slate-600">
                        {item.quantity} người lớn
                      </div>
                      <div className="text-[14px] font-medium text-slate-800 mt-2">
                        Tổng tạm: <span className="text-slate-800">{(item.price * item.quantity).toLocaleString('vi-VN')} đ</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 text-[14px] text-slate-600 mb-5">
                <div className="flex justify-between">
                  <span>Tổng tiền</span>
                  <span className="font-semibold text-slate-800">{totalPrice.toLocaleString('vi-VN')} đ</span>
                </div>
                <div className="flex justify-between">
                  <span>Khuyến mãi</span>
                  <span className="font-semibold text-[#ff5b00]">0 đ</span>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-5 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-center md:text-left">
                  <div className="text-[13px] text-slate-500 mb-1">Số tiền cần thanh toán</div>
                  <div className="text-[28px] font-bold text-[#ff5b00] leading-none">
                    {totalPrice.toLocaleString('vi-VN')} <span className="text-[18px] underline font-normal">đ</span>
                  </div>
                </div>
                
                <button 
                  onClick={onNextStep}
                  disabled={isProcessing}
                  className="w-full md:w-auto bg-[#ff5b00] hover:bg-[#e05000] text-white font-bold py-3.5 px-10 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-70 border border-[#e05000]"
                >
                  {isProcessing && (
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  <span className="text-[16px]">{isProcessing ? 'Đang xử lý...' : 'Xác nhận thanh toán'}</span>
                </button>
                
              </div>
              <p className="text-[12px] text-slate-500 mt-3 text-center md:text-right">
                Bằng việc tiếp tục, bạn đồng ý với <Link to="#" className="text-[#0084ff] hover:underline">Điều khoản dịch vụ</Link>.
              </p>
            </div>
          </section>
        </div>

        <div className="w-full lg:w-[320px] shrink-0 space-y-6">
          <div className="bg-[#f0f9ff] border border-blue-100 rounded-xl p-5">
             <h3 className="font-bold text-[15px] text-slate-800 mb-4">Tại sao đặt vé với Đi Vui</h3>
             <ul className="space-y-4">
               <li className="flex gap-3 text-[13px] text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-[#ff5b00] shrink-0 mt-0.5" />
                  <div>Đi Vui cam kết <span className="text-[#0084ff]">chính sách giá tốt, thấp hơn giá mua trực tiếp!</span></div>
               </li>
               <li className="flex gap-3 text-[13px] text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-[#ff5b00] shrink-0 mt-0.5" />
                  <div>Thanh toán bằng tiền Việt, không mất phí chuyển đổi ngoại tệ</div>
               </li>
               <li className="flex gap-3 text-[13px] text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-[#ff5b00] shrink-0 mt-0.5" />
                  <div>Chuyên viên người Việt, hỗ trợ tư vấn qua điện thoại, chat, email, zalo...</div>
               </li>
             </ul>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
             <h3 className="font-bold text-[15px] text-slate-800 mb-2">Bạn cần hỗ trợ?</h3>
             <p className="text-[12px] text-slate-500 mb-4">Liên hệ ngay với các chuyên viên tư vấn du lịch của Đi Vui để chúng tôi có thể hỗ trợ bạn kịp thời</p>
             
             <div className="border-t border-b border-slate-100 py-4 mb-4 text-center">
               <div className="font-bold text-[20px] text-[#ff5b00] tracking-wide">1900 0000</div>
               <div className="text-[13px] text-slate-500">hotro@ditravel.com</div>
             </div>
             
             <div className="text-center text-[13px]">
               <span className="text-slate-500 italic">Hoặc tham khảo thêm</span><br/>
               <Link to="#" className="text-[#0084ff] hover:underline">Các câu hỏi thường gặp</Link>
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
