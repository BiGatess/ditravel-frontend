import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, CheckCircle2, EyeOff, 
  Database, Share2, Server, Clock, 
  Phone, Mail, Target
} from 'lucide-react';
import { motion } from 'motion/react';

export default function PrivacyPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#f8fafc] min-h-screen font-sans pb-20 text-[#0f172a]">
      {/* Hero Section */}
      <div className="relative h-[240px] md:h-[300px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1504681869696-d977211a5f4c?q=80&w=2000&auto=format&fit=crop" 
            alt="Privacy Policy" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent"></div>
        </div>
        
        <div className="relative z-10 w-full max-w-[1180px] px-4 mx-auto mt-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex flex-col items-center text-center">
            <h1 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight drop-shadow-md flex items-center gap-4 justify-center">
              Chính Sách Bảo Mật
            </h1>
            <p className="text-base md:text-lg text-slate-200 max-w-2xl drop-shadow-sm font-medium">
              DITRAVEL tôn trọng quyền riêng tư của bạn và cam kết bảo vệ thông tin cá nhân trong quá trình đặt tour, vé và sử dụng dịch vụ.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Quick Trust Cards */}
      <div className="container mx-auto px-4 max-w-[1180px] -mt-12 relative z-20 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100 flex flex-col md:flex-row gap-4 items-center md:items-start text-center md:text-left hover:-translate-y-1 transition-transform">
            <div className="w-12 h-12 bg-blue-50 text-[#0084ff] rounded-xl flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 mb-1 text-base">Bảo vệ thông tin</h3>
              <p className="text-sm text-slate-600 leading-relaxed">Dữ liệu cá nhân được lưu trữ và xử lý an toàn.</p>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100 flex flex-col md:flex-row gap-4 items-center md:items-start text-center md:text-left hover:-translate-y-1 transition-transform">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
              <EyeOff className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 mb-1 text-base">Không bán dữ liệu</h3>
              <p className="text-sm text-slate-600 leading-relaxed">DITRAVEL không bán thông tin khách hàng cho bên thứ ba.</p>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100 flex flex-col md:flex-row gap-4 items-center md:items-start text-center md:text-left hover:-translate-y-1 transition-transform">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-xl flex items-center justify-center shrink-0">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 mb-1 text-base">Minh bạch sử dụng</h3>
              <p className="text-sm text-slate-600 leading-relaxed">Thông tin chỉ dùng để xử lý đơn hàng, hỗ trợ và cải thiện dịch vụ.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="container mx-auto px-4 max-w-[1180px] mb-12 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Card 1: Thu thập */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#e2e8f0] h-full">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-50 text-[#0084ff] rounded-xl flex items-center justify-center shrink-0">
                <Database className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-[#0f172a]">Thông tin chúng tôi thu thập</h2>
            </div>
            <ul className="space-y-3 text-[#64748b] text-base">
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#0084ff] shrink-0"></div>Họ tên</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#0084ff] shrink-0"></div>Số điện thoại</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#0084ff] shrink-0"></div>Email</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#0084ff] shrink-0"></div>Thông tin đơn hàng</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#0084ff] shrink-0"></div>Ngày sử dụng dịch vụ</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#0084ff] shrink-0"></div>Nội dung yêu cầu hỗ trợ</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#0084ff] shrink-0"></div>Thông tin thanh toán cần thiết để đối soát</li>
            </ul>
          </div>

          {/* Card 2: Mục đích */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#e2e8f0] h-full">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-xl flex items-center justify-center shrink-0">
                <Target className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-[#0f172a]">Mục đích sử dụng thông tin</h2>
            </div>
            <ul className="space-y-3 text-[#64748b] text-base">
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0"></div>Xác nhận đơn đặt tour/vé</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0"></div>Gửi voucher hoặc vé điện tử</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0"></div>Hỗ trợ khách hàng</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0"></div>Đối soát thanh toán</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0"></div>Xử lý hoàn/hủy</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0"></div>Cải thiện chất lượng dịch vụ</li>
            </ul>
          </div>

          {/* Card 3: Chia sẻ */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#e2e8f0] md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-orange-50 text-[#ff5b00] rounded-xl flex items-center justify-center shrink-0">
                <Share2 className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-[#0f172a]">Khi nào thông tin được chia sẻ</h2>
            </div>
            <p className="text-[#64748b] mb-4">DITRAVEL chỉ chia sẻ thông tin khi cần thiết với:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-[#64748b]">
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-slate-400" /> Nhà cung cấp tour/vé</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-slate-400" /> Đối tác vận hành dịch vụ</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-slate-400" /> Cổng thanh toán hoặc ngân hàng</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-slate-400" /> Cơ quan có thẩm quyền nếu có yêu cầu hợp pháp</div>
            </div>
            
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 flex items-start gap-3 mt-6">
              <ShieldCheck className="w-6 h-6 text-[#0084ff] shrink-0" />
              <p className="text-blue-900 font-medium text-sm md:text-base">
                <span className="font-bold">Cam kết: </span>DITRAVEL không bán, trao đổi hoặc cho thuê thông tin cá nhân của khách hàng cho bên thứ ba vì mục đích quảng cáo trái phép.
              </p>
            </div>
          </div>

          {/* Card 4: Bảo vệ */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#e2e8f0] h-full">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center shrink-0">
                <Server className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-[#0f172a]">Cách chúng tôi bảo vệ dữ liệu</h2>
            </div>
            <ul className="space-y-3 text-[#64748b] text-base">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-2"></div>
                <span>Kiểm soát quyền truy cập nội bộ hệ thống.</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-2"></div>
                <span>Chỉ nhân sự có trách nhiệm mới được xử lý dữ liệu.</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-2"></div>
                <span>Hạn chế truy cập trái phép bằng tường lửa và mã hóa.</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-2"></div>
                <span>Không lưu trữ thông tin thẻ ngân hàng nhạy cảm nếu không thực sự cần thiết.</span>
              </li>
            </ul>
          </div>

          {/* Card 5: Thời gian lưu trữ */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#e2e8f0] h-full">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-[#0f172a]">Thời gian lưu trữ dữ liệu</h2>
            </div>
            <p className="text-[#64748b] leading-relaxed text-base">
              DITRAVEL lưu trữ thông tin trong thời gian cần thiết để xử lý đơn hàng, chăm sóc khách hàng, đối soát thanh toán và tuân thủ chặt chẽ các quy định pháp luật liên quan đến lưu trữ hồ sơ doanh nghiệp.
            </p>
          </div>
        </div>
      </div>

      {/* Box Quyền Khách Hàng */}
      <div className="container mx-auto px-4 max-w-[1180px] mb-12 relative z-20">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 md:p-10 border border-blue-100 flex flex-col md:flex-row items-center gap-8 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-blue-950 mb-5">Quyền của bạn với dữ liệu cá nhân</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#0084ff] shrink-0" />
                <span className="text-blue-900 font-medium">Yêu cầu xem thông tin cá nhân đã cung cấp</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#0084ff] shrink-0" />
                <span className="text-blue-900 font-medium">Yêu cầu cập nhật thông tin nếu sai sót</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#0084ff] shrink-0" />
                <span className="text-blue-900 font-medium">Yêu cầu khóa hoặc xóa tài khoản</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#0084ff] shrink-0" />
                <span className="text-blue-900 font-medium">Từ chối nhận thông tin khuyến mãi</span>
              </div>
              <div className="flex items-center gap-3 sm:col-span-2">
                <CheckCircle2 className="w-5 h-5 text-[#0084ff] shrink-0" />
                <span className="text-blue-900 font-medium">Liên hệ DITRAVEL khi có thắc mắc về quyền riêng tư</span>
              </div>
            </div>
          </div>
          <div className="shrink-0 w-full md:w-auto mt-4 md:mt-0">
            <Link to="/contact" className="flex items-center justify-center gap-2 bg-[#0084ff] hover:bg-[#0070e0] text-white px-8 py-4 rounded-xl font-bold shadow-md hover:shadow-lg transition-all w-full">
              <ShieldCheck className="w-5 h-5" /> Liên hệ hỗ trợ bảo mật
            </Link>
          </div>
        </div>
      </div>

      {/* CTA Cuối trang */}
      <div className="container mx-auto px-4 max-w-[1180px] relative z-20">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-[#e2e8f0] text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-orange-50 text-[#ff5b00] rounded-2xl flex items-center justify-center mb-6">
            <Phone className="w-8 h-8" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#0f172a] mb-4">Bạn cần hỗ trợ về quyền riêng tư?</h2>
          <p className="text-[#64748b] text-lg max-w-2xl mb-8">
            Nếu bạn có câu hỏi về cách DITRAVEL thu thập, sử dụng hoặc bảo vệ dữ liệu cá nhân, hãy liên hệ với chúng tôi ngay lập tức.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 mb-8">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-lg">
              <Phone className="w-5 h-5 text-[#0084ff]" /> 1900 0000
            </div>
            <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-slate-300"></div>
            <div className="flex items-center gap-2 text-slate-800 font-bold text-lg">
              <Mail className="w-5 h-5 text-[#0084ff]" /> hotro@ditravel.com
            </div>
          </div>

          <Link 
            to="/contact" 
            className="bg-[#ff5b00] hover:bg-[#e05000] text-white px-10 py-4 rounded-xl font-bold text-lg shadow-[0_8px_30px_rgb(255,91,0,0.2)] hover:shadow-[0_8px_30px_rgb(255,91,0,0.3)] transition-all hover:-translate-y-1 w-full sm:w-auto"
          >
            Gửi yêu cầu hỗ trợ
          </Link>
        </div>
      </div>

    </div>
  );
}
