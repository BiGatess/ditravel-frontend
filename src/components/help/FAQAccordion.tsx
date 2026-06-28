import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const FAQS = [
  {
    question: 'Làm thế nào để tôi nhận được vé sau khi thanh toán?',
    answer: 'Sau khi thanh toán thành công, E-Voucher/Vé điện tử sẽ được gửi trực tiếp vào email mà bạn đã cung cấp khi đặt hàng trong vòng 24 giờ. Bạn chỉ cần mở email và đưa mã QR/Mã vé cho nhân viên kiểm soát khi đến địa điểm tham quan.'
  },
  {
    question: 'Tôi có thể hủy vé hoặc thay đổi ngày sử dụng không?',
    answer: 'Chính sách hoàn hủy và thay đổi ngày phụ thuộc vào từng loại vé và nhà cung cấp. Bạn vui lòng xem kỹ phần "Chính sách hủy" ở trang chi tiết sản phẩm trước khi đặt. Nếu vé cho phép hủy, hãy liên hệ hotline của chúng tôi trước 48h để được hỗ trợ.'
  },
  {
    question: 'Chính sách giá vé cho trẻ em tính như thế nào?',
    answer: 'Thông thường trẻ em dưới 1m sẽ được miễn phí. Trẻ em từ 1m - 1.4m sẽ tính vé trẻ em. Từ 1.4m trở lên sẽ tính vé người lớn. Tuy nhiên quy định này có thể thay đổi tùy theo khu du lịch, chi tiết xem tại mục mô tả của từng dịch vụ.'
  },
  {
    question: 'Thanh toán trên DITRAVEL có an toàn không?',
    answer: 'DITRAVEL cam kết bảo mật 100% thông tin giao dịch của khách hàng. Chúng tôi sử dụng các cổng thanh toán uy tín và kết nối mã hóa SSL an toàn.'
  }
];

export default function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-4">
      {FAQS.map((faq, index) => (
        <div key={index} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <button 
            className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none"
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
          >
            <span className="font-bold text-slate-800 text-[15px]">{faq.question}</span>
            <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`} />
          </button>
          
          <AnimatePresence>
            {openIndex === index && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-5 pt-1 text-[14px] text-slate-600 leading-relaxed border-t border-slate-100">
                  {faq.answer}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
