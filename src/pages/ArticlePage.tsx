import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Calendar, User, Facebook, Twitter, Link as LinkIcon, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function ArticlePage() {
  const { id } = useParams();

  return (
    <div className="bg-white min-h-screen pb-20 font-sans">
      <div className="container mx-auto px-2 max-w-[800px] pt-8">
        {/* Breadcrumb */}
        <div className="flex items-center flex-wrap gap-2 text-[13px] text-[#0084ff] mb-8">
          <Link to="/" className="hover:underline">Trang chủ</Link>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <Link to="/blog" className="hover:underline">Cẩm nang du lịch</Link>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <span className="text-slate-500">Kinh nghiệm du lịch Đà Nẵng</span>
        </div>

        <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-8">
            <span className="bg-[#ff5b00] text-white text-[12px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4 inline-block">
              Kinh nghiệm du lịch
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800 leading-tight mb-6">
              Kinh nghiệm du lịch Đà Nẵng tự túc 4 ngày 3 đêm chi tiết nhất
            </h1>
            
            <div className="flex items-center gap-6 text-[14px] text-slate-500 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold">
                  D
                </div>
                <span className="font-medium text-slate-700">DITRAVEL Team</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                15/06/2026
              </div>
            </div>
          </div>

          <div className="prose prose-slate max-w-none prose-img:rounded-xl">
            <p className="text-lg text-slate-600 leading-relaxed mb-6 font-medium">
              Đà Nẵng luôn là điểm đến hấp dẫn với biển xanh, cát trắng và những cây cầu độc đáo. Khám phá ngay lịch trình chi tiết 4 ngày 3 đêm tự túc siêu tiết kiệm dưới đây nhé!
            </p>

            <img 
              src="https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&q=80&w=1200" 
              alt="Cầu Vàng Bà Nà Hills" 
              className="w-full rounded-xl mb-8"
            />

            <h2 className="text-2xl font-bold text-slate-800 mt-10 mb-4">Ngày 1: Khám phá Trung tâm thành phố và Bán đảo Sơn Trà</h2>
            <p className="mb-4 text-slate-700 leading-relaxed">
              Buổi sáng sau khi đáp chuyến bay tới Đà Nẵng, bạn hãy nhận phòng khách sạn và thuê một chiếc xe máy. Điểm đến đầu tiên không thể bỏ qua là Chùa Linh Ứng trên Bán đảo Sơn Trà.
            </p>
            <ul className="list-disc pl-5 mb-6 text-slate-700 space-y-2">
              <li>Viếng Chùa Linh Ứng, ngắm tượng Phật Bà Quan Âm cao nhất Việt Nam</li>
              <li>Check-in tại Đỉnh Bàn Cờ</li>
              <li>Tắm biển Mỹ Khê vào buổi chiều</li>
              <li>Buổi tối thưởng thức hải sản ven biển và xem Cầu Rồng phun lửa (nếu vào cuối tuần)</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-800 mt-10 mb-4">Ngày 2: Quẩy tung Bà Nà Hills</h2>
            <p className="mb-4 text-slate-700 leading-relaxed">
              Dành trọn ngày 2 để khám phá "châu Âu thu nhỏ" Bà Nà Hills. Đừng quên mua vé trước để không phải xếp hàng chờ đợi lâu nhé.
            </p>
            
            {/* Embedded Product Suggestion */}
            <div className="my-8 bg-blue-50 border border-blue-100 rounded-xl p-5 flex flex-col sm:flex-row gap-5 items-center">
              <img src="https://images.unsplash.com/photo-1579224163901-ec061ca97a3a?auto=format&fit=crop&q=80&w=200" alt="Tour Bà Nà" className="w-[120px] h-[80px] rounded-lg object-cover" />
              <div className="flex-1">
                <h3 className="font-bold text-slate-800 text-[16px] mb-1">Tour Bà Nà Hills 1 ngày giá rẻ</h3>
                <p className="text-[13px] text-slate-600 mb-3">Bao gồm xe đưa đón, vé cáp treo và buffet trưa.</p>
                <Link to="/product/1" className="text-[13px] bg-[#0084ff] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#0070d9] transition-colors">
                  Xem chi tiết & Đặt vé
                </Link>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-slate-800 mt-10 mb-4">Ngày 3: Phố cổ Hội An - Nét đẹp thời gian</h2>
            <p className="mb-4 text-slate-700 leading-relaxed">
              Cách Đà Nẵng khoảng 30km, Hội An đẹp nhất là vào buổi chiều tối khi những chiếc đèn lồng được thắp sáng.
            </p>

            <h2 className="text-2xl font-bold text-slate-800 mt-10 mb-4">Ngày 4: Mua sắm đặc sản và Tạm biệt</h2>
            <p className="mb-8 text-slate-700 leading-relaxed">
              Ghé chợ Cồn hoặc chợ Hàn để thưởng thức các món ăn vặt và mua chả bò, mực rim me về làm quà cho người thân.
            </p>
          </div>

          <div className="mt-10 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="font-medium text-slate-800">Chia sẻ bài viết này:</div>
            <div className="flex gap-2">
              <button className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 rounded-full bg-sky-100 text-sky-500 flex items-center justify-center hover:bg-sky-500 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-600 hover:text-white transition-colors">
                <LinkIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.article>
      </div>
    </div>
  );
}
