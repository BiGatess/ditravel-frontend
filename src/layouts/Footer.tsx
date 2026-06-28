import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Plane } from 'lucide-react';

export default function Footer() {
  return (
    <>
      {/* Quick Links section before footer */}
      <div className="bg-white py-6 border-t border-slate-200">
        <div className="container mx-auto max-w-[1300px] px-2 grid grid-cols-2 md:grid-cols-4 gap-5">
          <div>
            <h4 className="font-bold text-slate-800 mb-4 text-sm">Du lịch tự túc trong nước</h4>
            <ul className="space-y-2 text-sm text-[#0084ff]">
              <li><Link to="#" className="hover:underline">Du lịch Đà Nẵng</Link></li>
              <li><Link to="#" className="hover:underline">Du lịch Phú Quốc</Link></li>
              <li><Link to="#" className="hover:underline">Du lịch Đà Lạt</Link></li>
              <li><Link to="#" className="hover:underline">Du lịch Nha Trang</Link></li>
              <li><Link to="#" className="hover:underline">Du lịch Sapa</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-800 mb-4 text-sm">Điểm đến yêu thích</h4>
            <ul className="space-y-2 text-sm text-[#0084ff]">
              <li><Link to="#" className="hover:underline">Du lịch Vũng Tàu Tự túc</Link></li>
              <li><Link to="#" className="hover:underline">Du lịch Hội An</Link></li>
              <li><Link to="#" className="hover:underline">Khám phá Hạ Long</Link></li>
              <li><Link to="#" className="hover:underline">Du lịch Ninh Bình</Link></li>
              <li><Link to="#" className="hover:underline">Bà Nà Hills</Link></li>
              <li><Link to="#" className="hover:underline">VinWonders Phú Quốc</Link></li>
              <li><Link to="#" className="hover:underline">Địa đạo Củ Chi</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-800 mb-4 text-sm">Vé đặt nhiều</h4>
            <ul className="space-y-2 text-sm text-[#0084ff]">
              <li><Link to="#" className="hover:underline">Cáp treo Fansipan Sapa</Link></li>
              <li><Link to="#" className="hover:underline">Vé Sun World Bà Nà Hills</Link></li>
              <li><Link to="#" className="hover:underline">Vé VinWonders Nha Trang</Link></li>
              <li><Link to="#" className="hover:underline">Ký Ức Hội An</Link></li>
              <li><Link to="#" className="hover:underline">Tour 4 đảo Nha Trang</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-800 mb-4 text-sm">Cẩm nang Du lịch từ A - Z</h4>
            <ul className="space-y-2 text-sm text-[#0084ff]">
              <li><Link to="/blog" className="hover:underline">Kinh nghiệm Du lịch Đà Nẵng</Link></li>
              <li><Link to="/blog" className="hover:underline">Kinh nghiệm Du lịch Phú Quốc</Link></li>
              <li><Link to="/blog" className="hover:underline">Kinh nghiệm Du lịch Đà Lạt</Link></li>
              <li><Link to="/blog" className="hover:underline">Kinh nghiệm Du lịch Nha Trang</Link></li>
              <li><Link to="/blog" className="hover:underline">Kinh nghiệm Du lịch Sapa</Link></li>
              <li><Link to="/blog" className="hover:underline">Kinh nghiệm Du lịch Miền Tây</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Dark Footer */}
      <footer className="bg-[#242424] text-slate-400 py-6 text-sm">
        <div className="container mx-auto max-w-[1300px] px-2 grid grid-cols-1 lg:grid-cols-4 gap-5">
          <div className="lg:col-span-1 pr-4">
            <div className="text-[#ff5b00] font-black text-3xl tracking-tighter lowercase flex items-center gap-1 mb-4">
              <Plane className="w-8 h-8 fill-current" />
              ditravel
            </div>
            <p className="mb-6 text-[13px] leading-relaxed">
              Ditravel.com là website cung cấp dịch vụ đặt Vé tham quan - Tour - Show diễn và các hoạt động du lịch đặc sắc nhất tại các điểm đến du lịch phổ biến nhất Châu Á dành cho du khách du lịch tự túc.
            </p>
            {/* <div className="mb-2 uppercase text-[11px] font-bold text-slate-500">HỖ TRỢ THANH TOÁN</div>
            <div className="flex gap-2 flex-wrap">
              <div className="bg-white p-1 rounded"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Visa_Logo.svg/1024px-Visa_Logo.svg.png" alt="Visa" className="h-4 object-contain w-auto" /></div>
              <div className="bg-white p-1 rounded"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/MasterCard_Logo.svg/1024px-MasterCard_Logo.svg.png" alt="MasterCard" className="h-4 object-contain w-auto" /></div>
            </div> */}
          </div>
          
          <div>
            <h3 className="font-bold text-white mb-4 uppercase text-[13px] tracking-wider">VỀ DITRAVEL</h3>
            <ul className="space-y-2 text-[13px]">
              <li><Link to="/about" className="hover:text-white transition-colors">Về DITRAVEL</Link></li>
              <li><Link to="/blog" className="hover:text-white transition-colors">Blog DITRAVEL</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Chính sách bảo mật</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Điều khoản sử dụng</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Liên hệ</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-white mb-4 uppercase text-[13px] tracking-wider">HỖ TRỢ</h3>
            <ul className="space-y-2 text-[13px]">
              <li><Link to="#" className="hover:text-white transition-colors">Câu hỏi thường gặp</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Chính sách cam kết giá tốt nhất</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Hướng dẫn thanh toán</Link></li>
            </ul>
            <h3 className="font-bold text-white mt-6 mb-4 uppercase text-[13px] tracking-wider">KẾT NỐI DITRAVEL</h3>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center hover:bg-[#ff5b00] cursor-pointer transition-colors text-white font-bold">f</div>
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center hover:bg-white hover:text-red-500 cursor-pointer transition-colors font-bold text-white">G+</div>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-white mb-4 uppercase text-[13px] tracking-wider">BẠN CẦN DITRAVEL TƯ VẤN?</h3>
            <div className="text-[#00d084] font-bold text-2xl flex items-center gap-2 mb-4">
              <Phone className="w-5 h-5" /> 1900 0000
            </div>
            <p className="text-[12px]">
              Hoặc gửi email về địa chỉ <a href="mailto:hotro@ditravel.com" className="text-white hover:underline">hotro@ditravel.com</a> DITRAVEL sẽ phản hồi trong vòng 24h.
            </p>
          </div>
        </div>
        
        <div className="container mx-auto max-w-[1300px] px-2 mt-8 pt-8 border-t border-slate-700 text-center text-[12px]">
          {/* <p className="mb-2">CÔNG TY TNHH DITRAVEL - Giấy phép kinh doanh số 0312971769</p>
          <p className="mb-4">11A Hồng Hà, Phường 2, Quận Tân Bình, Thành phố Hồ Chí Minh, Việt Nam</p> */}
          {/* <div className="flex justify-center mb-2">
            <img src="https://images.dmca.com/Badges/dmca_protected_sml_120n.png?ID=71e8609a-eb39-44d3-832f-4e6f4cecf133" alt="DMCA" className="h-8 opacity-70" />
          </div>
          <p className="opacity-50">Powered by nopCommerce</p> */}
        </div>
      </footer>
    </>
  );
}
