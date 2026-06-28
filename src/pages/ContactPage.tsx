import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Phone, Mail, Share2, Clock, CheckCircle2, 
  MapPin, Send, Facebook, Instagram, ChevronDown, ChevronUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const FAQS = [
  {
    q: 'Tôi đặt vé xong bao lâu nhận được voucher?',
    a: 'Sau khi thanh toán thành công, hệ thống sẽ tự động gửi E-voucher về email của bạn trong vòng 5-15 phút. Đối với một số dịch vụ đặc thù cần xác nhận thủ công, thời gian có thể kéo dài tối đa 24h.'
  },
  {
    q: 'Tôi có thể đổi ngày sử dụng vé không?',
    a: 'Tùy thuộc vào chính sách của từng nhà cung cấp và loại vé bạn đặt. Vui lòng kiểm tra mục "Chính sách hủy/đổi" trong chi tiết đơn hàng hoặc liên hệ hotline để được hỗ trợ kiểm tra.'
  },
  {
    q: 'Nếu thanh toán rồi nhưng chưa nhận được vé thì làm sao?',
    a: 'Vui lòng kiểm tra hộp thư rác (Spam/Junk) trong email của bạn. Nếu vẫn không thấy, hãy gọi ngay hotline 1900 0000 và đọc mã đơn hàng để được cấp lại vé ngay lập tức.'
  },
  {
    q: 'Chính sách hoàn hủy như thế nào?',
    a: 'Chính sách hoàn hủy tùy thuộc vào từng sản phẩm. Đa số vé tham quan (Fixed date) không hỗ trợ hoàn hủy. Các vé linh hoạt hoặc tour du lịch có thể hủy trước 24-72h (tùy quy định cụ thể).'
  },
  {
    q: 'Tôi có thể liên hệ qua Zalo không?',
    a: 'Chắc chắn rồi. Bạn có thể tìm kiếm Zalo OA "DITRAVEL" hoặc gọi trực tiếp Hotline để gặp nhân viên hỗ trợ chuyển qua kênh Zalo giúp bạn gửi hình ảnh/tài liệu dễ dàng hơn.'
  }
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '', phone: '', email: '', subject: '', orderId: '', message: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showToast, setShowToast] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) newErrors.name = 'Vui lòng nhập họ tên';
    if (!formData.phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/[^0-9]/g, ''))) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không đúng định dạng';
    }
    if (!formData.subject) newErrors.subject = 'Vui lòng chọn chủ đề liên hệ';
    if (!formData.message.trim()) {
      newErrors.message = 'Vui lòng nhập nội dung';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Nội dung tối thiểu 10 ký tự';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Simulate API call
      setShowToast(true);
      setFormData({ name: '', phone: '', email: '', subject: '', orderId: '', message: '' });
      setTimeout(() => setShowToast(false), 5000);
    }
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen font-sans pb-24 text-[#0f172a]">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: -20, x: '-50%' }} 
            animate={{ opacity: 1, y: 0, x: '-50%' }} 
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-8 left-1/2 z-50 bg-white px-6 py-4 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.12)] border border-emerald-100 flex items-start gap-3 min-w-[320px]"
          >
            <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
            <div>
              <div className="font-bold text-slate-800">Gửi yêu cầu thành công</div>
              <div className="text-sm text-slate-500">DITRAVEL sẽ liên hệ lại với bạn trong thời gian sớm nhất.</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <div className="relative h-[280px] md:h-[340px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1504681869696-d977211a5f4c?q=80&w=2000&auto=format&fit=crop" 
            alt="DITRAVEL Support" 
            className="w-full h-full object-cover"
          />
          {/* Lớp bóng mờ đen (Vignette/Gradient) ở dưới cùng để đảm bảo chữ màu trắng luôn đọc được trên mọi nền ảnh */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent"></div>
        </div>
        
        <div className="relative z-10 w-full max-w-[1180px] px-4 mx-auto mt-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center flex flex-col items-center">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-5 tracking-tight drop-shadow-md">Liên hệ DITRAVEL</h1>
            <p className="text-lg md:text-xl text-orange-50 max-w-2xl mb-8 drop-shadow-sm font-medium">
              Bạn cần tư vấn tour, vé tham quan hoặc hỗ trợ đơn hàng? Đội ngũ DITRAVEL luôn sẵn sàng hỗ trợ bạn.
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
              <div className="flex items-center gap-2 text-[#ff5b00] bg-white px-6 py-3 rounded-full text-sm font-bold shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-1 transition-transform cursor-default">
                <CheckCircle2 className="w-5 h-5 text-[#ff5b00]" /> Hỗ trợ nhanh
              </div>
              <div className="flex items-center gap-2 text-[#ff5b00] bg-white px-6 py-3 rounded-full text-sm font-bold shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-1 transition-transform cursor-default">
                <CheckCircle2 className="w-5 h-5 text-[#ff5b00]" /> Tư vấn miễn phí
              </div>
              <div className="flex items-center gap-2 text-[#ff5b00] bg-white px-6 py-3 rounded-full text-sm font-bold shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-1 transition-transform cursor-default">
                <CheckCircle2 className="w-5 h-5 text-[#ff5b00]" /> Phản hồi trong ngày
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-[1180px] -mt-12 relative z-20">
        
        <div className="flex flex-col lg:flex-row gap-8 mb-16">
          
          {/* Cột trái: Thông tin liên hệ nhanh (35%) */}
          <div className="w-full lg:w-[35%] space-y-4">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:border-[#0084ff]/30 transition-colors">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-blue-50 text-[#0084ff] rounded-xl flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Đường dây nóng</h3>
                  <p className="text-sm text-[#64748b] mb-3">Hỗ trợ tư vấn tour, vé và thanh toán</p>
                  <div className="text-xl font-black text-[#ff5b00] mb-3">1900 0000</div>
                  <a href="tel:19000000" className="inline-block px-4 py-2 bg-blue-50 text-[#0084ff] font-bold text-sm rounded-lg hover:bg-[#0084ff] hover:text-white transition-colors">
                    Gọi ngay
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:border-[#0084ff]/30 transition-colors">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-orange-50 text-[#ff5b00] rounded-xl flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Hộp thư hỗ trợ</h3>
                  <p className="text-sm text-[#64748b] mb-3">Gửi câu hỏi hoặc yêu cầu hỗ trợ chi tiết</p>
                  <div className="font-bold text-slate-700 mb-3">hotro@ditravel.com</div>
                  <a href="mailto:hotro@ditravel.com" className="inline-block px-4 py-2 bg-orange-50 text-[#ff5b00] font-bold text-sm rounded-lg hover:bg-[#ff5b00] hover:text-white transition-colors">
                    Gửi email
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-xl flex items-center justify-center shrink-0">
                  <Share2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Kết nối với chúng tôi</h3>
                  <p className="text-sm text-[#64748b] mb-3">Theo dõi DITRAVEL để cập nhật ưu đãi mới</p>
                  <div className="flex gap-3">
                    <a href="#" className="w-10 h-10 bg-slate-50 hover:bg-[#0084ff] hover:text-white transition-colors rounded-full flex items-center justify-center text-slate-500"><Facebook className="w-4 h-4" /></a>
                    <a href="#" className="w-10 h-10 bg-slate-50 hover:bg-pink-500 hover:text-white transition-colors rounded-full flex items-center justify-center text-slate-500"><Instagram className="w-4 h-4" /></a>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Thời gian làm việc</h3>
                  <p className="text-sm text-[#64748b] mb-1">Thứ 2 - Chủ nhật</p>
                  <p className="font-bold text-slate-700">08:00 - 21:00</p>
                </div>
              </div>
            </div>
          </div>

          {/* Cột phải: Form gửi lời nhắn (65%) */}
          <div className="w-full lg:w-[65%]">
            <div className="bg-white rounded-2xl p-8 lg:p-10 shadow-sm border border-slate-100">
              <h2 className="text-2xl font-bold mb-2">Gửi lời nhắn cho chúng tôi</h2>
              <p className="text-[#64748b] mb-8">Hãy để lại thông tin, đội ngũ tư vấn viên sẽ liên hệ lại với bạn trong thời gian sớm nhất.</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Họ tên <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-4 h-[46px] border ${errors.name ? 'border-red-500' : 'border-slate-200'} rounded-xl focus:outline-none focus:ring-1 focus:ring-[#ff5b00] focus:border-[#ff5b00] transition-colors`} 
                      placeholder="Nhập họ tên của bạn" 
                    />
                    {errors.name && <span className="text-red-500 text-xs mt-1 block">{errors.name}</span>}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Số điện thoại <span className="text-red-500">*</span></label>
                    <input 
                      type="tel" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full px-4 h-[46px] border ${errors.phone ? 'border-red-500' : 'border-slate-200'} rounded-xl focus:outline-none focus:ring-1 focus:ring-[#ff5b00] focus:border-[#ff5b00] transition-colors`} 
                      placeholder="VD: 0912345678" 
                    />
                    {errors.phone && <span className="text-red-500 text-xs mt-1 block">{errors.phone}</span>}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
                    <input 
                      type="text" 
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 h-[46px] border ${errors.email ? 'border-red-500' : 'border-slate-200'} rounded-xl focus:outline-none focus:ring-1 focus:ring-[#ff5b00] focus:border-[#ff5b00] transition-colors`} 
                      placeholder="VD: email@example.com" 
                    />
                    {errors.email && <span className="text-red-500 text-xs mt-1 block">{errors.email}</span>}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Chủ đề liên hệ <span className="text-red-500">*</span></label>
                    <input 
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className={`w-full px-4 h-[46px] border ${errors.subject ? 'border-red-500' : 'border-slate-200'} rounded-xl focus:outline-none focus:ring-1 focus:ring-[#ff5b00] focus:border-[#ff5b00] transition-colors bg-white`}
                      placeholder="VD: Hỗ trợ đặt tour"
                    />
                    {errors.subject && <span className="text-red-500 text-xs mt-1 block">{errors.subject}</span>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Mã đơn hàng (Nếu có)</label>
                  <input 
                    type="text" 
                    name="orderId"
                    value={formData.orderId}
                    onChange={handleInputChange}
                    className="w-full px-4 h-[46px] border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#ff5b00] focus:border-[#ff5b00] transition-colors" 
                    placeholder="VD: DI12345678" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Nội dung chi tiết <span className="text-red-500">*</span></label>
                  <textarea 
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4} 
                    className={`w-full px-4 py-3 border ${errors.message ? 'border-red-500' : 'border-slate-200'} rounded-xl focus:outline-none focus:ring-1 focus:ring-[#ff5b00] focus:border-[#ff5b00] transition-colors resize-none min-h-[120px]`} 
                    placeholder="Vui lòng mô tả chi tiết vấn đề của bạn..."
                  ></textarea>
                  {errors.message && <span className="text-red-500 text-xs mt-1 block">{errors.message}</span>}
                </div>

                <div className="pt-2 flex justify-center">
                  <button 
                    type="submit"
                    className="w-full md:w-[300px] px-8 h-[48px] bg-[#ff5b00] hover:bg-[#e05000] text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-5 h-5" /> Gửi yêu cầu hỗ trợ
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Khu vực địa chỉ và bản đồ */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white rounded-2xl p-8 lg:p-10 shadow-sm border border-slate-100 flex flex-col justify-center">
            <div className="w-14 h-14 bg-blue-50 text-[#0084ff] rounded-xl flex items-center justify-center mb-6">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Trụ sở chính</h3>
            <p className="text-[#64748b] text-lg leading-relaxed mb-8">
              11A Hồng Hà, Phường 2,<br/>Quận Tân Bình, Thành phố Hồ Chí Minh, Việt Nam
            </p>
            
            <div className="space-y-3 mb-8 text-[15px]">
              <div className="flex items-center gap-3">
                <span className="font-bold text-slate-700 w-24">Hotline:</span>
                <span className="text-[#0084ff] font-bold">1900 0000</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-slate-700 w-24">Email:</span>
                <span className="text-slate-600">hotro@ditravel.com</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-slate-700 w-24">Giờ làm việc:</span>
                <span className="text-slate-600">08:00 - 21:00</span>
              </div>
            </div>

            <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center px-6 h-[44px] border-2 border-[#0084ff] text-[#0084ff] hover:bg-[#0084ff] hover:text-white font-bold rounded-xl transition-colors w-max">
              Xem trên Google Maps
            </a>
          </div>
          
          <div className="rounded-2xl overflow-hidden shadow-sm border border-slate-100 h-[400px] bg-slate-200">
            {/* Mock map placeholder */}
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.123456789!2d106.666666!3d10.800000!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDQ4JzAwLjAiTiAxMDbCsDQwJzAwLjAiRQ!5e0!3m2!1sen!2s!4v1620000000000!5m2!1sen!2s" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={false} 
              loading="lazy"
              title="Google Map"
            ></iframe>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-[800px] mx-auto mb-16">
          <h2 className="text-3xl font-bold text-center mb-10">Câu hỏi thường gặp</h2>
          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
                <button 
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-colors"
                >
                  <span className="font-bold text-lg pr-4">{idx + 1}. {faq.q}</span>
                  {openFaq === idx ? (
                    <ChevronUp className="w-5 h-5 text-[#ff5b00] shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                  )}
                </button>
                <AnimatePresence>
                  {openFaq === idx && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 pt-0 text-[#64748b] leading-relaxed border-t border-slate-50 mt-2">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
