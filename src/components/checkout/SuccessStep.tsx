import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Clock, CheckCircle2, AlertCircle, Download } from 'lucide-react';
import { motion } from 'motion/react';

interface SuccessStepProps {
  isPaid: boolean;
  setIsPaid: (paid: boolean) => void;
  contactInfo: { name: string; phone: string; email: string; address: string };
  cartItems: any[];
  totalPrice: number;
}

export default function SuccessStep({
  isPaid,
  setIsPaid,
  contactInfo,
  cartItems,
  totalPrice
}: SuccessStepProps) {
  const qrUrl = `https://img.vietqr.io/image/vcb-0071001060528-compact2.png?amount=${totalPrice}&addInfo=119123%20${encodeURIComponent(contactInfo.name || "Nguyen Van Kien")}&accountName=CT%20TNHH%20DI%20VUI`;

  const handleDownloadQR = async () => {
    try {
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'QR_ThanhToan_119123.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading QR:', error);
      window.open(qrUrl, '_blank'); // Fallback
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex flex-col lg:flex-row gap-5 mt-5">
        <div className="flex-1 space-y-6">
          
          {isPaid ? (
            <div className="mb-8 bg-[#fdfdfd] border border-green-500/30 rounded-2xl p-5 text-center shadow-sm">
                <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h1 className="text-[26px] font-bold text-slate-800 mb-2">Thanh toán thành công!</h1>
                <p className="text-[14px] text-slate-600 mb-8">Đơn hàng <strong className="text-slate-800 text-[15px]">119123</strong> đã được thanh toán hoàn tất.</p>
                
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mb-8 max-w-lg mx-auto text-left shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]">
                    <div className="flex items-start gap-4 mb-6">
                         <div className="w-10 h-10 rounded-full bg-blue-100 text-[#0084ff] flex items-center justify-center shrink-0">
                            <Mail className="w-5 h-5" />
                         </div>
                         <div>
                            <div className="font-bold text-slate-800 mb-1">Kiểm tra email của bạn</div>
                            <div className="text-[13px] text-slate-600 leading-relaxed">
                               Chúng tôi đã gửi Voucher/Vé điện tử cùng hướng dẫn sử dụng chi tiết qua email <strong className="text-slate-800">{contactInfo.email || "nguyenvankien@gmail.com"}</strong>. Vui lòng kiểm tra hộp thư (bao gồm cả thư rác/spam).
                            </div>
                         </div>
                    </div>
                    <div className="flex items-start gap-4">
                         <div className="w-10 h-10 rounded-full bg-orange-100 text-[#ff5b00] flex items-center justify-center shrink-0">
                            <Clock className="w-5 h-5" />
                         </div>
                         <div>
                            <div className="font-bold text-slate-800 mb-1">Thời gian xử lý</div>
                            <div className="text-[13px] text-slate-600 leading-relaxed">
                               Dịch vụ sẽ được gửi trong vòng 24h. Mã vé sẽ đóng vai trò như thẻ lên thuyền/vào cổng của bạn.
                            </div>
                         </div>
                    </div>
                </div>
          
                <Link to="/" className="inline-block bg-[#ff5b00] text-white font-bold px-8 py-3.5 rounded-xl hover:bg-[#e05000] transition-colors shadow-md">
                   Về Trang Chủ
                </Link>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h1 className="text-[28px] font-bold text-slate-800 mb-2">Đặt vé hoàn tất!</h1>
                <p className="text-[14px] text-slate-600 mb-6">Cảm ơn bạn đã sử dụng dịch vụ của ditravel.com</p>

                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#65b035] shrink-0 mt-0.5" />
                    <div className="text-[15px] text-slate-800 font-medium">Mã đơn hàng của bạn là <span className="font-bold">119123</span></div>
                  </li>
                  <li className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-[#ff5b00] shrink-0 mt-0.5" />
                    <div className="text-[15px] text-slate-800">Đây là đơn hàng chưa được thanh toán. Vui lòng thanh toán sớm để tránh bị hủy hoặc hết vé</div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#65b035] shrink-0 mt-0.5" />
                    <div className="text-[15px] text-slate-800">Voucher/Vé và hướng dẫn sử dụng dịch vụ sẽ được gửi đến địa chỉ <span className="font-bold">{contactInfo.email || "nguyenvankien@gmail.com"}</span> trong vòng 24h kể từ thời điểm ĐIVUI nhận được thanh toán</div>
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="text-[18px] font-medium text-slate-800 mb-4">Thông tin thanh toán</h2>
                <div className="border border-[#ff5b00]/30 rounded-lg bg-white overflow-hidden mb-3 shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
                   <div className="p-4 bg-orange-50/50 border-b border-[#ff5b00]/20 flex items-center justify-between gap-3">
                     <div className="flex items-center gap-3">
                       <CheckCircle2 className="w-5 h-5 text-[#ff5b00]" />
                       <div className="font-medium text-slate-800 text-[14px]">Thanh toán qua chuyển khoản ngân hàng hoặc QR code</div>
                     </div>
                     <button 
                       onClick={() => setIsPaid(true)}
                       className="text-[12px] bg-slate-800 text-white px-3 py-1.5 rounded-md hover:bg-slate-700 transition-colors hidden md:block"
                     >
                        [Dev] Webhook Đã quét mã
                     </button>
                   </div>
                   <div className="p-4">
                      <p className="text-[13px] text-slate-600 mb-4 leading-relaxed">
                        Vui lòng chuyển tổng số tiền cần thanh toán vào tài khoản ngân hàng của ĐIVUI như bên dưới, Voucher/Vé sử dụng dịch vụ sẽ được gửi vào email mà bạn cung cấp trong vòng 24h kể từ thời điểm ĐIVUI nhận được thanh toán.
                      </p>
                      <div className="bg-[#fff9e6] border border-[#ffecb3] p-4 rounded-md mb-6 inline-block w-full">
                         <div className="text-[14px] text-slate-800">Vui lòng ghi rõ nội dung thanh toán: <span className="font-bold">119123 {contactInfo.name || "Nguyễn Văn Kiên"}</span></div>
                      </div>

                      <div className="flex flex-col md:flex-row gap-4">
                         <div className="flex-1 border border-slate-200 rounded-lg p-5 flex items-start gap-4">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Vietcombank_Logo.svg/2048px-Vietcombank_Logo.svg.png" alt="Vietcombank" className="w-[100px] object-contain" />
                            <div className="text-[13px] text-slate-700 space-y-1.5 flex-1">
                               <div><span className="text-slate-500 min-w-[70px] inline-block">Ngân hàng:</span> <strong className="text-slate-800">VIETCOMBANK</strong></div>
                               <div className="flex justify-between items-center group cursor-pointer" onClick={() => navigator.clipboard.writeText('0071001060528')}>
                                 <div><span className="text-slate-500 min-w-[70px] inline-block">Số tài khoản:</span> <strong className="text-slate-800 text-[14px]">0071001060528</strong></div>
                               </div>
                               <div><span className="text-slate-500 min-w-[70px] inline-block">Chi nhánh:</span> <span>GIA ĐỊNH</span></div>
                               <div><span className="text-slate-500 min-w-[70px] inline-block">Chủ tài khoản:</span> <span>CT TNHH DI VUI</span></div>
                               <div><span className="text-slate-500 min-w-[70px] inline-block">Số tiền:</span> <strong className="text-[14px] text-slate-800">{totalPrice.toLocaleString('vi-VN')}</strong></div>
                               <div><span className="text-slate-500 min-w-[70px] inline-block">Nội dung:</span> <strong>119123 {contactInfo.name || "Nguyễn Văn Kiên"}</strong></div>
                            </div>
                         </div>
                         <div className="border border-slate-200 rounded-lg p-5 flex flex-col items-center justify-center bg-white min-w-[200px]">
                            <img src={qrUrl} alt="QR Code" className="w-[150px] h-[160px] object-contain mix-blend-multiply cursor-pointer mb-3" onClick={() => setIsPaid(true)} title="Click để mô phỏng quét mã thành công" />
                            <button 
                              onClick={handleDownloadQR}
                              className="flex items-center justify-center gap-1.5 bg-[#0084ff] text-white px-4 py-2 rounded-lg text-[13px] font-medium hover:bg-[#0070d9] transition-colors w-full shadow-sm"
                            >
                              <Download className="w-4 h-4" />
                              Tải mã QR
                            </button>
                            <span className="text-[10px] text-slate-400 mt-3 text-center leading-tight">*Click vào mã QR để mô phỏng<br/>đã thanh toán thành công</span>
                         </div>
                      </div>
                   </div>
                </div>
              </div>
            </>
          )}

          <div className="mt-10">
            <h2 className="text-[18px] font-medium text-slate-800 mb-4">Kiểm tra lại đặt vé của bạn</h2>
            <div className="bg-white border border-slate-200 rounded-lg p-4">
               {cartItems.map((item, index) => (
                 <div key={item.id} className={`flex gap-4 ${index !== cartItems.length - 1 ? 'border-b border-slate-100 pb-5 mb-5' : ''}`}>
                   <img src={item.image} alt={item.name} className="w-[120px] h-[80px] rounded object-cover" />
                   <div className="flex-1">
                     <h3 className="font-semibold text-[#0084ff] text-[15px] mb-1">{item.name}</h3>
                     <div className="text-[13px] text-slate-600 mb-0.5">{item.type}</div>
                     <div className="text-[13px] text-slate-600 mb-1">{item.quantity} người lớn</div>
                     <div className="text-[13px] text-slate-800 font-medium">Ngày sử dụng <span className="font-normal text-slate-600">{item.date}</span></div>
                     
                     <div className="text-right text-[13px] text-slate-600 mt-2">
                       Tổng tạm: {totalPrice.toLocaleString('vi-VN')} đ
                     </div>
                   </div>
                 </div>
               ))}
               
               <div className="mt-5 pt-5 border-t border-slate-200 flex justify-between items-center">
                 <span className="font-semibold text-slate-800 text-[15px]">Tổng cộng</span>
                 <span className="font-bold text-slate-800 text-[18px]">{totalPrice.toLocaleString('vi-VN')} <span className="underline text-[14px] ml-0.5 relative -top-0.5">đ</span></span>
               </div>
            </div>
          </div>

          <div className="mt-10 mb-10">
            <h2 className="text-[18px] font-medium text-slate-800 mb-4">Thông tin khách hàng</h2>
            <div className="bg-white border border-slate-200 rounded-lg p-4">
               <div className="grid grid-cols-[120px_1fr] gap-y-4 text-[14px]">
                  <div className="font-medium text-slate-700">Quý danh</div>
                  <div className="text-slate-600 uppercase">MR</div>
                  
                  <div className="font-medium text-slate-700">Họ và tên</div>
                  <div className="text-slate-600">{contactInfo.name || "Nguyễn Văn Kiên"}</div>
                  
                  <div className="font-medium text-slate-700">Điện thoại</div>
                  <div className="text-slate-600">{contactInfo.phone || "0907999111"}</div>
                  
                  <div className="font-medium text-slate-700">Email</div>
                  <div className="text-slate-600">{contactInfo.email || "nguyenvankien@gmail.com"}</div>

                  {contactInfo.address && (
                    <>
                      <div className="font-medium text-slate-700">Địa chỉ</div>
                      <div className="text-slate-600">{contactInfo.address}</div>
                    </>
                  )}
               </div>
            </div>
          </div>
          
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
