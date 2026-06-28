import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Scale, CheckCircle2, User, CreditCard, ShieldCheck, 
  FileText, AlertTriangle, XCircle, RefreshCw, Headset
} from 'lucide-react';
import { motion } from 'motion/react';

const SECTIONS = [
  { id: 'sec-1', title: '1. Chấp thuận điều khoản' },
  { id: 'sec-2', title: '2. Tài khoản người dùng' },
  { id: 'sec-3', title: '3. Trách nhiệm khi đặt dịch vụ' },
  { id: 'sec-4', title: '4. Giá, thanh toán và xác nhận đơn' },
  { id: 'sec-5', title: '5. Chính sách hoàn/hủy' },
  { id: 'sec-6', title: '6. Voucher và ngày sử dụng' },
  { id: 'sec-7', title: '7. Quyền và trách nhiệm của DITRAVEL' },
  { id: 'sec-8', title: '8. Hành vi không được phép' },
  { id: 'sec-9', title: '9. Thay đổi điều khoản' },
  { id: 'sec-10', title: '10. Liên hệ hỗ trợ' }
];

export default function TermsPage() {
  const [activeSection, setActiveSection] = useState('sec-1');

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      let currentSection = 'sec-1';

      for (const section of SECTIONS) {
        const el = document.getElementById(section.id);
        if (el) {
          const offsetTop = el.offsetTop;
          if (scrollY >= offsetTop - 150) {
            currentSection = section.id;
          }
        }
      }
      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({ top: el.offsetTop - 100, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen font-sans pb-20 text-[#0f172a]">
      {/* Hero Section */}
      <div className="relative h-[240px] md:h-[300px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1504681869696-d977211a5f4c?q=80&w=2000&auto=format&fit=crop" 
            alt="Terms of Service" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent"></div>
        </div>
        
        <div className="relative z-10 w-full max-w-[1180px] px-4 mx-auto mt-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex flex-col items-center text-center">
            <h1 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight drop-shadow-md flex items-center gap-4 justify-center">
              Điều Khoản Sử Dụng
            </h1>
            <p className="text-base md:text-lg text-slate-200 max-w-2xl mb-4 drop-shadow-sm font-medium">
              Quy định rõ ràng, minh bạch giúp bảo vệ quyền lợi của bạn trong suốt quá trình trải nghiệm dịch vụ DITRAVEL.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 max-w-[1180px] mt-8 mb-16 relative z-20">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Cột trái: Mục lục (Sticky) */}
          <div className="w-full lg:w-[280px] shrink-0">
            <div className="sticky top-24 bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-6 hidden lg:block">
              <h3 className="font-bold text-[#0f172a] mb-5 text-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#0084ff]" /> Nội dung chính
              </h3>
              <ul className="space-y-1">
                {SECTIONS.map((section) => (
                  <li key={section.id}>
                    <button
                      onClick={() => scrollTo(section.id)}
                      className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        activeSection === section.id 
                          ? 'bg-blue-50 text-[#0084ff] font-bold' 
                          : 'text-[#64748b] hover:bg-slate-50 hover:text-[#0f172a]'
                      }`}
                    >
                      {section.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Mobile TOC */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-5 lg:hidden mb-2">
              <h3 className="font-bold text-[#0f172a] mb-4 text-base flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#0084ff]" /> Nội dung chính
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {SECTIONS.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollTo(section.id)}
                    className="text-left px-3 py-2 text-sm text-[#0084ff] hover:underline truncate"
                  >
                    {section.title}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Cột phải: Nội dung chi tiết */}
          <div className="flex-1 bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-6 md:p-10">
            
            {/* Section 1 */}
            <section id="sec-1" className="scroll-mt-28 mb-10 pb-10 border-b border-[#e2e8f0] last:border-0">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-50 text-[#0084ff] rounded-xl flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-[#0f172a]">1. Chấp thuận điều khoản</h2>
              </div>
              <p className="text-[#64748b] text-base leading-relaxed">
                Khi truy cập, đăng ký tài khoản hoặc đặt dịch vụ trên DITRAVEL, khách hàng đồng ý tuân thủ các điều khoản sử dụng được công bố trên website. Nếu bạn không đồng ý với bất kỳ phần nào của các điều khoản này, vui lòng không sử dụng dịch vụ của chúng tôi.
              </p>
            </section>

            {/* Section 2 */}
            <section id="sec-2" className="scroll-mt-28 mb-10 pb-10 border-b border-[#e2e8f0] last:border-0">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-indigo-50 text-indigo-500 rounded-xl flex items-center justify-center shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-[#0f172a]">2. Tài khoản người dùng</h2>
              </div>
              <ul className="space-y-3 text-[#64748b] text-base leading-relaxed">
                <li className="mb-2">
                  <span>Khách hàng cần cung cấp thông tin chính xác khi đăng ký tài khoản.</span>
                </li>
                <li className="mb-2">
                  <span>Khách hàng chịu trách nhiệm bảo mật thông tin tài khoản và mật khẩu của mình.</span>
                </li>
                <li className="mb-2">
                  <span>DITRAVEL có quyền khóa tài khoản mà không cần báo trước nếu phát hiện hành vi gian lận hoặc vi phạm điều khoản.</span>
                </li>
              </ul>
            </section>

            {/* Section 3 */}
            <section id="sec-3" className="scroll-mt-28 mb-10 pb-10 border-b border-[#e2e8f0] last:border-0">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-orange-50 text-[#ff5b00] rounded-xl flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-[#0f172a]">3. Trách nhiệm khi đặt dịch vụ</h2>
              </div>
              <ul className="space-y-3 text-[#64748b] text-base leading-relaxed mb-6">
                <li className="mb-2">
                  <span>Khách hàng cần kiểm tra kỹ thông tin tour/vé trước khi thanh toán.</span>
                </li>
                <li className="mb-2">
                  <span>Thông tin họ tên, số điện thoại, email, ngày sử dụng phải chính xác 100% khớp với giấy tờ tùy thân.</span>
                </li>
                <li className="mb-2">
                  <span>Sai thông tin có thể ảnh hưởng đến việc nhận voucher hoặc sử dụng dịch vụ tại điểm đến.</span>
                </li>
              </ul>

              <div className="bg-red-50 border border-red-100 rounded-xl p-5 flex items-start gap-4">
                <AlertTriangle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-red-800 mb-1">Lưu ý quan trọng:</h4>
                  <p className="text-red-700 text-sm leading-relaxed">
                    Mọi sai sót phát sinh do khách hàng cung cấp thông tin sai sẽ không thuộc trách nhiệm bồi thường của DITRAVEL.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 4 */}
            <section id="sec-4" className="scroll-mt-28 mb-10 pb-10 border-b border-[#e2e8f0] last:border-0">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center shrink-0">
                  <CreditCard className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-[#0f172a]">4. Giá, thanh toán và xác nhận đơn</h2>
              </div>
              <ul className="space-y-3 text-[#64748b] text-base leading-relaxed">
                <li className="mb-2">
                  <span>Giá dịch vụ có thể thay đổi theo ngày, mùa cao điểm, lễ/tết. Mức giá cuối cùng là mức giá hiển thị tại trang thanh toán.</span>
                </li>
                <li className="mb-2">
                  <span>Đơn hàng chỉ được xác nhận sau khi thanh toán thành công.</span>
                </li>
                <li className="mb-2">
                  <span>Với thanh toán chuyển khoản thủ công (SePay), khách cần chuyển ĐÚNG số tiền và ĐÚNG nội dung thanh toán để hệ thống tự động xác nhận.</span>
                </li>
              </ul>
            </section>

            {/* Section 5 */}
            <section id="sec-5" className="scroll-mt-28 mb-10 pb-10 border-b border-[#e2e8f0] last:border-0">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center shrink-0">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-[#0f172a]">5. Chính sách hoàn/hủy</h2>
              </div>
              <ul className="space-y-3 text-[#64748b] text-base leading-relaxed">
                <li className="mb-2">
                  <span>Mỗi tour/vé có chính sách hoàn/hủy riêng do nhà cung cấp quy định.</span>
                </li>
                <li className="mb-2">
                  <span>Khách hàng có trách nhiệm cần đọc kỹ chính sách này trước khi tiến hành thanh toán.</span>
                </li>
                <li className="mb-2">
                  <span>Một số vé tham quan (Fixed date) hoặc vé nằm trong chương trình khuyến mãi đặc biệt có thể sẽ KHÔNG hỗ trợ hoàn/hủy dưới bất kỳ hình thức nào.</span>
                </li>
              </ul>
            </section>

            {/* Section 6 */}
            <section id="sec-6" className="scroll-mt-28 mb-10 pb-10 border-b border-[#e2e8f0] last:border-0">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-[#0f172a]">6. Voucher và ngày sử dụng</h2>
              </div>
              <ul className="space-y-3 text-[#64748b] text-base leading-relaxed">
                <li className="mb-2">
                  <span>Voucher điện tử (E-voucher) được gửi qua email, tài khoản hoặc kênh hỗ trợ Zalo sau khi đơn được xác nhận.</span>
                </li>
                <li className="mb-2">
                  <span>Voucher chỉ có giá trị trong ngày sử dụng đã chọn (trừ vé dạng Open Date).</span>
                </li>
                <li className="mb-2">
                  <span>Khách hàng cần xuất trình mã QR trên voucher tại cổng soát vé hoặc cho hướng dẫn viên khi sử dụng dịch vụ.</span>
                </li>
              </ul>
            </section>

            {/* Section 7 */}
            <section id="sec-7" className="scroll-mt-28 mb-10 pb-10 border-b border-[#e2e8f0] last:border-0">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-teal-50 text-teal-500 rounded-xl flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-[#0f172a]">7. Quyền và trách nhiệm của DITRAVEL</h2>
              </div>
              <ul className="space-y-3 text-[#64748b] text-base leading-relaxed">
                <li className="mb-2">
                  <span>Cam kết cung cấp thông tin dịch vụ rõ ràng, minh bạch nhất đến khách hàng.</span>
                </li>
                <li className="mb-2">
                  <span>Hỗ trợ khách hàng tối đa trong quá trình đặt vé và trong suốt thời gian sử dụng dịch vụ.</span>
                </li>
                <li className="mb-2">
                  <span>Có quyền thay đổi thông tin sản phẩm trên website nếu nhà cung cấp có sự thay đổi lịch trình, giá vé hoặc điều kiện sử dụng.</span>
                </li>
              </ul>
            </section>

            {/* Section 8 */}
            <section id="sec-8" className="scroll-mt-28 mb-10 pb-10 border-b border-[#e2e8f0] last:border-0">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center shrink-0">
                  <XCircle className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-[#0f172a]">8. Hành vi không được phép</h2>
              </div>
              <ul className="space-y-3 text-[#64748b] text-base leading-relaxed">
                <li className="mb-2">
                  <span>Sử dụng thông tin giả mạo để đăng ký hoặc mua hàng.</span>
                </li>
                <li className="mb-2">
                  <span>Đặt đơn ảo, spam hệ thống liên tục làm gián đoạn dịch vụ của DITRAVEL.</span>
                </li>
                <li className="mb-2">
                  <span>Can thiệp trái phép, tấn công mạng vào cấu trúc mã nguồn của website.</span>
                </li>
                <li className="mb-2">
                  <span>Sao chép nội dung, hình ảnh, mã nguồn khi chưa được sự cho phép bằng văn bản từ DITRAVEL.</span>
                </li>
              </ul>
            </section>

            {/* Section 9 */}
            <section id="sec-9" className="scroll-mt-28 mb-10 pb-10 border-b border-[#e2e8f0] last:border-0">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center shrink-0">
                  <Scale className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-[#0f172a]">9. Thay đổi điều khoản</h2>
              </div>
              <p className="text-[#64748b] text-base leading-relaxed">
                DITRAVEL có thể cập nhật, điều chỉnh điều khoản sử dụng này theo từng thời điểm để phù hợp với pháp luật và tình hình kinh doanh. Phiên bản mới nhất sẽ được công bố trực tiếp trên website và tự động có hiệu lực ngay từ ngày cập nhật.
              </p>
            </section>

            {/* Section 10 */}
            <section id="sec-10" className="scroll-mt-28">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-50 text-[#0084ff] rounded-xl flex items-center justify-center shrink-0">
                  <Headset className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-[#0f172a]">10. Liên hệ hỗ trợ</h2>
              </div>
              <p className="text-[#64748b] text-base leading-relaxed mb-6">
                Nếu có bất kỳ câu hỏi nào về Điều khoản sử dụng hoặc cần phản hồi về dịch vụ, khách hàng có thể liên hệ với DITRAVEL thông qua các kênh chính thức:
              </p>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div className="border border-slate-200 rounded-xl p-4 text-center">
                  <div className="font-bold text-slate-800 mb-1">Hotline</div>
                  <div className="text-[#ff5b00] font-black text-lg">1900 0000</div>
                </div>
                <div className="border border-slate-200 rounded-xl p-4 text-center">
                  <div className="font-bold text-slate-800 mb-1">Email</div>
                  <div className="text-[#0084ff] font-medium">hotro@ditravel.com</div>
                </div>
                <div className="border border-slate-200 rounded-xl p-4 text-center">
                  <div className="font-bold text-slate-800 mb-1">Hỗ trợ nhanh</div>
                  <Link to="/contact" className="text-[#0084ff] font-medium hover:underline">Gửi yêu cầu</Link>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* CTA Cuối trang */}
        <div className="mt-16">
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 md:p-12 shadow-lg text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-700">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Bạn cần hỗ trợ thêm?</h2>
              <p className="text-slate-300 text-lg max-w-2xl">
                Đội ngũ DITRAVEL luôn sẵn sàng giải đáp thắc mắc về điều khoản, thanh toán và chính sách dịch vụ 24/7.
              </p>
            </div>
            <Link 
              to="/contact" 
              className="shrink-0 bg-[#ff5b00] hover:bg-[#e05000] text-white px-8 py-4 rounded-xl font-bold text-lg shadow-md hover:shadow-xl transition-all hover:-translate-y-1"
            >
              Liên hệ hỗ trợ
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
