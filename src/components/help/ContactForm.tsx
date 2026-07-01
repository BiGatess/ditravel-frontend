import React, { useState } from 'react';
import { Send, PhoneCall, Mail } from 'lucide-react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    orderId: '',
    message: ''
  });

  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
      setFormData({ name: '', email: '', orderId: '', message: '' });
    }, 5000);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm">
      <h2 className="text-xl font-bold text-slate-800 mb-6">Gửi yêu cầu hỗ trợ</h2>
      
      {isSent ? (
        <div className="bg-green-50 text-green-700 p-6 rounded-xl text-center border border-green-100 mb-6">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Send className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-[16px] mb-1">Gửi thành công!</h3>
          <p className="text-[13px]">Cảm ơn bạn đã liên hệ. DITRAVEL sẽ phản hồi lại qua email trong vòng 24h làm việc.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">Họ và tên *</label>
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full border border-slate-300 rounded-lg p-3 text-[14px] outline-none focus:border-[#0084ff] focus:ring-1 focus:ring-[#0084ff]"
                placeholder="Nhập họ và tên"
              />
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">Email *</label>
              <input 
                type="email" 
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full border border-slate-300 rounded-lg p-3 text-[14px] outline-none focus:border-[#0084ff] focus:ring-1 focus:ring-[#0084ff]"
                placeholder="Nhập email của bạn"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">Mã đơn hàng (Nếu có)</label>
            <input 
              type="text" 
              value={formData.orderId}
              onChange={(e) => setFormData({...formData, orderId: e.target.value})}
              className="w-full border border-slate-300 rounded-lg p-3 text-[14px] outline-none focus:border-[#0084ff] focus:ring-1 focus:ring-[#0084ff]"
              placeholder="VD: ORDER12345"
            />
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">Nội dung cần hỗ trợ *</label>
            <textarea 
              required
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              className="w-full border border-slate-300 rounded-lg p-3 text-[14px] outline-none focus:border-[#0084ff] focus:ring-1 focus:ring-[#0084ff] resize-none"
              placeholder="Mô tả chi tiết vấn đề của bạn..."
            />
          </div>

          <button type="submit" className="bg-[#0084ff] hover:bg-[#0070d9] text-white font-bold py-3 px-8 rounded-lg transition-colors flex items-center justify-center gap-2 w-full md:w-auto shadow-sm">
            <Send className="w-4 h-4" />
            Gửi yêu cầu
          </button>
        </form>
      )}

      <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center gap-3 bg-orange-50 p-4 rounded-xl text-[#ff5b00]">
          <div className="bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-sm shrink-0">
            <PhoneCall className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[12px] font-semibold uppercase tracking-wider mb-0.5">Hotline hỗ trợ 24/7</div>
            <div className="font-bold text-[16px]">0908 108 098</div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 bg-blue-50 p-4 rounded-xl text-[#0084ff]">
          <div className="bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-sm shrink-0">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[12px] font-semibold uppercase tracking-wider mb-0.5">Email liên hệ</div>
            <div className="font-bold text-[16px]">hotro@ditravel.com</div>
          </div>
        </div>
      </div>
    </div>
  );
}
